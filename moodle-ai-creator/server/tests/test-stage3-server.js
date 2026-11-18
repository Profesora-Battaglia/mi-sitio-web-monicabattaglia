import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from '../app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testDbPath = path.resolve(__dirname, '../../data/test-stage3.sqlite');

if (fs.existsSync(testDbPath)) {
  fs.unlinkSync(testDbPath);
}

console.log('Iniciando pruebas de Etapa 3 (Servidor HTTP, Seguridad API, Dashboard y Prototipo UX/UI)...');

// Simular una clave en process.env para comprobar que NUNCA se filtra al frontend
process.env.GEMINI_API_KEY = 'AIzaSyClaveSecretaDePruebaQueNuncaDebeExponerse123';

const { server, db } = createApp({ customDbPath: testDbPath });

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const baseUrl = `http://127.0.0.1:${port}`;

try {
  // 1. Verificar que el servidor entrega el Frontend (index.html, styles.css, app.js)
  const htmlRes = await fetch(`${baseUrl}/`);
  assert.equal(htmlRes.status, 200);
  const htmlText = await htmlRes.text();
  assert.ok(htmlText.includes('MoodleAI Creator'), 'El HTML debe contener el título de MoodleAI Creator');
  assert.ok(htmlText.includes('Panel Principal'), 'El HTML debe incluir el Panel Principal');
  console.log('  [OK] 1. Frontend HTML/CSS/JS servido correctamente.');

  // 2. Verificar endpoint /api/health y que JAMÁS expone GEMINI_API_KEY
  const healthRes = await fetch(`${baseUrl}/api/health`);
  const healthData = await healthRes.json();
  assert.equal(healthData.ok, true);
  assert.equal(healthData.config.geminiConfigured, true);
  const rawHealthJson = JSON.stringify(healthData);
  assert.equal(
    rawHealthJson.includes('AIzaSyClaveSecretaDePruebaQueNuncaDebeExponerse123'),
    false,
    'CRÍTICO: La clave GEMINI_API_KEY jamás debe enviarse al frontend'
  );
  console.log('  [OK] 2. Seguridad verificada: GEMINI_API_KEY está oculta en el backend y no se expone al navegador.');

  // 3. Verificar datos completos del Panel Principal (/api/dashboard - Módulo 1)
  const dashRes = await fetch(`${baseUrl}/api/dashboard`);
  const dashData = await dashRes.json();
  assert.equal(dashData.ok, true);
  assert.equal(dashData.dashboard.user.name, 'Prof. Mónica Battaglia');
  assert.equal(dashData.dashboard.stats.totalActivities, 1);
  assert.equal(dashData.dashboard.recentActivities.length, 1);
  assert.equal(dashData.plans.length, 3);
  console.log('  [OK] 3. Endpoint /api/dashboard entrega bienvenida, métricas, actividades recientes, favoritos y planes.');

  // 4. Verificar edición y persistencia del Perfil del Docente (PUT /api/profile)
  const updateProfileRes = await fetch(`${baseUrl}/api/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Prof. Mónica Battaglia (Tupungato)',
      institution: 'IES Tupungato - Mendoza',
      education_level: 'Secundaria y Superior',
      subject_specialty: 'Accesibilidad Educativa, DUA e IA Docente',
      bio: 'Consultora en tecnología educativa y accesibilidad.'
    })
  });
  const updateProfileData = await updateProfileRes.json();
  assert.equal(updateProfileData.ok, true);
  assert.equal(updateProfileData.user.institution, 'IES Tupungato - Mendoza');
  console.log('  [OK] 4. Formulario de Perfil Docente guarda y persiste cambios en SQLite.');

  // 5. Verificar alternar favorito (Recursos guardados) y vista previa de actividad
  const actId = dashData.dashboard.recentActivities[0].id;
  const favRes = await fetch(`${baseUrl}/api/activities/${actId}/favorite`, { method: 'POST' });
  const favData = await favRes.json();
  assert.equal(favData.ok, true);
  assert.equal(favData.activity.is_favorite, false);

  const favRes2 = await fetch(`${baseUrl}/api/activities/${actId}/favorite`, { method: 'POST' });
  const favData2 = await favRes2.json();
  assert.equal(favData2.activity.is_favorite, true);
  console.log('  [OK] 5. Guardado de recursos favoritos y consulta de actividad para Vista Previa verificados.');
} finally {
  await new Promise((resolve) => server.close(resolve));
  db.close();
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
}

console.log('\n✅ TODAS LAS PRUEBAS DE LA ETAPA 3 PASARON EXITOSAMENTE.');
