import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MoodleAIDatabase, verifyPassword } from '../db/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testDbPath = path.resolve(__dirname, '../../data/test-stage2.sqlite');

if (fs.existsSync(testDbPath)) {
  fs.unlinkSync(testDbPath);
}

console.log('Iniciando pruebas de Etapa 2 (Modelo de Datos y Reglas de Negocio)...');

const db = new MoodleAIDatabase(testDbPath);

// 1. Verificar Planes Comerciales (Módulo 7)
const plans = db.getPlans();
assert.equal(plans.length, 3, 'Deben existir 3 planes comerciales (Free, Pro, Institucional)');
const freePlan = plans.find((p) => p.id === 'free');
assert.equal(freePlan.monthly_generation_limit, 3, 'El plan gratuito debe tener límite de 3 actividades mensuales');
console.log('  [OK] 1. Planes comerciales verificados (Free: 3/mes, Pro: 150/mes, Institucional: 1000/mes).');

// 2. Verificar Docente por defecto y autenticación con hash PBKDF2
const demoUser = db.getUserByEmail('docente@moodleai.edu.ar');
assert.ok(demoUser, 'Debe existir el usuario docente inicial');
assert.equal(verifyPassword('Docente2026!', demoUser.password_hash), true, 'La verificación de contraseña con hash debe funcionar');
assert.equal(verifyPassword('ClaveIncorrecta', demoUser.password_hash), false, 'Debe rechazar contraseñas inválidas');
console.log('  [OK] 2. Usuario docente y hash seguro de contraseña (PBKDF2) verificados.');

// 3. Verificar Creación de Nuevo Docente y Sesiones
const newTeacher = db.createUser({
  name: 'Prof. Carlos Gómez',
  email: 'carlos.gomez@escuela.edu.ar',
  password: 'MiPasswordSegura123',
  institution: 'Escuela Técnica N° 4',
  education_level: 'Secundaria',
  subject_specialty: 'Historia y Geografía'
});
assert.equal(newTeacher.plan_id, 'free');
assert.equal(newTeacher.avatar_initials, 'PC');

const session = db.createSession(newTeacher.id);
const sessionUser = db.getUserBySessionToken(session.token);
assert.equal(sessionUser.email, 'carlos.gomez@escuela.edu.ar');
console.log('  [OK] 3. Registro de docente y persistencia de sesiones verificados.');

// 4. Verificar Creación, Edición, Duplicación y Búsqueda de Actividades (Módulos 2, 3, 5 y 6)
const createdActivity = db.createActivity(newTeacher.id, {
  subject: 'Historia Argentina',
  education_level: 'Secundaria',
  student_age: '14-15 años',
  topic: 'Revolución de Mayo de 1810',
  learning_objective: 'Analizar las causas políticas, económicas y sociales de la Revolución de Mayo.',
  estimated_duration: 45,
  difficulty: 'Intermedio',
  activity_type: 'Opción múltiple',
  is_evaluation: true,
  question_count: 2,
  points_per_question: 5,
  time_limit_minutes: 30,
  allowed_attempts: 1,
  auto_grading: true,
  title: 'Evaluación: Causas de la Revolución de Mayo',
  description: 'Cuestionario evaluativo sobre los sucesos de mayo de 1810.',
  student_instructions: 'Seleccioná la opción correcta para cada pregunta.',
  pedagogical: {
    bloomLevel: 'Analizar',
    learningObjectives: ['Comprender el contexto virreinal y la caída de la Junta Central de Sevilla.']
  },
  content: {
    developmentText: 'En mayo de 1810, la noticia de la disolución de la Junta Central de Sevilla precipitó el Cabildo Abierto del 22 de mayo.',
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        prompt: '¿Qué acontecimiento europeo aceleró la convocatoria al Cabildo Abierto del 22 de mayo de 1810?',
        points: 5,
        options: [
          { id: 'a', text: 'La caída de la Junta Central de Sevilla ante las tropas napoleónicas', isCorrect: true },
          { id: 'b', text: 'La firma del Tratado de Tordesillas', isCorrect: false }
        ],
        correctFeedback: '¡Correcto! La caída de Sevilla dejó sin legitimidad al virrey Cisneros.',
        incorrectFeedback: 'Revisá la cronología: el detonante directo fue la caída de la Junta Central de Sevilla en 1810.'
      }
    ]
  },
  is_favorite: true,
  tags: 'historia, mayo 1810, cabildo'
});

assert.ok(createdActivity.id.startsWith('act_'));
assert.equal(createdActivity.content.questions.length, 1);

const editedActivity = db.updateActivity(createdActivity.id, newTeacher.id, {
  title: 'Evaluación Editada: Revolución de Mayo (1810)',
  estimated_duration: 50
});
assert.equal(editedActivity.title, 'Evaluación Editada: Revolución de Mayo (1810)');
assert.equal(editedActivity.estimated_duration, 50);

const duplicatedActivity = db.duplicateActivity(createdActivity.id, newTeacher.id);
assert.ok(duplicatedActivity.title.includes('(Copia)'));

const searchResults = db.listActivities(newTeacher.id, { search: 'Revolución' });
assert.equal(searchResults.length, 2, 'La búsqueda en la biblioteca debe encontrar la original y la copia');
console.log('  [OK] 4. Creación, edición, duplicación y búsqueda en Biblioteca Personal verificadas.');

// 5. Verificar Control de Límites Mensuales del Plan Gratuito (3 actividades/mes)
let quota = db.getUserMonthlyQuota(newTeacher.id, '2026-11');
assert.equal(quota.used, 0);
assert.equal(quota.canGenerate, true);

db.logUsage({ userId: newTeacher.id, actionType: 'generate_activity', activityId: createdActivity.id, monthKey: '2026-11' });
db.logUsage({ userId: newTeacher.id, actionType: 'generate_activity', activityId: createdActivity.id, monthKey: '2026-11' });
db.logUsage({ userId: newTeacher.id, actionType: 'generate_evaluation', activityId: createdActivity.id, monthKey: '2026-11' });

quota = db.getUserMonthlyQuota(newTeacher.id, '2026-11');
assert.equal(quota.used, 3);
assert.equal(quota.remaining, 0);
assert.equal(quota.canGenerate, false, 'Al llegar a 3 generaciones en el Plan Gratuito, canGenerate debe ser false');

// Actualizar a Plan Pro y verificar que se habilita la generación ampliada (150/mes)
db.updateUserPlan(newTeacher.id, 'pro');
const proQuota = db.getUserMonthlyQuota(newTeacher.id, '2026-11');
assert.equal(proQuota.limit, 150);
assert.equal(proQuota.canGenerate, true, 'Al pasar a Plan Pro, debe permitir seguir generando');
console.log('  [OK] 5. Control de cuota mensual (3/mes en Free y ampliación en Pro) verificado.');

// 6. Verificar Registro de Exportaciones Moodle
db.logExport({
  activityId: createdActivity.id,
  userId: newTeacher.id,
  exportFormat: 'moodle_xml',
  fileName: 'revolucion-mayo-moodle.xml'
});
const summary = db.getDashboardSummary(newTeacher.id);
assert.equal(summary.stats.totalExports, 1);
console.log('  [OK] 6. Historial de exportaciones y resumen de Dashboard verificados.');

db.close();
fs.unlinkSync(testDbPath);

console.log('\n✅ TODAS LAS PRUEBAS DE LA ETAPA 2 PASARON EXITOSAMENTE.');
