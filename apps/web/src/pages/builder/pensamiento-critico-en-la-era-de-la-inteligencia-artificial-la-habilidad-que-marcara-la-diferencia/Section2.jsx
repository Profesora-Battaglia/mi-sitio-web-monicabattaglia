import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Sparkles, ArrowLeft, Compass, Lightbulb } from 'lucide-react';
import TeacherShareBar from '@/components/TeacherShareBar';

const FIVE_HABITS = [
	{
		num: '1',
		title: 'Cuestionar las respuestas automáticas',
		desc: 'No aceptar todo lo que genera una IA como verdad absoluta; verificar fechas, datos y autores.'
	},
	{
		num: '2',
		title: 'Comparar múltiples fuentes',
		desc: 'Buscar distintas perspectivas y contrastar con bibliografía confiable antes de sacar conclusiones.'
	},
	{
		num: '3',
		title: 'Hacer mejores preguntas',
		desc: 'La profundidad de una respuesta depende directamente de la claridad y el contexto de nuestra pregunta.'
	},
	{
		num: '4',
		title: 'Reflexionar antes de compartir',
		desc: 'No difundir ni entregar información solo porque «suena bien redactada».'
	},
	{
		num: '5',
		title: 'Usar la IA como apoyo, no como reemplazo',
		desc: 'La tecnología debe potenciar nuestras capacidades de análisis y creación, nunca apagarlas.'
	}
];

export default function Section2() {
	return (
		<section className="bg-[#f8fafc] py-12 md:py-16">
			<div className="mx-auto max-w-5xl px-6">
				{/* Bloque 1 */}
				<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
					<p className="text-base leading-relaxed text-slate-700 sm:text-lg">
						La Inteligencia Artificial ya no es una promesa del futuro: está en las aulas, en los celulares y en la
						forma en que buscamos información todos los días. Pero en medio de esta revolución aparece una pregunta
						clave:{' '}
						<strong className="text-[#1b365d]">
							si la IA puede responder casi cualquier cosa en segundos… ¿qué papel juega el pensamiento crítico?
						</strong>
					</p>
					<p className="mt-4 text-base font-bold text-[#1d7a4a] sm:text-lg">
						La respuesta es simple: juega un papel más importante que nunca.
					</p>
				</div>

				{/* Bloque 2: Tener información vs Comprender */}
				<div className="mt-8 grid gap-6 md:grid-cols-2">
					<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
						<div className="flex items-center gap-3">
							<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#1b365d]">
								<Compass className="h-5 w-5" />
							</span>
							<h2 className="text-xl font-extrabold text-[#1b365d]">
								Tener información no significa comprender
							</h2>
						</div>
						<p className="mt-3 text-sm leading-relaxed text-slate-600">
							Durante décadas el desafío fue acceder a la información. Hoy ocurre lo contrario: estamos rodeados de
							datos, resúmenes y textos generados al instante. Sin embargo, la IA no siempre distingue entre
							información rigurosa, desactualizada o sesgada.
						</p>
						<ul className="mt-4 space-y-2 text-sm text-slate-700">
							{[
								'Analizar y cuestionar afirmaciones',
								'Comparar fuentes diversas',
								'Detectar errores o alucinaciones',
								'Identificar sesgos y tomar decisiones conscientes'
							].map((item) => (
								<li key={item} className="flex items-center gap-2">
									<CheckCircle2 className="h-4 w-4 shrink-0 text-[#1d7a4a]" />
									<span>{item}</span>
								</li>
							))}
						</ul>
					</div>

					<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
						<div className="flex items-center gap-3">
							<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#1d7a4a]">
								<Lightbulb className="h-5 w-5" />
							</span>
							<h2 className="text-xl font-extrabold text-[#1b365d]">
								Velocidad vs. Dirección pedagógica
							</h2>
						</div>
						<p className="mt-3 text-sm leading-relaxed text-slate-600">
							Una herramienta de IA puede sugerir una planificación en segundos, pero hay dimensiones que siguen
							dependiendo íntegramente del criterio docente y humano:
						</p>
						<ul className="mt-4 space-y-2 text-sm text-slate-700">
							{[
								'Interpretar el contexto real de cada grupo',
								'Comprender emociones y trayectorias',
								'Detectar intenciones y evaluar consecuencias',
								'Decidir qué vale la pena enseñar y profundizar'
							].map((item) => (
								<li key={item} className="flex items-center gap-2">
									<CheckCircle2 className="h-4 w-4 shrink-0 text-[#1b365d]" />
									<span>{item}</span>
								</li>
							))}
						</ul>
						<div className="mt-4 rounded-xl bg-emerald-50/70 p-3 text-xs font-bold text-[#1d7a4a] ring-1 ring-emerald-200">
							«La IA ofrece velocidad. El pensamiento crítico aporta dirección.»
						</div>
					</div>
				</div>

				{/* Bloque 3: Las 5 prácticas */}
				<div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
					<h2
						className="text-2xl font-extrabold text-[#1b365d]"
						style={{ fontFamily: 'var(--font-primary)' }}
					>
						5 prácticas para desarrollar pensamiento crítico en tiempos de IA
					</h2>
					<div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{FIVE_HABITS.map((h) => (
							<div
								key={h.num}
								className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5 transition hover:border-[#1d7a4a]/40"
							>
								<span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#1b365d] text-xs font-extrabold text-white">
									{h.num}
								</span>
								<h3 className="mt-3 text-base font-bold text-[#1b365d]">{h.title}</h3>
								<p className="mt-1.5 text-xs leading-relaxed text-slate-600">{h.desc}</p>
							</div>
						))}
					</div>
				</div>

				{/* Conclusión */}
				<div className="mt-8 rounded-3xl bg-gradient-to-r from-[#1b365d] to-[#1d7a4a] p-6 text-white shadow-md sm:p-8">
					<div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
						<div className="max-w-2xl">
							<span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-[#74c69d]">
								<Sparkles className="h-3.5 w-3.5" />
								Reflexión Final
							</span>
							<h3
								className="mt-3 text-xl font-bold text-white sm:text-2xl"
								style={{ fontFamily: 'var(--font-primary)' }}
							>
								«Mientras las máquinas aprenden a procesar, los humanos necesitamos aprender a pensar mejor.»
							</h3>
							<p className="mt-2 text-sm leading-relaxed text-slate-100">
								En un mundo lleno de respuestas instantáneas, nuestra mayor ventaja educativa seguirá siendo
								enseñar a hacer preguntas inteligentes.
							</p>
						</div>
						<Link
							to="/claseiaxpress"
							className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-extrabold text-[#1b365d] shadow-sm transition hover:bg-slate-100"
						>
							Explorar ClaseIAXpress
						</Link>
					</div>
				</div>

				<div className="mt-12 print:hidden">
					<TeacherShareBar
						title="Pensamiento crítico en la era de la Inteligencia Artificial"
						urlPath="/pensamiento-critico-en-la-era-de-la-inteligencia-artificial-la-habilidad-que-marcara-la-diferencia"
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
