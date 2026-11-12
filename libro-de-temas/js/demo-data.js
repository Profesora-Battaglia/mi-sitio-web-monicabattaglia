/**
 * Datos de demostración pública ("Instituto Modelo San Martín")
 * Se usan en el Modo Demo Interactiva para que cualquier institución
 * pueda probar el sistema desde monicabattaglia.com sin afectar datos reales.
 */

window.DEMO_INSTITUTION = {
  id: "demo-inst",
  name: "Instituto Modelo San Martín",
  short_code: "IM",
  max_years: 5,
  active_cycle: "2026",
  is_active: true
};

(function () {
  function daysAgoIso(days) {
    const d = new Date();
    d.setDate(d.getDate() - days);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  window.DEMO_COURSES_2026 = [
    {
      id: "demo-1a-1",
      anioNum: 1,
      anio: "1° Año",
      espacio: "Matemática",
      profesor: "Prof. Laura Gómez",
      suplente: "",
      teacher_email: "laura.gomez@demo.edu",
      horario: { Lunes: "08:00 - 09:20", Miércoles: "09:30 - 10:50" },
      entries: [
        { id: "e1", fecha: daysAgoIso(12), claseN: "24", ap: "Resolución de ecuaciones de primer grado.", saberes: "Ecuaciones lineales con una incógnita.", actividades: "Guía práctica en grupos y puesta en común en pizarrón.", observaciones: "" },
        { id: "e2", fecha: daysAgoIso(5), claseN: "25", ap: "Planteo de problemas algebraicos.", saberes: "Lenguaje coloquial y simbólico.", actividades: "Resolución de situaciones problemáticas cotidianas.", observaciones: "Buena participación general." },
        { id: "e3", fecha: daysAgoIso(2), claseN: "26", ap: "Evaluación de aprendizajes.", saberes: "Ecuaciones y lenguaje algebraico.", actividades: "Evaluación escrita individual.", observaciones: "" }
      ]
    },
    {
      id: "demo-1a-2",
      anioNum: 1,
      anio: "1° Año",
      espacio: "Lengua y Literatura",
      profesor: "Prof. Martín Pereyra",
      suplente: "",
      teacher_email: "martin.pereyra@demo.edu",
      horario: { Martes: "08:00 - 09:20", Jueves: "11:00 - 12:20" },
      entries: [
        { id: "e4", fecha: daysAgoIso(21), claseN: "18", ap: "Comprensión lectora de textos narrativos.", saberes: "El cuento realista: estructura y narrador.", actividades: "Lectura compartida y análisis de personajes.", observaciones: "" }
      ]
    },
    {
      id: "demo-1a-3",
      anioNum: 1,
      anio: "1° Año",
      espacio: "Biología",
      profesor: "Prof. Valeria Quiroga",
      suplente: "",
      teacher_email: "valeria.quiroga@demo.edu",
      horario: { Viernes: "08:00 - 10:00" },
      entries: []
    },
    {
      id: "demo-2a-1",
      anioNum: 2,
      anio: "2° Año",
      espacio: "Historia",
      profesor: "Prof. Carlos Méndez",
      suplente: "Prof. Sofía Álvarez",
      teacher_email: "carlos.mendez@demo.edu",
      horario: { Lunes: "10:00 - 11:20", Jueves: "08:00 - 09:20" },
      entries: [
        { id: "e5", fecha: daysAgoIso(4), claseN: "30", ap: "Análisis de procesos revolucionarios.", saberes: "Revolución Industrial y cambios sociales.", actividades: "Línea de tiempo comparativa y debate.", observaciones: "" }
      ]
    },
    {
      id: "demo-2a-2",
      anioNum: 2,
      anio: "2° Año",
      espacio: "Inglés",
      profesor: "Prof. Laura Gómez",
      suplente: "",
      teacher_email: "laura.gomez@demo.edu",
      horario: { Martes: "10:00 - 11:20", Viernes: "10:00 - 11:20" },
      entries: [
        { id: "e6", fecha: daysAgoIso(18), claseN: "20", ap: "Uso de tiempos verbales en pasado.", saberes: "Past Simple: verbos regulares e irregulares.", actividades: "Listening y redacción de biografía breve.", observaciones: "" }
      ]
    },
    {
      id: "demo-3a-1",
      anioNum: 3,
      anio: "3° Año",
      espacio: "Física y Química",
      profesor: "Prof. Valeria Quiroga",
      suplente: "",
      teacher_email: "valeria.quiroga@demo.edu",
      horario: { Miércoles: "08:00 - 09:20", Viernes: "11:00 - 12:20" },
      entries: [
        { id: "e7", fecha: daysAgoIso(3), claseN: "22", ap: "Interpretación de enlaces químicos.", saberes: "Uniones iónicas y covalentes.", actividades: "Modelado molecular con fichas y tabla periódica.", observaciones: "" }
      ]
    },
    {
      id: "demo-3a-2",
      anioNum: 3,
      anio: "3° Año",
      espacio: "Geografía",
      profesor: "Prof. Carlos Méndez",
      suplente: "",
      teacher_email: "carlos.mendez@demo.edu",
      horario: { Martes: "11:00 - 12:20" },
      entries: []
    },
    {
      id: "demo-4a-1",
      anioNum: 4,
      anio: "4° Año",
      espacio: "Matemática Aplicada",
      profesor: "Prof. Laura Gómez",
      suplente: "",
      teacher_email: "laura.gomez@demo.edu",
      horario: { Lunes: "11:30 - 12:50", Jueves: "09:30 - 10:50" },
      entries: [
        { id: "e8", fecha: daysAgoIso(1), claseN: "28", ap: "Modelización mediante funciones cuadráticas.", saberes: "Vértice, raíces y eje de simetría.", actividades: "Gráficos con GeoGebra y análisis de trayectorias.", observaciones: "" }
      ]
    },
    {
      id: "demo-4a-2",
      anioNum: 4,
      anio: "4° Año",
      espacio: "Educación Ciudadana",
      profesor: "Prof. Martín Pereyra",
      suplente: "",
      teacher_email: "martin.pereyra@demo.edu",
      horario: { Miércoles: "11:00 - 12:20" },
      entries: [
        { id: "e9", fecha: daysAgoIso(16), claseN: "15", ap: "Derechos y garantías constitucionales.", saberes: "Constitución Nacional y mecanismos de participación.", actividades: "Análisis de casos periodísticos.", observaciones: "" }
      ]
    },
    {
      id: "demo-5a-1",
      anioNum: 5,
      anio: "5° Año",
      espacio: "Proyecto de Investigación",
      profesor: "Prof. Valeria Quiroga",
      suplente: "",
      teacher_email: "valeria.quiroga@demo.edu",
      horario: { Jueves: "11:00 - 13:00" },
      entries: [
        { id: "e10", fecha: daysAgoIso(2), claseN: "19", ap: "Diseño metodológico de investigación escolar.", saberes: "Planteo de hipótesis, variables y encuestas.", actividades: "Revisión de avances por equipos.", observaciones: "Entrega de borradores la próxima semana." }
      ]
    },
    {
      id: "demo-5a-2",
      anioNum: 5,
      anio: "5° Año",
      espacio: "Economía y Gestión",
      profesor: "Prof. Carlos Méndez",
      suplente: "",
      teacher_email: "carlos.mendez@demo.edu",
      horario: { Viernes: "09:30 - 11:00" },
      entries: []
    }
  ];
})();
