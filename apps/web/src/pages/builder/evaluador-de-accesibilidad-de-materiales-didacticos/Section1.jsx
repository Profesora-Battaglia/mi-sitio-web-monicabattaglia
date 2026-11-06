import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
	Eye,
	Layers,
	Image,
	Smartphone,
	Check,
	RotateCcw,
	Printer,
	Sparkles,
	ArrowLeft,
	Award,
	AlertCircle,
	CheckCircle2,
	SlidersHorizontal
} from 'lucide-react';
import TeacherShareBar from '@/components/TeacherShareBar';

const EVALUATION_CATEGORIES = [
	{
		id: 'visual',
		shortLabel: 'Claridad Visual',
		title: '1. Claridad Visual (Diseño y Lectura)',
		subtitle: 'Cómo se ve el documento a simple vista y qué tan fácil es leerlo sin fatiga visual.',
		icon: Eye,
		color: '#1b365d',
		badgeBg: 'bg-blue-50 text-[#1b365d] border-blue-200',
		items: [
			{
				id: 'v1',
				title: 'Letra clara y sin adornos (Sans-serif)',
				desc: 'Usás fuentes limpias como Arial, Verdana, Calibri, Open Sans o Atkinson Hyperlegible. Evitás las letras cursivas o muy decorativas.',
				tip: 'Cambiá la fuente principal de tu documento a Arial, Calibri o Atkinson Hyperlegible.'
			},
			{
				id: 'v2',
				title: 'Tamaño de letra cómodo',
				desc: 'El texto común tiene al menos tamaño 12 pt en guías impresas/PDF (o 18-24 pt si es una presentación de diapositivas).',
				tip: 'Aumentá el cuerpo del texto a un mínimo de 12 pt en documentos o 18 pt en diapositivas.'
			},
			{
				id: 'v3',
				title: 'Texto alineado a la izquierda',
				desc: 'Los párrafos NO están "justificados". El texto justificado crea espacios irregulares ("ríos de blanco") que dificultan mucho la lectura a chicos con dislexia.',
				tip: 'Seleccioná todos los párrafos y aplicá alineación a la izquierda en lugar de justificado.'
			},
			{
				id: 'v4',
				title: 'Buen espacio entre líneas (Interlineado)',
				desc: 'Los renglones no están pegados. Usás un interlineado de 1.5 para que el ojo no se pierda al pasar de una línea a la siguiente.',
				tip: 'Configurá el espaciado entre líneas en 1.5 para facilitar el seguimiento visual.'
			},
			{
				id: 'v5',
				title: 'Buen contraste de colores',
				desc: 'Se lee sin esfuerzo (ej. letra negra o azul marino sobre fondo blanco o crema suave). Evitás textos amarillos, grises claros o texto sobre fotos de fondo.',
				tip: 'Asegurate de que el contraste entre texto y fondo supere la relación 4.5:1 (texto oscuro sobre fondo claro liso).'
			},
			{
				id: 'v6',
				title: 'El color no es la única pista',
				desc: 'No decís cosas como "Resolvé los ejercicios en rojo". Usás además negritas, íconos, numeración o símbolos (ej. "Resolvé los ejercicios marcados con ★").',
				tip: 'Sumá íconos, etiquetas o símbolos además del color para señalar consignas importantes.'
			}
		]
	},
	{
		id: 'estructura',
		shortLabel: 'Organización',
		title: '2. Organización del Contenido',
		subtitle: 'Cómo está ordenado el material para que el estudiante no se pierda ni se abrume.',
		icon: Layers,
		color: '#1d7a4a',
		badgeBg: 'bg-emerald-50 text-[#1d7a4a] border-emerald-200',
		items: [
			{
				id: 'e1',
				title: 'Títulos reales (Estilos de encabezado)',
				desc: 'Usás las opciones de "Título 1", "Título 2" de Word o Google Docs en lugar de solo agrandar la letra. Esto crea un índice invisible para lectores de pantalla.',
				tip: 'Aplicá los estilos "Título 1" y "Título 2" del procesador de textos para estructurar las secciones.'
			},
			{
				id: 'e2',
				title: 'Listas con viñetas o números automáticos',
				desc: 'Cuando enumerás pasos o elementos, usás el botón de listas del programa en vez de escribir guiones (-) o asteriscos a mano.',
				tip: 'Reemplazá los guiones manuales por la herramienta de listas con viñetas o numeradas.'
			},
			{
				id: 'e3',
				title: 'Párrafos cortos y "aire" en la hoja',
				desc: 'La hoja no es un bloque gigante de texto. Hay márgenes amplios, espacios en blanco y cada párrafo desarrolla una sola idea principal.',
				tip: 'Dividí los bloques largos en párrafos más breves y dejá espacio visual entre consignas.'
			},
			{
				id: 'e4',
				title: 'Enlaces que explican adónde van',
				desc: 'En vez de pegar "https://www.youtube.com/watch?v=..." o poner "Hacé clic acá", escribís algo claro como: "Mirar el video sobre la Revolución de Mayo".',
				tip: 'Reemplazá las URLs largas o los "clic acá" por textos descriptivos que anticipen el destino del enlace.'
			},
			{
				id: 'e5',
				title: 'Tablas simples y solo para datos',
				desc: 'Si usás tablas, tienen su primera fila como encabezado claro. No usás tablas invisibles solo para acomodar imágenes y texto en la página.',
				tip: 'Marcá la fila superior de tus tablas como fila de encabezado y evitá celdas combinadas complejas.'
			},
			{
				id: 'e6',
				title: 'Consignas claras y paso a paso',
				desc: 'Las instrucciones usan un lenguaje directo, con verbos de acción claros ("Subrayá", "Compará") y divididas en pasos numerados.',
				tip: 'Numerá cada paso de las consignas (1, 2, 3) destacando el verbo principal en negrita.'
			}
		]
	},
	{
		id: 'multimedia',
		shortLabel: 'Imágenes y Media',
		title: '3. Imágenes, Videos y Audios',
		subtitle: 'Alternativas para que nadie se quede afuera si no puede ver una imagen o escuchar un audio.',
		icon: Image,
		color: '#d97706',
		badgeBg: 'bg-amber-50 text-amber-900 border-amber-200',
		items: [
			{
				id: 'm1',
				title: 'Explicación oculta en imágenes (Texto Alternativo)',
				desc: 'Si la imagen enseña algo, hacés clic derecho -> "Editar texto alternativo" y escribís qué es, para que la computadora se lo lea a un alumno con discapacidad visual.',
				tip: 'Agregá Texto Alternativo (Alt Text) breve y preciso en todas las imágenes informativas.'
			},
			{
				id: 'm2',
				title: 'Sin fotos de textos ni capturas escaneadas',
				desc: 'No pegás capturas de pantalla de otros textos. Si el texto es una foto, el alumno no puede agrandarlo, cambiarle la fuente ni usar el lector de voz.',
				tip: 'Transcribí las consignas como texto real editable en lugar de pegar capturas de pantalla.'
			},
			{
				id: 'm3',
				title: 'Videos con subtítulos revisados',
				desc: 'Si compartís un video, te asegurás de que tenga subtítulos activados y sin errores graves (ayuda a chicos con hipoacusia o que estudian sin auriculares).',
				tip: 'Verificá que los videos incluidos cuenten con subtítulos claros y bien sincronizados.'
			},
			{
				id: 'm4',
				title: 'Audios con resumen o guion escrito',
				desc: 'Si mandás un podcast o un audio explicativo, adjuntás también un punteo o transcripción escrita de lo que se dice.',
				tip: 'Acompañá los audios o podcasts con una síntesis escrita o transcripción de los puntos clave.'
			},
			{
				id: 'm5',
				title: 'Sin GIFs ni animaciones que parpadeen rápido',
				desc: 'Evitás imágenes con destellos o movimientos bruscos constantes, ya que distraen muchísimo y pueden ser riesgosos para personas fotosensibles.',
				tip: 'Eliminá GIFs parpadeantes o efectos de transición bruscos en tus presentaciones.'
			}
		]
	},
	{
		id: 'acceso',
		shortLabel: 'Acceso Digital',
		title: '4. Formato y Acceso Tecnológico',
		subtitle: 'Qué pasa cuando el estudiante abre el archivo en su celular, tablet o computadora.',
		icon: Smartphone,
		color: '#0284c7',
		badgeBg: 'bg-sky-50 text-sky-900 border-sky-200',
		items: [
			{
				id: 'a1',
				title: 'El texto del PDF se puede seleccionar',
				desc: 'El archivo no es un escaneo borroso de una fotocopia. Si pasás el mouse o el dedo, podés pintar y copiar las palabras perfectamente.',
				tip: 'Guardá tus documentos directamente como PDF digital desde Word o Docs en lugar de escanear copias impresas.'
			},
			{
				id: 'a2',
				title: 'Guardado como PDF con etiquetas de estructura',
				desc: 'Al guardar desde Word, elegís "Guardar como PDF" (marcando etiquetas de accesibilidad) en vez de usar la opción "Imprimir como PDF".',
				tip: 'Exportá siempre con la opción "Etiquetas de estructura del documento para accesibilidad" activada.'
			},
			{
				id: 'a3',
				title: 'Se puede leer bien en el celular',
				desc: 'Pensando en que muchas familias acceden por WhatsApp en un teléfono, el documento no obliga a hacer zoom horizontal constantemente.',
				tip: 'Probá abrir tu archivo desde el celular antes de enviarlo para verificar que el tamaño de letra sea legible.'
			}
		]
	}
];

const ALL_ITEMS = EVALUATION_CATEGORIES.flatMap((cat) =>
	cat.items.map((item) => ({ ...item, categoryId: cat.id, categoryTitle: cat.shortLabel }))
);

const STORAGE_KEY = 'mb_evaluador_accesibilidad_v2';

function RadarChartSVG({ scores }) {
	// 4 axes: Top (Visual), Right (Organización), Bottom (Multimedia), Left (Acceso)
	const size = 240;
	const center = size / 2;
	const maxRadius = 78;

	const axes = [
		{ label: 'Visual', angle: -Math.PI / 2, value: scores.visual || 0 },
		{ label: 'Orden', angle: 0, value: scores.estructura || 0 },
		{ label: 'Media', angle: Math.PI / 2, value: scores.multimedia || 0 },
		{ label: 'Acceso', angle: Math.PI, value: scores.acceso || 0 }
	];

	const getPoint = (angle, pct) => {
		const r = (Math.max(pct, 8) / 100) * maxRadius;
		return {
			x: center + r * Math.cos(angle),
			y: center + r * Math.sin(angle)
		};
	};

	const polygonPoints = axes
		.map((a) => {
			const pt = getPoint(a.angle, a.value);
			return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
		})
		.join(' ');

	return (
		<svg viewBox={`0 0 ${size} ${size}`} className="mx-auto h-52 w-52 overflow-visible">
			{/* Grid rings (25%, 50%, 75%, 100%) */}
			{[25, 50, 75, 100].map((level) => {
				const r = (level / 100) * maxRadius;
				return (
					<circle
						key={level}
						cx={center}
						cy={center}
						r={r}
						fill="none"
						stroke="#e2e8f0"
						strokeWidth="1"
						strokeDasharray={level < 100 ? '3 3' : undefined}
					/>
				);
			})}

			{/* Axis lines */}
			{axes.map((a) => {
				const end = {
					x: center + maxRadius * Math.cos(a.angle),
					y: center + maxRadius * Math.sin(a.angle)
				};
				return (
					<line
						key={a.label}
						x1={center}
						y1={center}
						x2={end.x}
						y2={end.y}
						stroke="#cbd5e1"
						strokeWidth="1"
					/>
				);
			})}

			{/* Filled radar polygon */}
			<polygon
				points={polygonPoints}
				fill="rgba(29, 122, 74, 0.22)"
				stroke="#1d7a4a"
				strokeWidth="2.5"
			/>

			{/* Data vertices and labels */}
			{axes.map((a) => {
				const pt = getPoint(a.angle, a.value);
				const labelRadius = maxRadius + 24;
				const lx = center + labelRadius * Math.cos(a.angle);
				const ly = center + labelRadius * Math.sin(a.angle);
				return (
					<g key={a.label}>
						<circle cx={pt.x} cy={pt.y} r="4.5" fill="#1b365d" stroke="#ffffff" strokeWidth="1.5" />
						<text
							x={lx}
							y={ly}
							textAnchor="middle"
							dominantBaseline="middle"
							className="fill-[#1b365d] text-[11px] font-bold"
						>
							{a.label} ({a.value}%)
						</text>
					</g>
				);
			})}
		</svg>
	);
}

export default function Section1() {
	const [checkedMap, setCheckedMap] = useState(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			return saved ? JSON.parse(saved) : {};
		} catch {
			return {};
		}
	});
	const [activeTab, setActiveTab] = useState('all');

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedMap));
		} catch {
			// Ignore storage errors
		}
	}, [checkedMap]);

	const toggleItem = (id) => {
		setCheckedMap((prev) => ({
			...prev,
			[id]: !prev[id]
		}));
	};

	const resetAll = () => {
		setCheckedMap({});
	};

	const stats = useMemo(() => {
		const totalItems = ALL_ITEMS.length;
		const totalChecked = ALL_ITEMS.filter((item) => checkedMap[item.id]).length;
		const overallPercent = Math.round((totalChecked / totalItems) * 100);

		const categoryScores = {};
		EVALUATION_CATEGORIES.forEach((cat) => {
			const checkedInCat = cat.items.filter((i) => checkedMap[i.id]).length;
			categoryScores[cat.id] = Math.round((checkedInCat / cat.items.length) * 100);
		});

		const pendingTips = ALL_ITEMS.filter((item) => !checkedMap[item.id]).slice(0, 3);

		let levelBadge = 'Para Empezar';
		let levelColor = 'bg-slate-100 text-slate-700 border-slate-200';
		let levelMessage =
			'Marcá los puntos de la lista para conocer qué tan accesible es tu material didáctico y recibir sugerencias prácticas.';

		if (totalChecked > 0) {
			if (overallPercent < 45) {
				levelBadge = 'Nivel Inicial · Oportunidad de Mejora';
				levelColor = 'bg-rose-50 text-rose-800 border-rose-200';
				levelMessage =
					'Tu material puede presentar barreras para varios estudiantes. ¡No te preocupes! Empezá aplicando las 3 sugerencias prioritarias de abajo.';
			} else if (overallPercent < 80) {
				levelBadge = '¡Muy Buen Camino! · Material en Proceso';
				levelColor = 'bg-amber-50 text-amber-900 border-amber-200';
				levelMessage =
					'Ya tenés incorporadas muy buenas prácticas de diseño claro. Con un par de ajustes más en estructura o texto alternativo, tu recurso será ejemplar.';
			} else {
				levelBadge = '¡Excelente! · Material Altamente Inclusivo';
				levelColor = 'bg-emerald-50 text-[#1d7a4a] border-emerald-200';
				levelMessage =
					'¡Felicitaciones! Tu material cumple con los estándares fundamentales del Diseño Universal para el Aprendizaje (DUA).';
			}
		}

		return {
			totalItems,
			totalChecked,
			overallPercent,
			categoryScores,
			pendingTips,
			levelBadge,
			levelColor,
			levelMessage
		};
	}, [checkedMap]);

	const visibleCategories =
		activeTab === 'all'
			? EVALUATION_CATEGORIES
			: EVALUATION_CATEGORIES.filter((cat) => cat.id === activeTab);

	return (
		<div className="min-h-screen bg-[#f8fafc]">
			{/* Hero Header limpio y moderno */}
			<section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-br from-[#e9eff5] via-white to-[#e3f1ea] pt-10 pb-12 md:py-14">
				<div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#74c69d]/20 blur-3xl" />
				<div className="mx-auto max-w-7xl px-6">
					<div className="mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
						<Link
							to="/recursos-para-docentes"
							className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#1b365d] shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-[#1d7a4a]"
						>
							<ArrowLeft className="h-4 w-4" />
							Volver a Recursos para Docentes
						</Link>
						<span className="inline-flex items-center gap-2 rounded-full bg-[#1d7a4a]/10 px-4 py-1.5 text-xs font-bold text-[#1d7a4a]">
							<Sparkles className="h-3.5 w-3.5" />
							Herramienta Interactiva Gratuita · Carga Instantánea
						</span>
					</div>

					<div className="max-w-3xl">
						<h1
							className="text-3xl font-extrabold leading-tight text-[#1b365d] sm:text-4xl lg:text-5xl"
							style={{ fontFamily: 'var(--font-primary)' }}
						>
							Evaluador de Accesibilidad de Materiales Didácticos
						</h1>
						<p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
							Comprobá de manera sencilla si tus guías de estudio, presentaciones o PDFs son fáciles de leer y
							comprender para <strong className="font-semibold text-[#1b365d]">todos tus estudiantes</strong>.
							Marcá los puntos que tu material ya cumple y obtené un diagnóstico visual al instante.
						</p>
					</div>

					{/* Pestañas rápidas por categoría */}
					<div className="mt-8 flex flex-wrap items-center gap-2 print:hidden">
						<button
							type="button"
							onClick={() => setActiveTab('all')}
							className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition sm:text-sm ${
								activeTab === 'all'
									? 'bg-[#1b365d] text-white shadow-sm'
									: 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
							}`}
						>
							<SlidersHorizontal className="h-3.5 w-3.5" />
							Todas las áreas (20)
						</button>
						{EVALUATION_CATEGORIES.map((cat) => {
							const IconComp = cat.icon;
							const catScore = stats.categoryScores[cat.id];
							return (
								<button
									key={cat.id}
									type="button"
									onClick={() => setActiveTab(cat.id)}
									className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition sm:text-sm ${
										activeTab === cat.id
											? 'bg-[#1d7a4a] text-white shadow-sm'
											: 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'
									}`}
								>
									<IconComp className="h-3.5 w-3.5" />
									{cat.shortLabel}
									<span
										className={`rounded-full px-2 py-0.5 text-[11px] ${
											activeTab === cat.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
										}`}
									>
										{catScore}%
									</span>
								</button>
							);
						})}
					</div>
				</div>
			</section>

			{/* Contenido Principal: Lista a la izquierda, Panel de Diagnóstico en vivo a la derecha */}
			<section className="mx-auto max-w-7xl px-6 py-10 md:py-14">
				<div className="grid items-start gap-8 lg:grid-cols-12">
					{/* Columna Izquierda: Ítems interactivos */}
					<div className="space-y-8 lg:col-span-7 xl:col-span-8">
						{visibleCategories.map((cat) => {
							const IconComp = cat.icon;
							const checkedCount = cat.items.filter((i) => checkedMap[i.id]).length;

							return (
								<div
									key={cat.id}
									className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm"
								>
									<div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/70 px-6 py-5">
										<div className="flex items-start gap-3.5">
											<span
												className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${cat.badgeBg}`}
											>
												<IconComp className="h-5 w-5" />
											</span>
											<div>
												<h2
													className="text-lg font-bold text-[#1b365d] sm:text-xl"
													style={{ fontFamily: 'var(--font-primary)' }}
												>
													{cat.title}
												</h2>
												<p className="mt-0.5 text-xs text-slate-500 sm:text-sm">{cat.subtitle}</p>
											</div>
										</div>
										<span className="rounded-full bg-white px-3.5 py-1 text-xs font-extrabold text-[#1b365d] ring-1 ring-slate-200">
											{checkedCount} / {cat.items.length}
										</span>
									</div>

									<div className="divide-y divide-slate-100 p-4 sm:p-6">
										{cat.items.map((item) => {
											const isChecked = !!checkedMap[item.id];
											return (
												<div
													key={item.id}
													onClick={() => toggleItem(item.id)}
													className={`group flex cursor-pointer items-start gap-4 rounded-2xl p-4 transition-all ${
														isChecked
															? 'bg-[#e3f1ea]/50 ring-1 ring-[#1d7a4a]/25'
															: 'hover:bg-slate-50'
													}`}
												>
													<button
														type="button"
														role="checkbox"
														aria-checked={isChecked}
														className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all ${
															isChecked
																? 'border-[#1d7a4a] bg-[#1d7a4a] text-white shadow-sm'
																: 'border-slate-300 bg-white group-hover:border-[#1d7a4a]'
														}`}
													>
														{isChecked && <Check className="h-4 w-4 stroke-[3]" />}
													</button>

													<div className="flex-1">
														<div className="flex flex-wrap items-center justify-between gap-2">
															<h3
																className={`text-base font-bold transition-colors ${
																	isChecked ? 'text-[#1d7a4a]' : 'text-[#1b365d]'
																}`}
															>
																{item.title}
															</h3>
															{isChecked && (
																<span className="inline-flex items-center gap-1 rounded-full bg-[#1d7a4a]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#1d7a4a]">
																	<CheckCircle2 className="h-3 w-3" /> Cumplido
																</span>
															)}
														</div>
														<p className="mt-1.5 text-sm leading-relaxed text-slate-600">
															{item.desc}
														</p>
													</div>
												</div>
											);
										})}
									</div>
								</div>
							);
						})}
					</div>

					{/* Columna Derecha: Panel de Resultados en Tiempo Real */}
					<div className="lg:sticky lg:top-24 lg:col-span-5 xl:col-span-4">
						<div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-7">
							<div className="flex items-center justify-between border-b border-slate-100 pb-4">
								<div>
									<span className="text-xs font-bold uppercase tracking-wider text-[#1d7a4a]">
										Diagnóstico en vivo
									</span>
									<h2
										className="text-xl font-extrabold text-[#1b365d]"
										style={{ fontFamily: 'var(--font-primary)' }}
									>
										Resultado de tu Material
									</h2>
								</div>
								<Award className="h-7 w-7 text-[#1d7a4a]" />
							</div>

							{/* Puntaje Circular + Resumen */}
							<div className="mt-6 flex items-center gap-5 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200/70">
								<div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
									<svg className="h-24 w-24 -rotate-90 transform" viewBox="0 0 100 100">
										<circle
											cx="50"
											cy="50"
											r="42"
											fill="none"
											stroke="#e2e8f0"
											strokeWidth="10"
										/>
										<circle
											cx="50"
											cy="50"
											r="42"
											fill="none"
											stroke={
												stats.overallPercent >= 80
													? '#1d7a4a'
													: stats.overallPercent >= 45
													? '#d97706'
													: '#1b365d'
											}
											strokeWidth="10"
											strokeLinecap="round"
											strokeDasharray={264}
											strokeDashoffset={264 - (264 * stats.overallPercent) / 100}
											className="transition-all duration-500"
										/>
									</svg>
									<div className="absolute inset-0 flex flex-col items-center justify-center">
										<span className="text-2xl font-extrabold text-[#1b365d]">
											{stats.overallPercent}%
										</span>
									</div>
								</div>

								<div>
									<span
										className={`inline-block rounded-full border px-3 py-0.5 text-xs font-bold ${stats.levelColor}`}
									>
										{stats.levelBadge}
									</span>
									<p className="mt-2 text-xs font-medium text-slate-600">
										Cumplís <strong className="text-[#1b365d]">{stats.totalChecked}</strong> de los{' '}
										<strong className="text-[#1b365d]">{stats.totalItems}</strong> criterios clave.
									</p>
								</div>
							</div>

							<p className="mt-4 text-sm leading-relaxed text-slate-600">{stats.levelMessage}</p>

							{/* Gráfico Radar SVG Instantáneo */}
							<div className="mt-5 border-t border-slate-100 pt-5">
								<h3 className="text-center text-xs font-bold uppercase tracking-wider text-slate-400">
									Equilibrio por Dimensión
								</h3>
								<div className="mt-2">
									<RadarChartSVG scores={stats.categoryScores} />
								</div>
							</div>

							{/* Barras de desglose por categoría */}
							<div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
								{EVALUATION_CATEGORIES.map((cat) => {
									const pct = stats.categoryScores[cat.id];
									return (
										<div key={cat.id}>
											<div className="flex justify-between text-xs font-semibold text-slate-700">
												<span>{cat.shortLabel}</span>
												<span className="font-bold text-[#1b365d]">{pct}%</span>
											</div>
											<div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100">
												<div
													className="h-full rounded-full transition-all duration-300"
													style={{
														width: `${pct}%`,
														backgroundColor: cat.color
													}}
												/>
											</div>
										</div>
									);
								})}
							</div>

							{/* Próximos pasos recomendados según lo que falta marcar */}
							{stats.pendingTips.length > 0 && (
								<div className="mt-6 rounded-2xl border border-amber-200/80 bg-amber-50/60 p-4">
									<div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-amber-900">
										<AlertCircle className="h-4 w-4 text-amber-600" />
										Próximas mejoras sugeridas:
									</div>
									<ul className="mt-2.5 space-y-2 text-xs leading-relaxed text-slate-700">
										{stats.pendingTips.map((item) => (
											<li key={item.id} className="flex items-start gap-2">
												<span className="mt-0.5 font-bold text-amber-700">•</span>
												<span>
													<strong className="text-[#1b365d]">{item.categoryTitle}:</strong> {item.tip}
												</span>
											</li>
										))}
									</ul>
								</div>
							)}

							{/* Botones de Acción */}
							<div className="mt-6 flex flex-col gap-2.5 print:hidden">
								<button
									type="button"
									onClick={() => window.print()}
									className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1b365d] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#142947]"
								>
									<Printer className="h-4 w-4" />
									Imprimir / Guardar Diagnóstico PDF
								</button>
								<button
									type="button"
									onClick={resetAll}
									className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-rose-50 hover:text-rose-700"
								>
									<RotateCcw className="h-3.5 w-3.5" />
									Reiniciar Evaluación
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Barra para compartir con otros docentes y conocer ClaseIAXpress */}
				<div className="mt-14 print:hidden">
					<TeacherShareBar
						title="Evaluador Interactivo de Accesibilidad para Materiales Didácticos"
						urlPath="/evaluador-de-accesibilidad-de-materiales-didacticos"
					/>
				</div>
			</section>
		</div>
	);
}
