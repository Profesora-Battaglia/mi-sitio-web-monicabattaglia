/**
 * Catálogo centralizado de ClaseIAXpress, Recursos para Docentes, Cursos de la Academia y Servicios.
 * Para agregar un nuevo recurso, curso o pack con link de Mercado Pago:
 * simplemente sumá un objeto nuevo en el listado correspondiente.
 */

export const APP_URLS = {
	appHome: 'https://app.monicabattaglia.com/',
	appPlans: 'https://app.monicabattaglia.com/planes',
	appVercel: 'https://claseiaxpress.vercel.app/',
	campus: '/academia',
	whatsapp: 'https://wa.me/5492622662596',
	email: 'mailto:meb@monicabattaglia.com',
};

export const CLASE_IA_MODULES = [
	{
		id: 'planificador-clases',
		category: 'Planificación',
		badge: 'Popular',
		title: 'Planificador de Clases Diarias',
		description:
			'Creá clases completas con inicio, desarrollo, cierre, actividades diferenciadas y recursos en menos de 2 minutos, alineadas a los NAP y al DCP de Mendoza.',
	},
	{
		id: 'secuencias-didacticas',
		category: 'Planificación',
		badge: 'Ahorra +5 hs',
		title: 'Secuencias Didácticas Completas',
		description:
			'Desarrollá secuencias articuladas clase por clase con propósitos, capacidades, indicadores de logro y actividades conectadas listas para descargar en Word o PDF.',
	},
	{
		id: 'planificador-anual-trimestral',
		category: 'Planificación',
		badge: 'Curricular',
		title: 'Planificador Anual y Trimestral',
		description:
			'Organizá todo tu año lectivo o trimestre por ejes, saberes prioritarios y capacidades fundamentales sin empezar desde una hoja en blanco.',
	},
	{
		id: 'generador-rubricas',
		category: 'Evaluación',
		badge: 'Evaluación formativa',
		title: 'Generador de Rúbricas por Capacidades',
		description:
			'Armá rúbricas analíticas y listas de cotejo claras con niveles de desempeño listos para compartir con tus estudiantes y familias.',
	},
	{
		id: 'generador-cuestionarios',
		category: 'Evaluación',
		badge: 'Tema 1 y Tema 2',
		title: 'Cuestionarios y Exámenes con Solucionario',
		description:
			'Generá evaluaciones escritas, actividades de comprensión y exámenes en múltiples variantes (Tema 1 y Tema 2 para evitar copias) con las respuestas para el docente.',
	},
	{
		id: 'inclusion-dua-ppi',
		category: 'Inclusión y Gestión',
		badge: 'Inclusión real',
		title: 'Módulo Avanzado de Inclusión (PPI y DUA)',
		description:
			'Adaptá textos, consignas y evaluaciones bajo criterios de Diseño Universal del Aprendizaje (DUA), Lectura Fácil y Proyectos Pedagógicos Individuales (PPI).',
	},
	{
		id: 'actos-informes-abp',
		category: 'Inclusión y Gestión',
		badge: 'Escuela real',
		title: 'Actos Escolares, Informes y Proyectos ABP',
		description:
			'Redactá discursos y glosas para efemérides argentinas, informes cualitativos de trayectorias en riesgo y proyectos interdisciplinarios (ABP).',
	},
	{
		id: 'chatbot-pedagogico',
		category: 'Inclusión y Gestión',
		badge: 'IA 24/7',
		title: 'ChatBot Pedagógico Especializado',
		description:
			'Un asistente entrenado en pedagogía, normativa escolar y didáctica para sacarte dudas, reformular actividades o destrabar ideas en cualquier momento.',
	},
];

export const CLASE_IA_PLANS = [
	{
		id: 'plan-inicial',
		badge: 'PRUEBA GRATUITA',
		badgeColor: 'emerald',
		name: 'Plan Inicial',
		subtitle: 'Para conocer la herramienta y probar su potencial',
		price: '$0',
		period: '/ siempre gratis',
		isPopular: false,
		featuresTitle: 'INCLUYE:',
		features: [
			{ text: '3 generaciones de prueba en total', included: true },
			{ text: 'Acceso al ChatBot Pedagógico', included: true },
			{ text: '1 descarga de muestra en Word (.doc)', included: true },
			{ text: 'Sin secuencias didácticas completas', included: false },
		],
		ctaText: 'Comenzar Gratis',
		ctaUrl: 'https://app.monicabattaglia.com/',
		paymentMethod: 'Gratis sin tarjeta',
	},
	{
		id: 'docente-pro',
		topRibbon: '⭐ EL MÁS ELEGIDO',
		badge: 'RECOMENDADO',
		badgeColor: 'blue',
		name: 'Docente Pro',
		subtitle: 'Para el docente que quiere resolver sus clases y recuperar sus fines de semana',
		price: '$20.000',
		period: '/ mes (ARS)',
		isPopular: true,
		featuresTitle: 'TODO LO DEL PLAN GRATIS Y ADEMÁS:',
		features: [
			{ text: 'Generaciones ilimitadas de clases y secuencias', included: true, bold: true },
			{ text: 'Descargas ilimitadas en Word (.doc) y PDF', included: true, bold: true },
			{ text: 'Generador de Rúbricas analíticas por capacidades', included: true },
			{ text: 'Cuestionarios y exámenes con solucionario docente', included: true },
			{ text: 'Actos escolares y discursos para efemérides', included: true },
			{ text: 'Historial completo guardado', included: true },
		],
		ctaText: '⚡ Suscribirme por $20.000 con MP',
		ctaUrl: 'https://app.monicabattaglia.com/planes',
		paymentMethod: 'Mercado Pago',
	},
	{
		id: 'docente-experto',
		badge: 'MÁXIMA POTENCIA',
		badgeColor: 'purple',
		name: 'Docente Experto',
		subtitle: 'Para profesores con múltiples cursos, maestras de apoyo (MAI) y directivos',
		price: '$40.000',
		period: '/ mes (ARS)',
		isPopular: false,
		featuresTitle: 'BENEFICIOS DE ALTO VOLUMEN:',
		features: [
			{ text: 'Módulo Avanzado de Inclusión (PPI y DUA)', included: true, bold: true },
			{ text: 'Exámenes con múltiples variantes (Tema 1, Tema 2) para evitar copias', included: true, bold: true },
			{ text: 'Informes cualitativos de trayectorias en riesgo', included: true },
			{ text: 'Proyectos ABP interdisciplinarios complejos', included: true },
			{ text: 'Soporte prioritario por WhatsApp directo con Mónica', included: true, bold: true },
		],
		ctaText: 'Elegir Plan Experto ($40.000)',
		ctaUrl: 'https://app.monicabattaglia.com/planes',
		paymentMethod: 'Mercado Pago',
	},
];

export const TEACHER_RESOURCES = [
	{
		id: 'checklist-accesibilidad-20-puntos',
		slug: 'checklist-accesibilidad-20-puntos',
		title: 'Checklist de Accesibilidad de 20 Puntos para Materiales Educativos',
		subtitle: 'Guía rápida descargable + lista de control antes de compartir PDFs o actividades',
		description:
			'Revisá en 5 minutos si tus guías, presentaciones y PDFs cumplen con los criterios esenciales de legibilidad, contraste, jerarquía visual y lectura fácil para que ningún estudiante quede afuera.',
		category: 'gratuito',
		categoryLabel: 'Descarga Gratuita',
		priceLabel: 'Gratis',
		isFree: true,
		badge: 'Más descargado',
		format: 'Guía + Checklist',
		image:
			'https://horizons-cdn.hostinger.com/8899df02-63ad-48bb-b79f-af29dfcdaf65/lista-en-tablet-RRmFiJXVQenqdl6O.webp?width=768&fit=crop',
		ctaText: 'Ver y descargar checklist',
		ctaUrl: '/blogchecklist-accesibilidad-materiales-educativos',
		isInternal: true,
		highlights: [
			'20 criterios claros divididos en 4 áreas',
			'Ideal para Word, Canva, Google Docs y PDF',
			'Basado en pautas WCAG 2.1 AA aplicadas al aula',
		],
	},
	{
		id: 'evaluador-interactivo-accesibilidad',
		slug: 'evaluador-de-accesibilidad-de-materiales-didacticos',
		title: 'Evaluador Interactivo de Materiales Inclusivos (App Web)',
		subtitle: 'Auditá en tiempo real el nivel de inclusión de tus documentos y presentaciones',
		description:
			'Herramienta interactiva gratuita con gráficos en vivo para evaluar la claridad visual, organización del contenido, multimedia y acceso tecnológico de tus recursos didácticos.',
		category: 'interactivo',
		categoryLabel: 'Herramienta Interactiva',
		priceLabel: 'Gratis Online',
		isFree: true,
		badge: 'App Gratuita',
		format: 'Aplicación Web',
		image:
			'https://horizons-cdn.hostinger.com/8899df02-63ad-48bb-b79f-af29dfcdaf65/gemini_generated_image_j7gnt3j7gnt3j7gn-convertido-de-png-fpxIa5eD13lrZeZR.webp?width=768&fit=crop',
		ctaText: 'Usar Evaluador Gratis',
		ctaUrl: '/evaluador-de-accesibilidad-de-materiales-didacticos',
		isInternal: true,
		highlights: [
			'Diagnóstico automático con puntaje en %',
			'Gráfico radar por área temática',
			'100% gratuito y sin registro previo',
		],
	},
	{
		id: 'escape-room-revolucion-de-mayo',
		slug: 'juego-interactivo-revolucion-de-mayo',
		title: 'Escape Room Digital: "Misión El Grito de Libertad" (25 de Mayo)',
		subtitle: 'Juego interactivo de Lengua y Matemática listo para usar en el aula o compartir',
		description:
			'Propuesta lúdica para celebrar la Semana de Mayo integrando Lengua (clases de palabras, sintaxis, comprensión) y Matemática (fracciones y cuadrado mágico), con sonido, pistas pedagógicas y Diploma de Patriota imprimible.',
		category: 'interactivo',
		categoryLabel: 'Juego para el Aula',
		priceLabel: 'Gratis Online',
		isFree: true,
		badge: 'Listo para el aula',
		format: 'Juego Interactivo + Diploma PDF',
		image:
			'https://horizons-cdn.hostinger.com/8899df02-63ad-48bb-b79f-af29dfcdaf65/gemini_generated_image_twvozmtwvozmtwvo-convertido-de-png-Mc6gw6ubrF04hHPO.webp?width=768&fit=crop',
		ctaText: 'Jugar y usar en clase',
		ctaUrl: '/juego-interactivo-revolucion-de-mayo',
		isInternal: true,
		highlights: [
			'4 salas con desafíos de Lengua y Matemática',
			'Guardado automático y pistas pedagógicas',
			'Genera Diploma de Honor imprimible para cada alumno',
		],
	},
	{
		id: 'guia-pdfs-accesibles-docentes',
		slug: 'blogcomo-crear-pdf-accesible-docentes',
		title: 'Guía Paso a Paso: Cómo Crear PDFs Accesibles desde Word, Docs o Canva',
		subtitle: 'Tutorial práctico para que tus archivos se lean bien en celulares y lectores de pantalla',
		description:
			'Aprendé a exportar documentos con texto seleccionable, encabezados reales, contraste correcto y peso liviano para enviar por WhatsApp o subir a Moodle sin barreras.',
		category: 'gratuito',
		categoryLabel: 'Guía Práctica',
		priceLabel: 'Gratis',
		isFree: true,
		badge: 'Lectura + Guía',
		format: 'Guía Paso a Paso',
		image:
			'https://horizons-cdn.hostinger.com/8899df02-63ad-48bb-b79f-af29dfcdaf65/lista-de-tareas-HKvHUXh4hCx4Xih7.webp?width=768&fit=crop',
		ctaText: 'Leer guía gratuita',
		ctaUrl: '/blogcomo-crear-pdf-accesible-docentes',
		isInternal: true,
		highlights: [
			'Pasos exactos en Word, Google Docs y Canva',
			'Evita el error del "PDF escaneado como foto"',
			'Optimizado para alumnos que leen desde el celular',
		],
	},
	{
		id: 'guia-materiales-ordenados',
		slug: 'materiales-accesibles-ordenados-guia',
		title: 'Guía de Diseño Visual y Lectura Fácil para Materiales Docentes',
		subtitle: 'Tipografías, espaciados y estructura para reducir consultas repetidas en clase',
		description:
			'Cómo transformar guías recargadas en materiales limpios que promueven la autonomía del estudiante y disminuyen la carga cognitiva.',
		category: 'gratuito',
		categoryLabel: 'Descarga Gratuita',
		priceLabel: 'Gratis',
		isFree: true,
		badge: 'Diseño Inclusivo',
		format: 'Guía Pedagógica',
		image:
			'https://horizons-cdn.hostinger.com/8899df02-63ad-48bb-b79f-af29dfcdaf65/escritorio-desorden-fUMPwU5NfOikXYel.webp?width=768&fit=crop',
		ctaText: 'Acceder a la guía',
		ctaUrl: '/materiales-accesibles-ordenados-guia',
		isInternal: true,
		highlights: [
			'Tipografías recomendadas para dislexia y baja visión',
			'Cómo redactar consignas claras paso a paso',
			'Ejemplos reales de antes y después',
		],
	},
	{
		id: 'claseiaxpress-suscripcion',
		slug: 'claseiaxpress',
		title: 'ClaseIAXpress: Tu Asistente Pedagógico con IA',
		subtitle: 'Planificaciones, secuencias, rúbricas y adaptaciones DUA/PPI en minutos',
		description:
			'Empezá con 3 generaciones gratuitas o suscribite con Mercado Pago a los planes Docente Pro ($15.000/mes) o Docente Experto ($30.000/mes) con descargas ilimitadas en Word y PDF.',
		category: 'premium',
		categoryLabel: 'App con IA · Suscripción MP',
		priceLabel: 'Gratis / Desde $15.000 ARS',
		isFree: false,
		badge: '⭐ Recomendado',
		format: 'Aplicación Web + Descargas Word/PDF',
		image:
			'https://horizons-cdn.hostinger.com/8899df02-63ad-48bb-b79f-af29dfcdaf65/gemini_generated_image_ebw73cebw73cebw7-convertido-de-png-vUN5x8yIzASpKOGD.webp?width=768&fit=crop',
		ctaText: 'Ver Planes y Probar Gratis',
		ctaUrl: '/claseiaxpress',
		isInternal: true,
		secondaryCtaText: 'Suscribirme con Mercado Pago',
		secondaryCtaUrl: 'https://app.monicabattaglia.com/planes',
		highlights: [
			'Alineado a NAP y DCP Mendoza',
			'Exportación directa a Word (.doc) y PDF',
			'Pago seguro con Mercado Pago en pesos argentinos',
		],
	},
	{
		id: 'curso-ia-aula-real-campus',
		slug: 'curso-ia-aplicada-al-aula-real',
		title: 'Taller Práctico: IA Aplicada al Aula Real (Academia)',
		subtitle: '4 encuentros prácticos + grabaciones y certificado digital',
		description:
			'Aprendé a crear planificaciones, rúbricas, materiales diferenciados y actividades con Inteligencia Artificial sin tecnicismos. Reservá tu lugar en la Academia con pago vía Mercado Pago.',
		category: 'premium',
		categoryLabel: 'Taller en Academia · Mercado Pago',
		priceLabel: 'Inscripción Prioritaria',
		isFree: false,
		badge: 'Con Certificado',
		format: 'Online en vivo + Grabaciones',
		image:
			'https://horizons-cdn.hostinger.com/8899df02-63ad-48bb-b79f-af29dfcdaf65/dando-clases-Qvb59NOrURvU1RpV.webp?width=768&fit=crop',
		ctaText: 'Ver Programa en la Academia',
		ctaUrl: '/academia',
		isInternal: true,
		secondaryCtaText: 'Reservar lugar por WhatsApp',
		secondaryCtaUrl:
			'https://wa.me/5492622662596?text=Hola%20M%C3%B3nica%2C%20quiero%20informaci%C3%B3n%20y%20link%20de%20Mercado%20Pago%20para%20el%20taller%20de%20IA%20aplicada%20al%20aula',
		highlights: [
			'100% práctico para aplicar el lunes en clase',
			'Grabaciones y plantillas incluidas',
			'Certificado digital para tu portfolio docente',
		],
	},
	{
		id: 'curso-accesibilidad-digital-campus',
		slug: 'curso-accesibilidad-digital-educativa',
		title: 'Programa: Accesibilidad Digital Educativa (WCAG 2.1 AA)',
		subtitle: '3 encuentros prácticos para diseñar materiales y aulas virtuales sin barreras',
		description:
			'Formación paso a paso para docentes, referentes TIC y equipos directivos sobre creación de PDFs, presentaciones y recursos inclusivos.',
		category: 'premium',
		categoryLabel: 'Programa en Academia · Mercado Pago',
		priceLabel: 'Inscripción Prioritaria',
		isFree: false,
		badge: 'Con Certificado',
		format: 'Online en vivo + Plantillas',
		image:
			'https://horizons-cdn.hostinger.com/8899df02-63ad-48bb-b79f-af29dfcdaf65/gemini_generated_image_ctk7ductk7ductk7-convertido-de-png-Rk1mxC9VSBzQvZXf.webp?width=768&fit=crop',
		ctaText: 'Ver Programa en la Academia',
		ctaUrl: '/academia',
		isInternal: true,
		secondaryCtaText: 'Reservar lugar por WhatsApp',
		secondaryCtaUrl:
			'https://wa.me/5492622662596?text=Hola%20M%C3%B3nica%2C%20quiero%20inscribirme%20al%20programa%20de%20Accesibilidad%20Digital%20Educativa',
		highlights: [
			'Diseño de PDFs, presentaciones e infografías accesibles',
			'Aplicación directa en Word, Google Docs y Canva',
			'Certificado digital de participación',
		],
	},
];

export function getResourceBySlug(slug) {
	if (!slug) return null;
	const clean = slug.replace(/^\/+/, '');
	return TEACHER_RESOURCES.find((item) => item.slug === clean || item.id === clean) || null;
}
