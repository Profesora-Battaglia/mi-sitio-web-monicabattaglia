import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FolderGit2, Gift } from 'lucide-react';
import Reveal from '@/components/Reveal';
import TeacherShareBar from '@/components/TeacherShareBar';

export default function Section5() {
	return (
		<section className="bg-[#e9eff5] py-20 md:py-28">
			<div className="mx-auto max-w-7xl px-6">
				<div className="grid items-center gap-12 lg:grid-cols-2">
					<Reveal>
						<div>
							<span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#1d7a4a] shadow-sm">
								<FolderGit2 className="h-4 w-4" />
								Portfolio y Recursos Docentes Gratuitos
							</span>
							<h2
								className="mt-6 text-3xl font-bold leading-tight text-[#1b365d] sm:text-4xl lg:text-5xl"
								style={{ fontFamily: 'var(--font-primary)' }}
							>
								Proyectos reales, herramientas gratuitas y materiales para una educación más accesible
							</h2>
							<p
								className="mt-5 text-lg leading-relaxed text-slate-600"
								style={{ fontFamily: 'var(--font-secondary)' }}
							>
								Probá gratis nuestro Evaluador de Accesibilidad, el Escape Room de la Revolución de Mayo
								y descargá guías prácticas para tus clases. Cada proyecto nace de una necesidad real del aula.
							</p>
							<div className="mt-8 flex flex-wrap gap-4">
								<Link
									to="/recursos-para-docentes"
									className="group inline-flex items-center gap-2 rounded-full bg-[#1d7a4a] px-7 py-4 text-base font-semibold text-white shadow-lg shadow-[#1d7a4a]/25 transition-all duration-200 hover:bg-[#18663f] hover:shadow-xl"
								>
									<Gift className="h-5 w-5" />
									Ver Recursos Gratuitos
									<ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
								</Link>
								<Link
									to="/portfolio-de-proyectos-educativos"
									className="inline-flex items-center gap-2 rounded-full border-2 border-[#1b365d]/20 bg-white px-7 py-4 text-base font-semibold text-[#1b365d] transition-all hover:bg-[#1b365d] hover:text-white"
								>
									Explorar Portafolio
								</Link>
							</div>
						</div>
					</Reveal>

					<Reveal delay={0.15}>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							{[
								{
									badge: 'App Gratuita',
									label: 'Evaluador de Materiales Inclusivos',
									desc: 'Auditá en tiempo real la accesibilidad de tus recursos.',
									href: '/evaluador-de-accesibilidad-de-materiales-didacticos',
								},
								{
									badge: 'Juego Áulico Gratis',
									label: 'Escape Room Revolución de Mayo',
									desc: 'Desafíos de Lengua y Matemática con diploma imprimible.',
									href: '/juego-interactivo-revolucion-de-mayo',
								},
								{
									badge: 'Descarga Gratuita',
									label: 'Checklist de 20 Puntos WCAG',
									desc: 'Guía rápida para revisar PDFs y presentaciones.',
									href: '/blogchecklist-accesibilidad-materiales-educativos',
								},
								{
									badge: 'Caso de Éxito IES',
									label: 'Digitalización Institucional',
									desc: 'Inscripciones online a mesas de examen y actas automáticas.',
									href: '/sistema-de-gestion-de-inscripciones-a-mesas-de-examen-y-actas-digitales',
								},
							].map((item, i) => (
								<Link
									key={item.label}
									to={item.href}
									className={`group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#1d7a4a]/30 hover:shadow-lg ${
										i % 2 === 1 ? 'sm:mt-6' : ''
									}`}
								>
									<div>
										<span className="inline-block rounded-full bg-[#1d7a4a]/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#1d7a4a]">
											{item.badge}
										</span>
										<p
											className="mt-3 text-lg font-bold text-[#1b365d] transition-colors group-hover:text-[#1d7a4a]"
											style={{ fontFamily: 'var(--font-primary)' }}
										>
											{item.label}
										</p>
										<p className="mt-1.5 text-xs leading-relaxed text-slate-500">{item.desc}</p>
									</div>
									<span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#1d7a4a]">
										Abrir recurso
										<ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
									</span>
								</Link>
							))}
						</div>
					</Reveal>
				</div>

				<div className="mt-10">
					<TeacherShareBar
						title="Mónica Battaglia | Recursos Docentes Gratuitos y App ClaseIAXpress"
						shareText="¡Mirá esta web para docentes! Tiene recursos gratuitos, evaluador de accesibilidad y la app ClaseIAXpress para planificar en minutos:"
						showAppBanner={false}
					/>
				</div>
			</div>
		</section>
	);
}
