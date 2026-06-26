mod commands;
mod db;
mod models;

use commands::AppState;
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            // Initialize the database
            let conn = db::init_db(app).expect("Failed to initialize database");

            // Store the connection in managed state
            app.manage(AppState::new(conn));

            // Enable logging in debug builds
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::get_dishes,
            commands::create_dish,
            commands::update_dish,
            commands::delete_dish,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
