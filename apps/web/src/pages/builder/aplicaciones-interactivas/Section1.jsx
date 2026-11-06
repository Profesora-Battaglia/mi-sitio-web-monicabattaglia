import React from 'react';
import { Smartphone, Eye, Heart, Users } from 'lucide-react';
import Reveal from '@/components/Reveal';

const purposes = [
	{
		icon: Eye,
		title: 'Facilitar el Aprendizaje',
		text: 'Creamos entornos visuales e interactivos donde el contenido se asimila de forma natural.',
	},
	{
		icon: Users,
		title: 'Fomentar la Autonomía',
		text: 'Diseñamos experiencias de usuario (UX) intuitivas para que los estudiantes se conviertan en los protagonistas de su progreso.',
	},
	{
		icon: Heart,
		title: 'Empoderar a los Docentes',
		text: 'Ofrecemos herramientas claras, estructuradas y 100% accesibles que se integran sin fricciones en el día a día escolar.',
	},
];

export default function Section1() {
	return (
		<section className="relative overflow-hidden bg-gradient-to-br from-[#e9eff5] via-white to-[#e3f1ea]">
			<div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#74c69d]/20 blur-3xl" />
			<div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
				<div className="mx-auto max-w-4xl text-center">
					<Reveal>
						<span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-[#1d7a4a] shadow-sm ring-1 ring-[#1d7a4a]/15 backdrop-blur">
							<Smartphone className="h-4 w-4" />
							Innovación Pedagógica Digital
						</span>
					</Reveal>
					<Reveal delay={0.1}>
						<h1
							className="mt-6 text-4xl font-bold leading-[1.15] text-[#1b365d] sm:text-5xl lg:text-6xl"
							style={{ fontFamily: 'var(--font-primary)' }}
						>
							Aplicaciones interactivas para el aprendizaje
						</h1>
					</Reveal>
					<Reveal delay={0.2}>
						<p
							className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl"
							style={{ fontFamily: 'var(--font-secondary)' }}
						>
							Desarrollo aplicaciones y recursos tecnológicos con un triple propósito: facilitar el
							aprendizaje, fomentar la autonomía y empoderar a los docentes.
						</p>
					</Reveal>
				</div>
				<div className="mt-16 grid gap-8 md:grid-cols-3">
					{purposes.map((p, i) => (
						<Reveal key={p.title} delay={i * 0.12}>
							<article className="group h-full rounded-2xl border border-slate-100 bg-white p-8 transition-all duration-300 hover:border-[#1d7a4a]/20 hover:shadow-lg hover:shadow-slate-200/60">
								<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1d7a4a]/10 text-[#1d7a4a] transition-colors duration-300 group-hover:bg-[#1d7a4a] group-hover:text-white">
									<p.icon className="h-6 w-6" />
								</div>
								<h3
									className="mt-6 text-xl font-bold text-[#1b365d]"
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
