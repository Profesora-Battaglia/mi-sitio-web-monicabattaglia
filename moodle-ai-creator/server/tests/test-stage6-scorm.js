import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from '../app.js';
import { exportToScormPackage } from '../services/scormExporter.js';
import { inspectZipBuffer } from '../services/zipBuilder.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testDbPath = path.resolve(__dirname, '../../data/test-stage6.sqlite');

if (fs.existsSync(testDbPath)) {
  fs.unlinkSync(testDbPath);
}

console.log('Iniciando pruebas de Etapa 6 (Exportación de Paquetes SCORM 1.2 y SCORM 2004)...');

const { server, db } = createApp({ customDbPath: testDbPath });
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const baseUrl = `http://127.0.0.1:${port}`;

try {
  const sampleAct = db.getActivityById('act_ejemplo_ecosistemas');
  assert.ok(sampleAct);

  // 1. Verificar generación y estructura interna del ZIP SCORM 1.2
  const scorm12 = exportToScormPackage(sampleAct, '1.2');
  assert.ok(scorm12.fileName.endsWith('-scorm12.zip'));
  assert.equal(scorm12.zipBuffer.readUInt32LE(0), 0x04034b50, 'El archivo debe iniciar con la firma PKZIP válida');

  const entries12 = inspectZipBuffer(scorm12.zipBuffer);
  assert.ok(entries12['imsmanifest.xml'], 'Debe contener imsmanifest.xml');
  assert.ok(entries12['index.html'], 'Debe contener index.html');
  assert.ok(entries12['styles.css'], 'Debe contener styles.css');
  assert.ok(entries12['scorm-driver.js'], 'Debe contener scorm-driver.js');
  assert.ok(entries12['activity-app.js'], 'Debe contener activity-app.js');

  assert.ok(entries12['imsmanifest.xml'].includes('<schemaversion>1.2</schemaversion>'));
  assert.ok(entries12['imsmanifest.xml'].includes('adlcp:scormtype="sco"'));
  assert.ok(entries12['imsmanifest.xml'].includes('<adlcp:masteryscore>60</adlcp:masteryscore>'));
  assert.ok(entries12['scorm-driver.js'].includes('LMSInitialize'));
  assert.ok(entries12['scorm-driver.js'].includes('cmi.core.score.raw'));
  assert.ok(entries12['scorm-driver.js'].includes('cmi.core.lesson_status'));
  assert.ok(entries12['scorm-driver.js'].includes('cmi.core.lesson_location'));
  console.log('  [OK] 1. Paquete ZIP SCORM 1.2 validado (imsmanifest.xml, index.html, styles.css, scorm-driver.js, progreso, estado y puntaje).');

  // 2. Verificar generación y estructura interna del ZIP SCORM 2004
  const scorm2004 = exportToScormPackage(sampleAct, '2004');
  assert.ok(scorm2004.fileName.endsWith('-scorm2004.zip'));
  const entries2004 = inspectZipBuffer(scorm2004.zipBuffer);
  assert.ok(entries2004['imsmanifest.xml'].includes('<schemaversion>2004 3rd Edition</schemaversion>'));
  assert.ok(entries2004['imsmanifest.xml'].includes('adlcp:scormType="sco"'));
  assert.ok(entries2004['scorm-driver.js'].includes('API_1484_11'));
  assert.ok(entries2004['scorm-driver.js'].includes('cmi.score.scaled'));
  assert.ok(entries2004['scorm-driver.js'].includes('cmi.completion_status'));
  console.log('  [OK] 2. Paquete ZIP SCORM 2004 validado (manifiesto 2004 3rd Edition y API_1484_11).');

  // 3. Verificar descarga HTTP binaria y vista previa con guía de importación Moodle
  const previewRes = await fetch(`${baseUrl}/api/activities/${sampleAct.id}/export/scorm_12?preview=true`);
  assert.equal(previewRes.status, 200);
  const previewData = await previewRes.json();
  assert.equal(previewData.ok, true);
  assert.equal(previewData.filesList.length, 5);

  const dl12Res = await fetch(`${baseUrl}/api/activities/${sampleAct.id}/export/scorm_12`);
  assert.equal(dl12Res.status, 200);
  assert.equal(dl12Res.headers.get('content-type'), 'application/zip');
  const dl12Buf = Buffer.from(await dl12Res.arrayBuffer());
  assert.equal(dl12Buf.readUInt32LE(0), 0x04034b50);

  const dl2004Res = await fetch(`${baseUrl}/api/activities/${sampleAct.id}/export/scorm_2004`);
  assert.equal(dl2004Res.status, 200);
  const dl2004Buf = Buffer.from(await dl2004Res.arrayBuffer());
  assert.equal(dl2004Buf.readUInt32LE(0), 0x04034b50);
  console.log('  [OK] 3. Descarga HTTP binaria (.zip) para SCORM 1.2 y SCORM 2004 verificada.');
} finally {
  await new Promise((resolve) => server.close(resolve));
  db.close();
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
}

console.log('\n✅ TODAS LAS PRUEBAS DE LA ETAPA 6 PASARON EXITOSAMENTE.');
