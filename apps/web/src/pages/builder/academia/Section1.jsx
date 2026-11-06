import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
	GraduationCap,
	ArrowRight,
	Users,
	Clock,
	Monitor,
	Award,
	HelpCircle,
	CheckCircle2,
	Sparkles,
	BookOpen,
	MessageCircle,
	Building2,
	BellRing,
	CheckSquare,
	FileText
} from 'lucide-react';
import Reveal from '@/components/Reveal';
import TeacherShareBar from '@/components/TeacherShareBar';

const programs = [
	{
		id: 'ia-aula-real',
		icon: Monitor,
		status: 'Inscripción Prioritaria Abierta',
		badge: 'Más solicitado',
		title: 'Taller Práctico: IA Aplicada al Aula Real (sin tecnicismos)',
		description:
			'Aprende a diseñar planificaciones anuales, secuencias didácticas, rúbricas analíticas y actividades diferenciadas con Inteligencia Artificial cuidando el criterio pedagógico.',
		modality: 'Online en vivo + Grabaciones · 4 encuentros',
		includes: [
			'Banco de prompts probados para Primaria, Secundaria y Superior',
			'Modelo de Semáforo IA y Bitácora para tus estudiantes',
			'Práctica guiada con ClaseIAXpress y asistentes gratuitos'
		],
		whatsappText:
			'Hola Mónica, quiero anotarme en la lista prioritaria / consultar próximas fechas y valor del Taller de IA Aplicada al Aula Real.'
	},
	{
		id: 'accesibilidad-dua',
		icon: Award,
		status: 'Inscripción Prioritaria Abierta',
		badge: 'Inclusión y DUA',
		title: 'Programa: Accesibilidad Digital y Materiales Claros',
		description:
			'Transformá tus guías de estudio, PDFs y presentaciones en materiales que todos tus estudiantes puedan leer, comprender y navegar sin barreras desde el celular o la computadora.',
		modality: 'Online práctico · 3 encuentros + Plantillas',
		includes: [
			'Creación de PDFs etiquetados paso a paso en Word y Google Docs',
			'Tipografía, contraste 4.5:1, lectura fácil y texto alternativo',
			'Kit de plantillas editables accesibles listas para tus clases'
		],
		whatsappText:
			'Hola Mónica, quiero anotarme en la lista prioritaria / consultar próximas fechas del Programa de Accesibilidad Digital y Materiales Claros.'
	},
	{
		id: 'digitalizacion-institucional',
		icon: GraduationCap,
		status: 'Disponible todo el año',
		badge: 'Equipos Directivos e Institutos',
		title: 'Digitalización y Gestión Institucional a Medida',
		description:
			'Acompañamiento e implementación para escuelas e institutos superiores: inscripciones online a mesas de examen, generación automática de actas digitales y capacitación al equipo.',
		modality: 'Acompañamiento personalizado presencial u online',
		includes: [
			'Diagnóstico del flujo actual de tu escuela o instituto',
			'Implementación con herramientas sin costo de licencia',
			'Capacitación paso a paso para preceptores, secretarios y docentes'
		],
		isInstitutional: true,
		href: '/contacto-institucional'
	}
];

const faqs = [
	{
		q: '¿A quiénes están dirigidos los talleres de la Academia?',
		a: 'A docentes de todos los niveles (Inicial, Primaria, Secundaria y Superior), maestras de apoyo a la inclusión (MAI), equipos directivos y referentes TIC que busquen herramientas prácticas para ahorrar tiempo y enseñar mejor.'
	},
	{
		q: '¿Cómo me inscribo y cómo se abonan los talleres?',
		a: 'Podés reservar tu lugar escribiéndome por WhatsApp o anotándote en la lista prioritaria en esta misma página. El abono se realiza de forma 100% segura en pesos argentinos mediante link de Mercado Pago.'
	},
	{
		q: '¿Necesito conocimientos técnicos previos?',
		a: 'Para nada. Explicamos cada paso desde cero, en lenguaje docente claro y enfocado en lo que necesitás resolver para tu clase del lunes.'
	},
	{
		q: '¿Puedo empezar a capacitarme y usar herramientas hoy mismo?',
		a: '¡Sí! Mientras abrís tu cupo en los próximos talleres en vivo, podés usar hoy mismo nuestra app ClaseIAXpress (con 3 generaciones gratuitas), el Evaluador Interactivo de Accesibilidad y nuestras guías paso a paso.'
	}
];

export default function Section1() {
	const [waitlistEmail, setWaitlistEmail] = useState('');
	const [waitlistCourse, setWaitlistCourse] = useState('Taller de IA Aplicada al Aula Real');
	const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

	const handleWaitlistSubmit = (e) => {
		e.preventDefault();
		if (!waitlistEmail.trim()) return;
		setWaitlistSubmitted(true);
		const subject = encodeURIComponent(`Reserva de cupo / Lista prioritaria: ${waitlistCourse}`);
		const body = encodeURIComponent(
			`Hola Mónica,\n\nQuiero sumarme a la lista prioritaria de la Academia para recibir fechas de inicio y link de inscripción de:\n• Curso/Taller: ${waitlistCourse}\n• Mi correo: ${waitlistEmail}\n\n¡Muchas gracias!`
		);
		window.open(`mailto:meb@monicabattaglia.com?subject=${subject}&body=${body}`, '_blank');
	};

	return (
		<>
			{/* BIENVENIDA INTEGRADA DE LA ACADEMIA EN EL SITIO WEB */}
			<section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-br from-[#e9eff5] via-white to-[#e3f1ea] py-14 md:py-20 lg:py-24">
				<div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#74c69d]/25 blur-3xl" />
				<div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-[#1b365d]/10 blur-3xl" />

				<div className="relative mx-auto max-w-7xl px-6">
					<div className="grid items-center gap-12 lg:grid-cols-12">
						{/* Columna Izquierda */}
						<div className="lg:col-span-7">
							<Reveal>
								<span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-[#1d7a4a] shadow-sm ring-1 ring-[#1d7a4a]/20 sm:text-sm">
									<GraduationCap className="h-4 w-4" />
									Academia Docente Integrada · Formación Práctica
								</span>
							</Reveal>

							<Reveal delay={0.1}>
								<h1
									className="mt-5 text-3xl font-extrabold leading-[1.15] text-[#1b365d] sm:text-5xl lg:text-[52px]"
									style={{ fontFamily: 'var(--font-primary)' }}
								>
									Formación en <span className="text-[#1d7a4a]">IA y Accesibilidad</span> pensada de docente a docente
								</h1>
							</Reveal>

							<Reveal delay={0.2}>
								<p
									className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg"
									style={{ fontFamily: 'var(--font-secondary)' }}
								>
									Todo en un solo lugar, sin plataformas complicadas. Explorá nuestros próximos talleres
									prácticos, sumate a la lista prioritaria con descuento de lanzamiento y empezá a usar hoy
									mismo nuestras guías gratuitas y la app <strong>ClaseIAXpress</strong>.
								</p>
							</Reveal>

							<Reveal delay={0.25}>
								<div className="mt-8 flex flex-wrap items-center gap-4">
									<a
										href="#programas-academia"
										className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#1d7a4a] px-7 py-4 text-base font-bold text-white shadow-lg shadow-[#1d7a4a]/25 transition-all duration-200 hover:bg-[#166039] hover:shadow-xl"
									>
										Ver Talleres y Programas
										<ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
									</a>
									<Link
										to="/claseiaxpress"
										className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#1b365d]/20 bg-white px-6 py-4 text-base font-bold text-[#1b365d] transition hover:border-[#1b365d] hover:bg-slate-50"
									>
										<Sparkles className="h-4 w-4 text-[#1d7a4a]" />
										Probar App ClaseIAXpress Gratis
									</Link>
								</div>
							</Reveal>

							<Reveal delay={0.3}>
								<div className="mt-8 grid grid-cols-1 gap-3 pt-4 text-xs font-semibold text-slate-600 sm:grid-cols-3 sm:text-sm">
									<div className="flex items-center gap-2">
										<CheckCircle2 className="h-4 w-4 shrink-0 text-[#1d7a4a]" />
										<span>100% aplicable al aula real</span>
									</div>
									<div className="flex items-center gap-2">
										<CheckCircle2 className="h-4 w-4 shrink-0 text-[#1d7a4a]" />
										<span>Certificado digital incluido</span>
									</div>
									<div className="flex items-center gap-2">
										<CheckCircle2 className="h-4 w-4 shrink-0 text-[#1d7a4a]" />
										<span>Inscripción vía Mercado Pago</span>
									</div>
								</div>
							</Reveal>
						</div>

						{/* Columna Derecha: Panel de Inicio Rápido + Lista Prioritaria */}
						<div className="lg:col-span-5">
							<Reveal delay={0.2}>
								<div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-2xl shadow-slate-300/60 sm:p-7">
									<div className="flex items-center justify-between border-b border-slate-100 pb-4">
										<div className="flex items-center gap-3">
											<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1b365d] text-white">
												<BellRing className="h-5 w-5 text-[#74c69d]" />
											</div>
											<div>
												<p className="text-sm font-extrabold text-[#1b365d]">
													Próximas Cohortes 2026
												</p>
												<p className="text-xs font-medium text-[#1d7a4a]">
													● Reservá tu lugar sin compromiso
												</p>
											</div>
										</div>
										<span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#1d7a4a] ring-1 ring-emerald-200">
											Cupos Cuidados
										</span>
									</div>

									<form onSubmit={handleWaitlistSubmit} className="mt-5 space-y-3.5">
										<div>
											<label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
												1. Elegí el taller de tu interés:
											</label>
											<select
												value={waitlistCourse}
												onChange={(e) => setWaitlistCourse(e.target.value)}
												className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-[#1b365d] focus:border-[#1d7a4a] focus:bg-white focus:outline-none"
											>
												<option value="Taller de IA Aplicada al Aula Real">
													Taller: IA Aplicada al Aula Real (4 encuentros)
												</option>
												<option value="Programa de Accesibilidad Digital y Materiales Claros">
													Programa: Accesibilidad Digital y Materiales Claros
												</option>
												<option value="Capacitación Institucional para mi Escuela">
													Jornada / Capacitación para mi Escuela
												</option>
											</select>
										</div>

										<div>
											<label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
												2. Tu correo electrónico docente:
											</label>
											<input
												type="email"
												required
												value={waitlistEmail}
												onChange={(e) => setWaitlistEmail(e.target.value)}
												placeholder="tuemail@ejemplo.com"
												className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-[#1d7a4a] focus:outline-none"
											/>
										</div>

										<button
											type="submit"
											className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1d7a4a] px-5 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#166039]"
										>
											Recibir fecha de inicio y beneficio
											<ArrowRight className="h-4 w-4" />
										</button>

										{waitlistSubmitted && (
											<p className="rounded-xl bg-emerald-50 p-2.5 text-center text-xs font-semibold text-[#1d7a4a]">
												✓ ¡Listo! Te avisaremos con prioridad apenas abran las inscripciones con link de Mercado Pago.
											</p>
										)}
									</form>

									{/* Recursos para empezar hoy mismo sin esperar */}
									<div className="mt-6 border-t border-slate-100 pt-5">
										<p className="text-xs font-extrabold uppercase tracking-wider text-[#1b365d]">
											⚡ Empezá a aprender hoy mismo (Gratis):
										</p>
										<div className="mt-3 grid grid-cols-2 gap-2.5">
											<Link
												to="/evaluador-de-accesibilidad-de-materiales-didacticos"
												className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-[#1b365d] transition hover:border-[#1d7a4a] hover:bg-white"
											>
												<CheckSquare className="h-4 w-4 shrink-0 text-[#1d7a4a]" />
												<span>Evaluador DUA</span>
											</Link>
											<Link
												to="/blogcomo-crear-pdf-accesible-docentes"
												className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-[#1b365d] transition hover:border-[#1d7a4a] hover:bg-white"
											>
												<FileText className="h-4 w-4 shrink-0 text-[#1d7a4a]" />
												<span>Guía PDFs</span>
											</Link>
										</div>
									</div>
								</div>
							</Reveal>
						</div>
					</div>
				</div>
			</section>

			{/* SECCIÓN DE PROGRAMAS FORMATIVOS DETALLADOS */}
			<section id="programas-academia" className="bg-white py-16 md:py-24">
				<div className="mx-auto max-w-7xl px-6">
					<Reveal>
						<div className="mx-auto max-w-3xl text-center">
							<span className="text-xs font-extrabold uppercase tracking-wider text-[#1d7a4a] sm:text-sm">
								Programas Formativos 2026
							</span>
							<h2
								className="mt-2 text-3xl font-extrabold leading-tight text-[#1b365d] sm:text-4xl lg:text-5xl"
								style={{ fontFamily: 'var(--font-primary)' }}
							>
								Talleres prácticos para transformar tu enseñanza
							</h2>
							<p
								className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg"
								style={{ fontFamily: 'var(--font-secondary)' }}
							>
								Cada propuesta combina marcos pedagógicos claros, práctica real paso a paso y plantillas listas
								para usar en tus clases.
							</p>
						</div>
					</Reveal>

					<div className="mt-14 grid gap-8 lg:grid-cols-3">
						{programs.map((p, i) => (
							<Reveal key={p.id} delay={i * 0.1}>
								<article className="group flex h-full flex-col justify-between rounded-3xl border border-slate-200/90 bg-[#f9fbfc] p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#1d7a4a]/30 hover:bg-white hover:shadow-xl">
									<div>
										<div className="flex items-center justify-between gap-2">
											<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1d7a4a]/10 text-[#1d7a4a] transition-colors duration-300 group-hover:bg-[#1d7a4a] group-hover:text-white">
												<p.icon className="h-6 w-6" />
											</div>
											<span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#1d7a4a] ring-1 ring-emerald-200">
												{p.status}
											</span>
										</div>

										<h3
											className="mt-6 text-2xl font-extrabold leading-snug text-[#1b365d]"
											style={{ fontFamily: 'var(--font-primary)' }}
										>
											{p.title}
										</h3>

										<p
											className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base"
											style={{ fontFamily: 'var(--font-secondary)' }}
										>
											{p.description}
										</p>

										<div className="mt-5 border-t border-slate-200/80 pt-4">
											<p className="text-xs font-bold uppercase tracking-wider text-slate-400">
												Qué te llevás en este programa:
											</p>
											<ul className="mt-2.5 space-y-2">
												{p.includes.map((inc) => (
													<li key={inc} className="flex items-start gap-2 text-xs text-slate-700 sm:text-sm">
														<CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1d7a4a]" />
														<span>{inc}</span>
													</li>
												))}
											</ul>
										</div>
									</div>

									<div className="mt-7 pt-4">
										<p className="mb-4 inline-flex items-center gap-2 text-xs font-bold text-[#1d7a4a] sm:text-sm">
											<Clock className="h-4 w-4" />
											{p.modality}
										</p>

										{p.isInstitutional ? (
											<Link
												to={p.href}
												className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1b365d] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#142947]"
											>
												Solicitar propuesta para mi escuela
												<ArrowRight className="h-4 w-4" />
											</Link>
										) : (
											<a
												href={`https://wa.me/5492622662596?text=${encodeURIComponent(p.whatsappText)}`}
												target="_blank"
												rel="noopener noreferrer"
												className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1d7a4a] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#166039]"
											>
												<MessageCircle className="h-4 w-4" />
												Reservar cupo / Consultar por WhatsApp
											</a>
										)}
									</div>
								</article>
							</Reveal>
						))}
					</div>
				</div>
			</section>

			{/* BANNER INSTITUCIONAL Y MODALIDAD */}
			<section className="bg-[#f6f8fa] py-16 md:py-20">
				<div className="mx-auto max-w-6xl px-6">
					<div className="grid gap-6 sm:grid-cols-3">
						{[
							{
								icon: Users,
								title: 'Pensado para Docentes Reales',
								text: 'Sin jerga informática compleja. Ejemplos aplicados a Primaria, Secundaria y Nivel Superior.'
							},
							{
								icon: BookOpen,
								title: 'Material Descargable',
								text: 'Todas las formaciones incluyen guías en PDF accesible, plantillas editables y secuencias modelo.'
							},
							{
								icon: Award,
								title: 'Certificación Digital',
								text: 'Al completar cada taller recibís tu certificado digital para sumar a tu portfolio o CV.'
							}
						].map((item, i) => (
							<Reveal key={item.title} delay={i * 0.1}>
								<div className="flex h-full flex-col items-center rounded-3xl border border-slate-200/80 bg-white p-7 text-center shadow-sm">
									<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1b365d]/10 text-[#1b365d]">
										<item.icon className="h-6 w-6" />
									</div>
									<h3
										className="mt-4 text-lg font-extrabold text-[#1b365d]"
										style={{ fontFamily: 'var(--font-primary)' }}
									>
										{item.title}
									</h3>
									<p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
								</div>
							</Reveal>
						))}
					</div>

					{/* Llamado para Escuelas / Jornadas Institucionales */}
					<Reveal delay={0.15}>
						<div className="mt-10 rounded-3xl bg-gradient-to-r from-[#1b365d] to-[#1d7a4a] p-7 text-white shadow-lg sm:p-10">
							<div className="grid items-center gap-8 lg:grid-cols-12">
								<div className="lg:col-span-8">
									<span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1 text-xs font-bold text-[#74c69d]">
										<Building2 className="h-3.5 w-3.5" />
										Jornadas Institucionales · Tupungato, Mendoza y Online a todo el país
									</span>
									<h3
										className="mt-3 text-2xl font-extrabold text-white sm:text-3xl"
										style={{ fontFamily: 'var(--font-primary)' }}
									>
										¿Querés llevar estos talleres a todo el equipo docente de tu escuela?
									</h3>
									<p className="mt-2 text-sm leading-relaxed text-slate-100 sm:text-base">
										Diseñamos jornadas presenciales (en Valle de Uco y Mendoza) o virtuales en vivo adaptadas
										a la realidad de tu institución, incluyendo acceso grupal a <strong>ClaseIAXpress</strong>.
									</p>
								</div>
								<div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:flex-col">
									<Link
										to="/contacto-institucional"
										className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-extrabold text-[#1b365d] shadow-sm transition hover:bg-slate-100"
									>
										Solicitar Propuesta Institucional
									</Link>
									<a
										href="https://wa.me/5492622662596?text=Hola%20M%C3%B3nica,%20me%20interesa%20consultar%20por%20una%20capacitaci%C3%B3n%20institucional%20para%20mi%20escuela."
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-xs font-bold text-white transition hover:bg-white/20 sm:text-sm"
									>
										<MessageCircle className="h-4 w-4" />
										Consultar por WhatsApp
									</a>
								</div>
							</div>
						</div>
					</Reveal>
				</div>
			</section>

			{/* PREGUNTAS FRECUENTES + COMPARTIR */}
			<section className="bg-white py-16 md:py-24">
				<div className="mx-auto max-w-4xl px-6">
					<Reveal>
						<div className="text-center">
							<span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#1d7a4a] sm:text-sm">
								<HelpCircle className="h-4 w-4" />
								Preguntas Frecuentes sobre la Academia
							</span>
							<h2
								className="mt-2 text-3xl font-extrabold leading-tight text-[#1b365d] sm:text-4xl"
								style={{ fontFamily: 'var(--font-primary)' }}
							>
								Resolvé tus dudas
							</h2>
						</div>
					</Reveal>

					<div className="mt-10 space-y-4">
						{faqs.map((faq, i) => (
							<Reveal key={faq.q} delay={i * 0.08}>
								<details className="group rounded-2xl border border-slate-200/80 bg-[#f9fbfc] p-6 transition hover:border-[#1d7a4a]/30 [&_summary]:cursor-pointer">
									<summary
										className="flex items-center justify-between text-base font-bold text-[#1b365d]"
										style={{ fontFamily: 'var(--font-primary)' }}
									>
										{faq.q}
										<span className="ml-4 text-xl font-bold text-[#1d7a4a] transition-transform duration-200 group-open:rotate-45">
											+
										</span>
									</summary>
									<p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{faq.a}</p>
								</details>
							</Reveal>
						))}
					</div>

					<div className="mt-14">
						<TeacherShareBar
							title="Academia Docente: Talleres de IA y Accesibilidad Educativa | Mónica Battaglia"
							urlPath="/academia"
						/>
					</div>
				</div>
			</section>
		</>
	);
}
