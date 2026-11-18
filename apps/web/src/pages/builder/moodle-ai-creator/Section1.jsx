import React from 'react';
import { GraduationCap, ArrowRight, Check, ExternalLink, Sparkles, Layers, FileCode2, CreditCard, ShieldCheck } from 'lucide-react';
import Reveal from '@/components/Reveal';

const solution = [
	{
		title: '12 Formatos de Actividades y Evaluaciones Configurables',
		text: 'Opción múltiple, verdadero/falso, completar espacios, relacionar columnas, ordenar secuencias, crucigramas, sopa de letras, casos prácticos (ABP), reflexión y gamificación.',
	},
	{
		title: 'Exportación Nativa a Moodle XML, GIFT, SCORM 1.2/2004 y H5P Válido',
		text: 'Descargá bancos de preguntas listos para importar, paquetes SCORM con registro automático de nota y estado en el Libro de Calificaciones, o contenedores .h5p con manifiesto h5p.json y bibliotecas validadas.',
	},
	{
		title: 'Fundamentación Pedagógica con Taxonomía de Bloom y DUA',
		text: 'Cada recurso generado incluye objetivos de aprendizaje, nivel cognitivo de Bloom, criterios de evaluación, retroalimentación formativa para respuestas correctas e incorrectas y pautas de accesibilidad.',
	},
	{
		title: 'Autenticación en Supabase y Suscripciones con Mercado Pago en ARS',
		text: 'Cada docente cuenta con su propio usuario seguro y biblioteca personal en la nube, pudiendo comenzar con el Plan Gratuito ($0 ARS) o suscribirse en Pesos Argentinos mediante Mercado Pago.',
	},
];

const plansArs = [
	{
		name: 'Plan Gratuito',
		price: '$0',
		period: 'ARS / mes',
		badge: 'PRUEBA SIN TARJETA',
		popular: false,
		features: [
			'Hasta 3 actividades o evaluaciones por mes',
			'Acceso a los 12 formatos pedagógicos con IA',
			'Exportación a Moodle XML, GIFT, SCORM y H5P',
			'Simulador interactivo y editor visual',
		],
	},
	{
		name: 'Plan Docente Profesional',
		price: '$25.000',
		period: 'ARS / mes',
		badge: '⭐ EL MÁS ELEGIDO',
		popular: true,
		features: [
			'Hasta 150 actividades y evaluaciones mensuales',
			'Biblioteca Personal completa organizada por asignatura',
			'Exportaciones ilimitadas en Moodle XML, GIFT, SCORM 1.2/2004 y H5P',
			'Pago en Pesos Argentinos con Mercado Pago (Checkout Pro o Suscripción)',
		],
	},
	{
		name: 'Plan Institucional',
		price: '$50.000',
		period: 'ARS / mes',
		badge: 'COLEGIOS Y UNIVERSIDADES',
		popular: false,
		features: [
			'Hasta 1.000 actividades y evaluaciones mensuales',
			'Gestión de usuarios docentes y recursos compartidos',
			'Administración centralizada para equipos directivos y referentes Moodle',
			'Soporte prioritario y pago institucional vía Mercado Pago en ARS',
		],
	},
];

export default function Section1() {
	return (
		<section className="relative overflow-hidden bg-gradient-to-br from-[#e9eff5] via-white to-[#e3f1ea]">
			<div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#74c69d]/20 blur-3xl" />
			<div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 md:py-24">
				<div className="mx-auto max-w-4xl text-center">
					<Reveal>
						<span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-[#1d7a4a] shadow-sm ring-1 ring-[#1d7a4a]/20 backdrop-blur">
							<GraduationCap className="h-4 w-4" />
							Plataforma SaaS EdTech para Docentes e Instituciones con Moodle
						</span>
					</Reveal>
					<Reveal delay={0.1}>
						<h1
							className="mt-6 text-3xl font-bold leading-[1.15] text-[#1b365d] sm:text-5xl"
							style={{ fontFamily: 'var(--font-primary)' }}
						>
							MoodleAI Creator: Actividades Interactivas, SCORM y H5P con IA
						</h1>
					</Reveal>
					<Reveal delay={0.15}>
						<p
							className="mx-auto mt-4 max-w-3xl text-base sm:text-lg leading-relaxed text-slate-600"
							style={{ fontFamily: 'var(--font-secondary)' }}
						>
							Transformá cualquier contenido educativo en actividades digitales atractivas, cuestionarios calificables
							y paquetes listos para importar en Moodle en pocos minutos, con planes en Pesos Argentinos vía Mercado Pago.
						</p>
					</Reveal>
					<Reveal delay={0.2}>
						<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
							<a
								href="#app-moodleai-vivo"
								className="inline-flex items-center gap-2 rounded-full bg-[#1b365d] px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-[#122440]"
							>
								<Sparkles className="h-4 w-4 text-emerald-300" />
								Usar MoodleAI Creator Acá Mismo
							</a>
							<a
								href="/moodle-ai-creator/index.html"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 rounded-full border border-[#1b365d]/20 bg-white px-6 py-3.5 text-sm font-semibold text-[#1b365d] shadow-sm transition hover:bg-slate-50"
							>
								<ExternalLink className="h-4 w-4" />
								Abrir en Pantalla Completa
							</a>
							<a
								href="#planes-ars-mercadopago"
								className="inline-flex items-center gap-2 rounded-full bg-[#009ee3] px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-[#0284c7]"
							>
								<CreditCard className="h-4 w-4" />
								Ver Planes en ARS ($0 / $25.000 / $50.000)
							</a>
						</div>
					</Reveal>
				</div>

				{/* PLATAFORMA INTERACTIVA EMBEBIDA EN VIVO */}
				<div id="app-moodleai-vivo" className="mt-14 scroll-mt-24">
					<Reveal>
						<div className="overflow-hidden rounded-3xl border-2 border-[#1b365d]/15 bg-white shadow-2xl">
							<div className="flex flex-wrap items-center justify-between gap-3 bg-[#1b365d] px-5 py-3.5 text-white">
								<div className="flex items-center gap-2.5">
									<span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
									<span className="text-xs sm:text-sm font-bold tracking-wide">
										MOODLEAI CREATOR EN VIVO — SUPABASE AUTH + PASARELA MERCADO PAGO EN PESOS ARGENTINOS
									</span>
								</div>
								<div className="flex items-center gap-3 text-xs">
									<a
										href="/moodle-ai-creator/index.html"
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-1 rounded-lg bg-white/15 px-3 py-1.5 font-semibold text-white hover:bg-white/25 transition"
									>
										<span>Abrir aplicación en pestaña completa</span>
										<ExternalLink className="h-3.5 w-3.5" />
									</a>
								</div>
							</div>

							<iframe
								src="/moodle-ai-creator/index.html"
								title="Plataforma MoodleAI Creator Interactiva"
								className="w-full h-[960px] border-0 bg-slate-50"
								loading="lazy"
							/>
						</div>
					</Reveal>
				</div>

				{/* SECCIÓN DE PLANES EN PESOS ARGENTINOS CON MERCADO PAGO */}
				<div id="planes-ars-mercadopago" className="mt-16 scroll-mt-24">
					<Reveal>
						<div className="mx-auto max-w-3xl text-center">
							<span className="inline-flex items-center gap-2 rounded-full bg-[#009ee3]/10 px-4 py-1.5 text-xs font-bold text-[#0284c7]">
								<ShieldCheck className="h-4 w-4" />
								VALORES EN PESOS ARGENTINOS · PASARELA MERCADO PAGO
							</span>
							<h2
								className="mt-4 text-2xl font-bold text-[#1b365d] sm:text-4xl"
								style={{ fontFamily: 'var(--font-primary)' }}
							>
								Planes pensados para docentes e instituciones de Argentina
							</h2>
							<p className="mt-3 text-base text-slate-600">
								Comenzá gratis sin tarjeta o suscribite en Pesos Argentinos mediante Mercado Pago (Checkout Pro o Link de Suscripción).
							</p>
						</div>
					</Reveal>

					<div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
						{plansArs.map((plan) => (
							<Reveal key={plan.name}>
								<div
									className={`rounded-3xl p-7 flex flex-col justify-between bg-white shadow-lg border-2 ${
										plan.popular ? 'border-[#009ee3] ring-4 ring-[#009ee3]/10' : 'border-slate-200'
									}`}
								>
									<div>
										<span
											className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
												plan.popular ? 'bg-[#009ee3] text-white' : 'bg-slate-100 text-[#1b365d]'
											}`}
										>
											{plan.badge}
										</span>
										<h3 className="mt-4 text-xl font-bold text-[#1b365d]">{plan.name}</h3>
										<div className="mt-3 flex items-baseline gap-1">
											<span className="text-3xl font-extrabold text-[#1b365d]">{plan.price}</span>
											<span className="text-sm font-semibold text-slate-500">{plan.period}</span>
										</div>
										<ul className="mt-6 space-y-2.5 text-sm text-slate-600">
											{plan.features.map((f) => (
												<li key={f} className="flex items-start gap-2">
													<Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1d7a4a]" />
													<span>{f}</span>
												</li>
											))}
										</ul>
									</div>
									<a
										href="#app-moodleai-vivo"
										className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition ${
											plan.popular
												? 'bg-[#009ee3] text-white hover:bg-[#0284c7]'
												: 'bg-[#1b365d] text-white hover:bg-[#122440]'
										}`}
									>
										{plan.price === '$0' ? 'Empezar Gratis ($0 ARS)' : `Elegir ${plan.name} con MP`}
										<ArrowRight className="h-4 w-4" />
									</a>
								</div>
							</Reveal>
						))}
					</div>
				</div>

				{/* TARJETAS RESUMEN DE CAPACIDADES */}
				<div className="mx-auto mt-14 max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
					<Reveal>
						<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
							<div className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#1b365d]">
								<Layers className="h-4 w-4" />
								Diseño Instruccional y Pedagógico
							</div>
							<h3 className="mt-3 text-lg font-bold text-[#1b365d]" style={{ fontFamily: 'var(--font-primary)' }}>
								Pensado para docentes de todos los niveles
							</h3>
							<ul className="mt-3 space-y-2 text-sm text-slate-600">
								<li className="flex items-start gap-2">
									<Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1d7a4a]" />
									<span>Adaptación automática para Primaria, Secundaria, Universidad y Capacitación.</span>
								</li>
								<li className="flex items-start gap-2">
									<Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1d7a4a]" />
									<span>Aplica Taxonomía de Bloom, Aprendizaje Basado en Problemas (ABP) y Accesibilidad DUA.</span>
								</li>
								<li className="flex items-start gap-2">
									<Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1d7a4a]" />
									<span>Editor visual para ajustar preguntas, opciones, puntajes y retroalimentación formativa.</span>
								</li>
							</ul>
						</div>
					</Reveal>

					<Reveal delay={0.1}>
						<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
							<div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-[#1d7a4a]">
								<FileCode2 className="h-4 w-4" />
								Compatibilidad Técnica con Moodle
							</div>
							<h3 className="mt-3 text-lg font-bold text-[#1b365d]" style={{ fontFamily: 'var(--font-primary)' }}>
								5 formatos de exportación estándar validados
							</h3>
							<ul className="mt-3 space-y-2 text-sm text-slate-600">
								<li className="flex items-start gap-2">
									<Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1d7a4a]" />
									<span><strong>Moodle XML y GIFT:</strong> importación directa al Banco de Preguntas con categorías.</span>
								</li>
								<li className="flex items-start gap-2">
									<Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1d7a4a]" />
									<span><strong>SCORM 1.2 y 2004 (.zip):</strong> con imsmanifest.xml y comunicación API de notas.</span>
								</li>
								<li className="flex items-start gap-2">
									<Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1d7a4a]" />
									<span><strong>Paquetes H5P (.h5p):</strong> con h5p.json, content.json y validación de bibliotecas.</span>
								</li>
							</ul>
						</div>
					</Reveal>
				</div>

				<div className="mx-auto mt-14 max-w-4xl">
					<Reveal>
						<div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50 md:p-12">
							<h2
								className="text-2xl font-bold text-[#1b365d]"
								style={{ fontFamily: 'var(--font-primary)' }}
							>
								¿Qué resuelve MoodleAI Creator?
							</h2>
							<ul className="mt-4 space-y-3">
								{solution.map((item) => (
									<li key={item.title} className="flex items-start gap-3 text-base text-slate-700">
										<Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#1d7a4a]" />
										<span>
											<strong className="font-semibold text-[#1b365d]">{item.title}:</strong> {item.text}
										</span>
									</li>
								))}
							</ul>
						</div>
					</Reveal>
				</div>
			</div>
		</section>
	);
}
