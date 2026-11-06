import React from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, Clock, ArrowLeft, Sparkles, Printer, ClipboardCheck } from 'lucide-react';

export default function Section1() {
	const handlePrint = () => {
		window.print();
	};

	return (
		<section className="relative overflow-hidden bg-gradient-to-br from-[#e9eff5] via-white to-[#e3f1ea] pt-10 pb-14 md:py-16 border-b border-slate-200/80">
			<div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#74c69d]/20 blur-3xl" />
			<div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-[#1b365d]/10 blur-3xl" />

			<div className="relative mx-auto max-w-6xl px-6">
				<div className="mb-6 flex flex-wrap items-center justify-between gap-4">
					<Link
						to="/recursos-para-docentes"
						className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#1b365d] shadow-sm ring-1 ring-slate-200/80 transition hover:bg-slate-50 hover:text-[#1d7a4a]"
					>
						<ArrowLeft className="h-4 w-4" />
						Volver a Recursos para Docentes
					</Link>
					<div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
						<span className="inline-flex items-center gap-1.5 rounded-full bg-[#1d7a4a]/10 px-3.5 py-1.5 text-[#1d7a4a]">
							<CheckSquare className="h-3.5 w-3.5" />
							Recurso Gratuito · 20 Puntos Clave
						</span>
						<span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-slate-600 ring-1 ring-slate-200">
							<Clock className="h-3.5 w-3.5 text-[#1b365d]" />
							3 min de lectura
						</span>
					</div>
				</div>

				<div className="grid items-center gap-10 lg:grid-cols-12">
					<div className="lg:col-span-7">
						<h1
							className="text-3xl font-extrabold leading-tight text-[#1b365d] sm:text-4xl lg:text-5xl"
							style={{ fontFamily: 'var(--font-primary)' }}
						>
							Checklist de accesibilidad para materiales educativos digitales
						</h1>
						<p className="mt-5 text-lg leading-relaxed text-slate-600">
							Verificá en pocos minutos si tus guías, presentaciones y PDFs cumplen los{' '}
							<strong className="font-semibold text-[#1b365d]">20 puntos clave de inclusión y lectura clara</strong>.
							Podés marcar cada ítem directamente en esta página, imprimir tu lista o recibir el PDF en tu correo.
						</p>

						<div className="mt-7 flex flex-wrap items-center gap-3 print:hidden">
							<a
								href="#checklist-interactivo"
								className="inline-flex items-center gap-2 rounded-full bg-[#1d7a4a] px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-[#1d7a4a]/20 transition hover:bg-[#166039]"
							>
								<ClipboardCheck className="h-4 w-4" />
								Usar Checklist Interactivo
							</a>
							<button
								type="button"
								onClick={handlePrint}
								className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-[#1b365d] shadow-sm transition hover:border-[#1b365d] hover:bg-slate-50"
							>
								<Printer className="h-4 w-4" />
								Imprimir / Guardar PDF
							</button>
							<Link
								to="/evaluador-de-accesibilidad-de-materiales-didacticos"
								className="inline-flex items-center gap-2 rounded-full bg-[#1b365d]/5 px-5 py-3.5 text-sm font-semibold text-[#1b365d] transition hover:bg-[#1b365d]/10"
							>
								<Sparkles className="h-4 w-4 text-[#1d7a4a]" />
								Ir al Evaluador con Puntaje
							</Link>
						</div>
					</div>

					<div className="lg:col-span-5">
						<div className="overflow-hidden rounded-3xl border border-white bg-white p-3 shadow-xl shadow-slate-200/70">
							<img
								src="https://horizons-cdn.hostinger.com/8899df02-63ad-48bb-b79f-af29dfcdaf65/lista-en-tablet-RRmFiJXVQenqdl6O.webp?width=768&fit=crop"
								alt="Persona sosteniendo una tablet con un recurso educativo dividido en secciones."
								className="h-64 w-full rounded-2xl object-cover sm:h-72"
								loading="eager"
							/>
							<div className="mt-3 flex items-center justify-between px-2 py-1 text-xs text-slate-500">
								<span className="font-semibold text-[#1b365d]">Por Prof. Mónica Battaglia</span>
								<span>Diseño Universal para el Aprendizaje (DUA)</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
