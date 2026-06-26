use crate::models::*;
use rusqlite::params;
use std::sync::Mutex;
use tauri::State;
use uuid::Uuid;

/// Shared application state held by Tauri.
pub struct AppState {
    pub db: Mutex<rusqlite::Connection>,
}

impl AppState {
    pub fn new(conn: rusqlite::Connection) -> Self {
        Self {
            db: Mutex::new(conn),
        }
    }
}

// ── Dish commands ──────────────────────────────────────────────────────────

#[tauri::command]
pub fn get_dishes(state: State<AppState>, category: Option<String>) -> Result<Vec<Dish>, String> {
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
pub fn create_dish(state: State<AppState>, input: DishCreate) -> Result<Dish, String> {
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
pub fn update_dish(state: State<AppState>, id: String, input: DishUpdate) -> Result<Dish, String> {
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
