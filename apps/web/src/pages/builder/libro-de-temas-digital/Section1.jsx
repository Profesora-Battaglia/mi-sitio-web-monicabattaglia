import React from 'react';
import { BookOpen, ArrowRight, Check, ExternalLink, Sparkles, UserCheck, BarChart3 } from 'lucide-react';
import Reveal from '@/components/Reveal';

const solution = [
	{
		title: 'Carga Rápida en Segundos desde el Celular o PC',
		text: 'Cada docente accede únicamente a sus espacios curriculares, elige la fecha, utiliza atajos rápidos (Evaluación, Continuidad pedagógica, Feriado) y registra su clase sin planillas pesadas.',
	},
	{
		title: 'Función Inteligente «Ponerse al Día»',
		text: 'El sistema calcula automáticamente qué fechas de clase faltan cargar según el horario semanal de cada materia, permitiendo completar varias clases pendientes en una sola pantalla.',
	},
	{
		title: 'Tablero de Dirección en Tiempo Real',
		text: 'Semáforo automático por curso y materia (Al día, Atrasado, Sin carga), gráficos estadísticos por año, gestión de docentes titulares y suplentes, y exportación directa a Excel/CSV.',
	},
	{
		title: 'Plataforma Multi-Institución en la Nube',
		text: 'Cada colegio cuenta con su propio entorno privado con usuario y contraseña por rol (Docente y Equipo Directivo), adaptable de 1° a 5°, 6° o 7° año y con importación masiva desde Excel.',
	},
];

const features = [
	{
		title: 'Sin Depender de Carpetas de Papel ni Planillas Lentas',
		text: 'Base de datos en la nube de respuesta instantánea aunque decenas de profesores carguen sus clases al mismo tiempo al finalizar la hora.',
	},
	{
		title: 'Respaldo Oficial Descargable en Excel / CSV',
		text: 'Tanto el docente como Dirección pueden descargar en un clic el libro completo de cada espacio curricular o copiarlo directo a una planilla.',
	},
	{
		title: 'Privacidad y Permisos por Rol',
		text: 'Los docentes solo ven y editan sus propias materias, mientras que Dirección y Secretaría supervisan todo el establecimiento y administran suplencias.',
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
							<BookOpen className="h-4 w-4" />
							Solución para Escuelas Secundarias e Institos Superiores
						</span>
					</Reveal>
					<Reveal delay={0.1}>
						<h1
							className="mt-6 text-3xl font-bold leading-[1.15] text-[#1b365d] sm:text-5xl"
							style={{ fontFamily: 'var(--font-primary)' }}
						>
							Libro de Temas Digital Multi-Institución
						</h1>
					</Reveal>
					<Reveal delay={0.15}>
						<p
							className="mx-auto mt-4 max-w-3xl text-base sm:text-lg leading-relaxed text-slate-600"
							style={{ fontFamily: 'var(--font-secondary)' }}
						>
							Reemplazá los libros en papel y las hojas de cálculo dispersas por una plataforma ágil donde cada docente
							registra sus clases en segundos y el Equipo Directivo supervisa el estado de carga en tiempo real.
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
								href="/libro-de-temas/index.html"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 rounded-full border border-[#1b365d]/20 bg-white px-6 py-3.5 text-sm font-semibold text-[#1b365d] shadow-sm transition hover:bg-slate-50"
							>
								<ExternalLink className="h-4 w-4" />
								Abrir Plataforma / Pantalla Completa
							</a>
							<a
								href="https://wa.me/5492622662596?text=Hola%20M%C3%B3nica%2C%20estoy%20viendo%20el%20Libro%20de%20Temas%20Digital%20en%20monicabattaglia.com%20y%20quiero%20consultar%20para%20mi%20instituci%C3%B3n."
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
										DEMO INTERACTIVA EN VIVO — PROBÁ LA CARGA RÁPIDA DOCENTE Y EL TABLERO DE DIRECCIÓN
									</span>
								</div>
								<div className="flex items-center gap-3 text-xs">
									<a
										href="/libro-de-temas/index.html"
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-1 rounded-lg bg-white/15 px-3 py-1.5 font-semibold text-white hover:bg-white/25 transition"
									>
										<span>Abrir en pantalla completa / Ingreso Instituciones</span>
										<ExternalLink className="h-3.5 w-3.5" />
									</a>
								</div>
							</div>

							<iframe
								src="/libro-de-temas/index.html"
								title="Demo Interactiva del Libro de Temas Digital"
								className="w-full h-[920px] border-0 bg-slate-50"
								loading="lazy"
							/>
						</div>
					</Reveal>
				</div>

				{/* TARJETAS COMPARATIVAS: DOCENTE VS DIRECCIÓN */}
				<div className="mx-auto mt-14 max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
					<Reveal>
						<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
							<div className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#1b365d]">
								<UserCheck className="h-4 w-4" />
								Para el Cuerpo Docente
							</div>
							<h3 className="mt-3 text-lg font-bold text-[#1b365d]" style={{ fontFamily: 'var(--font-primary)' }}>
								Carga simple y puesta al día en un clic
							</h3>
							<ul className="mt-3 space-y-2 text-sm text-slate-600">
								<li className="flex items-start gap-2">
									<Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1d7a4a]" />
									<span>Vista filtrada exclusivamente con las materias asignadas a cada profesor.</span>
								</li>
								<li className="flex items-start gap-2">
									<Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1d7a4a]" />
									<span>Botón «Ponerse al Día» que detecta automáticamente las fechas adeudadas según el horario.</span>
								</li>
								<li className="flex items-start gap-2">
									<Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1d7a4a]" />
									<span>Edición, consulta histórica y descarga del libro propio en Excel/CSV.</span>
								</li>
							</ul>
						</div>
					</Reveal>

					<Reveal delay={0.1}>
						<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
							<div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-[#1d7a4a]">
								<BarChart3 className="h-4 w-4" />
								Para Equipo Directivo y Secretaría
							</div>
							<h3 className="mt-3 text-lg font-bold text-[#1b365d]" style={{ fontFamily: 'var(--font-primary)' }}>
								Seguimiento pedagógico e institucional al instante
							</h3>
							<ul className="mt-3 space-y-2 text-sm text-slate-600">
								<li className="flex items-start gap-2">
									<Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1d7a4a]" />
									<span>Indicadores de materias al día, con atraso (&gt;14 días) o sin carga por curso.</span>
								</li>
								<li className="flex items-start gap-2">
									<Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1d7a4a]" />
									<span>Asignación de docentes titulares y suplentes con registro de novedad en el libro.</span>
								</li>
								<li className="flex items-start gap-2">
									<Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1d7a4a]" />
									<span>Alta de espacios curriculares e importación masiva desde planilla CSV/Excel.</span>
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
								¿Por qué pasar a una Plataforma Web Multi-Institución?
							</h2>
							<p
								className="mt-4 text-base leading-relaxed text-slate-600"
								style={{ fontFamily: 'var(--font-secondary)' }}
							>
								Cuando una institución gestiona decenas de libros de temas en hojas de cálculo compartidas, el archivo
								se vuelve lento, cualquier usuario puede sobrescribir por error el trabajo de otro docente y el Equipo
								Directivo pierde horas revisando pestaña por pestaña. Esta plataforma combina una base de datos segura en
								la nube con la simplicidad que necesitan los profesores en el aula.
							</p>

							<h2
								className="mt-8 text-2xl font-bold text-[#1b365d]"
								style={{ fontFamily: 'var(--font-primary)' }}
							>
								Solución Desarrollada
							</h2>
							<ul className="mt-4 space-y-3">
								{solution.map((item) => (
									<li key={item.title} className="flex items-start gap-3 text-base text-slate-700">
										<Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#1d7a4a]" />
										<span>
											<strong className="font-semibold text-[#1b365d]">{item.title}:</strong> {item.text}
										</span>
									</li>
								))}
							</ul>

							<h2
								className="mt-8 text-2xl font-bold text-[#1b365d]"
								style={{ fontFamily: 'var(--font-primary)' }}
							>
								Ventajas Clave para tu Institución
							</h2>
							<ul className="mt-4 space-y-3">
								{features.map((item) => (
									<li key={item.title} className="flex items-start gap-3 text-base text-slate-700">
										<Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#1d7a4a]" />
										<span>
											<strong className="font-semibold text-[#1b365d]">{item.title}:</strong> {item.text}
										</span>
									</li>
								))}
							</ul>
						</div>
					</Reveal>

					<Reveal delay={0.1}>
						<div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-center">
							<a
								href="https://wa.me/5492622662596?text=Hola%20M%C3%B3nica%2C%20prob%C3%A9%20la%20Demo%20del%20Libro%20de%20Temas%20Digital%20y%20me%20interesa%20implementarlo%20en%20nuestra%20instituci%C3%B3n."
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
