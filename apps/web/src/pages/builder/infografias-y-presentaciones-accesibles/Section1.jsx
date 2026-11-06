import React from 'react';
import { Image as ImageIcon, ArrowLeft } from 'lucide-react';
import Reveal from '@/components/Reveal';

export default function Section1() {
	return (
		<section className="relative overflow-hidden bg-gradient-to-br from-[#e9eff5] via-white to-[#e3f1ea]">
			<div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#74c69d]/20 blur-3xl" />
			<div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
				<div className="mx-auto max-w-4xl text-center">
					<Reveal>
						<span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-[#1d7a4a] shadow-sm ring-1 ring-[#1d7a4a]/15 backdrop-blur">
							<ImageIcon className="h-4 w-4" />
							Infografías y Presentaciones
						</span>
					</Reveal>
					<Reveal delay={0.1}>
						<h1
							className="mt-6 text-4xl font-bold leading-[1.15] text-[#1b365d] sm:text-5xl lg:text-6xl"
							style={{ fontFamily: 'var(--font-primary)' }}
						>
							Modelos de infografías y presentaciones para tus clases
						</h1>
					</Reveal>
					<Reveal delay={0.2}>
						<p
							className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl"
							style={{ fontFamily: 'var(--font-secondary)' }}
						>
							Puedo crear distintas infografías según tus necesidades o temas. En formato horizontal o
							vertical, interactivas o en PDF directamente para impresión.
						</p>
					</Reveal>
				</div>
				<div className="mt-16 grid gap-8 md:grid-cols-2">
					<Reveal>
						<div className="overflow-hidden rounded-3xl shadow-xl shadow-slate-300/50">
							<img
								src="https://horizons-cdn.hostinger.com/8899df02-63ad-48bb-b79f-af29dfcdaf65/chatgpt-image-19-may-2026-09_04_52-p.m.-qC4FAWR9WuXWPqQ5.webp?width=1024&fit=crop"
								alt="Tira cómica educativa sobre la Revolución de Mayo de 1810 en Buenos Aires, Argentina"
								className="w-full object-cover"
								loading="lazy"
							/>
						</div>
					</Reveal>
					<Reveal delay={0.12}>
						<div className="overflow-hidden rounded-3xl shadow-xl shadow-slate-300/50">
							<img
								src="https://horizons-cdn.hostinger.com/8899df02-63ad-48bb-b79f-af29dfcdaf65/cra3nica-de-la-revolucia3n-de-mayo-2-lH8FrnVCHBOyopPX.webp?width=768&fit=crop"
								alt="Infografía educativa sobre la Revolución de Mayo de 1810 mostrando la Primera Junta y los eventos del Cabildo"
								className="h-full w-full object-cover"
								loading="lazy"
							/>
						</div>
					</Reveal>
				</div>
				<div className="mt-12 text-center">
					<Reveal>
						<a
							href="/portfolio-de-proyectos-educativos"
							className="inline-flex items-center gap-2 rounded-full border-2 border-[#1b365d]/15 bg-white px-8 py-4 text-base font-semibold text-[#1b365d] transition-all duration-200 hover:border-[#1b365d]/30 hover:bg-[#1b365d] hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1b365d]/20 active:scale-[0.98]"
						>
							<ArrowLeft className="h-5 w-5" />
							Volver al Portfolio
						</a>
					</Reveal>
				</div>
			</div>
		</section>
	);
}
