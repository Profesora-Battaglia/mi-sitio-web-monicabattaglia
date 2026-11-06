import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, CheckSquare, Compass, ArrowRight, ExternalLink } from 'lucide-react';
import Reveal from '@/components/Reveal';
import TeacherShareBar from '@/components/TeacherShareBar';

const INTERACTIVE_APPS = [
	{
		badge: 'App Principal con IA · Gratis para probar',
		title: 'ClaseIAXpress — Asistente IA Pedagógico',
		description:
			'Planificá clases, secuencias didácticas, rúbricas analíticas, cuestionarios con solucionario y adaptaciones DUA en menos de 2 minutos.',
		href: '/claseiaxpress',
		externalHref: 'https://app.monicabattaglia.com/',
		cta: 'Ver todo lo que incluye',
		externalCta: 'Abrir App ahora',
		icon: Sparkles,
		accent: 'border-[#1d7a4a]/30 bg-gradient-to-br from-[#e3f1ea] via-white to-[#e9eff5]'
	},
	{
		badge: 'Herramienta Gratuita · Diagnóstico en vivo',
		title: 'Evaluador Interactivo de Accesibilidad',
		description:
			'Auditá tus guías, presentaciones y PDFs en 4 dimensiones clave. Obtené un puntaje en tiempo real, gráfico radar y recomendaciones personalizadas.',
		href: '/evaluador-de-accesibilidad-de-materiales-didacticos',
		cta: 'Abrir Evaluador Interactivo',
		icon: CheckSquare,
		accent: 'border-slate-200 bg-white'
	},
	{
		badge: 'Juego Educativo · Lengua y Matemática',
		title: 'Escape Room: Misión Mayo de 1810',
		description:
			'Aventura gamificada con 4 salas históricas, pistas pedagógicas, sonido colonial y Diploma de Honor imprimible para tus estudiantes.',
		href: '/juego-interactivo-revolucion-de-mayo',
		cta: 'Jugar Escape Room',
		icon: Compass,
		accent: 'border-slate-200 bg-white'
	}
];

export default function Section2() {
	return (
		<section className="bg-[#f8fafc] py-16 md:py-24">
			<div className="mx-auto max-w-7xl px-6">
				{/* Tarjetas de lanzamiento directo a las aplicaciones interactivas */}
				<div className="mb-14">
					<div className="mx-auto max-w-3xl text-center">
						<span className="text-xs font-extrabold uppercase tracking-wider text-[#1d7a4a]">
							Probá nuestras herramientas hoy mismo
						</span>
						<h2
							className="mt-2 text-3xl font-extrabold text-[#1b365d] sm:text-4xl"
							style={{ fontFamily: 'var(--font-primary)' }}
						>
							Catálogo de Aplicaciones Interactivas
						</h2>
						<p className="mt-3 text-base text-slate-600">
							Seleccioná la herramienta que querés utilizar en tu clase o en tu planificación docente:
						</p>
					</div>

					<div className="mt-10 grid gap-6 lg:grid-cols-3">
						{INTERACTIVE_APPS.map((app, idx) => {
							const IconComp = app.icon;
							return (
								<Reveal key={app.title} delay={idx * 0.1}>
									<div
										className={`flex h-full flex-col justify-between rounded-3xl border p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ${app.accent}`}
									>
										<div>
											<div className="flex items-center justify-between gap-2">
												<span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-[#1d7a4a] ring-1 ring-slate-200">
													<IconComp className="h-3.5 w-3.5" />
													{app.badge}
												</span>
											</div>
											<h3
												className="mt-5 text-2xl font-extrabold text-[#1b365d]"
												style={{ fontFamily: 'var(--font-primary)' }}
											>
												{app.title}
											</h3>
											<p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
												{app.description}
											</p>
										</div>

										<div className="mt-7 flex flex-wrap items-center gap-3">
											<Link
												to={app.href}
												className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1b365d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#142947]"
											>
												{app.cta}
												<ArrowRight className="h-4 w-4" />
											</Link>
											{app.externalHref && (
												<a
													href={app.externalHref}
													target="_blank"
													rel="noopener noreferrer"
													className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#1d7a4a] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#155d38]"
												>
													{app.externalCta}
													<ExternalLink className="h-4 w-4" />
												</a>
											)}
										</div>
									</div>
								</Reveal>
							);
						})}
					</div>
				</div>

				{/* Imagen panorámica de dispositivos */}
				<Reveal>
					<div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/60">
						<img
							src="https://horizons-cdn.hostinger.com/8899df02-63ad-48bb-b79f-af29dfcdaf65/gemini_generated_image_wjfuhpwjfuhpwjfu-5lyeqqRu1UZdl5TU.webp?width=1440&fit=crop"
							alt="Muestra de tablet y computadora con módulos, paneles y plataformas educativas interactivas"
							className="max-h-[460px] w-full rounded-2xl object-cover"
							loading="lazy"
						/>
					</div>
				</Reveal>

				<div className="mt-14">
					<TeacherShareBar
						title="Aplicaciones Interactivas para el Aula y Docentes"
						urlPath="/aplicaciones-interactivas"
					/>
				</div>
			</div>
		</section>
	);
}
