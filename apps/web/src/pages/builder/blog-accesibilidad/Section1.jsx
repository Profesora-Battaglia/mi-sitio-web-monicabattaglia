import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

export default function Section1() {
	return (
		<section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-br from-[#e9eff5] via-white to-[#e3f1ea] py-14 md:py-20">
			<div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#74c69d]/20 blur-3xl" />
			<div className="mx-auto max-w-6xl px-6 text-center">
				<span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-[#1d7a4a] shadow-sm ring-1 ring-[#1d7a4a]/20">
					<BookOpen className="h-3.5 w-3.5" />
					Artículos, Guías y Reflexiones Docentes
				</span>
				<h1
					className="mt-4 text-3xl font-extrabold leading-tight text-[#1b365d] sm:text-5xl"
					style={{ fontFamily: 'var(--font-primary)' }}
				>
					Blog de <span className="text-[#1d7a4a]">Novedades y Recursos</span>
				</h1>
				<p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
					Guías paso a paso sobre accesibilidad educativa, Diseño Universal para el Aprendizaje (DUA), pensamiento
					crítico e implementación práctica de Inteligencia Artificial en el aula.
				</p>
			</div>
		</section>
	);
}
