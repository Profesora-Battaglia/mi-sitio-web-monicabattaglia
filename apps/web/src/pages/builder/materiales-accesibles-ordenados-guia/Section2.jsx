import React from 'react';
import { Link } from 'react-router-dom';
import {
	CheckCircle2,
	XCircle,
	Compass,
	Eye,
	Layers,
	Type,
	BookOpen,
	FileCheck,
	Target,
	ArrowLeft,
	MessageCircle
} from 'lucide-react';
import TeacherShareBar from '@/components/TeacherShareBar';

const PDF_QUICK_TEN = [
	'Usar estilos reales (títulos, subtítulos, cuerpo).',
	'Listas automáticas (no guiones hechos a mano).',
	'Tablas solo si hacen falta, con encabezados claros.',
	'Enlaces con texto descriptivo (nunca "clic acá").',
	'Imágenes con descripción alternativa si aportan información.',
	'Orden de lectura lógico de arriba hacia abajo.',
	'Exportar o guardar conservando estructura (etiquetas).',
	'Evitar texto dentro de imágenes (o duplicarlo como texto real).',
	'Revisar que el contraste supere el mínimo de 4.5:1.',
	'Probar la lectura desde la pantalla de un celular.'
];

export default function Section2() {
	return (
		<section id="siete-claves" className="bg-[#f8fafc] py-12 md:py-16">
			<div className="mx-auto max-w-5xl px-6">
				{/* Introducción: Muchos problemas de aprendizaje son problemas de diseño */}
				<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
					<h2
						className="text-2xl font-extrabold text-[#1b365d] sm:text-3xl"
						style={{ fontFamily: 'var(--font-primary)' }}
					>
						Cómo hago materiales accesibles y claros (sin «decorar» y sin perder tiempo)
					</h2>
					<p className="mt-4 text-base leading-relaxed text-slate-700">
						Hay algo que aprendí con los años en el aula y acompañando a colegas:{' '}
						<strong className="text-[#1b365d]">
							muchos problemas de comprensión son en realidad problemas de diseño visual
						</strong>
						. No porque el contenido esté mal pensado, sino porque:
					</p>

					<div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{[
							'La consigna principal queda escondida.',
							'La hoja tiene demasiados estímulos y abruma.',
							'La tipografía elegida cansa la vista.',
							'El bajo contraste dificulta seguir el renglón.',
							'El PDF «se ve lindo» pero el lector de voz no puede leerlo.',
							'En el celular hay que hacer zoom horizontal todo el tiempo.'
						].map((item) => (
							<div
								key={item}
								className="flex items-start gap-2.5 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 text-sm text-slate-700"
							>
								<span className="mt-0.5 font-extrabold text-amber-600">•</span>
								<span>{item}</span>
							</div>
						))}
					</div>

					<div className="mt-6 rounded-2xl bg-gradient-to-r from-[#1b365d] to-[#1d7a4a] p-5 text-white">
						<p className="text-sm font-medium sm:text-base">
							💡 <strong>Mi obsesión sana es esta:</strong> Claridad visual + inclusión + usabilidad real. Acá te
							comparto las 7 claves prácticas para que tus materiales se entiendan a la primera.
						</p>
					</div>
				</div>

				{/* Claves 1, 2, 3 y 4 en tarjetas claras */}
				<div className="mt-8 grid gap-6 md:grid-cols-2">
					{/* Clave 1 */}
					<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
						<div className="flex items-center gap-3">
							<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#1b365d]">
								<Compass className="h-5 w-5" />
							</span>
							<h3 className="text-lg font-extrabold text-[#1b365d] sm:text-xl">
								1. La regla de los 10 segundos
							</h3>
						</div>
						<p className="mt-3 text-sm leading-relaxed text-slate-600">
							Antes de empezar, recordá que el objetivo no es «que quede decorado», sino que se entienda. Mi
							pregunta base siempre es:
						</p>
						<blockquote className="mt-4 rounded-2xl border-l-4 border-[#1d7a4a] bg-emerald-50/60 p-4 text-sm font-bold text-[#1b365d]">
							«¿Un estudiante que mira esta hoja entiende en 10 segundos de qué se trata y qué tiene que hacer?»
						</blockquote>
						<p className="mt-3 text-sm text-slate-600">
							Si la respuesta es no, no sigo agregando bordes ni dibujos: <strong>primero ordeno</strong>.
						</p>
					</div>

					{/* Clave 2 */}
					<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
						<div className="flex items-center gap-3">
							<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#1d7a4a]">
								<Eye className="h-5 w-5" />
							</span>
							<h3 className="text-lg font-extrabold text-[#1b365d] sm:text-xl">
								2. Contraste mínimo (4.5:1)
							</h3>
						</div>
						<p className="mt-3 text-sm leading-relaxed text-slate-600">
							El estándar WCAG indica un contraste mínimo de <strong>4.5:1</strong> para texto normal. Si el
							contraste es bajo, cansa la vista, excluye y baja la comprensión lectora.
						</p>
						<div className="mt-4 grid grid-cols-2 gap-3 text-xs">
							<div className="rounded-xl border border-rose-200 bg-rose-50/60 p-3">
								<div className="flex items-center gap-1.5 font-bold text-rose-800">
									<XCircle className="h-4 w-4" /> Evitar:
								</div>
								<ul className="mt-1.5 space-y-1 text-slate-600">
									<li>• Gris claro o amarillo sobre blanco</li>
									<li>• Celeste suave en párrafos largos</li>
									<li>• Fondos con textura detrás del texto</li>
								</ul>
							</div>
							<div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
								<div className="flex items-center gap-1.5 font-bold text-[#1d7a4a]">
									<CheckCircle2 className="h-4 w-4" /> Regla práctica:
								</div>
								<ul className="mt-1.5 space-y-1 text-slate-700">
									<li>• Fondo claro liso + texto oscuro</li>
									<li>• Colores vivos solo para detalles</li>
									<li>• Nunca usar solo color para indicar algo</li>
								</ul>
							</div>
						</div>
					</div>

					{/* Clave 3 */}
					<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
						<div className="flex items-center gap-3">
							<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-900">
								<Layers className="h-5 w-5" />
							</span>
							<h3 className="text-lg font-extrabold text-[#1b365d] sm:text-xl">
								3. Jerarquía visual que guía
							</h3>
						</div>
						<p className="mt-3 text-sm leading-relaxed text-slate-600">
							Cuando el material no tiene jerarquía, el cerebro no sabe por dónde entrar. En una hoja didáctica,
							los encabezados reales organizan el recorrido:
						</p>
						<ul className="mt-4 space-y-2 text-sm text-slate-700">
							<li className="flex items-center gap-2">
								<span className="rounded bg-[#1b365d] px-2 py-0.5 text-xs font-bold text-white">H1</span>
								<span>1 título principal claro (qué tema trabajamos hoy).</span>
							</li>
							<li className="flex items-center gap-2">
								<span className="rounded bg-[#1d7a4a] px-2 py-0.5 text-xs font-bold text-white">H2</span>
								<span>Subtítulos por momento (qué hago primero / después).</span>
							</li>
							<li className="flex items-center gap-2">
								<span className="rounded bg-slate-200 px-2 py-0.5 text-xs font-bold text-slate-800">1, 2, 3</span>
								<span>Listas numeradas para los pasos y espacios en blanco para respirar.</span>
							</li>
						</ul>
					</div>

					{/* Clave 4 */}
					<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
						<div className="flex items-center gap-3">
							<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-900">
								<Type className="h-5 w-5" />
							</span>
							<h3 className="text-lg font-extrabold text-[#1b365d] sm:text-xl">
								4. Tipografía: mi «mínimo viable»
							</h3>
						</div>
						<p className="mt-3 text-sm leading-relaxed text-slate-600">
							No hace falta mezclar cinco fuentes distintas. Mi receta para que el material sea escaneable y no un
							bloque pesado:
						</p>
						<ul className="mt-4 space-y-2 text-sm text-slate-700">
							<li className="flex items-center gap-2">
								<CheckCircle2 className="h-4 w-4 shrink-0 text-[#1d7a4a]" />
								<span>
									<strong>1 sola tipografía sans-serif</strong> legible (Atkinson Hyperlegible, Arial, Calibri o Lexend).
								</span>
							</li>
							<li className="flex items-center gap-2">
								<CheckCircle2 className="h-4 w-4 shrink-0 text-[#1d7a4a]" />
								<span>
									<strong>Tamaño cómodo</strong> (mínimo 12pt en hojas y 18pt en diapositivas).
								</span>
							</li>
							<li className="flex items-center gap-2">
								<CheckCircle2 className="h-4 w-4 shrink-0 text-[#1d7a4a]" />
								<span>
									<strong>Interlineado generoso (1.5)</strong> y <strong>alineación a la izquierda</strong>.
								</span>
							</li>
						</ul>
					</div>
				</div>

				{/* Clave 5: Lectura Fácil */}
				<div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
					<div className="flex items-center gap-3">
						<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-900">
							<BookOpen className="h-5 w-5" />
						</span>
						<h3
							className="text-xl font-extrabold text-[#1b365d] sm:text-2xl"
							style={{ fontFamily: 'var(--font-primary)' }}
						>
							5. Lectura fácil: escribir simple no es infantilizar
						</h3>
					</div>
					<p className="mt-3 text-base leading-relaxed text-slate-700">
						A veces aparece el temor de que <em>«si simplifico la consigna, baja el nivel»</em>. En la práctica
						ocurre exactamente lo opuesto: <strong>simplificar el enunciado sube el nivel de comprensión</strong> y
						libera energía cognitiva para el pensamiento profundo.
					</p>
					<div className="mt-5 grid gap-4 sm:grid-cols-4">
						{[
							{ title: 'Una acción por vez', desc: 'Evitá consignas con 4 preguntas encadenadas en la misma oración.' },
							{ title: 'Verbos directos', desc: 'Empezá con verbos claros en negrita: «Subrayá», «Compará», «Justificá».' },
							{ title: 'Ejemplos breves', desc: 'Incluí un primer renglón resuelto como modelo cuando sea posible.' },
							{ title: 'Párrafos cortos', desc: 'Una idea central por párrafo para no perder el hilo lector.' }
						].map((habit) => (
							<div key={habit.title} className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
								<h4 className="text-sm font-bold text-[#1b365d]">{habit.title}</h4>
								<p className="mt-1.5 text-xs leading-relaxed text-slate-600">{habit.desc}</p>
							</div>
						))}
					</div>
				</div>

				{/* Clave 6 y 7: Decálogo de PDF + Plantilla Mental de 4 pasos */}
				<div className="mt-8 grid gap-6 lg:grid-cols-12">
					{/* Clave 6: 10 puntos de PDF */}
					<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:col-span-7">
						<div className="flex items-center gap-3">
							<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#1b365d]">
								<FileCheck className="h-5 w-5" />
							</span>
							<h3
								className="text-xl font-extrabold text-[#1b365d]"
								style={{ fontFamily: 'var(--font-primary)' }}
							>
								6. Decálogo rápido del PDF accesible
							</h3>
						</div>
						<p className="mt-2 text-sm text-slate-600">
							Un PDF puede verse precioso y ser inaccesible si no conserva etiquetas (Tagged PDF). Revisá estos 10
							puntos esenciales:
						</p>
						<ol className="mt-4 grid gap-2.5 sm:grid-cols-2">
							{PDF_QUICK_TEN.map((pt, i) => (
								<li
									key={i}
									className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-3 text-xs font-medium text-slate-700 ring-1 ring-slate-200/70"
								>
									<span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1d7a4a] text-[11px] font-bold text-white">
										{i + 1}
									</span>
									<span>{pt}</span>
								</li>
							))}
						</ol>
					</div>

					{/* Clave 7: Plantilla mental */}
					<div className="flex flex-col justify-between rounded-3xl border border-[#1d7a4a]/30 bg-gradient-to-br from-[#e3f1ea] via-white to-[#e9eff5] p-6 shadow-sm sm:p-8 lg:col-span-5">
						<div>
							<div className="flex items-center gap-2.5 text-xs font-extrabold uppercase tracking-wider text-[#1d7a4a]">
								<Target className="h-4 w-4" />
								7. Plantilla mental para cualquier ficha
							</div>
							<h3
								className="mt-2 text-xl font-extrabold text-[#1b365d] sm:text-2xl"
								style={{ fontFamily: 'var(--font-primary)' }}
							>
								«Menos capas, más intención»
							</h3>
							<p className="mt-2 text-sm leading-relaxed text-slate-600">
								Cada vez que diseño una actividad nueva, verifico que estén visibles estos 4 bloques:
							</p>

							<div className="mt-4 space-y-2.5">
								{[
									{ label: '1. Propósito', text: 'Qué vamos a aprender hoy.' },
									{ label: '2. Tarea', text: 'Qué tenés que hacer paso a paso.' },
									{ label: '3. Criterio', text: 'Cómo sabés que está completo y bien resuelto.' },
									{ label: '4. Apoyo', text: 'Un ejemplo, pista o recordatorio al pie.' }
								].map((b) => (
									<div key={b.label} className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200/80">
										<span className="text-xs font-extrabold text-[#1d7a4a]">{b.label}: </span>
										<span className="text-xs font-medium text-slate-700">{b.text}</span>
									</div>
								))}
							</div>
						</div>

						<div className="mt-6 border-t border-slate-200/80 pt-4">
							<p className="text-xs font-semibold text-[#1b365d]">
								¿Necesitás acompañamiento para adaptar materiales en tu escuela o institución?
							</p>
							<a
								href="https://wa.me/5492622662596?text=Hola%20M%C3%B3nica,%20le%C3%AD%20tu%20gu%C3%ADa%20de%20materiales%20accesibles%20y%20ordenados%20y%20quer%C3%ADa%20consultarte."
								target="_blank"
								rel="noopener noreferrer"
								className="mt-2.5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1b365d] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#142947]"
							>
								<MessageCircle className="h-4 w-4" />
								Escribirme por WhatsApp
							</a>
						</div>
					</div>
				</div>

				{/* Barra para compartir con colegas */}
				<div className="mt-12 print:hidden">
					<TeacherShareBar
						title="Guía Práctica: Materiales educativos accesibles y ordenados (sin perder tiempo)"
						urlPath="/materiales-accesibles-ordenados-guia"
					/>
				</div>

				<div className="mt-8 text-center print:hidden">
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
