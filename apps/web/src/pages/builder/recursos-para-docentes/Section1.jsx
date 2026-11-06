import React from 'react';
import { Link } from 'react-router-dom';
import { Download, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import Reveal from '@/components/Reveal';

export default function Section1() {
	return (
		<section className="relative overflow-hidden bg-gradient-to-br from-[#e9eff5] via-white to-[#e3f1ea]">
			<div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#74c69d]/20 blur-3xl" />
			<div className="relative mx-auto max-w-7xl px-6 py-16 md:py-24">
				<div className="mx-auto max-w-4xl text-center">
					<Reveal>
						<span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-[#1d7a4a] shadow-sm ring-1 ring-[#1d7a4a]/15 backdrop-blur">
							<Download className="h-4 w-4" />
							Centro de Recursos para Docentes
						</span>
					</Reveal>
					<Reveal delay={0.1}>
						<h1
							className="mt-6 text-4xl font-bold leading-[1.15] text-[#1b365d] sm:text-5xl lg:text-6xl"
							style={{ fontFamily: 'var(--font-primary)' }}
						>
							Recursos gratuitos, herramientas interactivas y formación docente
						</h1>
					</Reveal>
					<Reveal delay={0.2}>
						<p
							className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl"
							style={{ fontFamily: 'var(--font-secondary)' }}
						>
							Descargá checklists y guías gratuitas, usá nuestras aplicaciones interactivas en el aula
							o potenciá tu práctica con <strong className="font-semibold text-[#1b365d]">ClaseIAXpress</strong> y los programas del Campus.
						</p>
					</Reveal>
					<Reveal delay={0.25}>
						<div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-slate-600">
							<span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-4 py-1.5 shadow-sm">
								<CheckCircle2 className="h-4 w-4 text-[#1d7a4a]" />
								Materiales 100% accesibles (WCAG)
							</span>
							<span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-4 py-1.5 shadow-sm">
								<CheckCircle2 className="h-4 w-4 text-[#1d7a4a]" />
								Listos para usar en primaria, secundaria y superior
							</span>
							<Link
								to="/claseiaxpress"
								className="inline-flex items-center gap-1.5 rounded-full bg-[#1b365d] px-4 py-1.5 text-white shadow-sm transition-colors hover:bg-[#142847]"
							>
								<Sparkles className="h-4 w-4 text-[#74c69d]" />
								Conocer App ClaseIAXpress
								<ArrowRight className="h-3.5 w-3.5" />
							</Link>
						</div>
					</Reveal>
				</div>
			</div>
		</section>
	);
}
