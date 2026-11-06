import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Smartphone, FileText, Gamepad2, Check } from 'lucide-react';
import Reveal from '@/components/Reveal';

const projects = [
	{
		icon: Building2,
		title: 'Digitalización Institucional',
		description:
			'Transformación completa del sistema de inscripción a cursado y mesas de exámenes mediante formularios digitales y automatización de actas.',
		features: [
			'Formularios inteligentes',
			'Actas listas para imprimir',
			'Eliminación del registro manual',
			'Acceso desde cualquier dispositivo',
		],
		impact: [
			'Ahorro de horas administrativas',
			'Menos errores',
			'Estudiantes más autónomos',
			'Proceso sostenible y escalable',
		],
		cta: { text: 'Ver proyecto', href: '/sistema-de-gestion-de-inscripciones-a-mesas-de-examen-y-actas-digitales' },
		image:
			'https://horizons-cdn.hostinger.com/8899df02-63ad-48bb-b79f-af29dfcdaf65/gemini_generated_image_ctk7ductk7ductk7-convertido-de-png-Rk1mxC9VSBzQvZXf.webp?width=768&fit=crop',
		alt: 'Formulario digital de inscripción académica con opciones de cursado y mesas de examen',
	},
	{
		icon: Smartphone,
		title: 'Apps Educativas',
		description:
			'Aplicaciones diseñadas para facilitar el aprendizaje, mejorar la autonomía de los estudiantes y ofrecer herramientas claras y accesibles para docentes.',
		features: [
			'Interfaces simples y accesibles',
			'Navegación intuitiva',
			'Actividades interactivas',
			'Diseño pedagógico centrado en el usuario',
		],
		impact: [
			'Mayor participación estudiantil',
			'Aprendizaje más dinámico',
			'Reducción de barreras digitales',
			'Recursos reutilizables para docentes',
		],
		cta: { text: 'Ver proyecto', href: '/aplicaciones-interactivas' },
		image:
			'https://horizons-cdn.hostinger.com/8899df02-63ad-48bb-b79f-af29dfcdaf65/gemini_generated_image_ebw73cebw73cebw7-convertido-de-png-vUN5x8yIzASpKOGD.webp?width=768&fit=crop',
		alt: 'Aplicación educativa con interfaz clara y elementos interactivos para estudiantes',
	},
	{
		icon: FileText,
		title: 'Materiales Didácticos Accesibles',
		description:
			'Rediseño de guías, consignas y actividades con criterios de accesibilidad, estructura clara y enfoque pedagógico para mejorar la comprensión y la autonomía.',
		features: [
			'Reescritura de consignas',
			'Diseño accesible (WCAG)',
			'Estructura visual clara',
			'Navegación simple y sin barreras',
		],
		impact: [
			'Menos dudas en clase',
			'Mayor autonomía estudiantil',
			'Mejor comprensión lectora',
			'Inclusión real en el aula',
		],
		cta: { text: 'Ver proyecto', href: '/infografias-y-presentaciones-accesibles' },
		image:
			'https://horizons-cdn.hostinger.com/8899df02-63ad-48bb-b79f-af29dfcdaf65/gemini_generated_image_j7gnt3j7gnt3j7gn-convertido-de-png-fpxIa5eD13lrZeZR.webp?width=768&fit=crop',
		alt: 'Guía didáctica accesible con estructura clara y diseño pedagógico inclusivo',
	},
	{
		icon: Gamepad2,
		title: 'REA y Secuencias Multimedia',
		description:
			'Desarrollo de Recursos Educativos Abiertos y secuencias didácticas interactivas que integran videos, actividades, evaluaciones y diseño accesible.',
		features: [
			'Actividades multimedia interactivas',
			'Videos educativos integrados',
			'Evaluaciones formativas',
			'Navegación accesible y clara',
		],
		impact: [
			'Aprendizaje más dinámico',
			'Mayor participación estudiantil',
			'Contenidos reutilizables',
			'Experiencias inclusivas y de alto impacto',
		],
		cta: { text: 'Ver proyecto', href: '/juego-interactivo-revolucion-de-mayo' },
		image:
			'https://horizons-cdn.hostinger.com/8899df02-63ad-48bb-b79f-af29dfcdaf65/gemini_generated_image_twvozmtwvozmtwvo-convertido-de-png-Mc6gw6ubrF04hHPO.webp?width=768&fit=crop',
		alt: 'Tres estudiantes usando interfaces holográficas educativas en un aula moderna',
	},
];

export default function Section1() {
	return (
		<>
			<section className="relative overflow-hidden bg-gradient-to-br from-[#e9eff5] via-white to-[#e3f1ea]">
				<div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#74c69d]/20 blur-3xl" />
				<div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
					<div className="mx-auto max-w-4xl text-center">
						<Reveal>
							<span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-[#1d7a4a] shadow-sm ring-1 ring-[#1d7a4a]/15 backdrop-blur">
								Portfolio &amp; Recursos
							</span>
						</Reveal>
						<Reveal delay={0.1}>
							<h1
								className="mt-6 text-4xl font-bold leading-[1.15] text-[#1b365d] sm:text-5xl lg:text-6xl"
								style={{ fontFamily: 'var(--font-primary)' }}
							>
								Proyectos reales y materiales diseñados para una educación más clara, accesible y humana
							</h1>
						</Reveal>
						<Reveal delay={0.2}>
							<p
								className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl"
								style={{ fontFamily: 'var(--font-secondary)' }}
							>
								Digitalización institucional, aplicaciones interactivas, materiales didácticos accesibles y
								REA multimedia. Cada proyecto nace de una necesidad real del aula o la institución.
							</p>
						</Reveal>
					</div>
				</div>
			</section>

			<section className="bg-white py-20 md:py-28">
				<div className="mx-auto max-w-7xl px-6">
					<div className="space-y-12">
						{projects.map((p, i) => (
							<Reveal key={p.title} delay={i * 0.08}>
								<article
									className={`group grid items-center gap-8 rounded-3xl border border-slate-100 bg-[#f9fbfc] p-8 transition-all duration-300 hover:border-[#1d7a4a]/20 hover:shadow-xl hover:shadow-slate-200/60 lg:grid-cols-2 lg:p-12 ${i % 2 === 1 ? 'lg:[&>div:first-child]:order-2' : ''}`}
								>
									<div className="relative overflow-hidden rounded-2xl shadow-lg">
										<img
											src={p.image}
											alt={p.alt}
											className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
											loading="lazy"
										/>
									</div>
									<div>
										<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1d7a4a]/10 text-[#1d7a4a]">
											<p.icon className="h-7 w-7" />
										</div>
										<h2
											className="mt-6 text-2xl font-bold text-[#1b365d] sm:text-3xl"
											style={{ fontFamily: 'var(--font-primary)' }}
										>
											{p.title}
										</h2>
										<p
											className="mt-4 text-base leading-relaxed text-slate-600"
											style={{ fontFamily: 'var(--font-secondary)' }}
										>
											{p.description}
										</p>
										<div className="mt-6 grid gap-6 sm:grid-cols-2">
											<div>
												<p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
													Qué incluye
												</p>
												<ul className="mt-3 space-y-2">
													{p.features.map((f) => (
														<li
															key={f}
															className="flex items-start gap-2 text-sm text-slate-700"
														>
															<Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1d7a4a]" />
															<span>{f}</span>
														</li>
													))}
												</ul>
											</div>
											<div>
												<p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
													Impacto
												</p>
												<ul className="mt-3 space-y-2">
													{p.impact.map((f) => (
														<li
															key={f}
															className="flex items-start gap-2 text-sm text-slate-700"
														>
															<Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1b365d]" />
															<span>{f}</span>
														</li>
													))}
												</ul>
											</div>
										</div>
										<Link
											to={p.cta.href}
											className="group/btn mt-8 inline-flex items-center gap-2 rounded-full bg-[#1d7a4a] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1d7a4a]/25 transition-all duration-200 hover:bg-[#18663f] hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1d7a4a]/30 active:scale-[0.98]"
										>
											{p.cta.text}
											<ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
										</Link>
									</div>
								</article>
							</Reveal>
						))}
					</div>
				</div>
			</section>
		</>
	);
}
