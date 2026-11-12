import React from 'react';
import { ClipboardList, ArrowRight, Check, ExternalLink, Sparkles, Building2, GraduationCap } from 'lucide-react';
import Reveal from '@/components/Reveal';

const solution = [
	{
		title: 'Inscripción Autónoma y Comprobante Inmediato',
		text: 'Los estudiantes eligen carrera, año, condición y materia desde su celular o computadora, con fecha de mesa automática y emisión de comprobante imprimible.',
	},
	{
		title: 'Control de Correlativas (Preceptoría / Bedelía)',
		text: 'Panel administrativo donde Preceptoría o Bedelía verifica quién cumple las correlatividades. Solo los alumnos habilitados pasan automáticamente al Acta Volante.',
	},
	{
		title: 'Actas Volantes Oficiales en Hoja A4',
		text: 'Generación instantánea del Acta Volante con membrete institucional, Libro, Folio, conversión automática de notas a letras, estadísticas y pie de firmas del Tribunal Examinador.',
	},
	{
		title: '100% Adaptable a IES y Universidades',
		text: 'Configurable sin tocar código: soporta carreras de 3 a 6 años, N° de Legajo Universitario, 1° y 2° Llamado, condición Promocional y membrete propio de cada institución.',
	},
];

const features = [
	{
		title: 'Interfaz Intuitiva y Accesible',
		text: 'Diseñada pensando en la facilidad de uso para estudiantes, preceptores, bedeles y docentes de cualquier nivel de alfabetización digital.',
	},
	{
		title: 'Personalización Multi-Institución',
		text: 'Cada instituto superior o facultad configura su propio nombre, jurisdicción, carreras, fechas de examen y cantidad de renglones reglamentarios por acta.',
	},
	{
		title: 'Ahorro Real de Horas Administrativas',
		text: 'Elimina la carga manual duplicada entre planillas y actas en papel, evitando errores de transcripción de DNI, legajos y calificaciones.',
	},
];

export default function Section1() {
	return (
		<section className="relative overflow-hidden bg-gradient-to-br from-[#e9eff5] via-white to-[#e3f1ea]">
			<div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#74c69d]/20 blur-3xl" />
			<div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 md:py-24">
				{/* ENCABEZADO DEL PROYECTO */}
				<div className="mx-auto max-w-4xl text-center">
					<Reveal>
						<span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-[#1d7a4a] shadow-sm ring-1 ring-[#1d7a4a]/20 backdrop-blur">
							<ClipboardList className="h-4 w-4" />
							Solución para Institutos Superiores (IES) y Universidades
						</span>
					</Reveal>
					<Reveal delay={0.1}>
						<h1
							className="mt-6 text-3xl font-bold leading-[1.15] text-[#1b365d] sm:text-5xl"
							style={{ fontFamily: 'var(--font-primary)' }}
						>
							Sistema de Gestión de Mesas de Examen y Actas Volantes Digitales
						</h1>
					</Reveal>
					<Reveal delay={0.15}>
						<p
							className="mx-auto mt-4 max-w-3xl text-base sm:text-lg leading-relaxed text-slate-600"
							style={{ fontFamily: 'var(--font-secondary)' }}
						>
							Digitalizá de punta a punta las inscripciones a exámenes finales, la validación de correlativas en
							Preceptoría o Bedelía y la impresión oficial de Actas Volantes en hoja A4.
						</p>
					</Reveal>
					<Reveal delay={0.2}>
						<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
							<a
								href="#demo-interactiva"
								className="inline-flex items-center gap-2 rounded-full bg-[#1b365d] px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-[#122440]"
							>
								<Sparkles className="h-4 w-4 text-emerald-300" />
								Probar Demo Interactiva en Vivo
							</a>
							<a
								href="/demo-mesas-examenes.html"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 rounded-full border border-[#1b365d]/20 bg-white px-6 py-3.5 text-sm font-semibold text-[#1b365d] shadow-sm transition hover:bg-slate-50"
							>
								<ExternalLink className="h-4 w-4" />
								Abrir Demo en Pantalla Completa
							</a>
							<a
								href="https://wa.me/5492622662596?text=Hola%20M%C3%B3nica%2C%20estoy%20viendo%20el%20Sistema%20de%20Mesas%20de%20Examen%20y%20Actas%20Volantes%20en%20monicabattaglia.com%20y%20quiero%20consultar%20para%20mi%20instituci%C3%B3n."
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 rounded-full bg-[#1d7a4a] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#1d7a4a]/25 transition hover:bg-[#18663f]"
							>
								Solicitar para mi Institución
								<ArrowRight className="h-4 w-4" />
							</a>
						</div>
					</Reveal>
				</div>

				{/* DEMO INTERACTIVA EMBEBIDA EN VIVO */}
				<div id="demo-interactiva" className="mt-14 scroll-mt-24">
					<Reveal>
						<div className="overflow-hidden rounded-3xl border-2 border-[#1b365d]/15 bg-white shadow-2xl">
							<div className="flex flex-wrap items-center justify-between gap-3 bg-[#1b365d] px-5 py-3.5 text-white">
								<div className="flex items-center gap-2.5">
									<span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
									<span className="text-xs sm:text-sm font-bold tracking-wide">
										DEMOSTRACIÓN INTERACTIVA EN VIVO — PROBÁ COMO ALUMNO Y COMO PRECEPTORÍA / BEDELÍA
									</span>
								</div>
								<div className="flex items-center gap-3 text-xs">
									<span className="hidden md:inline text-blue-100">
										Incluye modo <strong>IES</strong> y modo <strong>Universidad</strong>
									</span>
									<a
										href="/demo-mesas-examenes.html"
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-1 rounded-lg bg-white/15 px-3 py-1.5 font-semibold text-white hover:bg-white/25 transition"
									>
										<span>Ampliar pantalla</span>
										<ExternalLink className="h-3.5 w-3.5" />
									</a>
								</div>
							</div>

							<iframe
								src="/demo-mesas-examenes.html"
								title="Demo Interactiva del Sistema de Gestión de Mesas de Exámenes y Actas Volantes"
								className="w-full h-[940px] border-0 bg-slate-50"
								loading="lazy"
							/>
						</div>
					</Reveal>
				</div>

				{/* TARJETAS COMPARATIVAS: IES VS UNIVERSIDAD */}
				<div className="mx-auto mt-14 max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
					<Reveal>
						<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
							<div className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#1b365d]">
								<Building2 className="h-4 w-4" />
								Para Institutos de Educación Superior (IES)
							</div>
							<h3 className="mt-3 text-lg font-bold text-[#1b365d]" style={{ fontFamily: 'var(--font-primary)' }}>
								Adaptado a la normativa de Nivel Superior
							</h3>
							<ul className="mt-3 space-y-2 text-sm text-slate-600">
								<li className="flex items-start gap-2">
									<Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1d7a4a]" />
									<span>Carreras de 3 y 4 años (Tecnicaturas y Profesorados).</span>
								</li>
								<li className="flex items-start gap-2">
									<Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1d7a4a]" />
									<span>Verificación de correlatividades por Preceptoría antes de emitir el acta.</span>
								</li>
								<li className="flex items-start gap-2">
									<Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1d7a4a]" />
									<span>Actas Volantes en A4 con formato tradicional de 25 renglones, Libro y Folio.</span>
								</li>
							</ul>
						</div>
					</Reveal>

					<Reveal delay={0.1}>
						<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
							<div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-[#1d7a4a]">
								<GraduationCap className="h-4 w-4" />
								Para Universidades y Facultades
							</div>
							<h3 className="mt-3 text-lg font-bold text-[#1b365d]" style={{ fontFamily: 'var(--font-primary)' }}>
								Preparado para Gestión Universitaria y Bedelía
							</h3>
							<ul className="mt-3 space-y-2 text-sm text-slate-600">
								<li className="flex items-start gap-2">
									<Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1d7a4a]" />
									<span>Soporte para carreras de hasta 6 años, Cátedras y N° de Legajo / Matrícula.</span>
								</li>
								<li className="flex items-start gap-2">
									<Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1d7a4a]" />
									<span>Opción de 1° y 2° Llamado y condición Promocional / Coloquio, Regular, Libre y Equivalencia.</span>
								</li>
								<li className="flex items-start gap-2">
									<Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1d7a4a]" />
									<span>Membrete personalizable por Facultad, Secretaría Académica o Departamento de Alumnos.</span>
								</li>
							</ul>
						</div>
					</Reveal>
				</div>

				{/* DETALLE DEL CASO DE ESTUDIO */}
				<div className="mx-auto mt-14 max-w-4xl">
					<Reveal>
						<div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50 md:p-12">
							<h2
								className="text-2xl font-bold text-[#1b365d]"
								style={{ fontFamily: 'var(--font-primary)' }}
							>
								El Desafío Institucional
							</h2>
							<p
								className="mt-4 text-base leading-relaxed text-slate-600"
								style={{ fontFamily: 'var(--font-secondary)' }}
							>
								La gestión de inscripciones a exámenes finales, el control de correlatividades y el armado manual de
								actas volantes en institutos superiores y universidades suele generar cuellos de botella, errores de
								transcripción y horas de sobrecarga administrativa. Este sistema digitaliza todo el circuito de forma
								simple, accesible y adaptable a cada institución.
							</p>

							<h2
								className="mt-8 text-2xl font-bold text-[#1b365d]"
								style={{ fontFamily: 'var(--font-primary)' }}
							>
								Solución Desarrollada
							</h2>
							<p
								className="mt-4 text-base leading-relaxed text-slate-600"
								style={{ fontFamily: 'var(--font-secondary)' }}
							>
								Diseñé una plataforma todo-en-uno que resuelve el circuito completo:
							</p>
							<ul className="mt-4 space-y-3">
								{solution.map((item) => (
									<li
										key={item.title}
										className="flex items-start gap-3 text-base text-slate-700"
									>
										<Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#1d7a4a]" />
										<span>
											<strong className="font-semibold text-[#1b365d]">{item.title}:</strong>{' '}
											{item.text}
										</span>
									</li>
								))}
							</ul>

							<h2
								className="mt-8 text-2xl font-bold text-[#1b365d]"
								style={{ fontFamily: 'var(--font-primary)' }}
							>
								Características Destacadas
							</h2>
							<ul className="mt-4 space-y-3">
								{features.map((item) => (
									<li
										key={item.title}
										className="flex items-start gap-3 text-base text-slate-700"
									>
										<Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#1d7a4a]" />
										<span>
											<strong className="font-semibold text-[#1b365d]">{item.title}:</strong>{' '}
											{item.text}
										</span>
									</li>
								))}
							</ul>
						</div>
					</Reveal>
					<Reveal delay={0.1}>
						<div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-center">
							<a
								href="https://wa.me/5492622662596?text=Hola%20M%C3%B3nica%2C%20prob%C3%A9%20la%20Demo%20de%20Mesas%20de%20Examen%20en%20tu%20sitio%20web%20y%20me%20interesa%20implementarla%20en%20nuestra%20instituci%C3%B3n."
								target="_blank"
								rel="noopener noreferrer"
								className="group inline-flex items-center gap-2 rounded-full bg-[#1d7a4a] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#1d7a4a]/25 transition-all duration-200 hover:bg-[#18663f] hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1d7a4a]/30 active:scale-[0.98]"
							>
								Consultar implementación por WhatsApp
								<ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
							</a>
							<a
								href="mailto:meb@monicabattaglia.com"
								className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-4 text-base font-semibold text-[#1b365d] shadow-sm transition hover:bg-slate-50"
							>
								Escribir a meb@monicabattaglia.com
							</a>
						</div>
					</Reveal>
				</div>
			</div>
		</section>
	);
}
