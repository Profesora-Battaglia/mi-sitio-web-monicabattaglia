import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
	Smartphone,
	ShieldCheck,
	Copy,
	Check,
	ArrowLeft,
	MessageCircle,
	Sparkles,
	ClipboardList
} from 'lucide-react';
import TeacherShareBar from '@/components/TeacherShareBar';

const BITACORA_TEXT = `BITÁCORA DE PROCESO CON IA (Pegar al final del trabajo)
1. Herramienta usada (si aplica): 
2. ¿Para qué la usé? (lluvia de ideas / borrador / corrección / explicación): 
3. 2 o 3 prompts o preguntas que le escribí: 
4. ¿Qué corregí, descarté o cambié con mi propio criterio?: 
5. Fuentes verificadas por mi cuenta: 
6. ¿Qué aprendí haciendo este trabajo que antes no sabía?: `;

const EVAL_FORMATS = [
	{
		title: '1. Borradores con mejoras',
		desc: '1° borrador en clase + devolución docente + 2° versión mejorada.'
	},
	{
		title: '2. Oral breve + defensa',
		desc: '3 minutos por estudiante o equipo para explicar por qué tomaron esas decisiones.'
	},
	{
		title: '3. Fuentes obligatorias',
		desc: 'La IA puede orientar, pero las afirmaciones deben sostenerse con la bibliografía de cátedra.'
	},
	{
		title: '4. Examen híbrido',
		desc: 'Una parte sin asistencia en el aula + una segunda parte con IA y bitácora.'
	},
	{
		title: '5. Caza de errores intencionales',
		desc: 'Entregarles una respuesta generada por IA con errores o imprecisiones para que la auditen y corrijan.'
	},
	{
		title: '6. Proyecto con «huella»',
		desc: 'Evaluar el cronograma, los roles del grupo, los registros intermedios y las iteraciones.'
	}
];

export default function Section2() {
	const [copied, setCopied] = useState(false);

	const copyBitacora = () => {
		navigator.clipboard.writeText(BITACORA_TEXT);
		setCopied(true);
		setTimeout(() => setCopied(false), 2500);
	};

	return (
		<section className="bg-[#f8fafc] py-12 md:py-16">
			<div className="mx-auto max-w-5xl px-6">
				{/* Introducción */}
				<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
					<p className="text-base leading-relaxed text-slate-700 sm:text-lg">
						A esta altura no hace falta explicarlo con tecnicismos: <strong className="text-[#1b365d]">la IA ya está en el aula</strong>. Lo notamos cuando aparecen textos «demasiado prolijos», en cómo se aceleraron los resúmenes y en esa sensación de que a veces los chicos <em>entregan</em>, pero no necesariamente <em>aprenden</em>.
					</p>
					<p className="mt-4 text-base leading-relaxed text-slate-700 sm:text-lg">
						Sin embargo, el debate suele trabarse en un falso dilema: <strong>«¿se permite o se prohíbe?»</strong>. En Argentina, la mayoría de chicos y chicas de 9 a 17 años ya conoce estas herramientas y dos de cada tres las usaron con fines escolares. Si en 2026 queremos avanzar bien, el camino es otro:{' '}
						<strong className="text-[#1d7a4a]">
							acuerdos claros + evaluación rediseñada + foco en procesos + accesibilidad y privacidad como piso
						</strong>
						.
					</p>
				</div>

				{/* Puntos 1 y 2 */}
				<div className="mt-8 grid gap-6 md:grid-cols-2">
					<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
						<div className="flex items-center gap-3">
							<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#1b365d]">
								<Smartphone className="h-5 w-5" />
							</span>
							<h2 className="text-lg font-extrabold text-[#1b365d] sm:text-xl">
								1. La escuela vive la IA desde el celular
							</h2>
						</div>
						<p className="mt-3 text-sm leading-relaxed text-slate-600">
							No todos usan IA en las mismas condiciones: en la mayoría de los hogares el dispositivo principal es el{' '}
							<strong>celular</strong> y no la computadora. Muchas tareas (comparar fuentes, editar, formatear) son más
							fáciles en pantallas grandes.
						</p>
						<p className="mt-3 rounded-xl bg-slate-50 p-3.5 text-xs font-semibold text-[#1b365d] ring-1 ring-slate-200">
							📌 Pregunta clave al diseñar actividades: «¿Cómo se ve y se resuelve esta consigna desde un celular?»
						</p>
					</div>

					<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
						<div className="flex items-center gap-3">
							<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#1d7a4a]">
								<ClipboardList className="h-5 w-5" />
							</span>
							<h2 className="text-lg font-extrabold text-[#1b365d] sm:text-xl">
								2. De «cazar IA» a construir un marco de uso
							</h2>
						</div>
						<p className="mt-3 text-sm leading-relaxed text-slate-600">
							Cuando no hay criterios compartidos, los docentes pierden horas intentando «detectar IA» y los
							estudiantes aprenden a esquivar controles en lugar de pensar mejor.
						</p>
						<p className="mt-3 rounded-xl bg-emerald-50/70 p-3.5 text-xs font-semibold text-[#1d7a4a] ring-1 ring-emerald-200">
							💡 «Si el aula se vuelve una comisaría, se rompe el vínculo pedagógico y no ganamos aprendizaje.»
						</p>
					</div>
				</div>

				{/* Punto 3: Semáforo IA */}
				<div id="semaforo-ia" className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
					<h2
						className="text-2xl font-extrabold text-[#1b365d] sm:text-3xl"
						style={{ fontFamily: 'var(--font-primary)' }}
					>
						3. El «Semáforo IA» que sí funciona en la práctica (y baja la ansiedad)
					</h2>
					<p className="mt-2 text-sm text-slate-600 sm:text-base">
						Es simple, visible y operativo. Podés pegarlo como afiche en el aula, en Classroom o en la primera página de
						cada carpeta:
					</p>

					<div className="mt-6 grid gap-5 md:grid-cols-3">
						{/* Verde */}
						<div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/60 p-5">
							<div className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-1 text-xs font-extrabold text-white">
								🟢 VERDE · Permitido
							</div>
							<ul className="mt-4 space-y-2 text-sm font-medium text-emerald-950">
								<li>• Lluvia de ideas inicial</li>
								<li>• Pedir ejemplos cotidianos</li>
								<li>• Practicar con preguntas de autoevaluación</li>
								<li>• Resumir un texto y luego verificarlo</li>
								<li>• Armar un cronograma de estudio</li>
							</ul>
						</div>

						{/* Amarillo */}
						<div className="rounded-2xl border-2 border-amber-200 bg-amber-50/60 p-5">
							<div className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-3 py-1 text-xs font-extrabold text-white">
								🟡 AMARILLO · Con Evidencia
							</div>
							<ul className="mt-4 space-y-2 text-sm font-medium text-amber-950">
								<li>• Borradores de textos e informes</li>
								<li>• Esquemas de proyectos</li>
								<li>• Resoluciones asistidas paso a paso</li>
							</ul>
							<div className="mt-4 rounded-xl bg-white/90 p-3 text-xs font-bold text-amber-900 ring-1 ring-amber-300">
								📌 Condición obligatoria: entregar acompañado de la Bitácora de IA.
							</div>
						</div>

						{/* Rojo */}
						<div className="rounded-2xl border-2 border-rose-200 bg-rose-50/60 p-5">
							<div className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-3 py-1 text-xs font-extrabold text-white">
								🔴 ROJO · No Permitido
							</div>
							<ul className="mt-4 space-y-2 text-sm font-medium text-rose-950">
								<li>• Evaluaciones individuales presenciales sin apoyo</li>
								<li>• Actividades donde se mide redacción propia desde cero</li>
								<li>• Subir datos personales, fotos o informes sensibles a chats abiertos</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Punto 4: Bitácora de IA copiable */}
				<div className="mt-8 rounded-3xl border border-[#1d7a4a]/30 bg-gradient-to-br from-[#e3f1ea] via-white to-[#e9eff5] p-6 shadow-sm sm:p-8">
					<div className="flex flex-wrap items-center justify-between gap-4">
						<div>
							<span className="text-xs font-extrabold uppercase tracking-wider text-[#1d7a4a]">
								Plantilla lista para tus clases
							</span>
							<h2
								className="mt-1 text-xl font-extrabold text-[#1b365d] sm:text-2xl"
								style={{ fontFamily: 'var(--font-primary)' }}
							>
								4. Bitácora de IA (mi antídoto contra el «copié y pegué»)
							</h2>
						</div>
						<button
							type="button"
							onClick={copyBitacora}
							className="inline-flex items-center gap-2 rounded-xl bg-[#1b365d] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#142947] sm:text-sm"
						>
							{copied ? <Check className="h-4 w-4 text-[#74c69d]" /> : <Copy className="h-4 w-4" />}
							{copied ? '¡Plantilla copiada!' : 'Copiar Bitácora para mis alumnos'}
						</button>
					</div>

					<p className="mt-2 text-sm text-slate-600">
						No es burocracia: es evidencia mínima de proceso. Copiá este recuadro para que tus estudiantes lo completen
						al final de sus trabajos:
					</p>

					<div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 font-mono text-xs leading-relaxed text-slate-700 shadow-inner sm:text-sm">
						<ol className="list-decimal space-y-1.5 pl-5">
							<li>
								<strong>Herramienta usada (si aplica):</strong>
							</li>
							<li>
								<strong>¿Para qué la usé?</strong> (idea / borrador / corrección / explicación):
							</li>
							<li>
								<strong>2 o 3 prompts que escribí:</strong>
							</li>
							<li>
								<strong>¿Qué corregí o cambié yo?</strong> (decisiones propias):
							</li>
							<li>
								<strong>Fuentes verificadas</strong> (si corresponde):
							</li>
							<li>
								<strong>¿Qué aprendí que antes no sabía?</strong>
							</li>
						</ol>
					</div>
				</div>

				{/* Punto 5: 6 formatos de evaluación */}
				<div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
					<h2
						className="text-xl font-extrabold text-[#1b365d] sm:text-2xl"
						style={{ fontFamily: 'var(--font-primary)' }}
					>
						5. Evaluar en 2026: 6 formatos que priorizan el pensamiento visible
					</h2>
					<div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{EVAL_FORMATS.map((f) => (
							<div
								key={f.title}
								className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 transition hover:border-[#1d7a4a]/40"
							>
								<h3 className="text-sm font-extrabold text-[#1b365d]">{f.title}</h3>
								<p className="mt-1.5 text-xs leading-relaxed text-slate-600">{f.desc}</p>
							</div>
						))}
					</div>
				</div>

				{/* Punto 6: Privacidad + CTA */}
				<div className="mt-8 grid gap-6 lg:grid-cols-12">
					<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:col-span-7">
						<div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-rose-700">
							<ShieldCheck className="h-4 w-4" />
							6. Privacidad y protección de datos: nuestra línea roja
						</div>
						<p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base">
							En la rutina escolar la tentación de subir listados de alumnos, diagnósticos o informes a un chat
							abierto es grande. <strong>Nuestra regla de oro es nunca cargar datos sensibles ni personales</strong>.
						</p>
						<p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base">
							Tal como recomienda la UNESCO, el uso de IA en educación requiere resguardar la privacidad estudiantil,
							respetar las edades mínimas sugeridas y acompañar siempre con criterio docente.
						</p>
					</div>

					<div className="flex flex-col justify-between rounded-3xl bg-[#1b365d] p-6 text-white shadow-sm sm:p-8 lg:col-span-5">
						<div>
							<span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-[#74c69d]">
								<Sparkles className="h-3.5 w-3.5" />
								IA Pedagógica para Docentes
							</span>
							<h3 className="mt-3 text-xl font-bold text-white">
								¿Querés diseñar clases y rúbricas con IA de forma segura?
							</h3>
							<p className="mt-2 text-sm text-slate-200">
								Probá <strong>ClaseIAXpress</strong> o escribime para organizar un taller de acuerdos institucionales
								en tu escuela.
							</p>
						</div>
						<div className="mt-6 flex flex-col gap-2.5">
							<Link
								to="/claseiaxpress"
								className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#74c69d] px-5 py-3 text-sm font-bold text-[#1b365d] transition hover:bg-[#5bb887]"
							>
								Conocer ClaseIAXpress
							</Link>
							<a
								href="https://wa.me/5492622662596?text=Hola%20M%C3%B3nica,%20le%C3%AD%20tu%20art%C3%ADculo%20sobre%20IA%20en%20el%20aula%202026%20y%20me%20interesa%20hacerte%20una%20consulta."
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-white/20"
							>
								<MessageCircle className="h-4 w-4" />
								Consultar por WhatsApp
							</a>
						</div>
					</div>
				</div>

				<div className="mt-12 print:hidden">
					<TeacherShareBar
						title="IA en el Aula 2026: Semáforo IA, Bitácora de Proceso y Evaluación"
						urlPath="/ia-en-el-aula-2026-acuerdos-evaluacion"
					/>
				</div>

				<div className="mt-8 text-center print:hidden">
					<Link
						to="/blog-accesibilidad"
						className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-[#1b365d] shadow-sm transition hover:bg-slate-50"
					>
						<ArrowLeft className="h-4 w-4" />
						Volver al Blog de Novedades
					</Link>
				</div>
			</div>
		</section>
	);
}
