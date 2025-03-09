use tauri_plugin_sql::{ Migration, MigrationKind };

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![
        // Define your migrations here
        Migration {
            version: 1,
            description: "create_initial_tables",
            sql: "
            CREATE TABLE users (
                id INTEGER PRIMARY KEY,
                email TEXT NOT NULL UNIQUE,
                name TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                updated_at TEXT NOT NULL DEFAULT (datetime('now'))
            );

            CREATE TABLE time_entries (
                id INTEGER PRIMARY KEY,
                user_id INTEGER NOT NULL,
                task_name TEXT NOT NULL,
                note TEXT,
                start_time TEXT NOT NULL,
                end_time TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                updated_at TEXT NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 1,
            description: "create_initial_tables",
            sql: "DROP TABLE users, time_entries;",
            kind: MigrationKind::Down,
        },
        Migration {
            version: 2,
            description: "make_end_time_nullable",
            sql: "
            -- Save existing data
            CREATE TABLE time_entries_backup (
                id INTEGER PRIMARY KEY,
                user_id INTEGER NOT NULL,
                task_name TEXT NOT NULL,
                note TEXT,
                start_time TEXT NOT NULL,
                end_time TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                updated_at TEXT NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY (user_id) REFERENCES users(id)
            );

            INSERT INTO time_entries_backup SELECT * FROM time_entries;

            -- Drop existing table
            DROP TABLE time_entries;

            -- Recreate table with nullable end_time
            CREATE TABLE time_entries (
                id INTEGER PRIMARY KEY,
                user_id INTEGER NOT NULL,
                task_name TEXT NOT NULL,
                note TEXT,
                start_time TEXT NOT NULL,
                end_time TEXT,
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                updated_at TEXT NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY (user_id) REFERENCES users(id)
            );

            -- Restore data
            INSERT INTO time_entries SELECT * FROM time_entries_backup;

            -- Drop backup table
            DROP TABLE time_entries_backup;
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "make_end_time_nullable",
            sql: "
            -- Save existing data
            CREATE TABLE time_entries_backup (
                id INTEGER PRIMARY KEY,
                user_id INTEGER NOT NULL,
                task_name TEXT NOT NULL,
                note TEXT,
                start_time TEXT NOT NULL,
                end_time TEXT,
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                updated_at TEXT NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY (user_id) REFERENCES users(id)
            );

            INSERT INTO time_entries_backup SELECT * FROM time_entries;

            -- Drop existing table
            DROP TABLE time_entries;

            -- Recreate table with NOT NULL end_time
            CREATE TABLE time_entries (
                id INTEGER PRIMARY KEY,
                user_id INTEGER NOT NULL,
                task_name TEXT NOT NULL,
                note TEXT,
                start_time TEXT NOT NULL,
                end_time TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                updated_at TEXT NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY (user_id) REFERENCES users(id)
            );

            -- Restore data (this will fail if any end_time is NULL)
            INSERT INTO time_entries SELECT * FROM time_entries_backup;

            -- Drop backup table
            DROP TABLE time_entries_backup;
            ",
            kind: MigrationKind::Down,
        }
    ];

    tauri::Builder
        ::default()
        .plugin(
            tauri_plugin_sql::Builder
                ::default()
                .add_migrations("sqlite:mydatabase.db", migrations)
                .build()
        )
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
