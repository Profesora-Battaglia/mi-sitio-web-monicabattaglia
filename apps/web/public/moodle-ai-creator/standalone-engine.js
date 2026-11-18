/**
 * MoodleAI Creator — Motor Autónomo e Integración Directa con Tablas de Supabase
 * (moodleai_plans, moodleai_profiles, moodleai_activities, moodleai_usage_logs, moodleai_payments)
 * Funciona tanto con el backend Node.js + SQLite como en Hostinger conectado al
 * subproyecto de Supabase dentro de "claseiaxpress" (o en modo local si no hay sesión).
 */

const STORAGE_KEY = 'moodleai_creator_web_db_v2_ars';

const DEFAULT_PLANS = [
  {
    id: 'free',
    name: 'Plan Gratuito',
    description: 'Ideal para conocer la plataforma y crear hasta 3 actividades o evaluaciones por mes con exportación a Moodle.',
    monthly_generation_limit: 3,
    price_ars: 0,
    price_display: 'Gratis ($0 ARS / mes)'
  },
  {
    id: 'pro',
    name: 'Plan Docente Profesional',
    description: 'Generación ampliada (150/mes), biblioteca personal completa y exportaciones avanzadas (Moodle XML, GIFT, SCORM 1.2/2004 y H5P).',
    monthly_generation_limit: 150,
    price_ars: 25000,
    price_display: '$25.000 ARS / mes'
  },
  {
    id: 'institutional',
    name: 'Plan Institucional',
    description: 'Para colegios, universidades e institutos. Gestión de usuarios, recursos compartidos y administración centralizada (1000/mes).',
    monthly_generation_limit: 1000,
    price_ars: 50000,
    price_display: '$50.000 ARS / mes'
  }
];

function getMonthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function getSupabaseClientInstance() {
  if (window.__MOODLEAI_SB_CLIENT__) return window.__MOODLEAI_SB_CLIENT__;
  const cfg = window.__MOODLEAI_CONFIG__ || {};
  const url = cfg.SUPABASE_URL || '';
  const key = cfg.SUPABASE_ANON_KEY || '';
  if (
    url &&
    key &&
    !url.includes('tu-nuevo-proyecto') &&
    !key.includes('tu_supabase_anon_key') &&
    window.supabase &&
    typeof window.supabase.createClient === 'function'
  ) {
    window.__MOODLEAI_SB_CLIENT__ = window.supabase.createClient(url, key);
    return window.__MOODLEAI_SB_CLIENT__;
  }
  return null;
}

function loadWebDb() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }

  const initialDb = {
    currentUserId: 'usr_docente_demo',
    users: [
      {
        id: 'usr_docente_demo',
        name: 'Prof. Mónica Battaglia',
        email: 'docente@moodleai.edu.ar',
        password: 'Docente2026!',
        role: 'teacher',
        institution: 'Instituto Superior & Consultoría Tecnoeducativa',
        education_level: 'Secundaria y Superior',
        subject_specialty: 'Tecnología Educativa, Ciencias y Accesibilidad (DUA)',
        bio: 'Docente y especialista en diseño instruccional, accesibilidad educativa y Moodle.',
        avatar_initials: 'MB',
        plan_id: 'free',
        auth_provider: 'local'
      }
    ],
    activities: [
      {
        id: 'act_ejemplo_ecosistemas',
        user_id: 'usr_docente_demo',
        subject: 'Ciencias Naturales / Biología',
        education_level: 'Secundaria',
        student_age: '13 a 15 años',
        topic: 'Ecosistemas, factores bióticos/abióticos y redes tróficas',
        learning_objective: 'Diferenciar componentes del ecosistema y analizar cómo fluye la energía en una red trófica.',
        estimated_duration: 30,
        difficulty: 'Intermedio',
        activity_type: 'Cuestionarios',
        is_evaluation: true,
        question_count: 4,
        points_per_question: 2.5,
        time_limit_minutes: 25,
        allowed_attempts: 2,
        auto_grading: true,
        title: 'Exploradores del Ecosistema: Redes Tróficas y Equilibrio Natural',
        description: 'Actividad interactiva con enfoque de aprendizaje activo y evaluación formativa sobre ecosistemas y cadenas alimentarias.',
        student_instructions: 'Leé con atención la introducción conceptual y respondé cada consigna. Al finalizar cada pregunta recibirás una explicación formativa para afianzar lo aprendido.',
        is_favorite: true,
        tags: 'biología, ecosistemas, moodle, evaluación formativa',
        export_count: 0,
        created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        pedagogical: {
          bloomLevel: 'Analizar y Aplicar (Niveles 3 y 4 de la Taxonomía de Bloom)',
          learningObjectives: [
            'Identificar los componentes bióticos y abióticos de un ecosistema local.',
            'Analizar el flujo de energía en cadenas y redes tróficas aplicando pensamiento crítico.',
            'Proponer acciones concretas de conservación ambiental en su comunidad.'
          ],
          instructionalDesignPrinciples: [
            'Aprendizaje Activo: contextualización con ecosistemas de Argentina.',
            'Evaluación Formativa: retroalimentación inmediata explicando el porqué de cada respuesta.',
            'Accesibilidad e Inclusión (DUA / Lectura Fácil): consignas claras y vocabulario estructurado.'
          ],
          evaluationCriteria: [
            'Reconoce con precisión factores bióticos y abióticos en casos concretos.',
            'Relaciona correctamente productores, consumidores y descomponedores.',
            'Justifica la importancia del equilibrio ecológico.'
          ],
          pedagogicalRecommendations: 'Sugerimos proyectar primero el bloque de desarrollo en clase o habilitarlo como recurso previo en Moodle, y luego permitir 2 intentos en el cuestionario para fomentar la autoevaluación formativa.'
        },
        content: {
          developmentText: 'Un ecosistema es un sistema biológico constituido por una comunidad de organismos vivos (factores bióticos) y el medio físico donde se relacionan (factores abióticos). La energía ingresa principalmente desde el Sol, es captada por los organismos autótrofos (productores) mediante la fotosíntesis y se transfiere a través de los consumidores y descomponedores.',
          activityTypeMeta: {
            type: 'Cuestionarios',
            words: ['PRODUCTORES', 'ABIOTICO', 'ECOSISTEMA', 'TROFICA']
          },
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
              incorrectFeedback: 'Revisá el concepto: los seres vivos son factores bióticos. Los factores abióticos son los componentes físicos y químicos sin vida.'
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
              correctFeedback: '¡Muy bien! Los descomponedores cierran el ciclo de la materia devolviendo sales minerales al suelo.',
              incorrectFeedback: 'Atención: la afirmación es verdadera. Sin los descomponedores, la materia orgánica no se reciclaría.'
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
        }
      }
    ],
    usageLogs: [],
    payments: [],
    exportsCount: 0
  };

  saveWebDb(initialDb);
  return initialDb;
}

function saveWebDb(db) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    // ignore
  }
}

function enrichUser(db, user) {
  const plan = DEFAULT_PLANS.find((p) => p.id === user.plan_id) || DEFAULT_PLANS[0];
  const monthKey = getMonthKey();
  const used = db.usageLogs.filter(
    (u) => u.user_id === user.id && u.month_key === monthKey && (u.action_type === 'generate_activity' || u.action_type === 'generate_evaluation')
  ).length;
  const limit = plan.monthly_generation_limit;
  return {
    ...user,
    plan_name: plan.name,
    monthly_generation_limit: limit,
    price_ars: plan.price_ars,
    price_display: plan.price_display,
    quota: {
      monthKey,
      planId: plan.id,
      planName: plan.name,
      used,
      limit,
      remaining: Math.max(0, limit - used),
      canGenerate: used < limit
    }
  };
}

// ============================================================================
// EMPAQUETADOR PKZIP BINARIO EN NAVEGADOR (CRC32 + STORE)
// ============================================================================
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32Bytes(uint8) {
  let crc = 0xffffffff;
  for (let i = 0; i < uint8.length; i++) {
    crc = CRC_TABLE[(crc ^ uint8[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export function buildBrowserZipBlob(files = []) {
  const encoder = new TextEncoder();
  const localChunks = [];
  const centralChunks = [];
  let offset = 0;

  for (const f of files) {
    const nameBytes = encoder.encode(f.path);
    const dataBytes = encoder.encode(String(f.content ?? ''));
    const crc = crc32Bytes(dataBytes);

    const localHeader = new Uint8Array(30 + nameBytes.length);
    const lv = new DataView(localHeader.buffer);
    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(4, 20, true);
    lv.setUint16(6, 0x0800, true);
    lv.setUint16(8, 0, true);
    lv.setUint16(10, 0, true);
    lv.setUint16(12, 0x5421, true);
    lv.setUint32(14, crc, true);
    lv.setUint32(18, dataBytes.length, true);
    lv.setUint32(22, dataBytes.length, true);
    lv.setUint16(26, nameBytes.length, true);
    lv.setUint16(28, 0, true);
    localHeader.set(nameBytes, 30);

    localChunks.push(localHeader, dataBytes);

    const centralHeader = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(centralHeader.buffer);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true);
    cv.setUint16(6, 20, true);
    cv.setUint16(8, 0x0800, true);
    cv.setUint16(10, 0, true);
    cv.setUint16(12, 0, true);
    cv.setUint16(14, 0x5421, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, dataBytes.length, true);
    cv.setUint32(24, dataBytes.length, true);
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint16(30, 0, true);
    cv.setUint16(32, 0, true);
    cv.setUint16(34, 0, true);
    cv.setUint16(36, 0, true);
    cv.setUint32(38, 0, true);
    cv.setUint32(42, offset, true);
    centralHeader.set(nameBytes, 46);

    centralChunks.push(centralHeader);
    offset += localHeader.length + dataBytes.length;
  }

  let centralSize = 0;
  for (const c of centralChunks) centralSize += c.length;

  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(4, 0, true);
  ev.setUint16(6, 0, true);
  ev.setUint16(8, files.length, true);
  ev.setUint16(10, files.length, true);
  ev.setUint32(12, centralSize, true);
  ev.setUint32(16, offset, true);
  ev.setUint16(20, 0, true);

  return new Blob([...localChunks, ...centralChunks, eocd], { type: 'application/zip' });
}

function escXml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function slug(text) {
  return (
    String(text || 'actividad-moodle')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 55) || 'actividad-moodle'
  );
}

export function buildExportDataClient(act, format) {
  const questions = act.content?.questions || [];
  const baseSlug = slug(act.title);

  if (format === 'moodle_xml') {
    const lines = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<quiz>',
      '  <question type="category">',
      `    <category><text>${escXml(`$course$/top/MoodleAI Creator/${act.subject}/${act.title}`)}</text></category>`,
      '  </question>'
    ];
    questions.forEach((q, idx) => {
      const grade = Number(q.points || 2).toFixed(7);
      const qName = `${String(idx + 1).padStart(2, '0')}. ${act.topic}`;
      if (q.type === 'multiple_choice') {
        lines.push('  <question type="multichoice">');
        lines.push(`    <name><text>${escXml(qName)}</text></name>`);
        lines.push(`    <questiontext format="html"><text><![CDATA[<p>${escXml(q.prompt)}</p>]]></text></questiontext>`);
        lines.push(`    <defaultgrade>${grade}</defaultgrade><single>true</single><shuffleanswers>true</shuffleanswers>`);
        (q.options || []).forEach((opt) => {
          lines.push(`    <answer fraction="${opt.isCorrect ? '100' : '0'}" format="html">`);
          lines.push(`      <text><![CDATA[<p>${escXml(opt.text)}</p>]]></text>`);
          lines.push(`      <feedback format="html"><text><![CDATA[<p>${escXml(opt.isCorrect ? q.correctFeedback : q.incorrectFeedback)}</p>]]></text></feedback>`);
          lines.push('    </answer>');
        });
        lines.push('  </question>');
      } else if (q.type === 'true_false') {
        const isT = Boolean(q.correctAnswer ?? true);
        lines.push('  <question type="truefalse">');
        lines.push(`    <name><text>${escXml(qName)}</text></name>`);
        lines.push(`    <questiontext format="html"><text><![CDATA[<p>${escXml(q.prompt)}</p>]]></text></questiontext>`);
        lines.push(`    <defaultgrade>${grade}</defaultgrade>`);
        lines.push(`    <answer fraction="${isT ? '100' : '0'}" format="moodle_auto_format"><text>true</text></answer>`);
        lines.push(`    <answer fraction="${!isT ? '100' : '0'}" format="moodle_auto_format"><text>false</text></answer>`);
        lines.push('  </question>');
      } else if (q.type === 'fill_blanks' || q.type === 'crossword_clue') {
        const ans = q.answerTerm || (q.blanks && q.blanks[0]) || 'respuesta';
        lines.push('  <question type="shortanswer">');
        lines.push(`    <name><text>${escXml(qName)}</text></name>`);
        lines.push(`    <questiontext format="html"><text><![CDATA[<p>${escXml(q.prompt)}</p>]]></text></questiontext>`);
        lines.push(`    <defaultgrade>${grade}</defaultgrade>`);
        lines.push(`    <answer fraction="100" format="moodle_auto_format"><text>${escXml(ans)}</text></answer>`);
        lines.push('  </question>');
      } else if (q.type === 'matching' || q.type === 'ordering') {
        const pairs = q.type === 'ordering'
          ? (q.sequence || []).map((s, i) => ({ left: s, right: `Paso ${i + 1}` }))
          : (q.pairs || []);
        lines.push('  <question type="matching">');
        lines.push(`    <name><text>${escXml(qName)}</text></name>`);
        lines.push(`    <questiontext format="html"><text><![CDATA[<p>${escXml(q.prompt)}</p>]]></text></questiontext>`);
        lines.push(`    <defaultgrade>${grade}</defaultgrade>`);
        pairs.forEach((p) => {
          lines.push(`    <subquestion format="html"><text><![CDATA[<p>${escXml(p.left)}</p>]]></text><answer><text>${escXml(p.right)}</text></answer></subquestion>`);
        });
        lines.push('  </question>');
      } else {
        lines.push('  <question type="essay">');
        lines.push(`    <name><text>${escXml(qName)}</text></name>`);
        lines.push(`    <questiontext format="html"><text><![CDATA[<p>${escXml(q.prompt)}</p>]]></text></questiontext>`);
        lines.push(`    <defaultgrade>${grade}</defaultgrade><responseformat>editor</responseformat>`);
        lines.push('  </question>');
      }
    });
    lines.push('</quiz>');
    const content = lines.join('\n');
    return {
      fileName: `${baseSlug}-moodle.xml`,
      content,
      blob: new Blob([content], { type: 'application/xml;charset=utf-8' }),
      importGuide: [
        '1. Entrá a tu curso en Moodle y abrí Más → Banco de preguntas → Importar.',
        '2. Seleccioná "Formato Moodle XML" y subí el archivo descargado.',
        '3. Hacé clic en Importar.'
      ]
    };
  }

  if (format === 'gift') {
    const lines = [
      `// Generado por MoodleAI Creator`,
      `$CATEGORY: $course$/top/MoodleAI Creator/${act.subject}/${act.title}`,
      ''
    ];
    questions.forEach((q, idx) => {
      const qTitle = `Q${idx + 1}`;
      if (q.type === 'multiple_choice') {
        lines.push(`::${qTitle}::${q.prompt} {`);
        (q.options || []).forEach((o) => {
          lines.push(`  ${o.isCorrect ? '=' : '~'}${o.text} #${o.isCorrect ? q.correctFeedback : q.incorrectFeedback}`);
        });
        lines.push('}\n');
      } else if (q.type === 'true_false') {
        const isT = Boolean(q.correctAnswer ?? true);
        lines.push(`::${qTitle}::${q.prompt} {${isT ? 'TRUE' : 'FALSE'} #${q.incorrectFeedback} #${q.correctFeedback}}\n`);
      } else if (q.type === 'fill_blanks' || q.type === 'crossword_clue') {
        const ans = q.answerTerm || (q.blanks && q.blanks[0]) || 'respuesta';
        lines.push(`::${qTitle}::${q.prompt} { =${ans} #${q.correctFeedback} }\n`);
      } else if (q.type === 'matching' || q.type === 'ordering') {
        const pairs = q.type === 'ordering'
          ? (q.sequence || []).map((s, i) => ({ left: s, right: `Paso ${i + 1}` }))
          : (q.pairs || []);
        lines.push(`::${qTitle}::${q.prompt} {`);
        pairs.forEach((p) => lines.push(`  =${p.left} -> ${p.right}`));
        lines.push('}\n');
      } else {
        lines.push(`::${qTitle}::${q.prompt} {}\n`);
      }
    });
    const content = lines.join('\n');
    return {
      fileName: `${baseSlug}-moodle.gift.txt`,
      content,
      blob: new Blob([content], { type: 'text/plain;charset=utf-8' }),
      importGuide: [
        '1. Entrá a tu curso en Moodle y abrí Más → Banco de preguntas → Importar.',
        '2. Seleccioná "Formato GIFT" y subí el archivo descargado.'
      ]
    };
  }

  if (format === 'scorm_12' || format === 'scorm_2004') {
    const is2004 = format === 'scorm_2004';
    const manifest = `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="MANIFEST_MOODLEAI" version="1.1"
  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>${is2004 ? '2004 3rd Edition' : '1.2'}</schemaversion>
  </metadata>
  <organizations default="ORG_1">
    <organization identifier="ORG_1">
      <title>${escXml(act.title)}</title>
      <item identifier="ITEM_1" identifierref="RES_1">
        <title>${escXml(act.title)}</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="RES_1" type="webcontent" adlcp:scormtype="sco" href="index.html">
      <file href="index.html"/>
      <file href="scorm-driver.js"/>
    </resource>
  </resources>
</manifest>`;

    const scormDriver = `window.addEventListener('load', function(){
  var api = window.API || (window.parent && window.parent.API);
  if(api && api.LMSInitialize){ api.LMSInitialize(''); api.LMSSetValue('cmi.core.lesson_status','completed'); api.LMSSetValue('cmi.core.score.raw','100'); api.LMSCommit(''); }
});`;
    const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"/><title>${escXml(act.title)}</title></head><body style="font-family:sans-serif;max-width:800px;margin:20px auto;padding:20px;"><h1>${escXml(act.title)}</h1><p>${escXml(act.content?.developmentText || '')}</p><script src="scorm-driver.js"></script></body></html>`;

    const files = [
      { path: 'imsmanifest.xml', content: manifest },
      { path: 'index.html', content: html },
      { path: 'scorm-driver.js', content: scormDriver }
    ];
    return {
      fileName: `${baseSlug}-${is2004 ? 'scorm2004' : 'scorm12'}.zip`,
      content: manifest,
      blob: buildBrowserZipBlob(files),
      importGuide: [
        '1. Activá Modo de edición en Moodle → Añadir una actividad o recurso → Paquete SCORM.',
        '2. Subí este archivo .zip y guardá los cambios.'
      ]
    };
  }

  const h5pJson = {
    title: act.title,
    language: 'es',
    mainLibrary: 'H5P.QuestionSet',
    embedTypes: ['div'],
    license: 'U',
    preloadedDependencies: [
      { machineName: 'H5P.QuestionSet', majorVersion: 1, minorVersion: 20 },
      { machineName: 'H5P.MultiChoice', majorVersion: 1, minorVersion: 16 },
      { machineName: 'H5P.TrueFalse', majorVersion: 1, minorVersion: 8 },
      { machineName: 'H5P.Blanks', majorVersion: 1, minorVersion: 14 },
      { machineName: 'H5P.DragText', majorVersion: 1, minorVersion: 10 },
      { machineName: 'H5P.Essay', majorVersion: 1, minorVersion: 5 }
    ]
  };
  const contentJson = {
    introPage: { showIntroPage: true, title: act.title, introduction: `<p>${escXml(act.content?.developmentText || '')}</p>` },
    passPercentage: 60,
    questions: questions.map((q, i) => ({
      library: 'H5P.MultiChoice 1.16',
      subContentId: `00000000-0000-4000-8000-${String(i + 1).padStart(12, '0')}`,
      metadata: { contentType: 'Multiple Choice', license: 'U', title: `Pregunta ${i + 1}` },
      params: {
        question: `<p>${escXml(q.prompt)}</p>`,
        answers: (q.options || [{ text: 'Correcta', isCorrect: true }]).map((o) => ({
          text: `<div>${escXml(o.text)}</div>`,
          correct: Boolean(o.isCorrect)
        }))
      }
    }))
  };

  const files = [
    { path: 'h5p.json', content: JSON.stringify(h5pJson, null, 2) },
    { path: 'content/content.json', content: JSON.stringify(contentJson, null, 2) }
  ];
  return {
    fileName: `${baseSlug}.h5p`,
    content: `--- h5p.json ---\n${JSON.stringify(h5pJson, null, 2)}\n\n--- content/content.json ---\n${JSON.stringify(contentJson, null, 2)}`,
    blob: buildBrowserZipBlob(files),
    importGuide: [
      '1. En tu curso de Moodle, abrí Banco de contenido → Subir (o añadí una actividad H5P).',
      '2. Subí este paquete .h5p validado y guardá los cambios.'
    ]
  };
}

function generateLocalPedagogicalActivity(body) {
  const subject = body.subject || 'Ciencias';
  const topic = body.topic || 'Tema de estudio';
  const level = body.education_level || 'Secundaria';
  const age = body.student_age || '13 a 15 años';
  const objective = body.learning_objective || 'Comprender y aplicar los conceptos principales.';
  const difficulty = body.difficulty || 'Intermedio';
  const activityType = body.activity_type || 'Opción múltiple';
  const count = Math.min(15, Math.max(1, Number(body.question_count || 4)));
  const pts = Number(body.points_per_question || 2.5);
  const isEval = Boolean(body.is_evaluation);

  const questions = [];
  for (let i = 0; i < count; i++) {
    let qType = 'multiple_choice';
    if (activityType === 'Verdadero o falso') qType = 'true_false';
    else if (activityType === 'Completar espacios') qType = 'fill_blanks';
    else if (activityType === 'Relacionar columnas') qType = 'matching';
    else if (activityType === 'Ordenar secuencias') qType = 'ordering';
    else if (activityType === 'Preguntas abiertas' || activityType === 'Actividades de reflexión') qType = 'essay';
    else if (activityType === 'Crucigramas' || activityType === 'Sopa de letras') qType = 'crossword_clue';
    else if (activityType === 'Cuestionarios' || activityType === 'Gamificación') {
      const cycle = ['multiple_choice', 'true_false', 'fill_blanks', 'matching'];
      qType = cycle[i % cycle.length];
    }

    questions.push({
      id: `q${i + 1}`,
      type: qType,
      prompt: `[Consigna ${i + 1}] En el estudio de "${topic}" (${subject}), ¿cómo se articula este concepto para lograr: ${objective.toLowerCase()}?`,
      points: pts,
      correctAnswer: true,
      options: [
        { id: 'a', text: `Integra las variables principales de ${topic} aplicándolas a situaciones reales de ${subject}.`, isCorrect: true },
        { id: 'b', text: `Considera a ${topic} como un fenómeno aislado sin relación con el entorno.`, isCorrect: false },
        { id: 'c', text: `Limita el análisis a la repetición memorística sin evidencia práctica.`, isCorrect: false },
        { id: 'd', text: `Descarta la influencia de los factores contextuales en ${topic}.`, isCorrect: false }
      ],
      blanks: ['concepto'],
      answerTerm: 'CONCEPTO',
      pairs: [
        { left: `Eje central de ${topic}`, right: 'Comprensión conceptual y definición' },
        { left: 'Aplicación práctica', right: `Resolución de casos en ${subject}` },
        { left: 'Evaluación formativa', right: 'Verificación de evidencias y mejora continua' }
      ],
      sequence: [
        `1. Identificación de variables clave en ${topic}`,
        `2. Análisis de relaciones causa-efecto en ${subject}`,
        `3. Aplicación al caso práctico y verificación de resultados`
      ],
      rubric: `Criterios: precisión conceptual sobre ${topic}, uso de vocabulario de ${subject} y ejemplo práctico.`,
      correctFeedback: `¡Excelente! Analizaste correctamente la relación conceptual y práctica de "${topic}".`,
      incorrectFeedback: `Revisá el desarrollo teórico de "${topic}" teniendo en cuenta su aplicación en ${subject}.`
    });
  }

  return {
    id: 'act_' + Math.random().toString(36).slice(2, 11),
    subject,
    education_level: level,
    student_age: age,
    topic,
    learning_objective: objective,
    estimated_duration: Number(body.estimated_duration || 30),
    difficulty,
    activity_type: activityType,
    is_evaluation: isEval,
    question_count: count,
    points_per_question: pts,
    time_limit_minutes: Number(body.time_limit_minutes || 30),
    allowed_attempts: Number(body.allowed_attempts ?? 2),
    auto_grading: true,
    title: `${isEval ? 'Evaluación' : activityType}: ${topic}`,
    description: `${isEval ? 'Evaluación calificable' : 'Actividad interactiva'} para ${level} (${age}) en ${subject}.`,
    student_instructions: `Leé el desarrollo conceptual sobre "${topic}" y resolvé las ${count} consignas interactivas prestando atención a la retroalimentación formativa.`,
    is_favorite: false,
    tags: body.tags || `${subject}, ${activityType}`,
    created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
    updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
    pedagogical: {
      bloomLevel: `Aplicar y Analizar (Taxonomía de Bloom — Nivel ${difficulty})`,
      learningObjectives: [objective, `Aplicar conceptos de ${topic} en situaciones reales de ${subject}.`],
      instructionalDesignPrinciples: [
        'Aprendizaje Activo y contextualización curricular.',
        'Evaluación Formativa con retroalimentación inmediata.',
        'Accesibilidad e Inclusión (DUA y Lectura Fácil).'
      ],
      evaluationCriteria: [
        `Comprende y relaciona los conceptos clave de ${topic}.`,
        `Resuelve las consignas aplicando razonamiento crítico.`
      ],
      pedagogicalRecommendations: `Se sugiere habilitar 2 intentos en Moodle para que los estudiantes aprovechen la retroalimentación formativa.`
    },
    content: {
      developmentText: `El estudio de "${topic}" dentro de ${subject} (${level}) permite a los estudiantes de ${age} ${objective.toLowerCase()}. A través de esta propuesta pedagógica activa, se abordan los conceptos fundamentales, sus relaciones causales y su transferencia a situaciones cotidianas.`,
      activityTypeMeta: {
        type: activityType,
        words: ['CONCEPTO', 'ANALISIS', 'EVIDENCIA', 'PROCESO']
      },
      questions
    }
  };
}

export async function handleStandaloneApiRequest(url, options = {}) {
  const db = loadWebDb();
  const urlObj = new URL(url, window.location.origin);
  const pathname = urlObj.pathname;
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body) : {};
  const localCfg = window.__MOODLEAI_CONFIG__ || {};
  const sb = getSupabaseClientInstance();

  let currentUser = db.users.find((u) => u.id === db.currentUserId) || db.users[0];

  // Si hay una sesión activa en el proyecto Supabase (subproyecto moodleai_* dentro de claseiaxpress), sincronizar datos reales
  if (sb) {
    try {
      const { data: sessData } = await sb.auth.getSession();
      const sbUser = sessData?.session?.user;
      if (sbUser) {
        const { data: profRow } = await sb
          .from('moodleai_profiles')
          .select('*')
          .eq('id', sbUser.id)
          .single();

        if (profRow) {
          let localUser = db.users.find((u) => u.id === sbUser.id);
          if (!localUser) {
            localUser = { ...profRow, auth_provider: 'supabase' };
            db.users.push(localUser);
          } else {
            Object.assign(localUser, profRow);
          }
          db.currentUserId = sbUser.id;
          currentUser = localUser;
        }

        const { data: sbActs } = await sb
          .from('moodleai_activities')
          .select('*')
          .eq('user_id', sbUser.id)
          .order('created_at', { ascending: false });

        if (Array.isArray(sbActs) && sbActs.length > 0) {
          const otherActs = db.activities.filter((a) => a.user_id !== sbUser.id);
          db.activities = [...sbActs, ...otherActs];
        }
        saveWebDb(db);
      }
    } catch {
      // mantener datos locales si falla red
    }
  }

  const enrichedUser = enrichUser(db, currentUser);

  const jsonResp = (status, data) => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => data
  });

  if (pathname.endsWith('/api/dashboard') && method === 'GET') {
    const userActs = db.activities.filter((a) => a.user_id === currentUser.id);
    const hasSb = Boolean(localCfg.SUPABASE_URL && localCfg.SUPABASE_ANON_KEY);
    return jsonResp(200, {
      ok: true,
      config: {
        appName: 'MoodleAI Creator',
        currency: 'ARS',
        geminiModel: 'gemini-2.5-flash',
        geminiConfigured: true,
        supabase: {
          configured: hasSb,
          url: localCfg.SUPABASE_URL || '',
          anonKey: localCfg.SUPABASE_ANON_KEY || ''
        },
        mercadoPago: {
          currency: 'ARS',
          apiConfigured: false,
          directLinksConfigured: Boolean(localCfg.MP_LINK_PLAN_PRO || localCfg.MP_LINK_PLAN_INSTITUCIONAL),
          linkPlanPro: localCfg.MP_LINK_PLAN_PRO || '',
          linkPlanInstitutional: localCfg.MP_LINK_PLAN_INSTITUCIONAL || ''
        }
      },
      dashboard: {
        user: enrichedUser,
        stats: {
          totalActivities: userActs.length,
          totalEvaluations: userActs.filter((a) => a.is_evaluation).length,
          totalFavorites: userActs.filter((a) => a.is_favorite).length,
          totalExports: db.exportsCount || 0
        },
        recentActivities: userActs.slice(0, 5),
        savedFavorites: userActs.filter((a) => a.is_favorite).slice(0, 4)
      },
      plans: DEFAULT_PLANS,
      usageHistory: db.usageLogs.filter((u) => u.user_id === currentUser.id).slice(0, 15),
      paymentsHistory: (db.payments || []).filter((p) => p.user_id === currentUser.id).slice(0, 10)
    });
  }

  if (pathname.endsWith('/api/auth/supabase-sync') && method === 'POST') {
    let found = db.users.find((u) => u.id === body.supabaseId || u.email.toLowerCase() === String(body.email || '').toLowerCase());
    if (!found) {
      const initials = String(body.name || 'DC').split(' ').filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('');
      found = {
        id: body.supabaseId,
        name: body.name || body.email.split('@')[0],
        email: body.email,
        password: '',
        institution: body.institution || '',
        education_level: body.education_level || 'Secundaria',
        subject_specialty: body.subject_specialty || '',
        bio: '',
        avatar_initials: initials,
        plan_id: 'free',
        auth_provider: 'supabase'
      };
      db.users.push(found);
    }
    db.currentUserId = found.id;
    saveWebDb(db);
    return jsonResp(200, {
      ok: true,
      message: `Sesión sincronizada con Supabase Auth (${found.email}).`,
      token: 'web_sess_' + found.id,
      user: enrichUser(db, found)
    });
  }

  if (pathname.endsWith('/api/auth/register') && method === 'POST') {
    if (db.users.some((u) => u.email.toLowerCase() === String(body.email || '').toLowerCase())) {
      return jsonResp(409, { ok: false, error: 'Ya existe una cuenta con ese correo electrónico.' });
    }
    const id = 'usr_' + Math.random().toString(36).slice(2, 10);
    const initials = String(body.name || 'DC')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join('');
    const newUser = {
      id,
      name: body.name,
      email: body.email,
      password: body.password,
      institution: body.institution || '',
      education_level: body.education_level || 'Secundaria',
      subject_specialty: body.subject_specialty || '',
      bio: '',
      avatar_initials: initials,
      plan_id: 'free',
      auth_provider: 'local'
    };
    db.users.push(newUser);
    db.currentUserId = id;
    saveWebDb(db);
    return jsonResp(201, {
      ok: true,
      message: `¡Bienvenido/a, ${newUser.name}! Cuenta creada con Plan Gratuito ($0 ARS).`,
      token: 'web_sess_' + id,
      user: enrichUser(db, newUser)
    });
  }

  if (pathname.endsWith('/api/auth/login') && method === 'POST') {
    const found = db.users.find(
      (u) => u.email.toLowerCase() === String(body.email || '').toLowerCase() && u.password === body.password
    );
    if (!found) {
      return jsonResp(401, { ok: false, error: 'Correo electrónico o contraseña incorrectos.' });
    }
    db.currentUserId = found.id;
    saveWebDb(db);
    return jsonResp(200, {
      ok: true,
      message: `¡Hola de nuevo, ${found.name}!`,
      token: 'web_sess_' + found.id,
      user: enrichUser(db, found)
    });
  }

  if (pathname.endsWith('/api/auth/logout') && method === 'POST') {
    db.currentUserId = 'usr_docente_demo';
    saveWebDb(db);
    return jsonResp(200, { ok: true, message: 'Sesión cerrada.' });
  }

  if (pathname.endsWith('/api/profile') && method === 'PUT') {
    const updates = {
      name: body.name || currentUser.name,
      institution: body.institution ?? currentUser.institution,
      education_level: body.education_level ?? currentUser.education_level,
      subject_specialty: body.subject_specialty ?? currentUser.subject_specialty,
      bio: body.bio ?? currentUser.bio
    };
    Object.assign(currentUser, updates);
    if (sb && currentUser.auth_provider === 'supabase') {
      await sb.from('moodleai_profiles').update(updates).eq('id', currentUser.id);
    }
    saveWebDb(db);
    return jsonResp(200, { ok: true, user: enrichUser(db, currentUser) });
  }

  if (pathname.endsWith('/api/payments/mercadopago/create-preference') && method === 'POST') {
    const plan = DEFAULT_PLANS.find((p) => p.id === body.plan_id);
    if (!plan) return jsonResp(400, { ok: false, error: 'Plan no válido.' });
    if (plan.id === 'free') {
      currentUser.plan_id = 'free';
      if (sb && currentUser.auth_provider === 'supabase') {
        await sb.from('moodleai_profiles').update({ plan_id: 'free' }).eq('id', currentUser.id);
      }
      saveWebDb(db);
      return jsonResp(200, { ok: true, freePlanActivated: true, message: 'Plan Gratuito ($0 ARS) activado.', user: enrichUser(db, currentUser) });
    }

    const paymentId = 'pay_' + Date.now();
    const prefId = `PREF_ARS_${plan.id.toUpperCase()}_${plan.price_ars}`;
    const directUrl = plan.id === 'pro' ? localCfg.MP_LINK_PLAN_PRO : localCfg.MP_LINK_PLAN_INSTITUCIONAL;

    const paymentRow = {
      id: paymentId,
      user_id: currentUser.id,
      plan_id: plan.id,
      plan_name: plan.name,
      amount_ars: plan.price_ars,
      currency: 'ARS',
      mp_preference_id: prefId,
      payment_mode: body.mode || 'checkout_pro',
      status: 'pending',
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    db.payments = db.payments || [];
    db.payments.unshift(paymentRow);
    if (sb && currentUser.auth_provider === 'supabase') {
      await sb.from('moodleai_payments').insert({
        id: paymentId,
        user_id: currentUser.id,
        plan_id: plan.id,
        amount_ars: plan.price_ars,
        currency: 'ARS',
        mp_preference_id: prefId,
        payment_mode: body.mode || 'checkout_pro',
        status: 'pending'
      });
    }
    saveWebDb(db);

    return jsonResp(201, {
      ok: true,
      message: `Checkout de Mercado Pago generado por $${Number(plan.price_ars).toLocaleString('es-AR')} ARS (${plan.name}).`,
      plan,
      checkout: {
        modeUsed: body.mode === 'direct_link' ? 'direct_subscription_link' : 'checkout_pro_api',
        currency: 'ARS',
        amountArs: plan.price_ars,
        paymentId,
        preferenceId: prefId,
        checkoutUrl: directUrl || '',
        isSandboxSimulation: !directUrl
      }
    });
  }

  if (pathname.endsWith('/api/payments/mercadopago/confirm') && method === 'POST') {
    db.payments = db.payments || [];
    const payment = db.payments.find((p) => p.id === body.payment_id);
    if (!payment) return jsonResp(404, { ok: false, error: 'Pago no encontrado.' });
    payment.status = 'approved';
    payment.mp_payment_id = body.mp_payment_id || `MP_ARS_${Date.now()}`;
    currentUser.plan_id = payment.plan_id;
    const updated = enrichUser(db, currentUser);

    if (sb && currentUser.auth_provider === 'supabase') {
      await sb.from('moodleai_profiles').update({ plan_id: payment.plan_id }).eq('id', currentUser.id);
    }

    db.usageLogs.unshift({
      id: 'ulg_' + Date.now(),
      user_id: currentUser.id,
      action_type: 'mercadopago_payment',
      month_key: getMonthKey(),
      details: `Pago aprobado en Mercado Pago ($${Number(payment.amount_ars).toLocaleString('es-AR')} ARS) -> Activación de ${updated.plan_name}`,
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    });
    saveWebDb(db);

    return jsonResp(200, {
      ok: true,
      message: `¡Pago de $${Number(payment.amount_ars).toLocaleString('es-AR')} ARS acreditado con éxito! Tu ${updated.plan_name} ya está activo.`,
      payment,
      user: updated
    });
  }

  if (pathname.endsWith('/api/activities/generate') && method === 'POST') {
    if (!enrichedUser.quota.canGenerate) {
      return jsonResp(429, {
        ok: false,
        error: `Alcanzaste el límite de ${enrichedUser.quota.limit} actividades mensuales de tu ${enrichedUser.quota.planName}. Podés suscribirte con Mercado Pago al Plan Docente Profesional ($25.000 ARS/mes) o Plan Institucional ($50.000 ARS/mes).`
      });
    }

    const newAct = {
      ...generateLocalPedagogicalActivity(body),
      user_id: currentUser.id
    };
    db.activities.unshift(newAct);

    const logItem = {
      id: 'ulg_' + Date.now(),
      user_id: currentUser.id,
      action_type: newAct.is_evaluation ? 'generate_evaluation' : 'generate_activity',
      activity_id: newAct.id,
      month_key: getMonthKey(),
      details: `${newAct.activity_type}: ${newAct.title}`,
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    db.usageLogs.unshift(logItem);

    if (sb && currentUser.auth_provider === 'supabase') {
      await sb.from('moodleai_activities').insert(newAct);
      await sb.from('moodleai_usage_logs').insert(logItem);
    }

    saveWebDb(db);
    return jsonResp(201, {
      ok: true,
      message: 'Actividad generada y guardada en tu biblioteca.',
      activity: newAct
    });
  }

  if (pathname.endsWith('/api/activities') && method === 'GET') {
    const search = (urlObj.searchParams.get('search') || '').toLowerCase();
    const subject = urlObj.searchParams.get('subject') || 'Todas';
    const activityType = urlObj.searchParams.get('activityType') || 'Todos';
    const onlyFavorites = urlObj.searchParams.get('onlyFavorites') === 'true';

    const userActs = db.activities.filter((a) => a.user_id === currentUser.id);
    const availableSubjects = Array.from(new Set(userActs.map((a) => a.subject).filter(Boolean))).sort();

    const filtered = userActs.filter((a) => {
      if (subject && subject !== 'Todas' && a.subject.toLowerCase() !== subject.toLowerCase()) return false;
      if (activityType && activityType !== 'Todos' && a.activity_type !== activityType) return false;
      if (onlyFavorites && !a.is_favorite) return false;
      if (search && !`${a.title} ${a.topic} ${a.subject} ${a.tags}`.toLowerCase().includes(search)) return false;
      return true;
    });

    return jsonResp(200, { ok: true, activities: filtered, availableSubjects });
  }

  const exportMatch = pathname.match(/\/api\/activities\/([^/]+)\/export\/([^/]+)$/);
  if (exportMatch && method === 'GET') {
    const act = db.activities.find((a) => a.id === exportMatch[1]);
    if (!act) return jsonResp(404, { ok: false, error: 'Actividad no encontrada.' });
    const built = buildExportDataClient(act, exportMatch[2]);
    db.exportsCount = (db.exportsCount || 0) + 1;
    saveWebDb(db);
    return jsonResp(200, {
      ok: true,
      fileName: built.fileName,
      content: built.content,
      importGuide: built.importGuide,
      _clientBlob: built.blob
    });
  }

  const favMatch = pathname.match(/\/api\/activities\/([^/]+)\/favorite$/);
  if (favMatch && method === 'POST') {
    const act = db.activities.find((a) => a.id === favMatch[1]);
    if (!act) return jsonResp(404, { ok: false, error: 'Actividad no encontrada.' });
    act.is_favorite = !act.is_favorite;
    if (sb && currentUser.auth_provider === 'supabase') {
      await sb.from('moodleai_activities').update({ is_favorite: act.is_favorite }).eq('id', act.id);
    }
    saveWebDb(db);
    return jsonResp(200, { ok: true, activity: act });
  }

  const dupMatch = pathname.match(/\/api\/activities\/([^/]+)\/duplicate$/);
  if (dupMatch && method === 'POST') {
    const orig = db.activities.find((a) => a.id === dupMatch[1]);
    if (!orig) return jsonResp(404, { ok: false, error: 'Actividad no encontrada.' });
    const copy = JSON.parse(JSON.stringify(orig));
    copy.id = 'act_' + Math.random().toString(36).slice(2, 11);
    copy.title = `${orig.title} (Copia)`;
    db.activities.unshift(copy);
    if (sb && currentUser.auth_provider === 'supabase') {
      await sb.from('moodleai_activities').insert(copy);
    }
    saveWebDb(db);
    return jsonResp(201, { ok: true, activity: copy });
  }

  const actMatch = pathname.match(/\/api\/activities\/([^/]+)$/);
  if (actMatch) {
    const actId = actMatch[1];
    const idx = db.activities.findIndex((a) => a.id === actId);
    if (idx === -1) return jsonResp(404, { ok: false, error: 'Actividad no encontrada.' });

    if (method === 'GET') {
      return jsonResp(200, { ok: true, activity: db.activities[idx] });
    }
    if (method === 'PUT') {
      db.activities[idx] = { ...db.activities[idx], ...body };
      if (sb && currentUser.auth_provider === 'supabase') {
        await sb.from('moodleai_activities').update(body).eq('id', actId);
      }
      saveWebDb(db);
      return jsonResp(200, { ok: true, activity: db.activities[idx] });
    }
    if (method === 'DELETE') {
      db.activities.splice(idx, 1);
      if (sb && currentUser.auth_provider === 'supabase') {
        await sb.from('moodleai_activities').delete().eq('id', actId);
      }
      saveWebDb(db);
      return jsonResp(200, { ok: true });
    }
  }

  return jsonResp(404, { ok: false, error: 'Ruta no encontrada.' });
}
