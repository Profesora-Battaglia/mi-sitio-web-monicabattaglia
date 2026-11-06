import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
	BookOpen,
	KeyRound,
	Eye,
	EyeOff,
	Users,
	Award,
	Volume2,
	ArrowLeft,
	CheckCircle2
} from 'lucide-react';
import TeacherShareBar from '@/components/TeacherShareBar';

const SOLUTIONS = [
	{
		room: 'Sala 1 · La Jabonería Secreta',
		area: 'Lengua (Clases de palabras)',
		task: 'Clasificar PUEBLO (Sustantivo), VALIENTES (Adjetivo), REUNIR (Verbo) y REVOLUCIÓN (Sustantivo).',
		code: 'SAVS',
		explanation: 'Corresponde a las iniciales de cada clase de palabra en orden (Sustantivo - Adjetivo - Verbo - Sustantivo).'
	},
	{
		room: 'Sala 2 · Las Escarapelas de French y Beruti',
		area: 'Matemática (Fracciones de una cantidad)',
		task: 'Un cofre tiene 150 escarapelas. Se reparten 1/5 a los Patricios y 2/3 a los vecinos. ¿Cuántas quedan?',
		code: '20',
		explanation: '1/5 de 150 = 30 escarapelas. 2/3 de 150 = 100 escarapelas. Total repartido: 30 + 100 = 130. Resto en el cofre: 150 - 130 = 20.'
	},
	{
		room: 'Sala 3 · La Imprenta de Don Hipólito',
		area: 'Lengua (Sintaxis, Oraciones y Vocabulario)',
		task: 'Responder 4 preguntas sobre sujeto, actitud del hablante, antónimos y verbos en infinitivo.',
		code: 'PATR',
		explanation: '1) Sujeto: "Los criollos de Buenos Aires" (P) · 2) "¡Viva la Patria!": Exclamativa (A) · 3) Antónimo de Opresión: Libertad (T) · 4) Infinitivo: Jurar (R).'
	},
	{
		room: 'Sala 4 · El Cerrojo del Cabildo',
		area: 'Matemática (Cuadrado Mágico 3x3)',
		task: 'Deducir el número oculto detrás del paraguas (🌂) sabiendo que filas, columnas y diagonales suman 15.',
		code: '2',
		explanation: 'Última fila: 4 + 9 + 🌂 = 15 (13 + 2 = 15). Última columna: 6 + 7 + 🌂 = 15 (13 + 2 = 15). Diagonal: 8 + 5 + 🌂 = 15.'
	}
];

export default function Section2() {
	const [showSolutions, setShowSolutions] = useState(false);

	return (
		<section id="guia-docente" className="bg-white py-12 md:py-16 print:hidden">
			<div className="mx-auto max-w-5xl px-6">
				{/* Ficha Didáctica */}
				<div className="rounded-3xl border border-slate-200 bg-[#f8fafc] p-6 shadow-sm sm:p-8">
					<div className="flex flex-wrap items-center justify-between gap-4">
						<div className="flex items-center gap-3">
							<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1b365d] text-white">
								<BookOpen className="h-5 w-5" />
							</div>
							<div>
								<span className="text-xs font-bold uppercase tracking-wider text-[#1d7a4a]">
									Orientaciones Didácticas
								</span>
								<h2
									className="text-xl font-extrabold text-[#1b365d] sm:text-2xl"
									style={{ fontFamily: 'var(--font-primary)' }}
								>
									Propuesta Pedagógica para la Semana de Mayo
								</h2>
							</div>
						</div>
					</div>

					<p className="mt-4 text-base leading-relaxed text-slate-700">
						Para celebrar la <strong>Semana de Mayo</strong> de una forma interactiva, lúdica e inclusiva, diseñé
						este Escape Room Digital titulado <strong>"Misión: El Grito de Libertad"</strong>. La propuesta articula
						contenidos de <strong>Lengua</strong> (comprensión, clases de palabras, ortografía y sintaxis) y{' '}
						<strong>Matemática</strong> (operaciones combinadas, fracciones y razonamiento lógico) ambientados en mayo
						de 1810.
					</p>

					<div className="mt-6 grid gap-4 sm:grid-cols-3">
						<div className="rounded-2xl border border-slate-200/80 bg-white p-4">
							<div className="flex items-center gap-2 text-sm font-bold text-[#1b365d]">
								<Users className="h-4 w-4 text-[#1d7a4a]" />
								Trabajo Colaborativo
							</div>
							<p className="mt-1.5 text-xs leading-relaxed text-slate-600">
								Ideal para jugar en parejas o pequeños equipos ("Chasquis") en el aula o proyectarlo en el pizarrón.
							</p>
						</div>

						<div className="rounded-2xl border border-slate-200/80 bg-white p-4">
							<div className="flex items-center gap-2 text-sm font-bold text-[#1b365d]">
								<Volume2 className="h-4 w-4 text-[#1d7a4a]" />
								Pistas sin Frustración
							</div>
							<p className="mt-1.5 text-xs leading-relaxed text-slate-600">
								Incluye pistas pedagógicas paso a paso en cada sala y guardado automático por si cierran la pestaña.
							</p>
						</div>

						<div className="rounded-2xl border border-slate-200/80 bg-white p-4">
							<div className="flex items-center gap-2 text-sm font-bold text-[#1b365d]">
								<Award className="h-4 w-4 text-[#1d7a4a]" />
								Diploma Imprimible
							</div>
							<p className="mt-1.5 text-xs leading-relaxed text-slate-600">
								Al completar las 4 salas, genera un Diploma de Honor personalizado con el nombre del estudiante o equipo.
							</p>
						</div>
					</div>

					{/* Solucionario ocultable para que los alumnos no se spoileen */}
					<div className="mt-8 border-t border-slate-200 pt-6">
						<div className="flex flex-wrap items-center justify-between gap-4">
							<div>
								<h3 className="text-base font-bold text-[#1b365d] sm:text-lg">
									🔑 Estructura de Desafíos y Solucionario para el Docente
								</h3>
								<p className="text-xs text-slate-500 sm:text-sm">
									Las respuestas están ocultas por defecto para que puedas proyectar esta página frente a tus estudiantes.
								</p>
							</div>
							<button
								type="button"
								onClick={() => setShowSolutions((s) => !s)}
								className="inline-flex items-center gap-2 rounded-xl border border-[#1b365d]/20 bg-white px-4 py-2.5 text-xs font-bold text-[#1b365d] shadow-sm transition hover:bg-[#1b365d] hover:text-white sm:text-sm"
							>
								{showSolutions ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
								{showSolutions ? 'Ocultar Solucionario Docente' : 'Mostrar Respuestas para el Docente'}
							</button>
						</div>

						{showSolutions && (
							<div className="mt-6 grid gap-4 md:grid-cols-2">
								{SOLUTIONS.map((sol) => (
									<div
										key={sol.room}
										className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm"
									>
										<div className="flex items-center justify-between gap-2">
											<span className="text-xs font-extrabold uppercase tracking-wide text-[#1d7a4a]">
												{sol.area}
											</span>
											<span className="inline-flex items-center gap-1 rounded-lg bg-[#1b365d] px-2.5 py-1 text-xs font-extrabold text-amber-300">
												<KeyRound className="h-3 w-3" /> Clave: {sol.code}
											</span>
										</div>
										<h4 className="mt-2 text-base font-bold text-[#1b365d]">{sol.room}</h4>
										<p className="mt-1.5 text-xs leading-relaxed text-slate-600">
											<strong>Consigna:</strong> {sol.task}
										</p>
										<div className="mt-3 flex items-start gap-2 rounded-xl bg-emerald-50/70 p-3 text-xs text-emerald-950">
											<CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1d7a4a]" />
											<span>
												<strong>Resolución:</strong> {sol.explanation}
											</span>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				{/* Barra para compartir con colegas */}
				<div className="mt-12">
					<TeacherShareBar
						title="Escape Room Interactivo: La Revolución de Mayo (Lengua y Matemática)"
						urlPath="/juego-interactivo-revolucion-de-mayo"
					/>
				</div>

				<div className="mt-8 text-center">
					<Link
						to="/recursos-para-docentes"
						className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-[#1b365d] shadow-sm transition hover:bg-slate-50"
					>
						<ArrowLeft className="h-4 w-4" />
						Volver a Recursos para Docentes
					</Link>
				</div>
			</div>
		</section>
	);
}
