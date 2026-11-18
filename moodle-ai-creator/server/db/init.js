import { MoodleAIDatabase } from './database.js';

const db = new MoodleAIDatabase();
const plans = db.getPlans();
const demoUser = db.getUserById('usr_docente_demo');
const summary = db.getDashboardSummary('usr_docente_demo');

console.log('==========================================================');
console.log(' MoodleAI Creator - Base de Datos Inicializada con Éxito');
console.log('==========================================================');
console.log('Archivo SQLite:', db.dbPath);
console.log('Planes cargados:', plans.map((p) => `${p.name} (límite: ${p.monthly_generation_limit}/mes)`).join(' | '));
console.log('Docente Demo:', `${demoUser.name} <${demoUser.email}> [${demoUser.plan_name}]`);
console.log('Actividades en biblioteca:', summary.stats.totalActivities);
console.log('==========================================================');

db.close();
