import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import Reveal from '@/components/Reveal';

export default function Section1() {
	return (
		<section className="relative overflow-hidden bg-gradient-to-br from-[#e9eff5] via-white to-[#e3f1ea]">
			<div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#74c69d]/20 blur-3xl" />
			<div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-[#1b365d]/10 blur-3xl" />
			<div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28 lg:py-32">
				<div className="mx-auto max-w-4xl text-center">
					<Reveal>
						<span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-[#1d7a4a] shadow-sm ring-1 ring-[#1d7a4a]/15 backdrop-blur">
							<Sparkles className="h-4 w-4" />
							Sobre mí
						</span>
					</Reveal>
					<Reveal delay={0.1}>
						<h1
							className="mt-6 text-4xl font-bold leading-[1.15] text-[#1b365d] sm:text-5xl lg:text-6xl"
							style={{ fontFamily: 'var(--font-primary)' }}
						>
							Más de 25 años en el aula, con la mirada puesta en el futuro
						</h1>
					</Reveal>
					<Reveal delay={0.2}>
						<p
							className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl"
							style={{ fontFamily: 'var(--font-secondary)' }}
						>
							Analista de sistemas, educadora y tu socia tecnológica en educación. Pongo la Inteligencia
							Artificial y la tecnología al servicio del docente y de la escuela real.
						</p>
					</Reveal>
					<Reveal delay={0.3}>
						<div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
							<a
								href="https://wa.me/5492622662596?text=Hola%20M%C3%B3nica%20quiero%20conversar"
								target="_blank"
								rel="nofollow noreferrer"
								className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1d7a4a] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#1d7a4a]/25 transition-all duration-200 hover:bg-[#18663f] hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1d7a4a]/30 active:scale-[0.98] sm:w-auto"
							>
								Conversemos por WhatsApp
								<ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
							</a>
						</div>
					</Reveal>
				</div>
			</div>
		</section>
	);
}
