use rusqlite::Connection;
use std::path::PathBuf;
use tauri::Manager;

/// Initialize the SQLite database. Creates tables on first run.
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
        "CREATE TABLE IF NOT EXISTS dishes (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            image TEXT NOT NULL DEFAULT '',
            category TEXT NOT NULL DEFAULT 'hot',
            discount REAL NOT NULL DEFAULT 1.0
        );",
    )?;

    Ok(conn)
}

/// Resolve the app data directory from Tauri.
fn app_data_dir(app: &tauri::App) -> Result<PathBuf, Box<dyn std::error::Error>> {
    Ok(app.path().app_data_dir()?)
}
