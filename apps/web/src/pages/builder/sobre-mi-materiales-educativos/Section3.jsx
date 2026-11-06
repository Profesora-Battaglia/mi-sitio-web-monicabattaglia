import React from 'react';
import { Monitor, Accessibility, BookOpen, Layers, Users, Target } from 'lucide-react';
import Reveal from '@/components/Reveal';

const specializations = [
	{ icon: Monitor, title: 'Diseño y desarrollo', text: 'Recursos educativos digitales' },
	{ icon: Accessibility, title: 'Accesibilidad digital', text: 'Aplicada al material educativo' },
	{ icon: BookOpen, title: 'Diseño instruccional', text: 'Estructura pedagógica clara' },
	{ icon: Layers, title: 'Diseño UX/UI', text: 'Para entornos educativos' },
	{ icon: Users, title: 'Formación docente', text: 'Tecnologías y materiales accesibles' },
];

export default function Section3() {
	return (
		<section className="bg-[#f6f8fa] py-20 md:py-28">
			<div className="mx-auto max-w-7xl px-6">
				<Reveal>
					<div className="mx-auto max-w-3xl text-center">
						<span className="text-sm font-semibold uppercase tracking-wider text-[#1d7a4a]">
							Lo que hago hoy
						</span>
						<h2
							className="mt-3 text-3xl font-bold leading-tight text-[#1b365d] sm:text-4xl lg:text-5xl"
							style={{ fontFamily: 'var(--font-primary)' }}
						>
							Mi especialización
						</h2>
					</div>
				</Reveal>
				<div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{specializations.map((s, i) => (
						<Reveal key={s.title} delay={i * 0.08}>
							<div className="group flex h-full items-start gap-4 rounded-2xl border border-slate-100 bg-white p-6 transition-all duration-300 hover:border-[#1d7a4a]/20 hover:shadow-lg hover:shadow-slate-200/60">
								<div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#1d7a4a]/10 text-[#1d7a4a] transition-colors duration-300 group-hover:bg-[#1d7a4a] group-hover:text-white">
									<s.icon className="h-6 w-6" />
								</div>
								<div className="min-w-0 flex-1">
									<h3
										className="font-bold text-[#1b365d] break-words"
										style={{ fontFamily: 'var(--font-primary)', fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', lineHeight: '1.2' }}
									>
										{s.title}
									</h3>
									<p
										className="mt-1 text-sm text-slate-600"
										style={{ fontFamily: 'var(--font-secondary)' }}
									>
										{s.text}
									</p>
								</div>
							</div>
						</Reveal>
					))}
				</div>

				<Reveal>
					<figure className="relative mt-20 overflow-hidden rounded-3xl border border-[#1d7a4a]/15 bg-gradient-to-br from-[#f4f9f6] to-[#eef4f1] p-8 shadow-sm md:p-12 lg:p-14">
						<div className="mx-auto max-w-3xl text-center">
							<Target className="mx-auto h-10 w-10 text-[#1d7a4a]" />
							<h2
								className="mt-6 text-3xl font-bold leading-tight text-[#1b365d] sm:text-4xl"
								style={{ fontFamily: 'var(--font-primary)' }}
							>
								Mi misión
							</h2>
							<blockquote
								className="mt-6 text-lg leading-relaxed text-slate-700 md:text-xl"
								style={{ fontFamily: 'var(--font-secondary)' }}
							>
								"Diseñar para la accesibilidad no es una moda. Es la diferencia entre un recurso que llega
								a uno y un recurso que llega a todos."
							</blockquote>
							<p
								className="mt-6 text-base leading-relaxed text-slate-600"
								style={{ fontFamily: 'var(--font-secondary)' }}
							>
								Creo profundamente que la accesibilidad no es un agregado: es una forma de cuidado. Trabajo
								para que ningún docente se sienta solo frente a la complejidad pedagógica y para que
								ningún estudiante quede atrás por barreras evitables.
							</p>
						</div>
					</figure>
				</Reveal>
			</div>
		</section>
	);
}
