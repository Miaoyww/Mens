use crate::db;
use crate::models::*;
use rusqlite::params;
use std::sync::Mutex;
use tauri::State;
use uuid::Uuid;

/// Shared application state held by Tauri.
pub struct AppState {
    pub db: Mutex<rusqlite::Connection>,
    pub current_user: Mutex<Option<AuthUser>>,
}

impl AppState {
    pub fn new(conn: rusqlite::Connection) -> Self {
        Self {
            db: Mutex::new(conn),
            current_user: Mutex::new(None),
        }
    }
}

// ── Auth commands ──────────────────────────────────────────────────────────

#[tauri::command]
pub fn check_auth(state: State<AppState>) -> Result<Option<AuthUser>, String> {
    let user = state
        .current_user
        .lock()
        .map_err(|e| format!("Lock error: {}", e))?;
    Ok(user.clone())
}

#[tauri::command]
pub fn login(
    state: State<AppState>,
    username: String,
    password: String,
) -> Result<AuthUser, String> {
    let hash = db::sha256_hex(&password);
    let db = state.db.lock().map_err(|e| format!("Lock error: {}", e))?;

    let user: Option<AuthUser> = db
        .query_row(
            "SELECT username, role FROM users WHERE username = ?1 AND password_sha256 = ?2",
            params![username, hash],
            |row| {
                Ok(AuthUser {
                    username: row.get(0)?,
                    role: row.get(1)?,
                })
            },
        )
        .ok();

    match user {
        Some(u) => {
            let mut current = state
                .current_user
                .lock()
                .map_err(|e| format!("Lock error: {}", e))?;
            *current = Some(u.clone());
            log::info!("User '{}' logged in", u.username);
            Ok(u)
        }
        None => Err("用户名或密码错误".into()),
    }
}

#[tauri::command]
pub fn logout(state: State<AppState>) -> Result<(), String> {
    let mut user = state
        .current_user
        .lock()
        .map_err(|e| format!("Lock error: {}", e))?;
    *user = None;
    log::info!("User logged out");
    Ok(())
}

#[tauri::command]
pub fn setup_admin(
    state: State<AppState>,
    username: String,
    password: String,
) -> Result<AuthUser, String> {
    let db = state.db.lock().map_err(|e| format!("Lock error: {}", e))?;

    // Only allow setup if no users exist
    let count: i64 = db
        .query_row("SELECT COUNT(*) FROM users", [], |r| r.get(0))
        .map_err(|e| e.to_string())?;

    if count > 0 {
        return Err("系统已初始化，不能重复设置管理员".into());
    }

    let hash = db::sha256_hex(&password);
    db.execute(
        "INSERT INTO users (username, password_sha256, role) VALUES (?1, ?2, 'admin')",
        params![username, hash],
    )
    .map_err(|e| {
        if e.to_string().contains("UNIQUE") {
            format!("用户名 '{}' 已存在", username)
        } else {
            e.to_string()
        }
    })?;

    let user = AuthUser {
        username,
        role: "admin".into(),
    };

    let mut current = state
        .current_user
        .lock()
        .map_err(|e| format!("Lock error: {}", e))?;
    *current = Some(user.clone());

    log::info!("Admin '{}' created via setup", user.username);
    Ok(user)
}

// ── Dish commands ──────────────────────────────────────────────────────────

#[tauri::command]
pub fn get_dishes(
    state: State<AppState>,
    category: Option<String>,
) -> Result<Vec<Dish>, String> {
    let db = state.db.lock().map_err(|e| format!("Lock error: {}", e))?;

    let dishes = if let Some(cat) = category {
        let mut stmt = db
            .prepare("SELECT id, name, price, image, discount, category FROM dishes WHERE category = ?1 ORDER BY name")
            .map_err(|e| e.to_string())?;
        let rows: Vec<Dish> = stmt
            .query_map(params![cat], map_dish)
            .map_err(|e| e.to_string())?
            .collect::<Result<Vec<_>, _>>()
            .map_err(|e| e.to_string())?;
        rows
    } else {
        let mut stmt = db
            .prepare("SELECT id, name, price, image, discount, category FROM dishes ORDER BY name")
            .map_err(|e| e.to_string())?;
        let rows: Vec<Dish> = stmt
            .query_map([], map_dish)
            .map_err(|e| e.to_string())?
            .collect::<Result<Vec<_>, _>>()
            .map_err(|e| e.to_string())?;
        rows
    };

    Ok(dishes)
}

#[tauri::command]
pub fn create_dish(
    state: State<AppState>,
    input: DishCreate,
) -> Result<Dish, String> {
    require_admin(&state)?;

    let price = input.parse_price()?;
    let id = Uuid::new_v4().to_string();

    let db = state.db.lock().map_err(|e| format!("Lock error: {}", e))?;
    db.execute(
        "INSERT INTO dishes (id, name, price, image, category, discount) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        params![id, input.name, price, input.image, input.category, input.discount],
    )
    .map_err(|e| e.to_string())?;

    let dish = Dish {
        id,
        name: input.name,
        price,
        image: input.image,
        discount: input.discount,
        category: input.category,
    };

    log::info!("Dish '{}' created", dish.name);
    Ok(dish)
}

#[tauri::command]
pub fn update_dish(
    state: State<AppState>,
    id: String,
    input: DishUpdate,
) -> Result<Dish, String> {
    require_admin(&state)?;

    let db = state.db.lock().map_err(|e| format!("Lock error: {}", e))?;

    // Fetch the existing dish
    let existing = db
        .query_row(
            "SELECT id, name, price, image, discount, category FROM dishes WHERE id = ?1",
            params![id],
            map_dish,
        )
        .map_err(|_| format!("菜品不存在: {}", id))?;

    // Extract fields from input before partial move
    let input_price = input.parse_price();
    let name = input.name.unwrap_or(existing.name);
    let image = input.image.unwrap_or(existing.image);
    let category = input.category.unwrap_or(existing.category);
    let discount = input.discount.unwrap_or(existing.discount);
    let price = match input_price {
        Some(Ok(p)) => p,
        Some(Err(e)) => return Err(e),
        None => existing.price,
    };

    db.execute(
        "UPDATE dishes SET name = ?1, price = ?2, image = ?3, category = ?4, discount = ?5 WHERE id = ?6",
        params![name, price, image, category, discount, id],
    )
    .map_err(|e| e.to_string())?;

    let dish = Dish {
        id,
        name,
        price,
        image,
        discount,
        category,
    };

    log::info!("Dish '{}' updated", dish.name);
    Ok(dish)
}

#[tauri::command]
pub fn delete_dish(state: State<AppState>, id: String) -> Result<(), String> {
    require_admin(&state)?;

    let db = state.db.lock().map_err(|e| format!("Lock error: {}", e))?;
    let affected = db
        .execute("DELETE FROM dishes WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;

    if affected == 0 {
        return Err(format!("菜品不存在: {}", id));
    }

    log::info!("Dish '{}' deleted", id);
    Ok(())
}

// ── Helpers ────────────────────────────────────────────────────────────────

fn map_dish(row: &rusqlite::Row<'_>) -> rusqlite::Result<Dish> {
    Ok(Dish {
        id: row.get(0)?,
        name: row.get(1)?,
        price: row.get(2)?,
        image: row.get(3)?,
        discount: row.get(4)?,
        category: row.get(5)?,
    })
}

fn require_admin(state: &State<AppState>) -> Result<(), String> {
    let user = state
        .current_user
        .lock()
        .map_err(|e| format!("Lock error: {}", e))?;
    match user.as_ref() {
        Some(u) if u.role == "admin" => Ok(()),
        Some(_) => Err("需要管理员权限".into()),
        None => Err("请先登录".into()),
    }
}
