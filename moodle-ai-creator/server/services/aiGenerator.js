/**
 * MoodleAI Creator — Motor de Inteligencia Artificial Pedagógica (Módulos 2, 3 y 6)
 * Conecta con Google Gemini API usando variables de entorno (.env) en el backend
 * e incluye un Motor Pedagógico Estructurado de respaldo para garantizar
 * disponibilidad 100% y validación de esquema para los 12 tipos de actividades.
 */

const BLOOM_BY_DIFFICULTY = {
  'Básico': 'Recordar y Comprender (Niveles 1 y 2 de la Taxonomía de Bloom: identificación de conceptos clave y relaciones directas)',
  'Intermedio': 'Aplicar y Analizar (Niveles 3 y 4 de la Taxonomía de Bloom: resolución de situaciones, comparación y transferencia a casos reales)',
  'Avanzado': 'Evaluar y Crear (Niveles 5 y 6 de la Taxonomía de Bloom: pensamiento crítico, argumentación, toma de decisiones y diseño de soluciones)'
};

/**
 * Valida los parámetros de entrada del formulario de Actividad o Evaluación
 */
export function validateGenerationInput(input = {}) {
  const errors = [];
  if (!input.subject || String(input.subject).trim().length < 2) {
    errors.push('La asignatura es obligatoria.');
  }
  if (!input.topic || String(input.topic).trim().length < 3) {
    errors.push('El tema o contenido es obligatorio (mínimo 3 caracteres).');
  }
  if (!input.learning_objective || String(input.learning_objective).trim().length < 5) {
    errors.push('El objetivo de aprendizaje es obligatorio.');
  }

  const questionCount = Math.min(20, Math.max(1, Number(input.question_count || 5)));
  const pointsPerQuestion = Math.max(0.5, Number(input.points_per_question || 2.0));
  const estimatedDuration = Math.min(240, Math.max(5, Number(input.estimated_duration || 30)));
  const timeLimitMinutes = Math.min(240, Math.max(5, Number(input.time_limit_minutes || estimatedDuration)));
  const allowedAttempts = Math.max(0, Number(input.allowed_attempts ?? 2));

  return {
    isValid: errors.length === 0,
    errors,
    normalized: {
      subject: String(input.subject || '').trim(),
      education_level: String(input.education_level || 'Secundaria').trim(),
      student_age: String(input.student_age || '13 a 15 años').trim(),
      topic: String(input.topic || '').trim(),
      learning_objective: String(input.learning_objective || '').trim(),
      estimated_duration: estimatedDuration,
      difficulty: String(input.difficulty || 'Intermedio').trim(),
      activity_type: String(input.activity_type || 'Opción múltiple').trim(),
      is_evaluation: Boolean(input.is_evaluation),
      question_count: questionCount,
      points_per_question: pointsPerQuestion,
      time_limit_minutes: timeLimitMinutes,
      allowed_attempts: allowedAttempts,
      auto_grading: input.auto_grading !== undefined ? Boolean(input.auto_grading) : true
    }
  };
}

/**
 * Construye el prompt del sistema para Google Gemini aplicando el Módulo 6 (Diseño Pedagógico)
 */
function buildGeminiPrompt(params) {
  return `Actuá como un especialista en Diseño Instruccional, Pedagogía (Taxonomía de Bloom, Aprendizaje Activo, Evaluación Formativa, ABP, Gamificación y Accesibilidad DUA/Lectura Fácil) y experto en Moodle, H5P y SCORM.
Usá español de Argentina claro, inclusivo y riguroso.

Diseñá una ${params.is_evaluation ? 'EVALUACIÓN CALIFICABLE' : 'ACTIVIDAD EDUCATIVA INTERACTIVA'} con estos parámetros exactos:
1. Asignatura: ${params.subject}
2. Nivel educativo: ${params.education_level}
3. Edad de los estudiantes: ${params.student_age}
4. Tema o contenido: ${params.topic}
5. Objetivo de aprendizaje: ${params.learning_objective}
6. Duración estimada: ${params.estimated_duration} minutos
7. Dificultad: ${params.difficulty}
8. Tipo de actividad: ${params.activity_type}
9. Cantidad de preguntas/consignas: ${params.question_count}
10. Puntaje por pregunta: ${params.points_per_question} puntos

Devolvé ÚNICAMENTE un objeto JSON válido con esta estructura exacta (sin bloques markdown):
{
  "title": "Título atractivo y pedagógico",
  "description": "Descripción clara de la propuesta",
  "student_instructions": "Instrucciones paso a paso para el estudiante con lenguaje claro (DUA)",
  "pedagogical": {
    "bloomLevel": "Nivel de la Taxonomía de Bloom aplicado",
    "learningObjectives": ["Objetivo específico 1", "Objetivo específico 2", "Objetivo específico 3"],
    "instructionalDesignPrinciples": ["Principio de aprendizaje activo", "Principio de evaluación formativa", "Principio de accesibilidad DUA"],
    "evaluationCriteria": ["Criterio de evaluación 1", "Criterio de evaluación 2", "Criterio de evaluación 3"],
    "pedagogicalRecommendations": "Recomendaciones concretas para el docente al implementar en Moodle"
  },
  "content": {
    "developmentText": "Desarrollo conceptual rico, contextualizado y motivador sobre el tema (o narrativa/caso práctico si aplica).",
    "activityTypeMeta": {
      "type": "${params.activity_type}",
      "words": ["PALABRA1", "PALABRA2", "PALABRA3"],
      "missionBadge": "Insignia o desafío gamificado si aplica"
    },
    "questions": [
      {
        "id": "q1",
        "type": "multiple_choice | true_false | fill_blanks | matching | ordering | essay | crossword_clue",
        "prompt": "Enunciado claro de la pregunta o consigna",
        "points": ${params.points_per_question},
        "options": [
          { "id": "a", "text": "Opción correcta", "isCorrect": true },
          { "id": "b", "text": "Distractor plausible 1", "isCorrect": false },
          { "id": "c", "text": "Distractor plausible 2", "isCorrect": false },
          { "id": "d", "text": "Distractor plausible 3", "isCorrect": false }
        ],
        "blanks": ["respuesta_exacta"],
        "pairs": [
          { "left": "Concepto A", "right": "Definición A" },
          { "left": "Concepto B", "right": "Definición B" }
        ],
        "sequence": ["Paso 1", "Paso 2", "Paso 3", "Paso 4"],
        "answerTerm": "TERMINO",
        "rubric": "Criterio de corrección para preguntas abiertas/casos/reflexión",
        "correctFeedback": "Retroalimentación formativa explicando por qué es correcta",
        "incorrectFeedback": "Retroalimentación formativa orientando cómo repensar la respuesta"
      }
    ]
  }
}`;
}

/**
 *Genera preguntas adaptadas a los 12 tipos de actividades del Módulo 2
 * asegurando variedad pedagógica, no repetición y estructura válida para Moodle XML, GIFT, SCORM y H5P.
 */
function buildQuestionsForType(params) {
  const { topic, subject, learning_objective, activity_type, question_count, points_per_question, difficulty } = params;
  const questions = [];

  // Extraer palabras clave limpias del tema para crucigramas, sopa de letras y completar espacios
  const cleanWords = topic
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 4)
    .map((w) => w.toLowerCase());
  const primaryKeyword = cleanWords[0] || 'concepto';
  const secondaryKeyword = cleanWords[1] || 'proceso';

  const cognitiveFocus = [
    { angle: 'comprensión conceptual y definición fundamental', verb: 'identificar' },
    { angle: 'aplicación a una situación real del contexto cotidiano', verb: 'aplicar' },
    { angle: 'relación causa-efecto e interdependencia de factores', verb: 'analizar' },
    { angle: 'resolución de un problema o toma de decisión fundamentada', verb: 'evaluar' },
    { angle: 'síntesis integradora y transferencia a nuevos escenarios', verb: 'integrar' },
    { angle: 'detección de errores frecuentes o mitos sobre el tema', verb: 'contrastar' }
  ];

  for (let i = 0; i < question_count; i++) {
    const qId = `q${i + 1}`;
    const focus = cognitiveFocus[i % cognitiveFocus.length];

    // Determinar el tipo interno de pregunta según el formato elegido por el docente
    let qType = 'multiple_choice';
    if (activity_type === 'Opción múltiple') qType = 'multiple_choice';
    else if (activity_type === 'Verdadero o falso') qType = 'true_false';
    else if (activity_type === 'Completar espacios') qType = 'fill_blanks';
    else if (activity_type === 'Relacionar columnas') qType = 'matching';
    else if (activity_type === 'Ordenar secuencias') qType = 'ordering';
    else if (activity_type === 'Preguntas abiertas' || activity_type === 'Actividades de reflexión') qType = 'essay';
    else if (activity_type === 'Crucigramas' || activity_type === 'Sopa de letras') qType = 'crossword_clue';
    else if (activity_type === 'Casos prácticos') {
      qType = i % 2 === 0 ? 'multiple_choice' : 'essay';
    } else if (activity_type === 'Gamificación') {
      const cycle = ['multiple_choice', 'true_false', 'fill_blanks', 'ordering'];
      qType = cycle[i % cycle.length];
    } else if (activity_type === 'Cuestionarios') {
      const cycle = ['multiple_choice', 'true_false', 'fill_blanks', 'matching'];
      qType = cycle[i % cycle.length];
    }

    if (qType === 'multiple_choice') {
      const prefix = activity_type === 'Gamificación'
        ? `[Desafío Nivel ${i + 1}] `
        : activity_type === 'Casos prácticos'
        ? `[Análisis de Caso - Decisión ${i + 1}] `
        : '';

      questions.push({
        id: qId,
        type: 'multiple_choice',
        prompt: `${prefix}En el marco de ${subject} y considerando "${topic}", ¿cuál de las siguientes afirmaciones explica mejor la ${focus.angle} orientada a ${learning_objective.toLowerCase()}?`,
        points: points_per_question,
        options: [
          {
            id: 'a',
            text: `Permite ${focus.verb} cómo los componentes principales de ${topic} interactúan de forma sistémica y verificable en contextos reales.`,
            isCorrect: true
          },
          {
            id: 'b',
            text: `Plantea que ${topic} ocurre de manera aislada, sin relación con las variables del entorno ni con el objetivo estudiado.`,
            isCorrect: false
          },
          {
            id: 'c',
            text: `Reduce el estudio de ${topic} únicamente a la memorización de datos desconectados de toda aplicación práctica.`,
            isCorrect: false
          },
          {
            id: 'd',
            text: `Sostiene que los procesos de ${topic} son invariables y no admiten análisis crítico ni evidencia empírica.`,
            isCorrect: false
          }
        ],
        correctFeedback: `¡Excelente razonamiento! Identificaste con precisión la ${focus.angle} sobre ${topic}, aplicando una mirada integradora.`,
        incorrectFeedback: `Revisá esta idea: en ${subject}, el análisis de ${topic} requiere conectar las causas y evidencias con el contexto real, evitando visiones aisladas o meramente memorísticas.`
      });
    } else if (qType === 'true_false') {
      const isTrue = i % 2 === 0;
      questions.push({
        id: qId,
        type: 'true_false',
        prompt: isTrue
          ? `Al estudiar ${topic} en ${subject}, comprender la relación entre sus variables principales es indispensable para ${learning_objective.toLowerCase()}.`
          : `En el análisis de ${topic}, las condiciones del contexto y la evidencia práctica no tienen ninguna influencia sobre los resultados observados.`,
        points: points_per_question,
        correctAnswer: isTrue,
        options: [
          { id: 'true', text: 'Verdadero', isCorrect: isTrue },
          { id: 'false', text: 'Falso', isCorrect: !isTrue }
        ],
        correctFeedback: isTrue
          ? `¡Muy bien! La afirmación es verdadera porque la comprensión profunda de ${topic} articula teoría y aplicación práctica.`
          : `¡Correcto! Detectaste que la afirmación es falsa: el contexto y la evidencia siempre influyen en el desarrollo de ${topic}.`,
        incorrectFeedback: isTrue
          ? `Atención: la afirmación es verdadera. Repasá cómo se vinculan las variables de ${topic} con el objetivo de la clase.`
          : `Cuidado: la afirmación es falsa, ya que ningún proceso de ${topic} puede analizarse ignorando su contexto y evidencias.`
      });
    } else if (qType === 'fill_blanks') {
      const targetWord = i % 2 === 0 ? primaryKeyword : secondaryKeyword;
      questions.push({
        id: qId,
        type: 'fill_blanks',
        prompt: `Para ${focus.verb} adecuadamente el tema "${topic}" en ${subject}, es fundamental reconocer el concepto clave de [[${targetWord}]] dentro del desarrollo estudiado.`,
        points: points_per_question,
        blanks: [targetWord],
        correctFeedback: `¡Exacto! El término "${targetWord}" completa con precisión el enunciado conceptual.`,
        incorrectFeedback: `La palabra clave esperada es "${targetWord}". Revisá el texto de desarrollo para verificar su uso en contexto.`
      });
    } else if (qType === 'matching') {
      questions.push({
        id: qId,
        type: 'matching',
        prompt: `Relacioná cada dimensión de "${topic}" con su aplicación pedagógica y práctica correspondiente (${focus.angle}):`,
        points: points_per_question,
        pairs: [
          { left: `Concepto central de ${topic}`, right: 'Base teórica y definición estructurada del fenómeno' },
          { left: 'Factores intervinientes', right: 'Variables que modifican o regulan el proceso en estudio' },
          { left: 'Aplicación en casos reales', right: `Resolución de situaciones vinculadas a ${subject}` },
          { left: 'Evaluación crítica', right: 'Verificación de evidencias y conclusiones fundamentadas' }
        ],
        correctFeedback: `¡Excelente! Vinculaste correctamente cada dimensión de ${topic} con su función específica.`,
        incorrectFeedback: `Algunos pares no coinciden. Repasá la diferencia entre definición teórica, variables, aplicación práctica y evaluación.`
      });
    } else if (qType === 'ordering') {
      questions.push({
        id: qId,
        type: 'ordering',
        prompt: `Ordená secuencialmente las etapas lógicas para abordar y resolver un análisis sobre "${topic}":`,
        points: points_per_question,
        sequence: [
          `1. Observación e identificación de los elementos clave de ${topic}`,
          `2. Comprensión de las relaciones y causas dentro de ${subject}`,
          `3. Aplicación del método o modelo al caso concreto de estudio`,
          `4. Verificación de resultados y conclusión fundamentada`
        ],
        correctFeedback: `¡Secuencia perfecta! Seguiste el orden metodológico desde la identificación hasta la verificación de resultados.`,
        incorrectFeedback: `Revisá el orden lógico: primero identificamos las variables, luego analizamos sus relaciones, aplicamos al caso y finalmente verificamos.`
      });
    } else if (qType === 'crossword_clue') {
      const candidateTerms = [
        { term: (cleanWords[0] || 'SISTEMA').toUpperCase(), clue: `Pista ${i + 1}: Término central del tema "${topic}" que articula el objetivo de ${subject}.` },
        { term: (cleanWords[1] || 'PROCESO').toUpperCase(), clue: `Pista ${i + 1}: Segundo concepto clave vinculado a la dinámica y desarrollo de "${topic}".` },
        { term: 'ANALISIS', clue: `Pista ${i + 1}: Operación cognitiva que permite descomponer "${topic}" en sus factores principales.` },
        { term: 'CONTEXTO', clue: `Pista ${i + 1}: Entorno real donde se aplica y manifiesta "${topic}" según lo trabajado en clase.` },
        { term: 'EVIDENCIA', clue: `Pista ${i + 1}: Dato o prueba verificable que respalda las conclusiones sobre "${topic}".` },
        { term: 'OBJETIVO', clue: `Pista ${i + 1}: Meta de aprendizaje que guía el estudio de "${topic}".` }
      ];
      const item = candidateTerms[i % candidateTerms.length];
      questions.push({
        id: qId,
        type: 'crossword_clue',
        prompt: `${item.clue} (${item.term.length} letras)`,
        points: points_per_question,
        answerTerm: item.term,
        blanks: [item.term],
        correctFeedback: `¡Correcto! La palabra clave es ${item.term}.`,
        incorrectFeedback: `Revisá la pista y la cantidad de letras: el término esperado es ${item.term}.`
      });
    } else {
      // essay / reflexión / caso práctico abierto
      questions.push({
        id: qId,
        type: 'essay',
        prompt: activity_type === 'Actividades de reflexión'
          ? `[Reflexión Metacognitiva ${i + 1}] ¿De qué manera lo aprendido sobre "${topic}" transforma tu comprensión previa en ${subject} y cómo podrías aplicarlo en una situación real de tu comunidad?`
          : activity_type === 'Casos prácticos'
          ? `[Resolución del Caso - Pregunta ${i + 1}] A partir del escenario planteado sobre "${topic}", elaborá una propuesta fundamentada que permita ${learning_objective.toLowerCase()}, justificando los pasos elegidos.`
          : `[Desarrollo Abierto ${i + 1}] Explicá con tus propias palabras la ${focus.angle} en "${topic}" y brindá un ejemplo concreto aplicado a ${subject} (Nivel ${difficulty}).`,
        points: points_per_question,
        rubric: `Criterios de corrección: 1) Claridad conceptual sobre ${topic}; 2) Uso de vocabulario específico de ${subject}; 3) Fundamentación con un ejemplo o argumento propio.`,
        correctFeedback: `Respuesta registrada. Utilizá la rúbrica formativa para verificar si incluiste conceptos clave, relación causal y un ejemplo propio.`,
        incorrectFeedback: `Recordá desarrollar tu argumento conectando la teoría de ${topic} con un ejemplo concreto.`
      });
    }
  }

  return questions;
}

/**
 * Motor Pedagógico Local de Respaldo (100% determinístico, rico y adaptado a los 12 tipos)
 */
export function generateWithPedagogicalEngine(rawInput) {
  const { normalized: p } = validateGenerationInput(rawInput);
  const bloomLevel = BLOOM_BY_DIFFICULTY[p.difficulty] || BLOOM_BY_DIFFICULTY['Intermedio'];

  const typePrefix = p.is_evaluation
    ? `Evaluación de ${p.subject}`
    : `${p.activity_type}`;

  const title = `${typePrefix}: ${p.topic}`;
  const description = `${p.is_evaluation ? 'Evaluación formativa y sumativa' : 'Actividad interactiva basada en aprendizaje activo'} diseñada para estudiantes de ${p.education_level} (${p.student_age}) en la asignatura ${p.subject}.`;

  let studentInstructions = `Leé comprensivamente el bloque de desarrollo sobre "${p.topic}". Luego respondé cada una de las ${p.question_count} consignas propuestas. Al verificar cada respuesta recibirás retroalimentación formativa para afianzar tu aprendizaje.`;
  if (p.is_evaluation) {
    studentInstructions = `Esta evaluación consta de ${p.question_count} preguntas (${p.points_per_question} pts cada una, puntaje total: ${p.question_count * p.points_per_question} pts). Disponés de ${p.time_limit_minutes} minutos y ${p.allowed_attempts === 0 ? 'intentos ilimitados' : `${p.allowed_attempts} intento(s)`}. Leé cada enunciado con atención antes de confirmar.`;
  } else if (p.activity_type === 'Gamificación') {
    studentInstructions = `¡Bienvenido/a a la Misión "${p.topic}"! Superá los ${p.question_count} desafíos secuenciales para sumar puntos, desbloquear la insignia del tema y demostrar tu dominio en ${p.subject}.`;
  } else if (p.activity_type === 'Crucigramas' || p.activity_type === 'Sopa de letras') {
    studentInstructions = `Leé cada pista conceptual vinculada a "${p.topic}" y descubrí el término exacto que completa el desafío léxico de ${p.subject}.`;
  }

  let developmentText = `En el estudio de ${p.subject} para ${p.education_level}, el abordaje de "${p.topic}" resulta fundamental para ${p.learning_objective.toLowerCase()}. Comprender este tema implica analizar tanto sus conceptos estructurantes como sus relaciones con situaciones reales del entorno cotidiano. A través de esta propuesta de nivel ${p.difficulty.toLowerCase()}, exploraremos las causas, componentes y aplicaciones prácticas que permiten construir un aprendizaje significativo, crítico y transferible.`;

  if (p.activity_type === 'Casos prácticos') {
    developmentText = `📌 CASO PRÁCTICO (Aprendizaje Basado en Problemas): En una comunidad local se presenta un desafío real vinculado directamente con "${p.topic}". Un equipo interdisciplinario de ${p.subject} debe analizar la situación, identificar las variables críticas que están afectando el resultado y diseñar una solución viable que permita ${p.learning_objective.toLowerCase()} en un plazo acotado y con criterios de sostenibilidad.`;
  } else if (p.activity_type === 'Gamificación') {
    developmentText = `🏆 NARRATIVA DE MISIÓN GAMIFICADA: Formás parte del Equipo de Especialistas en ${p.subject}. Tu misión del día consiste en resolver ${p.question_count} retos estratégicos sobre "${p.topic}". Cada reto superado te otorga ${p.points_per_question} puntos de experiencia (XP) y acerca a tu equipo a desbloquear la Insignia Maestra de la unidad.`;
  }

  const questions = buildQuestionsForType(p);
  const glossaryWords = questions
    .map((q) => q.answerTerm || (q.blanks && q.blanks[0]))
    .filter(Boolean)
    .map((w) => String(w).toUpperCase());

  return {
    providerUsed: 'pedagogical_engine',
    activity: {
      ...p,
      title,
      description,
      student_instructions: studentInstructions,
      pedagogical: {
        bloomLevel,
        learningObjectives: [
          p.learning_objective,
          `Comprender y relacionar los conceptos centrales de "${p.topic}" en el marco de ${p.subject}.`,
          `Transferir lo aprendido sobre ${p.topic} a la resolución de consignas de nivel ${p.difficulty.toLowerCase()} con autonomía.`
        ],
        instructionalDesignPrinciples: [
          `Diseño Instruccional y Taxonomía de Bloom: actividades alineadas al nivel ${bloomLevel}.`,
          `Aprendizaje Activo y Evaluación Formativa: retroalimentación inmediata en cada ítem para transformar el error en oportunidad de aprendizaje.`,
          `Accesibilidad e Inclusión (DUA / Lectura Fácil): estructura predecible, instrucciones paso a paso y lenguaje claro adaptado a ${p.student_age}.`
        ],
        evaluationCriteria: [
          `Precisión conceptual al identificar y relacionar los componentes de ${p.topic}.`,
          `Capacidad de análisis y aplicación práctica en situaciones propias de ${p.subject}.`,
          `Interpretación reflexiva de la retroalimentación formativa durante el desarrollo de la actividad.`
        ],
        pedagogicalRecommendations: `Se recomienda presentar primero el contexto de "${p.topic}" durante 5-10 minutos, luego habilitar la actividad en Moodle (${p.estimated_duration} min) permitiendo ${p.allowed_attempts || 2} intentos para que los estudiantes aprovechen la retroalimentación formativa, y cerrar con una puesta en común sobre los criterios de evaluación.`
      },
      content: {
        developmentText,
        activityTypeMeta: {
          type: p.activity_type,
          words: glossaryWords.length > 0 ? glossaryWords : ['CONCEPTO', 'ANALISIS', 'CONTEXTO', 'EVIDENCIA'],
          missionBadge: p.activity_type === 'Gamificación' ? `Insignia Experto/a en ${p.topic}` : null
        },
        questions
      }
    }
  };
}

/**
 * Función principal: Intenta generar con Google Gemini API si GEMINI_API_KEY está configurada en .env.
 * Si no hay clave o ocurre un error de red, utiliza de forma transparente el Motor Pedagógico Estructurado.
 */
export async function generateEducationalResource(rawInput) {
  const validation = validateGenerationInput(rawInput);
  if (!validation.isValid) {
    throw new Error(validation.errors.join(' '));
  }

  const params = validation.normalized;
  const apiKey = process.env.GEMINI_API_KEY || '';
  const model = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  const hasRealGeminiKey = Boolean(
    apiKey &&
    apiKey !== 'tu_clave_de_gemini_aqui' &&
    !apiKey.startsWith('AIzaSyClaveSecretaDePrueba') &&
    apiKey.length > 15
  );

  if (hasRealGeminiKey) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const prompt = buildGeminiPrompt(params);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: 'application/json'
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          if (parsed.title && parsed.content && Array.isArray(parsed.content.questions) && parsed.content.questions.length > 0) {
            return {
              providerUsed: 'gemini',
              activity: {
                ...params,
                title: parsed.title,
                description: parsed.description || `Actividad sobre ${params.topic}`,
                student_instructions: parsed.student_instructions || 'Respondé las siguientes consignas.',
                pedagogical: parsed.pedagogical || {},
                content: parsed.content
              }
            };
          }
        }
      }
    } catch (err) {
      console.warn('Aviso: Falló la llamada a Gemini API, utilizando Motor Pedagógico Local de respaldo:', err.message);
    }
  }

  // Respaldo pedagógico garantizado
  return generateWithPedagogicalEngine(params);
}
