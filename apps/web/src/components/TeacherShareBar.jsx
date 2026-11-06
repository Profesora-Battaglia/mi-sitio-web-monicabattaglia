import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Share2, Sparkles, ArrowRight, Check, Copy, MessageCircle } from 'lucide-react';

export default function TeacherShareBar({
	title = 'Recurso educativo de Mónica Battaglia',
	shareText = '¡Mirá este recurso para docentes! Te puede servir para tus clases:',
	url,
	showAppBanner = true,
}) {
	const [copied, setCopied] = useState(false);

	const currentUrl =
		url || (typeof window !== 'undefined' ? window.location.href : 'https://monicabattaglia.com');

	const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
		`${shareText} ${title} 👉 ${currentUrl}`
	)}`;

	const handleCopy = async () => {
		try {
			if (navigator?.clipboard?.writeText) {
				await navigator.clipboard.writeText(currentUrl);
				setCopied(true);
				setTimeout(() => setCopied(false), 2500);
			}
		} catch {
			// Fallback silencioso
		}
	};

	return (
		<div className="mx-auto max-w-5xl px-6 py-10">
			{/* Barra de recomendación entre colegas */}
			<div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#1d7a4a]/20 bg-[#f4f9f6] p-6 shadow-sm sm:flex-row">
				<div className="flex items-center gap-3 text-center sm:text-left">
					<div className="hidden h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#1d7a4a]/15 text-[#1d7a4a] sm:flex">
						<Share2 className="h-5 w-5" />
					</div>
					<div>
						<p
							className="text-base font-bold text-[#1b365d]"
							style={{ fontFamily: 'var(--font-primary)' }}
						>
							¿Te resultó útil para tus clases?
						</p>
						<p className="text-sm text-slate-600" style={{ fontFamily: 'var(--font-secondary)' }}>
							Compartilo en el grupo de la escuela o con un colega docente que lo necesite.
						</p>
					</div>
				</div>
				<div className="flex flex-wrap items-center justify-center gap-3">
					<a
						href={whatsappShareUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-2 rounded-full bg-[#1d7a4a] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#18663f] hover:shadow-md"
					>
						<MessageCircle className="h-4 w-4" />
						Compartir con un colega por WhatsApp
					</a>
					<button
						type="button"
						onClick={handleCopy}
						className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-[#1b365d] transition-all hover:border-[#1d7a4a]/40 hover:bg-slate-50"
					>
						{copied ? (
							<>
								<Check className="h-4 w-4 text-[#1d7a4a]" />
								¡Enlace copiado!
							</>
						) : (
							<>
								<Copy className="h-4 w-4 text-slate-500" />
								Copiar enlace
							</>
						)}
					</button>
				</div>
			</div>

			{/* Banner puente hacia ClaseIAXpress */}
			{showAppBanner && (
				<div className="mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#1b365d] via-[#1f3d68] to-[#162c4b] p-8 text-white shadow-xl md:p-10">
					<div className="grid items-center gap-8 lg:grid-cols-12">
						<div className="lg:col-span-8">
							<span className="inline-flex items-center gap-2 rounded-full bg-[#74c69d]/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#74c69d]">
								<Sparkles className="h-3.5 w-3.5" />
								App ClaseIAXpress · Prueba Gratuita
							</span>
							<h3
								className="mt-3 text-2xl font-bold leading-snug text-white sm:text-3xl"
								style={{ fontFamily: 'var(--font-primary)' }}
							>
								¿Querés crear tus propias planificaciones, secuencias, rúbricas y adaptaciones DUA en 2 minutos?
							</h3>
							<p
								className="mt-3 text-base leading-relaxed text-slate-200"
								style={{ fontFamily: 'var(--font-secondary)' }}
							>
								Probá gratis <strong className="text-white">ClaseIAXpress</strong>, mi asistente pedagógico con IA alineado a los NAP y al DCP de Mendoza. Exportá directo a Word y PDF y recuperá tus fines de semana.
							</p>
						</div>
						<div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:flex-col">
							<a
								href="https://app.monicabattaglia.com/"
								target="_blank"
								rel="noopener noreferrer"
								className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#1d7a4a] px-6 py-3.5 text-center text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#18663f] hover:shadow-xl"
							>
								Probar Gratis (3 generaciones)
								<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
							</a>
							<Link
								to="/claseiaxpress"
								className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-center text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/20"
							>
								Ver qué incluye y Planes con MP
							</Link>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
