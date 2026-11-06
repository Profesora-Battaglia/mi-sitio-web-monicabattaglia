import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
	Type,
	Palette,
	Image,
	FileText,
	Video,
	Share2,
	CheckCircle2,
	RotateCcw,
	Printer,
	Mail,
	ArrowLeft,
	Sparkles,
	Check,
	BookOpen
} from 'lucide-react';
import TeacherShareBar from '@/components/TeacherShareBar';

const CHECKLIST_SECTIONS = [
	{
		id: 'tipografia',
		title: '1. Tipografía y legibilidad',
		icon: Type,
		accent: 'bg-blue-50 text-[#1b365d] border-blue-200',
		items: [
			{
				id: 1,
				text: 'Uso una fuente sans-serif clara (Arial, Verdana, Calibri, Open Sans o Atkinson Hyperlegible).'
			},
			{
				id: 2,
				text: 'El tamaño de cuerpo de texto es de al menos 12pt en documentos y 18pt en presentaciones.'
			},
			{
				id: 3,
				text: 'El interlineado es de al menos 1.5 veces el tamaño de la fuente.'
			},
			{
				id: 4,
				text: 'Los párrafos están alineados a la izquierda (no justificados, ya que el texto justificado dificulta la lectura en personas con dislexia).'
			},
			{
				id: 5,
				text: 'Las líneas de texto no superan los 70-80 caracteres de ancho.'
			}
		]
	},
	{
		id: 'contraste',
		title: '2. Contraste y color',
		icon: Palette,
		accent: 'bg-emerald-50 text-[#1d7a4a] border-emerald-200',
		items: [
			{
				id: 6,
				text: 'El contraste entre el texto y el fondo supera la relación 4.5:1 (verificable con WebAIM Contrast Checker).'
			},
			{
				id: 7,
				text: 'El color no es el único medio para transmitir información importante (por ejemplo, no uso solo rojo para indicar error sin un ícono o texto adicional).'
			},
			{
				id: 8,
				text: 'Evito combinaciones problemáticas para personas con daltonismo: rojo/verde, azul/morado, verde/marrón.'
			}
		]
	},
	{
		id: 'imagenes',
		title: '3. Imágenes y elementos visuales',
		icon: Image,
		accent: 'bg-amber-50 text-amber-900 border-amber-200',
		items: [
			{
				id: 9,
				text: 'Todas las imágenes informativas tienen texto alternativo (alt text) que describe su contenido y función.'
			},
			{
				id: 10,
				text: 'Las imágenes puramente decorativas están marcadas como tales (alt vacío) para que los lectores de pantalla las ignoren.'
			},
			{
				id: 11,
				text: 'Los gráficos y diagramas complejos tienen una descripción detallada en el texto cercano.'
			}
		]
	},
	{
		id: 'estructura',
		title: '4. Estructura del documento',
		icon: FileText,
		accent: 'bg-indigo-50 text-indigo-900 border-indigo-200',
		items: [
			{
				id: 12,
				text: 'Uso estilos de encabezado reales (H1, H2, H3) en lugar de solo agrandar o poner en negrita el texto.'
			},
			{
				id: 13,
				text: 'El documento tiene un título descriptivo configurado en sus propiedades.'
			},
			{
				id: 14,
				text: 'Las listas están creadas con la función de lista del programa, no con guiones o asteriscos manuales.'
			},
			{
				id: 15,
				text: 'Las tablas tienen encabezados de fila y/o columna definidos correctamente y no se usan solo para maquetar el diseño.'
			}
		]
	},
	{
		id: 'multimedia',
		title: '5. Contenido multimedia',
		icon: Video,
		accent: 'bg-purple-50 text-purple-900 border-purple-200',
		items: [
			{
				id: 16,
				text: 'Los videos tienen subtítulos precisos (no solo los generados automáticamente sin revisión).'
			},
			{
				id: 17,
				text: 'Los audios tienen transcripción completa disponible.'
			},
			{
				id: 18,
				text: 'Ningún elemento parpadea más de 3 veces por segundo.'
			}
		]
	},
	{
		id: 'formato',
		title: '6. Formato de entrega',
		icon: Share2,
		accent: 'bg-teal-50 text-teal-900 border-teal-200',
		items: [
			{
				id: 19,
				text: 'Si entrego un PDF, fue exportado con etiquetas de accesibilidad activadas (no impreso a PDF ni escaneado como imagen).'
			},
			{
				id: 20,
				text: 'Ofrezco el material en más de un formato cuando es posible (por ejemplo, PDF + versión en texto plano o Google Docs).'
			}
		]
	}
];

const STORAGE_KEY = 'mb_checklist_accesibilidad_v1';

export default function Section2() {
	const [checkedIds, setCheckedIds] = useState(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			return saved ? JSON.parse(saved) : [];
		} catch {
			return [];
		}
	});
	const [email, setEmail] = useState('');
	const [emailSent, setEmailSent] = useState(false);

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedIds));
		} catch {
			// Ignore storage errors
		}
	}, [checkedIds]);

	const toggleItem = (id) => {
		setCheckedIds((prev) =>
			prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
		);
	};

	const resetChecklist = () => {
		setCheckedIds([]);
	};

	const markAll = () => {
		setCheckedIds(Array.from({ length: 20 }, (_, i) => i + 1));
	};

	const handleEmailSubmit = (e) => {
		e.preventDefault();
		if (!email.trim()) return;
		setEmailSent(true);
		const subject = encodeURIComponent('Solicitud de Checklist de Accesibilidad en PDF');
		const body = encodeURIComponent(
			`Hola Mónica,\n\nMe gustaría recibir la versión descargable en PDF del Checklist de Accesibilidad de 20 puntos en mi correo: ${email}\n\n¡Muchas gracias!`
		);
		window.open(`mailto:meb@monicabattaglia.com?subject=${subject}&body=${body}`, '_blank');
	};

	const totalChecked = checkedIds.length;
	const progressPercent = Math.round((totalChecked / 20) * 100);

	return (
		<section className="bg-[#f8fafc] py-12 md:py-16">
			<div className="mx-auto max-w-5xl px-6">
				{/* Introducción clara y legible */}
				<div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
					<p className="text-base leading-relaxed text-slate-700 sm:text-lg">
						Este <strong className="font-bold text-[#1b365d]">checklist de 20 puntos</strong> está pensado para que
						puedas revisar cualquier material educativo antes de compartirlo con tus estudiantes. No necesitás
						conocimientos técnicos avanzados: cada punto tiene una acción concreta y verificable.
					</p>
				</div>

				{/* Barra de progreso interactiva fija al hacer scroll */}
				<div
					id="checklist-interactivo"
					className="sticky top-20 z-20 mt-8 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-md backdrop-blur sm:p-5"
				>
					<div className="flex flex-wrap items-center justify-between gap-4">
						<div className="flex items-center gap-3">
							<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1d7a4a]/10 text-lg font-extrabold text-[#1d7a4a]">
								{totalChecked}/20
							</div>
							<div>
								<h2 className="text-base font-bold text-[#1b365d] sm:text-lg">
									Tu progreso de revisión ({progressPercent}%)
								</h2>
								<p className="text-xs text-slate-500 sm:text-sm">
									{totalChecked === 0 && 'Hacé clic en cada punto a medida que revisás tu material.'}
									{totalChecked > 0 && totalChecked < 15 && '¡Buen comienzo! Seguí marcando los puntos que cumple tu recurso.'}
									{totalChecked >= 15 && totalChecked < 20 && '¡Muy bien! Tu material ya tiene una base sólida de accesibilidad.'}
									{totalChecked === 20 && '🎉 ¡Felicitaciones! Tu material cumple los 20 criterios de accesibilidad.'}
								</p>
							</div>
						</div>

						<div className="flex flex-wrap items-center gap-2 print:hidden">
							<button
								type="button"
								onClick={markAll}
								className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
							>
								<CheckCircle2 className="h-3.5 w-3.5 text-[#1d7a4a]" />
								Marcar todos
							</button>
							<button
								type="button"
								onClick={resetChecklist}
								className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-rose-50 hover:text-rose-700"
							>
								<RotateCcw className="h-3.5 w-3.5" />
								Reiniciar
							</button>
							<button
								type="button"
								onClick={() => window.print()}
								className="inline-flex items-center gap-1.5 rounded-lg bg-[#1b365d] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#152a4a]"
							>
								<Printer className="h-3.5 w-3.5" />
								Imprimir
							</button>
						</div>
					</div>

					<div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
						<div
							className="h-full rounded-full bg-gradient-to-r from-[#1b365d] to-[#1d7a4a] transition-all duration-300"
							style={{ width: `${progressPercent}%` }}
						/>
					</div>
				</div>

				{/* Las 6 secciones del Checklist */}
				<div className="mt-8 space-y-6">
					{CHECKLIST_SECTIONS.map((section) => {
						const IconComponent = section.icon;
						const sectionCheckedCount = section.items.filter((i) => checkedIds.includes(i.id)).length;

						return (
							<div
								key={section.id}
								className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm transition hover:shadow-md"
							>
								<div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-6 py-4">
									<div className="flex items-center gap-3">
										<span
											className={`flex h-10 w-10 items-center justify-center rounded-xl border ${section.accent}`}
										>
											<IconComponent className="h-5 w-5" />
										</span>
										<h3
											className="text-lg font-bold text-[#1b365d] sm:text-xl"
											style={{ fontFamily: 'var(--font-primary)' }}
										>
											{section.title}
										</h3>
									</div>
									<span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
										{sectionCheckedCount} de {section.items.length} completados
									</span>
								</div>

								<div className="divide-y divide-slate-100 p-4 sm:p-6">
									{section.items.map((item) => {
										const isChecked = checkedIds.includes(item.id);
										return (
											<label
												key={item.id}
												onClick={() => toggleItem(item.id)}
												className={`group flex cursor-pointer items-start gap-4 rounded-2xl p-3.5 transition-all ${
													isChecked
														? 'bg-[#e3f1ea]/50 text-[#1b365d]'
														: 'hover:bg-slate-50 text-slate-700'
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
													<span className="mr-2 inline-block rounded bg-slate-100 px-2 py-0.5 text-xs font-bold text-[#1b365d]">
														#{item.id}
													</span>
													<span
														className={`text-base leading-relaxed ${
															isChecked ? 'font-medium text-[#1b365d] line-through decoration-[#1d7a4a]/50' : 'text-slate-700'
														}`}
													>
														{item.text}
													</span>
												</div>
											</label>
										);
									})}
								</div>
							</div>
						);
					})}
				</div>

				{/* Cómo usar este checklist (3 pasos) */}
				<div className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1b365d]/10 text-[#1b365d]">
							<BookOpen className="h-5 w-5" />
						</div>
						<h3
							className="text-xl font-bold text-[#1b365d] sm:text-2xl"
							style={{ fontFamily: 'var(--font-primary)' }}
						>
							Cómo usar este checklist sin abrumarte
						</h3>
					</div>

					<p className="mt-3 text-base text-slate-600">
						No intentes aplicar los 20 puntos de golpe si recién empezás. Te propongo este recorrido gradual:
					</p>

					<div className="mt-6 grid gap-4 md:grid-cols-3">
						<div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5">
							<span className="inline-flex rounded-full bg-[#1b365d] px-3 py-1 text-xs font-bold text-white">
								Semana 1
							</span>
							<h4 className="mt-3 text-base font-bold text-[#1b365d]">
								Secciones 1 y 2: Tipografía y Contraste
							</h4>
							<p className="mt-2 text-sm leading-relaxed text-slate-600">
								Son los cambios más rápidos de aplicar y los que generan mayor impacto inmediato en la lectura dentro del aula.
							</p>
						</div>

						<div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5">
							<span className="inline-flex rounded-full bg-[#1d7a4a] px-3 py-1 text-xs font-bold text-white">
								Semana 2
							</span>
							<h4 className="mt-3 text-base font-bold text-[#1b365d]">
								Secciones 3 y 4: Imágenes y Estructura
							</h4>
							<p className="mt-2 text-sm leading-relaxed text-slate-600">
								Incorporá encabezados reales (H1, H2) y texto alternativo a medida que creás materiales nuevos.
							</p>
						</div>

						<div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5">
							<span className="inline-flex rounded-full bg-amber-600 px-3 py-1 text-xs font-bold text-white">
								Semana 3
							</span>
							<h4 className="mt-3 text-base font-bold text-[#1b365d]">
								Secciones 5 y 6: Multimedia y Formato
							</h4>
							<p className="mt-2 text-sm leading-relaxed text-slate-600">
								Revisá cómo exportás tus PDFs (con etiquetas activadas) y sumá subtítulos o transcripciones.
							</p>
						</div>
					</div>
				</div>

				{/* Caja para recibir versión PDF por email + enlace al Evaluador */}
				<div className="mt-10 grid gap-6 lg:grid-cols-12 print:hidden">
					<div className="rounded-3xl border border-[#1d7a4a]/25 bg-gradient-to-br from-[#e3f1ea] via-white to-[#e9eff5] p-6 shadow-sm sm:p-8 lg:col-span-7">
						<div className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1 text-xs font-bold text-[#1d7a4a] shadow-sm">
							<Mail className="h-3.5 w-3.5" />
							Versión descargable para imprimir
						</div>
						<h3
							className="mt-4 text-xl font-bold text-[#1b365d] sm:text-2xl"
							style={{ fontFamily: 'var(--font-primary)' }}
						>
							¿Querés recibir este checklist en formato PDF?
						</h3>
						<p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
							Dejame tu correo electrónico y te envío la versión lista para imprimir o tener siempre a mano en tu escritorio docente.
						</p>

						<form onSubmit={handleEmailSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
							<input
								type="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Ingresá tu email docente..."
								className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:border-[#1d7a4a] focus:outline-none focus:ring-2 focus:ring-[#1d7a4a]/20"
							/>
							<button
								type="submit"
								className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1b365d] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#142947]"
							>
								<Mail className="h-4 w-4" />
								Solicitar PDF Gratis
							</button>
						</form>
						{emailSent && (
							<p className="mt-3 text-xs font-semibold text-[#1d7a4a]">
								✓ Se abrió tu cliente de correo para enviarte el PDF directamente. También podés pulsar "Imprimir / Guardar PDF" arriba para guardarlo ahora mismo.
							</p>
						)}
					</div>

					<div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-[#1b365d] p-6 text-white shadow-sm sm:p-8 lg:col-span-5">
						<div>
							<span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-[#74c69d]">
								<Sparkles className="h-3.5 w-3.5" />
								Herramienta Interactiva
							</span>
							<h3
								className="mt-4 text-xl font-bold text-white sm:text-2xl"
								style={{ fontFamily: 'var(--font-primary)' }}
							>
								¿Preferís un diagnóstico con gráfico y puntaje?
							</h3>
							<p className="mt-2 text-sm leading-relaxed text-slate-200">
								Probá gratis el <strong className="text-white">Evaluador Interactivo de Accesibilidad</strong> y obtené un gráfico radar con recomendaciones para tu material.
							</p>
						</div>

						<div className="mt-6">
							<Link
								to="/evaluador-de-accesibilidad-de-materiales-didacticos"
								className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#74c69d] px-5 py-3.5 text-sm font-bold text-[#1b365d] transition hover:bg-[#5bb887]"
							>
								Abrir Evaluador Interactivo
							</Link>
						</div>
					</div>
				</div>

				{/* Barra de compartir por WhatsApp y recomendación de ClaseIAXpress */}
				<div className="mt-12 print:hidden">
					<TeacherShareBar
						title="Checklist de 20 puntos de Accesibilidad para Materiales Educativos"
						urlPath="/blogchecklist-accesibilidad-materiales-educativos"
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
