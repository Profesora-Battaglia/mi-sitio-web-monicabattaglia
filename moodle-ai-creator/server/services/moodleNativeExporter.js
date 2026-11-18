/**
 * MoodleAI Creator — Motor de Exportación Moodle Nativo (Módulo 4A)
 * Genera archivos Moodle XML (.xml) y Formato GIFT (.gift.txt) 100% compatibles
 * con el importador oficial del Banco de Preguntas de Moodle (Moodle 3.x, 4.x y 5.x).
 */

export function escapeXml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function slugifyFileName(text, fallback = 'actividad-moodle') {
  const clean = String(text || fallback)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return clean || fallback;
}

/**
 * Escapa caracteres reservados de la sintaxis GIFT de Moodle (~ = # { } :)
 */
export function escapeGiftText(str) {
  return String(str ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/~/g, '\\~')
    .replace(/=/g, '\\=')
    .replace(/#/g, '\\#')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/:/g, '\\:')
    .replace(/\r?\n/g, ' ');
}

/**
 * 1. Generador de Moodle XML (Estándar Oficial Moodle Quiz XML)
 */
export function exportToMoodleXML(activity) {
  if (!activity || !activity.title) {
    throw new Error('La actividad no contiene datos válidos para exportar a Moodle XML.');
  }

  const questions = activity.content?.questions || [];
  const categoryName = `$course$/top/MoodleAI Creator/${activity.subject || 'General'}/${activity.title}`;
  const xmlLines = [];

  xmlLines.push('<?xml version="1.0" encoding="UTF-8"?>');
  xmlLines.push('<quiz>');
  xmlLines.push('  <!-- Generado por MoodleAI Creator (Formato Oficial Moodle XML) -->');

  // Pregunta de tipo Categoría para organizar el Banco de Preguntas en Moodle
  xmlLines.push('  <question type="category">');
  xmlLines.push('    <category>');
  xmlLines.push(`      <text>${escapeXml(categoryName)}</text>`);
  xmlLines.push('    </category>');
  xmlLines.push('    <info format="html">');
  xmlLines.push(`      <text><![CDATA[<p>${escapeXml(activity.description || '')}</p>]]></text>`);
  xmlLines.push('    </info>');
  xmlLines.push('  </question>');

  // Bloque introductorio de tipo Description (texto de desarrollo + instrucciones)
  if (activity.content?.developmentText) {
    xmlLines.push('  <question type="description">');
    xmlLines.push('    <name>');
    xmlLines.push(`      <text>${escapeXml(`00. Introducción y Desarrollo: ${activity.title}`)}</text>`);
    xmlLines.push('    </name>');
    xmlLines.push('    <questiontext format="html">');
    xmlLines.push(
      `      <text><![CDATA[<h3>${escapeXml(activity.title)}</h3><p><strong>Instrucciones:</strong> ${escapeXml(activity.student_instructions || '')}</p><hr/><p>${escapeXml(activity.content.developmentText)}</p>]]></text>`
    );
    xmlLines.push('    </questiontext>');
    xmlLines.push('    <generalfeedback format="html"><text></text></generalfeedback>');
    xmlLines.push('    <defaultgrade>0.0000000</defaultgrade>');
    xmlLines.push('    <penalty>0.0000000</penalty>');
    xmlLines.push('    <hidden>0</hidden>');
    xmlLines.push('  </question>');
  }

  // Exportar cada pregunta según su tipo
  questions.forEach((q, idx) => {
    const num = String(idx + 1).padStart(2, '0');
    const qName = `${num}. ${activity.topic || activity.title} (${q.id || `Q${idx + 1}`})`;
    const defaultGrade = Number(q.points || activity.points_per_question || 2.0).toFixed(7);
    const generalFb = q.correctFeedback || 'Gracias por responder esta consigna.';

    if (q.type === 'multiple_choice') {
      xmlLines.push('  <question type="multichoice">');
      xmlLines.push(`    <name><text>${escapeXml(qName)}</text></name>`);
      xmlLines.push('    <questiontext format="html">');
      xmlLines.push(`      <text><![CDATA[<p>${escapeXml(q.prompt)}</p>]]></text>`);
      xmlLines.push('    </questiontext>');
      xmlLines.push('    <generalfeedback format="html">');
      xmlLines.push(`      <text><![CDATA[<p>${escapeXml(generalFb)}</p>]]></text>`);
      xmlLines.push('    </generalfeedback>');
      xmlLines.push(`    <defaultgrade>${defaultGrade}</defaultgrade>`);
      xmlLines.push('    <penalty>0.3333333</penalty>');
      xmlLines.push('    <hidden>0</hidden>');
      xmlLines.push('    <single>true</single>');
      xmlLines.push('    <shuffleanswers>true</shuffleanswers>');
      xmlLines.push('    <answernumbering>abc</answernumbering>');
      xmlLines.push('    <correctfeedback format="html">');
      xmlLines.push(`      <text><![CDATA[<p>${escapeXml(q.correctFeedback || '¡Respuesta correcta!')}</p>]]></text>`);
      xmlLines.push('    </correctfeedback>');
      xmlLines.push('    <incorrectfeedback format="html">');
      xmlLines.push(`      <text><![CDATA[<p>${escapeXml(q.incorrectFeedback || 'Respuesta incorrecta.')}</p>]]></text>`);
      xmlLines.push('    </incorrectfeedback>');

      const options = Array.isArray(q.options) && q.options.length > 0
        ? q.options
        : [
            { text: 'Opción A', isCorrect: true },
            { text: 'Opción B', isCorrect: false }
          ];

      for (const opt of options) {
        const fraction = opt.isCorrect ? '100' : '0';
        const optFeedback = opt.isCorrect ? (q.correctFeedback || '¡Correcto!') : (q.incorrectFeedback || 'Revisá el concepto.');
        xmlLines.push(`    <answer fraction="${fraction}" format="html">`);
        xmlLines.push(`      <text><![CDATA[<p>${escapeXml(opt.text)}</p>]]></text>`);
        xmlLines.push('      <feedback format="html">');
        xmlLines.push(`        <text><![CDATA[<p>${escapeXml(optFeedback)}</p>]]></text>`);
        xmlLines.push('      </feedback>');
        xmlLines.push('    </answer>');
      }
      xmlLines.push('  </question>');
    } else if (q.type === 'true_false') {
      const isTrueCorrect = q.correctAnswer !== undefined
        ? Boolean(q.correctAnswer)
        : Boolean(q.options?.find((o) => o.id === 'true')?.isCorrect ?? true);

      xmlLines.push('  <question type="truefalse">');
      xmlLines.push(`    <name><text>${escapeXml(qName)}</text></name>`);
      xmlLines.push('    <questiontext format="html">');
      xmlLines.push(`      <text><![CDATA[<p>${escapeXml(q.prompt)}</p>]]></text>`);
      xmlLines.push('    </questiontext>');
      xmlLines.push('    <generalfeedback format="html">');
      xmlLines.push(`      <text><![CDATA[<p>${escapeXml(generalFb)}</p>]]></text>`);
      xmlLines.push('    </generalfeedback>');
      xmlLines.push(`    <defaultgrade>${defaultGrade}</defaultgrade>`);
      xmlLines.push('    <penalty>1.0000000</penalty>');
      xmlLines.push('    <hidden>0</hidden>');

      xmlLines.push(`    <answer fraction="${isTrueCorrect ? '100' : '0'}" format="moodle_auto_format">`);
      xmlLines.push('      <text>true</text>');
      xmlLines.push('      <feedback format="html">');
      xmlLines.push(`        <text><![CDATA[<p>${escapeXml(isTrueCorrect ? q.correctFeedback : q.incorrectFeedback)}</p>]]></text>`);
      xmlLines.push('      </feedback>');
      xmlLines.push('    </answer>');

      xmlLines.push(`    <answer fraction="${!isTrueCorrect ? '100' : '0'}" format="moodle_auto_format">`);
      xmlLines.push('      <text>false</text>');
      xmlLines.push('      <feedback format="html">');
      xmlLines.push(`        <text><![CDATA[<p>${escapeXml(!isTrueCorrect ? q.correctFeedback : q.incorrectFeedback)}</p>]]></text>`);
      xmlLines.push('      </feedback>');
      xmlLines.push('    </answer>');
      xmlLines.push('  </question>');
    } else if (q.type === 'fill_blanks' || q.type === 'crossword_clue') {
      const expectedAnswer = q.answerTerm || (Array.isArray(q.blanks) && q.blanks[0]) || 'respuesta';
      const cleanPrompt = String(q.prompt).replace(/\[\[([^\]]+)\]\]/g, '__________');

      xmlLines.push('  <question type="shortanswer">');
      xmlLines.push(`    <name><text>${escapeXml(qName)}</text></name>`);
      xmlLines.push('    <questiontext format="html">');
      xmlLines.push(`      <text><![CDATA[<p>${escapeXml(cleanPrompt)}</p>]]></text>`);
      xmlLines.push('    </questiontext>');
      xmlLines.push('    <generalfeedback format="html">');
      xmlLines.push(`      <text><![CDATA[<p>${escapeXml(generalFb)}</p>]]></text>`);
      xmlLines.push('    </generalfeedback>');
      xmlLines.push(`    <defaultgrade>${defaultGrade}</defaultgrade>`);
      xmlLines.push('    <penalty>0.3333333</penalty>');
      xmlLines.push('    <hidden>0</hidden>');
      xmlLines.push('    <usecase>0</usecase>');
      xmlLines.push('    <answer fraction="100" format="moodle_auto_format">');
      xmlLines.push(`      <text>${escapeXml(expectedAnswer)}</text>`);
      xmlLines.push('      <feedback format="html">');
      xmlLines.push(`        <text><![CDATA[<p>${escapeXml(q.correctFeedback || '¡Correcto!')}</p>]]></text>`);
      xmlLines.push('      </feedback>');
      xmlLines.push('    </answer>');
      xmlLines.push('  </question>');
    } else if (q.type === 'matching' || q.type === 'ordering') {
      const pairs = q.type === 'ordering'
        ? (q.sequence || []).map((step, sIdx) => ({ left: step, right: `Paso ${sIdx + 1}` }))
        : (q.pairs || []);

      xmlLines.push('  <question type="matching">');
      xmlLines.push(`    <name><text>${escapeXml(qName)}</text></name>`);
      xmlLines.push('    <questiontext format="html">');
      xmlLines.push(`      <text><![CDATA[<p>${escapeXml(q.prompt)}</p>]]></text>`);
      xmlLines.push('    </questiontext>');
      xmlLines.push('    <generalfeedback format="html">');
      xmlLines.push(`      <text><![CDATA[<p>${escapeXml(generalFb)}</p>]]></text>`);
      xmlLines.push('    </generalfeedback>');
      xmlLines.push(`    <defaultgrade>${defaultGrade}</defaultgrade>`);
      xmlLines.push('    <penalty>0.3333333</penalty>');
      xmlLines.push('    <hidden>0</hidden>');
      xmlLines.push('    <shuffleanswers>true</shuffleanswers>');

      for (const pair of pairs) {
        xmlLines.push('    <subquestion format="html">');
        xmlLines.push(`      <text><![CDATA[<p>${escapeXml(pair.left)}</p>]]></text>`);
        xmlLines.push('      <answer>');
        xmlLines.push(`        <text>${escapeXml(pair.right)}</text>`);
        xmlLines.push('      </answer>');
        xmlLines.push('    </subquestion>');
      }
      xmlLines.push('  </question>');
    } else {
      // essay / preguntas abiertas / casos prácticos / reflexión
      xmlLines.push('  <question type="essay">');
      xmlLines.push(`    <name><text>${escapeXml(qName)}</text></name>`);
      xmlLines.push('    <questiontext format="html">');
      xmlLines.push(`      <text><![CDATA[<p>${escapeXml(q.prompt)}</p>]]></text>`);
      xmlLines.push('    </questiontext>');
      xmlLines.push('    <generalfeedback format="html">');
      xmlLines.push(`      <text><![CDATA[<p>${escapeXml(generalFb)}</p>]]></text>`);
      xmlLines.push('    </generalfeedback>');
      xmlLines.push(`    <defaultgrade>${defaultGrade}</defaultgrade>`);
      xmlLines.push('    <penalty>0.0000000</penalty>');
      xmlLines.push('    <hidden>0</hidden>');
      xmlLines.push('    <responseformat>editor</responseformat>');
      xmlLines.push('    <responserequired>1</responserequired>');
      xmlLines.push('    <responsefieldlines>10</responsefieldlines>');
      xmlLines.push('    <graderinfo format="html">');
      xmlLines.push(`      <text><![CDATA[<p><strong>Rúbrica / Criterios para el docente:</strong> ${escapeXml(q.rubric || q.correctFeedback || '')}</p>]]></text>`);
      xmlLines.push('    </graderinfo>');
      xmlLines.push('  </question>');
    }
  });

  xmlLines.push('</quiz>');

  const fileName = `${slugifyFileName(activity.title)}-moodle.xml`;
  return {
    fileName,
    mimeType: 'application/xml; charset=utf-8',
    content: xmlLines.join('\n')
  };
}

/**
 * 2. Generador de Formato GIFT (Estándar Oficial Moodle GIFT)
 */
export function exportToMoodleGIFT(activity) {
  if (!activity || !activity.title) {
    throw new Error('La actividad no contiene datos válidos para exportar a formato GIFT.');
  }

  const questions = activity.content?.questions || [];
  const lines = [];

  lines.push('// ====================================================================');
  lines.push(`// MoodleAI Creator — Exportación Formato GIFT para Banco de Preguntas`);
  lines.push(`// Actividad: ${activity.title}`);
  lines.push(`// Asignatura: ${activity.subject} | Nivel: ${activity.education_level}`);
  lines.push('// ====================================================================');
  lines.push('');
  lines.push(`$CATEGORY: $course$/top/MoodleAI Creator/${activity.subject || 'General'}/${activity.title}`);
  lines.push('');

  // Descripción / Desarrollo teórico inicial en GIFT (sin bloque {})
  if (activity.content?.developmentText) {
    lines.push(`::00_Introduccion::[html]<h3>${escapeGiftText(activity.title)}</h3><p>${escapeGiftText(activity.content.developmentText)}</p>`);
    lines.push('');
  }

  questions.forEach((q, idx) => {
    const qTitle = `Q${String(idx + 1).padStart(2, '0')}_${slugifyFileName(activity.topic || activity.title).slice(0, 25)}`;
    const cleanPrompt = escapeGiftText(String(q.prompt).replace(/\[\[([^\]]+)\]\]/g, '__________'));

    if (q.type === 'multiple_choice') {
      lines.push(`::${qTitle}::${cleanPrompt} {`);
      const options = Array.isArray(q.options) && q.options.length > 0
        ? q.options
        : [
            { text: 'Opción A', isCorrect: true },
            { text: 'Opción B', isCorrect: false }
          ];
      for (const opt of options) {
        const prefix = opt.isCorrect ? '=' : '~';
        const fb = opt.isCorrect ? q.correctFeedback : q.incorrectFeedback;
        lines.push(`  ${prefix}${escapeGiftText(opt.text)}${fb ? ` #${escapeGiftText(fb)}` : ''}`);
      }
      lines.push('}');
      lines.push('');
    } else if (q.type === 'true_false') {
      const isTrueCorrect = q.correctAnswer !== undefined
        ? Boolean(q.correctAnswer)
        : Boolean(q.options?.find((o) => o.id === 'true')?.isCorrect ?? true);
      const boolToken = isTrueCorrect ? 'TRUE' : 'FALSE';
      const wrongFb = escapeGiftText(q.incorrectFeedback || 'Respuesta incorrecta.');
      const rightFb = escapeGiftText(q.correctFeedback || '¡Respuesta correcta!');
      lines.push(`::${qTitle}::${cleanPrompt} {${boolToken} #${wrongFb} #${rightFb}}`);
      lines.push('');
    } else if (q.type === 'fill_blanks' || q.type === 'crossword_clue') {
      const expectedAnswer = q.answerTerm || (Array.isArray(q.blanks) && q.blanks[0]) || 'respuesta';
      const rightFb = escapeGiftText(q.correctFeedback || '¡Correcto!');
      lines.push(`::${qTitle}::${cleanPrompt} { =${escapeGiftText(expectedAnswer)} #${rightFb} }`);
      lines.push('');
    } else if (q.type === 'matching' || q.type === 'ordering') {
      const pairs = q.type === 'ordering'
        ? (q.sequence || []).map((step, sIdx) => ({ left: step, right: `Paso ${sIdx + 1}` }))
        : (q.pairs || []);
      lines.push(`::${qTitle}::${cleanPrompt} {`);
      for (const pair of pairs) {
        lines.push(`  =${escapeGiftText(pair.left)} -> ${escapeGiftText(pair.right)}`);
      }
      lines.push('}');
      lines.push('');
    } else {
      // Pregunta abierta / Essay en GIFT se representa con llaves vacías {}
      lines.push(`::${qTitle}::${cleanPrompt} {}`);
      lines.push('');
    }
  });

  const fileName = `${slugifyFileName(activity.title)}-moodle.gift.txt`;
  return {
    fileName,
    mimeType: 'text/plain; charset=utf-8',
    content: lines.join('\n')
  };
}
