import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
	ArrowRight,
	Check,
	Search,
	Share2,
	Sparkles,
	Gift,
	Gamepad2,
	GraduationCap,
	ExternalLink,
} from 'lucide-react';
import Reveal from '@/components/Reveal';
import TeacherShareBar from '@/components/TeacherShareBar';
import { TEACHER_RESOURCES } from '@/pages/builder/shared/catalogData';

const CATEGORIES = [
	{ id: 'todos', label: 'Todos los recursos', icon: Sparkles },
	{ id: 'gratuito', label: 'Descarga Gratuita', icon: Gift },
	{ id: 'interactivo', label: 'Apps y Juegos para el Aula', icon: Gamepad2 },
	{ id: 'premium', label: 'App IA y Cursos (Mercado Pago)', icon: GraduationCap },
];

export default function Section2() {
	const [activeCategory, setActiveCategory] = useState('todos');
	const [searchQuery, setSearchQuery] = useState('');

	const filteredResources = useMemo(() => {
		return TEACHER_RESOURCES.filter((item) => {
			const matchesCategory = activeCategory === 'todos' || item.category === activeCategory;
			const q = searchQuery.trim().toLowerCase();
			if (!q) return matchesCategory;
			const matchesText =
				item.title.toLowerCase().includes(q) ||
				item.subtitle.toLowerCase().includes(q) ||
				item.description.toLowerCase().includes(q);
			return matchesCategory && matchesText;
		});
	}, [activeCategory, searchQuery]);

	const buildShareWhatsApp = (resource) => {
		const url = resource.ctaUrl.startsWith('http')
			? resource.ctaUrl
			: `https://monicabattaglia.com${resource.ctaUrl}`;
		const text = `¡Hola! Te comparto este recurso docente de Mónica Battaglia: "${resource.title}" (${resource.priceLabel}) 👉 ${url}`;
		return `https://wa.me/?text=${encodeURIComponent(text)}`;
	};

	return (
		<section className="bg-[#f6f8fa] py-16 md:py-24">
			<div className="mx-auto max-w-7xl px-6">
				{/* Barra de filtros y buscador */}
				<div className="flex flex-col items-stretch justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm lg:flex-row lg:items-center">
					<div className="flex flex-wrap gap-2">
						{CATEGORIES.map((cat) => {
							const Icon = cat.icon;
							const isActive = activeCategory === cat.id;
							return (
								<button
									key={cat.id}
									type="button"
									onClick={() => setActiveCategory(cat.id)}
									className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
										isActive
											? 'bg-[#1d7a4a] text-white shadow-sm'
											: 'bg-slate-50 text-slate-700 hover:bg-slate-100'
									}`}
								>
									<Icon className="h-4 w-4" />
									{cat.label}
								</button>
							);
						})}
					</div>

					<div className="relative min-w-[260px]">
						<Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
						<input
							type="search"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Buscar guía, juego, checklist..."
							aria-label="Buscar recursos para docentes"
							className="w-full rounded-xl border border-slate-200 bg-[#f9fbfc] py-2.5 pl-10 pr-4 text-sm text-[#1b365d] placeholder-slate-400 focus:border-[#1d7a4a] focus:bg-white focus:outline-none"
						/>
					</div>
				</div>

				{/* Grilla de Recursos */}
				<div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					{filteredResources.map((item, idx) => (
						<Reveal key={item.id} delay={(idx % 3) * 0.08}>
							<article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#1d7a4a]/30 hover:shadow-xl">
								<div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
									<img
										src={item.image}
										alt={item.title}
										className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
										loading="lazy"
									/>
									<div className="absolute left-4 top-4 flex flex-wrap gap-2">
										<span
											className={`rounded-full px-3 py-1 text-xs font-bold shadow-sm ${
												item.isFree
													? 'bg-[#1d7a4a] text-white'
													: 'bg-[#1b365d] text-white'
											}`}
										>
											{item.priceLabel}
										</span>
										{item.badge && (
											<span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#1b365d] shadow-sm backdrop-blur">
												{item.badge}
											</span>
										)}
									</div>
								</div>

								<div className="flex flex-1 flex-col p-6 md:p-7">
									<div className="flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wider text-[#1d7a4a]">
										<span>{item.categoryLabel}</span>
										<span className="text-slate-400">{item.format}</span>
									</div>

									<h2
										className="mt-2.5 text-xl font-bold leading-snug text-[#1b365d]"
										style={{ fontFamily: 'var(--font-primary)' }}
									>
										{item.title}
									</h2>

									<p
										className="mt-2 text-sm leading-relaxed text-slate-600"
										style={{ fontFamily: 'var(--font-secondary)' }}
									>
										{item.description}
									</p>

									{item.highlights && item.highlights.length > 0 && (
										<ul className="mt-4 space-y-2 border-t border-slate-100 pt-4">
											{item.highlights.map((h) => (
												<li key={h} className="flex items-start gap-2 text-xs text-slate-700">
													<Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#1d7a4a]" />
													<span>{h}</span>
												</li>
											))}
										</ul>
									)}

									<div className="mt-auto pt-6">
										<div className="flex flex-col gap-2.5">
											{item.isInternal ? (
												<Link
													to={item.ctaUrl}
													className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1d7a4a] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#18663f] hover:shadow-md"
												>
													{item.ctaText}
													<ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
												</Link>
											) : (
												<a
													href={item.ctaUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1d7a4a] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#18663f] hover:shadow-md"
												>
													{item.ctaText}
													<ExternalLink className="h-4 w-4" />
												</a>
											)}

											{item.secondaryCtaText && item.secondaryCtaUrl && (
												<a
													href={item.secondaryCtaUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#1b365d]/20 bg-slate-50 px-5 py-2.5 text-xs font-semibold text-[#1b365d] transition-all hover:bg-[#1b365d] hover:text-white"
												>
													{item.secondaryCtaText}
												</a>
											)}

											<a
												href={buildShareWhatsApp(item)}
												target="_blank"
												rel="noopener noreferrer"
												className="inline-flex w-full items-center justify-center gap-1.5 rounded-full py-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-[#1d7a4a]"
											>
												<Share2 className="h-3.5 w-3.5" />
												Recomendar este recurso a un colega por WhatsApp
											</a>
										</div>
									</div>
								</div>
							</article>
						</Reveal>
					))}
				</div>

				{/* Barra de compartir y banner de ClaseIAXpress */}
				<div className="mt-12">
					<TeacherShareBar
						title="Recursos Gratuitos y Herramientas para Docentes | Mónica Battaglia"
						shareText="¡Mirá esta página llena de recursos gratuitos, checklists de accesibilidad y juegos interactivos para usar en clase!"
						showAppBanner={true}
					/>
				</div>
			</div>
		</section>
	);
}
