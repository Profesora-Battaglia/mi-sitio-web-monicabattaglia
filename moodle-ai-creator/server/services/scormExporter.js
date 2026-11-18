import { buildZipBuffer } from './zipBuilder.js';
import { escapeXml, slugifyFileName } from './moodleNativeExporter.js';

/**
 * MoodleAI Creator — Motor de Exportación SCORM 1.2 y SCORM 2004 (Módulo 4C)
 * Genera paquetes .zip válidos para Moodle con:
 * - imsmanifest.xml (SCORM 1.2 o SCORM 2004 3rd Edition)
 * - index.html (Reproductor accesible con navegación por etapas y barra de progreso)
 * - styles.css (Diseño responsive EdTech)
 * - scorm-driver.js (Comunicación real con window.API y window.API_1484_11)
 * - activity-app.js (Lógica de navegación, evaluación formativa, cálculo de puntaje y finalización)
 */

function buildImsManifest(activity, version = '1.2') {
  const is2004 = version === '2004';
  const orgId = `ORG_${slugifyFileName(activity.id || 'moodleai').toUpperCase().replace(/-/g, '_')}`;
  const itemId = `ITEM_${orgId}`;
  const resId = `RES_${orgId}`;
  const title = escapeXml(activity.title || 'Actividad Interactiva MoodleAI');

  if (is2004) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="MANIFEST_${orgId}" version="1.0"
  xmlns="http://www.imsglobal.org/xsd/imscp_v1p1"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3"
  xmlns:adlseq="http://www.adlnet.org/xsd/adlseq_v1p3"
  xmlns:adlnav="http://www.adlnet.org/xsd/adlnav_v1p3"
  xmlns:imsss="http://www.imsglobal.org/xsd/imsss"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>2004 3rd Edition</schemaversion>
  </metadata>
  <organizations default="${orgId}">
    <organization identifier="${orgId}">
      <title>${title}</title>
      <item identifier="${itemId}" identifierref="${resId}">
        <title>${title}</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="${resId}" type="webcontent" adlcp:scormType="sco" href="index.html">
      <file href="index.html"/>
      <file href="styles.css"/>
      <file href="scorm-driver.js"/>
      <file href="activity-app.js"/>
    </resource>
  </resources>
</manifest>`;
  }

  // SCORM 1.2 (El estándar de mayor compatibilidad nativa con el módulo SCORM de Moodle)
  return `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="MANIFEST_${orgId}" version="1.1"
  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="${orgId}">
    <organization identifier="${orgId}">
      <title>${title}</title>
      <item identifier="${itemId}" identifierref="${resId}" isvisible="true">
        <title>${title}</title>
        <adlcp:masteryscore>60</adlcp:masteryscore>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="${resId}" type="webcontent" adlcp:scormtype="sco" href="index.html">
      <file href="index.html"/>
      <file href="styles.css"/>
      <file href="scorm-driver.js"/>
      <file href="activity-app.js"/>
    </resource>
  </resources>
</manifest>`;
}

function buildScormDriverJs() {
  return `/**
 * Controlador de Comunicación con la API SCORM de Moodle (Soporta SCORM 1.2 y SCORM 2004)
 */
(function (window) {
  let apiHandle = null;
  let scormVersion = null;
  let initialized = false;
  let finished = false;

  function findAPI12(win) {
    let attempts = 0;
    while (win && !win.API && win.parent && win.parent !== win && attempts < 15) {
      attempts++;
      win = win.parent;
    }
    return win && win.API ? win.API : null;
  }

  function findAPI2004(win) {
    let attempts = 0;
    while (win && !win.API_1484_11 && win.parent && win.parent !== win && attempts < 15) {
      attempts++;
      win = win.parent;
    }
    return win && win.API_1484_11 ? win.API_1484_11 : null;
  }

  function locateAPI() {
    let api12 = findAPI12(window);
    if (!api12 && window.opener) api12 = findAPI12(window.opener);
    if (api12) {
      apiHandle = api12;
      scormVersion = '1.2';
      return;
    }

    let api2004 = findAPI2004(window);
    if (!api2004 && window.opener) api2004 = findAPI2004(window.opener);
    if (api2004) {
      apiHandle = api2004;
      scormVersion = '2004';
    }
  }

  const ScormBridge = {
    init() {
      if (initialized) return true;
      locateAPI();
      if (!apiHandle) {
        console.info('[SCORM] Ejecutando en modo vista previa local (fuera de LMS Moodle).');
        initialized = true;
        return false;
      }

      try {
        if (scormVersion === '1.2') {
          apiHandle.LMSInitialize('');
          const status = apiHandle.LMSGetValue('cmi.core.lesson_status');
          if (!status || status === 'not attempted') {
            apiHandle.LMSSetValue('cmi.core.lesson_status', 'incomplete');
            apiHandle.LMSCommit('');
          }
        } else if (scormVersion === '2004') {
          apiHandle.Initialize('');
          const status = apiHandle.GetValue('cmi.completion_status');
          if (!status || status === 'unknown' || status === 'not attempted') {
            apiHandle.SetValue('cmi.completion_status', 'incomplete');
            apiHandle.Commit('');
          }
        }
        initialized = true;
        return true;
      } catch (e) {
        console.warn('[SCORM] Error al inicializar la API:', e);
        return false;
      }
    },

    getConnectionInfo() {
      return {
        connected: Boolean(apiHandle),
        version: scormVersion || 'Modo Local'
      };
    },

    saveProgress(stepIndex, totalSteps, stateObj) {
      if (!apiHandle) return;
      try {
        const locationStr = 'step_' + stepIndex + '_of_' + totalSteps;
        const suspendStr = JSON.stringify(stateObj || {}).slice(0, 3800);
        if (scormVersion === '1.2') {
          apiHandle.LMSSetValue('cmi.core.lesson_location', locationStr);
          apiHandle.LMSSetValue('cmi.suspend_data', suspendStr);
          apiHandle.LMSCommit('');
        } else if (scormVersion === '2004') {
          apiHandle.SetValue('cmi.location', locationStr);
          apiHandle.SetValue('cmi.suspend_data', suspendStr);
          const progressMeasure = Math.min(1, Math.max(0, stepIndex / Math.max(1, totalSteps))).toFixed(2);
          apiHandle.SetValue('cmi.progress_measure', progressMeasure);
          apiHandle.Commit('');
        }
      } catch (e) {
        console.warn('[SCORM] Error guardando progreso:', e);
      }
    },

    reportScoreAndCompletion(scorePercent, passed) {
      const normalizedScore = Math.min(100, Math.max(0, Math.round(Number(scorePercent) || 0)));
      if (!apiHandle) return { reportedToLms: false, score: normalizedScore };

      try {
        if (scormVersion === '1.2') {
          apiHandle.LMSSetValue('cmi.core.score.min', '0');
          apiHandle.LMSSetValue('cmi.core.score.max', '100');
          apiHandle.LMSSetValue('cmi.core.score.raw', String(normalizedScore));
          apiHandle.LMSSetValue('cmi.core.lesson_status', passed ? 'passed' : 'completed');
          apiHandle.LMSCommit('');
        } else if (scormVersion === '2004') {
          apiHandle.SetValue('cmi.score.min', '0');
          apiHandle.SetValue('cmi.score.max', '100');
          apiHandle.SetValue('cmi.score.raw', String(normalizedScore));
          apiHandle.SetValue('cmi.score.scaled', (normalizedScore / 100).toFixed(2));
          apiHandle.SetValue('cmi.completion_status', 'completed');
          apiHandle.SetValue('cmi.success_status', passed ? 'passed' : 'failed');
          apiHandle.SetValue('cmi.progress_measure', '1.00');
          apiHandle.Commit('');
        }
        return { reportedToLms: true, score: normalizedScore };
      } catch (e) {
        console.warn('[SCORM] Error enviando calificación:', e);
        return { reportedToLms: false, score: normalizedScore };
      }
    },

    finish() {
      if (!apiHandle || finished) return;
      try {
        if (scormVersion === '1.2') {
          apiHandle.LMSCommit('');
          apiHandle.LMSFinish('');
        } else if (scormVersion === '2004') {
          apiHandle.Commit('');
          apiHandle.Terminate('');
        }
        finished = true;
      } catch (e) {
        console.warn('[SCORM] Error al finalizar sesión:', e);
      }
    }
  };

  window.ScormBridge = ScormBridge;
  window.addEventListener('beforeunload', function () {
    ScormBridge.finish();
  });
})(window);
`;
}

function buildScormStylesCss() {
  return `:root {
  --primary: #1d4ed8;
  --primary-light: #eff6ff;
  --orange: #ea580c;
  --emerald: #059669;
  --emerald-light: #ecfdf5;
  --danger: #dc2626;
  --danger-light: #fef2f2;
  --bg: #f1f5f9;
  --card: #ffffff;
  --text: #0f172a;
  --muted: #475569;
  --border: #cbd5e1;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  padding: 20px;
}
.scorm-shell {
  max-width: 900px;
  margin: 0 auto;
  background: var(--card);
  border-radius: 14px;
  border: 1px solid var(--border);
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08);
  overflow: hidden;
}
.scorm-header {
  background: linear-gradient(135deg, #1e3a8a, #2563eb);
  color: #fff;
  padding: 22px 26px;
}
.scorm-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 0.8rem;
}
.badge {
  background: rgba(255,255,255,0.2);
  padding: 3px 10px;
  border-radius: 99px;
  font-weight: 700;
}
.progress-bar-wrap {
  background: rgba(15, 23, 42, 0.35);
  height: 10px;
  border-radius: 99px;
  margin-top: 14px;
  overflow: hidden;
}
.progress-bar-fill {
  background: #38bdf8;
  height: 100%;
  width: 33%;
  transition: width 0.3s ease;
}
.scorm-nav-steps {
  display: flex;
  border-bottom: 1px solid var(--border);
  background: #f8fafc;
}
.step-tab {
  flex: 1;
  padding: 12px;
  text-align: center;
  font-weight: 700;
  font-size: 0.9rem;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--muted);
  border-bottom: 3px solid transparent;
}
.step-tab.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
  background: #fff;
}
.scorm-body {
  padding: 26px;
}
.step-panel { display: none; }
.step-panel.active { display: block; }
.info-box {
  background: var(--primary-light);
  border-left: 4px solid var(--primary);
  padding: 14px 16px;
  border-radius: 8px;
  margin: 14px 0;
}
.question-card {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
  background: #f8fafc;
}
.option-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 1px solid var(--border);
  padding: 10px 12px;
  border-radius: 8px;
  margin-top: 8px;
  cursor: pointer;
}
.feedback-msg {
  margin-top: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
}
.fb-ok { background: var(--emerald-light); color: #065f46; border: 1px solid #a7f3d0; }
.fb-err { background: var(--danger-light); color: #991b1b; border: 1px solid #fecaca; }
.scorm-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 26px;
  border-top: 1px solid var(--border);
  background: #f8fafc;
}
.btn {
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 700;
  border: 1px solid transparent;
  cursor: pointer;
  font-size: 0.92rem;
}
.btn-primary { background: var(--primary); color: #fff; }
.btn-outline { background: #fff; border-color: var(--border); color: var(--text); }
.btn-success { background: var(--emerald); color: #fff; }
`;
}

function buildScormIndexHtml(activity, version) {
  return `<!DOCTYPE html>
<html lang="es-AR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeXml(activity.title)}</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div class="scorm-shell" role="main">
    <header class="scorm-header">
      <div class="scorm-meta">
        <span class="badge">${escapeXml(activity.subject)}</span>
        <span class="badge">${escapeXml(activity.education_level)}</span>
        <span class="badge">SCORM ${escapeXml(version)}</span>
        <span class="badge" id="lms-status-badge">Conectando LMS...</span>
      </div>
      <h1 style="font-size:1.45rem;">${escapeXml(activity.title)}</h1>
      <p style="font-size:0.92rem;opacity:0.9;margin-top:4px;">${escapeXml(activity.description)}</p>
      <div class="progress-bar-wrap" aria-label="Progreso de la actividad">
        <div class="progress-bar-fill" id="progress-fill"></div>
      </div>
    </header>

    <nav class="scorm-nav-steps" aria-label="Etapas de la actividad">
      <button type="button" class="step-tab active" data-step="1">1. Introducción y Desarrollo</button>
      <button type="button" class="step-tab" data-step="2">2. Actividades Interactivas</button>
      <button type="button" class="step-tab" data-step="3">3. Resultado y Finalización</button>
    </nav>

    <div class="scorm-body">
      <!-- Paso 1: Desarrollo Conceptual -->
      <section class="step-panel active" id="step-panel-1">
        <h2>📖 Desarrollo del Tema y Objetivos</h2>
        <div class="info-box">
          <strong>Instrucciones para el estudiante:</strong><br/>
          ${escapeXml(activity.student_instructions)}
        </div>
        <div style="margin-top:16px;font-size:1rem;">
          <p>${escapeXml(activity.content?.developmentText || '')}</p>
        </div>
      </section>

      <!-- Paso 2: Preguntas Interactivas -->
      <section class="step-panel" id="step-panel-2">
        <h2>✍️ Consignas Interactivas</h2>
        <p style="color:#475569;margin-bottom:14px;">Respondé cada consigna para recibir retroalimentación formativa y registrar tu puntuación.</p>
        <div id="questions-container"></div>
      </section>

      <!-- Paso 3: Resumen y Envío SCORM -->
      <section class="step-panel" id="step-panel-3">
        <h2>🏆 Resumen de Desempeño y Estado SCORM</h2>
        <div id="final-summary-box" class="info-box" style="margin-top:14px;"></div>
        <div style="margin-top:16px;">
          <button type="button" class="btn btn-success" id="btn-finish-scorm">
            ✅ Confirmar Finalización y Guardar Nota en Moodle
          </button>
        </div>
      </section>
    </div>

    <footer class="scorm-footer">
      <button type="button" class="btn btn-outline" id="btn-prev-step" disabled>&larr; Anterior</button>
      <span id="step-indicator" style="font-size:0.88rem;font-weight:700;color:#475569;">Etapa 1 de 3 (33%)</span>
      <button type="button" class="btn btn-primary" id="btn-next-step">Siguiente &rarr;</button>
    </footer>
  </div>

  <script src="scorm-driver.js"></script>
  <script src="activity-app.js"></script>
</body>
</html>`;
}

function buildScormActivityAppJs(activity) {
  const safeJson = JSON.stringify({
    title: activity.title,
    isEvaluation: Boolean(activity.is_evaluation),
    pointsPerQuestion: Number(activity.points_per_question || 2),
    questions: activity.content?.questions || []
  });

  return `/**
 * Lógica Interactiva del Paquete SCORM generado por MoodleAI Creator
 */
const ACTIVITY_DATA = ${safeJson};

let currentStep = 1;
const totalSteps = 3;
const scoresByQuestion = {};

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function goToStep(stepNum) {
  currentStep = Math.min(totalSteps, Math.max(1, stepNum));
  document.querySelectorAll('.step-panel').forEach((p, idx) => {
    p.classList.toggle('active', idx + 1 === currentStep);
  });
  document.querySelectorAll('.step-tab').forEach((t, idx) => {
    t.classList.toggle('active', idx + 1 === currentStep);
  });

  const pct = Math.round((currentStep / totalSteps) * 100);
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('step-indicator').textContent = 'Etapa ' + currentStep + ' de ' + totalSteps + ' (' + pct + '%)';
  document.getElementById('btn-prev-step').disabled = currentStep === 1;
  document.getElementById('btn-next-step').disabled = currentStep === totalSteps;

  window.ScormBridge.saveProgress(currentStep, totalSteps, { scoresByQuestion });

  if (currentStep === 3) {
    renderFinalSummary();
  }
}

function renderQuestions() {
  const container = document.getElementById('questions-container');
  const questions = ACTIVITY_DATA.questions || [];

  container.innerHTML = questions.map((q, idx) => {
    const pts = Number(q.points || ACTIVITY_DATA.pointsPerQuestion || 2);
    if (q.type === 'multiple_choice' || q.type === 'true_false') {
      return \`
        <div class="question-card" data-q-idx="\${idx}">
          <p style="font-weight:700;">\${idx + 1}. \${esc(q.prompt)} <span style="color:#475569;">(\${pts} pts)</span></p>
          <div>
            \${(q.options || []).map((opt) => \`
              <label class="option-item">
                <input type="radio" name="scorm_q_\${idx}" data-correct="\${opt.isCorrect ? '1' : '0'}" data-pts="\${pts}" />
                <span>\${esc(opt.text)}</span>
              </label>
            \`).join('')}
          </div>
          <div id="fb_\${idx}" class="feedback-msg" style="display:none;"></div>
        </div>
      \`;
    }
    if (q.type === 'fill_blanks' || q.type === 'crossword_clue') {
      const expected = q.answerTerm || (q.blanks && q.blanks[0]) || '';
      return \`
        <div class="question-card" data-q-idx="\${idx}">
          <p style="font-weight:700;">\${idx + 1}. \${esc(q.prompt)} <span style="color:#475569;">(\${pts} pts)</span></p>
          <div style="display:flex;gap:8px;margin-top:10px;">
            <input type="text" id="blank_\${idx}" placeholder="Escribí tu respuesta..." style="flex:1;padding:8px;border:1px solid #cbd5e1;border-radius:6px;" />
            <button type="button" class="btn btn-primary" data-check-blank="\${idx}" data-expected="\${esc(expected)}" data-pts="\${pts}">Comprobar</button>
          </div>
          <div id="fb_\${idx}" class="feedback-msg" style="display:none;"></div>
        </div>
      \`;
    }
    return \`
      <div class="question-card" data-q-idx="\${idx}">
        <p style="font-weight:700;">\${idx + 1}. \${esc(q.prompt)} <span style="color:#475569;">(\${pts} pts)</span></p>
        <button type="button" class="btn btn-outline" style="margin-top:10px;" data-complete-q="\${idx}" data-pts="\${pts}">
          ✅ Confirmar resolución de consigna
        </button>
        <div id="fb_\${idx}" class="feedback-msg" style="display:none;"></div>
      </div>
    \`;
  }).join('');

  container.querySelectorAll('input[type="radio"]').forEach((radio) => {
    radio.addEventListener('change', (e) => {
      const card = e.target.closest('.question-card');
      const idx = Number(card.dataset.qIdx);
      const q = questions[idx];
      const isOk = e.target.dataset.correct === '1';
      const pts = Number(e.target.dataset.pts || 2);
      scoresByQuestion[idx] = isOk ? pts : 0;

      const fb = document.getElementById('fb_' + idx);
      fb.style.display = 'block';
      fb.className = 'feedback-msg ' + (isOk ? 'fb-ok' : 'fb-err');
      fb.textContent = isOk ? '✅ ' + q.correctFeedback : '❌ ' + q.incorrectFeedback;
      window.ScormBridge.saveProgress(currentStep, totalSteps, { scoresByQuestion });
    });
  });

  container.querySelectorAll('[data-check-blank]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.checkBlank);
      const expected = (btn.dataset.expected || '').trim().toLowerCase();
      const pts = Number(btn.dataset.pts || 2);
      const val = (document.getElementById('blank_' + idx)?.value || '').trim().toLowerCase();
      const q = questions[idx];
      const isOk = Boolean(val && val === expected);
      scoresByQuestion[idx] = isOk ? pts : 0;

      const fb = document.getElementById('fb_' + idx);
      fb.style.display = 'block';
      fb.className = 'feedback-msg ' + (isOk ? 'fb-ok' : 'fb-err');
      fb.textContent = isOk ? '✅ ' + q.correctFeedback : '❌ ' + q.incorrectFeedback;
      window.ScormBridge.saveProgress(currentStep, totalSteps, { scoresByQuestion });
    });
  });

  container.querySelectorAll('[data-complete-q]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.completeQ);
      const pts = Number(btn.dataset.pts || 2);
      const q = questions[idx];
      scoresByQuestion[idx] = pts;

      const fb = document.getElementById('fb_' + idx);
      fb.style.display = 'block';
      fb.className = 'feedback-msg fb-ok';
      fb.textContent = '✅ ' + q.correctFeedback;
      window.ScormBridge.saveProgress(currentStep, totalSteps, { scoresByQuestion });
    });
  });
}

function calculateFinalScore() {
  const questions = ACTIVITY_DATA.questions || [];
  const maxPoints = questions.reduce((acc, q) => acc + Number(q.points || ACTIVITY_DATA.pointsPerQuestion || 2), 0);
  const earnedPoints = Object.values(scoresByQuestion).reduce((a, b) => a + b, 0);
  const percentage = maxPoints > 0 ? Math.round((earnedPoints / maxPoints) * 100) : 100;
  return { earnedPoints, maxPoints, percentage, passed: percentage >= 60 };
}

function renderFinalSummary() {
  const { earnedPoints, maxPoints, percentage, passed } = calculateFinalScore();
  const report = window.ScormBridge.reportScoreAndCompletion(percentage, passed);
  const box = document.getElementById('final-summary-box');
  box.innerHTML = \`
    <p style="font-size:1.15rem;font-weight:800;">Puntaje obtenido: \${earnedPoints} / \${maxPoints} pts (\${percentage}%)</p>
    <p style="margin-top:6px;">Estado de la actividad: <strong>\${passed ? 'APROBADA / COMPLETADA ✅' : 'COMPLETADA (Se sugiere repasar) 🔄'}</strong></p>
    <p style="margin-top:6px;font-size:0.88rem;color:#334155;">
      \${report.reportedToLms ? '📡 Calificación y estado transmitidos automáticamente al Libro de Calificaciones de Moodle.' : '💻 Modo vista previa local activo (al subirse a Moodle registrará esta nota automáticamente).'}
    </p>
  \`;
}

document.addEventListener('DOMContentLoaded', () => {
  window.ScormBridge.init();
  const info = window.ScormBridge.getConnectionInfo();
  const badge = document.getElementById('lms-status-badge');
  if (badge) {
    badge.textContent = info.connected ? 'Conectado a Moodle (' + info.version + ')' : 'Vista Previa Local';
  }

  renderQuestions();

  document.querySelectorAll('.step-tab').forEach((btn) => {
    btn.addEventListener('click', () => goToStep(Number(btn.dataset.step)));
  });

  document.getElementById('btn-prev-step').addEventListener('click', () => goToStep(currentStep - 1));
  document.getElementById('btn-next-step').addEventListener('click', () => goToStep(currentStep + 1));

  document.getElementById('btn-finish-scorm').addEventListener('click', () => {
    renderFinalSummary();
    window.ScormBridge.finish();
    alert('¡Actividad finalizada! Tu progreso y calificación han sido registrados.');
  });
});
`;
}

/**
 * Construye el paquete ZIP SCORM 1.2 o SCORM 2004 listo para importar en Moodle
 */
export function exportToScormPackage(activity, version = '1.2') {
  if (!activity || !activity.title) {
    throw new Error('La actividad no contiene datos válidos para exportar a SCORM.');
  }

  const normalizedVersion = version === '2004' ? '2004' : '1.2';
  const manifestXml = buildImsManifest(activity, normalizedVersion);
  const indexHtml = buildScormIndexHtml(activity, normalizedVersion);
  const stylesCss = buildScormStylesCss();
  const scormDriverJs = buildScormDriverJs();
  const activityAppJs = buildScormActivityAppJs(activity);

  const files = [
    { path: 'imsmanifest.xml', content: manifestXml },
    { path: 'index.html', content: indexHtml },
    { path: 'styles.css', content: stylesCss },
    { path: 'scorm-driver.js', content: scormDriverJs },
    { path: 'activity-app.js', content: activityAppJs }
  ];

  const zipBuffer = buildZipBuffer(files);
  const suffix = normalizedVersion === '2004' ? 'scorm2004' : 'scorm12';
  const fileName = `${slugifyFileName(activity.title)}-${suffix}.zip`;

  return {
    fileName,
    version: normalizedVersion,
    mimeType: 'application/zip',
    zipBuffer,
    manifestXml,
    filesList: files.map((f) => f.path)
  };
}
