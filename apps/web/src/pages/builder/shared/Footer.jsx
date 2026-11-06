import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Share2, Sparkles, ArrowRight } from 'lucide-react';

export default function Footer() {
	const shareWebsiteWhatsApp =
		'https://wa.me/?text=' +
		encodeURIComponent(
			'¡Mirá el sitio de Mónica Battaglia! Tiene recursos gratuitos para docentes, evaluador de accesibilidad y la app ClaseIAXpress para armar planificaciones y rúbricas en minutos 👉 https://monicabattaglia.com'
		);

	return (
		<footer className="bg-[#1b365d] text-slate-200" aria-label="Pie de página">
			<div className="mx-auto max-w-7xl px-6 py-16">
				<div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
					{/* Columna 1: Marca + Ubicación Local SEO */}
					<div className="lg:col-span-4">
						<Link to="/" className="inline-block">
							<span
								className="text-2xl font-bold text-white"
								style={{ fontFamily: 'var(--font-primary)' }}
							>
								Mónica Battaglia
							</span>
						</Link>
						<p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#74c69d]">
							Consultoría Pedagógica · Accesibilidad · IA Educativa
						</p>
						<p
							className="mt-4 text-sm leading-relaxed text-slate-300"
							style={{ fontFamily: 'var(--font-secondary)' }}
						>
							Más de 25 años en el aula acompañando a docentes, equipos directivos e instituciones
							con materiales educativos accesibles (WCAG), digitalización escolar e Inteligencia
							Artificial aplicada al aula real.
						</p>
						<div className="mt-5 flex items-start gap-2.5 text-xs text-slate-300">
							<MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#74c69d]" />
							<span>
								Tupungato, Valle de Uco, Mendoza · Asesoría y capacitación online para toda Argentina y Latinoamérica.
							</span>
						</div>

						<div className="mt-6">
							<a
								href={shareWebsiteWhatsApp}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 rounded-full border border-[#74c69d]/40 bg-[#74c69d]/10 px-4 py-2 text-xs font-semibold text-[#74c69d] transition-colors hover:bg-[#74c69d] hover:text-[#1b365d]"
							>
								<Share2 className="h-3.5 w-3.5" />
								Recomendar esta web a un colega
							</a>
						</div>
					</div>

					{/* Columna 2: Navegación Principal */}
					<div className="lg:col-span-2">
						<h3
							className="text-sm font-bold uppercase tracking-wider text-white"
							style={{ fontFamily: 'var(--font-primary)' }}
						>
							Navegación
						</h3>
						<ul className="mt-4 space-y-2.5 text-sm">
							<li>
								<Link to="/" className="text-slate-300 transition-colors hover:text-[#74c69d]">
									Inicio
								</Link>
							</li>
							<li>
								<Link
									to="/claseiaxpress"
									className="inline-flex items-center gap-1.5 font-semibold text-[#74c69d] transition-colors hover:text-white"
								>
									<Sparkles className="h-3.5 w-3.5" />
									App ClaseIAXpress
								</Link>
							</li>
							<li>
								<Link
									to="/recursos-para-docentes"
									className="text-slate-300 transition-colors hover:text-[#74c69d]"
								>
									Recursos Gratis
								</Link>
							</li>
							<li>
								<Link
									to="/academia"
									className="text-slate-300 transition-colors hover:text-[#74c69d]"
								>
									Academia
								</Link>
							</li>
							<li>
								<Link
									to="/servicios-diseno-educativo"
									className="text-slate-300 transition-colors hover:text-[#74c69d]"
								>
									Servicios
								</Link>
							</li>
							<li>
								<Link
									to="/portfolio-de-proyectos-educativos"
									className="text-slate-300 transition-colors hover:text-[#74c69d]"
								>
									Portafolio
								</Link>
							</li>
							<li>
								<Link
									to="/blog-accesibilidad"
									className="text-slate-300 transition-colors hover:text-[#74c69d]"
								>
									Blog y Guías
								</Link>
							</li>
							<li>
								<Link
									to="/sobre-mi-materiales-educativos"
									className="text-slate-300 transition-colors hover:text-[#74c69d]"
								>
									Sobre mí
								</Link>
							</li>
							<li>
								<Link
									to="/contacto-diseno-educativo"
									className="text-slate-300 transition-colors hover:text-[#74c69d]"
								>
									Agendar consulta
								</Link>
							</li>
						</ul>
					</div>

					{/* Columna 3: Herramientas y Recursos Destacados */}
					<div className="lg:col-span-3">
						<h3
							className="text-sm font-bold uppercase tracking-wider text-white"
							style={{ fontFamily: 'var(--font-primary)' }}
						>
							Recursos Gratis y Herramientas
						</h3>
						<ul className="mt-4 space-y-2.5 text-sm">
							<li>
								<Link
									to="/recursos-para-docentes"
									className="text-slate-300 transition-colors hover:text-[#74c69d]"
								>
									Centro de Recursos y Descargas
								</Link>
							</li>
							<li>
								<Link
									to="/evaluador-de-accesibilidad-de-materiales-didacticos"
									className="text-slate-300 transition-colors hover:text-[#74c69d]"
								>
									Evaluador de Accesibilidad (App Gratis)
								</Link>
							</li>
							<li>
								<Link
									to="/juego-interactivo-revolucion-de-mayo"
									className="text-slate-300 transition-colors hover:text-[#74c69d]"
								>
									Escape Room Revolución de Mayo
								</Link>
							</li>
							<li>
								<Link
									to="/blogchecklist-accesibilidad-materiales-educativos"
									className="text-slate-300 transition-colors hover:text-[#74c69d]"
								>
									Checklist de 20 Puntos (Interactivo)
								</Link>
							</li>
							<li>
								<Link
									to="/blogcomo-crear-pdf-accesible-docentes"
									className="text-slate-300 transition-colors hover:text-[#74c69d]"
								>
									Guía: Cómo crear PDFs accesibles
								</Link>
							</li>
							<li>
								<Link
									to="/materiales-accesibles-ordenados-guia"
									className="text-slate-300 transition-colors hover:text-[#74c69d]"
								>
									Guía: Materiales accesibles y ordenados
								</Link>
							</li>
						</ul>
					</div>

					{/* Columna 4: Contacto Directo y Redes */}
					<div className="lg:col-span-3">
						<h3
							className="text-sm font-bold uppercase tracking-wider text-white"
							style={{ fontFamily: 'var(--font-primary)' }}
						>
							Contacto Directo
						</h3>
						<ul className="mt-4 space-y-3 text-sm">
							<li>
								<a
									href="mailto:meb@monicabattaglia.com"
									className="flex items-center gap-2.5 text-slate-300 transition-colors hover:text-[#74c69d]"
								>
									<Mail className="h-4 w-4 flex-shrink-0 text-[#74c69d]" />
									<span>meb@monicabattaglia.com</span>
								</a>
							</li>
							<li>
								<a
									href="https://wa.me/5492622662596"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-2.5 text-slate-300 transition-colors hover:text-[#74c69d]"
								>
									<Phone className="h-4 w-4 flex-shrink-0 text-[#74c69d]" />
									<span>+54 9 262 266-2596 (WhatsApp)</span>
								</a>
							</li>
						</ul>

						{/* Redes Sociales */}
						<div className="mt-5 flex items-center gap-4">
							<a
								href="https://www.instagram.com/mbattagliaar"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Instagram de Mónica Battaglia"
								className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-[#1d7a4a]"
							>
								<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
									<path d="M12.0027 5.84808C8.59743 5.84808 5.85075 8.59477 5.85075 12C5.85075 15.4053 8.59743 18.1519 12.0027 18.1519C15.4079 18.1519 18.1546 15.4053 18.1546 12C18.1546 8.59477 15.4079 5.84808 12.0027 5.84808ZM12.0027 15.9996C9.80212 15.9996 8.00312 14.2059 8.00312 12C8.00312 9.7941 9.79677 8.00046 12.0027 8.00046C14.2086 8.00046 16.0022 9.7941 16.0022 12C16.0022 14.2059 14.2032 15.9996 12.0027 15.9996ZM19.8412 5.59644C19.8412 6.39421 19.1987 7.03135 18.4062 7.03135C17.6085 7.03135 16.9713 6.38885 16.9713 5.59644C16.9713 4.80402 17.6138 4.16153 18.4062 4.16153C19.1987 4.16153 19.8412 4.80402 19.8412 5.59644ZM23.9157 7.05277C23.8247 5.13063 23.3856 3.42801 21.9775 2.02522C20.5747 0.622429 18.8721 0.183388 16.9499 0.0870135C14.9689 -0.0254238 9.03112 -0.0254238 7.05008 0.0870135C5.1333 0.178034 3.43068 0.617075 2.02253 2.01986C0.614389 3.42265 0.180703 5.12527 0.0843279 7.04742C-0.0281093 9.02845 -0.0281093 14.9662 0.0843279 16.9472C0.175349 18.8694 0.614389 20.572 2.02253 21.9748C3.43068 23.3776 5.12794 23.8166 7.05008 23.913C9.03112 24.0254 14.9689 24.0254 16.9499 23.913C18.8721 23.822 20.5747 23.3829 21.9775 21.9748C23.3803 20.572 23.8193 18.8694 23.9157 16.9472C24.0281 14.9662 24.0281 9.03381 23.9157 7.05277Z" />
								</svg>
							</a>
							<a
								href="https://www.facebook.com/mbattagliaar"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Facebook de Mónica Battaglia"
								className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-[#1d7a4a]"
							>
								<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
									<path d="M24 12.0726C24 5.44354 18.629 0.0725708 12 0.0725708C5.37097 0.0725708 0 5.44354 0 12.0726C0 18.0619 4.38823 23.0264 10.125 23.9274V15.5414H7.07661V12.0726H10.125V9.4287C10.125 6.42144 11.9153 4.76031 14.6574 4.76031C15.9706 4.76031 17.3439 4.99451 17.3439 4.99451V7.94612H15.8303C14.34 7.94612 13.875 8.87128 13.875 9.82015V12.0726H17.2031L16.6708 15.5414H13.875V23.9274C19.6118 23.0264 24 18.0619 24 12.0726Z" />
								</svg>
							</a>
							<a
								href="https://tiktok.com/monica.battaglia94"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="TikTok de Mónica Battaglia"
								className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-[#1d7a4a]"
							>
								<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
									<path d="M22.5 9.84202C20.4357 9.84696 18.4221 9.20321 16.7435 8.00171V16.3813C16.7429 17.9333 16.2685 19.4482 15.3838 20.7233C14.499 21.9984 13.246 22.973 11.7923 23.5168C10.3387 24.0606 8.75362 24.1477 7.24914 23.7664C5.74466 23.3851 4.39245 22.5536 3.37333 21.383C2.3542 20.2125 1.71674 18.7587 1.54617 17.2161C1.3756 15.6735 1.68007 14.1156 2.41884 12.7507C3.15762 11.3858 4.2955 10.279 5.68034 9.57823C7.06517 8.87746 8.63095 8.61616 10.1683 8.82927V13.0439C9.46481 12.8227 8.70938 12.8293 8.0099 13.063C7.31041 13.2966 6.70265 13.7453 6.2734 14.345C5.84415 14.9446 5.61536 15.6646 5.6197 16.402C5.62404 17.1395 5.8613 17.8567 6.29759 18.4512C6.73387 19.0458 7.34688 19.4873 8.04906 19.7127C8.75125 19.9381 9.5067 19.9359 10.2075 19.7063C10.9084 19.4768 11.5188 19.0316 11.9515 18.4345C12.3843 17.8374 12.6173 17.1188 12.6173 16.3813V0H16.7435C16.7406 0.348435 16.7698 0.696395 16.8307 1.03948C16.9741 1.80537 17.2722 2.53396 17.7068 3.18068C18.1415 3.8274 18.7035 4.37867 19.3585 4.80075C20.2903 5.41688 21.3829 5.74528 22.5 5.74505V9.84202Z" />
								</svg>
							</a>
						</div>
					</div>
				</div>

				{/* Barra inferior legal */}
				<div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-slate-400 sm:flex-row">
					<p>Copyright © 2026 | Mónica Battaglia · Todos los derechos reservados.</p>
					<div className="flex flex-wrap items-center gap-6">
						<Link to="/politicas-de-privacidad" className="hover:text-white">
							Política de Privacidad
						</Link>
						<Link to="/terminos-y-condiciones" className="hover:text-white">
							Términos y Condiciones de Uso
						</Link>
						<Link to="/contacto-diseno-educativo" className="hover:text-white">
							Contacto
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
