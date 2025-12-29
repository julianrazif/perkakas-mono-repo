#[cfg_attr(mobile, tauri::mobile_entry_point)]

use tauri::command;

#[command]
fn get_app_info() -> String {
    "Perkakas Desktop v1.0.0".to_string()
}

#[command]
fn greet(name: String) -> String {
    format!("Hello {}", name)
}

pub fn run() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      get_app_info,
      greet
    ])
    .plugin(tauri_plugin_shell::init())
    .plugin(tauri_plugin_store::Builder::default().build())
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
