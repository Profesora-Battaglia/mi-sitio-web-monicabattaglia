import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Building2, GraduationCap, ArrowRight, Check } from 'lucide-react';
import Reveal from '@/components/Reveal';

const services = [
	{
		icon: Users,
		tag: 'Para Docentes de Aula · App IA',
		title: 'ClaseIAXpress',
		subtitle: 'Tu Asistente Pedagógico con IA',
		description:
			'Planificaciones didácticas alineadas al currículo oficial (DCP Mendoza y NAP), secuencias didácticas, rúbricas por capacidades, exámenes (Tema 1 y 2 con solucionario) y adaptaciones DUA/PPI. Exportable a Word y PDF en segundos.',
		features: [
			'Planificaciones anuales, trimestrales y diarias',
			'Rúbricas de evaluación por capacidades',
			'Exámenes con solucionario y variantes',
			'Módulo de Inclusión (DUA y PPI)',
		],
		cta: { text: 'Ver Qué Incluye y Probar Gratis', href: '/claseiaxpress' },
		accent: 'emerald',
	},
	{
		icon: Building2,
		tag: 'Para Colegios e Institutos',
		title: 'Digitalización y Automatización',
		subtitle: 'de Procesos Escolares',
		description:
			'Transformación de trámites lentos: sistemas de inscripción online, actas de examen automáticas, formularios inteligentes y asistentes de WhatsApp para responder consultas de familias las 24 horas.',
		features: [
			'Inscripción online a cursado y mesas',
			'Actas de examen automáticas',
			'Formularios inteligentes',
			'Asistente de WhatsApp 24 hs',
		],
		cta: { text: 'Agendar Diagnóstico Gratuito', href: '/contacto-diseno-educativo' },
		accent: 'blue',
	},
	{
		icon: GraduationCap,
		tag: 'Formación y Acompañamiento',
		title: 'Capacitaciones Prácticas',
		subtitle: 'en IA y Accesibilidad Docente',
		description:
			'Talleres 100% prácticos y sin tecnicismos difíciles. Nada de charlas teóricas: enseñamos a usar la IA y la accesibilidad digital aplicadas al aula real del lunes por la mañana.',
		features: [
			'Talleres 100% prácticos en vivo y en Campus',
			'Sin tecnicismos difíciles',
			'IA y accesibilidad WCAG aplicadas al aula',
			'Certificado digital de participación',
		],
		cta: { text: 'Ver Programas en la Academia', href: '/academia' },
		accent: 'indigo',
	},
];

const accentMap = {
	emerald: {
		iconBg: 'bg-[#1d7a4a]/10 text-[#1d7a4a] group-hover:bg-[#1d7a4a] group-hover:text-white',
		badge: 'bg-[#1d7a4a]/10 text-[#1d7a4a]',
		btn: 'bg-[#1d7a4a] hover:bg-[#18663f] shadow-[#1d7a4a]/25',
	},
	blue: {
		iconBg: 'bg-[#1b365d]/10 text-[#1b365d] group-hover:bg-[#1b365d] group-hover:text-white',
		badge: 'bg-[#1b365d]/10 text-[#1b365d]',
		btn: 'bg-[#1b365d] hover:bg-[#15294a] shadow-[#1b365d]/25',
	},
	indigo: {
		iconBg: 'bg-indigo-600/10 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white',
		badge: 'bg-indigo-600/10 text-indigo-600',
		btn: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/25',
	},
};

export default function Section3() {
	return (
		<section className="bg-[#f6f8fa] py-20 md:py-28">
			<div className="mx-auto max-w-7xl px-6">
				<Reveal>
					<div className="mx-auto max-w-3xl text-center">
						<span className="text-sm font-semibold uppercase tracking-wider text-[#1d7a4a]">
							Soluciones Especializadas
						</span>
						<h2
							className="mt-3 text-3xl font-bold leading-tight text-[#1b365d] sm:text-4xl lg:text-5xl"
							style={{ fontFamily: 'var(--font-primary)' }}
						>
							Soluciones a medida para el ecosistema educativo
						</h2>
						<p
							className="mx-auto mt-5 max-w-2xl text-lg text-slate-600"
							style={{ fontFamily: 'var(--font-secondary)' }}
						>
							Desde el aula hasta la gestión institucional: tecnología que ahorra tiempo y mejora resultados.
						</p>
					</div>
				</Reveal>

				<div className="mt-16 grid gap-8 lg:grid-cols-3">
					{services.map((s, i) => {
						const a = accentMap[s.accent];
						return (
							<Reveal key={s.title} delay={i * 0.12}>
								<article className="group flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60">
									<div
										className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-colors duration-300 ${a.iconBg}`}
									>
										<s.icon className="h-7 w-7" />
									</div>
									<p className={`mt-6 inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${a.badge}`}>
										{s.tag}
									</p>
									<h3
										className="mt-3 text-2xl font-bold leading-tight text-[#1b365d]"
										style={{ fontFamily: 'var(--font-primary)' }}
									>
										{s.title}
									</h3>
									<p className="mt-1 text-sm font-medium text-slate-500">{s.subtitle}</p>
									<p
										className="mt-4 text-base leading-relaxed text-slate-600"
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
									<div className="mt-auto" />
									<Link
										to={s.cta.href}
										className={`group/btn mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 active:scale-[0.98] ${a.btn}`}
									>
										{s.cta.text}
										<ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
									</Link>
								</article>
							</Reveal>
						);
					})}
				</div>
			</div>
		</section>
	);
}
