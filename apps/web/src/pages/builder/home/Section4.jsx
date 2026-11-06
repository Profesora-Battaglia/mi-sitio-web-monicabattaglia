import React from 'react';
import { Quote, Star } from 'lucide-react';
import Reveal from '@/components/Reveal';

const metrics = [
	{ value: '10+', label: 'horas ahorradas por semana' },
	{ value: '25+', label: 'años de experiencia docente' },
	{ value: '100%', label: 'materiales accesibles WCAG' },
	{ value: '24hs', label: 'respuesta a consultas' },
];

const testimonials = [
	{
		quote:
			'Digitalizó la inscripción a cursado y mesas de exámenes: los estudiantes se inscriben desde cualquier lugar y las actas se generan automáticamente. Un cambio que ahorró horas de trabajo administrativo y mejoró la experiencia de toda la comunidad.',
		name: 'Rubén Ippolitti',
		role: 'ex Rector del IES 9-009 Tupungato',
	},
	{
		quote:
			'Los materiales que diseñó Mónica son increíblemente claros. Mis estudiantes entienden las consignas sin necesidad de explicaciones adicionales y yo ahorro tiempo en clase.',
		name: 'Prof. Sara Ojeda',
		role: 'Docente de Nivel Primaria, Escuela Especial',
	},
	{
		quote:
			'Moni es dispuesta, responsable y generosa con su saber. Tiene muy claro el sentido del trabajo en equipo, una gran visión de futuro y se capacita permanentemente para dar más y mejor. Trabajar con ella siempre es un placer.',
		name: 'Jésica Santoni',
		role: 'Directora del Secundario PS-074 Compañía de María',
	},
	{
		quote:
			'Excelente compañera de trabajo, muy activa y eficiente. Es muy práctica y resolutiva: implementó un sistema de inscripción a mesas de examen que agilizó mucho el trabajo administrativo.',
		name: 'Belén Giuliani',
		role: 'Bibliotecaria, IES 9009',
	},
];

const featuredTestimonial = {
	paragraphs: [
		'Excelente desempeño, super responsable y comprometida con su rol; ejerce un liderazgo positivo en todo orden. Demuestra una gran capacidad resolutiva, disponibilidad y flexibilidad ante todos los desafíos que se le plantean o presentan, principalmente al animar y acompañar a sus colegas en la implementación de las TIC y en la adopción de los avances tecnológicos en este ámbito educativo.',
		'Así mismo, se destaca su perfil ejecutivo en lo referido al mantenimiento técnico del equipamiento en la sala de informática, evidenciando una gran visión estratégica ante la propuesta de organizar otros espacios tecnológicos (tales como la apertura de un nuevo aula para netbooks, así como la restauración y puesta en marcha de netbooks y notebooks en desuso).',
		'Por todo lo expuesto, su gestión como Referente Coordinadora Institucional de TIC resulta clave y de un valor invaluable para el crecimiento digital y pedagógico de nuestra institución.',
	],
	role: 'Dirección General',
	name: 'Prof. Sonia Patricia Silva',
	institution: 'Colegio Compañía de María - Tupungato',
};

export default function Section4() {
	return (
		<section className="bg-white py-20 md:py-28">
			<div className="mx-auto max-w-7xl px-6">
				{/* Metrics band */}
				<Reveal>
					<div className="grid grid-cols-2 gap-6 rounded-3xl bg-gradient-to-br from-[#1b365d] to-[#24344c] p-8 md:grid-cols-4 md:p-12">
						{metrics.map((m) => (
							<div key={m.label} className="text-center">
								<p
									className="text-3xl font-bold text-[#74c69d] sm:text-4xl lg:text-5xl"
									style={{ fontFamily: 'var(--font-primary)' }}
								>
									{m.value}
								</p>
								<p className="mt-2 text-xs leading-snug text-slate-300 sm:text-sm">{m.label}</p>
							</div>
						))}
					</div>
				</Reveal>

				{/* Featured testimonial */}
				<Reveal>
					<figure className="relative mt-16 overflow-hidden rounded-3xl border border-[#1d7a4a]/15 bg-gradient-to-br from-[#f4f9f6] to-[#eef4f1] p-8 shadow-sm md:mt-20 md:p-12 lg:p-14">
						<Quote className="pointer-events-none absolute -right-4 -top-4 h-32 w-32 text-[#1d7a4a]/10 md:h-44 md:w-44" />
						<div className="relative">
							<div className="flex items-center gap-3">
								<span className="inline-flex items-center gap-1.5 rounded-full bg-[#1d7a4a]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1d7a4a]">
									<Star className="h-3.5 w-3.5 fill-[#1d7a4a]" />
									Testimonio destacado
								</span>
							</div>
							<Quote className="h-9 w-9 flex-shrink-0 text-[#1d7a4a]/50" />
							<div
								className="mt-4 space-y-4 text-base leading-relaxed text-slate-700 md:text-lg md:leading-relaxed"
								style={{ fontFamily: 'var(--font-secondary)', fontSize: '16px', lineHeight: 'normal' }}
							>
								{featuredTestimonial.paragraphs.map((p, i) => (
									<p key={i}>{p}</p>
								))}
							</div>
							<figcaption className="mt-8 border-t border-[#1d7a4a]/15 pt-5">
								<p
									className="text-sm font-semibold uppercase tracking-wide text-[#1d7a4a]"
									style={{ fontFamily: 'var(--font-primary)' }}
								>
									{featuredTestimonial.role}
								</p>
								<p
									className="mt-1 text-lg font-bold text-[#1b365d]"
									style={{ fontFamily: 'var(--font-primary)' }}
								>
									{featuredTestimonial.name}
								</p>
								<p className="text-sm text-slate-500">{featuredTestimonial.institution}</p>
							</figcaption>
						</div>
					</figure>
				</Reveal>

				<Reveal>
					<div className="mx-auto mt-20 max-w-3xl text-center">
						<div className="flex items-center justify-center gap-1">
							{[...Array(5)].map((_, i) => (
								<Star key={i} className="h-5 w-5 fill-[#fbc02d] text-[#fbc02d]" />
							))}
						</div>
						<h2
							className="mt-4 text-3xl font-bold leading-tight text-[#1b365d] sm:text-4xl"
							style={{ fontFamily: 'var(--font-primary)' }}
						>
							Lo que dicen quienes ya transformaron sus materiales
						</h2>
						<p className="mt-4 text-lg text-slate-600" style={{ fontFamily: 'var(--font-secondary)' }}>
							Resultados reales cuando el diseño pedagógico y la accesibilidad trabajan juntos.
						</p>
					</div>
				</Reveal>

				<div className="mt-14 grid gap-6 md:grid-cols-2">
					{testimonials.map((t, i) => (
						<Reveal key={t.name} delay={(i % 2) * 0.1}>
							<figure className="flex h-full flex-col rounded-2xl border border-slate-100 bg-[#f9fbfc] p-8 transition-all duration-300 hover:border-[#1d7a4a]/20 hover:shadow-lg hover:shadow-slate-200/60">
								<Quote className="h-8 w-8 flex-shrink-0 text-[#1d7a4a]/30" />
								<blockquote
									className="mt-4 flex-1 text-base leading-relaxed text-slate-700"
									style={{ fontFamily: 'var(--font-secondary)' }}
								>
									{t.quote}
								</blockquote>
								<figcaption className="mt-6 border-t border-slate-100 pt-4">
									<p className="font-bold text-[#1b365d]" style={{ fontFamily: 'var(--font-primary)' }}>
										{t.name}
									</p>
									<p className="text-sm text-slate-500">{t.role}</p>
								</figcaption>
							</figure>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}
