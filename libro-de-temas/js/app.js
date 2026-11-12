/**
 * Aplicación Principal — Libro de Temas Digital (Multi-Institución + Demo)
 */

(function () {
  const DEMO_STORAGE_PREFIX = "lt_demo_courses_v1_";
  const WEEKDAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const MONTHS_ES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

  const state = {
    mode: "demo", // "demo" | "cloud"
    user: null,
    profile: null, // { id, role, full_name, email, institution_id }
    institution: null, // { id, name, short_code, max_years, active_cycle, is_active }
    cycle: "2026",
    courses: [],
    activeTab: "carga", // "carga" | "direccion" | "superadmin"
    selectedTeacher: "ALL",
    selectedYear: "ALL",
    statusFilter: "ALL",
    searchQuery: "",
    directorChart: null,

    // Modal states
    quickCourseId: null,
    editingEntryId: null,
    batchCourseId: null,
    bookCourseId: null,
    teacherCourseId: null,
    pendingCsvCourses: []
  };

  // --- Utilities ---
  function todayIso() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  function formatDateAR(iso) {
    if (!iso) return "Sin registros";
    const parts = String(iso).split("-");
    if (parts.length !== 3) return iso;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  function formatTodayLong() {
    const d = new Date();
    const dayName = WEEKDAYS[d.getDay()];
    return `${dayName} ${d.getDate()} de ${MONTHS_ES[d.getMonth()]} de ${d.getFullYear()}`;
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function showToast(msg) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.remove("hidden");
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.add("hidden"), 3200);
  }

  function openModal(id) {
    document.getElementById(id).classList.remove("hidden");
  }

  function closeModal(id) {
    document.getElementById(id).classList.add("hidden");
  }

  function getCourseStats(c) {
    const entries = (c.entries || []).filter(e => e.saberes || e.actividades || e.observaciones);
    if (entries.length === 0) {
      return { totalFilled: 0, lastDate: null, lastClaseN: 0, status: "critico" };
    }
    const sorted = [...entries].sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)));
    const last = sorted[sorted.length - 1];
    const lastDateObj = new Date(last.fecha + "T12:00:00");
    const diffDays = Math.floor((Date.now() - lastDateObj.getTime()) / (1000 * 60 * 60 * 24));
    const status = diffDays > 14 ? "atrasado" : "al_dia";
    const maxN = sorted.reduce((acc, item) => {
      const n = parseInt(item.claseN, 10);
      return !isNaN(n) && n > acc ? n : acc;
    }, 0);
    return { totalFilled: entries.length, lastDate: last.fecha, lastClaseN: maxN, status };
  }

  function statusBadgeHtml(status) {
    if (status === "al_dia") {
      return `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">🟢 Al día</span>`;
    }
    if (status === "atrasado") {
      return `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">🟡 Atrasado</span>`;
    }
    return `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">🔴 Sin carga</span>`;
  }

  function isDirectorOrAdmin() {
    if (state.mode === "demo") return true;
    return state.profile && (state.profile.role === "director" || state.profile.role === "superadmin");
  }

  // --- Demo Persistence ---
  function loadDemoCourses(cycle) {
    const key = DEMO_STORAGE_PREFIX + cycle;
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (_) {}
    }
    const base = cycle === "2026"
      ? JSON.parse(JSON.stringify(window.DEMO_COURSES_2026 || []))
      : (window.DEMO_COURSES_2026 || []).map(c => ({ ...JSON.parse(JSON.stringify(c)), entries: [] }));
    localStorage.setItem(key, JSON.stringify(base));
    return base;
  }

  function saveDemoCourses() {
    if (state.mode !== "demo") return;
    localStorage.setItem(DEMO_STORAGE_PREFIX + state.cycle, JSON.stringify(state.courses));
  }

  // --- Initialization ---
  async function initApp() {
    document.getElementById("bannerDateText").textContent = "Hoy: " + formatTodayLong();
    document.getElementById("mobileDateBadge").textContent = formatDateAR(todayIso());

    const wa = window.CloudAPI.getSalesWhatsapp();
    if (wa) {
      document.getElementById("salesCtaLink").href = `https://wa.me/${wa.replace(/\D/g, "")}?text=${encodeURIComponent("Hola Mónica, probé la Demo del Libro de Temas Digital y quiero info para mi institución.")}`;
    }

    if (window.CloudAPI.isConfigured()) {
      try {
        const ctx = await window.CloudAPI.getSessionContext();
        if (ctx && ctx.profile) {
          state.mode = "cloud";
          state.user = ctx.user;
          state.profile = ctx.profile;
          state.institution = ctx.institution || { id: null, name: "Administración Global", short_code: "SA", max_years: 6, active_cycle: "2026", is_active: true };
          await enterCloudMode();
          return;
        }
      } catch (err) {
        console.error("Error al verificar sesión:", err);
      }
    }

    enterDemoMode();
  }

  function enterDemoMode() {
    state.mode = "demo";
    state.profile = null;
    state.institution = window.DEMO_INSTITUTION;
    state.courses = loadDemoCourses(state.cycle);

    document.getElementById("demoBar").classList.remove("hidden");
    document.getElementById("resetDemoBtn").classList.remove("hidden");
    document.getElementById("userSessionBox").classList.add("hidden");
    document.getElementById("teacherSelectorWrap").classList.remove("hidden");
    document.getElementById("tabDireccionBtn").classList.remove("hidden");
    document.getElementById("tabSuperAdminBtn").classList.add("hidden");

    applyInstitutionBranding();
    populateTeacherFilter();
    renderAll();
  }

  async function enterCloudMode() {
    document.getElementById("demoBar").classList.add("hidden");
    document.getElementById("resetDemoBtn").classList.add("hidden");
    document.getElementById("userSessionBox").classList.remove("hidden");
    document.getElementById("userBadge").textContent = `${state.profile.full_name} (${state.profile.role === "superadmin" ? "Admin" : state.profile.role === "director" ? "Dirección" : "Docente"})`;

    const isSuper = state.profile.role === "superadmin";
    const isDir = state.profile.role === "director";

    document.getElementById("tabSuperAdminBtn").classList.toggle("hidden", !isSuper);
    document.getElementById("tabDireccionBtn").classList.toggle("hidden", !(isDir || isSuper));
    document.getElementById("teacherSelectorWrap").classList.toggle("hidden", !(isDir || isSuper));

    if (state.institution && state.institution.is_active === false && !isSuper) {
      alert("La suscripción de esta institución se encuentra pausada. Contactá a administración.");
      await window.CloudAPI.signOut();
      enterDemoMode();
      return;
    }

    applyInstitutionBranding();

    if (state.institution && state.institution.id) {
      state.courses = await window.CloudAPI.fetchCourses(state.institution.id, state.cycle);
    } else if (isSuper) {
      state.activeTab = "superadmin";
      await renderSuperAdminPanel();
    }

    populateTeacherFilter();
    renderAll();
  }

  function applyInstitutionBranding() {
    const inst = state.institution || window.DEMO_INSTITUTION;
    document.getElementById("instLogoBadge").textContent = inst.short_code || "LT";
    document.getElementById("instSubtitle").textContent = `${inst.name} · Ciclo Lectivo ${state.cycle}`;
    document.getElementById("kpiCycleLabel").textContent = `1° a ${inst.max_years || 5}° Año · ${state.cycle}`;
    renderYearPills(inst.max_years || 5);
  }

  function renderYearPills(maxYears) {
    const group = document.getElementById("yearFilterGroup");
    let html = `<button type="button" data-year="ALL" class="year-pill px-3 py-1.5 rounded-lg text-xs font-semibold ${state.selectedYear === "ALL" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}">Todos</button>`;
    for (let y = 1; y <= maxYears; y++) {
      const active = String(state.selectedYear) === String(y);
      html += `<button type="button" data-year="${y}" class="year-pill px-3 py-1.5 rounded-lg text-xs font-semibold ${active ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}">${y}° Año</button>`;
    }
    group.innerHTML = html;

    // Also update "Nueva Materia" year select
    const cmAnio = document.getElementById("cmAnio");
    if (cmAnio) {
      cmAnio.innerHTML = Array.from({ length: maxYears }, (_, i) => `<option value="${i + 1}">${i + 1}° Año</option>`).join("");
    }
  }

  function populateTeacherFilter() {
    const select = document.getElementById("teacherSelect");
    const teachers = Array.from(new Set(state.courses.map(c => c.profesor).filter(Boolean))).sort();
    let html = `<option value="ALL">Todos / Vista Dirección</option>`;
    teachers.forEach(t => {
      html += `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`;
    });
    select.innerHTML = html;
    select.value = state.selectedTeacher;
  }

  function getVisibleCourses() {
    let list = state.courses;
    if (state.mode === "cloud" && state.profile && state.profile.role === "teacher") {
      const myEmail = (state.profile.email || "").toLowerCase();
      list = list.filter(c => !c.teacher_email || c.teacher_email.toLowerCase() === myEmail);
    } else if (state.selectedTeacher !== "ALL") {
      list = list.filter(c => c.profesor === state.selectedTeacher || c.suplente === state.selectedTeacher);
    }
    return list;
  }

  function renderAll() {
    switchTab(state.activeTab);
    renderBanner();
    renderCargaGrid();
    if (isDirectorOrAdmin()) renderDirectorBoard();
  }

  function switchTab(tab) {
    state.activeTab = tab;
    document.getElementById("viewCarga").classList.toggle("hidden", tab !== "carga");
    document.getElementById("viewDireccion").classList.toggle("hidden", tab !== "direccion");
    document.getElementById("viewSuperAdmin").classList.toggle("hidden", tab !== "superadmin");

    const map = {
      carga: "tabCargaBtn",
      direccion: "tabDireccionBtn",
      superadmin: "tabSuperAdminBtn"
    };
    Object.entries(map).forEach(([k, btnId]) => {
      const btn = document.getElementById(btnId);
      if (!btn) return;
      if (k === tab) {
        btn.className = "flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-white text-indigo-700 shadow-sm transition";
      } else {
        btn.className = "flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition";
      }
    });
  }

  function renderBanner() {
    const visible = getVisibleCourses();
    let ok = 0, pending = 0;
    visible.forEach(c => {
      const st = getCourseStats(c);
      if (st.status === "al_dia") ok++;
      else pending++;
    });
    document.getElementById("bannerOkCount").textContent = ok;
    document.getElementById("bannerPendingCount").textContent = pending;

    if (state.mode === "cloud" && state.profile && state.profile.role === "teacher") {
      document.getElementById("bannerBadge").textContent = "Mis Materias";
      document.getElementById("bannerTitle").textContent = `Hola, ${state.profile.full_name}`;
      document.getElementById("bannerSubtitle").textContent = "Acá ves únicamente tus espacios curriculares asignados.";
    } else if (state.selectedTeacher !== "ALL") {
      document.getElementById("bannerBadge").textContent = "Vista Docente";
      document.getElementById("bannerTitle").textContent = state.selectedTeacher;
      document.getElementById("bannerSubtitle").textContent = "Mostrando los espacios curriculares asignados a este docente.";
    } else {
      document.getElementById("bannerBadge").textContent = "Vista General";
      document.getElementById("bannerTitle").textContent = `Todos los espacios curriculares (${visible.length})`;
      document.getElementById("bannerSubtitle").textContent = "Filtrá por año, estado o docente para cargar clases en segundos.";
    }
  }

  function renderCargaGrid() {
    let list = getVisibleCourses();
    if (state.selectedYear !== "ALL") {
      list = list.filter(c => String(c.anioNum) === String(state.selectedYear));
    }
    if (state.statusFilter !== "ALL") {
      list = list.filter(c => getCourseStats(c).status === state.statusFilter);
    }
    const q = state.searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(c =>
        c.espacio.toLowerCase().includes(q) ||
        c.profesor.toLowerCase().includes(q) ||
        c.anio.toLowerCase().includes(q)
      );
    }

    const grid = document.getElementById("coursesGrid");
    const empty = document.getElementById("emptyState");
    if (list.length === 0) {
      grid.innerHTML = "";
      empty.classList.remove("hidden");
      return;
    }
    empty.classList.add("hidden");

    grid.innerHTML = list.map(c => {
      const st = getCourseStats(c);
      const daysText = Object.keys(c.horario || {}).join(" · ") || "Horario a definir";
      return `
        <article class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between gap-3">
          <div>
            <div class="flex items-start justify-between gap-2 mb-2">
              <span class="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold">${escapeHtml(c.anio)}</span>
              ${statusBadgeHtml(st.status)}
            </div>
            <h3 class="text-base font-bold text-slate-900 leading-snug">${escapeHtml(c.espacio)}</h3>
            <p class="text-xs text-slate-600 mt-1">
              ${escapeHtml(c.profesor || "Sin asignar")}
              ${c.suplente ? `<span class="text-violet-700 font-semibold"> · Sup: ${escapeHtml(c.suplente)}</span>` : ""}
            </p>
            <p class="text-[11px] text-slate-400 mt-1">${escapeHtml(daysText)}</p>
          </div>

          <div class="pt-3 border-t border-slate-100 space-y-2.5">
            <div class="flex items-center justify-between text-xs text-slate-500">
              <span>Última carga: <strong class="text-slate-700">${formatDateAR(st.lastDate)}</strong></span>
              <span><strong>${st.totalFilled}</strong> clases</span>
            </div>
            <div class="grid grid-cols-3 gap-1.5">
              <button type="button" data-action="quick" data-id="${c.id}" class="px-2 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition">
                + Cargar
              </button>
              <button type="button" data-action="batch" data-id="${c.id}" class="px-2 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold transition">
                Al Día
              </button>
              <button type="button" data-action="book" data-id="${c.id}" class="px-2 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition">
                Libro
              </button>
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  function renderDirectorBoard() {
    const maxYears = (state.institution && state.institution.max_years) || 5;
    const byYear = {};
    for (let y = 1; y <= maxYears; y++) byYear[y] = { ok: 0, warn: 0, crit: 0 };

    let ok = 0, warn = 0, crit = 0;
    const rowsHtml = state.courses.map(c => {
      const st = getCourseStats(c);
      if (!byYear[c.anioNum]) byYear[c.anioNum] = { ok: 0, warn: 0, crit: 0 };
      if (st.status === "al_dia") { ok++; byYear[c.anioNum].ok++; }
      else if (st.status === "atrasado") { warn++; byYear[c.anioNum].warn++; }
      else { crit++; byYear[c.anioNum].crit++; }

      return `
        <tr class="hover:bg-slate-50 transition">
          <td class="py-2.5 px-4 font-semibold text-slate-700 whitespace-nowrap">${escapeHtml(c.anio)}</td>
          <td class="py-2.5 px-4 font-semibold text-slate-900">${escapeHtml(c.espacio)}</td>
          <td class="py-2.5 px-4 text-slate-600">${escapeHtml(c.profesor)}${c.suplente ? ` <span class="text-[11px] font-semibold text-violet-700">(Sup: ${escapeHtml(c.suplente)})</span>` : ""}</td>
          <td class="py-2.5 px-4 text-slate-600 whitespace-nowrap">${formatDateAR(st.lastDate)}</td>
          <td class="py-2.5 px-4 text-center font-semibold text-slate-700">${st.totalFilled}</td>
          <td class="py-2.5 px-4 whitespace-nowrap">${statusBadgeHtml(st.status)}</td>
          <td class="py-2.5 px-4 text-right whitespace-nowrap space-x-1">
            <button type="button" data-action="quick" data-id="${c.id}" class="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold">Cargar</button>
            <button type="button" data-action="teacher" data-id="${c.id}" class="px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100 text-xs font-semibold">Docente</button>
            <button type="button" data-action="book" data-id="${c.id}" class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold">Ver</button>
          </td>
        </tr>
      `;
    }).join("");

    const total = state.courses.length;
    document.getElementById("kpiTotal").textContent = total;
    document.getElementById("kpiOk").textContent = ok;
    document.getElementById("kpiOkPct").textContent = total ? `${Math.round((ok / total) * 100)}% del total` : "0%";
    document.getElementById("kpiWarn").textContent = warn;
    document.getElementById("kpiCrit").textContent = crit;
    document.getElementById("directorTableCount").textContent = `${total} espacios`;
    document.getElementById("directorTableBody").innerHTML = rowsHtml;

    const labels = Object.keys(byYear).sort((a, b) => Number(a) - Number(b)).map(y => `${y}° Año`);
    const keys = Object.keys(byYear).sort((a, b) => Number(a) - Number(b));
    const ctx = document.getElementById("directorChart").getContext("2d");
    if (state.directorChart) state.directorChart.destroy();
    state.directorChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          { label: "Al día", data: keys.map(k => byYear[k].ok), backgroundColor: "#10b981", borderRadius: 6 },
          { label: "Atrasado", data: keys.map(k => byYear[k].warn), backgroundColor: "#f59e0b", borderRadius: 6 },
          { label: "Sin carga", data: keys.map(k => byYear[k].crit), backgroundColor: "#f43f5e", borderRadius: 6 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true, ticks: { stepSize: 1 } } },
        plugins: { legend: { position: "bottom" } }
      }
    });
  }

  // --- Quick / Edit Modal ---
  function openQuickModal(courseId, entryId = null) {
    const c = state.courses.find(x => x.id === courseId);
    if (!c) return;
    state.quickCourseId = courseId;
    state.editingEntryId = entryId;

    const st = getCourseStats(c);
    document.getElementById("qmSub").textContent = `${c.anio} · ${c.espacio} (${c.profesor})`;

    if (entryId) {
      const entry = (c.entries || []).find(e => e.id === entryId);
      if (!entry) return;
      document.getElementById("qmTitle").textContent = "Editar Registro de Clase";
      document.getElementById("qmFecha").value = entry.fecha;
      document.getElementById("qmClase").value = entry.claseN;
      document.getElementById("qmAp").value = entry.ap;
      document.getElementById("qmSaberes").value = entry.saberes;
      document.getElementById("qmActividades").value = entry.actividades;
      document.getElementById("qmObs").value = entry.observaciones;
      document.getElementById("qmSubmitBtn").textContent = "Actualizar Clase";
    } else {
      document.getElementById("qmTitle").textContent = "Cargar Clase";
      document.getElementById("qmFecha").value = todayIso();
      document.getElementById("qmClase").value = String(st.lastClaseN + 1);
      document.getElementById("qmAp").value = "";
      document.getElementById("qmSaberes").value = "";
      document.getElementById("qmActividades").value = "";
      document.getElementById("qmObs").value = "";
      document.getElementById("qmSubmitBtn").textContent = "Guardar Clase";
    }
    openModal("quickModal");
  }

  async function handleQuickSubmit(e) {
    e.preventDefault();
    const c = state.courses.find(x => x.id === state.quickCourseId);
    if (!c) return;

    const payload = {
      fecha: document.getElementById("qmFecha").value,
      claseN: document.getElementById("qmClase").value.trim(),
      ap: document.getElementById("qmAp").value.trim(),
      saberes: document.getElementById("qmSaberes").value.trim(),
      actividades: document.getElementById("qmActividades").value.trim(),
      observaciones: document.getElementById("qmObs").value.trim()
    };

    try {
      if (state.mode === "cloud") {
        if (state.editingEntryId) {
          const updated = await window.CloudAPI.updateEntry(state.editingEntryId, payload);
          const idx = c.entries.findIndex(x => x.id === state.editingEntryId);
          if (idx !== -1) c.entries[idx] = { ...payload, id: updated.id };
        } else {
          const inserted = await window.CloudAPI.insertEntries(state.institution.id, c.id, [payload], state.user.id);
          c.entries.push({ ...payload, id: inserted[0].id });
        }
      } else {
        if (state.editingEntryId) {
          const idx = c.entries.findIndex(x => x.id === state.editingEntryId);
          if (idx !== -1) c.entries[idx] = { ...payload, id: state.editingEntryId };
        } else {
          c.entries.push({ ...payload, id: "e-" + Date.now() });
        }
        saveDemoCourses();
      }
      closeModal("quickModal");
      renderAll();
      if (!document.getElementById("bookModal").classList.contains("hidden")) {
        renderBookTable();
      }
      showToast(state.editingEntryId ? "Clase actualizada correctamente." : "Clase guardada en el Libro de Temas.");
    } catch (err) {
      alert("Error al guardar: " + err.message);
    }
  }

  // --- Batch Catch-up ("Ponerse al Día") ---
  function computeMissingDates(c) {
    const st = getCourseStats(c);
    const activeDays = Object.keys(c.horario || {});
    const targetWeekdays = activeDays.length ? activeDays.map(d => WEEKDAYS.indexOf(d)).filter(i => i !== -1) : [1, 3];
    const start = st.lastDate ? new Date(st.lastDate + "T12:00:00") : new Date(Date.now() - 14 * 86400000);
    start.setDate(start.getDate() + 1);
    const end = new Date();
    const dates = [];
    const cursor = new Date(start);
    while (cursor <= end && dates.length < 15) {
      if (targetWeekdays.includes(cursor.getDay())) {
        const yyyy = cursor.getFullYear();
        const mm = String(cursor.getMonth() + 1).padStart(2, "0");
        const dd = String(cursor.getDate()).padStart(2, "0");
        dates.push(`${yyyy}-${mm}-${dd}`);
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    if (dates.length === 0) dates.push(todayIso());
    return dates;
  }

  function addBatchRowHtml(fecha, claseN) {
    return `
      <div class="batch-row bg-slate-50 border border-slate-200 rounded-xl p-3 grid grid-cols-1 md:grid-cols-12 gap-2 items-start">
        <div class="md:col-span-2">
          <label class="block text-[10px] font-semibold text-slate-500 uppercase">Fecha</label>
          <input type="date" class="bm-fecha w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs bg-white" value="${fecha}" />
        </div>
        <div class="md:col-span-1">
          <label class="block text-[10px] font-semibold text-slate-500 uppercase">N°</label>
          <input type="text" class="bm-clase w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs bg-white" value="${claseN}" />
        </div>
        <div class="md:col-span-4">
          <label class="block text-[10px] font-semibold text-slate-500 uppercase">Saberes / Tema</label>
          <input type="text" class="bm-saberes w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs bg-white" placeholder="Tema trabajado..." />
        </div>
        <div class="md:col-span-4">
          <label class="block text-[10px] font-semibold text-slate-500 uppercase">Actividades</label>
          <input type="text" class="bm-actividades w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs bg-white" placeholder="Actividad realizada..." />
        </div>
        <div class="md:col-span-1 flex items-end justify-end pt-4">
          <button type="button" class="bm-remove text-rose-500 hover:text-rose-700 text-xs font-bold px-2 py-1">Quitar</button>
        </div>
      </div>
    `;
  }

  function openBatchModal(courseId) {
    const c = state.courses.find(x => x.id === courseId);
    if (!c) return;
    state.batchCourseId = courseId;
    const st = getCourseStats(c);
    document.getElementById("bmSub").textContent = `${c.anio} · ${c.espacio}`;
    const dates = computeMissingDates(c);
    const container = document.getElementById("batchRowsContainer");
    container.innerHTML = dates.map((d, idx) => addBatchRowHtml(d, st.lastClaseN + idx + 1)).join("");
    openModal("batchModal");
  }

  async function saveBatchRows() {
    const c = state.courses.find(x => x.id === state.batchCourseId);
    if (!c) return;
    const rows = [];
    document.querySelectorAll("#batchRowsContainer .batch-row").forEach(rowEl => {
      const fecha = rowEl.querySelector(".bm-fecha").value;
      const claseN = rowEl.querySelector(".bm-clase").value.trim();
      const saberes = rowEl.querySelector(".bm-saberes").value.trim();
      const actividades = rowEl.querySelector(".bm-actividades").value.trim();
      if (fecha && (saberes || actividades)) {
        rows.push({ fecha, claseN, ap: "", saberes, actividades, observaciones: "" });
      }
    });
    if (rows.length === 0) {
      alert("Completá al menos una fila con Saberes o Actividades.");
      return;
    }

    try {
      if (state.mode === "cloud") {
        const inserted = await window.CloudAPI.insertEntries(state.institution.id, c.id, rows, state.user.id);
        inserted.forEach((item, idx) => c.entries.push({ ...rows[idx], id: item.id }));
      } else {
        rows.forEach((r, idx) => c.entries.push({ ...r, id: "e-" + Date.now() + "-" + idx }));
        saveDemoCourses();
      }
      closeModal("batchModal");
      renderAll();
      showToast(`Se guardaron ${rows.length} clases correctamente.`);
    } catch (err) {
      alert("Error al guardar lote: " + err.message);
    }
  }

  // --- Book History Modal ---
  function openBookModal(courseId) {
    state.bookCourseId = courseId;
    const c = state.courses.find(x => x.id === courseId);
    if (!c) return;
    document.getElementById("bkTitle").textContent = c.espacio;
    document.getElementById("bkSub").textContent = `${c.anio} — ${c.profesor}${c.suplente ? ` (Sup: ${c.suplente})` : ""}`;
    document.getElementById("bkSearch").value = "";
    renderBookTable();
    openModal("bookModal");
  }

  function renderBookTable() {
    const c = state.courses.find(x => x.id === state.bookCourseId);
    if (!c) return;
    const q = document.getElementById("bkSearch").value.trim().toLowerCase();
    const sorted = [...(c.entries || [])].sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));
    const filtered = q
      ? sorted.filter(e =>
          (e.saberes || "").toLowerCase().includes(q) ||
          (e.actividades || "").toLowerCase().includes(q) ||
          (e.fecha || "").includes(q)
        )
      : sorted;

    const tbody = document.getElementById("bkTableBody");
    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-slate-400">No hay clases registradas aún.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(e => `
      <tr class="hover:bg-slate-50">
        <td class="py-2.5 px-3 whitespace-nowrap font-medium text-slate-700">${formatDateAR(e.fecha)}</td>
        <td class="py-2.5 px-3 text-center">${escapeHtml(e.claseN)}</td>
        <td class="py-2.5 px-3 text-slate-600">${escapeHtml(e.ap)}</td>
        <td class="py-2.5 px-3 font-medium text-slate-900">${escapeHtml(e.saberes)}</td>
        <td class="py-2.5 px-3 text-slate-600">${escapeHtml(e.actividades)}</td>
        <td class="py-2.5 px-3 text-slate-500">${escapeHtml(e.observaciones)}</td>
        <td class="py-2.5 px-3 text-right whitespace-nowrap space-x-1">
          <button type="button" data-entry-edit="${e.id}" class="px-2 py-1 rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold">Editar</button>
          <button type="button" data-entry-del="${e.id}" class="px-2 py-1 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold">Borrar</button>
        </td>
      </tr>
    `).join("");
  }

  async function deleteBookEntry(entryId) {
    if (!confirm("¿Seguro que querés borrar esta clase del Libro de Temas?")) return;
    const c = state.courses.find(x => x.id === state.bookCourseId);
    if (!c) return;
    try {
      if (state.mode === "cloud") {
        await window.CloudAPI.deleteEntry(entryId);
      }
      c.entries = c.entries.filter(e => e.id !== entryId);
      if (state.mode === "demo") saveDemoCourses();
      renderBookTable();
      renderAll();
      showToast("Registro eliminado.");
    } catch (err) {
      alert("Error al eliminar: " + err.message);
    }
  }

  // --- Teacher Assignment ---
  function openTeacherModal(courseId) {
    const c = state.courses.find(x => x.id === courseId);
    if (!c) return;
    state.teacherCourseId = courseId;
    document.getElementById("tmSub").textContent = `${c.anio} · ${c.espacio}`;
    document.getElementById("tmTitular").value = c.profesor || "";
    document.getElementById("tmSuplente").value = c.suplente || "";
    document.getElementById("tmEmail").value = c.teacher_email || "";
    document.getElementById("tmLogNote").checked = false;
    openModal("teacherModal");
  }

  async function handleTeacherSubmit(e) {
    e.preventDefault();
    const c = state.courses.find(x => x.id === state.teacherCourseId);
    if (!c) return;
    const titular = document.getElementById("tmTitular").value.trim();
    const suplente = document.getElementById("tmSuplente").value.trim();
    const email = document.getElementById("tmEmail").value.trim();
    const logNote = document.getElementById("tmLogNote").checked;

    try {
      if (state.mode === "cloud") {
        await window.CloudAPI.updateCourseTeachers(c.id, titular, suplente, email);
      }
      c.profesor = titular;
      c.suplente = suplente;
      c.teacher_email = email;

      if (logNote) {
        const noteEntry = {
          fecha: todayIso(),
          claseN: "-",
          ap: "NOVEDAD DOCENTE",
          saberes: `Actualización docente: Titular ${titular}${suplente ? ` / Suplente ${suplente}` : ""}`,
          actividades: "Registro administrativo de Dirección.",
          observaciones: ""
        };
        if (state.mode === "cloud") {
          const ins = await window.CloudAPI.insertEntries(state.institution.id, c.id, [noteEntry], state.user.id);
          c.entries.push({ ...noteEntry, id: ins[0].id });
        } else {
          c.entries.push({ ...noteEntry, id: "e-" + Date.now() });
        }
      }

      if (state.mode === "demo") saveDemoCourses();
      closeModal("teacherModal");
      populateTeacherFilter();
      renderAll();
      showToast("Asignación docente actualizada.");
    } catch (err) {
      alert("Error al actualizar docente: " + err.message);
    }
  }

  // --- New Course & CSV Import ---
  async function handleNewCourseSubmit(e) {
    e.preventDefault();
    const anioNum = Number(document.getElementById("cmAnio").value);
    const espacio = document.getElementById("cmEspacio").value.trim();
    const profesor = document.getElementById("cmProfesor").value.trim();
    const teacher_email = document.getElementById("cmEmail").value.trim();
    const horario = {};
    document.querySelectorAll('input[name="cmDias"]:checked').forEach(cb => {
      horario[cb.value] = "A confirmar";
    });

    try {
      if (state.mode === "cloud") {
        const created = await window.CloudAPI.createCourse(state.institution.id, state.cycle, { anioNum, espacio, profesor, teacher_email, horario });
        state.courses.push({
          id: created.id,
          anioNum,
          anio: `${anioNum}° Año`,
          espacio,
          profesor,
          suplente: "",
          teacher_email,
          horario,
          entries: []
        });
      } else {
        state.courses.push({
          id: "demo-" + Date.now(),
          anioNum,
          anio: `${anioNum}° Año`,
          espacio,
          profesor,
          suplente: "",
          teacher_email,
          horario,
          entries: []
        });
        saveDemoCourses();
      }
      closeModal("courseModal");
      document.getElementById("courseForm").reset();
      populateTeacherFilter();
      renderAll();
      showToast("Materia creada correctamente.");
    } catch (err) {
      alert("Error al crear materia: " + err.message);
    }
  }

  function parseCsvFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
      const lines = String(reader.result || "").split(/\r?\n/).filter(l => l.trim());
      const parsed = [];
      lines.forEach((line, idx) => {
        const cols = line.split(/[;,]/).map(s => s.trim().replace(/^"|"$/g, ""));
        if (idx === 0 && isNaN(parseInt(cols[0], 10))) return; // skip header
        const anioNum = parseInt(cols[0], 10);
        if (isNaN(anioNum) || !cols[1]) return;
        const horario = {};
        if (cols[4]) {
          cols[4].split("|").map(d => d.trim()).filter(Boolean).forEach(d => { horario[d] = "Cursado"; });
        }
        parsed.push({
          anioNum,
          espacio: cols[1],
          profesor: cols[2] || "",
          teacher_email: cols[3] || "",
          horario
        });
      });
      state.pendingCsvCourses = parsed;
      document.getElementById("csvPreview").textContent = `Se detectaron ${parsed.length} materias listas para importar.`;
      document.getElementById("csvConfirmBtn").disabled = parsed.length === 0;
    };
    reader.readAsText(file, "UTF-8");
  }

  async function confirmCsvImport() {
    if (!state.pendingCsvCourses.length) return;
    try {
      if (state.mode === "cloud") {
        await window.CloudAPI.bulkCreateCourses(state.institution.id, state.cycle, state.pendingCsvCourses);
        state.courses = await window.CloudAPI.fetchCourses(state.institution.id, state.cycle);
      } else {
        state.pendingCsvCourses.forEach((c, idx) => {
          state.courses.push({ ...c, id: "csv-" + Date.now() + "-" + idx, anio: `${c.anioNum}° Año`, suplente: "", entries: [] });
        });
        saveDemoCourses();
      }
      closeModal("csvModal");
      populateTeacherFilter();
      renderAll();
      showToast(`Se importaron ${state.pendingCsvCourses.length} materias.`);
    } catch (err) {
      alert("Error al importar CSV: " + err.message);
    }
  }

  // --- Super-Admin ---
  async function renderSuperAdminPanel() {
    if (state.mode !== "cloud" || state.profile.role !== "superadmin") return;
    const list = await window.CloudAPI.listInstitutions();
    const tbody = document.getElementById("institutionsTableBody");
    tbody.innerHTML = list.map(inst => `
      <tr class="hover:bg-slate-50">
        <td class="py-3 px-4 font-semibold text-slate-900">${escapeHtml(inst.name)}</td>
        <td class="py-3 px-4 font-mono text-xs">${escapeHtml(inst.short_code)}</td>
        <td class="py-3 px-4">1° a ${inst.max_years}°</td>
        <td class="py-3 px-4">${escapeHtml(inst.active_cycle)}</td>
        <td class="py-3 px-4">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold ${inst.is_active ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}">
            ${inst.is_active ? "Activa" : "Pausada"}
          </span>
        </td>
        <td class="py-3 px-4 text-right space-x-1.5">
          <button type="button" data-inst-open="${inst.id}" class="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold">Abrir</button>
          <button type="button" data-inst-toggle="${inst.id}" data-inst-active="${inst.is_active}" class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold">
            ${inst.is_active ? "Pausar" : "Activar"}
          </button>
        </td>
      </tr>
    `).join("");

    tbody.querySelectorAll("[data-inst-open]").forEach(btn => {
      btn.addEventListener("click", async () => {
        const inst = list.find(i => i.id === btn.dataset.instOpen);
        if (!inst) return;
        state.institution = inst;
        state.cycle = inst.active_cycle || "2026";
        document.getElementById("cycleSelect").value = state.cycle;
        applyInstitutionBranding();
        state.courses = await window.CloudAPI.fetchCourses(inst.id, state.cycle);
        populateTeacherFilter();
        switchTab("direccion");
        renderAll();
      });
    });

    tbody.querySelectorAll("[data-inst-toggle]").forEach(btn => {
      btn.addEventListener("click", async () => {
        const nextActive = btn.dataset.instActive !== "true";
        await window.CloudAPI.toggleInstitutionStatus(btn.dataset.instToggle, nextActive);
        await renderSuperAdminPanel();
        showToast(nextActive ? "Institución activada." : "Institución pausada.");
      });
    });
  }

  // --- Exports ---
  function downloadCsv(filename, rows) {
    const csv = "\uFEFF" + rows.map(r => r.map(v => `"${String(v || "").replace(/"/g, '""')}"`).join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // --- Event Listeners ---
  document.addEventListener("DOMContentLoaded", () => {
    initApp();

    document.querySelectorAll("[data-close]").forEach(btn => {
      btn.addEventListener("click", () => closeModal(btn.dataset.close));
    });

    document.getElementById("demoLoginBtn").addEventListener("click", () => {
      document.getElementById("loginNotConfiguredAlert").classList.toggle("hidden", window.CloudAPI.isConfigured());
      openModal("loginModal");
    });

    document.getElementById("loginForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const errEl = document.getElementById("loginError");
      errEl.classList.add("hidden");
      try {
        await window.CloudAPI.signIn(
          document.getElementById("loginEmail").value.trim(),
          document.getElementById("loginPassword").value
        );
        closeModal("loginModal");
        await initApp();
      } catch (err) {
        errEl.textContent = err.message || "Credenciales incorrectas.";
        errEl.classList.remove("hidden");
      }
    });

    document.getElementById("logoutBtn").addEventListener("click", async () => {
      await window.CloudAPI.signOut();
      enterDemoMode();
    });

    document.getElementById("resetDemoBtn").addEventListener("click", () => {
      localStorage.removeItem(DEMO_STORAGE_PREFIX + state.cycle);
      state.courses = loadDemoCourses(state.cycle);
      renderAll();
      showToast("Demo reiniciada con datos de ejemplo.");
    });

    document.getElementById("cycleSelect").addEventListener("change", async (e) => {
      state.cycle = e.target.value;
      applyInstitutionBranding();
      if (state.mode === "cloud" && state.institution && state.institution.id) {
        state.courses = await window.CloudAPI.fetchCourses(state.institution.id, state.cycle);
      } else {
        state.courses = loadDemoCourses(state.cycle);
      }
      populateTeacherFilter();
      renderAll();
    });

    document.getElementById("teacherSelect").addEventListener("change", (e) => {
      state.selectedTeacher = e.target.value;
      renderBanner();
      renderCargaGrid();
    });

    document.getElementById("tabCargaBtn").addEventListener("click", () => switchTab("carga"));
    document.getElementById("tabDireccionBtn").addEventListener("click", () => { switchTab("direccion"); renderDirectorBoard(); });
    document.getElementById("tabSuperAdminBtn").addEventListener("click", () => { switchTab("superadmin"); renderSuperAdminPanel(); });

    document.getElementById("yearFilterGroup").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-year]");
      if (!btn) return;
      state.selectedYear = btn.dataset.year;
      renderYearPills((state.institution && state.institution.max_years) || 5);
      renderCargaGrid();
    });

    document.getElementById("statusFilter").addEventListener("change", (e) => {
      state.statusFilter = e.target.value;
      renderCargaGrid();
    });

    document.getElementById("searchInput").addEventListener("input", (e) => {
      state.searchQuery = e.target.value;
      renderCargaGrid();
    });

    // Delegated action buttons on Grid & Director Table
    document.body.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      const { action, id } = btn.dataset;
      if (action === "quick") openQuickModal(id);
      else if (action === "batch") openBatchModal(id);
      else if (action === "book") openBookModal(id);
      else if (action === "teacher") openTeacherModal(id);
    });

    // Quick modal chips
    document.querySelectorAll("[data-chip]").forEach(btn => {
      btn.addEventListener("click", () => {
        const text = btn.dataset.chip;
        document.getElementById("qmSaberes").value = text;
        if (!document.getElementById("qmActividades").value) {
          document.getElementById("qmActividades").value = text;
        }
      });
    });

    document.getElementById("quickForm").addEventListener("submit", handleQuickSubmit);

    // Batch modal
    document.getElementById("bmAddRowBtn").addEventListener("click", () => {
      const container = document.getElementById("batchRowsContainer");
      const count = container.querySelectorAll(".batch-row").length;
      container.insertAdjacentHTML("beforeend", addBatchRowHtml(todayIso(), count + 1));
    });
    document.getElementById("batchRowsContainer").addEventListener("click", (e) => {
      if (e.target.classList.contains("bm-remove")) {
        e.target.closest(".batch-row").remove();
      }
    });
    document.getElementById("bmSaveAllBtn").addEventListener("click", saveBatchRows);

    // Book modal
    document.getElementById("bkSearch").addEventListener("input", renderBookTable);
    document.getElementById("bkTableBody").addEventListener("click", (e) => {
      const editBtn = e.target.closest("[data-entry-edit]");
      if (editBtn) openQuickModal(state.bookCourseId, editBtn.dataset.entryEdit);
      const delBtn = e.target.closest("[data-entry-del]");
      if (delBtn) deleteBookEntry(delBtn.dataset.entryDel);
    });
    document.getElementById("bkCopyTsvBtn").addEventListener("click", async () => {
      const c = state.courses.find(x => x.id === state.bookCourseId);
      if (!c) return;
      const lines = [["Fecha", "Clase", "Aprendizajes", "Saberes", "Actividades", "Observaciones"].join("\t")];
      (c.entries || []).forEach(e => lines.push([e.fecha, e.claseN, e.ap, e.saberes, e.actividades, e.observaciones].join("\t")));
      await navigator.clipboard.writeText(lines.join("\n"));
      showToast("Tabla copiada al portapapeles (lista para pegar en Excel/Sheets).");
    });
    document.getElementById("bkExportCsvBtn").addEventListener("click", () => {
      const c = state.courses.find(x => x.id === state.bookCourseId);
      if (!c) return;
      const rows = [["Fecha", "Clase", "Aprendizajes", "Saberes", "Actividades", "Observaciones"]];
      (c.entries || []).forEach(e => rows.push([e.fecha, e.claseN, e.ap, e.saberes, e.actividades, e.observaciones]));
      downloadCsv(`Libro_Temas_${c.anio}_${c.espacio}.csv`, rows);
    });

    // Teacher & Course modals
    document.getElementById("teacherForm").addEventListener("submit", handleTeacherSubmit);
    document.getElementById("addCourseBtn").addEventListener("click", () => openModal("courseModal"));
    document.getElementById("courseForm").addEventListener("submit", handleNewCourseSubmit);
    document.getElementById("importCsvBtn").addEventListener("click", () => {
      document.getElementById("csvPreview").textContent = "";
      document.getElementById("csvConfirmBtn").disabled = true;
      openModal("csvModal");
    });
    document.getElementById("csvFileInput").addEventListener("change", (e) => {
      if (e.target.files[0]) parseCsvFile(e.target.files[0]);
    });
    document.getElementById("csvConfirmBtn").addEventListener("click", confirmCsvImport);

    document.getElementById("exportDirectorBtn").addEventListener("click", () => {
      const rows = [["Año", "Espacio Curricular", "Docente", "Suplente", "Última Fecha", "Clases Cargadas", "Estado"]];
      state.courses.forEach(c => {
        const st = getCourseStats(c);
        rows.push([c.anio, c.espacio, c.profesor, c.suplente, formatDateAR(st.lastDate), st.totalFilled, st.status]);
      });
      downloadCsv(`Reporte_Direccion_${state.cycle}.csv`, rows);
    });

    // Superadmin modal
    document.getElementById("newInstBtn").addEventListener("click", () => openModal("instModal"));
    document.getElementById("instForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        await window.CloudAPI.createInstitution({
          name: document.getElementById("imName").value.trim(),
          short_code: document.getElementById("imShort").value.trim().toUpperCase(),
          max_years: Number(document.getElementById("imMaxYears").value),
          active_cycle: document.getElementById("imCycle").value.trim()
        });
        closeModal("instModal");
        document.getElementById("instForm").reset();
        await renderSuperAdminPanel();
        showToast("Institución creada correctamente.");
      } catch (err) {
        alert("Error al crear institución: " + err.message);
      }
    });
  });
})();
