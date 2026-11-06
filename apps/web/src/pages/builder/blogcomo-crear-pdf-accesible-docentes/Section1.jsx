import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, ArrowLeft, Printer, CheckCircle2 } from 'lucide-react';

export default function Section1() {
	return (
		<section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-br from-[#e9eff5] via-white to-[#e3f1ea] pt-10 pb-14 md:py-16">
			<div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#74c69d]/20 blur-3xl" />
			<div className="mx-auto max-w-6xl px-6">
				<div className="mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
					<Link
						to="/recursos-para-docentes"
						className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#1b365d] shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-[#1d7a4a]"
					>
						<ArrowLeft className="h-4 w-4" />
						Volver a Recursos para Docentes
					</Link>
					<div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
						<span className="inline-flex items-center gap-1.5 rounded-full bg-[#1d7a4a]/10 px-3.5 py-1.5 text-[#1d7a4a]">
							<FileText className="h-3.5 w-3.5" />
							Tutorial Paso a Paso · Word y Google Docs
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
							Cómo crear PDFs accesibles para tus estudiantes: guía paso a paso
						</h1>
						<p className="mt-5 text-lg leading-relaxed text-slate-600">
							El PDF es el formato más usado en educación, pero muchas veces los lectores de pantalla o celulares no
							pueden interpretarlo. Aprendé a exportar documentos con{' '}
							<strong className="font-semibold text-[#1b365d]">estructura real y etiquetas</strong> usando las
							herramientas que ya tenés.
						</p>

						<div className="mt-7 flex flex-wrap items-center gap-3 print:hidden">
							<a
								href="#pasos-exportacion"
								className="inline-flex items-center gap-2 rounded-full bg-[#1d7a4a] px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-[#1d7a4a]/20 transition hover:bg-[#166039]"
							>
								<CheckCircle2 className="h-4 w-4" />
								Ver pasos en Word y Google Docs
							</a>
							<button
								type="button"
								onClick={() => window.print()}
								className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-[#1b365d] shadow-sm transition hover:bg-slate-50"
							>
								<Printer className="h-4 w-4" />
								Imprimir Guía
							</button>
						</div>
					</div>

					<div className="lg:col-span-5">
						<div className="overflow-hidden rounded-3xl border border-white bg-white p-3 shadow-xl shadow-slate-200/70">
							<img
								src="https://horizons-cdn.hostinger.com/8899df02-63ad-48bb-b79f-af29dfcdaf65/gemini_generated_image_dfvnp3dfvnp3dfvn-convertido-de-png-qMYAJLz9IfAdHGAK.webp?width=768&fit=crop"
								alt="Estudiantes utilizando materiales digitales y PDFs accesibles en el aula"
								className="h-64 w-full rounded-2xl object-cover sm:h-72"
								loading="eager"
							/>
							<div className="mt-3 flex items-center justify-between px-2 py-1 text-xs text-slate-500">
								<span className="font-semibold text-[#1b365d]">Guía Práctica Docente</span>
								<span>Accesibilidad Digital & DUA</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
