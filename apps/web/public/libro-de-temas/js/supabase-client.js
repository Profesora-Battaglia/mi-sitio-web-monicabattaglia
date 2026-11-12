/**
 * Cliente de datos para Libro de Temas Digital (Multi-Institución)
 * Conecta con Supabase cuando config.local.js está configurado.
 * Si no hay configuración de Supabase, funciona en Modo Demo local.
 */

(function () {
  const cfg = window.__APP_CONFIG__ || {};
  const hasConfig =
    Boolean(cfg.SUPABASE_URL) &&
    Boolean(cfg.SUPABASE_ANON_KEY) &&
    !String(cfg.SUPABASE_URL).includes("tu-proyecto") &&
    !String(cfg.SUPABASE_ANON_KEY).includes("tu-clave");

  let sb = null;
  if (hasConfig && window.supabase && typeof window.supabase.createClient === "function") {
    sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
  }

  window.CloudAPI = {
    isConfigured: () => Boolean(sb),
    getSalesWhatsapp: () => {
      const w = cfg.WHATSAPP_VENTAS || "";
      if (!w || w === "5491100000000") return "5492622662596";
      return w;
    },

    async getSessionContext() {
      if (!sb) return null;
      const { data: { session }, error } = await sb.auth.getSession();
      if (error || !session) return null;

      const { data: profile, error: pErr } = await sb
        .from("profiles")
        .select("id, institution_id, full_name, email, role")
        .eq("id", session.user.id)
        .single();

      if (pErr || !profile) return { user: session.user, profile: null, institution: null };

      let institution = null;
      if (profile.institution_id) {
        const { data: inst } = await sb
          .from("institutions")
          .select("*")
          .eq("id", profile.institution_id)
          .single();
        institution = inst || null;
      }
      return { user: session.user, profile, institution };
    },

    async signIn(email, password) {
      if (!sb) throw new Error("Supabase no está configurado.");
      const { data, error } = await sb.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    },

    async signOut() {
      if (!sb) return;
      await sb.auth.signOut();
    },

    async fetchCourses(institutionId, cycle) {
      const { data: courses, error: cErr } = await sb
        .from("courses")
        .select("*")
        .eq("institution_id", institutionId)
        .eq("cycle", String(cycle))
        .order("anio_num", { ascending: true })
        .order("espacio", { ascending: true });
      if (cErr) throw cErr;

      const { data: entries, error: eErr } = await sb
        .from("book_entries")
        .select("*")
        .eq("institution_id", institutionId)
        .order("fecha", { ascending: true });
      if (eErr) throw eErr;

      const byCourse = new Map();
      for (const e of (entries || [])) {
        if (!byCourse.has(e.course_id)) byCourse.set(e.course_id, []);
        byCourse.get(e.course_id).push({
          id: e.id,
          fecha: e.fecha,
          claseN: e.clase_n || "",
          ap: e.ap || "",
          saberes: e.saberes || "",
          actividades: e.actividades || "",
          observaciones: e.observaciones || ""
        });
      }

      return (courses || []).map(c => ({
        id: c.id,
        institution_id: c.institution_id,
        cycle: c.cycle,
        anioNum: c.anio_num,
        anio: c.anio_label || `${c.anio_num}° Año`,
        espacio: c.espacio,
        profesor: c.profesor || "",
        suplente: c.suplente || "",
        teacher_email: c.teacher_email || "",
        horario: c.horario || {},
        entries: byCourse.get(c.id) || []
      }));
    },

    async insertEntries(institutionId, courseId, rows, userId) {
      const payload = rows.map(r => ({
        institution_id: institutionId,
        course_id: courseId,
        fecha: r.fecha,
        clase_n: String(r.claseN || ""),
        ap: String(r.ap || ""),
        saberes: String(r.saberes || ""),
        actividades: String(r.actividades || ""),
        observaciones: String(r.observaciones || ""),
        created_by: userId || null
      }));
      const { data, error } = await sb
        .from("book_entries")
        .insert(payload)
        .select();
      if (error) throw error;
      return data;
    },

    async updateEntry(entryId, fields) {
      const { data, error } = await sb
        .from("book_entries")
        .update({
          fecha: fields.fecha,
          clase_n: String(fields.claseN || ""),
          ap: String(fields.ap || ""),
          saberes: String(fields.saberes || ""),
          actividades: String(fields.actividades || ""),
          observaciones: String(fields.observaciones || ""),
          updated_at: new Date().toISOString()
        })
        .eq("id", entryId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async deleteEntry(entryId) {
      const { error } = await sb
        .from("book_entries")
        .delete()
        .eq("id", entryId);
      if (error) throw error;
    },

    async updateCourseTeachers(courseId, profesor, suplente, teacherEmail) {
      const updateObj = { profesor, suplente };
      if (typeof teacherEmail === "string") updateObj.teacher_email = teacherEmail;
      const { error } = await sb
        .from("courses")
        .update(updateObj)
        .eq("id", courseId);
      if (error) throw error;
    },

    async createCourse(institutionId, cycle, courseObj) {
      const { data, error } = await sb
        .from("courses")
        .insert({
          institution_id: institutionId,
          cycle: String(cycle),
          anio_num: Number(courseObj.anioNum),
          anio_label: `${Number(courseObj.anioNum)}° Año`,
          espacio: courseObj.espacio,
          profesor: courseObj.profesor || "",
          suplente: courseObj.suplente || "",
          teacher_email: courseObj.teacher_email || "",
          horario: courseObj.horario || {}
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async bulkCreateCourses(institutionId, cycle, list) {
      const payload = list.map(c => ({
        institution_id: institutionId,
        cycle: String(cycle),
        anio_num: Number(c.anioNum),
        anio_label: `${Number(c.anioNum)}° Año`,
        espacio: c.espacio,
        profesor: c.profesor || "",
        suplente: c.suplente || "",
        teacher_email: c.teacher_email || "",
        horario: c.horario || {}
      }));
      const { data, error } = await sb.from("courses").insert(payload).select();
      if (error) throw error;
      return data;
    },

    // Super-Admin
    async listInstitutions() {
      const { data, error } = await sb
        .from("institutions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },

    async createInstitution(inst) {
      const { data, error } = await sb
        .from("institutions")
        .insert({
          name: inst.name,
          short_code: inst.short_code || "LT",
          max_years: Number(inst.max_years || 5),
          active_cycle: String(inst.active_cycle || "2026"),
          is_active: true
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async toggleInstitutionStatus(id, isActive) {
      const { error } = await sb
        .from("institutions")
        .update({ is_active: isActive })
        .eq("id", id);
      if (error) throw error;
    }
  };
})();
