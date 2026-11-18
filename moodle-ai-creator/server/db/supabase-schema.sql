-- ============================================================================
-- MoodleAI Creator — Esquema "Subproyecto" para el Supabase de ClaseIAXpress
-- ============================================================================
-- DISEÑADO PARA CONVIVIR 100% SEGURO DENTRO DEL PROYECTO SUPABASE DE CLASEIAXPRESS:
-- 1. Todas las tablas usan el prefijo exclusivo "moodleai_" para NO tocar ni
--    pisar ninguna tabla, función ni política existente de ClaseIAXpress.
-- 2. Aprovecha el mismo login (auth.users): un docente registrado en ClaseIAXpress
--    puede iniciar sesión en MoodleAI Creator con su mismo correo y contraseña.
-- 3. Incluye migración automática para que los usuarios que ya existen hoy en
--    ClaseIAXpress tengan su perfil inicial gratuito creado en moodleai_profiles.
-- ============================================================================

-- 1. Tabla de Planes Comerciales de MoodleAI Creator en Pesos Argentinos (ARS)
CREATE TABLE IF NOT EXISTS public.moodleai_plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    monthly_generation_limit INTEGER NOT NULL,
    price_ars INTEGER NOT NULL DEFAULT 0,
    price_display TEXT NOT NULL,
    allow_shared_library BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.moodleai_plans (id, name, description, monthly_generation_limit, price_ars, price_display, allow_shared_library)
VALUES
  ('free', 'Plan Gratuito', 'Ideal para conocer la plataforma y crear hasta 3 actividades o evaluaciones por mes con exportación a Moodle.', 3, 0, 'Gratis ($0 ARS / mes)', FALSE),
  ('pro', 'Plan Docente Profesional', 'Generación ampliada (150/mes), biblioteca personal completa y exportaciones avanzadas (Moodle XML, GIFT, SCORM 1.2/2004 y H5P).', 150, 25000, '$25.000 ARS / mes', FALSE),
  ('institutional', 'Plan Institucional', 'Para colegios, universidades e institutos. Gestión de usuarios, recursos compartidos y administración centralizada (1000/mes).', 1000, 50000, '$50.000 ARS / mes', TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  monthly_generation_limit = EXCLUDED.monthly_generation_limit,
  price_ars = EXCLUDED.price_ars,
  price_display = EXCLUDED.price_display;

-- 2. Tabla de Perfiles Docentes de MoodleAI Creator (aislada de profiles de ClaseIAXpress)
CREATE TABLE IF NOT EXISTS public.moodleai_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'teacher',
    institution TEXT DEFAULT '',
    education_level TEXT DEFAULT 'Secundaria',
    subject_specialty TEXT DEFAULT '',
    bio TEXT DEFAULT '',
    avatar_initials TEXT DEFAULT 'DC',
    plan_id TEXT NOT NULL DEFAULT 'free' REFERENCES public.moodleai_plans(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger independiente (no pisa ningún trigger de ClaseIAXpress)
CREATE OR REPLACE FUNCTION public.handle_new_moodleai_subproject_user()
RETURNS TRIGGER AS $$
DECLARE
  raw_name TEXT;
  initials TEXT;
BEGIN
  raw_name := COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));
  initials := UPPER(LEFT(raw_name, 2));
  INSERT INTO public.moodleai_profiles (
    id, name, email, institution, education_level, subject_specialty, avatar_initials, plan_id
  ) VALUES (
    NEW.id,
    raw_name,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'institution', ''),
    COALESCE(NEW.raw_user_meta_data->>'education_level', 'Secundaria'),
    COALESCE(NEW.raw_user_meta_data->>'subject_specialty', ''),
    initials,
    'free'
  ) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_moodleai_subproject ON auth.users;
CREATE TRIGGER on_auth_user_created_moodleai_subproject
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_moodleai_subproject_user();

-- Habilitar automáticamente a los docentes que YA estaban registrados en ClaseIAXpress
INSERT INTO public.moodleai_profiles (id, name, email, avatar_initials, plan_id)
SELECT
  u.id,
  COALESCE(u.raw_user_meta_data->>'name', u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
  u.email,
  UPPER(LEFT(COALESCE(u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)), 2)),
  'free'
FROM auth.users u
ON CONFLICT (id) DO NOTHING;

-- 3. Tabla de Actividades y Evaluaciones de MoodleAI Creator (Biblioteca Personal)
CREATE TABLE IF NOT EXISTS public.moodleai_activities (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.moodleai_profiles(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    education_level TEXT NOT NULL,
    student_age TEXT NOT NULL,
    topic TEXT NOT NULL,
    learning_objective TEXT NOT NULL,
    estimated_duration INTEGER NOT NULL DEFAULT 30,
    difficulty TEXT NOT NULL DEFAULT 'Intermedio',
    activity_type TEXT NOT NULL,
    is_evaluation BOOLEAN NOT NULL DEFAULT FALSE,
    question_count INTEGER NOT NULL DEFAULT 5,
    points_per_question NUMERIC NOT NULL DEFAULT 2.0,
    time_limit_minutes INTEGER NOT NULL DEFAULT 30,
    allowed_attempts INTEGER NOT NULL DEFAULT 2,
    auto_grading BOOLEAN NOT NULL DEFAULT TRUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    student_instructions TEXT NOT NULL,
    pedagogical JSONB NOT NULL DEFAULT '{}'::jsonb,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
    tags TEXT DEFAULT '',
    export_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Tabla de Historial de Uso y Control de Cuota Mensual de MoodleAI Creator
CREATE TABLE IF NOT EXISTS public.moodleai_usage_logs (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.moodleai_profiles(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    activity_id TEXT,
    month_key TEXT NOT NULL,
    ai_provider TEXT DEFAULT 'gemini',
    details TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Tabla de Pagos y Suscripciones con Mercado Pago en ARS de MoodleAI Creator
CREATE TABLE IF NOT EXISTS public.moodleai_payments (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.moodleai_profiles(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL REFERENCES public.moodleai_plans(id),
    amount_ars INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'ARS',
    mp_preference_id TEXT,
    mp_payment_id TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    payment_mode TEXT NOT NULL DEFAULT 'checkout_pro',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- POLÍTICAS DE SEGURIDAD ROW LEVEL SECURITY (RLS) AISLADAS
-- ============================================================================
ALTER TABLE public.moodleai_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moodleai_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moodleai_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moodleai_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moodleai_payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "moodleai_planes_visibles" ON public.moodleai_plans;
CREATE POLICY "moodleai_planes_visibles" ON public.moodleai_plans FOR SELECT USING (true);

DROP POLICY IF EXISTS "moodleai_ver_propio_perfil" ON public.moodleai_profiles;
CREATE POLICY "moodleai_ver_propio_perfil" ON public.moodleai_profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "moodleai_editar_propio_perfil" ON public.moodleai_profiles;
CREATE POLICY "moodleai_editar_propio_perfil" ON public.moodleai_profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "moodleai_crear_propio_perfil" ON public.moodleai_profiles;
CREATE POLICY "moodleai_crear_propio_perfil" ON public.moodleai_profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "moodleai_ver_propias_actividades" ON public.moodleai_activities;
CREATE POLICY "moodleai_ver_propias_actividades" ON public.moodleai_activities FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "moodleai_crear_propias_actividades" ON public.moodleai_activities;
CREATE POLICY "moodleai_crear_propias_actividades" ON public.moodleai_activities FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "moodleai_editar_propias_actividades" ON public.moodleai_activities;
CREATE POLICY "moodleai_editar_propias_actividades" ON public.moodleai_activities FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "moodleai_borrar_propias_actividades" ON public.moodleai_activities;
CREATE POLICY "moodleai_borrar_propias_actividades" ON public.moodleai_activities FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "moodleai_ver_propio_uso" ON public.moodleai_usage_logs;
CREATE POLICY "moodleai_ver_propio_uso" ON public.moodleai_usage_logs FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "moodleai_crear_propio_uso" ON public.moodleai_usage_logs;
CREATE POLICY "moodleai_crear_propio_uso" ON public.moodleai_usage_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "moodleai_ver_propios_pagos" ON public.moodleai_payments;
CREATE POLICY "moodleai_ver_propios_pagos" ON public.moodleai_payments FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "moodleai_crear_propios_pagos" ON public.moodleai_payments;
CREATE POLICY "moodleai_crear_propios_pagos" ON public.moodleai_payments FOR INSERT WITH CHECK (auth.uid() = user_id);
