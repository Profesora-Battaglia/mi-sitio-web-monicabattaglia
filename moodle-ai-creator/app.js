import { handleStandaloneApiRequest, buildExportDataClient } from './standalone-engine.js';

const ACTIVITY_TYPES = [
  { name: 'Opción múltiple', icon: '🔘' },
  { name: 'Verdadero o falso', icon: '⚖️' },
  { name: 'Completar espacios', icon: '✍️' },
  { name: 'Relacionar columnas', icon: '🔗' },
  { name: 'Ordenar secuencias', icon: '🔢' },
  { name: 'Preguntas abiertas', icon: '💬' },
  { name: 'Cuestionarios', icon: '📋' },
  { name: 'Crucigramas', icon: '🧩' },
  { name: 'Sopa de letras', icon: '🔤' },
  { name: 'Casos prácticos', icon: '🔍' },
  { name: 'Actividades de reflexión', icon: '🧠' },
  { name: 'Gamificación', icon: '🏆' }
];

const state = {
  user: null,
  stats: null,
  recentActivities: [],
  savedFavorites: [],
  plans: [],
  usageHistory: [],
  paymentsHistory: [],
  activeActivity: null,
  config: null,
  simScores: {},
  sessionToken: localStorage.getItem('moodleai_token') || null,
  isStandaloneWebMode: false,
  supabaseClient: null,
  pendingMpPaymentId: null
};

async function apiFetch(url, options = {}) {
  if (state.isStandaloneWebMode) {
    return handleStandaloneApiRequest(url, options);
  }

  try {
    const headers = { ...(options.headers || {}) };
    if (state.sessionToken) {
      headers['Authorization'] = `Bearer ${state.sessionToken}`;
    }
    const res = await fetch(url, { ...options, headers });
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      state.isStandaloneWebMode = true;
      return handleStandaloneApiRequest(url, options);
    }
    return res;
  } catch {
    state.isStandaloneWebMode = true;
    return handleStandaloneApiRequest(url, options);
  }
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatArs(amount) {
  return `$${Number(amount || 0).toLocaleString('es-AR')} ARS`;
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 4400);
}

/**
 * Inicializa el cliente de Supabase Auth para el Proyecto Nuevo si SUPABASE_URL y SUPABASE_ANON_KEY están configuradas
 */
async function initSupabaseAuthIfConfigured() {
  const localCfg = window.__MOODLEAI_CONFIG__ || {};
  const sbUrl = state.config?.supabase?.url || localCfg.SUPABASE_URL || '';
  const sbAnon = state.config?.supabase?.anonKey || localCfg.SUPABASE_ANON_KEY || '';
  const badge = document.getElementById('supabase-status-badge');

  const isConfigured = Boolean(
    sbUrl &&
    sbAnon &&
    !sbUrl.includes('tu-nuevo-proyecto') &&
    !sbAnon.includes('tu_supabase_anon_key')
  );

  if (!isConfigured) {
    if (badge) {
      badge.className = 'badge badge-type';
      badge.textContent = '⚡ Supabase Auth Listo (.env) · Modo Local Activo';
    }
    return;
  }

  if (window.supabase && typeof window.supabase.createClient === 'function' && !state.supabaseClient) {
    state.supabaseClient = window.supabase.createClient(sbUrl, sbAnon);
    if (badge) {
      badge.className = 'badge badge-eval';
      badge.textContent = '🟢 Conectado a Supabase Auth (Proyecto Nuevo)';
    }

    const { data } = await state.supabaseClient.auth.getSession();
    if (data?.session?.user) {
      const sbUser = data.session.user;
      const meta = sbUser.user_metadata || {};
      const syncRes = await apiFetch('/api/auth/supabase-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supabaseId: sbUser.id,
          email: sbUser.email,
          name: meta.name || sbUser.email.split('@')[0],
          institution: meta.institution || '',
          education_level: meta.education_level || 'Secundaria',
          subject_specialty: meta.subject_specialty || ''
        })
      });
      const syncData = await syncRes.json();
      if (syncData.ok) {
        state.sessionToken = syncData.token;
        localStorage.setItem('moodleai_token', syncData.token);
      }
    }
  }
}

export function switchView(viewName) {
  document.querySelectorAll('.view-section').forEach((sec) => {
    sec.classList.toggle('active', sec.id === `view-${viewName}`);
  });
  document.querySelectorAll('.nav-item').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.view === viewName);
  });

  const sidebar = document.getElementById('sidebar');
  if (sidebar && sidebar.classList.contains('open')) {
    sidebar.classList.remove('open');
  }

  if (viewName === 'library') {
    loadLibraryActivities();
  } else if (viewName === 'preview' && !state.activeActivity && state.recentActivities.length > 0) {
    state.activeActivity = state.recentActivities[0];
    renderActivityPreview(state.activeActivity);
  }
}

function renderQuickActivityTypes() {
  const container = document.getElementById('quick-activity-types');
  if (!container) return;
  container.innerHTML = ACTIVITY_TYPES.map(
    (t) => `
      <button type="button" class="quick-type-btn" data-quick-type="${escapeHtml(t.name)}">
        <span aria-hidden="true">${t.icon}</span>
        <span>${escapeHtml(t.name)}</span>
      </button>
    `
  ).join('');

  container.querySelectorAll('[data-quick-type]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const selectedType = btn.dataset.quickType;
      const selectEl = document.getElementById('gen-type');
      if (selectEl) {
        selectEl.value = selectedType;
      }
      switchView('generator');
      showToast(`Formato preseleccionado: ${selectedType}`);
    });
  });
}

function renderActivityCard(act, showLibraryControls = false) {
  return `
    <article class="activity-item" style="flex-wrap:wrap;">
      <div style="flex:1;min-width:260px;">
        <div class="activity-badges">
          <span class="badge badge-subject">📁 ${escapeHtml(act.subject)}</span>
          <span class="badge badge-type">${escapeHtml(act.activity_type)}</span>
          <span class="badge badge-level">${escapeHtml(act.education_level)} (${escapeHtml(act.student_age)})</span>
          ${act.is_evaluation ? '<span class="badge badge-eval">Evaluación Calificable</span>' : ''}
        </div>
        <h4>${escapeHtml(act.title)}</h4>
        <p class="activity-meta">
          Tema: <strong>${escapeHtml(act.topic)}</strong> • 
          Duración: ${Number(act.estimated_duration)} min • 
          Dificultad: ${escapeHtml(act.difficulty)} • 
          Preguntas: ${act.content?.questions?.length || act.question_count}
          ${act.tags ? ` • Etiquetas: <em>${escapeHtml(act.tags)}</em>` : ''}
        </p>
        ${
          showLibraryControls
            ? `
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;align-items:center;">
            <span style="font-size:0.78rem;font-weight:700;color:#475569;">📥 Volver a descargar:</span>
            <button type="button" class="btn btn-sm btn-outline" data-quick-dl="${escapeHtml(act.id)}" data-fmt="moodle_xml">XML</button>
            <button type="button" class="btn btn-sm btn-outline" data-quick-dl="${escapeHtml(act.id)}" data-fmt="gift">GIFT</button>
            <button type="button" class="btn btn-sm btn-outline" data-quick-dl="${escapeHtml(act.id)}" data-fmt="scorm_12">SCORM 1.2</button>
            <button type="button" class="btn btn-sm btn-outline" data-quick-dl="${escapeHtml(act.id)}" data-fmt="h5p">H5P</button>
          </div>
        `
            : ''
        }
      </div>
      <div class="activity-actions" style="flex-wrap:wrap;">
        <button type="button" class="btn-fav ${act.is_favorite ? 'is-fav' : ''}" data-fav-id="${escapeHtml(act.id)}" title="Guardar en favoritos" aria-label="Alternar favorito">
          ${act.is_favorite ? '⭐' : '☆'}
        </button>
        ${
          showLibraryControls
            ? `
          <button type="button" class="btn btn-sm btn-outline" data-edit-direct-id="${escapeHtml(act.id)}" title="Editar actividad">✏️ Editar</button>
          <button type="button" class="btn btn-sm btn-outline" data-dup-id="${escapeHtml(act.id)}" title="Duplicar actividad">📋 Duplicar</button>
          <button type="button" class="btn btn-sm btn-outline" data-del-id="${escapeHtml(act.id)}" title="Eliminar actividad">🗑️</button>
        `
            : ''
        }
        <button type="button" class="btn btn-sm btn-primary" data-preview-id="${escapeHtml(act.id)}">
          👁️ Abrir / Exportar
        </button>
      </div>
    </article>
  `;
}

async function triggerDirectDownload(activityId, format) {
  if (state.isStandaloneWebMode) {
    const res = await apiFetch(`/api/activities/${encodeURIComponent(activityId)}`);
    const data = await res.json();
    if (data.ok && data.activity) {
      const built = buildExportDataClient(data.activity, format);
      const blobUrl = URL.createObjectURL(built.blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = built.fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
      showToast(`📥 Descargando ${built.fileName} listo para Moodle`);
      await loadDashboardData();
    }
    return;
  }

  const link = document.createElement('a');
  link.href = `/api/activities/${encodeURIComponent(activityId)}/export/${encodeURIComponent(format)}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  showToast(`📥 Descargando paquete ${format.toUpperCase()}...`);
  setTimeout(() => loadDashboardData(), 700);
}

function bindActivityCardEvents(container) {
  if (!container) return;

  container.querySelectorAll('[data-preview-id]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.previewId;
      const res = await apiFetch(`/api/activities/${encodeURIComponent(id)}`);
      const data = await res.json();
      if (data.ok && data.activity) {
        state.activeActivity = data.activity;
        document.getElementById('activity-editor-panel').style.display = 'none';
        renderActivityPreview(data.activity);
        switchView('preview');
      }
    });
  });

  container.querySelectorAll('[data-edit-direct-id]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.editDirectId;
      const res = await apiFetch(`/api/activities/${encodeURIComponent(id)}`);
      const data = await res.json();
      if (data.ok && data.activity) {
        state.activeActivity = data.activity;
        renderActivityPreview(data.activity);
        switchView('preview');
        const editorPanel = document.getElementById('activity-editor-panel');
        if (editorPanel) {
          editorPanel.style.display = 'block';
          populateActivityEditor(data.activity);
        }
      }
    });
  });

  container.querySelectorAll('[data-quick-dl]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const actId = btn.dataset.quickDl;
      const fmt = btn.dataset.fmt;
      triggerDirectDownload(actId, fmt);
    });
  });

  container.querySelectorAll('[data-fav-id]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.favId;
      const res = await apiFetch(`/api/activities/${encodeURIComponent(id)}/favorite`, { method: 'POST' });
      const data = await res.json();
      if (data.ok) {
        showToast(data.activity.is_favorite ? '⭐ Guardado en Recursos Favoritos' : 'Quitado de favoritos');
        await loadDashboardData();
        if (document.getElementById('view-library').classList.contains('active')) {
          await loadLibraryActivities();
        }
      }
    });
  });

  container.querySelectorAll('[data-dup-id]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.dupId;
      const res = await apiFetch(`/api/activities/${encodeURIComponent(id)}/duplicate`, { method: 'POST' });
      const data = await res.json();
      if (data.ok) {
        showToast('📋 Actividad duplicada en tu biblioteca.');
        await loadDashboardData();
        await loadLibraryActivities();
      }
    });
  });

  container.querySelectorAll('[data-del-id]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.delId;
      const res = await apiFetch(`/api/activities/${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.ok) {
        showToast('🗑️ Actividad eliminada.');
        await loadDashboardData();
        await loadLibraryActivities();
      }
    });
  });
}

/**
 * Abre el modal de Pasarela de Pagos Mercado Pago en Pesos Argentinos (ARS)
 */
async function openMercadoPagoCheckout(planId, mode = 'checkout_pro') {
  const res = await apiFetch('/api/payments/mercadopago/create-preference', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan_id: planId, mode })
  });
  const data = await res.json();
  if (!data.ok) {
    showToast(`⚠️ ${data.error}`);
    return;
  }

  if (data.freePlanActivated) {
    showToast(`✅ ${data.message}`);
    await loadDashboardData();
    return;
  }

  const { checkout, plan } = data;
  state.pendingMpPaymentId = checkout.paymentId;

  const modal = document.getElementById('mp-checkout-modal');
  const titleEl = document.getElementById('mp-modal-title');
  const bodyEl = document.getElementById('mp-modal-body');
  const extLinkEl = document.getElementById('btn-open-external-mp');

  if (modal && titleEl && bodyEl) {
    titleEl.textContent = `${plan.name} — ${formatArs(plan.price_ars)} / mes`;
    const modeLabel =
      checkout.modeUsed === 'direct_subscription_link'
        ? 'Modalidad 2: Link Directo de Suscripción Mensual Mercado Pago'
        : 'Modalidad 1: API Checkout Pro Dinámico de Mercado Pago';

    bodyEl.innerHTML = `
      <div style="background:#eff6ff;border:1px solid #bfdbfe;padding:12px;border-radius:8px;">
        <p><strong>Plan seleccionado:</strong> ${escapeHtml(plan.name)}</p>
        <p><strong>Importe en Pesos Argentinos:</strong> <span style="font-size:1.15rem;font-weight:800;color:#0284c7;">${formatArs(plan.price_ars)} / mes</span></p>
        <p><strong>Cupo mensual incluido:</strong> ${plan.monthly_generation_limit} actividades y evaluaciones/mes</p>
      </div>
      <div style="font-size:0.84rem;color:#334155;background:#f8fafc;padding:10px 12px;border-radius:8px;border:1px solid #e2e8f0;">
        <p><strong>Pasarela utilizada:</strong> ${escapeHtml(modeLabel)}</p>
        <p><strong>ID Operación:</strong> <code>${escapeHtml(checkout.paymentId)}</code></p>
        <p><strong>Preferencia MP:</strong> <code>${escapeHtml(checkout.preferenceId || 'N/A')}</code></p>
      </div>
      <p style="font-size:0.84rem;color:#475569;">
        ${
          checkout.checkoutUrl && checkout.checkoutUrl.includes('link.mercadopago.com.ar')
            ? `Al hacer clic en <strong>"🔗 Abrir Link Externo de Mercado Pago"</strong>, ingresá el importe de <strong>${formatArs(plan.price_ars)}</strong> y realizá el pago con dinero en cuenta, débito o crédito.`
            : 'Podés abonar con dinero en cuenta de Mercado Pago, tarjeta de débito o tarjeta de crédito en Pesos Argentinos (ARS). Al acreditarse el pago, tu cuenta docente se actualiza automáticamente.'
        }
      </p>
    `;

    if (extLinkEl) {
      if (checkout.checkoutUrl && !checkout.isSandboxSimulation) {
        extLinkEl.style.display = 'inline-flex';
        extLinkEl.href = checkout.checkoutUrl;
      } else {
        extLinkEl.style.display = 'none';
      }
    }

    modal.style.display = 'flex';
  }
}

function renderDashboard() {
  const { user, stats, recentActivities, savedFavorites, plans, usageHistory, paymentsHistory, config } = state;
  if (!user) return;

  document.getElementById('sidebar-avatar').textContent = user.avatar_initials || 'DC';
  document.getElementById('sidebar-teacher-name').textContent = user.name;
  document.getElementById('sidebar-teacher-plan').textContent = `${user.plan_name || 'Plan Gratuito'} (${user.price_display || '$0 ARS'})`;
  document.getElementById('welcome-teacher-name').textContent = user.name;

  const authEmailEl = document.getElementById('auth-current-email');
  if (authEmailEl) {
    authEmailEl.textContent = `${user.name} (${user.email})`;
  }

  const aiStatusText = document.getElementById('ai-status-text');
  if (aiStatusText && config) {
    aiStatusText.textContent = config.geminiConfigured
      ? `Gemini Activo (${config.geminiModel})`
      : 'Motor IA Pedagógico Activo';
  }

  if (user.quota) {
    const { used, limit, remaining } = user.quota;
    const pct = Math.min(100, Math.round((used / Math.max(1, limit)) * 100));
    document.getElementById('sidebar-quota-text').textContent = `${used} / ${limit}`;
    document.getElementById('sidebar-quota-fill').style.width = `${pct}%`;
    document.getElementById('sidebar-quota-helper').textContent =
      remaining > 0
        ? `Te quedan ${remaining} generaciones este mes`
        : 'Alcanzaste el límite mensual de tu plan';
  }

  if (stats) {
    document.getElementById('stat-total-activities').textContent = stats.totalActivities;
    document.getElementById('stat-total-evaluations').textContent = stats.totalEvaluations;
    document.getElementById('stat-total-favorites').textContent = stats.totalFavorites;
    document.getElementById('stat-total-exports').textContent = stats.totalExports;
  }

  const recentContainer = document.getElementById('dashboard-recent-list');
  if (recentContainer) {
    if (recentActivities.length === 0) {
      recentContainer.innerHTML = `<p class="text-muted">Aún no tenés actividades creadas. ¡Usá el botón Crear Nueva Actividad!</p>`;
    } else {
      recentContainer.innerHTML = recentActivities.map((a) => renderActivityCard(a, false)).join('');
      bindActivityCardEvents(recentContainer);
    }
  }

  const favContainer = document.getElementById('dashboard-favorites-list');
  if (favContainer) {
    if (savedFavorites.length === 0) {
      favContainer.innerHTML = `<p class="text-muted">Marcá actividades con la estrella ⭐ para tenerlas siempre a mano acá.</p>`;
    } else {
      favContainer.innerHTML = savedFavorites
        .map(
          (act) => `
          <div class="favorite-mini-card">
            <div>
              <span class="badge badge-subject">${escapeHtml(act.subject)}</span>
              <h4>${escapeHtml(act.title)}</h4>
            </div>
            <button type="button" class="btn btn-sm btn-outline" data-preview-id="${escapeHtml(act.id)}">Abrir</button>
          </div>
        `
        )
        .join('');
      bindActivityCardEvents(favContainer);
    }
  }

  const profSummary = document.getElementById('dashboard-profile-summary');
  if (profSummary) {
    profSummary.innerHTML = `
      <div class="profile-row"><span>Docente:</span> <strong>${escapeHtml(user.name)}</strong></div>
      <div class="profile-row"><span>Institución:</span> <strong>${escapeHtml(user.institution || 'Sin especificar')}</strong></div>
      <div class="profile-row"><span>Nivel:</span> <strong>${escapeHtml(user.education_level || 'Secundaria')}</strong></div>
      <div class="profile-row"><span>Plan activo:</span> <strong>${escapeHtml(user.plan_name)} (${escapeHtml(user.price_display || '$0 ARS')})</strong></div>
    `;
  }

  document.getElementById('prof-name').value = user.name || '';
  document.getElementById('prof-email').value = user.email || '';
  document.getElementById('prof-institution').value = user.institution || '';
  document.getElementById('prof-level').value = user.education_level || '';
  document.getElementById('prof-specialty').value = user.subject_specialty || '';
  document.getElementById('prof-bio').value = user.bio || '';

  // Renderizar Planes Comerciales en Pesos Argentinos con las 2 modalidades de Mercado Pago
  const plansContainer = document.getElementById('plans-list-container');
  if (plansContainer && plans) {
    plansContainer.innerHTML = plans
      .map((p) => {
        const isCurrent = p.id === user.plan_id;
        const isFree = p.id === 'free' || Number(p.price_ars) === 0;
        return `
        <div class="plan-card ${isCurrent ? 'current-plan' : ''}">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
            <div>
              <strong style="font-size:1.05rem;">${escapeHtml(p.name)}</strong>
              ${isCurrent ? '<span class="badge badge-eval" style="margin-left:8px;">✅ Plan Actual</span>' : ''}
            </div>
            <span class="badge badge-subject" style="font-size:0.9rem;padding:4px 12px;">${escapeHtml(p.price_display)}</span>
          </div>
          <p class="text-muted" style="margin-top:6px;">${escapeHtml(p.description)}</p>
          <p style="font-size:0.83rem;font-weight:700;margin-top:6px;color:#1e3a8a;">
            ✨ Incluye hasta ${p.monthly_generation_limit} actividades y evaluaciones mensuales
          </p>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;">
            ${
              isFree
                ? isCurrent
                  ? ''
                  : `<button type="button" class="btn btn-sm btn-outline" data-mp-plan="free" data-mp-mode="free">Cambiar a Plan Gratuito ($0 ARS)</button>`
                : `
                <button type="button" class="btn btn-sm btn-primary" style="background:#009ee3;" data-mp-plan="${escapeHtml(p.id)}" data-mp-mode="checkout_pro">
                  💳 Pagar ${formatArs(p.price_ars)} con Mercado Pago (Checkout Pro)
                </button>
                <button type="button" class="btn btn-sm btn-outline" style="border-color:#009ee3;color:#0284c7;" data-mp-plan="${escapeHtml(p.id)}" data-mp-mode="direct_link">
                  🔗 Suscripción Mensual MP (Link Directo)
                </button>
              `
            }
          </div>
        </div>
      `;
      })
      .join('');

    plansContainer.querySelectorAll('[data-mp-plan]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const planId = btn.dataset.mpPlan;
        const mode = btn.dataset.mpMode;
        openMercadoPagoCheckout(planId, mode);
      });
    });
  }

  // Renderizar Comprobantes de Pagos en ARS
  const paymentsContainer = document.getElementById('payments-history-list');
  if (paymentsContainer) {
    if (!paymentsHistory || paymentsHistory.length === 0) {
      paymentsContainer.innerHTML = `<p class="text-muted" style="font-size:0.85rem;">Aún no registrás pagos en Mercado Pago.</p>`;
    } else {
      paymentsContainer.innerHTML = paymentsHistory
        .map(
          (pay) => `
          <div style="padding:10px 12px;border:1px solid #bae6fd;border-radius:8px;font-size:0.84rem;background:#f0f9ff;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <strong>${escapeHtml(pay.plan_name || pay.plan_id.toUpperCase())} — ${formatArs(pay.amount_ars)}</strong>
              <span class="badge ${pay.status === 'approved' ? 'badge-eval' : 'badge-type'}">${pay.status === 'approved' ? 'APROBADO ✅' : 'PENDIENTE'}</span>
            </div>
            <p class="text-muted" style="margin-top:4px;font-size:0.78rem;">
              ID: ${escapeHtml(pay.id)} • Modalidad: ${escapeHtml(pay.payment_mode)} • Fecha: ${escapeHtml(pay.created_at)}
            </p>
          </div>
        `
        )
        .join('');
    }
  }

  // Renderizar Historial de Uso
  const historyContainer = document.getElementById('usage-history-list');
  if (historyContainer) {
    if (!usageHistory || usageHistory.length === 0) {
      historyContainer.innerHTML = `<p class="text-muted">Todavía no hay acciones registradas este mes.</p>`;
    } else {
      historyContainer.innerHTML = usageHistory
        .map(
          (h) => `
          <div style="padding:10px 12px;border:1px solid #e2e8f0;border-radius:8px;font-size:0.84rem;background:#f8fafc;">
            <div style="display:flex;justify-content:space-between;">
              <strong>${escapeHtml(h.action_type.toUpperCase())}</strong>
              <span class="text-muted">${escapeHtml(h.created_at)}</span>
            </div>
            <p style="margin-top:4px;color:#334155;">${escapeHtml(h.details || h.activity_title || 'Operación registrada')}</p>
          </div>
        `
        )
        .join('');
    }
  }
}

function populateActivityEditor(act) {
  if (!act) return;
  document.getElementById('edit-title').value = act.title || '';
  document.getElementById('edit-subject').value = act.subject || '';
  document.getElementById('edit-description').value = act.description || '';
  document.getElementById('edit-tags').value = act.tags || '';
  document.getElementById('edit-instructions').value = act.student_instructions || '';
  document.getElementById('edit-development').value = act.content?.developmentText || '';
  document.getElementById('edit-recommendations').value = act.pedagogical?.pedagogicalRecommendations || '';

  const questionsList = document.getElementById('edit-questions-list');
  const questions = act.content?.questions || [];

  questionsList.innerHTML = questions
    .map(
      (q, idx) => `
      <div class="question-sim-card" data-edit-q-idx="${idx}">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <strong>Pregunta #${idx + 1} (${escapeHtml(q.type)})</strong>
          <label style="font-size:0.82rem;font-weight:700;">
            Puntaje:
            <input type="number" class="edit-q-points" step="0.5" min="0.5" value="${Number(q.points || 2)}" style="width:70px;padding:4px 8px;margin-left:6px;" />
          </label>
        </div>
        <div class="form-group">
          <label>Enunciado / Consigna</label>
          <textarea class="edit-q-prompt" rows="2">${escapeHtml(q.prompt)}</textarea>
        </div>
        ${
          Array.isArray(q.options) && q.options.length > 0
            ? `
          <div class="form-group" style="margin-top:8px;">
            <label>Opciones (la opción marcada es la correcta)</label>
            ${q.options
              .map(
                (opt, optIdx) => `
              <div style="display:flex;align-items:center;gap:8px;margin-top:4px;">
                <input type="radio" name="edit_correct_${idx}" value="${optIdx}" ${opt.isCorrect ? 'checked' : ''} />
                <input type="text" class="edit-q-opt-text" data-opt-idx="${optIdx}" value="${escapeHtml(opt.text)}" style="flex:1;padding:6px 10px;" />
              </div>
            `
              )
              .join('')}
          </div>
        `
            : ''
        }
        ${
          q.type === 'fill_blanks' || q.type === 'crossword_clue'
            ? `
          <div class="form-group" style="margin-top:8px;">
            <label>Respuesta exacta esperada</label>
            <input type="text" class="edit-q-blank" value="${escapeHtml(q.answerTerm || (q.blanks && q.blanks[0]) || '')}" />
          </div>
        `
            : ''
        }
        <div class="form-grid" style="margin-top:8px;">
          <div class="form-group">
            <label>Retroalimentación para respuesta correcta</label>
            <input type="text" class="edit-q-fb-ok" value="${escapeHtml(q.correctFeedback || '')}" />
          </div>
          <div class="form-group">
            <label>Retroalimentación para respuesta incorrecta</label>
            <input type="text" class="edit-q-fb-err" value="${escapeHtml(q.incorrectFeedback || '')}" />
          </div>
        </div>
      </div>
    `
    )
    .join('');
}

function renderActivityPreview(act) {
  const container = document.getElementById('preview-container');
  if (!container || !act) return;

  state.simScores = {};
  populateActivityEditor(act);

  const questions = act.content?.questions || [];
  const ped = act.pedagogical || {};
  const totalPoints = questions.reduce((acc, q) => acc + Number(q.points || act.points_per_question || 2), 0);
  const wordsMeta = act.content?.activityTypeMeta?.words || [];

  container.innerHTML = `
    <div class="preview-grid">
      <div class="panel-card">
        <div class="activity-badges">
          <span class="badge badge-subject">${escapeHtml(act.subject)}</span>
          <span class="badge badge-type">${escapeHtml(act.activity_type)}</span>
          <span class="badge badge-level">${escapeHtml(act.education_level)} • ${escapeHtml(act.student_age)}</span>
          <span class="badge badge-eval">⏱️ ${Number(act.time_limit_minutes || act.estimated_duration)} min • Puntaje Total: ${totalPoints} pts</span>
          ${act.is_evaluation ? `<span class="badge badge-eval">Intentos: ${act.allowed_attempts === 0 ? 'Ilimitados' : act.allowed_attempts}</span>` : ''}
        </div>

        <h3 style="font-size:1.35rem;margin-top:6px;">${escapeHtml(act.title)}</h3>
        <p class="text-muted" style="margin-top:4px;">${escapeHtml(act.description)}</p>

        <div class="contextual-help" style="margin-top:14px;">
          <strong>📋 Instrucciones para el estudiante:</strong><br/>
          ${escapeHtml(act.student_instructions)}
        </div>

        <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:14px;border-radius:8px;margin-bottom:16px;">
          <h4 style="font-size:0.95rem;margin-bottom:6px;">📖 Desarrollo del Contenido</h4>
          <p style="font-size:0.92rem;color:#334155;">${escapeHtml(act.content?.developmentText || '')}</p>
          ${
            act.activity_type === 'Sopa de letras' || act.activity_type === 'Crucigramas'
              ? `<p style="margin-top:8px;font-size:0.84rem;color:#1e3a8a;"><strong>🔤 Banco de términos clave de la actividad:</strong> ${wordsMeta.map((w) => `<code style="background:#dbeafe;padding:2px 6px;border-radius:4px;margin-right:4px;">${escapeHtml(w)}</code>`).join(' ')}</p>`
              : ''
          }
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
          <h4>✍️ Consignas Interactivas (${questions.length})</h4>
          <button type="button" class="btn btn-sm btn-primary" id="btn-calc-sim-score">
            🧮 Calcular Calificación Automática
          </button>
        </div>

        <div id="sim-score-banner" class="feedback-box feedback-correct" style="display:none;margin-top:12px;"></div>

        <div id="interactive-questions-box">
          ${questions
            .map((q, idx) => {
              const pts = Number(q.points || act.points_per_question || 2);
              if (q.type === 'multiple_choice' || q.type === 'true_false') {
                return `
                  <div class="question-sim-card" data-q-idx="${idx}">
                    <p style="font-weight:700;">${idx + 1}. ${escapeHtml(q.prompt)} <span class="text-muted">(${pts} pts)</span></p>
                    <div>
                      ${(q.options || [])
                        .map(
                          (opt) => `
                          <label class="option-label">
                            <input type="radio" name="sim_q_${idx}" value="${escapeHtml(opt.id)}" data-is-correct="${opt.isCorrect ? '1' : '0'}" data-pts="${pts}" />
                            <span>${escapeHtml(opt.text)}</span>
                          </label>
                        `
                        )
                        .join('')}
                    </div>
                    <div class="feedback-box" id="feedback_q_${idx}" style="display:none;"></div>
                  </div>
                `;
              }
              if (q.type === 'fill_blanks' || q.type === 'crossword_clue') {
                const expected = q.answerTerm || (q.blanks && q.blanks[0]) || '';
                return `
                  <div class="question-sim-card" data-q-idx="${idx}">
                    <p style="font-weight:700;">${idx + 1}. ${escapeHtml(q.prompt)} <span class="text-muted">(${pts} pts)</span></p>
                    <div style="display:flex;gap:8px;margin-top:10px;">
                      <input type="text" id="blank_input_${idx}" placeholder="Escribí el término o respuesta..." style="padding:8px;border:1px solid #cbd5e1;border-radius:6px;flex:1;" />
                      <button type="button" class="btn btn-sm btn-primary" data-check-blank="${idx}" data-expected="${escapeHtml(expected)}" data-pts="${pts}">Comprobar</button>
                    </div>
                    <div class="feedback-box" id="feedback_q_${idx}" style="display:none;"></div>
                  </div>
                `;
              }
              if (q.type === 'matching') {
                return `
                  <div class="question-sim-card" data-q-idx="${idx}">
                    <p style="font-weight:700;">${idx + 1}. ${escapeHtml(q.prompt)} <span class="text-muted">(${pts} pts)</span></p>
                    <div style="display:flex;flex-direction:column;gap:8px;margin-top:10px;">
                      ${(q.pairs || [])
                        .map(
                          (pair) => `
                        <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;background:#fff;padding:8px 12px;border:1px solid #e2e8f0;border-radius:6px;">
                          <strong>${escapeHtml(pair.left)}</strong>
                          <span style="color:#059669;font-weight:600;">&rarr; ${escapeHtml(pair.right)}</span>
                        </div>
                      `
                        )
                        .join('')}
                    </div>
                    <button type="button" class="btn btn-sm btn-outline" style="margin-top:10px;" data-mark-interactive="${idx}" data-pts="${pts}">
                      ✅ Marcar relación como verificada
                    </button>
                    <div class="feedback-box" id="feedback_q_${idx}" style="display:none;"></div>
                  </div>
                `;
              }
              if (q.type === 'ordering') {
                return `
                  <div class="question-sim-card" data-q-idx="${idx}">
                    <p style="font-weight:700;">${idx + 1}. ${escapeHtml(q.prompt)} <span class="text-muted">(${pts} pts)</span></p>
                    <ol class="clean-list" style="margin-top:8px;">
                      ${(q.sequence || []).map((step) => `<li>${escapeHtml(step)}</li>`).join('')}
                    </ol>
                    <button type="button" class="btn btn-sm btn-outline" style="margin-top:10px;" data-mark-interactive="${idx}" data-pts="${pts}">
                      ✅ Verificar secuencia ordenada
                    </button>
                    <div class="feedback-box" id="feedback_q_${idx}" style="display:none;"></div>
                  </div>
                `;
              }
              return `
                <div class="question-sim-card" data-q-idx="${idx}">
                  <p style="font-weight:700;">${idx + 1}. ${escapeHtml(q.prompt)} <span class="text-muted">(${pts} pts)</span></p>
                  <textarea id="essay_input_${idx}" rows="3" placeholder="Escribí tu desarrollo o reflexión acá..." style="width:100%;margin-top:8px;padding:8px;border:1px solid #cbd5e1;border-radius:6px;"></textarea>
                  ${q.rubric ? `<p style="font-size:0.8rem;color:#475569;margin-top:6px;"><strong>Rúbrica / Criterios:</strong> ${escapeHtml(q.rubric)}</p>` : ''}
                  <button type="button" class="btn btn-sm btn-outline" style="margin-top:8px;" data-mark-interactive="${idx}" data-pts="${pts}">
                    ✅ Validar respuesta con rúbrica formativa
                  </button>
                  <div class="feedback-box" id="feedback_q_${idx}" style="display:none;"></div>
                </div>
              `;
            })
            .join('')}
        </div>
      </div>

      <div class="dashboard-side-stack">
        <div class="panel-card">
          <h3>📦 Exportar para Moodle (Módulo 4 Completo)</h3>
          <p class="text-muted" style="margin-top:4px;">Descargá el paquete listo para importar en tu curso de Moodle:</p>
          <div style="display:flex;flex-direction:column;gap:10px;margin-top:14px;">
            <button type="button" class="btn btn-primary" data-export-format="moodle_xml">
              📄 Descargar Moodle XML (.xml)
            </button>
            <button type="button" class="btn btn-secondary" style="border:1px solid #2563eb;" data-export-format="gift">
              📝 Descargar Formato GIFT (.gift.txt)
            </button>
            <button type="button" class="btn btn-primary" style="background:#ea580c;" data-export-format="scorm_12">
              📦 Descargar Paquete SCORM 1.2 (.zip)
            </button>
            <button type="button" class="btn btn-outline" style="border-color:#ea580c;color:#c2410c;" data-export-format="scorm_2004">
              📦 Descargar Paquete SCORM 2004 (.zip)
            </button>
            <button type="button" class="btn btn-primary" style="background:#059669;" data-export-format="h5p">
              🧩 Descargar Paquete H5P Válido (.h5p)
            </button>
          </div>

          <div id="export-inspector-box" style="display:none;margin-top:16px;padding:12px;background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;">
            <strong id="export-inspector-title" style="font-size:0.9rem;color:#1e3a8a;"></strong>
            <ol id="export-inspector-guide" class="clean-list" style="margin-top:8px;font-size:0.83rem;"></ol>
            <details style="margin-top:10px;">
              <summary style="cursor:pointer;font-size:0.82rem;font-weight:700;color:#2563eb;">🔍 Ver estructura / manifiesto validado del paquete</summary>
              <pre id="export-inspector-code" style="margin-top:8px;padding:10px;background:#0f172a;color:#e2e8f0;border-radius:6px;font-size:0.75rem;max-height:220px;overflow:auto;white-space:pre-wrap;"></pre>
            </details>
          </div>
        </div>

        <div class="panel-card">
          <h3>🧠 Fundamentación Pedagógica (Módulo 6)</h3>
          <p style="font-size:0.88rem;margin-top:8px;">
            <strong>Nivel Taxonomía de Bloom:</strong><br/>
            <span class="badge badge-subject">${escapeHtml(ped.bloomLevel || 'Aplicación y Análisis')}</span>
          </p>

          <p style="font-size:0.88rem;margin-top:12px;font-weight:700;">Objetivos de aprendizaje:</p>
          <ul class="clean-list" style="margin-top:4px;">
            ${(ped.learningObjectives || [act.learning_objective])
              .map((obj) => `<li>${escapeHtml(obj)}</li>`)
              .join('')}
          </ul>

          <p style="font-size:0.88rem;margin-top:12px;font-weight:700;">Principios de Diseño Instruccional y DUA:</p>
          <ul class="clean-list" style="margin-top:4px;">
            ${(ped.instructionalDesignPrinciples || ['Aprendizaje activo y evaluación formativa con criterios DUA.'])
              .map((pr) => `<li>${escapeHtml(pr)}</li>`)
              .join('')}
          </ul>

          <p style="font-size:0.88rem;margin-top:12px;font-weight:700;">Criterios de evaluación:</p>
          <ul class="clean-list" style="margin-top:4px;">
            ${(ped.evaluationCriteria || ['Comprensión conceptual y aplicación práctica.'])
              .map((crit) => `<li>${escapeHtml(crit)}</li>`)
              .join('')}
          </ul>

          <p style="font-size:0.88rem;margin-top:12px;font-weight:700;">Recomendaciones pedagógicas:</p>
          <p class="text-muted" style="margin-top:4px;">${escapeHtml(ped.pedagogicalRecommendations || '')}</p>
        </div>
      </div>
    </div>
  `;

  container.querySelectorAll('input[type="radio"]').forEach((radio) => {
    radio.addEventListener('change', (e) => {
      const card = e.target.closest('.question-sim-card');
      const idx = Number(card.dataset.qIdx);
      const q = questions[idx];
      const isCorrect = e.target.dataset.isCorrect === '1';
      const pts = Number(e.target.dataset.pts || 2);
      state.simScores[idx] = isCorrect ? pts : 0;

      const fbEl = document.getElementById(`feedback_q_${idx}`);
      if (fbEl) {
        fbEl.style.display = 'block';
        fbEl.className = `feedback-box ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`;
        fbEl.textContent = isCorrect ? `✅ ${q.correctFeedback}` : `❌ ${q.incorrectFeedback}`;
      }
    });
  });

  container.querySelectorAll('[data-check-blank]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.checkBlank);
      const expected = (btn.dataset.expected || '').trim().toLowerCase();
      const pts = Number(btn.dataset.pts || 2);
      const inputEl = document.getElementById(`blank_input_${idx}`);
      const val = (inputEl?.value || '').trim().toLowerCase();
      const q = questions[idx];
      const isCorrect = Boolean(val && val === expected);
      state.simScores[idx] = isCorrect ? pts : 0;

      const fbEl = document.getElementById(`feedback_q_${idx}`);
      if (fbEl) {
        fbEl.style.display = 'block';
        fbEl.className = `feedback-box ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`;
        fbEl.textContent = isCorrect ? `✅ ${q.correctFeedback}` : `❌ ${q.incorrectFeedback}`;
      }
    });
  });

  container.querySelectorAll('[data-mark-interactive]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.markInteractive);
      const pts = Number(btn.dataset.pts || 2);
      const q = questions[idx];
      state.simScores[idx] = pts;

      const fbEl = document.getElementById(`feedback_q_${idx}`);
      if (fbEl) {
        fbEl.style.display = 'block';
        fbEl.className = 'feedback-box feedback-correct';
        fbEl.textContent = `✅ ${q.correctFeedback}`;
      }
    });
  });

  const calcScoreBtn = document.getElementById('btn-calc-sim-score');
  if (calcScoreBtn) {
    calcScoreBtn.addEventListener('click', () => {
      const earned = Object.values(state.simScores).reduce((a, b) => a + b, 0);
      const percentage = totalPoints > 0 ? Math.round((earned / totalPoints) * 100) : 100;
      const banner = document.getElementById('sim-score-banner');
      if (banner) {
        banner.style.display = 'block';
        banner.textContent = `📊 Calificación simulada: ${earned} / ${totalPoints} puntos (${percentage}%). ${percentage >= 60 ? '¡Objetivo alcanzado!' : 'Se sugiere revisar la retroalimentación formativa y realizar un segundo intento.'}`;
      }
    });
  }

  container.querySelectorAll('[data-export-format]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const fmt = btn.dataset.exportFormat;
      const previewRes = await apiFetch(`/api/activities/${encodeURIComponent(act.id)}/export/${fmt}?preview=true`);
      const previewData = await previewRes.json();
      if (previewData.ok) {
        const box = document.getElementById('export-inspector-box');
        const titleEl = document.getElementById('export-inspector-title');
        const guideEl = document.getElementById('export-inspector-guide');
        const codeEl = document.getElementById('export-inspector-code');
        if (box && titleEl && guideEl && codeEl) {
          box.style.display = 'block';
          titleEl.textContent = `✅ Paquete generado y validado: ${previewData.fileName} (Cómo importarlo en Moodle)`;
          guideEl.innerHTML = (previewData.importGuide || []).map((step) => `<li>${escapeHtml(step)}</li>`).join('');
          codeEl.textContent = previewData.content;
        }

        await triggerDirectDownload(act.id, fmt);
      } else {
        showToast(`⚠️ ${previewData.error}`);
      }
    });
  });
}

async function loadLibraryActivities() {
  const search = document.getElementById('library-search-input')?.value || '';
  const subject = document.getElementById('library-subject-filter')?.value || 'Todas';
  const activityType = document.getElementById('library-type-filter')?.value || 'Todos';
  const onlyFavorites = document.getElementById('library-only-favorites')?.checked || false;

  const params = new URLSearchParams({
    search,
    subject,
    activityType,
    onlyFavorites: String(onlyFavorites)
  });

  const res = await apiFetch(`/api/activities?${params.toString()}`);
  const data = await res.json();
  const listContainer = document.getElementById('library-activities-list');
  const subjectSelect = document.getElementById('library-subject-filter');

  if (subjectSelect && Array.isArray(data.availableSubjects)) {
    const currentVal = subjectSelect.value || 'Todas';
    subjectSelect.innerHTML = [
      `<option value="Todas">📁 Todas las asignaturas (${data.availableSubjects.length})</option>`,
      ...data.availableSubjects.map(
        (subj) => `<option value="${escapeHtml(subj)}" ${subj === currentVal ? 'selected' : ''}>📁 ${escapeHtml(subj)}</option>`
      )
    ].join('');
  }

  if (!listContainer) return;

  if (!data.ok || data.activities.length === 0) {
    listContainer.innerHTML = `<p class="text-muted">No se encontraron actividades con esos criterios de búsqueda.</p>`;
    return;
  }

  listContainer.innerHTML = data.activities.map((a) => renderActivityCard(a, true)).join('');
  bindActivityCardEvents(listContainer);
}

async function loadDashboardData() {
  const res = await apiFetch('/api/dashboard');
  const data = await res.json();
  if (!data.ok) return;

  state.config = data.config;
  state.user = data.dashboard.user;
  state.stats = data.dashboard.stats;
  state.recentActivities = data.dashboard.recentActivities;
  state.savedFavorites = data.dashboard.savedFavorites;
  state.plans = data.plans;
  state.usageHistory = data.usageHistory || [];
  state.paymentsHistory = data.paymentsHistory || [];

  await initSupabaseAuthIfConfigured();

  if (!state.activeActivity && state.recentActivities.length > 0) {
    state.activeActivity = state.recentActivities[0];
  }

  renderDashboard();
}

async function handleGenerateSubmit(payload, submitBtn, defaultLabel) {
  submitBtn.disabled = true;
  submitBtn.textContent = '⏳ Generando propuesta pedagógica con IA...';

  try {
    const res = await apiFetch('/api/activities/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (!data.ok) {
      showToast(`⚠️ ${data.error}`);
      return;
    }

    state.activeActivity = data.activity;
    await loadDashboardData();
    renderActivityPreview(data.activity);
    switchView('preview');
    showToast(`✅ ${data.message}`);
  } catch (err) {
    showToast(`⚠️ Error de conexión: ${err.message}`);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = defaultLabel;
  }
}

function initEvents() {
  document.querySelectorAll('.nav-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      switchView(btn.dataset.view);
    });
  });

  document.querySelectorAll('[data-goto-view]').forEach((btn) => {
    btn.addEventListener('click', () => {
      switchView(btn.dataset.gotoView);
    });
  });

  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const sidebar = document.getElementById('sidebar');
  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = sidebar.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Modal de Mercado Pago (Cerrar y Confirmar Pago en ARS)
  const mpModal = document.getElementById('mp-checkout-modal');
  const btnCloseMpModal = document.getElementById('btn-close-mp-modal');
  const btnConfirmMpPayment = document.getElementById('btn-confirm-mp-payment');

  if (btnCloseMpModal && mpModal) {
    btnCloseMpModal.addEventListener('click', () => {
      mpModal.style.display = 'none';
    });
  }

  if (btnConfirmMpPayment && mpModal) {
    btnConfirmMpPayment.addEventListener('click', async () => {
      if (!state.pendingMpPaymentId) return;
      btnConfirmMpPayment.disabled = true;
      btnConfirmMpPayment.textContent = '⏳ Acreditando pago en Mercado Pago...';
      try {
        const res = await apiFetch('/api/payments/mercadopago/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ payment_id: state.pendingMpPaymentId })
        });
        const data = await res.json();
        if (data.ok) {
          mpModal.style.display = 'none';
          showToast(`🎉 ${data.message}`);
          await loadDashboardData();
        } else {
          showToast(`⚠️ ${data.error}`);
        }
      } finally {
        btnConfirmMpPayment.disabled = false;
        btnConfirmMpPayment.textContent = '✅ Acreditar Pago en ARS y Activar Plan Ahora';
      }
    });
  }

  // Autenticación: Supabase Auth (si está configurado) + Registro/Login Local
  const btnShowLogin = document.getElementById('btn-show-login');
  const btnShowRegister = document.getElementById('btn-show-register');
  const btnLogout = document.getElementById('btn-logout');
  const loginForm = document.getElementById('auth-login-form');
  const registerForm = document.getElementById('auth-register-form');

  if (btnShowLogin && loginForm && registerForm) {
    btnShowLogin.addEventListener('click', () => {
      registerForm.style.display = 'none';
      loginForm.style.display = loginForm.style.display === 'none' ? 'grid' : 'none';
    });
  }

  if (btnShowRegister && loginForm && registerForm) {
    btnShowRegister.addEventListener('click', () => {
      loginForm.style.display = 'none';
      registerForm.style.display = registerForm.style.display === 'none' ? 'grid' : 'none';
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;

      // Si el proyecto nuevo de Supabase está conectado, autenticamos contra Supabase Auth
      if (state.supabaseClient) {
        const { data: sbData, error: sbErr } = await state.supabaseClient.auth.signInWithPassword({ email, password });
        if (sbErr) {
          showToast(`⚠️ Supabase Auth: ${sbErr.message}`);
          return;
        }
        if (sbData?.user) {
          const meta = sbData.user.user_metadata || {};
          const syncRes = await apiFetch('/api/auth/supabase-sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              supabaseId: sbData.user.id,
              email: sbData.user.email,
              name: meta.name || sbData.user.email.split('@')[0],
              institution: meta.institution || '',
              education_level: meta.education_level || 'Secundaria',
              subject_specialty: meta.subject_specialty || ''
            })
          });
          const syncData = await syncRes.json();
          if (syncData.ok) {
            state.sessionToken = syncData.token;
            localStorage.setItem('moodleai_token', syncData.token);
            state.activeActivity = null;
            loginForm.style.display = 'none';
            loginForm.reset();
            showToast(`✅ Sesión iniciada con Supabase Auth (${sbData.user.email})`);
            await loadDashboardData();
            return;
          }
        }
      }

      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.ok) {
        state.sessionToken = data.token;
        localStorage.setItem('moodleai_token', data.token);
        state.activeActivity = null;
        loginForm.style.display = 'none';
        loginForm.reset();
        showToast(`✅ ${data.message}`);
        await loadDashboardData();
      } else {
        showToast(`⚠️ ${data.error}`);
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        name: document.getElementById('reg-name').value.trim(),
        email: document.getElementById('reg-email').value.trim(),
        password: document.getElementById('reg-password').value,
        institution: document.getElementById('reg-institution').value.trim(),
        education_level: document.getElementById('reg-level').value,
        subject_specialty: document.getElementById('reg-specialty').value.trim()
      };

      // Si el proyecto nuevo de Supabase está conectado, registramos en Supabase Auth
      if (state.supabaseClient) {
        const { data: sbData, error: sbErr } = await state.supabaseClient.auth.signUp({
          email: payload.email,
          password: payload.password,
          options: {
            data: {
              name: payload.name,
              institution: payload.institution,
              education_level: payload.education_level,
              subject_specialty: payload.subject_specialty
            }
          }
        });
        if (sbErr) {
          showToast(`⚠️ Supabase Auth: ${sbErr.message}`);
          return;
        }
        if (sbData?.user) {
          const syncRes = await apiFetch('/api/auth/supabase-sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              supabaseId: sbData.user.id,
              ...payload
            })
          });
          const syncData = await syncRes.json();
          if (syncData.ok) {
            state.sessionToken = syncData.token;
            localStorage.setItem('moodleai_token', syncData.token);
            state.activeActivity = null;
            registerForm.style.display = 'none';
            registerForm.reset();
            showToast(`🎉 Cuenta registrada en Supabase Auth (${payload.email})`);
            await loadDashboardData();
            return;
          }
        }
      }

      const res = await apiFetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.ok) {
        state.sessionToken = data.token;
        localStorage.setItem('moodleai_token', data.token);
        state.activeActivity = null;
        registerForm.style.display = 'none';
        registerForm.reset();
        showToast(`🎉 ${data.message}`);
        await loadDashboardData();
      } else {
        showToast(`⚠️ ${data.error}`);
      }
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
      if (state.supabaseClient) {
        await state.supabaseClient.auth.signOut();
      }
      await apiFetch('/api/auth/logout', { method: 'POST' });
      state.sessionToken = null;
      localStorage.removeItem('moodleai_token');
      state.activeActivity = null;
      showToast('👋 Sesión cerrada. Volviste al perfil Docente Demo.');
      await loadDashboardData();
    });
  }

  const profileForm = document.getElementById('profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        name: document.getElementById('prof-name').value,
        institution: document.getElementById('prof-institution').value,
        education_level: document.getElementById('prof-level').value,
        subject_specialty: document.getElementById('prof-specialty').value,
        bio: document.getElementById('prof-bio').value
      };

      const res = await apiFetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.ok) {
        showToast('✅ Perfil docente guardado.');
        await loadDashboardData();
      } else {
        showToast(`⚠️ ${data.error}`);
      }
    });
  }

  const searchInput = document.getElementById('library-search-input');
  const subjectFilter = document.getElementById('library-subject-filter');
  const typeFilter = document.getElementById('library-type-filter');
  const favCheck = document.getElementById('library-only-favorites');

  if (searchInput) searchInput.addEventListener('input', () => loadLibraryActivities());
  if (subjectFilter) subjectFilter.addEventListener('change', () => loadLibraryActivities());
  if (typeFilter) typeFilter.addEventListener('change', () => loadLibraryActivities());
  if (favCheck) favCheck.addEventListener('change', () => loadLibraryActivities());

  const genForm = document.getElementById('activity-generator-form');
  if (genForm) {
    genForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('btn-submit-generator');
      const payload = {
        subject: document.getElementById('gen-subject').value,
        education_level: document.getElementById('gen-level').value,
        student_age: document.getElementById('gen-age').value,
        topic: document.getElementById('gen-topic').value,
        learning_objective: document.getElementById('gen-objective').value,
        estimated_duration: Number(document.getElementById('gen-duration').value || 30),
        difficulty: document.getElementById('gen-difficulty').value,
        activity_type: document.getElementById('gen-type').value,
        question_count: Number(document.getElementById('gen-question-count').value || 4),
        tags: document.getElementById('gen-tags').value,
        is_evaluation: false
      };
      await handleGenerateSubmit(payload, submitBtn, '✨ Generar Actividad con IA Ahora');
    });
  }

  const evalForm = document.getElementById('evaluation-generator-form');
  if (evalForm) {
    evalForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('btn-submit-evaluation');
      const payload = {
        subject: document.getElementById('eval-subject').value,
        education_level: document.getElementById('eval-level').value,
        student_age: document.getElementById('eval-age').value,
        topic: document.getElementById('eval-topic').value,
        learning_objective: document.getElementById('eval-objective').value,
        activity_type: document.getElementById('eval-type').value,
        question_count: Number(document.getElementById('eval-count').value || 5),
        difficulty: document.getElementById('eval-difficulty').value,
        points_per_question: Number(document.getElementById('eval-points').value || 2),
        time_limit_minutes: Number(document.getElementById('eval-time').value || 30),
        estimated_duration: Number(document.getElementById('eval-time').value || 30),
        allowed_attempts: Number(document.getElementById('eval-attempts').value ?? 2),
        auto_grading: document.getElementById('eval-autograde').value === 'true',
        is_evaluation: true
      };
      await handleGenerateSubmit(payload, submitBtn, '📝 Generar Evaluación Calificable con IA');
    });
  }

  const btnToggleEditor = document.getElementById('btn-toggle-editor');
  const btnCancelEditor = document.getElementById('btn-cancel-editor');
  const editorPanel = document.getElementById('activity-editor-panel');

  if (btnToggleEditor && editorPanel) {
    btnToggleEditor.addEventListener('click', () => {
      const isHidden = editorPanel.style.display === 'none';
      editorPanel.style.display = isHidden ? 'block' : 'none';
      if (isHidden && state.activeActivity) {
        populateActivityEditor(state.activeActivity);
      }
    });
  }

  if (btnCancelEditor && editorPanel) {
    btnCancelEditor.addEventListener('click', () => {
      editorPanel.style.display = 'none';
    });
  }

  const editForm = document.getElementById('activity-edit-form');
  if (editForm) {
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!state.activeActivity) return;

      const updatedQuestions = (state.activeActivity.content?.questions || []).map((origQ, idx) => {
        const card = document.querySelector(`[data-edit-q-idx="${idx}"]`);
        if (!card) return origQ;

        const nextQ = { ...origQ };
        nextQ.prompt = card.querySelector('.edit-q-prompt')?.value || origQ.prompt;
        nextQ.points = Number(card.querySelector('.edit-q-points')?.value || origQ.points || 2);
        nextQ.correctFeedback = card.querySelector('.edit-q-fb-ok')?.value || origQ.correctFeedback;
        nextQ.incorrectFeedback = card.querySelector('.edit-q-fb-err')?.value || origQ.incorrectFeedback;

        if (Array.isArray(origQ.options) && origQ.options.length > 0) {
          const checkedRadio = card.querySelector(`input[name="edit_correct_${idx}"]:checked`);
          const correctIdx = checkedRadio ? Number(checkedRadio.value) : 0;
          nextQ.options = origQ.options.map((opt, optIdx) => {
            const textInput = card.querySelector(`.edit-q-opt-text[data-opt-idx="${optIdx}"]`);
            return {
              ...opt,
              text: textInput ? textInput.value : opt.text,
              isCorrect: optIdx === correctIdx
            };
          });
        }

        const blankInput = card.querySelector('.edit-q-blank');
        if (blankInput) {
          const val = blankInput.value.trim();
          nextQ.blanks = [val];
          if (nextQ.answerTerm !== undefined) {
            nextQ.answerTerm = val.toUpperCase();
          }
        }

        return nextQ;
      });

      const payload = {
        title: document.getElementById('edit-title').value,
        subject: document.getElementById('edit-subject').value,
        description: document.getElementById('edit-description').value,
        tags: document.getElementById('edit-tags').value,
        student_instructions: document.getElementById('edit-instructions').value,
        pedagogical: {
          ...(state.activeActivity.pedagogical || {}),
          pedagogicalRecommendations: document.getElementById('edit-recommendations').value
        },
        content: {
          ...(state.activeActivity.content || {}),
          developmentText: document.getElementById('edit-development').value,
          questions: updatedQuestions
        }
      };

      const res = await apiFetch(`/api/activities/${encodeURIComponent(state.activeActivity.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.ok) {
        state.activeActivity = data.activity;
        editorPanel.style.display = 'none';
        renderActivityPreview(data.activity);
        await loadDashboardData();
        showToast('💾 Actividad editada y guardada en tu biblioteca.');
      } else {
        showToast(`⚠️ ${data.error}`);
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  renderQuickActivityTypes();
  initEvents();
  await loadDashboardData();
  if (state.activeActivity) {
    renderActivityPreview(state.activeActivity);
  }

  // Verificar si regresó de un callback de Mercado Pago (?mp_status=approved)
  const params = new URLSearchParams(window.location.search);
  if (params.get('mp_status') === 'approved') {
    switchView('profile');
    showToast('🎉 ¡Pago de Mercado Pago en ARS acreditado y plan activado!');
  }
});
