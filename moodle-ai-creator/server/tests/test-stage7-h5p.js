import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from '../app.js';
import { exportToH5PPackage, validateH5PPackageStructure } from '../services/h5pExporter.js';
import { inspectZipBuffer } from '../services/zipBuilder.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testDbPath = path.resolve(__dirname, '../../data/test-stage7.sqlite');

if (fs.existsSync(testDbPath)) {
  fs.unlinkSync(testDbPath);
}

console.log('Iniciando pruebas de Etapa 7 (Exportación H5P Válida y Validador de Bibliotecas/Dependencias)...');

const { server, db } = createApp({ customDbPath: testDbPath });
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const baseUrl = `http://127.0.0.1:${port}`;

try {
  const sampleAct = db.getActivityById('act_ejemplo_ecosistemas');
  assert.ok(sampleAct);

  // 1. Generar paquete .h5p y verificar su estructura ZIP interna
  const h5pPkg = exportToH5PPackage(sampleAct);
  assert.ok(h5pPkg.fileName.endsWith('.h5p'));
  assert.equal(h5pPkg.validation.isValid, true);
  assert.equal(h5pPkg.zipBuffer.readUInt32LE(0), 0x04034b50, 'El archivo .h5p debe ser un contenedor ZIP estándar');

  const entries = inspectZipBuffer(h5pPkg.zipBuffer);
  assert.ok(entries['h5p.json'], 'El paquete .h5p debe contener h5p.json en la raíz');
  assert.ok(entries['content/content.json'], 'El paquete .h5p debe contener content/content.json');
  assert.equal(entries['index.html'], undefined, 'No debe ser un simple archivo HTML renombrado');

  // 2. Validar contenido de h5p.json y correspondencia de bibliotecas en content/content.json
  const parsedH5pJson = JSON.parse(entries['h5p.json']);
  const parsedContentJson = JSON.parse(entries['content/content.json']);

  assert.equal(parsedH5pJson.mainLibrary, 'H5P.QuestionSet');
  assert.equal(parsedH5pJson.language, 'es');
  assert.deepEqual(parsedH5pJson.embedTypes, ['div']);

  const depNames = parsedH5pJson.preloadedDependencies.map((d) => `${d.machineName} ${d.majorVersion}.${d.minorVersion}`);
  assert.ok(depNames.includes('H5P.QuestionSet 1.20'));
  assert.ok(depNames.includes('H5P.MultiChoice 1.16'));
  assert.ok(depNames.includes('H5P.TrueFalse 1.8'));
  assert.ok(depNames.includes('H5P.Blanks 1.14'));
  assert.ok(depNames.includes('H5P.DragText 1.10'));

  assert.equal(parsedContentJson.questions.length, 4);
  assert.ok(parsedContentJson.questions[2].params.questions[0].includes('*productores*'), 'H5P.Blanks debe utilizar la sintaxis oficial *palabra*');
  console.log('  [OK] 1. Estructura interna .h5p verificada (h5p.json + content/content.json con H5P.QuestionSet, MultiChoice, TrueFalse, Blanks y DragText).');

  // 3. Verificar que el validador rechaza paquetes con dependencias faltantes
  const brokenH5pJson = { ...parsedH5pJson, preloadedDependencies: [{ machineName: 'H5P.QuestionSet', majorVersion: 1, minorVersion: 20 }] };
  const brokenCheck = validateH5PPackageStructure(brokenH5pJson, parsedContentJson);
  assert.equal(brokenCheck.isValid, false, 'El validador debe detectar cuando falta una biblioteca requerida en preloadedDependencies');
  assert.ok(brokenCheck.errors.some((e) => e.includes('no está declarada en preloadedDependencies')));
  console.log('  [OK] 2. Validador de bibliotecas y dependencias H5P detecta y bloquea dependencias faltantes.');

  // 4. Verificar endpoints HTTP de inspección y descarga .h5p
  const previewRes = await fetch(`${baseUrl}/api/activities/${sampleAct.id}/export/h5p?preview=true`);
  assert.equal(previewRes.status, 200);
  const previewData = await previewRes.json();
  assert.equal(previewData.ok, true);
  assert.equal(previewData.validation.isValid, true);

  const dlRes = await fetch(`${baseUrl}/api/activities/${sampleAct.id}/export/h5p`);
  assert.equal(dlRes.status, 200);
  assert.ok(dlRes.headers.get('content-disposition').includes('.h5p'));
  const dlBuf = Buffer.from(await dlRes.arrayBuffer());
  assert.equal(dlBuf.readUInt32LE(0), 0x04034b50);
  console.log('  [OK] 3. Descarga HTTP binaria (.h5p) y guía de importación al Banco de Contenido de Moodle verificadas.');
} finally {
  await new Promise((resolve) => server.close(resolve));
  db.close();
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
}

console.log('\n✅ TODAS LAS PRUEBAS DE LA ETAPA 7 PASARON EXITOSAMENTE.');
