import React from 'react';
import { ArrowRight, MessageCircle, Mail } from 'lucide-react';
import Reveal from '@/components/Reveal';

export default function Section4() {
	return (
		<section className="relative overflow-hidden bg-[#24344c] py-20 md:py-28">
			<div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#1d7a4a]/20 blur-3xl" />
			<div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#74c69d]/10 blur-3xl" />
			<div className="relative mx-auto max-w-4xl px-6 text-center">
				<Reveal>
					<h2
						className="text-3xl font-bold leading-tight text-[#74c69d] sm:text-4xl lg:text-5xl"
						style={{ fontFamily: 'var(--font-primary)' }}
					>
						¿Trabajamos juntos?
					</h2>
				</Reveal>
				<Reveal delay={0.1}>
					<p
						className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-200 sm:text-xl"
						style={{ fontFamily: 'var(--font-secondary)' }}
					>
						Si tenés un proyecto educativo, necesitás revisar tus materiales o querés aprender sobre
						accesibilidad, puedo acompañarte desde el diagnóstico hasta la solución.
					</p>
				</Reveal>
				<Reveal delay={0.2}>
					<div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
						<a
							href="https://wa.me/5492622662596"
							target="_blank"
							rel="nofollow noreferrer"
							className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1d7a4a] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-black/20 transition-all duration-200 hover:bg-[#18663f] hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1d7a4a]/40 active:scale-[0.98] sm:w-auto"
						>
							<MessageCircle className="h-5 w-5" />
							Contáctame
							<ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
						</a>
						<a
							href="mailto:meb@monicabattaglia.com"
							className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur transition-all duration-200 hover:border-white/40 hover:bg-white/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/20 active:scale-[0.98] sm:w-auto"
						>
							<Mail className="h-5 w-5" />
							Enviar email
						</a>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
