import React from 'react';
import Reveal from '@/components/Reveal';

export default function Section1() {
	return (
		<section className="relative overflow-hidden bg-gradient-to-br from-[#e9eff5] via-white to-[#e3f1ea]">
			<div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#74c69d]/20 blur-3xl" />
			<div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
				<div className="mx-auto max-w-4xl text-center">
					<Reveal>
						<h1
							className="text-4xl font-bold leading-[1.15] text-[#1b365d] sm:text-5xl lg:text-6xl"
							style={{ fontFamily: 'var(--font-primary)' }}
						>
							Contacto Institucional
						</h1>
					</Reveal>
					<Reveal delay={0.1}>
						<p
							className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl"
							style={{ fontFamily: 'var(--font-secondary)' }}
						>
							¿Necesitás soluciones a medida para tu institución? Contanos qué necesita tu organización y
							te daremos una respuesta certera y una solución en menos de 24 horas.
						</p>
					</Reveal>
				</div>
			</div>
		</section>
	);
}
