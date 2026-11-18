import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from '../app.js';
import { exportToMoodleXML, exportToMoodleGIFT } from '../services/moodleNativeExporter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testDbPath = path.resolve(__dirname, '../../data/test-stage5.sqlite');

if (fs.existsSync(testDbPath)) {
  fs.unlinkSync(testDbPath);
}

console.log('Iniciando pruebas de Etapa 5 (Exportación Moodle Nativo: Moodle XML y Formato GIFT)...');

const { server, db } = createApp({ customDbPath: testDbPath });
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const baseUrl = `http://127.0.0.1:${port}`;

try {
  // 1. Obtener la actividad semilla ("Exploradores del Ecosistema") que incluye multichoice, truefalse, fill_blanks y matching
  const sampleAct = db.getActivityById('act_ejemplo_ecosistemas');
  assert.ok(sampleAct, 'Debe existir la actividad inicial en la base de datos');

  // 2. Verificar estructura válida de Moodle XML
  const xmlResult = exportToMoodleXML(sampleAct);
  assert.ok(xmlResult.fileName.endsWith('-moodle.xml'));
  assert.ok(xmlResult.content.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n<quiz>'));
  assert.ok(xmlResult.content.trim().endsWith('</quiz>'));
  assert.ok(xmlResult.content.includes('<question type="category">'));
  assert.ok(xmlResult.content.includes('<question type="description">'));
  assert.ok(xmlResult.content.includes('<question type="multichoice">'));
  assert.ok(xmlResult.content.includes('<question type="truefalse">'));
  assert.ok(xmlResult.content.includes('<question type="shortanswer">'));
  assert.ok(xmlResult.content.includes('<question type="matching">'));
  assert.ok(xmlResult.content.includes('<answer fraction="100"'));
  assert.ok(xmlResult.content.includes('<defaultgrade>2.5000000</defaultgrade>'));
  console.log('  [OK] 1. Estructura Moodle XML validada (category, description, multichoice, truefalse, shortanswer, matching, defaultgrade y feedback).');

  // 3. Verificar estructura válida de Formato GIFT
  const giftResult = exportToMoodleGIFT(sampleAct);
  assert.ok(giftResult.fileName.endsWith('-moodle.gift.txt'));
  assert.ok(giftResult.content.includes('$CATEGORY: $course$/top/MoodleAI Creator/'));
  assert.ok(giftResult.content.includes('=La radiación solar y la salinidad del agua #'));
  assert.ok(giftResult.content.includes('{TRUE #'));
  assert.ok(giftResult.content.includes('{ =productores #'));
  assert.ok(giftResult.content.includes('=Productor autótrofo -> Algarrobo blanco'));
  console.log('  [OK] 2. Estructura Formato GIFT validada ($CATEGORY, ::Título::, =Correcta #Feedback, {TRUE}, {=Respuesta} y pares ->).');

  // 4. Verificar endpoints HTTP de vista previa con guía de importación y descarga directa
  const xmlPreviewRes = await fetch(`${baseUrl}/api/activities/${sampleAct.id}/export/moodle_xml?preview=true`);
  assert.equal(xmlPreviewRes.status, 200);
  const xmlPreviewData = await xmlPreviewRes.json();
  assert.equal(xmlPreviewData.ok, true);
  assert.equal(xmlPreviewData.importGuide.length, 4);

  const xmlDownloadRes = await fetch(`${baseUrl}/api/activities/${sampleAct.id}/export/moodle_xml`);
  assert.equal(xmlDownloadRes.status, 200);
  assert.ok(xmlDownloadRes.headers.get('content-disposition').includes('attachment; filename='));
  const downloadedXml = await xmlDownloadRes.text();
  assert.ok(downloadedXml.includes('<quiz>'));

  const giftDownloadRes = await fetch(`${baseUrl}/api/activities/${sampleAct.id}/export/gift`);
  assert.equal(giftDownloadRes.status, 200);
  assert.ok(giftDownloadRes.headers.get('content-disposition').includes('attachment; filename='));
  const downloadedGift = await giftDownloadRes.text();
  assert.ok(downloadedGift.includes('$CATEGORY:'));
  console.log('  [OK] 3. Descarga HTTP con Content-Disposition y guía de importación en Moodle verificadas.');

  // 5. Verificar que las descargas se registraron en export_history y actualizaron el contador del Dashboard
  const dashRes = await fetch(`${baseUrl}/api/dashboard`);
  const dashData = await dashRes.json();
  assert.equal(dashData.dashboard.stats.totalExports, 2, 'El contador de exportaciones Moodle debe registrar las 2 descargas');
  console.log('  [OK] 4. Registro en historial de exportaciones (export_history) y métricas del Dashboard verificados.');
} finally {
  await new Promise((resolve) => server.close(resolve));
  db.close();
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
}

console.log('\n✅ TODAS LAS PRUEBAS DE LA ETAPA 5 PASARON EXITOSAMENTE.');
