-- ============================================================================
-- MoodleAI Creator — Esquema Relacional de Base de Datos (SQLite)
-- Incluye Planes en Pesos Argentinos (ARS) y Pasarela de Pagos Mercado Pago
-- ============================================================================

PRAGMA foreign_keys = ON;

-- 1. Tabla de Planes Comerciales en Pesos Argentinos (Módulo 7)
CREATE TABLE IF NOT EXISTS plans (
    id TEXT PRIMARY KEY,                    -- 'free' | 'pro' | 'institutional'
    name TEXT NOT NULL,                     -- Nombre visible del plan
    description TEXT NOT NULL,
    monthly_generation_limit INTEGER NOT NULL, -- 3 para Free, 150 para Pro, 1000 para Institucional
    price_ars INTEGER NOT NULL DEFAULT 0,   -- 0 | 25000 | 50000
    allow_h5p_export INTEGER NOT NULL DEFAULT 1,
    allow_scorm_export INTEGER NOT NULL DEFAULT 1,
    allow_moodle_native INTEGER NOT NULL DEFAULT 1,
    allow_personal_library INTEGER NOT NULL DEFAULT 1,
    allow_shared_library INTEGER NOT NULL DEFAULT 0,
    price_display TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 2. Tabla de Usuarios / Docentes (Módulos 1 y 7)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'teacher',
    institution TEXT DEFAULT '',
    education_level TEXT DEFAULT 'Secundaria',
    subject_specialty TEXT DEFAULT '',
    bio TEXT DEFAULT '',
    avatar_initials TEXT DEFAULT 'DC',
    plan_id TEXT NOT NULL DEFAULT 'free',
    auth_provider TEXT NOT NULL DEFAULT 'local', -- 'local' | 'supabase'
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (plan_id) REFERENCES plans(id)
);

-- 3. Tabla de Sesiones Seguras (Módulos 7 y 9)
CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Tabla de Actividades y Evaluaciones (Módulos 2, 3, 5 y 6)
CREATE TABLE IF NOT EXISTS activities (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    subject TEXT NOT NULL,
    education_level TEXT NOT NULL,
    student_age TEXT NOT NULL,
    topic TEXT NOT NULL,
    learning_objective TEXT NOT NULL,
    estimated_duration INTEGER NOT NULL DEFAULT 30,
    difficulty TEXT NOT NULL DEFAULT 'Intermedio',
    activity_type TEXT NOT NULL,
    is_evaluation INTEGER NOT NULL DEFAULT 0,
    question_count INTEGER NOT NULL DEFAULT 5,
    points_per_question REAL NOT NULL DEFAULT 2.0,
    time_limit_minutes INTEGER NOT NULL DEFAULT 30,
    allowed_attempts INTEGER NOT NULL DEFAULT 2,
    auto_grading INTEGER NOT NULL DEFAULT 1,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    student_instructions TEXT NOT NULL,
    pedagogical_json TEXT NOT NULL,
    content_json TEXT NOT NULL,
    is_favorite INTEGER NOT NULL DEFAULT 0,
    tags TEXT DEFAULT '',
    export_count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Tabla de Historial de Uso y Control de Límites Mensuales (Módulo 7)
CREATE TABLE IF NOT EXISTS usage_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    action_type TEXT NOT NULL,
    activity_id TEXT,
    month_key TEXT NOT NULL,
    ai_provider TEXT DEFAULT 'gemini',
    details TEXT DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Tabla de Historial de Exportaciones Moodle (Módulo 4)
CREATE TABLE IF NOT EXISTS export_history (
    id TEXT PRIMARY KEY,
    activity_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    export_format TEXT NOT NULL,
    file_name TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. Tabla de Pagos y Suscripciones con Mercado Pago en ARS (Módulo 7)
CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    plan_id TEXT NOT NULL,
    amount_ars INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'ARS',
    mp_preference_id TEXT DEFAULT '',
    mp_payment_id TEXT DEFAULT '',
    payment_mode TEXT NOT NULL DEFAULT 'checkout_pro', -- 'checkout_pro' | 'direct_link'
    status TEXT NOT NULL DEFAULT 'pending',            -- 'pending' | 'approved' | 'rejected'
    checkout_url TEXT DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES plans(id)
);

CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_subject ON activities(subject);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_usage_user_month ON usage_logs(user_id, month_key, action_type);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
