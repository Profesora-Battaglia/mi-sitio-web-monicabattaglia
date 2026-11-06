import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Clock, ArrowLeft, Printer } from 'lucide-react';

export default function Section1() {
	return (
		<section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-br from-[#e9eff5] via-white to-[#e3f1ea] pt-10 pb-14 md:py-16">
			<div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#74c69d]/20 blur-3xl" />
			<div className="mx-auto max-w-6xl px-6">
				<div className="mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
					<Link
						to="/blog-accesibilidad"
						className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#1b365d] shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-[#1d7a4a]"
					>
						<ArrowLeft className="h-4 w-4" />
						Volver al Blog de Novedades
					</Link>
					<div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
						<span className="inline-flex items-center gap-1.5 rounded-full bg-[#1d7a4a]/10 px-3.5 py-1.5 text-[#1d7a4a]">
							<Sparkles className="h-3.5 w-3.5" />
							IA en la Escuela · Incluye Semáforo IA y Bitácora
						</span>
						<span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-slate-600 ring-1 ring-slate-200">
							<Clock className="h-3.5 w-3.5 text-[#1b365d]" />
							4 min de lectura
						</span>
					</div>
				</div>

				<div className="grid items-center gap-10 lg:grid-cols-12">
					<div className="lg:col-span-7">
						<h1
							className="text-3xl font-extrabold leading-tight text-[#1b365d] sm:text-4xl lg:text-5xl"
							style={{ fontFamily: 'var(--font-primary)' }}
						>
							IA en el aula en 2026: acuerdos claros y evaluación sin persecución
						</h1>
						<p className="mt-5 text-lg leading-relaxed text-slate-600">
							En 2026 la Inteligencia Artificial ya está en la escuela. Te comparto cómo armar un{' '}
							<strong className="font-semibold text-[#1b365d]">Semáforo IA visible</strong>, implementar una{' '}
							<strong className="font-semibold text-[#1b365d]">Bitácora de Proceso</strong> y evaluar aprendizajes
							auténticos sin volverte policía.
						</p>
						<div className="mt-7 flex flex-wrap items-center gap-3 print:hidden">
							<a
								href="#semaforo-ia"
								className="inline-flex items-center gap-2 rounded-full bg-[#1d7a4a] px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#166039]"
							>
								Ver Semáforo IA y Bitácora
							</a>
							<button
								type="button"
								onClick={() => window.print()}
								className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-[#1b365d] shadow-sm transition hover:bg-slate-50"
							>
								<Printer className="h-4 w-4" />
								Imprimir Artículo
							</button>
						</div>
					</div>

					<div className="lg:col-span-5">
						<div className="overflow-hidden rounded-3xl border border-white bg-white p-3 shadow-xl shadow-slate-200/70">
							<img
								src="https://horizons-cdn.hostinger.com/8899df02-63ad-48bb-b79f-af29dfcdaf65/gemini_generated_image_w5iv1ww5iv1ww5iv-convertido-de-png-BDCPYxEe2gQ7nkoR.webp?width=768&fit=crop"
								alt="Teléfono con ícono de inteligencia artificial en contexto escolar"
								className="h-64 w-full rounded-2xl object-cover sm:h-72"
								loading="eager"
							/>
							<div className="mt-3 flex items-center justify-between px-2 py-1 text-xs text-slate-500">
								<span className="font-semibold text-[#1b365d]">Por Prof. Mónica Battaglia</span>
								<span>Pedagogía + IA Ética</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
