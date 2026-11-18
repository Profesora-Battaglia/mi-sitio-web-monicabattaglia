import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env');
  if (!fs.existsSync(envPath)) return;

  const content = fs.readFileSync(envPath, 'utf-8');
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eqIdx = line.indexOf('=');
    if (eqIdx === -1) continue;
    const key = line.slice(0, eqIdx).trim();
    let val = line.slice(eqIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = val;
    }
  }
}

function isRealValue(val, placeholderPrefix) {
  if (!val) return false;
  if (placeholderPrefix && val.includes(placeholderPrefix)) return false;
  return val.length > 10;
}

export function getPublicConfig() {
  const apiKey = process.env.GEMINI_API_KEY || '';
  const hasRealGeminiKey = Boolean(apiKey && apiKey !== 'tu_clave_de_gemini_aqui' && apiKey.length > 10);

  const sbUrl = process.env.SUPABASE_URL || '';
  const sbAnon = process.env.SUPABASE_ANON_KEY || '';
  const hasSupabase = isRealValue(sbUrl, 'tu-nuevo-proyecto') && isRealValue(sbAnon, 'tu_supabase_anon_key');

  const mpToken = process.env.MP_ACCESS_TOKEN || '';
  const hasMpApi = isRealValue(mpToken, 'tu-access-token');

  const mpLinkPro = process.env.MP_LINK_PLAN_PRO || '';
  const mpLinkInst = process.env.MP_LINK_PLAN_INSTITUCIONAL || '';
  const hasMpDirectLinks = isRealValue(mpLinkPro, 'TU_ID_PLAN') || isRealValue(mpLinkInst, 'TU_ID_PLAN');

  return {
    appName: 'MoodleAI Creator',
    version: '1.1.0',
    currency: 'ARS',
    aiProvider: 'Google Gemini',
    geminiModel: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
    geminiConfigured: hasRealGeminiKey,
    supabase: {
      configured: hasSupabase,
      url: hasSupabase ? sbUrl : '',
      anonKey: hasSupabase ? sbAnon : ''
    },
    mercadoPago: {
      currency: 'ARS',
      apiConfigured: hasMpApi,
      directLinksConfigured: hasMpDirectLinks,
      linkPlanPro: isRealValue(mpLinkPro, 'TU_ID_PLAN') ? mpLinkPro : '',
      linkPlanInstitutional: isRealValue(mpLinkInst, 'TU_ID_PLAN') ? mpLinkInst : ''
    }
    // NOTA DE SEGURIDAD: Jamás incluimos GEMINI_API_KEY, MP_ACCESS_TOKEN,
    // SUPABASE_SERVICE_ROLE_KEY ni SESSION_SECRET en este objeto público.
  };
}
