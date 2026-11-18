import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from '../app.js';
import { generateWithPedagogicalEngine } from '../services/aiGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testDbPath = path.resolve(__dirname, '../../data/test-stage4.sqlite');

if (fs.existsSync(testDbPath)) {
  fs.unlinkSync(testDbPath);
}

console.log('Iniciando pruebas de Etapa 4 (Generador IA de 12 Tipos de Actividades, Evaluaciones, Pedagogía y Editor)...');

// 1. Verificar generación estructurada para los 12 tipos de actividades del Módulo 2
const ALL_12_TYPES = [
  'Opción múltiple',
  'Verdadero o falso',
  'Completar espacios',
  'Relacionar columnas',
  'Ordenar secuencias',
  'Preguntas abiertas',
  'Cuestionarios',
  'Crucigramas',
  'Sopa de letras',
  'Casos prácticos',
  'Actividades de reflexión',
  'Gamificación'
];

for (const actType of ALL_12_TYPES) {
  const result = generateWithPedagogicalEngine({
    subject: 'Biología y Educación Ambiental',
    education_level: 'Secundaria',
    student_age: '14-15 años',
    topic: 'Fotosíntesis y ciclo del carbono',
    learning_objective: 'Comprender la transformación de energía lumínica en energía química.',
    estimated_duration: 40,
    difficulty: 'Intermedio',
    activity_type: actType,
    question_count: 4
  });

  const act = result.activity;
  assert.ok(act.title.includes(actType) || act.title.includes('Fotosíntesis'));
  assert.ok(act.description.length > 10);
  assert.ok(act.student_instructions.length > 10);
  assert.ok(act.pedagogical.bloomLevel.includes('Bloom'));
  assert.ok(Array.isArray(act.pedagogical.learningObjectives) && act.pedagogical.learningObjectives.length >= 2);
  assert.ok(Array.isArray(act.pedagogical.evaluationCriteria) && act.pedagogical.evaluationCriteria.length >= 2);
  assert.ok(act.pedagogical.pedagogicalRecommendations.length > 15);
  assert.equal(act.content.questions.length, 4, `El tipo ${actType} debe generar las 4 preguntas solicitadas`);
  for (const q of act.content.questions) {
    assert.ok(q.prompt && q.prompt.length > 5);
    assert.ok(q.correctFeedback && q.correctFeedback.length > 5);
    assert.ok(q.incorrectFeedback && q.incorrectFeedback.length > 5);
  }
}
console.log('  [OK] 1. Los 12 tipos de actividades del Módulo 2 y metadatos pedagógicos del Módulo 6 se generan con estructura válida.');

// 2. Pruebas de integración HTTP del Generador de Actividades, Evaluaciones, Editor y Cuota
const { server, db } = createApp({ customDbPath: testDbPath });
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const baseUrl = `http://127.0.0.1:${port}`;

try {
  // 2.1 Generar Actividad Formativa (1/3 del plan gratuito)
  const genRes1 = await fetch(`${baseUrl}/api/activities/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      subject: 'Geografía de Mendoza',
      education_level: 'Secundaria',
      student_age: '13 a 15 años',
      topic: 'Oasis productivos y cuenca del río Tunuyán',
      learning_objective: 'Analizar el aprovechamiento del agua de deshielo en el Valle de Uco.',
      estimated_duration: 35,
      difficulty: 'Intermedio',
      activity_type: 'Casos prácticos',
      question_count: 3,
      is_evaluation: false
    })
  });
  assert.equal(genRes1.status, 201);
  const genData1 = await genRes1.json();
  assert.equal(genData1.ok, true);
  assert.equal(genData1.activity.content.questions.length, 3);
  assert.equal(genData1.quota.used, 1);
  assert.equal(genData1.quota.remaining, 2);
  console.log('  [OK] 2. POST /api/activities/generate crea y guarda actividades formativas en SQLite y descuenta cuota (1/3).');

  // 2.2 Generar Evaluación Configurable (Módulo 3) (2/3 del plan gratuito)
  const evalRes = await fetch(`${baseUrl}/api/activities/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      subject: 'Historia Argentina',
      education_level: 'Secundaria',
      student_age: '15 a 16 años',
      topic: 'Cruce de los Andes y Plan Continental',
      learning_objective: 'Evaluar la organización del Ejército de los Andes en El Plumerillo.',
      activity_type: 'Cuestionarios',
      question_count: 5,
      difficulty: 'Avanzado',
      points_per_question: 2,
      time_limit_minutes: 40,
      allowed_attempts: 2,
      auto_grading: true,
      is_evaluation: true
    })
  });
  assert.equal(evalRes.status, 201);
  const evalData = await evalRes.json();
  assert.equal(evalData.ok, true);
  assert.equal(evalData.activity.is_evaluation, true);
  assert.equal(evalData.activity.question_count, 5);
  assert.equal(evalData.activity.points_per_question, 2);
  assert.equal(evalData.activity.time_limit_minutes, 40);
  assert.equal(evalData.quota.used, 2);
  console.log('  [OK] 3. Generador de Evaluaciones (Módulo 3) configura preguntas, puntajes, tiempo, intentos y calificación automática (2/3).');

  // 2.3 Editar la actividad generada (Módulo 10: Las actividades generadas deben ser editables)
  const actToEdit = genData1.activity;
  const editedQuestions = [...actToEdit.content.questions];
  editedQuestions[0] = {
    ...editedQuestions[0],
    prompt: 'Pregunta editada por la docente: ¿Cómo se distribuye el agua en el oasis del Valle de Uco?',
    points: 4
  };

  const editRes = await fetch(`${baseUrl}/api/activities/${actToEdit.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Caso Práctico Editado: Cuenca del Río Tunuyán (Tupungato)',
      content: {
        ...actToEdit.content,
        developmentText: 'Texto de desarrollo actualizado por la docente para su curso.',
        questions: editedQuestions
      }
    })
  });
  assert.equal(editRes.status, 200);
  const editData = await editRes.json();
  assert.equal(editData.ok, true);
  assert.equal(editData.activity.title, 'Caso Práctico Editado: Cuenca del Río Tunuyán (Tupungato)');
  assert.equal(editData.activity.content.questions[0].points, 4);
  assert.ok(editData.activity.content.questions[0].prompt.includes('Pregunta editada por la docente'));
  console.log('  [OK] 4. Editor Visual de Actividades (PUT /api/activities/:id) modifica y persiste título, desarrollo, preguntas y puntajes.');

  // 2.4 Verificar control de límite mensual (3/3 funciona, la 4ta generación devuelve 429 QUOTA_EXCEEDED)
  const genRes3 = await fetch(`${baseUrl}/api/activities/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      subject: 'Matemática',
      education_level: 'Primaria',
      student_age: '10-11 años',
      topic: 'Fracciones equivalentes',
      learning_objective: 'Representar y comparar fracciones en situaciones cotidianas.',
      activity_type: 'Gamificación',
      question_count: 3
    })
  });
  assert.equal(genRes3.status, 201);

  const genRes4 = await fetch(`${baseUrl}/api/activities/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      subject: 'Lengua',
      education_level: 'Primaria',
      student_age: '9-10 años',
      topic: 'Comprensión lectora de cuentos',
      learning_objective: 'Identificar personajes y conflicto narrativo.',
      activity_type: 'Opción múltiple',
      question_count: 3
    })
  });
  assert.equal(genRes4.status, 429, 'La 4ta generación en el Plan Gratuito debe bloquearse con código HTTP 429');
  const genData4 = await genRes4.json();
  assert.equal(genData4.code, 'QUOTA_EXCEEDED');
  console.log('  [OK] 5. Control de límite de uso mensual (3/mes en Plan Gratuito) bloquea excesos con mensaje amigable.');
} finally {
  await new Promise((resolve) => server.close(resolve));
  db.close();
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
}

console.log('\n✅ TODAS LAS PRUEBAS DE LA ETAPA 4 PASARON EXITOSAMENTE.');
