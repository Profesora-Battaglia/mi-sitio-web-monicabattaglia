import React from 'react';
import {
	Sparkles,
	ArrowRight,
	Check,
	X,
	Zap,
	BookOpen,
	Calendar,
	FileText,
	BarChart2,
	CheckSquare,
	MessageSquare,
	HeartHandshake,
	Download,
	ShieldCheck,
	Clock,
	HelpCircle,
	Building2,
} from 'lucide-react';
import Reveal from '@/components/Reveal';
import TeacherShareBar from '@/components/TeacherShareBar';
import { CLASE_IA_MODULES, CLASE_IA_PLANS, APP_URLS } from '@/pages/builder/shared/catalogData';

const APP_FAQS = [
	{
		q: '¿Necesito saber usar Inteligencia Artificial o escribir "prompts" difíciles?',
		a: 'No. ClaseIAXpress está diseñada con formularios pedagógicos guiados: solo elegís tu nivel (Inicial, Primaria, Secundaria o Superior), materia, año y tema, y la plataforma arma el documento con vocabulario docente argentino.',
	},
	{
		q: '¿Las planificaciones están alineadas al diseño curricular de Argentina y Mendoza?',
		a: 'Sí. Contempla los Núcleos de Aprendizajes Prioritarios (NAP) nacionales y el Diseño Curricular Provincial (DCP Mendoza), trabajando por capacidades fundamentales, saberes e indicadores de logro.',
	},
	{
		q: '¿Puedo editar las planificaciones y exámenes en Word?',
		a: 'Sí. Todo lo que generás se puede descargar en formato Word (.doc) 100% editable para agregar el logo de tu escuela o hacer ajustes personales, y también en PDF listo para presentar o imprimir.',
	},
	{
		q: '¿Cómo funciona el pago con Mercado Pago y cómo se activa mi cuenta?',
		a: 'Elegís el plan Docente Pro ($20.000/mes) o Docente Experto ($40.000/mes) y abonás de forma 100% segura en pesos argentinos mediante Mercado Pago (dinero en cuenta, débito o crédito). Podés empezar antes con el Plan Inicial gratuito de 3 generaciones sin tarjeta.',
	},
	{
		q: '¿Qué incluye el Módulo de Inclusión (PPI y DUA)?',
		a: 'Permite adaptar consignas, textos y evaluaciones aplicando pautas de Diseño Universal del Aprendizaje (DUA), Lectura Fácil y ajustes razonables para estudiantes con CUD o Proyectos Pedagógicos Individuales (PPI).',
	},
	{
		q: '¿Tienen planes para escuelas o equipos directivos?',
		a: 'Sí. Si sos directivo o referente TIC y querés habilitar ClaseIAXpress para el plantel docente de tu institución (junto con un taller práctico de implementación), escribinos por WhatsApp para armar un convenio institucional.',
	},
];

export default function Section1() {
	return (
		<>
			{/* HERO PRINCIPAL */}
			<section className="relative overflow-hidden bg-gradient-to-br from-[#e9eff5] via-white to-[#e3f1ea]">
				<div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#74c69d]/25 blur-3xl" />
				<div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-[#1b365d]/10 blur-3xl" />

				<div className="relative mx-auto max-w-7xl px-6 py-16 md:py-24 lg:py-28">
					<div className="grid items-center gap-12 lg:grid-cols-12">
						{/* Columna Izquierda: Propuesta de Valor */}
						<div className="lg:col-span-7">
							<Reveal>
								<span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#1d7a4a] shadow-sm ring-1 ring-[#1d7a4a]/20">
									<Sparkles className="h-4 w-4" />
									ClaseIAXpress · Tu Asistente Pedagógico con IA
								</span>
							</Reveal>

							<Reveal delay={0.1}>
								<h1
									className="mt-6 text-4xl font-bold leading-[1.15] text-[#1b365d] sm:text-5xl lg:text-6xl"
									style={{ fontFamily: 'var(--font-primary)' }}
								>
									Planificá tus clases, rúbricas y adaptaciones en minutos
								</h1>
							</Reveal>

							<Reveal delay={0.2}>
								<p
									className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl"
									style={{ fontFamily: 'var(--font-secondary)' }}
								>
									Recuperá hasta <strong className="font-bold text-[#1d7a4a]">10 horas de tus fines de semana</strong>.
									Generá planificaciones anuales, secuencias didácticas, exámenes (Tema 1 y 2 con solucionario),
									rúbricas por capacidades y adaptaciones DUA/PPI alineadas al currículo argentino (NAP y DCP Mendoza).
								</p>
							</Reveal>

							<Reveal delay={0.25}>
								<div className="mt-8 flex flex-col gap-4 sm:flex-row">
									<a
										href={APP_URLS.appHome}
										target="_blank"
										rel="noopener noreferrer"
										className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#1d7a4a] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#1d7a4a]/25 transition-all duration-200 hover:bg-[#18663f] hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1d7a4a]/30 active:scale-[0.98]"
									>
										Probar Gratis (3 generaciones)
										<ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
									</a>
									<a
										href="#planes-precios"
										className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#1b365d]/20 bg-white px-8 py-4 text-base font-semibold text-[#1b365d] transition-all duration-200 hover:border-[#1b365d] hover:bg-[#1b365d] hover:text-white"
									>
										<Zap className="h-4 w-4 text-blue-600" />
										Ver Planes con Mercado Pago
									</a>
								</div>
							</Reveal>

							<Reveal delay={0.3}>
								<div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-slate-600">
									<span className="inline-flex items-center gap-2">
										<Check className="h-4 w-4 text-[#1d7a4a]" />
										Exportación a Word (.doc) y PDF
									</span>
									<span className="inline-flex items-center gap-2">
										<Check className="h-4 w-4 text-[#1d7a4a]" />
										Sin tarjeta para la prueba gratis
									</span>
									<span className="inline-flex items-center gap-2">
										<Check className="h-4 w-4 text-[#1d7a4a]" />
										Creado por una docente con +25 años en el aula
									</span>
								</div>
							</Reveal>
						</div>

						{/* Columna Derecha: Vista previa visual del Panel de ClaseIAXpress */}
						<div className="lg:col-span-5">
							<Reveal delay={0.2}>
								<div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-300/60">
									{/* Cabecera estilo App */}
									<div className="flex items-center justify-between border-b border-slate-100 bg-[#f8fafc] px-6 py-4">
										<div className="flex items-center gap-3">
											<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b5cab] text-white shadow-sm">
												<BookOpen className="h-5 w-5" />
											</div>
											<div>
												<p className="text-base font-bold text-[#1b365d]">ClaseIAXpress</p>
												<p className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
													<span className="h-2 w-2 rounded-full bg-emerald-500" />
													Asistente IA Activo
												</p>
											</div>
										</div>
										<span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
											Word + PDF
										</span>
									</div>

									{/* Lista de herramientas reales de la App */}
									<div className="space-y-4 p-6">
										<div>
											<p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
												Planificación Curricular
											</p>
											<div className="space-y-2">
												<div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-2.5">
													<span className="flex items-center gap-2.5 text-sm font-semibold text-[#1b365d]">
														<Calendar className="h-4 w-4 text-[#1d7a4a]" />
														Planificador de Clases
													</span>
													<span className="rounded-md border border-emerald-400 bg-white px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
														Popular
													</span>
												</div>
												<div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-2.5">
													<span className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
														<FileText className="h-4 w-4 text-slate-500" />
														Secuencias Didácticas Completas
													</span>
													<span className="text-xs text-slate-400">PRO</span>
												</div>
												<div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-2.5">
													<span className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
														<Calendar className="h-4 w-4 text-slate-500" />
														Planificador Anual y Trimestral
													</span>
													<span className="text-xs text-slate-400">NAP / DCP</span>
												</div>
											</div>
										</div>

										<div>
											<p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
												Evaluación e Inclusión
											</p>
											<div className="space-y-2">
												<div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-2.5">
													<span className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
														<BarChart2 className="h-4 w-4 text-blue-600" />
														Generador de Rúbricas por Capacidades
													</span>
												</div>
												<div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-2.5">
													<span className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
														<CheckSquare className="h-4 w-4 text-indigo-600" />
														Cuestionarios y Exámenes (Tema 1 y 2)
													</span>
												</div>
												<div className="flex items-center justify-between rounded-xl border border-purple-100 bg-purple-50/50 px-4 py-2.5">
													<span className="flex items-center gap-2.5 text-sm font-semibold text-purple-900">
														<HeartHandshake className="h-4 w-4 text-purple-600" />
														Módulo Inclusión (PPI y DUA)
													</span>
													<span className="rounded-md bg-purple-100 px-2 py-0.5 text-[11px] font-semibold text-purple-700">
														Inclusivo
													</span>
												</div>
												<div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-2.5">
													<span className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
														<MessageSquare className="h-4 w-4 text-[#1d7a4a]" />
														ChatBot Pedagógico + Actos Escolares
													</span>
													<span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700">
														IA
													</span>
												</div>
											</div>
										</div>

										<a
											href={APP_URLS.appHome}
											target="_blank"
											rel="noopener noreferrer"
											className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1b365d] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#142847]"
										>
											Entrar a la aplicación ahora
											<ArrowRight className="h-4 w-4" />
										</a>
									</div>
								</div>
							</Reveal>
						</div>
					</div>
				</div>
			</section>

			{/* QUÉ HACE LA APLICACIÓN (8 MÓDULOS DETALLADOS) */}
			<section className="bg-white py-20 md:py-28">
				<div className="mx-auto max-w-7xl px-6">
					<Reveal>
						<div className="mx-auto max-w-3xl text-center">
							<span className="text-sm font-semibold uppercase tracking-wider text-[#1d7a4a]">
								Todo en un solo lugar
							</span>
							<h2
								className="mt-3 text-3xl font-bold leading-tight text-[#1b365d] sm:text-4xl lg:text-5xl"
								style={{ fontFamily: 'var(--font-primary)' }}
							>
								¿Qué podés resolver con ClaseIAXpress?
							</h2>
							<p
								className="mx-auto mt-4 max-w-2xl text-lg text-slate-600"
								style={{ fontFamily: 'var(--font-secondary)' }}
							>
								Herramientas pensadas específicamente para la realidad de las escuelas de Argentina:
								sin vueltas técnicas y listas para descargar en Word o PDF.
							</p>
						</div>
					</Reveal>

					<div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
						{CLASE_IA_MODULES.map((mod, i) => (
							<Reveal key={mod.id} delay={(i % 4) * 0.08}>
								<article className="flex h-full flex-col rounded-2xl border border-slate-100 bg-[#f9fbfc] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#1d7a4a]/25 hover:bg-white hover:shadow-xl hover:shadow-slate-200/60">
									<div className="flex items-center justify-between gap-2">
										<span className="text-xs font-bold uppercase tracking-wider text-[#1d7a4a]">
											{mod.category}
										</span>
										<span className="rounded-full bg-[#1b365d]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#1b365d]">
											{mod.badge}
										</span>
									</div>
									<h3
										className="mt-4 text-lg font-bold leading-snug text-[#1b365d]"
										style={{ fontFamily: 'var(--font-primary)' }}
									>
										{mod.title}
									</h3>
									<p
										className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-600"
										style={{ fontFamily: 'var(--font-secondary)' }}
									>
										{mod.description}
									</p>
								</article>
							</Reveal>
						))}
					</div>
				</div>
			</section>

			{/* CÓMO FUNCIONA EN 3 PASOS */}
			<section className="bg-[#f6f8fa] py-16 md:py-24">
				<div className="mx-auto max-w-6xl px-6">
					<Reveal>
						<div className="mx-auto max-w-3xl text-center">
							<span className="text-sm font-semibold uppercase tracking-wider text-[#1d7a4a]">
								Simple y sin tecnicismos
							</span>
							<h2
								className="mt-3 text-3xl font-bold leading-tight text-[#1b365d] sm:text-4xl"
								style={{ fontFamily: 'var(--font-primary)' }}
							>
								De la idea al documento Word en 3 pasos
							</h2>
						</div>
					</Reveal>

					<div className="mt-12 grid gap-8 md:grid-cols-3">
						{[
							{
								step: '1',
								title: 'Elegí la herramienta y tu curso',
								text: 'Seleccioná si necesitás una clase diaria, secuencia didáctica, rúbrica, examen o adaptación DUA/PPI, e indicá nivel y materia.',
							},
							{
								step: '2',
								title: 'Escribí el tema o saber a trabajar',
								text: 'Contale en una frase qué contenido querés abordar o qué necesita tu grupo de estudiantes. No hace falta saber escribir prompts.',
							},
							{
								step: '3',
								title: 'Descargá en Word (.doc) o PDF',
								text: 'En segundos tenés tu documento estructurado, listo para editar en Word con el membrete de tu escuela o imprimir directo.',
							},
						].map((item, idx) => (
							<Reveal key={item.step} delay={idx * 0.1}>
								<div className="relative flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm">
									<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1d7a4a] text-xl font-bold text-white shadow-md shadow-[#1d7a4a]/25">
										{item.step}
									</div>
									<h3
										className="mt-5 text-xl font-bold text-[#1b365d]"
										style={{ fontFamily: 'var(--font-primary)' }}
									>
										{item.title}
									</h3>
									<p
										className="mt-3 text-base leading-relaxed text-slate-600"
										style={{ fontFamily: 'var(--font-secondary)' }}
									>
										{item.text}
									</p>
								</div>
							</Reveal>
						))}
					</div>
				</div>
			</section>

			{/* SECCIÓN DE PLANES Y PRECIOS CON MERCADO PAGO (IDÉNTICA A LA APP) */}
			<section id="planes-precios" className="scroll-mt-20 bg-white py-20 md:py-28">
				<div className="mx-auto max-w-7xl px-6">
					<Reveal>
						<div className="mx-auto max-w-3xl text-center">
							<h2
								className="text-3xl font-extrabold leading-tight text-[#0f172a] sm:text-4xl lg:text-5xl"
								style={{ fontFamily: 'var(--font-primary)' }}
							>
								Elegí el plan perfecto para vos
							</h2>
							<p
								className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg"
								style={{ fontFamily: 'var(--font-secondary)' }}
							>
								Recuperá hasta 10 horas de tus fines de semana. Pagá de forma 100% segura con tu
								cuenta o tarjetas a través de <strong className="font-bold text-[#0f172a]">Mercado Pago</strong> en pesos argentinos.
							</p>
						</div>
					</Reveal>

					<div className="mt-14 grid items-stretch gap-8 lg:grid-cols-3">
						{CLASE_IA_PLANS.map((plan, idx) => {
							const isPro = plan.id === 'docente-pro';
							const isExpert = plan.id === 'docente-experto';

							return (
								<Reveal key={plan.id} delay={idx * 0.1}>
									<div
										className={`relative flex h-full flex-col rounded-3xl bg-white p-8 transition-all duration-300 ${
											isPro
												? 'border-2 border-[#0b5cab] shadow-2xl shadow-blue-900/10 lg:-translate-y-2'
												: 'border border-slate-200 shadow-sm hover:shadow-lg'
										}`}
									>
										{/* Etiqueta flotante superior "EL MÁS ELEGIDO" */}
										{plan.topRibbon && (
											<div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-indigo-600 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md">
												{plan.topRibbon}
											</div>
										)}

										{/* Badge del Plan */}
										<div>
											<span
												className={`inline-block rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-wider ${
													isPro
														? 'bg-blue-100 text-blue-700'
														: isExpert
															? 'bg-purple-100 text-purple-700'
															: 'bg-emerald-100 text-emerald-800'
												}`}
											>
												{plan.badge}
											</span>
										</div>

										<h3
											className="mt-4 text-2xl font-bold text-slate-900"
											style={{ fontFamily: 'var(--font-primary)' }}
										>
											{plan.name}
										</h3>
										<p className="mt-2 min-h-[40px] text-sm leading-relaxed text-slate-500">
											{plan.subtitle}
										</p>

										{/* Precio */}
										<div className="mt-6 flex items-baseline gap-1 border-b border-slate-100 pb-6">
											<span
												className={`text-4xl font-extrabold sm:text-5xl ${
													isPro
														? 'text-blue-600'
														: isExpert
															? 'text-purple-700'
															: 'text-slate-900'
												}`}
												style={{ fontFamily: 'var(--font-primary)' }}
											>
												{plan.price}
											</span>
											<span className="text-sm font-medium text-slate-500">{plan.period}</span>
										</div>

										{/* Lista de beneficios */}
										<div className="mt-6 flex-1">
											<p
												className={`text-xs font-bold uppercase tracking-wider ${
													isPro
														? 'text-blue-600'
														: isExpert
															? 'text-purple-700'
															: 'text-slate-400'
												}`}
											>
												{plan.featuresTitle}
											</p>
											<ul className="mt-4 space-y-3.5">
												{plan.features.map((f) => (
													<li key={f.text} className="flex items-start gap-3 text-sm">
														{f.included ? (
															<Check
																className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
																	isPro
																		? 'text-blue-600'
																		: isExpert
																			? 'text-purple-600'
																			: 'text-emerald-600'
																}`}
															/>
														) : (
															<X className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
														)}
														<span
															className={
																!f.included
																	? 'text-slate-400'
																	: f.bold
																		? 'font-semibold text-slate-800'
																		: 'text-slate-600'
															}
														>
															{f.text}
														</span>
													</li>
												))}
											</ul>
										</div>

										{/* Botón CTA */}
										<a
											href={plan.ctaUrl}
											target="_blank"
											rel="noopener noreferrer"
											className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-center text-sm font-bold transition-all duration-200 ${
												isPro
													? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700'
													: isExpert
														? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25 hover:bg-purple-700'
														: 'border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
											}`}
										>
											{plan.ctaText}
										</a>
									</div>
								</Reveal>
							);
						})}
					</div>

					{/* Bloque para Escuelas e Instituciones */}
					<Reveal delay={0.2}>
						<div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-3xl border border-slate-200 bg-[#f8fafc] p-8 sm:flex-row">
							<div className="flex items-start gap-4">
								<div className="hidden h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#1b365d]/10 text-[#1b365d] sm:flex">
									<Building2 className="h-6 w-6" />
								</div>
								<div>
									<h3
										className="text-lg font-bold text-[#1b365d]"
										style={{ fontFamily: 'var(--font-primary)' }}
									>
										¿Sos directivo o querés llevar ClaseIAXpress a toda tu escuela?
									</h3>
									<p className="mt-1 text-sm text-slate-600">
										Armamos packs institucionales con capacitación práctica incluida para todo el equipo docente.
									</p>
								</div>
							</div>
							<a
								href="https://wa.me/5492622662596?text=Hola%20M%C3%B3nica%2C%20quiero%20consultar%20por%20ClaseIAXpress%20para%20los%20docentes%20de%20mi%20escuela"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex flex-shrink-0 items-center gap-2 rounded-full bg-[#1b365d] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#142847]"
							>
								Consultar Plan Institucional
								<ArrowRight className="h-4 w-4" />
							</a>
						</div>
					</Reveal>
				</div>
			</section>

			{/* PREGUNTAS FRECUENTES DE LA APP */}
			<section className="bg-[#f6f8fa] py-20">
				<div className="mx-auto max-w-3xl px-6">
					<Reveal>
						<div className="text-center">
							<span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[#1d7a4a]">
								<HelpCircle className="h-4 w-4" />
								Preguntas Frecuentes
							</span>
							<h2
								className="mt-3 text-3xl font-bold leading-tight text-[#1b365d] sm:text-4xl"
								style={{ fontFamily: 'var(--font-primary)' }}
							>
								Todo lo que necesitás saber sobre ClaseIAXpress
							</h2>
						</div>
					</Reveal>

					<div className="mt-10 space-y-4">
						{APP_FAQS.map((faq, i) => (
							<Reveal key={faq.q} delay={i * 0.06}>
								<details className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm [&_summary]:cursor-pointer">
									<summary
										className="flex items-center justify-between text-base font-semibold text-[#1b365d]"
										style={{ fontFamily: 'var(--font-primary)' }}
									>
										{faq.q}
										<span className="ml-4 flex-shrink-0 text-[#1d7a4a] transition-transform duration-200 group-open:rotate-45">
											+
										</span>
									</summary>
									<p
										className="mt-3 text-base leading-relaxed text-slate-600"
										style={{ fontFamily: 'var(--font-secondary)' }}
									>
										{faq.a}
									</p>
								</details>
							</Reveal>
						))}
					</div>
				</div>
			</section>

			{/* BARRA PARA RECOMENDAR ENTRE COLEGAS DOCENTES */}
			<TeacherShareBar
				title="ClaseIAXpress: App con IA para Planificaciones, Secuencias y Rúbricas Docentes"
				shareText="¡Mirá esta aplicación para docentes! Te arma las planificaciones, secuencias didácticas, rúbricas y adaptaciones en Word y PDF en minutos:"
				showAppBanner={false}
			/>
		</>
	);
}
