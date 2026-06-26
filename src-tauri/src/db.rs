use rusqlite::Connection;
use sha2::{Digest, Sha256};
use std::path::PathBuf;
use tauri::Manager;

/// Initialize the SQLite database. Creates tables on first run and
/// seeds a default admin user if the users table is empty.
pub fn init_db(app: &tauri::App) -> Result<Connection, Box<dyn std::error::Error>> {
    let app_dir = app_data_dir(app)?;
    std::fs::create_dir_all(&app_dir)?;
    let db_path = app_dir.join("mens.db");

    log::info!("Opening database at {:?}", db_path);

    let conn = Connection::open(&db_path)?;

    // Enable WAL mode for better concurrent reads
    conn.execute_batch("PRAGMA journal_mode=WAL;")?;

    // Create tables
    conn.execute_batch(
        "CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_sha256 TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'user'
        );

        CREATE TABLE IF NOT EXISTS dishes (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            image TEXT NOT NULL DEFAULT '',
            category TEXT NOT NULL DEFAULT 'hot',
            discount REAL NOT NULL DEFAULT 1.0
        );",
    )?;

    // Create default admin if no users exist
    let count: i64 = conn.query_row("SELECT COUNT(*) FROM users", [], |r| r.get(0))?;
    if count == 0 {
        let password = generate_random_password(8);
        let hash = sha256_hex(&password);

        conn.execute(
            "INSERT INTO users (username, password_sha256, role) VALUES (?1, ?2, 'admin')",
            rusqlite::params!["admin", hash],
        )?;

        println!(
            "========================================\n\
               Default admin created!\n\
               Username: admin\n\
               Password: {}\n\
             ========================================",
            password
        );
        log::info!("Default admin user created. Password printed to console.");
    }

    Ok(conn)
}

/// Generate a random alphanumeric password of the given length.
fn generate_random_password(len: usize) -> String {
    use std::time::{SystemTime, UNIX_EPOCH};
    let seed = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .subsec_nanos();
    let chars: Vec<char> = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
        .chars()
        .collect();
    let mut result = String::with_capacity(len);
    let mut s = seed;
    for _ in 0..len {
        s = s.wrapping_mul(1103515245).wrapping_add(12345);
        result.push(chars[(s as usize) % chars.len()]);
    }
    result
}

/// Compute SHA-256 hex digest of a string.
pub fn sha256_hex(input: &str) -> String {
    let hash = Sha256::digest(input.as_bytes());
    hash.iter().map(|b| format!("{:02x}", b)).collect()
}

/// Resolve the app data directory from Tauri.
fn app_data_dir(app: &tauri::App) -> Result<PathBuf, Box<dyn std::error::Error>> {
    Ok(app.path().app_data_dir()?)
}
