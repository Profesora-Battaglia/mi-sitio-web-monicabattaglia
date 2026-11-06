import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
	ArrowLeft,
	Volume2,
	VolumeX,
	RotateCcw,
	Lightbulb,
	KeyRound,
	Lock,
	Award,
	Printer,
	Sparkles,
	Play,
	CheckCircle2,
	AlertTriangle,
	Maximize2,
	Minimize2
} from 'lucide-react';

const STORAGE_KEY = 'mb_escape_mayo1810_v2';

const HINTS = {
	1: 'Recordá: Los SUSTANTIVOS (S) nombran cosas, personas o conceptos (como "pueblo" o "revolución"). Los ADJETIVOS (A) dicen cómo son ("valientes"). Los VERBOS (V) indican acciones ("reunir").',
	2: '¡Vamos por partes! Primero dividí 150 entre 5 para saber cuántas fueron a los Patricios (30). Luego, dividí 150 entre 3 y al resultado multiplicalo por 2 para los vecinos (100). Sumá ambos grupos y restáselo a las 150 iniciales.',
	3: 'Pista 1: ¿Quiénes exigen? (Los criollos...). Pista 2: Tiene signos de admiración (¡!). Pista 3: Lo contrario a estar oprimido es ser libre. Pista 4: Los verbos en infinitivo terminan en -ar, -er, -ir.',
	4: '¡No hace falta adivinar! Mirá la última fila horizontal: tenés el 4, el 9 y el paraguas (🌂). Si4 + 9 es 13... ¿cuánto falta para llegar a 15? (También podés mirar la última columna vertical: 8 + 5 + 🌂 = 15).'
};

export default function Section1() {
	const [gameState, setGameState] = useState(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				const parsed = JSON.parse(saved);
				return {
					playerName: parsed.playerName || '',
					playerGrade: parsed.playerGrade || '',
					currentRoom: typeof parsed.currentRoom === 'number' ? parsed.currentRoom : 0
				};
			}
		} catch {
			// Ignore storage errors
		}
		return {
			playerName: '',
			playerGrade: '',
			currentRoom: 0
		};
	});

	const [soundOn, setSoundOn] = useState(true);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [showHint, setShowHint] = useState(false);
	const [feedback, setFeedback] = useState({ room: null, type: '', message: '' });

	// Inputs per room
	const [r1Words, setR1Words] = useState({ w1: '', w2: '', w3: '', w4: '' });
	const [r1Code, setR1Code] = useState('');
	const [r2Code, setR2Code] = useState('');
	const [r3Choices, setR3Choices] = useState({ q1: '', q2: '', q3: '', q4: '' });
	const [r3Code, setR3Code] = useState('');
	const [r4Code, setR4Code] = useState('');

	const audioCtxRef = useRef(null);

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
		} catch {
			// Ignore storage errors
		}
	}, [gameState]);

	const playTone = (type) => {
		if (!soundOn) return;
		try {
			const AudioCtx = window.AudioContext || window.webkitAudioContext;
			if (!AudioCtx) return;
			if (!audioCtxRef.current) {
				audioCtxRef.current = new AudioCtx();
			}
			const ctx = audioCtxRef.current;
			if (ctx.state === 'suspended') ctx.resume();
			const now = ctx.currentTime;

			if (type === 'click') {
				const osc = ctx.createOscillator();
				const gain = ctx.createGain();
				osc.type = 'triangle';
				osc.frequency.setValueAtTime(520, now);
				osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);
				gain.gain.setValueAtTime(0.15, now);
				gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
				osc.connect(gain);
				gain.connect(ctx.destination);
				osc.start(now);
				osc.stop(now + 0.08);
			} else if (type === 'error') {
				const osc = ctx.createOscillator();
				const gain = ctx.createGain();
				osc.type = 'sawtooth';
				osc.frequency.setValueAtTime(160, now);
				osc.frequency.setValueAtTime(125, now + 0.14);
				gain.gain.setValueAtTime(0.18, now);
				gain.gain.linearRampToValueAtTime(0.01, now + 0.32);
				osc.connect(gain);
				gain.connect(ctx.destination);
				osc.start(now);
				osc.stop(now + 0.32);
			} else if (type === 'success') {
				const notes = [261.63, 329.63, 392.0, 523.25];
				notes.forEach((freq, i) => {
					const osc = ctx.createOscillator();
					const gain = ctx.createGain();
					osc.type = 'triangle';
					osc.frequency.setValueAtTime(freq, now + i * 0.1);
					gain.gain.setValueAtTime(0.18, now + i * 0.1);
					gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.35);
					osc.connect(gain);
					gain.connect(ctx.destination);
					osc.start(now + i * 0.1);
					osc.stop(now + i * 0.1 + 0.35);
				});
			}
		} catch {
			// Ignore audio errors
		}
	};

	const handleStartMission = (e) => {
		e.preventDefault();
		playTone('success');
		setFeedback({ room: null, type: '', message: '' });
		setGameState((prev) => ({
			...prev,
			playerName: prev.playerName.trim() || 'Patriota Anónimo',
			playerGrade: prev.playerGrade.trim() || '5° / 6° Grado',
			currentRoom: 1
		}));
	};

	const handleResetMission = () => {
		playTone('click');
		setR1Words({ w1: '', w2: '', w3: '', w4: '' });
		setR1Code('');
		setR2Code('');
		setR3Choices({ q1: '', q2: '', q3: '', q4: '' });
		setR3Code('');
		setR4Code('');
		setFeedback({ room: null, type: '', message: '' });
		setGameState({ playerName: '', playerGrade: '', currentRoom: 0 });
	};

	const updateR1Word = (key, val) => {
		playTone('click');
		const updated = { ...r1Words, [key]: val };
		setR1Words(updated);
		const autoCode = `${updated.w1}${updated.w2}${updated.w3}${updated.w4}`;
		if (autoCode.length > 0) setR1Code(autoCode);
	};

	const updateR3Choice = (key, val) => {
		playTone('click');
		const updated = { ...r3Choices, [key]: val };
		setR3Choices(updated);
		const autoCode = `${updated.q1}${updated.q2}${updated.q3}${updated.q4}`;
		if (autoCode.length > 0) setR3Code(autoCode);
	};

	const verifyRoom1 = (e) => {
		e.preventDefault();
		const clean = r1Code.trim().toUpperCase();
		if (clean === 'SAVS') {
			playTone('success');
			setFeedback({
				room: 1,
				type: 'success',
				message: '¡Excelente, Chasqui! "Pueblo" (Sustantivo), "Valientes" (Adjetivo), "Reunir" (Verbo) y "Revolución" (Sustantivo). ¡Avanzás a la Plaza!'
			});
			setTimeout(() => {
				setFeedback({ room: null, type: '', message: '' });
				setGameState((prev) => ({ ...prev, currentRoom: 2 }));
			}, 1600);
		} else {
			playTone('error');
			setFeedback({
				room: 1,
				type: 'error',
				message: 'La clave aún no es correcta. Revisá las 4 iniciales de las clases de palabras en orden (S, A, V).'
			});
		}
	};

	const verifyRoom2 = (e) => {
		e.preventDefault();
		const num = parseInt(r2Code.trim(), 10);
		if (num === 20) {
			playTone('success');
			setFeedback({
				room: 2,
				type: 'success',
				message: '¡Cálculo perfecto! 30 para los Patricios + 100 para los vecinos = 130 repartidas. ¡Quedan 20 escarapelas!'
			});
			setTimeout(() => {
				setFeedback({ room: null, type: '', message: '' });
				setGameState((prev) => ({ ...prev, currentRoom: 3 }));
			}, 1600);
		} else {
			playTone('error');
			setFeedback({
				room: 2,
				type: 'error',
				message:
					num === 130
						? '¡Casi! 130 son las escarapelas que ya repartieron. ¿Cuántas quedan en el cofre de 150?'
						: 'El número no es exacto. Calculá 1/5 de 150 y 2/3 de 150, sumalos y restalos a 150.'
			});
		}
	};

	const verifyRoom3 = (e) => {
		e.preventDefault();
		const clean = r3Code.trim().toUpperCase();
		if (clean === 'PATR') {
			playTone('success');
			setFeedback({
				room: 3,
				type: 'success',
				message: '¡Imprenta en marcha! Las letras P-A-T-R activan los moldes y abren las puertas del Cabildo.'
			});
			setTimeout(() => {
				setFeedback({ room: null, type: '', message: '' });
				setGameState((prev) => ({ ...prev, currentRoom: 4 }));
			}, 1600);
		} else {
			playTone('error');
			setFeedback({
				room: 3,
				type: 'error',
				message: 'Los moldes de imprenta no encajan. Revisá las letras de tus 4 respuestas en orden.'
			});
		}
	};

	const verifyRoom4 = (e) => {
		e.preventDefault();
		const num = parseInt(r4Code.trim(), 10);
		if (num === 2) {
			playTone('success');
			setFeedback({
				room: 4,
				type: 'success',
				message: '¡El cerrojo del Cabildo se abrió! 4 + 9 + 2 = 15. ¡Viva la Patria!'
			});
			setTimeout(() => {
				setFeedback({ room: null, type: '', message: '' });
				setGameState((prev) => ({ ...prev, currentRoom: 5 }));
			}, 1600);
		} else {
			playTone('error');
			setFeedback({
				room: 4,
				type: 'error',
				message: 'Ese no es el número oculto tras el paraguas. Mirá la última fila: 4 + 9 + 🌂 = 15.'
			});
		}
	};

	const progressPercent =
		gameState.currentRoom === 0
			? 0
			: gameState.currentRoom >= 5
			? 100
			: Math.round(((gameState.currentRoom - 1) / 4) * 100);

	return (
		<section className="bg-gradient-to-b from-[#e9eff5] via-[#f8fafc] to-white pt-10 pb-14">
			<div className="mx-auto max-w-6xl px-6">
				{/* Navegación superior y etiquetas */}
				<div className="mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
					<Link
						to="/recursos-para-docentes"
						className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#1b365d] shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-[#1d7a4a]"
					>
						<ArrowLeft className="h-4 w-4" />
						Volver a Recursos para Docentes
					</Link>
					<div className="flex flex-wrap items-center gap-2">
						<span className="inline-flex items-center gap-1.5 rounded-full bg-[#1b365d]/10 px-3.5 py-1.5 text-xs font-bold text-[#1b365d]">
							<Sparkles className="h-3.5 w-3.5 text-[#1d7a4a]" />
							Escape Room Educativo · Lengua y Matemática
						</span>
						<a
							href="#guia-docente"
							className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-[#1d7a4a] ring-1 ring-[#1d7a4a]/30 transition hover:bg-[#e3f1ea]"
						>
							Ver Guía y Respuestas para el Docente ↓
						</a>
					</div>
				</div>

				{/* Encabezado de alto contraste (reemplaza el texto blanco sobre celeste que no se leía) */}
				<div className="mb-8 text-center print:hidden">
					<h1
						className="text-3xl font-extrabold leading-tight text-[#1b365d] sm:text-4xl lg:text-5xl"
						style={{ fontFamily: 'var(--font-primary)' }}
					>
						Juego Interactivo: La Revolución de Mayo
					</h1>
					<p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
						<strong className="text-[#1b365d]">"Misión: El Grito de Libertad (Mayo de 1810)"</strong> — Una aventura
						interactiva lista para proyectar en el aula o jugar en celulares, tablets y computadoras, con pistas
						pedagógicas y Diploma de Honor imprimible.
					</p>
				</div>

				{/* Contenedor Principal del Escape Room Nativo */}
				<div
					className={`overflow-hidden rounded-3xl border-2 border-[#b45309]/40 bg-[#fdfbf7] shadow-2xl transition-all ${
						isFullscreen ? 'fixed inset-3 z-50 overflow-y-auto' : 'relative'
					}`}
				>
					{/* Barra Superior Colonial */}
					<div className="flex flex-wrap items-center justify-between gap-3 border-b-4 border-[#d97706] bg-[#1e3a8a] px-5 py-3.5 text-white print:hidden">
						<div className="flex items-center gap-3">
							<span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-200 text-lg text-[#1e3a8a] shadow-inner">
								☀️
							</span>
							<div>
								<h2 className="text-base font-extrabold tracking-wide text-amber-300 sm:text-lg">
									MISIÓN: MAYO DE 1810
								</h2>
								<p className="text-xs text-sky-100">
									{gameState.playerName
										? `Chasqui: ${gameState.playerName} (${gameState.playerGrade})`
										: 'Escape Room Histórico · Buenos Aires Colonial'}
								</p>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={() => setSoundOn((s) => !s)}
								className="inline-flex items-center gap-1.5 rounded-full bg-blue-800/90 px-3 py-1.5 text-xs font-bold text-amber-200 ring-1 ring-amber-400/40 transition hover:bg-blue-700"
								title="Activar/Desactivar sonidos"
							>
								{soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
								<span className="hidden sm:inline">{soundOn ? 'Sonido Sí' : 'Sin Sonido'}</span>
							</button>

							{gameState.currentRoom > 0 && (
								<button
									type="button"
									onClick={handleResetMission}
									className="inline-flex items-center gap-1.5 rounded-full bg-rose-700/90 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-rose-600"
									title="Reiniciar misión desde cero"
								>
									<RotateCcw className="h-3.5 w-3.5" />
									<span>Reiniciar</span>
								</button>
							)}

							<button
								type="button"
								onClick={() => setIsFullscreen((f) => !f)}
								className="inline-flex items-center gap-1.5 rounded-full bg-blue-800/90 px-3 py-1.5 text-xs font-bold text-white ring-1 ring-white/20 transition hover:bg-blue-700"
							>
								{isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
								<span className="hidden sm:inline">
									{isFullscreen ? 'Salir de Pantalla Completa' : 'Pantalla Completa'}
								</span>
							</button>
						</div>
					</div>

					{/* Barra de Progreso y Cabildo Iluminado */}
					{gameState.currentRoom >= 1 && gameState.currentRoom <= 4 && (
						<div className="border-b border-amber-200/80 bg-amber-50/70 px-6 py-4 print:hidden">
							<div className="flex flex-wrap items-center justify-between gap-4">
								<div className="flex items-center gap-3">
									<span className="rounded-full bg-[#1e3a8a] px-3 py-1 text-xs font-extrabold text-amber-300">
										Sala {gameState.currentRoom} de 4
									</span>
									<span className="text-xs font-bold text-slate-700 sm:text-sm">
										Progreso hacia el Primer Gobierno Patrio ({progressPercent}%)
									</span>
								</div>

								{/* Mini Cabildo con 4 ventanas que se encienden */}
								<div className="flex items-center gap-2">
									{[1, 2, 3, 4].map((step) => {
										const done = gameState.currentRoom > step;
										const active = gameState.currentRoom === step;
										return (
											<div
												key={step}
												className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-extrabold transition-all ${
													done
														? 'border-amber-500 bg-amber-400 text-[#1e3a8a] shadow-sm'
														: active
														? 'border-[#1e3a8a] bg-[#1e3a8a] text-white ring-2 ring-amber-400'
														: 'border-slate-300 bg-white text-slate-400'
												}`}
												title={`Sala ${step}`}
											>
												{done ? '✓' : step}
											</div>
										);
									})}
								</div>
							</div>

							<div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-amber-200/60">
								<div
									className="h-full rounded-full bg-gradient-to-r from-[#1e3a8a] via-sky-500 to-amber-500 transition-all duration-500"
									style={{ width: `${progressPercent}%` }}
								/>
							</div>
						</div>
					)}

					{/* Cuerpo de las Salas */}
					<div className="p-6 sm:p-10">
						{/* SALA 0: PORTADA E INGRESO DE NOMBRE */}
						{gameState.currentRoom === 0 && (
							<div className="mx-auto max-w-3xl text-center">
								<div className="inline-flex items-center gap-2 rounded-full border border-sky-300 bg-sky-100 px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-[#1e3a8a]">
									Virreinato del Río de la Plata · 25 de Mayo de 1810
								</div>
								<h3
									className="mt-4 text-3xl font-extrabold text-[#1e3a8a] sm:text-4xl"
									style={{ fontFamily: 'var(--font-primary)' }}
								>
									El Secreto del Cabildo
								</h3>

								<div className="mt-6 rounded-2xl border-l-4 border-[#1e3a8a] bg-white p-6 text-left shadow-sm">
									<p className="text-base leading-relaxed text-slate-700">
										¡Atención, joven patriota! Corre el mes de <strong>mayo de 1810</strong> en la lluviosa
										ciudad de Buenos Aires. Las noticias de España han llegado y el pueblo quiere saber de qué
										se trata.
									</p>
									<p className="mt-3 text-base leading-relaxed text-slate-700">
										Tu misión como <strong>Chasqui Secreto</strong> es superar{' '}
										<strong>4 postas históricas</strong> resolviendo desafíos de{' '}
										<span className="font-bold text-[#1e3a8a]">Lengua</span> y{' '}
										<span className="font-bold text-amber-700">Matemática</span> para abrir el cerrojo del
										Cabildo y anunciar la libertad.
									</p>
								</div>

								<form
									onSubmit={handleStartMission}
									className="mx-auto mt-8 max-w-md rounded-2xl border border-amber-300 bg-amber-50/70 p-6 shadow-md"
								>
									<label className="block text-left text-sm font-bold text-[#1e3a8a]">
										Escribí tu Nombre o el de tu Equipo de Patriotas:
									</label>
									<input
										type="text"
										value={gameState.playerName}
										onChange={(e) =>
											setGameState((prev) => ({ ...prev, playerName: e.target.value }))
										}
										placeholder="Ej: Valentina y Mateo"
										className="mt-2 w-full rounded-xl border-2 border-amber-300 bg-white px-4 py-3 text-center text-base font-bold text-slate-800 focus:border-[#1e3a8a] focus:outline-none"
									/>

									<label className="mt-4 block text-left text-sm font-bold text-[#1e3a8a]">
										Grado / Curso:
									</label>
									<input
										type="text"
										value={gameState.playerGrade}
										onChange={(e) =>
											setGameState((prev) => ({ ...prev, playerGrade: e.target.value }))
										}
										placeholder="Ej: 5° Grado A"
										className="mt-2 w-full rounded-xl border-2 border-amber-300 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-800 focus:border-[#1e3a8a] focus:outline-none"
									/>

									<button
										type="submit"
										className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1e3a8a] px-6 py-4 text-base font-extrabold text-amber-300 shadow-lg transition hover:bg-blue-900"
									>
										<Play className="h-5 w-5 fill-current" />
										¡Comenzar la Misión!
									</button>
								</form>
							</div>
						)}

						{/* SALA 1: LA JABONERÍA DE VIEYTES (LENGUA) */}
						{gameState.currentRoom === 1 && (
							<div className="mx-auto max-w-3xl">
								<div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200 pb-4">
									<div>
										<span className="inline-block rounded-md bg-sky-100 px-2.5 py-1 text-xs font-extrabold text-[#1e3a8a]">
											SALA 1 · LENGUA (CLASES DE PALABRAS)
										</span>
										<h3 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
											🕯️ La Jabonería Secreta de Vieytes
										</h3>
									</div>
									<button
										type="button"
										onClick={() => {
											playTone('click');
											setShowHint((h) => !h);
										}}
										className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-4 py-2 text-xs font-extrabold text-amber-900 ring-1 ring-amber-400 transition hover:bg-amber-200"
									>
										<Lightbulb className="h-4 w-4 text-amber-600" />
										{showHint ? 'Ocultar Pista' : 'Pedir Pista Pedagógica'}
									</button>
								</div>

								{showHint && (
									<div className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
										<strong>💡 Pista del Sabio:</strong> {HINTS[1]}
									</div>
								)}

								<div className="mt-6 rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
									<p className="italic text-slate-600">
										"A la luz de las velas, Manuel Belgrano y Juan José Castelli redactan una carta urgente.
										Para que los realistas no la intercepten, escondieron la contraseña en 4 palabras subrayadas..."
									</p>
									<div className="mt-4 rounded-xl border border-dashed border-amber-500 bg-amber-50/70 p-4 text-center text-lg font-medium text-slate-900">
										«El <u className="font-extrabold text-[#1e3a8a]">PUEBLO</u> necesita patriotas{' '}
										<u className="font-extrabold text-[#1e3a8a]">VALIENTES</u> para{' '}
										<u className="font-extrabold text-[#1e3a8a]">REUNIR</u> fuerzas e iniciar la{' '}
										<u className="font-extrabold text-[#1e3a8a]">REVOLUCIÓN</u>.»
									</div>
								</div>

								<p className="mt-6 text-sm font-bold text-slate-700 sm:text-base">
									Clasificá cada palabra en orden para descubrir el código de 4 letras:
								</p>

								<div className="mt-4 grid gap-4 sm:grid-cols-2">
									{[
										{ key: 'w1', num: 1, word: 'PUEBLO' },
										{ key: 'w2', num: 2, word: 'VALIENTES' },
										{ key: 'w3', num: 3, word: 'REUNIR' },
										{ key: 'w4', num: 4, word: 'REVOLUCIÓN' }
									].map((item) => (
										<div
											key={item.key}
											className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
										>
											<span className="text-xs font-bold uppercase text-slate-400">
												Palabra {item.num}
											</span>
											<div className="text-lg font-extrabold text-[#1e3a8a]">"{item.word}"</div>
											<select
												value={r1Words[item.key]}
												onChange={(e) => updateR1Word(item.key, e.target.value)}
												className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-800 focus:border-[#1e3a8a] focus:outline-none"
											>
												<option value="">Seleccioná clase de palabra...</option>
												<option value="S">(S) Sustantivo</option>
												<option value="A">(A) Adjetivo</option>
												<option value="V">(V) Verbo</option>
											</select>
										</div>
									))}
								</div>

								<form
									onSubmit={verifyRoom1}
									className="mt-6 rounded-2xl border-2 border-slate-300 bg-slate-100 p-5 text-center"
								>
									<label className="block text-sm font-bold text-slate-700">
										<KeyRound className="mr-1.5 inline h-4 w-4 text-amber-600" />
										Código de 4 letras (Iniciales en orden, ej: SAVS):
									</label>
									<div className="mt-3 flex flex-col justify-center gap-3 sm:flex-row">
										<input
											type="text"
											maxLength={4}
											value={r1Code}
											onChange={(e) => setR1Code(e.target.value.toUpperCase())}
											placeholder="____"
											className="w-full rounded-xl border-2 border-slate-400 bg-white px-4 py-3 text-center text-2xl font-extrabold uppercase tracking-[0.35em] text-[#1e3a8a] sm:w-48"
										/>
										<button
											type="submit"
											className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1d7a4a] px-6 py-3 text-base font-extrabold text-white shadow-md transition hover:bg-[#155d38]"
										>
											<Lock className="h-4 w-4" />
											Abrir Puerta
										</button>
									</div>
								</form>
							</div>
						)}

						{/* SALA 2: LAS ESCARAPELAS DE FRENCH Y BERUTI (MATEMÁTICA) */}
						{gameState.currentRoom === 2 && (
							<div className="mx-auto max-w-3xl">
								<div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200 pb-4">
									<div>
										<span className="inline-block rounded-md bg-amber-100 px-2.5 py-1 text-xs font-extrabold text-amber-900">
											SALA 2 · MATEMÁTICA (FRACCIONES)
										</span>
										<h3 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
											🎀 Las Cintas de French y Beruti
										</h3>
									</div>
									<button
										type="button"
										onClick={() => {
											playTone('click');
											setShowHint((h) => !h);
										}}
										className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-4 py-2 text-xs font-extrabold text-amber-900 ring-1 ring-amber-400 transition hover:bg-amber-200"
									>
										<Lightbulb className="h-4 w-4 text-amber-600" />
										{showHint ? 'Ocultar Pista' : 'Pedir Pista Pedagógica'}
									</button>
								</div>

								{showHint && (
									<div className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
										<strong>💡 Pista del Sabio:</strong> {HINTS[2]}
									</div>
								)}

								<div className="mt-6 rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
									<p className="text-base leading-relaxed text-slate-700">
										¡Llegaste a la Recova de la Plaza de la Victoria! Domingo French y Antonio Beruti están
										repartiendo cintas distintivas para identificar a los patriotas.
									</p>
									<div className="mt-5 grid gap-3 sm:grid-cols-3">
										<div className="rounded-xl bg-sky-50 p-4 text-center ring-1 ring-sky-200">
											<div className="text-2xl font-extrabold text-[#1e3a8a]">150</div>
											<div className="mt-1 text-xs font-semibold text-slate-600">
												Escarapelas en el cofre al empezar
											</div>
										</div>
										<div className="rounded-xl bg-amber-50 p-4 text-center ring-1 ring-amber-200">
											<div className="text-2xl font-extrabold text-amber-800">1/5 de 150</div>
											<div className="mt-1 text-xs font-semibold text-slate-600">
												Entregadas al Regimiento de Patricios
											</div>
										</div>
										<div className="rounded-xl bg-emerald-50 p-4 text-center ring-1 ring-emerald-200">
											<div className="text-2xl font-extrabold text-[#1d7a4a]">2/3 de 150</div>
											<div className="mt-1 text-xs font-semibold text-slate-600">
												Entregadas a los vecinos en la Plaza
											</div>
										</div>
									</div>

									<p className="mt-5 text-center text-lg font-extrabold text-[#1e3a8a]">
										¿Cuántas escarapelas quedan todavía dentro del cofre para los jóvenes chasquis?
									</p>
								</div>

								<form
									onSubmit={verifyRoom2}
									className="mt-6 rounded-2xl border-2 border-slate-300 bg-slate-100 p-5 text-center"
								>
									<label className="block text-sm font-bold text-slate-700">
										<KeyRound className="mr-1.5 inline h-4 w-4 text-amber-600" />
										Cantidad de escarapelas restantes:
									</label>
									<div className="mt-3 flex flex-col justify-center gap-3 sm:flex-row">
										<input
											type="number"
											value={r2Code}
											onChange={(e) => setR2Code(e.target.value)}
											placeholder="00"
											className="w-full rounded-xl border-2 border-slate-400 bg-white px-4 py-3 text-center text-2xl font-extrabold text-[#1e3a8a] sm:w-44"
										/>
										<button
											type="submit"
											className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1d7a4a] px-6 py-3 text-base font-extrabold text-white shadow-md transition hover:bg-[#155d38]"
										>
											<Lock className="h-4 w-4" />
											Verificar Cálculo
										</button>
									</div>
								</form>
							</div>
						)}

						{/* SALA 3: LA IMPRENTA DE LOS NIÑOS EXPÓSITOS (LENGUA) */}
						{gameState.currentRoom === 3 && (
							<div className="mx-auto max-w-3xl">
								<div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200 pb-4">
									<div>
										<span className="inline-block rounded-md bg-sky-100 px-2.5 py-1 text-xs font-extrabold text-[#1e3a8a]">
											SALA 3 · LENGUA (SINTAXIS Y VOCABULARIO)
										</span>
										<h3 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
											📜 La Imprenta de Don Hipólito
										</h3>
									</div>
									<button
										type="button"
										onClick={() => {
											playTone('click');
											setShowHint((h) => !h);
										}}
										className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-4 py-2 text-xs font-extrabold text-amber-900 ring-1 ring-amber-400 transition hover:bg-amber-200"
									>
										<Lightbulb className="h-4 w-4 text-amber-600" />
										{showHint ? 'Ocultar Pista' : 'Pedir Pista Pedagógica'}
									</button>
								</div>

								{showHint && (
									<div className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
										<strong>💡 Pista del Sabio:</strong> {HINTS[3]}
									</div>
								)}

								<p className="mt-5 text-sm leading-relaxed text-slate-700 sm:text-base">
									En la Real Imprenta de los Niños Expósitos se están preparando los bandos para convocar al
									pueblo. Elegí la opción correcta en cada pregunta para formar la clave de 4 letras:
								</p>

								<div className="mt-5 space-y-4">
									<div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
										<p className="text-sm font-bold text-slate-800">
											1. En la oración: <em>"Los criollos de Buenos Aires exigen un Cabildo Abierto"</em>, ¿cuál es el SUJETO?
										</p>
										<select
											value={r3Choices.q1}
											onChange={(e) => updateR3Choice('q1', e.target.value)}
											className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-800"
										>
											<option value="">Elegí una letra...</option>
											<option value="M">Letra M: exigen un Cabildo Abierto</option>
											<option value="P">Letra P: Los criollos de Buenos Aires</option>
											<option value="C">Letra C: un Cabildo Abierto</option>
										</select>
									</div>

									<div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
										<p className="text-sm font-bold text-slate-800">
											2. La expresión <em>"¡Viva la Patria!"</em> según la actitud del hablante es una oración:
										</p>
										<select
											value={r3Choices.q2}
											onChange={(e) => updateR3Choice('q2', e.target.value)}
											className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-800"
										>
											<option value="">Elegí una letra...</option>
											<option value="E">Letra E: Interrogativa</option>
											<option value="A">Letra A: Exclamativa</option>
											<option value="O">Letra O: Dubitativa</option>
										</select>
									</div>

									<div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
										<p className="text-sm font-bold text-slate-800">
											3. ¿Cuál es el ANTÓNIMO (significado opuesto) de la palabra <em>"OPRESIÓN"</em>?
										</p>
										<select
											value={r3Choices.q3}
											onChange={(e) => updateR3Choice('q3', e.target.value)}
											className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-800"
										>
											<option value="">Elegí una letra...</option>
											<option value="L">Letra L: Esclavitud</option>
											<option value="S">Letra S: Virreinato</option>
											<option value="T">Letra T: Libertad</option>
										</select>
									</div>

									<div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
										<p className="text-sm font-bold text-slate-800">
											4. ¿Cuál de estas palabras es un VERBO EN INFINITIVO que significa "comprometerse solemnemente por la Patria"?
										</p>
										<select
											value={r3Choices.q4}
											onChange={(e) => updateR3Choice('q4', e.target.value)}
											className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-800"
										>
											<option value="">Elegí una letra...</option>
											<option value="R">Letra R: Jurar</option>
											<option value="I">Letra I: Juramento</option>
											<option value="N">Letra N: Juraron</option>
										</select>
									</div>
								</div>

								<form
									onSubmit={verifyRoom3}
									className="mt-6 rounded-2xl border-2 border-slate-300 bg-slate-100 p-5 text-center"
								>
									<label className="block text-sm font-bold text-slate-700">
										<KeyRound className="mr-1.5 inline h-4 w-4 text-amber-600" />
										Clave de Imprenta (4 letras):
									</label>
									<div className="mt-3 flex flex-col justify-center gap-3 sm:flex-row">
										<input
											type="text"
											maxLength={4}
											value={r3Code}
											onChange={(e) => setR3Code(e.target.value.toUpperCase())}
											placeholder="____"
											className="w-full rounded-xl border-2 border-slate-400 bg-white px-4 py-3 text-center text-2xl font-extrabold uppercase tracking-[0.35em] text-[#1e3a8a] sm:w-48"
										/>
										<button
											type="submit"
											className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1d7a4a] px-6 py-3 text-base font-extrabold text-white shadow-md transition hover:bg-[#155d38]"
										>
											<Lock className="h-4 w-4" />
											Imprimir Proclama
										</button>
									</div>
								</form>
							</div>
						)}

						{/* SALA 4: EL CERROJO DEL CABILDO (CUADRADO MÁGICO) */}
						{gameState.currentRoom === 4 && (
							<div className="mx-auto max-w-3xl">
								<div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200 pb-4">
									<div>
										<span className="inline-block rounded-md bg-amber-100 px-2.5 py-1 text-xs font-extrabold text-amber-900">
											SALA FINAL · MATEMÁTICA Y LÓGICA
										</span>
										<h3 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
											🏛️ El Cerrojo de la Sala Capitular
										</h3>
									</div>
									<button
										type="button"
										onClick={() => {
											playTone('click');
											setShowHint((h) => !h);
										}}
										className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-4 py-2 text-xs font-extrabold text-amber-900 ring-1 ring-amber-400 transition hover:bg-amber-200"
									>
										<Lightbulb className="h-4 w-4 text-amber-600" />
										{showHint ? 'Ocultar Pista' : 'Pedir Pista Pedagógica'}
									</button>
								</div>

								{showHint && (
									<div className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
										<strong>💡 Pista del Sabio:</strong> {HINTS[4]}
									</div>
								)}

								<div className="mt-6 rounded-2xl border border-amber-200 bg-white p-6 text-center shadow-sm">
									<p className="text-base leading-relaxed text-slate-700">
										¡Estás frente a la gran puerta de madera del Cabildo! Para destrabar el cerrojo colonial,
										debés resolver este <strong>Cuadrado Mágico</strong> donde{' '}
										<strong className="text-[#1e3a8a]">
											todas las filas, columnas y diagonales suman siempre 15
										</strong>
										.
									</p>

									{/* Grilla 3x3 del Cuadrado Mágico */}
									<div className="mx-auto my-6 grid max-w-[260px] grid-cols-3 gap-2.5 rounded-2xl border-4 border-amber-700 bg-amber-100 p-3 shadow-inner">
										{[8, 1, 6, 3, 5, 7, 4, 9, '🌂'].map((cell, idx) => (
											<div
												key={idx}
												className={`flex h-16 items-center justify-center rounded-xl border-2 text-2xl font-extrabold ${
													cell === '🌂'
														? 'animate-pulse border-amber-500 bg-amber-300 text-3xl shadow-md'
														: 'border-amber-700/40 bg-white text-[#1e3a8a]'
												}`}
											>
												{cell}
											</div>
										))}
									</div>
									<p className="mt-2 text-base font-extrabold text-[#1e3a8a]">
										Observá la última fila (<span className="rounded bg-amber-100 px-2 py-0.5">4 + 9 + 🌂 = 15</span>) o la última columna (<span className="rounded bg-amber-100 px-2 py-0.5">6 + 7 + 🌂 = 15</span>). ¿Qué número se esconde detrás del paraguas (🌂)?
									</p>
								</div>

								<form
									onSubmit={verifyRoom4}
									className="mt-6 rounded-2xl border-2 border-slate-300 bg-slate-100 p-5 text-center"
								>
									<label className="block text-sm font-bold text-slate-700">
										<KeyRound className="mr-1.5 inline h-4 w-4 text-amber-600" />
										Número oculto tras el paraguas (🌂):
									</label>
									<div className="mt-3 flex flex-col justify-center gap-3 sm:flex-row">
										<input
											type="number"
											value={r4Code}
											onChange={(e) => setR4Code(e.target.value)}
											placeholder="?"
											className="w-full rounded-xl border-2 border-slate-400 bg-white px-4 py-3 text-center text-2xl font-extrabold text-[#1e3a8a] sm:w-44"
										/>
										<button
											type="submit"
											className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-6 py-3 text-base font-extrabold text-white shadow-md transition hover:bg-amber-700"
										>
											🔔 ¡Tocar la Campana del Cabildo!
										</button>
									</div>
								</form>
							</div>
						)}

						{/* SALA 5: VICTORIA Y DIPLOMA DE HONOR */}
						{gameState.currentRoom === 5 && (
							<div className="mx-auto max-w-3xl text-center">
								<div className="rounded-3xl border-4 border-double border-amber-600 bg-gradient-to-b from-amber-50 via-white to-sky-50 p-6 shadow-xl sm:p-10">
									<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 ring-4 ring-amber-300">
										<Award className="h-9 w-9" />
									</div>
									<p className="mt-3 text-xs font-extrabold uppercase tracking-widest text-[#1e3a8a]">
										Primera Junta de Gobierno Patrio · 25 de Mayo de 1810
									</p>
									<h3
										className="mt-2 text-3xl font-extrabold text-[#1e3a8a] sm:text-4xl"
										style={{ fontFamily: 'var(--font-primary)' }}
									>
										¡Viva la Patria! Misión Cumplida
									</h3>
									<p className="mt-2 text-sm text-slate-600">
										Por medio del presente documento histórico, el Cabildo de Buenos Aires otorga el:
									</p>

									<div className="my-6 rounded-2xl border-2 border-amber-400 bg-white p-6 shadow-inner">
										<span className="text-xs font-bold uppercase tracking-wider text-amber-700">
											Diploma de Honor de Mayo a:
										</span>
										<div className="mt-2 text-2xl font-extrabold text-[#1b365d] sm:text-3xl">
											{gameState.playerName || 'Patriota Destacado/a'}
										</div>
										<div className="mt-1 text-sm font-semibold text-slate-500">
											{gameState.playerGrade}
										</div>
										<p className="mx-auto mt-4 max-w-lg text-xs leading-relaxed text-slate-600 sm:text-sm">
											Por haber superado con ingenio, lectura comprensiva y razonamiento matemático las 4
											postas secretas hacia la libertad en la Semana de Mayo.
										</p>
									</div>

									<div className="flex flex-wrap items-center justify-center gap-3 print:hidden">
										<button
											type="button"
											onClick={() => window.print()}
											className="inline-flex items-center gap-2 rounded-xl bg-[#1e3a8a] px-6 py-3.5 text-sm font-extrabold text-white shadow-md transition hover:bg-blue-900"
										>
											<Printer className="h-4 w-4" />
											Imprimir / Guardar Diploma en PDF
										</button>
										<button
											type="button"
											onClick={handleResetMission}
											className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
										>
											<RotateCcw className="h-4 w-4" />
											Jugar con otro equipo
										</button>
									</div>
								</div>
							</div>
						)}

						{/* Mensaje de Feedback instantáneo */}
						{feedback.message && (
							<div
								className={`mx-auto mt-5 flex max-w-2xl items-center gap-3 rounded-2xl border p-4 text-sm font-bold shadow-sm ${
									feedback.type === 'success'
										? 'border-emerald-300 bg-emerald-50 text-emerald-900'
										: 'border-rose-300 bg-rose-50 text-rose-900'
								}`}
							>
								{feedback.type === 'success' ? (
									<CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
								) : (
									<AlertTriangle className="h-5 w-5 shrink-0 text-rose-600" />
								)}
								<span>{feedback.message}</span>
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
