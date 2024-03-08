CREATE TABLE users (
    internal_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    clerk_id TEXT NOT NULL UNIQUE,
    email TEXT,
    username TEXT,
    first_name TEXT,
    last_name TEXT,
    phone_number TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active_ip TEXT,
    profile_image_url TEXT
);
