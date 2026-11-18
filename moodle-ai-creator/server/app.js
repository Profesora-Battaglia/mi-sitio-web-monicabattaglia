import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MoodleAIDatabase, verifyPassword } from './db/database.js';
import { loadEnv, getPublicConfig } from './env.js';
import { generateEducationalResource } from './services/aiGenerator.js';
import { exportToMoodleXML, exportToMoodleGIFT } from './services/moodleNativeExporter.js';
import { exportToScormPackage } from './services/scormExporter.js';
import { exportToH5PPackage } from './services/h5pExporter.js';
import { createMercadoPagoCheckout } from './services/mercadoPagoService.js';

loadEnv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, '../public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
};

function sendJson(res, statusCode, payload, extraHeaders = {}) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...extraHeaders
  });
  res.end(body);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 5 * 1024 * 1024) {
        reject(new Error('El cuerpo de la solicitud supera el tamaño máximo permitido (5MB).'));
      }
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('El formato JSON enviado no es válido.'));
      }
    });
    req.on('error', reject);
  });
}

function parseCookies(cookieHeader = '') {
  const out = {};
  for (const pair of cookieHeader.split(';')) {
    const idx = pair.indexOf('=');
    if (idx === -1) continue;
    const k = pair.slice(0, idx).trim();
    const v = pair.slice(idx + 1).trim();
    out[k] = decodeURIComponent(v);
  }
  return out;
}

export function createApp({ customDbPath = null } = {}) {
  const db = new MoodleAIDatabase(customDbPath);

  function extractToken(req) {
    const authHeader = req.headers['authorization'] || '';
    if (authHeader.startsWith('Bearer ')) {
      return authHeader.slice(7).trim();
    }
    const cookies = parseCookies(req.headers['cookie'] || '');
    return cookies['moodleai_session'] || null;
  }

  function resolveCurrentUser(req) {
    const token = extractToken(req);
    if (token) {
      const sessionUser = db.getUserBySessionToken(token);
      if (sessionUser) return sessionUser;
    }
    return db.getUserById('usr_docente_demo');
  }

  const server = http.createServer(async (req, res) => {
    try {
      const hostUrl = `http://${req.headers.host || 'localhost:4000'}`;
      const urlObj = new URL(req.url, hostUrl);
      const pathname = urlObj.pathname;
      const method = req.method.toUpperCase();

      // ======================================================================
      // RUTAS DE API REST
      // ======================================================================

      // 1. Estado del sistema y configuración pública segura
      if (pathname === '/api/health' && method === 'GET') {
        return sendJson(res, 200, {
          ok: true,
          status: 'healthy',
          config: getPublicConfig()
        });
      }

      // 2. Autenticación de Usuarios: Supabase Sync, Registro, Login, Logout (Módulo 7)
      if (pathname === '/api/auth/supabase-sync' && method === 'POST') {
        const body = await readJsonBody(req);
        if (!body.email || !body.supabaseId) {
          return sendJson(res, 400, { ok: false, error: 'Datos de usuario de Supabase incompletos.' });
        }
        const syncedUser = db.syncSupabaseUser({
          supabaseId: body.supabaseId,
          email: body.email,
          name: body.name || body.email.split('@')[0],
          institution: body.institution || '',
          education_level: body.education_level || 'Secundaria',
          subject_specialty: body.subject_specialty || ''
        });
        const session = db.createSession(syncedUser.id);
        return sendJson(
          res,
          200,
          {
            ok: true,
            message: `Sesión sincronizada con Supabase Auth (${syncedUser.email}).`,
            token: session.token,
            user: syncedUser
          },
          {
            'Set-Cookie': `moodleai_session=${encodeURIComponent(session.token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=1209600`
          }
        );
      }

      if (pathname === '/api/auth/register' && method === 'POST') {
        const body = await readJsonBody(req);
        if (!body.name || String(body.name).trim().length < 2) {
          return sendJson(res, 400, { ok: false, error: 'Ingresá tu nombre y apellido (mínimo 2 caracteres).' });
        }
        if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(body.email).trim())) {
          return sendJson(res, 400, { ok: false, error: 'Ingresá un correo electrónico válido.' });
        }
        if (!body.password || String(body.password).length < 6) {
          return sendJson(res, 400, { ok: false, error: 'La contraseña debe tener al menos 6 caracteres.' });
        }

        let newUser;
        try {
          newUser = db.createUser({
            name: body.name,
            email: body.email,
            password: body.password,
            role: body.role || 'teacher',
            institution: body.institution || '',
            education_level: body.education_level || 'Secundaria',
            subject_specialty: body.subject_specialty || '',
            plan_id: 'free',
            auth_provider: body.auth_provider || 'local'
          });
        } catch (dupErr) {
          return sendJson(res, 409, { ok: false, error: dupErr.message });
        }

        const session = db.createSession(newUser.id);
        return sendJson(
          res,
          201,
          {
            ok: true,
            message: `¡Bienvenido/a, ${newUser.name}! Tu cuenta docente fue creada con el Plan Gratuito ($0 ARS / 3 actividades mensuales).`,
            token: session.token,
            user: newUser
          },
          {
            'Set-Cookie': `moodleai_session=${encodeURIComponent(session.token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=1209600`
          }
        );
      }

      if (pathname === '/api/auth/login' && method === 'POST') {
        const body = await readJsonBody(req);
        if (!body.email || !body.password) {
          return sendJson(res, 400, { ok: false, error: 'Ingresá tu correo electrónico y contraseña.' });
        }

        const userRow = db.getUserByEmail(String(body.email).trim());
        if (!userRow || !verifyPassword(String(body.password), userRow.password_hash)) {
          return sendJson(res, 401, { ok: false, error: 'Correo electrónico o contraseña incorrectos.' });
        }

        const session = db.createSession(userRow.id);
        const fullUser = db.getUserById(userRow.id);
        return sendJson(
          res,
          200,
          {
            ok: true,
            message: `¡Hola de nuevo, ${fullUser.name}!`,
            token: session.token,
            user: fullUser
          },
          {
            'Set-Cookie': `moodleai_session=${encodeURIComponent(session.token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=1209600`
          }
        );
      }

      if (pathname === '/api/auth/logout' && method === 'POST') {
        const token = extractToken(req);
        if (token) {
          db.deleteSession(token);
        }
        return sendJson(
          res,
          200,
          {
            ok: true,
            message: 'Sesión cerrada correctamente.'
          },
          {
            'Set-Cookie': 'moodleai_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0'
          }
        );
      }

      if (pathname === '/api/auth/me' && method === 'GET') {
        const user = resolveCurrentUser(req);
        return sendJson(res, 200, { ok: true, user });
      }

      // 3. Resumen completo del Panel Principal (Módulo 1)
      if (pathname === '/api/dashboard' && method === 'GET') {
        const user = resolveCurrentUser(req);
        const summary = db.getDashboardSummary(user.id);
        const plans = db.getPlans();
        const usageHistory = db.getUsageHistory(user.id, 15);
        const paymentsHistory = db.getUserPayments(user.id, 10);
        return sendJson(res, 200, {
          ok: true,
          config: getPublicConfig(),
          dashboard: summary,
          plans,
          usageHistory,
          paymentsHistory
        });
      }

      // 4. Perfil del Docente y Pasarela de Pagos Mercado Pago en ARS (Módulos 1 y 7)
      if (pathname === '/api/profile' && method === 'GET') {
        const user = resolveCurrentUser(req);
        return sendJson(res, 200, { ok: true, user });
      }

      if (pathname === '/api/profile' && method === 'PUT') {
        const user = resolveCurrentUser(req);
        const body = await readJsonBody(req);
        if (!body.name || String(body.name).trim().length < 2) {
          return sendJson(res, 400, { ok: false, error: 'El nombre del docente es obligatorio (mínimo 2 caracteres).' });
        }
        const updatedUser = db.updateUserProfile(user.id, {
          name: body.name,
          institution: body.institution,
          education_level: body.education_level,
          subject_specialty: body.subject_specialty,
          bio: body.bio
        });
        return sendJson(res, 200, {
          ok: true,
          message: 'Perfil docente actualizado correctamente.',
          user: updatedUser
        });
      }

      // 4.1 Crear Preferencia / Link de Suscripción en Mercado Pago (en Pesos Argentinos - ARS)
      if (pathname === '/api/payments/mercadopago/create-preference' && method === 'POST') {
        const user = resolveCurrentUser(req);
        const body = await readJsonBody(req);
        const plan = db.getPlanById(body.plan_id);
        if (!plan) {
          return sendJson(res, 400, { ok: false, error: 'El plan seleccionado no existe.' });
        }
        if (plan.id === 'free') {
          const updatedUser = db.updateUserPlan(user.id, 'free');
          return sendJson(res, 200, {
            ok: true,
            freePlanActivated: true,
            message: 'Cambiaste al Plan Gratuito ($0 ARS / mes).',
            user: updatedUser
          });
        }

        const baseUrl = process.env.PUBLIC_APP_URL || hostUrl;
        const checkout = await createMercadoPagoCheckout({
          db,
          user,
          plan,
          preferredMode: body.mode || 'auto',
          baseUrl
        });

        return sendJson(res, 201, {
          ok: true,
          message: `Checkout de Mercado Pago generado por $${Number(plan.price_ars).toLocaleString('es-AR')} ARS (${plan.name}).`,
          checkout,
          plan
        });
      }

      // 4.2 Confirmar pago de Mercado Pago (API / Webhook / Callback de retorno)
      if (pathname === '/api/payments/mercadopago/confirm' && method === 'POST') {
        const body = await readJsonBody(req);
        if (!body.payment_id) {
          return sendJson(res, 400, { ok: false, error: 'Falta el identificador de pago (payment_id).' });
        }
        try {
          const result = db.approvePaymentAndUpgradePlan({
            paymentId: body.payment_id,
            mpPaymentId: body.mp_payment_id || `MP_ARS_${Date.now()}`
          });
          return sendJson(res, 200, {
            ok: true,
            message: `¡Pago de $${Number(result.payment.amount_ars).toLocaleString('es-AR')} ARS acreditado con éxito! Tu ${result.user.plan_name} ya está activo.`,
            payment: result.payment,
            user: result.user
          });
        } catch (err) {
          return sendJson(res, 404, { ok: false, error: err.message });
        }
      }

      if (pathname === '/api/payments/mercadopago/callback' && method === 'GET') {
        const paymentId = urlObj.searchParams.get('payment_id') || urlObj.searchParams.get('external_reference');
        const status = urlObj.searchParams.get('status') || urlObj.searchParams.get('collection_status') || 'approved';
        const mpPaymentId = urlObj.searchParams.get('mp_payment_id') || urlObj.searchParams.get('collection_id') || `MP_${Date.now()}`;

        if (paymentId && status === 'approved') {
          try {
            db.approvePaymentAndUpgradePlan({ paymentId, mpPaymentId });
          } catch {
            // ignore if already approved
          }
        }
        res.writeHead(302, {
          Location: `/?mp_status=${encodeURIComponent(status)}&payment_id=${encodeURIComponent(paymentId || '')}`
        });
        return res.end();
      }

      if (pathname === '/api/subscription/plan' && method === 'PUT') {
        const user = resolveCurrentUser(req);
        const body = await readJsonBody(req);
        if (!body.plan_id) {
          return sendJson(res, 400, { ok: false, error: 'Debés indicar el identificador del plan.' });
        }
        try {
          const updatedUser = db.updateUserPlan(user.id, body.plan_id);
          db.logUsage({
            userId: user.id,
            actionType: 'plan_change',
            aiProvider: 'system',
            details: `Cambio de suscripción a ${updatedUser.plan_name} (${updatedUser.price_display})`
          });
          return sendJson(res, 200, {
            ok: true,
            message: `Tu cuenta fue actualizada a ${updatedUser.plan_name} (${updatedUser.monthly_generation_limit} generaciones mensuales).`,
            user: updatedUser
          });
        } catch (err) {
          return sendJson(res, 400, { ok: false, error: err.message });
        }
      }

      // 5. Generador Inteligente de Actividades y Evaluaciones
      if (pathname === '/api/activities/generate' && method === 'POST') {
        const user = resolveCurrentUser(req);
        const quota = db.getUserMonthlyQuota(user.id);
        if (!quota.canGenerate) {
          return sendJson(res, 429, {
            ok: false,
            code: 'QUOTA_EXCEEDED',
            error: `Alcanzaste el límite de ${quota.limit} actividades mensuales de tu ${quota.planName}. Podés suscribirte con Mercado Pago al Plan Docente Profesional ($25.000 ARS/mes) o Plan Institucional ($50.000 ARS/mes).`,
            quota
          });
        }

        const body = await readJsonBody(req);
        let generated;
        try {
          generated = await generateEducationalResource(body);
        } catch (validationErr) {
          return sendJson(res, 400, {
            ok: false,
            error: validationErr.message
          });
        }

        const savedActivity = db.createActivity(user.id, {
          ...generated.activity,
          tags: body.tags || `${generated.activity.subject}, ${generated.activity.activity_type}`
        });

        const updatedQuota = db.logUsage({
          userId: user.id,
          actionType: generated.activity.is_evaluation ? 'generate_evaluation' : 'generate_activity',
          activityId: savedActivity.id,
          aiProvider: generated.providerUsed,
          details: `${generated.activity.activity_type}: ${savedActivity.title}`
        });

        return sendJson(res, 201, {
          ok: true,
          message: generated.activity.is_evaluation
            ? 'Evaluación generada y guardada en tu biblioteca.'
            : 'Actividad generada y guardada en tu biblioteca.',
          providerUsed: generated.providerUsed,
          activity: savedActivity,
          quota: updatedQuota
        });
      }

      // 6. Exportación Completa para Moodle (Módulo 4)
      const exportMatch = pathname.match(/^\/api\/activities\/([^/]+)\/export\/([^/]+)$/);
      if (exportMatch && method === 'GET') {
        const user = resolveCurrentUser(req);
        const activityId = exportMatch[1];
        const format = exportMatch[2].toLowerCase();
        const isPreview = urlObj.searchParams.get('preview') === 'true';

        const activity = db.getActivityById(activityId, user.id);
        if (!activity) {
          return sendJson(res, 404, { ok: false, error: 'Actividad no encontrada.' });
        }

        if (format === 'moodle_xml') {
          const exported = exportToMoodleXML(activity);
          if (!isPreview) {
            db.logExport({
              activityId: activity.id,
              userId: user.id,
              exportFormat: 'moodle_xml',
              fileName: exported.fileName
            });
          }
          if (isPreview) {
            return sendJson(res, 200, {
              ok: true,
              format: 'moodle_xml',
              fileName: exported.fileName,
              content: exported.content,
              importGuide: [
                '1. Entrá a tu curso en Moodle y abrí Más → Banco de preguntas → Importar.',
                '2. En Formato de archivo seleccioná "Formato Moodle XML".',
                `3. Subí el archivo "${exported.fileName}" y hacé clic en Importar.`,
                '4. Las preguntas se organizarán automáticamente en su propia categoría con retroalimentación y puntajes.'
              ]
            });
          }
          res.writeHead(200, {
            'Content-Type': exported.mimeType,
            'Content-Disposition': `attachment; filename="${exported.fileName}"`,
            'Cache-Control': 'no-store'
          });
          return res.end(exported.content);
        }

        if (format === 'gift') {
          const exported = exportToMoodleGIFT(activity);
          if (!isPreview) {
            db.logExport({
              activityId: activity.id,
              userId: user.id,
              exportFormat: 'gift',
              fileName: exported.fileName
            });
          }
          if (isPreview) {
            return sendJson(res, 200, {
              ok: true,
              format: 'gift',
              fileName: exported.fileName,
              content: exported.content,
              importGuide: [
                '1. Entrá a tu curso en Moodle y abrí Más → Banco de preguntas → Importar.',
                '2. En Formato de archivo seleccioná "Formato GIFT".',
                `3. Subí el archivo "${exported.fileName}" y hacé clic en Importar.`,
                '4. Luego podés agregar estas preguntas a cualquier Cuestionario de tu aula.'
              ]
            });
          }
          res.writeHead(200, {
            'Content-Type': exported.mimeType,
            'Content-Disposition': `attachment; filename="${exported.fileName}"`,
            'Cache-Control': 'no-store'
          });
          return res.end(exported.content);
        }

        if (format === 'scorm_12' || format === 'scorm_2004') {
          const scormVersion = format === 'scorm_2004' ? '2004' : '1.2';
          const exported = exportToScormPackage(activity, scormVersion);
          if (!isPreview) {
            db.logExport({
              activityId: activity.id,
              userId: user.id,
              exportFormat: format,
              fileName: exported.fileName
            });
          }
          if (isPreview) {
            return sendJson(res, 200, {
              ok: true,
              format,
              fileName: exported.fileName,
              filesList: exported.filesList,
              content: `Archivos incluidos en el paquete ZIP (${exported.filesList.join(', ')}):\n\n--- imsmanifest.xml ---\n${exported.manifestXml}`,
              importGuide: [
                '1. En tu curso de Moodle, activá el "Modo de edición" arriba a la derecha.',
                '2. Hacé clic en "Añadir una actividad o un recurso" y seleccioná "Paquete SCORM".',
                `3. Poné el título y en la sección "Paquete" arrastrá el archivo "${exported.fileName}".`,
                '4. Hacé clic en "Guardar cambios y mostrar": la actividad registrará navegación, progreso, nota (0-100) y estado completado/aprobado automáticamente.'
              ]
            });
          }
          res.writeHead(200, {
            'Content-Type': exported.mimeType,
            'Content-Disposition': `attachment; filename="${exported.fileName}"`,
            'Content-Length': exported.zipBuffer.length,
            'Cache-Control': 'no-store'
          });
          return res.end(exported.zipBuffer);
        }

        if (format === 'h5p') {
          const exported = exportToH5PPackage(activity);
          if (!isPreview) {
            db.logExport({
              activityId: activity.id,
              userId: user.id,
              exportFormat: 'h5p',
              fileName: exported.fileName
            });
          }
          if (isPreview) {
            return sendJson(res, 200, {
              ok: true,
              format: 'h5p',
              fileName: exported.fileName,
              filesList: exported.filesList,
              validation: exported.validation,
              h5pJson: exported.h5pJson,
              content: `✅ Validación H5P Oficial: APROBADA (${exported.h5pJson.preloadedDependencies.length} bibliotecas verificadas)\nArchivos del contenedor (${exported.filesList.join(', ')}):\n\n--- h5p.json ---\n${JSON.stringify(exported.h5pJson, null, 2)}\n\n--- content/content.json ---\n${JSON.stringify(exported.contentJson, null, 2)}`,
              importGuide: [
                '1. En tu aula Moodle, entrá a "Banco de contenido → Subir" o activá Modo de edición → "Añadir una actividad H5P".',
                `2. Subí el archivo "${exported.fileName}" generado con manifiesto h5p.json y content/content.json validados.`,
                '3. Nota importante si es la primera vez que usás H5P en tu Moodle: asegurate de que tu Moodle tenga instaladas las bibliotecas oficiales de H5P Content Types (QuestionSet, MultiChoice, TrueFalse, Blanks, DragText) desde Administración del sitio → H5P → Gestionar tipos de contenido H5P.',
                '4. Guardá los cambios para que los estudiantes resuelvan el recurso interactivo con calificación en el Libro de Calificaciones.'
              ]
            });
          }
          res.writeHead(200, {
            'Content-Type': exported.mimeType,
            'Content-Disposition': `attachment; filename="${exported.fileName}"`,
            'Content-Length': exported.zipBuffer.length,
            'Cache-Control': 'no-store'
          });
          return res.end(exported.zipBuffer);
        }

        return sendJson(res, 400, {
          ok: false,
          error: `Formato de exportación no soportado: "${format}".`
        });
      }

      // 7. Biblioteca Personal
      if (pathname === '/api/activities' && method === 'GET') {
        const user = resolveCurrentUser(req);
        const search = urlObj.searchParams.get('search') || '';
        const subject = urlObj.searchParams.get('subject') || '';
        const activityType = urlObj.searchParams.get('activityType') || '';
        const onlyFavorites = urlObj.searchParams.get('onlyFavorites') === 'true';

        const allUserActivities = db.listActivities(user.id);
        const availableSubjects = Array.from(new Set(allUserActivities.map((a) => a.subject).filter(Boolean))).sort();

        const activities = db.listActivities(user.id, { search, subject, activityType, onlyFavorites });
        return sendJson(res, 200, {
          ok: true,
          activities,
          availableSubjects
        });
      }

      const favMatch = pathname.match(/^\/api\/activities\/([^/]+)\/favorite$/);
      if (favMatch && method === 'POST') {
        const user = resolveCurrentUser(req);
        const activityId = favMatch[1];
        const current = db.getActivityById(activityId, user.id);
        if (!current) {
          return sendJson(res, 404, { ok: false, error: 'Actividad no encontrada.' });
        }
        const updated = db.updateActivity(activityId, user.id, {
          is_favorite: !current.is_favorite
        });
        return sendJson(res, 200, { ok: true, activity: updated });
      }

      const dupMatch = pathname.match(/^\/api\/activities\/([^/]+)\/duplicate$/);
      if (dupMatch && method === 'POST') {
        const user = resolveCurrentUser(req);
        try {
          const duplicated = db.duplicateActivity(dupMatch[1], user.id);
          return sendJson(res, 201, {
            ok: true,
            message: 'Actividad duplicada correctamente.',
            activity: duplicated
          });
        } catch (err) {
          return sendJson(res, 404, { ok: false, error: err.message });
        }
      }

      const actDetailMatch = pathname.match(/^\/api\/activities\/([^/]+)$/);
      if (actDetailMatch) {
        const user = resolveCurrentUser(req);
        const activityId = actDetailMatch[1];

        if (method === 'GET') {
          const activity = db.getActivityById(activityId, user.id);
          if (!activity) {
            return sendJson(res, 404, { ok: false, error: 'Actividad no encontrada.' });
          }
          return sendJson(res, 200, { ok: true, activity });
        }

        if (method === 'PUT') {
          const body = await readJsonBody(req);
          if (body.title !== undefined && String(body.title).trim().length < 3) {
            return sendJson(res, 400, { ok: false, error: 'El título de la actividad debe tener al menos 3 caracteres.' });
          }
          try {
            const updated = db.updateActivity(activityId, user.id, body);
            return sendJson(res, 200, {
              ok: true,
              message: 'Cambios guardados en la actividad.',
              activity: updated
            });
          } catch (err) {
            return sendJson(res, 404, { ok: false, error: err.message });
          }
        }

        if (method === 'DELETE') {
          const deleted = db.deleteActivity(activityId, user.id);
          if (!deleted) {
            return sendJson(res, 404, { ok: false, error: 'Actividad no encontrada.' });
          }
          return sendJson(res, 200, { ok: true, message: 'Actividad eliminada de tu biblioteca.' });
        }
      }

      if (pathname.startsWith('/api/')) {
        return sendJson(res, 404, { ok: false, error: `Ruta API no encontrada: ${method} ${pathname}` });
      }

      let relativePath = pathname === '/' ? '/index.html' : pathname;
      const safePath = path.normalize(relativePath).replace(/^(\.\.[/\\])+/, '');
      let filePath = path.join(PUBLIC_DIR, safePath);

      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(PUBLIC_DIR, 'index.html');
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      const content = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    } catch (err) {
      console.error('Error en el servidor MoodleAI Creator:', err);
      sendJson(res, 500, {
        ok: false,
        error: err.message || 'Ocurrió un error interno en el servidor.'
      });
    }
  });

  return { server, db };
}
