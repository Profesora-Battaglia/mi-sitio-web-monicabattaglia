import crypto from 'node:crypto';
import { buildZipBuffer } from './zipBuilder.js';
import { escapeXml, slugifyFileName } from './moodleNativeExporter.js';

/**
 * MoodleAI Creator — Motor de Exportación y Validación H5P Oficial (Módulo 4B)
 * Construye paquetes .h5p válidos conforme a la especificación oficial de H5P
 * (h5p.json + content/content.json) compatibles con el Banco de Contenido de Moodle.
 * Valida las bibliotecas, versiones y dependencias requeridas antes de empaquetar.
 */

const H5P_LIBRARY_CATALOG = {
  'H5P.QuestionSet': { machineName: 'H5P.QuestionSet', majorVersion: 1, minorVersion: 20 },
  'H5P.MultiChoice': { machineName: 'H5P.MultiChoice', majorVersion: 1, minorVersion: 16 },
  'H5P.TrueFalse': { machineName: 'H5P.TrueFalse', majorVersion: 1, minorVersion: 8 },
  'H5P.Blanks': { machineName: 'H5P.Blanks', majorVersion: 1, minorVersion: 14 },
  'H5P.DragText': { machineName: 'H5P.DragText', majorVersion: 1, minorVersion: 10 },
  'H5P.Essay': { machineName: 'H5P.Essay', majorVersion: 1, minorVersion: 5 },
  'H5P.Question': { machineName: 'H5P.Question', majorVersion: 1, minorVersion: 5 },
  'H5P.JoubelUI': { machineName: 'H5P.JoubelUI', majorVersion: 1, minorVersion: 3 },
  'H5P.Transition': { machineName: 'H5P.Transition', majorVersion: 1, minorVersion: 0 },
  'H5P.FontIcons': { machineName: 'H5P.FontIcons', majorVersion: 1, minorVersion: 0 },
  'FontAwesome': { machineName: 'FontAwesome', majorVersion: 4, minorVersion: 5 }
};

function libraryString(libKey) {
  const lib = H5P_LIBRARY_CATALOG[libKey];
  if (!lib) throw new Error(`Biblioteca H5P no registrada: ${libKey}`);
  return `${lib.machineName} ${lib.majorVersion}.${lib.minorVersion}`;
}

function buildMultiChoiceSubContent(q, idx) {
  const options = Array.isArray(q.options) && q.options.length > 0
    ? q.options
    : [
        { text: 'Opción correcta', isCorrect: true },
        { text: 'Opción incorrecta', isCorrect: false }
      ];

  return {
    library: libraryString('H5P.MultiChoice'),
    subContentId: crypto.randomUUID(),
    metadata: {
      contentType: 'Multiple Choice',
      license: 'U',
      title: `Pregunta ${idx + 1} - Opción múltiple`
    },
    params: {
      question: `<p>${escapeXml(q.prompt)}</p>`,
      answers: options.map((opt) => ({
        text: `<div>${escapeXml(opt.text)}</div>\n`,
        correct: Boolean(opt.isCorrect),
        tipsAndFeedback: {
          tip: '',
          chosenFeedback: `<div>${escapeXml(opt.isCorrect ? (q.correctFeedback || '¡Correcto!') : (q.incorrectFeedback || 'Revisá este concepto.'))}</div>\n`,
          notChosenFeedback: ''
        }
      })),
      overallFeedback: [
        { from: 0, to: 99, feedback: q.incorrectFeedback || 'Revisá el concepto.' },
        { from: 100, to: 100, feedback: q.correctFeedback || '¡Muy bien!' }
      ],
      behaviour: {
        enableRetry: true,
        enableSolutionsButton: true,
        enableCheckButton: true,
        type: 'auto',
        singlePoint: false,
        randomAnswers: true,
        showSolutionsRequiresInput: true,
        confirmCheckDialog: false,
        confirmRetryDialog: false,
        autoCheck: false,
        passPercentage: 100,
        showScorePoints: true
      },
      UI: {
        checkAnswerButton: 'Comprobar',
        submitAnswerButton: 'Enviar',
        showSolutionButton: 'Mostrar solución',
        tryAgainButton: 'Reintentar',
        tipsLabel: 'Mostrar pista',
        scoreBarLabel: 'Obtuviste :num de :total puntos',
        tipAvailable: 'Pista disponible',
        feedbackAvailable: 'Retroalimentación disponible',
        readFeedback: 'Leer retroalimentación',
        wrongAnswer: 'Respuesta incorrecta',
        correctAnswer: 'Respuesta correcta',
        shouldCheck: 'Debería haberse marcado',
        shouldNotCheck: 'No debería haberse marcado',
        noInput: 'Por favor respondé antes de ver la solución'
      }
    }
  };
}

function buildTrueFalseSubContent(q, idx) {
  const isTrueCorrect = q.correctAnswer !== undefined
    ? Boolean(q.correctAnswer)
    : Boolean(q.options?.find((o) => o.id === 'true')?.isCorrect ?? true);

  return {
    library: libraryString('H5P.TrueFalse'),
    subContentId: crypto.randomUUID(),
    metadata: {
      contentType: 'True/False Question',
      license: 'U',
      title: `Pregunta ${idx + 1} - Verdadero o Falso`
    },
    params: {
      question: `<p>${escapeXml(q.prompt)}</p>`,
      correct: isTrueCorrect ? 'true' : 'false',
      behaviour: {
        enableRetry: true,
        enableSolutionsButton: true,
        enableCheckButton: true,
        confirmCheckDialog: false,
        confirmRetryDialog: false,
        autoCheck: false,
        feedbackOnCorrect: q.correctFeedback || '¡Respuesta correcta!',
        feedbackOnWrong: q.incorrectFeedback || 'Respuesta incorrecta.'
      },
      l10n: {
        trueText: 'Verdadero',
        falseText: 'Falso',
        score: 'Obtuviste @score de @total puntos',
        checkAnswer: 'Comprobar',
        submitAnswer: 'Enviar',
        showSolutionButton: 'Mostrar solución',
        tryAgain: 'Reintentar',
        wrongAnswerMessage: 'Respuesta incorrecta',
        correctAnswerMessage: 'Respuesta correcta',
        scoreBarLabel: 'Obtuviste :num de :total puntos'
      }
    }
  };
}

function buildBlanksSubContent(q, idx) {
  const expectedWord = q.answerTerm || (Array.isArray(q.blanks) && q.blanks[0]) || 'concepto';
  let h5pBlankLine = String(q.prompt || '');
  if (/\[\[([^\]]+)\]\]/.test(h5pBlankLine)) {
    h5pBlankLine = h5pBlankLine.replace(/\[\[([^\]]+)\]\]/g, '*$1*');
  } else {
    h5pBlankLine = `${h5pBlankLine} *${expectedWord}*`;
  }

  return {
    library: libraryString('H5P.Blanks'),
    subContentId: crypto.randomUUID(),
    metadata: {
      contentType: 'Fill in the Blanks',
      license: 'U',
      title: `Pregunta ${idx + 1} - Completar espacios`
    },
    params: {
      text: '<p>Completá el espacio en blanco con el término correspondiente:</p>',
      questions: [`<p>${escapeXml(h5pBlankLine)}</p>`],
      overallFeedback: [
        { from: 0, to: 99, feedback: q.incorrectFeedback || 'Revisá el término.' },
        { from: 100, to: 100, feedback: q.correctFeedback || '¡Correcto!' }
      ],
      behaviour: {
        enableRetry: true,
        enableSolutionsButton: true,
        enableCheckButton: true,
        autoCheck: false,
        caseSensitive: false,
        showSolutionsRequiresInput: true,
        separateLines: false,
        confirmCheckDialog: false,
        confirmRetryDialog: false,
        acceptSpellingErrors: true
      },
      showSolutions: 'Mostrar solución',
      tryAgain: 'Reintentar',
      checkAnswer: 'Comprobar',
      submitAnswer: 'Enviar',
      notFilledOut: 'Por favor completá todos los espacios antes de comprobar',
      answerIsCorrect: '&#039;:ans&#039; es correcto',
      answerIsWrong: '&#039;:ans&#039; es incorrecto',
      answeredCorrectly: 'Respondido correctamente',
      answeredIncorrectly: 'Respondido incorrectamente',
      solutionLabel: 'Respuesta correcta:',
      inputLabel: 'Espacio @num de @total',
      inputHasTipLabel: 'Pista disponible',
      tipLabel: 'Pista',
      scoreBarLabel: 'Obtuviste :num de :total puntos'
    }
  };
}

function buildDragTextSubContent(q, idx) {
  const pairs = q.type === 'ordering'
    ? (q.sequence || []).map((step, sIdx) => ({ left: `Paso ${sIdx + 1}`, right: step }))
    : (q.pairs || [{ left: 'Concepto', right: 'Definición' }]);

  const textFieldLines = pairs
    .map((p) => `${escapeXml(p.left)}: *${escapeXml(p.right).replace(/\*/g, '')}*`)
    .join('\n');

  return {
    library: libraryString('H5P.DragText'),
    subContentId: crypto.randomUUID(),
    metadata: {
      contentType: 'Drag the Words',
      license: 'U',
      title: `Pregunta ${idx + 1} - Relacionar / Ordenar`
    },
    params: {
      taskDescription: `<p>${escapeXml(q.prompt)}</p>`,
      textField: textFieldLines,
      overallFeedback: [
        { from: 0, to: 99, feedback: q.incorrectFeedback || 'Algunas asociaciones no coinciden.' },
        { from: 100, to: 100, feedback: q.correctFeedback || '¡Excelente relación!' }
      ],
      checkAnswer: 'Comprobar',
      submitAnswer: 'Enviar',
      tryAgain: 'Reintentar',
      showSolution: 'Mostrar solución',
      dropZoneIndex: 'Zona @index.',
      empty: 'La zona @index está vacía.',
      contains: 'La zona @index contiene @draggable.',
      ariaDraggableIndex: '@index de @count elementos arrastrables.',
      tipLabel: 'Mostrar pista',
      correctText: '¡Correcto!',
      incorrectText: 'Incorrecto',
      resetDropTitle: 'Reiniciar',
      resetDropDescription: '¿Querés reiniciar esta zona?',
      grabbed: 'Elemento seleccionado.',
      cancelledDragging: 'Arrastre cancelado.',
      correctAnswer: 'Respuesta correcta:',
      feedbackHeader: 'Retroalimentación',
      scoreBarLabel: 'Obtuviste :num de :total puntos',
      behaviour: {
        enableRetry: true,
        enableSolutionsButton: true,
        enableCheckButton: true,
        instantFeedback: false
      }
    }
  };
}

function buildEssaySubContent(q, idx) {
  return {
    library: libraryString('H5P.Essay'),
    subContentId: crypto.randomUUID(),
    metadata: {
      contentType: 'Essay',
      license: 'U',
      title: `Pregunta ${idx + 1} - Desarrollo Abierto`
    },
    params: {
      taskDescription: `<p>${escapeXml(q.prompt)}</p>`,
      placeholderText: 'Escribí tu respuesta o reflexión fundamentada acá...',
      solution: {
        introduction: '<div><strong>Rúbrica y orientación formativa:</strong></div>',
        sample: `<div>${escapeXml(q.rubric || q.correctFeedback || 'Incluí conceptos clave y un ejemplo propio.')}</div>`
      },
      keywords: [
        {
          keyword: '*',
          options: {
            points: 1,
            occurrences: 1,
            caseSensitive: false,
            forgiveMistakes: true,
            feedbackIncluded: q.correctFeedback || 'Respuesta registrada.',
            feedbackMissed: q.incorrectFeedback || 'Revisá la consigna.'
          }
        }
      ],
      overallFeedback: [
        { from: 0, to: 100, feedback: q.correctFeedback || 'Respuesta registrada.' }
      ],
      behaviour: {
        minimumLength: 10,
        inputFieldSize: '10',
        enableRetry: true,
        ignoreScoring: false,
        pointsHost: 1
      },
      checkAnswer: 'Comprobar',
      submitAnswer: 'Enviar',
      tryAgain: 'Reintentar',
      showSolution: 'Ver rúbrica y orientación',
      feedbackHeader: 'Retroalimentación',
      solutionTitle: 'Criterios esperados',
      remainingChars: 'Caracteres restantes: @chars',
      notEnoughChars: 'Debés escribir al menos @chars caracteres.',
      messageSave: 'Guardado',
      scoreBarLabel: 'Obtuviste :num de :total puntos'
    }
  };
}

/**
 * Valida formalmente que el manifiesto h5p.json y content/content.json
 * cumplan el estándar oficial H5P y todas las bibliotecas usadas estén declaradas en preloadedDependencies.
 */
export function validateH5PPackageStructure(h5pJson, contentJson) {
  const errors = [];

  if (!h5pJson || typeof h5pJson !== 'object') {
    errors.push('Falta el manifiesto raíz h5p.json.');
  } else {
    if (!h5pJson.title) errors.push('h5p.json debe incluir "title".');
    if (!h5pJson.language) errors.push('h5p.json debe incluir "language".');
    if (!h5pJson.mainLibrary) errors.push('h5p.json debe incluir "mainLibrary".');
    if (!Array.isArray(h5pJson.embedTypes) || h5pJson.embedTypes.length === 0) {
      errors.push('h5p.json debe incluir "embedTypes".');
    }
    if (!Array.isArray(h5pJson.preloadedDependencies) || h5pJson.preloadedDependencies.length === 0) {
      errors.push('h5p.json debe declarar "preloadedDependencies".');
    }
  }

  if (!contentJson || typeof contentJson !== 'object') {
    errors.push('Falta el archivo de contenido content/content.json.');
  } else if (!Array.isArray(contentJson.questions) || contentJson.questions.length === 0) {
    errors.push('content/content.json debe contener al menos una pregunta interactiva válida en "questions".');
  } else {
    const declaredDeps = new Set(
      (h5pJson?.preloadedDependencies || []).map(
        (d) => `${d.machineName} ${d.majorVersion}.${d.minorVersion}`
      )
    );

    const mainLibDef = H5P_LIBRARY_CATALOG[h5pJson.mainLibrary];
    if (!mainLibDef || !declaredDeps.has(`${mainLibDef.machineName} ${mainLibDef.majorVersion}.${mainLibDef.minorVersion}`)) {
      errors.push(`La biblioteca principal ${h5pJson?.mainLibrary} no está declarada en preloadedDependencies.`);
    }

    contentJson.questions.forEach((subQ, i) => {
      if (!subQ.library) {
        errors.push(`La sub-pregunta #${i + 1} no especifica "library".`);
      } else if (!declaredDeps.has(subQ.library)) {
        errors.push(`La biblioteca "${subQ.library}" usada en la pregunta #${i + 1} no está declarada en preloadedDependencies de h5p.json.`);
      }
      if (!subQ.subContentId || !/^[0-9a-f-]{36}$/i.test(subQ.subContentId)) {
        errors.push(`La sub-pregunta #${i + 1} no posee un UUID subContentId válido.`);
      }
      if (!subQ.params || typeof subQ.params !== 'object') {
        errors.push(`La sub-pregunta #${i + 1} no posee un bloque "params" válido.`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Construye y valida un paquete .h5p oficial listo para importar en el Banco de Contenido de Moodle
 */
export function exportToH5PPackage(activity) {
  if (!activity || !activity.title) {
    throw new Error('La actividad no contiene datos válidos para exportar a H5P.');
  }

  const rawQuestions = activity.content?.questions || [];
  const usedLibKeys = new Set(['H5P.QuestionSet', 'H5P.Question', 'H5P.JoubelUI', 'H5P.Transition', 'H5P.FontIcons', 'FontAwesome']);

  const h5pSubQuestions = rawQuestions.map((q, idx) => {
    if (q.type === 'multiple_choice') {
      usedLibKeys.add('H5P.MultiChoice');
      return buildMultiChoiceSubContent(q, idx);
    }
    if (q.type === 'true_false') {
      usedLibKeys.add('H5P.TrueFalse');
      return buildTrueFalseSubContent(q, idx);
    }
    if (q.type === 'fill_blanks' || q.type === 'crossword_clue') {
      usedLibKeys.add('H5P.Blanks');
      return buildBlanksSubContent(q, idx);
    }
    if (q.type === 'matching' || q.type === 'ordering') {
      usedLibKeys.add('H5P.DragText');
      return buildDragTextSubContent(q, idx);
    }
    usedLibKeys.add('H5P.Essay');
    return buildEssaySubContent(q, idx);
  });

  const preloadedDependencies = Array.from(usedLibKeys).map((key) => H5P_LIBRARY_CATALOG[key]);

  const h5pJson = {
    title: activity.title,
    language: 'es',
    mainLibrary: 'H5P.QuestionSet',
    embedTypes: ['div'],
    license: 'U',
    defaultLanguage: 'es',
    author: 'MoodleAI Creator',
    preloadedDependencies
  };

  const introHtml = `<p><strong>Asignatura:</strong> ${escapeXml(activity.subject)} (${escapeXml(activity.education_level)})</p><p><strong>Instrucciones:</strong> ${escapeXml(activity.student_instructions)}</p><hr/><p>${escapeXml(activity.content?.developmentText || '')}</p>`;

  const contentJson = {
    introPage: {
      showIntroPage: true,
      startButtonText: 'Comenzar actividad',
      title: activity.title,
      introduction: introHtml
    },
    progressType: 'dots',
    passPercentage: 60,
    disableBackwardsNavigation: false,
    randomQuestions: false,
    questions: h5pSubQuestions,
    texts: {
      prevButton: 'Pregunta anterior',
      nextButton: 'Siguiente pregunta',
      finishButton: 'Finalizar',
      submitButton: 'Enviar',
      textualProgress: 'Pregunta @current de @total',
      jumpToQuestion: 'Pregunta %d de %total',
      questionLabel: 'Pregunta',
      readSpeakerProgress: 'Pregunta @current de @total',
      unansweredText: 'Sin responder',
      answeredText: 'Respondida',
      currentQuestionText: 'Pregunta actual',
      navigationLabel: 'Preguntas'
    },
    endGame: {
      showResultPage: true,
      showSolutionButton: true,
      showRetryButton: true,
      noResultMessage: 'Actividad completada',
      message: 'Tu desempeño en la actividad:',
      scoreBarLabel: 'Obtuviste @finals de @totals puntos',
      overallFeedback: [
        {
          from: 0,
          to: 59,
          feedback: 'Te sugerimos revisar la retroalimentación formativa de cada pregunta y realizar un nuevo intento.'
        },
        {
          from: 60,
          to: 100,
          feedback: '¡Excelente trabajo! Alcanzaste los objetivos de aprendizaje propuestos.'
        }
      ],
      solutionButtonText: 'Ver soluciones',
      retryButtonText: 'Reintentar actividad',
      finishButtonText: 'Finalizar',
      submitButtonText: 'Enviar'
    }
  };

  // Validar bibliotecas y dependencias antes de empaquetar
  const validation = validateH5PPackageStructure(h5pJson, contentJson);
  if (!validation.isValid) {
    throw new Error(`Error de validación H5P: ${validation.errors.join(' ')}`);
  }

  const h5pJsonString = JSON.stringify(h5pJson, null, 2);
  const contentJsonString = JSON.stringify(contentJson, null, 2);

  const files = [
    { path: 'h5p.json', content: h5pJsonString },
    { path: 'content/content.json', content: contentJsonString }
  ];

  const zipBuffer = buildZipBuffer(files);
  const fileName = `${slugifyFileName(activity.title)}.h5p`;

  return {
    fileName,
    mimeType: 'application/zip',
    zipBuffer,
    h5pJson,
    contentJson,
    validation,
    filesList: files.map((f) => f.path)
  };
}
