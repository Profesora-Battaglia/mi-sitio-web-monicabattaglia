import React from 'react';
import { ClipboardList, ArrowRight, Check } from 'lucide-react';
import Reveal from '@/components/Reveal';

const solution = [
	{
		title: 'Inscripción Autónoma',
		text: 'Los estudiantes pueden inscribirse a sus mesas de forma digital, evitando trámites presenciales innecesarios.',
	},
	{
		title: 'Automatización de Actas',
		text: 'Generación automática de actas de examen listas para imprimir, con formatos estandarizados y reducción de errores de carga.',
	},
	{
		title: 'Gestión de Datos',
		text: 'Organización eficiente de las mesas por carrera, asignatura y fecha.',
	},
];

const features = [
	{
		title: 'Interfaz Intuitiva',
		text: 'Diseñada pensando en la facilidad de uso para usuarios con distintos niveles de alfabetización digital.',
	},
	{
		title: 'Enfoque en Accesibilidad',
		text: 'Siguiendo mi línea de trabajo en pedagogía inclusiva, el sistema prioriza la claridad visual y la navegación estructurada.',
	},
	{
		title: 'Eficiencia Administrativa',
		text: 'Reducción significativa del tiempo de procesamiento de documentos oficiales.',
	},
];

export default function Section1() {
	return (
		<section className="relative overflow-hidden bg-gradient-to-br from-[#e9eff5] via-white to-[#e3f1ea]">
			<div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#74c69d]/20 blur-3xl" />
			<div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
				<div className="mx-auto max-w-4xl text-center">
					<Reveal>
						<span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-[#1d7a4a] shadow-sm ring-1 ring-[#1d7a4a]/15 backdrop-blur">
							<ClipboardList className="h-4 w-4" />
							Proyecto Destacado
						</span>
					</Reveal>
					<Reveal delay={0.1}>
						<h1
							className="mt-6 text-4xl font-bold leading-[1.15] text-[#1b365d] sm:text-5xl"
							style={{ fontFamily: 'var(--font-primary)' }}
						>
							Sistema de Gestión de Mesas de Examen y Actas Digitales
						</h1>
					</Reveal>
				</div>
				<div className="mx-auto mt-16 max-w-4xl">
					<Reveal>
						<div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50 md:p-12">
							<h2
								className="text-2xl font-bold text-[#1b365d]"
								style={{ fontFamily: 'var(--font-primary)' }}
							>
								El Desafío
							</h2>
							<p
								className="mt-4 text-base leading-relaxed text-slate-600"
								style={{ fontFamily: 'var(--font-secondary)' }}
							>
								La gestión de inscripciones a exámenes finales y la generación de actas de examen en
								instituciones educativas suele ser un proceso manual propenso a errores y demoras. El
								objetivo de este proyecto para el IES fue digitalizar y automatizar este flujo para mejorar
								la experiencia tanto de alumnos como de administrativos.
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
								Diseñé un flujo de trabajo centralizado que permite:
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
						<div className="mt-8 text-center">
							<a
								href="mailto:meb@monicabattaglia.com"
								className="group inline-flex items-center gap-2 rounded-full bg-[#1d7a4a] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#1d7a4a]/25 transition-all duration-200 hover:bg-[#18663f] hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1d7a4a]/30 active:scale-[0.98]"
							>
								¿Necesitás una solución similar para tu institución?
								<ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
							</a>
						</div>
					</Reveal>
				</div>
			</div>
		</section>
	);
}
