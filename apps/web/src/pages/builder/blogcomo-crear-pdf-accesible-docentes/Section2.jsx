import React from 'react';
import { Link } from 'react-router-dom';
import {
	CheckCircle2,
	AlertTriangle,
	FileCheck2,
	FileWarning,
	Clock,
	ArrowLeft,
	MessageCircle,
	Sparkles
} from 'lucide-react';
import TeacherShareBar from '@/components/TeacherShareBar';

const WORD_STEPS = [
	'Usá los estilos de encabezado integrados (Título, Encabezado 1, Encabezado 2) en lugar de solo cambiar el tamaño de fuente manualmente.',
	'Agregá texto alternativo a cada imagen: clic derecho sobre la imagen → "Editar texto alternativo" → escribí una descripción breve.',
	'Asegurate de que las listas estén creadas con la función de lista del programa (no con guiones manuales).',
	'Al exportar: Archivo → Exportar → Crear PDF/XPS → Opciones → marcá "Etiquetas de estructura del documento para accesibilidad".',
	'Verificá el resultado antes de guardar: Archivo → Información → Comprobar si hay problemas → Comprobar accesibilidad.'
];

const DOCS_STEPS = [
	'Usá los estilos de título y encabezado del menú desplegable (no solo agrandes la fuente manualmente).',
	'Para las imágenes: clic derecho → "Texto alternativo" → completá el campo "Descripción".',
	'Exportar: Archivo → Descargar → Documento PDF (.pdf). Google Docs conserva la estructura de encabezados si usaste los estilos.',
	'Verificación recomendada: Abrí el PDF en Adobe Acrobat Reader y probá la función "Leer en voz alta" para comprobar que se lee en orden.'
];

const COMMON_ERRORS = [
	{
		title: '1. Escanear fotocopias y compartirlas como PDF',
		problem: 'El resultado es una foto completa sin texto real; un lector de pantalla o celular no puede leerlo ni buscar palabras.',
		solution: 'Usá reconocimiento óptico de caracteres (OCR) o compartí directamente el documento digital original.'
	},
	{
		title: '2. Usar imágenes con texto incrustado',
		problem: 'Frases o consignas diseñadas como imagen plana que el lector de voz saltea por completo.',
		solution: 'Escribí las consignas siempre como texto real seleccionable o incluí el texto completo en la descripción alternativa.'
	},
	{
		title: '3. Olvidar el texto alternativo en imágenes educativas',
		problem: 'El lector de pantalla solo anuncia "imagen" o lee el nombre del archivo ("IMG_4920.jpg") sin dar contexto.',
		solution: 'Agregá siempre una descripción breve de 1 o 2 oraciones que explique qué aporta la imagen a la actividad.'
	}
];

export default function Section2() {
	return (
		<section className="bg-[#f8fafc] py-12 md:py-16">
			<div className="mx-auto max-w-5xl px-6">
				{/* Qué hace accesible a un PDF */}
				<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
					<h2
						className="text-2xl font-extrabold text-[#1b365d] sm:text-3xl"
						style={{ fontFamily: 'var(--font-primary)' }}
					>
						¿Qué hace que un PDF sea realmente «accesible»?
					</h2>
					<p className="mt-3 text-base leading-relaxed text-slate-700">
						La mayoría de los PDFs que circulan en las escuelas son imágenes escaneadas o archivos sin etiquetas. La
						buena noticia es que crear un PDF accesible <strong>no requiere software costoso</strong>. Un PDF
						accesible permite ser leído y navegado correctamente por:
					</p>

					<div className="mt-6 grid gap-4 sm:grid-cols-2">
						{[
							'Lectores de pantalla (como NVDA o JAWS, usados por estudiantes con discapacidad visual).',
							'Herramientas de lectura en voz alta en celulares, tablets y computadoras.',
							'Funciones de búsqueda de palabras y diccionario dentro del documento.',
							'Estudiantes que necesitan ajustar el zoom sin perder el orden de lectura.'
						].map((benefit) => (
							<div
								key={benefit}
								className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4"
							>
								<CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1d7a4a]" />
								<span className="text-sm font-medium leading-relaxed text-slate-700">{benefit}</span>
							</div>
						))}
					</div>
				</div>

				{/* Opciones 1 y 2: Word y Google Docs */}
				<div id="pasos-exportacion" className="mt-10 grid gap-6 lg:grid-cols-2">
					{/* Opción 1: Word */}
					<div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
						<div>
							<span className="inline-block rounded-full bg-blue-50 px-3.5 py-1 text-xs font-extrabold text-[#1b365d] ring-1 ring-blue-200">
								Opción 1 · La más recomendada
							</span>
							<h3
								className="mt-3 text-xl font-extrabold text-[#1b365d] sm:text-2xl"
								style={{ fontFamily: 'var(--font-primary)' }}
							>
								Crear un PDF accesible desde Microsoft Word
							</h3>
							<ol className="mt-5 space-y-3.5">
								{WORD_STEPS.map((step, index) => (
									<li key={index} className="flex items-start gap-3 text-sm leading-relaxed text-slate-700">
										<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1b365d] text-xs font-bold text-white">
											{index + 1}
										</span>
										<span>{step}</span>
									</li>
								))}
							</ol>
						</div>

						<div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs leading-relaxed text-amber-950">
							<AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
							<span>
								<strong>⚠️ Muy importante:</strong> Si usás «Imprimir → Microsoft Print to PDF», el archivo pierde
								todas las etiquetas de accesibilidad. Usá siempre <strong>Guardar como PDF / Exportar</strong>.
							</span>
						</div>
					</div>

					{/* Opción 2: Google Docs + Opción 3: Verificación */}
					<div className="flex flex-col gap-6">
						<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
							<span className="inline-block rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-extrabold text-[#1d7a4a] ring-1 ring-emerald-200">
								Opción 2 · Trabajo en la nube
							</span>
							<h3
								className="mt-3 text-xl font-extrabold text-[#1b365d] sm:text-2xl"
								style={{ fontFamily: 'var(--font-primary)' }}
							>
								Desde Google Docs
							</h3>
							<ol className="mt-5 space-y-3.5">
								{DOCS_STEPS.map((step, index) => (
									<li key={index} className="flex items-start gap-3 text-sm leading-relaxed text-slate-700">
										<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1d7a4a] text-xs font-bold text-white">
											{index + 1}
										</span>
										<span>{step}</span>
									</li>
								))}
							</ol>
						</div>

						<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
							<div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#1b365d]">
								<FileCheck2 className="h-4 w-4 text-[#1d7a4a]" />
								Opción 3 · Diagnosticar un PDF existente
							</div>
							<h3 className="mt-2 text-lg font-extrabold text-[#1b365d]">
								3 herramientas gratuitas para comprobar tus PDFs
							</h3>
							<ul className="mt-3 space-y-2.5 text-sm text-slate-700">
								<li>
									• <strong>Adobe Acrobat:</strong> Herramientas → Accesibilidad → Comprobación completa.
								</li>
								<li>
									• <strong>PDF Accessibility Checker (PAC):</strong> Programa gratuito para Windows que genera un
									informe visual detallado.
								</li>
								<li>
									• <strong>NVDA (Lector de pantalla gratuito):</strong> La prueba más realista para escuchar cómo
									navega tu documento un estudiante.
								</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Los 3 errores más comunes */}
				<div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
							<FileWarning className="h-5 w-5" />
						</div>
						<h2
							className="text-xl font-extrabold text-[#1b365d] sm:text-2xl"
							style={{ fontFamily: 'var(--font-primary)' }}
						>
							Los 3 errores más comunes en PDFs educativos (y cómo evitarlos)
						</h2>
					</div>

					<div className="mt-6 grid gap-5 md:grid-cols-3">
						{COMMON_ERRORS.map((err) => (
							<div
								key={err.title}
								className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-slate-50/70 p-5"
							>
								<div>
									<h3 className="text-base font-bold text-[#1b365d]">{err.title}</h3>
									<p className="mt-2 text-xs leading-relaxed text-slate-600">
										<strong className="text-rose-700">Problema:</strong> {err.problem}
									</p>
								</div>
								<div className="mt-4 rounded-xl bg-emerald-50 p-3 text-xs leading-relaxed text-emerald-950 ring-1 ring-emerald-200">
									<strong className="text-[#1d7a4a]">✓ Solución:</strong> {err.solution}
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Cuánto tiempo lleva + CTA de acompañamiento */}
				<div className="mt-10 grid gap-6 lg:grid-cols-12">
					<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:col-span-7">
						<div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1d7a4a]">
							<Clock className="h-4 w-4" />
							Inversión de tiempo real
						</div>
						<h3
							className="mt-2 text-xl font-extrabold text-[#1b365d] sm:text-2xl"
							style={{ fontFamily: 'var(--font-primary)' }}
						>
							¿Cuánto tiempo lleva hacer un PDF accesible?
						</h3>
						<p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base">
							Si creás el documento aplicando estilos desde el inicio, <strong>no agrega tiempo extra</strong>: se
							vuelve parte natural de tu flujo de trabajo. Si necesitás adaptar un cuadernillo existente de 10
							páginas, puede llevarte entre 30 y 60 minutos.
						</p>
						<p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base">
							La inversión vale cada minuto: reduce las consultas de <em>«no puedo abrir o leer el archivo»</em> y
							pone la inclusión en el centro de tu práctica docente.
						</p>
					</div>

					<div className="flex flex-col justify-between rounded-3xl bg-[#1b365d] p-6 text-white shadow-sm sm:p-8 lg:col-span-5">
						<div>
							<span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-[#74c69d]">
								<Sparkles className="h-3.5 w-3.5" />
								Acompañamiento Docente
							</span>
							<h3
								className="mt-3 text-xl font-bold text-white"
								style={{ fontFamily: 'var(--font-primary)' }}
							>
								¿Necesitás revisar tus materiales actuales?
							</h3>
							<p className="mt-2 text-sm leading-relaxed text-slate-200">
								Te acompaño a diagnosticar y adaptar tus guías, cuadernillos o presentaciones para que lleguen a
								todos tus estudiantes.
							</p>
						</div>
						<div className="mt-6 flex flex-col gap-2.5">
							<a
								href="https://wa.me/5492622662596?text=Hola%20M%C3%B3nica,%20le%C3%AD%20tu%20gu%C3%ADa%20de%20PDFs%20accesibles%20y%20me%20gustar%C3%ADa%20hacerte%20una%20consulta."
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#74c69d] px-5 py-3 text-sm font-bold text-[#1b365d] transition hover:bg-[#5bb887]"
							>
								<MessageCircle className="h-4 w-4" />
								Consultar por WhatsApp
							</a>
							<Link
								to="/evaluador-de-accesibilidad-de-materiales-didacticos"
								className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-white/20"
							>
								Probar Evaluador Interactivo Gratis
							</Link>
						</div>
					</div>
				</div>

				{/* Barra de compartir por WhatsApp */}
				<div className="mt-12 print:hidden">
					<TeacherShareBar
						title="Guía paso a paso: Cómo crear PDFs accesibles en Word y Google Docs"
						urlPath="/blogcomo-crear-pdf-accesible-docentes"
					/>
				</div>

				<div className="mt-8 flex flex-wrap justify-center gap-4 print:hidden">
					<Link
						to="/recursos-para-docentes"
						className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-[#1b365d] shadow-sm transition hover:bg-slate-50"
					>
						<ArrowLeft className="h-4 w-4" />
						Volver a Recursos para Docentes
					</Link>
					<Link
						to="/blog-accesibilidad"
						className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"
					>
						Ir al Blog de Novedades
					</Link>
				</div>
			</div>
		</section>
	);
}
