import React from 'react';
import { Target, Heart, TrendingUp } from 'lucide-react';
import Reveal from '@/components/Reveal';

const pillars = [
	{
		icon: Target,
		eyebrow: 'Por qué lo hago',
		title: 'Claridad como acto de cuidado',
		text: 'En un mundo saturado de información, la claridad es un acto de cuidado. Mi misión es que ningún docente se sienta solo frente a la complejidad pedagógica y que ningún estudiante quede atrás por barreras evitables.',
	},
	{
		icon: Heart,
		eyebrow: 'Cómo trabajo',
		title: 'Rigor académico + diseño de vanguardia',
		text: 'Combino rigor académico con diseño de vanguardia para asegurar que el aprendizaje no tenga barreras. Transformo materiales tradicionales en experiencias digitales accesibles, navegables y profundamente humanas.',
	},
	{
		icon: TrendingUp,
		eyebrow: 'El impacto',
		title: 'Aprendizaje más autónomo y justo',
		text: 'Cuando un material es accesible, el aprendizaje se vuelve más autónomo, más justo y más significativo para todos. La tecnología al servicio del docente y de la escuela real.',
	},
];

export default function Section2() {
	return (
		<section className="bg-white py-20 md:py-28">
			<div className="mx-auto max-w-7xl px-6">
				<Reveal>
					<div className="mx-auto max-w-3xl text-center">
						<span className="text-sm font-semibold uppercase tracking-wider text-[#1d7a4a]">
							Mi misión
						</span>
						<h2
							className="mt-3 text-3xl font-bold leading-tight text-[#1b365d] sm:text-4xl lg:text-5xl"
							style={{ fontFamily: 'var(--font-primary)' }}
						>
							Diseñar y desarrollar recursos digitales claros, inclusivos y pensados para docentes y estudiantes
						</h2>
					</div>
				</Reveal>

				<div className="mt-16 grid gap-8 md:grid-cols-3">
					{pillars.map((p, i) => (
						<Reveal key={p.title} delay={i * 0.12}>
							<article className="group h-full rounded-2xl border border-slate-100 bg-[#f9fbfc] p-8 transition-all duration-300 hover:border-[#1d7a4a]/20 hover:shadow-lg hover:shadow-slate-200/60">
								<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1d7a4a]/10 text-[#1d7a4a] transition-colors duration-300 group-hover:bg-[#1d7a4a] group-hover:text-white">
									<p.icon className="h-6 w-6" />
								</div>
								<p className="mt-6 text-xs font-semibold uppercase tracking-wider text-[#1d7a4a]">
									{p.eyebrow}
								</p>
								<h3
									className="mt-2 text-2xl font-bold leading-snug text-[#1b365d]"
									style={{ fontFamily: 'var(--font-primary)' }}
								>
									{p.title}
								</h3>
								<p
									className="mt-3 text-base leading-relaxed text-slate-600"
									style={{ fontFamily: 'var(--font-secondary)' }}
								>
									{p.text}
								</p>
							</article>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}
