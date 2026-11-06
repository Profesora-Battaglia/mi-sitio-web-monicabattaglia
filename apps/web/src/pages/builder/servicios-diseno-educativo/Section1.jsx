import React from 'react';
import { FileText, Accessibility, Globe, ArrowRight, Check } from 'lucide-react';
import Reveal from '@/components/Reveal';

const services = [
	{
		icon: FileText,
		title: 'Diseño y desarrollo de materiales educativos digitales',
		description:
			'Creo recursos educativos que facilitan la enseñanza y el aprendizaje, adaptados al nivel y las necesidades de tus estudiantes.',
		features: [
			'Fichas, planificaciones y cuadernos digitales',
			'PDFs accesibles y visualmente ordenados',
			'Materiales para clases presenciales y virtuales',
			'Recursos adaptados para diversidad de estudiantes',
		],
		cta: { text: 'Ver materiales', href: '/juego-interactivo-revolucion-de-mayo' },
		ideal: 'Docentes que quieren mejorar sus materiales, instituciones y capacitadores.',
	},
	{
		icon: Accessibility,
		title: 'Asesoría en accesibilidad y diseño inclusivo',
		description:
			'Analizo y mejoro plataformas, materiales y experiencias digitales para que sean accesibles para todos tus estudiantes — con o sin discapacidad.',
		features: [
			'Revisión de contraste, tipografías y estructura visual',
			'Adaptación de materiales para lectura fácil',
			'Diagnóstico y mejora de navegación en plataformas',
			'Informe con recomendaciones priorizadas y accionables',
		],
		cta: { text: '¿Te gustaría que adaptemos algo?', href: 'https://wa.me/5492622662596' },
		ideal: 'Instituciones con campus virtual, equipos de diseño educativo, proyectos WCAG.',
	},
	{
		icon: Globe,
		title: 'Sitios web accesibles para docentes e instituciones',
		description:
			'Desarrollo sitios educativos con foco en claridad, accesibilidad y organización. Pensados para que tus visitantes encuentren lo que necesitan y vuelvan.',
		features: [
			'Sitios institucionales y portafolios docentes',
			'Páginas para cursos, talleres y recursos',
			'Implementación en la plataforma más adecuada',
			'Documentación para que puedas actualizarlo vos mismo/a',
		],
		cta: { text: '¿Necesitás que creemos alguna página?', href: 'mailto:meb@monicabattaglia.com' },
		ideal: 'Docentes independientes, capacitadores, escuelas y proyectos educativos.',
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
								Servicios
							</span>
						</Reveal>
						<Reveal delay={0.1}>
							<h1
								className="mt-6 text-4xl font-bold leading-[1.15] text-[#1b365d] sm:text-5xl lg:text-6xl"
								style={{ fontFamily: 'var(--font-primary)' }}
							>
								Soluciones educativas accesibles para docentes e instituciones
							</h1>
						</Reveal>
						<Reveal delay={0.2}>
							<p
								className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl"
								style={{ fontFamily: 'var(--font-secondary)' }}
							>
								Diseño materiales, doy asesoría en accesibilidad y desarrollo sitios web educativos. Todo
								con foco en claridad, inclusión y resultados concretos.
							</p>
						</Reveal>
					</div>
				</div>
			</section>

			<section className="bg-white py-20 md:py-28">
				<div className="mx-auto max-w-7xl px-6">
					<div className="grid gap-8 lg:grid-cols-3">
						{services.map((s, i) => {
							const isExternal = s.cta.href.startsWith('http') || s.cta.href.startsWith('mailto');
							return (
								<Reveal key={s.title} delay={i * 0.12}>
									<article className="group flex h-full flex-col rounded-2xl border border-slate-100 bg-[#f9fbfc] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#1d7a4a]/20 hover:shadow-xl hover:shadow-slate-200/60">
										<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1d7a4a]/10 text-[#1d7a4a] transition-colors duration-300 group-hover:bg-[#1d7a4a] group-hover:text-white">
											<s.icon className="h-7 w-7" />
										</div>
										<h3
											className="mt-6 text-2xl font-bold leading-snug break-words text-[#1b365d]"
											style={{ fontFamily: 'var(--font-primary)' }}
										>
											{s.title}
										</h3>
										<p
											className="mt-3 text-base leading-relaxed text-slate-600"
											style={{ fontFamily: 'var(--font-secondary)' }}
										>
											{s.description}
										</p>
										<ul className="mt-6 space-y-3">
											{s.features.map((f) => (
												<li key={f} className="flex items-start gap-3 text-sm text-slate-700">
													<Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1d7a4a]" />
													<span>{f}</span>
												</li>
											))}
										</ul>
										<p
											className="mt-6 border-t border-slate-100 pt-4 text-sm text-slate-500"
											style={{ fontFamily: 'var(--font-secondary)' }}
										>
											<strong className="font-semibold text-[#1b365d]">Ideal para:</strong> {s.ideal}
										</p>
										<div className="mt-auto" />
										<a
											href={s.cta.href}
											target={isExternal ? '_blank' : undefined}
											rel={isExternal ? 'nofollow noreferrer' : undefined}
											className="group/btn mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#1d7a4a] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1d7a4a]/25 transition-all duration-200 hover:bg-[#18663f] hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1d7a4a]/30 active:scale-[0.98]"
										>
											{s.cta.text}
											<ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
										</a>
									</article>
								</Reveal>
							);
						})}
					</div>
				</div>
			</section>
		</>
	);
}
