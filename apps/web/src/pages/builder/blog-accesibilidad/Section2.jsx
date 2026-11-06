import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Sparkles, BookOpen, CheckSquare } from 'lucide-react';
import TeacherShareBar from '@/components/TeacherShareBar';

const BLOG_ARTICLES = [
	{
		id: 'checklist',
		category: 'Accesibilidad y DUA',
		badge: 'Interactivo + Descargable',
		title: 'Checklist de accesibilidad para materiales educativos digitales (20 puntos clave)',
		description:
			'Revisá tus guías, presentaciones y PDFs en pocos minutos con nuestra lista interactiva de 20 criterios prácticos de inclusión y legibilidad.',
		slug: '/blogchecklist-accesibilidad-materiales-educativos',
		minutesToRead: '3 min',
		image:
			'https://horizons-cdn.hostinger.com/8899df02-63ad-48bb-b79f-af29dfcdaf65/lista-en-tablet-RRmFiJXVQenqdl6O.webp?width=768&fit=crop',
		alt: 'Persona sosteniendo una tablet con un recurso educativo dividido en secciones.'
	},
	{
		id: 'pdf-accesible',
		category: 'Accesibilidad y DUA',
		badge: 'Tutorial Paso a Paso',
		title: 'Cómo crear PDFs accesibles para tus estudiantes: guía en Word y Google Docs',
		description:
			'Aprendé a exportar documentos con etiquetas reales, texto alternativo y estructura navegable para lectores de pantalla y celulares.',
		slug: '/blogcomo-crear-pdf-accesible-docentes',
		minutesToRead: '3 min',
		image:
			'https://horizons-cdn.hostinger.com/8899df02-63ad-48bb-b79f-af29dfcdaf65/lista-de-tareas-HKvHUXh4hCx4Xih7.webp?width=768&fit=crop',
		alt: 'Tablet con un checklist educativo sobre una mesa con cuaderno y lapicera.'
	},
	{
		id: 'materiales-ordenados',
		category: 'Accesibilidad y DUA',
		badge: 'Guía Docente',
		title: 'Materiales accesibles y ordenados: 7 claves prácticas sin perder tiempo',
		description:
			'Tipografías, regla del contraste 4.5:1, jerarquía visual, lectura fácil y mi plantilla mental de 4 pasos para que toda hoja se entienda a la primera.',
		slug: '/materiales-accesibles-ordenados-guia',
		minutesToRead: '3 min',
		image:
			'https://horizons-cdn.hostinger.com/8899df02-63ad-48bb-b79f-af29dfcdaf65/escritorio-desorden-fUMPwU5NfOikXYel.webp?width=768&fit=crop',
		alt: 'Escritorio con cuadernos, papeles y dos pares de anteojos en un ambiente de estudio.'
	},
	{
		id: 'ia-aula-2026',
		category: 'Inteligencia Artificial en el Aula',
		badge: 'Incluye Semáforo IA y Bitácora',
		title: 'IA en el aula en 2026: acuerdos claros y evaluación sin persecución',
		description:
			'Cómo pasar del falso dilema "¿prohibir o permitir?" a un Semáforo IA operativo, bitácoras de proceso y evaluaciones auténticas.',
		slug: '/ia-en-el-aula-2026-acuerdos-evaluacion',
		minutesToRead: '4 min',
		image:
			'https://horizons-cdn.hostinger.com/8899df02-63ad-48bb-b79f-af29dfcdaf65/gemini_generated_image_w5iv1ww5iv1ww5iv-convertido-de-png-BDCPYxEe2gQ7nkoR.webp?width=768&fit=crop',
		alt: 'Teléfono e ícono de inteligencia artificial en contexto educativo.'
	},
	{
		id: 'pensamiento-critico',
		category: 'Inteligencia Artificial en el Aula',
		badge: 'Reflexión Pedagógica',
		title: 'Pensamiento crítico en la era de la Inteligencia Artificial: la habilidad que marcará la diferencia',
		description:
			'Por qué cuestionar, contrastar fuentes y formular mejores preguntas es hoy la competencia más humana y necesaria en la escuela.',
		slug: '/pensamiento-critico-en-la-era-de-la-inteligencia-artificial-la-habilidad-que-marcara-la-diferencia',
		minutesToRead: '3 min',
		image: 'https://images.unsplash.com/photo-1677442135136-760c813028c0?auto=format&fit=crop&w=812',
		alt: 'Representación visual de pensamiento crítico e inteligencia artificial.'
	}
];

export default function Section2() {
	const [selectedCat, setSelectedCat] = useState('Todos');
	const categories = ['Todos', 'Accesibilidad y DUA', 'Inteligencia Artificial en el Aula'];

	const filtered =
		selectedCat === 'Todos'
			? BLOG_ARTICLES
			: BLOG_ARTICLES.filter((art) => art.category === selectedCat);

	return (
		<section className="bg-[#f8fafc] py-12 md:py-16">
			<div className="mx-auto max-w-6xl px-6">
				{/* Filtros por temática */}
				<div className="mb-10 flex flex-wrap items-center justify-center gap-2.5">
					{categories.map((cat) => (
						<button
							key={cat}
							type="button"
							onClick={() => setSelectedCat(cat)}
							className={`rounded-full px-5 py-2.5 text-xs font-bold transition sm:text-sm ${
								selectedCat === cat
									? 'bg-[#1b365d] text-white shadow-sm'
									: 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
							}`}
						>
							{cat}
						</button>
					))}
				</div>

				{/* Grilla de Artículos */}
				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					{filtered.map((art) => (
						<article
							key={art.id}
							className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
						>
							<div>
								<Link to={art.slug} className="block overflow-hidden bg-slate-100">
									<img
										src={art.image}
										alt={art.alt}
										className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
										loading="lazy"
									/>
								</Link>
								<div className="p-6">
									<div className="flex flex-wrap items-center justify-between gap-2 text-xs">
										<span className="rounded-full bg-[#1d7a4a]/10 px-3 py-1 font-bold text-[#1d7a4a]">
											{art.badge}
										</span>
										<span className="inline-flex items-center gap-1 font-medium text-slate-500">
											<Clock className="h-3.5 w-3.5" />
											{art.minutesToRead}
										</span>
									</div>

									<Link to={art.slug}>
										<h2
											className="mt-3 text-xl font-extrabold leading-snug text-[#1b365d] transition-colors group-hover:text-[#1d7a4a]"
											style={{ fontFamily: 'var(--font-primary)' }}
										>
											{art.title}
										</h2>
									</Link>
									<p className="mt-2.5 text-sm leading-relaxed text-slate-600">{art.description}</p>
								</div>
							</div>

							<div className="border-t border-slate-100 px-6 py-4">
								<Link
									to={art.slug}
									className="inline-flex items-center gap-2 text-sm font-bold text-[#1b365d] transition group-hover:text-[#1d7a4a]"
								>
									Leer guía completa
									<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
								</Link>
							</div>
						</article>
					))}
				</div>

				{/* Accesos rápidos a las herramientas interactivas */}
				<div className="mt-14 grid gap-6 md:grid-cols-2">
					<div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
						<div>
							<span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#1d7a4a]">
								<CheckSquare className="h-3.5 w-3.5" />
								Herramienta Gratuita
							</span>
							<h3
								className="mt-3 text-xl font-extrabold text-[#1b365d]"
								style={{ fontFamily: 'var(--font-primary)' }}
							>
								Evaluador Interactivo de Accesibilidad
							</h3>
							<p className="mt-2 text-sm leading-relaxed text-slate-600">
								Comprobá en tiempo real qué puntaje de inclusión obtiene tu material didáctico y recibí sugerencias.
							</p>
						</div>
						<div className="mt-5">
							<Link
								to="/evaluador-de-accesibilidad-de-materiales-didacticos"
								className="inline-flex items-center gap-2 rounded-xl bg-[#1b365d] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#142947] sm:text-sm"
							>
								Abrir Evaluador Interactivo
								<ArrowRight className="h-4 w-4" />
							</Link>
						</div>
					</div>

					<div className="flex flex-col justify-between rounded-3xl bg-[#1b365d] p-6 text-white shadow-sm sm:p-8">
						<div>
							<span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-[#74c69d]">
								<Sparkles className="h-3.5 w-3.5" />
								Asistente IA Docente
							</span>
							<h3
								className="mt-3 text-xl font-extrabold text-white"
								style={{ fontFamily: 'var(--font-primary)' }}
							>
								ClaseIAXpress: Planificá y adaptá tus clases en minutos
							</h3>
							<p className="mt-2 text-sm leading-relaxed text-slate-200">
								Generá secuencias didácticas, rúbricas, exámenes y adaptaciones DUA con nuestra aplicación para docentes argentinos.
							</p>
						</div>
						<div className="mt-5">
							<Link
								to="/claseiaxpress"
								className="inline-flex items-center gap-2 rounded-xl bg-[#74c69d] px-5 py-3 text-xs font-bold text-[#1b365d] transition hover:bg-[#5bb887] sm:text-sm"
							>
								Conocer ClaseIAXpress
								<ArrowRight className="h-4 w-4" />
							</Link>
						</div>
					</div>
				</div>

				<div className="mt-12">
					<TeacherShareBar title="Blog de Accesibilidad Educativa e IA en el Aula" urlPath="/blog-accesibilidad" />
				</div>
			</div>
		</section>
	);
}
