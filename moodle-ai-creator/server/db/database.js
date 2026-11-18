import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getCurrentMonthKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const derivedKey = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${derivedKey}`;
}

export function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, originalHash] = storedHash.split(':');
  const candidate = hashPassword(password, salt).split(':')[1];
  return crypto.timingSafeEqual(Buffer.from(originalHash, 'hex'), Buffer.from(candidate, 'hex'));
}

export class MoodleAIDatabase {
  constructor(customDbPath = null) {
    const defaultPath = path.resolve(__dirname, '../../data/moodleai.sqlite');
    this.dbPath = customDbPath || process.env.DB_PATH || defaultPath;

    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this.db = new DatabaseSync(this.dbPath);
    this.initSchema();
    this.seedDefaults();
  }

  initSchema() {
    const schemaPath = path.resolve(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
    this.db.exec(schemaSql);

    // Migraciones suaves para bases de datos existentes
    const planCols = this.db.prepare("PRAGMA table_info(plans)").all().map((c) => c.name);
    if (!planCols.includes('price_ars')) {
      this.db.exec('ALTER TABLE plans ADD COLUMN price_ars INTEGER NOT NULL DEFAULT 0');
    }

    const userCols = this.db.prepare("PRAGMA table_info(users)").all().map((c) => c.name);
    if (!userCols.includes('auth_provider')) {
      this.db.exec("ALTER TABLE users ADD COLUMN auth_provider TEXT NOT NULL DEFAULT 'local'");
    }
  }

  seedDefaults() {
    // 1. Sembrar o Actualizar Planes Comerciales en Pesos Argentinos (ARS)
    const upsertPlan = this.db.prepare(`
      INSERT INTO plans (
        id, name, description, monthly_generation_limit, price_ars,
        allow_h5p_export, allow_scorm_export, allow_moodle_native,
        allow_personal_library, allow_shared_library, price_display
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        description = excluded.description,
        monthly_generation_limit = excluded.monthly_generation_limit,
        price_ars = excluded.price_ars,
        price_display = excluded.price_display
    `);

    upsertPlan.run(
      'free',
      'Plan Gratuito',
      'Ideal para conocer la plataforma y crear hasta 3 actividades o evaluaciones por mes con exportación a Moodle.',
      3,
      0,
      1, 1, 1, 1, 0,
      'Gratis ($0 ARS / mes)'
    );

    upsertPlan.run(
      'pro',
      'Plan Docente Profesional',
      'Generación ampliada (150/mes), biblioteca personal completa y exportaciones avanzadas (Moodle XML, GIFT, SCORM 1.2/2004 y H5P).',
      150,
      25000,
      1, 1, 1, 1, 0,
      '$25.000 ARS / mes'
    );

    upsertPlan.run(
      'institutional',
      'Plan Institucional',
      'Para colegios, universidades e institutos. Gestión de usuarios, recursos compartidos y administración centralizada (1000/mes).',
      1000,
      50000,
      1, 1, 1, 1, 1,
      '$50.000 ARS / mes'
    );

    // 2. Sembrar Docente por defecto
    const userExists = this.db.prepare('SELECT id FROM users WHERE email = ?').get('docente@moodleai.edu.ar');
    if (!userExists) {
      const defaultUserId = 'usr_docente_demo';
      this.db.prepare(`
        INSERT INTO users (
          id, name, email, password_hash, role, institution,
          education_level, subject_specialty, bio, avatar_initials, plan_id, auth_provider
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        defaultUserId,
        'Prof. Mónica Battaglia',
        'docente@moodleai.edu.ar',
        hashPassword('Docente2026!'),
        'teacher',
        'Instituto Superior & Consultoría Tecnoeducativa',
        'Secundaria y Superior',
        'Tecnología Educativa, Ciencias y Accesibilidad (DUA)',
        'Docente y especialista en diseño instruccional, accesibilidad educativa y Moodle.',
        'MB',
        'free',
        'local'
      );

      const sampleActivityId = 'act_ejemplo_ecosistemas';
      const pedagogicalData = {
        learningObjectives: [
          'Identificar los componentes bióticos y abióticos de un ecosistema local.',
          'Analizar el flujo de energía en cadenas y redes tróficas aplicando pensamiento crítico.',
          'Proponer acciones concretas de conservación ambiental en su comunidad.'
        ],
        bloomLevel: 'Analizar y Aplicar (Niveles 3 y 4 de la Taxonomía de Bloom)',
        instructionalDesignPrinciples: [
          'Aprendizaje Activo: contextualización con ecosistemas de Argentina.',
          'Evaluación Formativa: retroalimentación inmediata explicando el porqué de cada respuesta.',
          'Accesibilidad e Inclusión (DUA / Lectura Fácil): consignas claras, vocabulario estructurado y apoyos conceptuales.'
        ],
        evaluationCriteria: [
          'Reconoce con precisión factores bióticos y abióticos en casos concretos.',
          'Relaciona correctamente productores, consumidores y descomponedores.',
          'Justifica la importancia del equilibrio ecológico.'
        ],
        pedagogicalRecommendations: 'Sugerimos proyectar primero el bloque de desarrollo en clase o habilitarlo como recurso previo en Moodle, y luego permitir 2 intentos en el cuestionario para fomentar la autoevaluación formativa.'
      };

      const contentData = {
        developmentText: 'Un ecosistema es un sistema biológico constituido por una comunidad de organismos vivos (factores bióticos) y el medio físico donde se relacionan (factores abióticos). La energía ingresa principalmente desde el Sol, es captada por los organismos autótrofos (productores) mediante la fotosíntesis y se transfiere a través de los consumidores y descomponedores.',
        questions: [
          {
            id: 'q1',
            type: 'multiple_choice',
            prompt: '¿Cuál de los siguientes elementos corresponde a un factor ABIÓTICO dentro de un ecosistema de humedal?',
            points: 2.5,
            options: [
              { id: 'a', text: 'La radiación solar y la salinidad del agua', isCorrect: true },
              { id: 'b', text: 'Las plantas acuáticas flotantes (camalotes)', isCorrect: false },
              { id: 'c', text: 'Las bacterias descomponedoras del sedimento', isCorrect: false },
              { id: 'd', text: 'Las aves migratorias que nidifican en la orilla', isCorrect: false }
            ],
            correctFeedback: '¡Excelente! La radiación solar y la salinidad del agua son condiciones físicas y químicas del entorno (factores abióticos).',
            incorrectFeedback: 'Revisá el concepto: los seres vivos (plantas, bacterias, aves) son factores bióticos. Los factores abióticos son los componentes físicos y químicos sin vida, como la luz solar y la salinidad.'
          },
          {
            id: 'q2',
            type: 'true_false',
            prompt: 'Los organismos descomponedores (como hongos y bacterias) transforman la materia orgánica muerta en nutrientes inorgánicos que vuelven a ser aprovechados por los productores.',
            points: 2.5,
            correctAnswer: true,
            options: [
              { id: 'true', text: 'Verdadero', isCorrect: true },
              { id: 'false', text: 'Falso', isCorrect: false }
            ],
            correctFeedback: '¡Muy bien! Los descomponedores cierran el ciclo de la materia devolviendo sales minerales al suelo o al agua.',
            incorrectFeedback: 'Atención: la afirmación es verdadera. Sin los descomponedores, la materia orgánica no se reciclaría para las plantas.'
          },
          {
            id: 'q3',
            type: 'fill_blanks',
            prompt: 'Los organismos que fabrican su propio alimento a partir de la energía solar mediante la fotosíntesis se denominan [[productores]] o autótrofos.',
            points: 2.5,
            blanks: ['productores'],
            correctFeedback: '¡Correcto! Los productores constituyen el primer eslabón de toda cadena trófica.',
            incorrectFeedback: 'La palabra buscada es "productores", ya que inician la cadena alimentaria.'
          },
          {
            id: 'q4',
            type: 'matching',
            prompt: 'Relacioná cada nivel trófico con su ejemplo correspondiente en un ecosistema terrestre:',
            points: 2.5,
            pairs: [
              { left: 'Productor autótrofo', right: 'Algarrobo blanco' },
              { left: 'Consumidor primario (herbívoro)', right: 'Mara o liebre patagónica' },
              { left: 'Consumidor secundario (carnívoro)', right: 'Puma' },
              { left: 'Descomponedor', right: 'Hongos del suelo' }
            ],
            correctFeedback: '¡Perfecto! Relacionaste correctamente cada organismo con su rol en la red trófica.',
            incorrectFeedback: 'Repasá qué rol cumple cada especie según su fuente de alimentación.'
          }
        ]
      };

      this.db.prepare(`
        INSERT INTO activities (
          id, user_id, subject, education_level, student_age, topic,
          learning_objective, estimated_duration, difficulty, activity_type,
          is_evaluation, question_count, points_per_question, time_limit_minutes,
          allowed_attempts, auto_grading, title, description, student_instructions,
          pedagogical_json, content_json, is_favorite, tags
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        sampleActivityId,
        defaultUserId,
        'Ciencias Naturales / Biología',
        'Secundaria',
        '13 a 15 años',
        'Ecosistemas, factores bióticos/abióticos y redes tróficas',
        'Diferenciar componentes del ecosistema y analizar cómo fluye la energía en una red trófica.',
        30,
        'Intermedio',
        'Cuestionarios',
        1,
        4,
        2.5,
        25,
        2,
        1,
        'Exploradores del Ecosistema: Redes Tróficas y Equilibrio Natural',
        'Actividad interactiva con enfoque de aprendizaje activo y evaluación formativa sobre ecosistemas y cadenas alimentarias.',
        'Leé con atención la introducción conceptual y respondé cada consigna. Al finalizar cada pregunta recibirás una explicación formativa para afianzar lo aprendido.',
        JSON.stringify(pedagogicalData),
        JSON.stringify(contentData),
        1,
        'biología, ecosistemas, moodle, evaluación formativa'
      );
    }
  }

  getPlans() {
    return this.db.prepare('SELECT * FROM plans ORDER BY monthly_generation_limit ASC').all();
  }

  getPlanById(planId) {
    return this.db.prepare('SELECT * FROM plans WHERE id = ?').get(planId);
  }

  getUserById(userId) {
    const user = this.db.prepare(`
      SELECT u.id, u.name, u.email, u.role, u.institution, u.education_level,
             u.subject_specialty, u.bio, u.avatar_initials, u.plan_id, u.auth_provider,
             u.created_at, p.name as plan_name, p.monthly_generation_limit,
             p.price_ars, p.price_display, p.allow_shared_library
      FROM users u
      LEFT JOIN plans p ON u.plan_id = p.id
      WHERE u.id = ?
    `).get(userId);
    if (!user) return null;
    const usage = this.getUserMonthlyQuota(user.id);
    return { ...user, quota: usage };
  }

  getUserByEmail(email) {
    return this.db.prepare('SELECT * FROM users WHERE lower(email) = lower(?)').get(email);
  }

  createUser({ id: customId = null, name, email, password, role = 'teacher', institution = '', education_level = 'Secundaria', subject_specialty = '', plan_id = 'free', auth_provider = 'local' }) {
    const existing = this.getUserByEmail(email);
    if (existing) {
      throw new Error('Ya existe una cuenta registrada con ese correo electrónico.');
    }
    const id = customId || ('usr_' + crypto.randomUUID().replace(/-/g, '').slice(0, 12));
    const initials = name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('') || 'DC';

    this.db.prepare(`
      INSERT INTO users (
        id, name, email, password_hash, role, institution,
        education_level, subject_specialty, avatar_initials, plan_id, auth_provider
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      name.trim(),
      email.trim().toLowerCase(),
      hashPassword(password || crypto.randomUUID()),
      role,
      institution.trim(),
      education_level,
      subject_specialty.trim(),
      initials,
      plan_id,
      auth_provider
    );

    return this.getUserById(id);
  }

  /**
   * Sincroniza un usuario autenticado mediante Supabase Auth con la base local
   */
  syncSupabaseUser({ supabaseId, email, name, institution = '', education_level = 'Secundaria', subject_specialty = '' }) {
    let existing = this.getUserById(supabaseId) || this.getUserByEmail(email);
    if (!existing) {
      return this.createUser({
        id: supabaseId,
        name: name || email.split('@')[0],
        email,
        password: crypto.randomUUID(),
        institution,
        education_level,
        subject_specialty,
        plan_id: 'free',
        auth_provider: 'supabase'
      });
    }
    if (existing.auth_provider !== 'supabase') {
      this.db.prepare("UPDATE users SET auth_provider = 'supabase' WHERE id = ?").run(existing.id);
    }
    return this.getUserById(existing.id);
  }

  updateUserProfile(userId, { name, institution, education_level, subject_specialty, bio }) {
    const current = this.getUserById(userId);
    if (!current) throw new Error('Usuario no encontrado');

    const updatedName = (name ?? current.name).trim();
    const initials = updatedName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('') || current.avatar_initials;

    this.db.prepare(`
      UPDATE users
      SET name = ?, institution = ?, education_level = ?, subject_specialty = ?,
          bio = ?, avatar_initials = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(
      updatedName,
      (institution ?? current.institution).trim(),
      education_level ?? current.education_level,
      (subject_specialty ?? current.subject_specialty).trim(),
      (bio ?? current.bio ?? '').trim(),
      initials,
      userId
    );

    return this.getUserById(userId);
  }

  updateUserPlan(userId, planId) {
    const plan = this.getPlanById(planId);
    if (!plan) throw new Error('El plan seleccionado no es válido.');
    this.db.prepare(`UPDATE users SET plan_id = ?, updated_at = datetime('now') WHERE id = ?`).run(planId, userId);
    return this.getUserById(userId);
  }

  // ==========================================================================
  // PAGOS Y SUSCRIPCIONES CON MERCADO PAGO (ARS)
  // ==========================================================================

  createPaymentRecord({ userId, planId, amountArs, mpPreferenceId = '', paymentMode = 'checkout_pro', status = 'pending', checkoutUrl = '' }) {
    const id = 'pay_' + crypto.randomUUID().replace(/-/g, '').slice(0, 12);
    this.db.prepare(`
      INSERT INTO payments (
        id, user_id, plan_id, amount_ars, currency, mp_preference_id, payment_mode, status, checkout_url
      ) VALUES (?, ?, ?, ?, 'ARS', ?, ?, ?, ?)
    `).run(id, userId, planId, Number(amountArs), mpPreferenceId, paymentMode, status, checkoutUrl);
    return this.getPaymentById(id);
  }

  getPaymentById(paymentId) {
    return this.db.prepare('SELECT * FROM payments WHERE id = ?').get(paymentId);
  }

  approvePaymentAndUpgradePlan({ paymentId, mpPaymentId = '' }) {
    const payment = this.getPaymentById(paymentId);
    if (!payment) throw new Error('Registro de pago no encontrado.');

    this.db.prepare(`
      UPDATE payments
      SET status = 'approved', mp_payment_id = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(mpPaymentId || 'mp_' + Date.now(), paymentId);

    const updatedUser = this.updateUserPlan(payment.user_id, payment.plan_id);
    this.logUsage({
      userId: payment.user_id,
      actionType: 'mercadopago_payment',
      aiProvider: 'mercadopago',
      details: `Pago aprobado en Mercado Pago ($${Number(payment.amount_ars).toLocaleString('es-AR')} ARS) -> Activación de ${updatedUser.plan_name}`
    });

    return {
      payment: this.getPaymentById(paymentId),
      user: updatedUser
    };
  }

  getUserPayments(userId, limit = 10) {
    return this.db.prepare(`
      SELECT pay.*, p.name as plan_name
      FROM payments pay
      LEFT JOIN plans p ON pay.plan_id = p.id
      WHERE pay.user_id = ?
      ORDER BY pay.created_at DESC
      LIMIT ?
    `).all(userId, limit);
  }

  // ==========================================================================
  // SESIONES DE AUTENTICACIÓN
  // ==========================================================================

  createSession(userId) {
    const token = 'sess_' + crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString();
    this.db.prepare(`INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)`).run(token, userId, expiresAt);
    return { token, expiresAt };
  }

  getUserBySessionToken(token) {
    if (!token) return null;
    const row = this.db.prepare(`SELECT user_id, expires_at FROM sessions WHERE token = ?`).get(token);
    if (!row) return null;
    if (new Date(row.expires_at) < new Date()) {
      this.db.prepare(`DELETE FROM sessions WHERE token = ?`).run(token);
      return null;
    }
    return this.getUserById(row.user_id);
  }

  deleteSession(token) {
    if (!token) return;
    this.db.prepare(`DELETE FROM sessions WHERE token = ?`).run(token);
  }

  // ==========================================================================
  // CONTROL DE CUOTA MENSUAL E HISTORIAL DE USO
  // ==========================================================================

  getUserMonthlyQuota(userId, monthKey = getCurrentMonthKey()) {
    const userRow = this.db.prepare(`
      SELECT u.plan_id, p.name as plan_name, p.monthly_generation_limit
      FROM users u
      JOIN plans p ON u.plan_id = p.id
      WHERE u.id = ?
    `).get(userId);

    if (!userRow) {
      return { monthKey, used: 0, limit: 3, remaining: 3, canGenerate: true };
    }

    const usedRow = this.db.prepare(`
      SELECT COUNT(*) as used
      FROM usage_logs
      WHERE user_id = ?
        AND month_key = ?
        AND action_type IN ('generate_activity', 'generate_evaluation')
    `).get(userId, monthKey);

    const used = Number(usedRow?.used || 0);
    const limit = Number(userRow.monthly_generation_limit);
    const remaining = Math.max(0, limit - used);

    return {
      monthKey,
      planId: userRow.plan_id,
      planName: userRow.plan_name,
      used,
      limit,
      remaining,
      canGenerate: used < limit
    };
  }

  logUsage({ userId, actionType, activityId = null, aiProvider = 'gemini', details = '', monthKey = getCurrentMonthKey() }) {
    const id = 'ulg_' + crypto.randomUUID().replace(/-/g, '').slice(0, 12);
    this.db.prepare(`
      INSERT INTO usage_logs (id, user_id, action_type, activity_id, month_key, ai_provider, details)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, userId, actionType, activityId, monthKey, aiProvider, details);
    return this.getUserMonthlyQuota(userId, monthKey);
  }

  getUsageHistory(userId, limit = 30) {
    return this.db.prepare(`
      SELECT u.id, u.action_type, u.activity_id, u.month_key, u.ai_provider, u.details, u.created_at,
             a.title as activity_title, a.subject as activity_subject
      FROM usage_logs u
      LEFT JOIN activities a ON u.activity_id = a.id
      WHERE u.user_id = ?
      ORDER BY u.created_at DESC
      LIMIT ?
    `).all(userId, limit);
  }

  // ==========================================================================
  // ACTIVIDADES, EVALUACIONES Y BIBLIOTECA PERSONAL
  // ==========================================================================

  formatActivityRow(row) {
    if (!row) return null;
    let pedagogical = {};
    let content = { developmentText: '', questions: [] };
    try {
      pedagogical = JSON.parse(row.pedagogical_json || '{}');
    } catch {
      pedagogical = {};
    }
    try {
      content = JSON.parse(row.content_json || '{"developmentText":"","questions":[]}');
    } catch {
      content = { developmentText: '', questions: [] };
    }
    return {
      ...row,
      is_evaluation: Boolean(row.is_evaluation),
      auto_grading: Boolean(row.auto_grading),
      is_favorite: Boolean(row.is_favorite),
      pedagogical,
      content
    };
  }

  createActivity(userId, data) {
    const id = 'act_' + crypto.randomUUID().replace(/-/g, '').slice(0, 12);
    const pedagogicalJson = typeof data.pedagogical === 'string'
      ? data.pedagogical
      : JSON.stringify(data.pedagogical || {});
    const contentJson = typeof data.content === 'string'
      ? data.content
      : JSON.stringify(data.content || { developmentText: '', questions: [] });

    this.db.prepare(`
      INSERT INTO activities (
        id, user_id, subject, education_level, student_age, topic,
        learning_objective, estimated_duration, difficulty, activity_type,
        is_evaluation, question_count, points_per_question, time_limit_minutes,
        allowed_attempts, auto_grading, title, description, student_instructions,
        pedagogical_json, content_json, is_favorite, tags
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      userId,
      data.subject,
      data.education_level,
      data.student_age,
      data.topic,
      data.learning_objective,
      Number(data.estimated_duration || 30),
      data.difficulty || 'Intermedio',
      data.activity_type,
      data.is_evaluation ? 1 : 0,
      Number(data.question_count || (data.content?.questions?.length ?? 5)),
      Number(data.points_per_question || 2.0),
      Number(data.time_limit_minutes || 30),
      Number(data.allowed_attempts || 2),
      data.auto_grading !== undefined ? (data.auto_grading ? 1 : 0) : 1,
      data.title,
      data.description,
      data.student_instructions,
      pedagogicalJson,
      contentJson,
      data.is_favorite ? 1 : 0,
      data.tags || ''
    );

    return this.getActivityById(id, userId);
  }

  getActivityById(activityId, userId = null) {
    const row = userId
      ? this.db.prepare('SELECT * FROM activities WHERE id = ? AND user_id = ?').get(activityId, userId)
      : this.db.prepare('SELECT * FROM activities WHERE id = ?').get(activityId);
    return this.formatActivityRow(row);
  }

  listActivities(userId, { search = '', subject = '', activityType = '', isEvaluation = null, onlyFavorites = false } = {}) {
    let sql = 'SELECT * FROM activities WHERE user_id = ?';
    const params = [userId];

    if (subject && subject !== 'Todas') {
      sql += ' AND lower(subject) = lower(?)';
      params.push(subject);
    }

    if (activityType && activityType !== 'Todos') {
      sql += ' AND activity_type = ?';
      params.push(activityType);
    }

    if (isEvaluation !== null && isEvaluation !== undefined && isEvaluation !== '') {
      sql += ' AND is_evaluation = ?';
      params.push(isEvaluation ? 1 : 0);
    }

    if (onlyFavorites) {
      sql += ' AND is_favorite = 1';
    }

    if (search && search.trim() !== '') {
      sql += ' AND (lower(title) LIKE ? OR lower(topic) LIKE ? OR lower(subject) LIKE ? OR lower(tags) LIKE ?)';
      const term = `%${search.trim().toLowerCase()}%`;
      params.push(term, term, term, term);
    }

    sql += ' ORDER BY updated_at DESC, created_at DESC';
    const rows = this.db.prepare(sql).all(...params);
    return rows.map((r) => this.formatActivityRow(r));
  }

  updateActivity(activityId, userId, updates) {
    const current = this.getActivityById(activityId, userId);
    if (!current) throw new Error('Actividad no encontrada en tu biblioteca.');

    const nextPedagogical = updates.pedagogical
      ? JSON.stringify(updates.pedagogical)
      : current.pedagogical_json;

    const nextContent = updates.content
      ? JSON.stringify(updates.content)
      : current.content_json;

    const nextQuestionCount = updates.content?.questions
      ? updates.content.questions.length
      : Number(updates.question_count ?? current.question_count);

    this.db.prepare(`
      UPDATE activities
      SET title = ?,
          description = ?,
          student_instructions = ?,
          subject = ?,
          education_level = ?,
          student_age = ?,
          topic = ?,
          learning_objective = ?,
          estimated_duration = ?,
          difficulty = ?,
          activity_type = ?,
          is_evaluation = ?,
          question_count = ?,
          points_per_question = ?,
          time_limit_minutes = ?,
          allowed_attempts = ?,
          auto_grading = ?,
          pedagogical_json = ?,
          content_json = ?,
          is_favorite = ?,
          tags = ?,
          updated_at = datetime('now')
      WHERE id = ? AND user_id = ?
    `).run(
      updates.title ?? current.title,
      updates.description ?? current.description,
      updates.student_instructions ?? current.student_instructions,
      updates.subject ?? current.subject,
      updates.education_level ?? current.education_level,
      updates.student_age ?? current.student_age,
      updates.topic ?? current.topic,
      updates.learning_objective ?? current.learning_objective,
      Number(updates.estimated_duration ?? current.estimated_duration),
      updates.difficulty ?? current.difficulty,
      updates.activity_type ?? current.activity_type,
      (updates.is_evaluation ?? current.is_evaluation) ? 1 : 0,
      nextQuestionCount,
      Number(updates.points_per_question ?? current.points_per_question),
      Number(updates.time_limit_minutes ?? current.time_limit_minutes),
      Number(updates.allowed_attempts ?? current.allowed_attempts),
      (updates.auto_grading ?? current.auto_grading) ? 1 : 0,
      nextPedagogical,
      nextContent,
      (updates.is_favorite ?? current.is_favorite) ? 1 : 0,
      updates.tags ?? current.tags,
      activityId,
      userId
    );

    return this.getActivityById(activityId, userId);
  }

  duplicateActivity(activityId, userId) {
    const original = this.getActivityById(activityId, userId);
    if (!original) throw new Error('No se encontró la actividad original para duplicar.');

    return this.createActivity(userId, {
      ...original,
      title: `${original.title} (Copia)`,
      pedagogical: original.pedagogical,
      content: original.content
    });
  }

  deleteActivity(activityId, userId) {
    const res = this.db.prepare('DELETE FROM activities WHERE id = ? AND user_id = ?').run(activityId, userId);
    return res.changes > 0;
  }

  logExport({ activityId, userId, exportFormat, fileName }) {
    const id = 'exp_' + crypto.randomUUID().replace(/-/g, '').slice(0, 12);
    this.db.prepare(`
      INSERT INTO export_history (id, activity_id, user_id, export_format, file_name)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, activityId, userId, exportFormat, fileName);

    this.db.prepare(`
      UPDATE activities SET export_count = export_count + 1 WHERE id = ?
    `).run(activityId);

    this.logUsage({
      userId,
      actionType: 'export',
      activityId,
      aiProvider: 'exporter',
      details: `Exportación en formato ${exportFormat} (${fileName})`
    });

    return { id, activityId, exportFormat, fileName };
  }

  getDashboardSummary(userId) {
    const user = this.getUserById(userId);
    const allActivities = this.listActivities(userId);
    const totalActivities = allActivities.length;
    const totalEvaluations = allActivities.filter((a) => a.is_evaluation).length;
    const totalFavorites = allActivities.filter((a) => a.is_favorite).length;
    const totalExportsRow = this.db.prepare('SELECT COUNT(*) as total FROM export_history WHERE user_id = ?').get(userId);

    const subjectsMap = {};
    for (const act of allActivities) {
      subjectsMap[act.subject] = (subjectsMap[act.subject] || 0) + 1;
    }

    return {
      user,
      stats: {
        totalActivities,
        totalEvaluations,
        totalFavorites,
        totalExports: Number(totalExportsRow?.total || 0),
        subjectsBreakdown: subjectsMap
      },
      recentActivities: allActivities.slice(0, 5),
      savedFavorites: allActivities.filter((a) => a.is_favorite).slice(0, 4)
    };
  }

  close() {
    this.db.close();
  }
}
