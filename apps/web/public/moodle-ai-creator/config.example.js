/**
 * Plantilla de Configuración Local para Hostinger (config.example.js)
 * IMPORTANTE: Para producción en Hostinger estático, copiá este archivo como
 * "config.local.js" (que está ignorado en .gitignore para no subirse a GitHub).
 * Nota: Nunca pongas claves privadas (como GEMINI_API_KEY o MP_ACCESS_TOKEN) en este archivo
 * público; usá únicamente la URL y ANON_KEY pública de Supabase (protegida con RLS)
 * y los links públicos de suscripción de Mercado Pago.
 */
window.__MOODLEAI_CONFIG__ = {
  SUPABASE_URL: "",
  SUPABASE_ANON_KEY: "",
  MP_LINK_PLAN_PRO: "",
  MP_LINK_PLAN_INSTITUCIONAL: ""
};
