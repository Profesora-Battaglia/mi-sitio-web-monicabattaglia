import React from 'react';
import { ArrowRight, Briefcase, GraduationCap, Code, Accessibility } from 'lucide-react';
import Reveal from '@/components/Reveal';

export default function Section2() {
	return (
		<section className="bg-white py-20 md:py-28">
			<div className="mx-auto max-w-7xl px-6">
				<div className="grid items-center gap-12 lg:grid-cols-2">
					<Reveal>
						<div>
							<h2
								className="text-3xl font-bold leading-tight text-[#1b365d] sm:text-4xl"
								style={{ fontFamily: 'var(--font-primary)' }}
							>
								Conóceme
							</h2>
							<div
								className="mt-6 space-y-4 text-base leading-relaxed text-slate-600"
								style={{ fontFamily: 'var(--font-secondary)' }}
							>
								<p>
									Soy Mónica Battaglia: analista de sistemas, educadora y tu socia tecnológica en
									educación.
								</p>
								<p>
									Durante más de veinticinco años di clases de Informática, TIC y Matemática en escuelas
									secundarias, institutos terciarios y universidades de Mendoza. Viví en carne propia lo
									que significa llevarse carpetas para corregir los domingos a la noche, lidiar con
									sistemas administrativos lentos y la falta de tiempo para dedicarle a cada alumno.
								</p>
								<p>
									Por eso no soy una desarrolladora que habla con palabras raras ni vendo tecnología que
									complica la vida. Mi misión es poner la Inteligencia Artificial y la tecnología al
									servicio del docente y de la escuela real: para que ningún profesor se sienta solo
									frente a la sobrecarga laboral y cada institución pueda escalar sin aumentar sus costos.
								</p>
							</div>
							<a
								href="https://wa.me/5492622662596"
								target="_blank"
								rel="nofollow noreferrer"
								className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[#1d7a4a] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#1d7a4a]/25 transition-all duration-200 hover:bg-[#18663f] hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1d7a4a]/30 active:scale-[0.98]"
							>
								Conversemos por WhatsApp
								<ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
							</a>
						</div>
					</Reveal>
					<Reveal delay={0.15}>
						<div className="relative">
							<div className="overflow-hidden rounded-3xl shadow-2xl shadow-slate-300/50">
								<img
									src="https://horizons-cdn.hostinger.com/8899df02-63ad-48bb-b79f-af29dfcdaf65/dando-clases-Qvb59NOrURvU1RpV.webp?width=768&fit=crop"
									alt="Mónica Battaglia explicando un diagrama en una pantalla frente a dos asistentes"
									className="h-full w-full object-cover"
									loading="lazy"
								/>
							</div>
							<div className="pointer-events-none absolute -bottom-6 -right-6 hidden h-32 w-32 rounded-full bg-[#74c69d]/20 blur-2xl md:block" />
						</div>
					</Reveal>
				</div>

				<div className="mt-20 md:mt-28">
					<Reveal>
						<div className="mx-auto max-w-3xl text-center">
							<span className="text-sm font-semibold uppercase tracking-wider text-[#1d7a4a]">
								Mi trayectoria
							</span>
							<h2
								className="mt-3 text-3xl font-bold leading-tight text-[#1b365d] sm:text-4xl"
								style={{ fontFamily: 'var(--font-primary)' }}
							>
								Experiencia profesional
							</h2>
						</div>
					</Reveal>
					<div className="mt-12 grid gap-6 md:grid-cols-2">
						<Reveal>
							<div className="h-full rounded-2xl border border-slate-100 bg-[#f9fbfc] p-8 transition-all duration-300 hover:border-[#1d7a4a]/20 hover:shadow-lg hover:shadow-slate-200/60">
								<p
									className="text-base leading-relaxed text-slate-600"
									style={{ fontFamily: 'var(--font-secondary)' }}
								>
									Mi recorrido profesional comenzó en el aula, acompañando a estudiantes de distintos
									niveles educativos. Con el tiempo, descubrí que la tecnología podía ser una herramienta
									poderosa para mejorar la enseñanza, siempre que estuviera bien diseñada y pensada para
									las personas.
								</p>
								<p
									className="mt-4 text-base leading-relaxed text-slate-600"
									style={{ fontFamily: 'var(--font-secondary)' }}
								>
									A partir de esa convicción, empecé a trabajar en capacitación docente, diseño de
									materiales digitales, asesoramiento institucional, creación de recursos accesibles e
									implementación de tecnologías educativas.
								</p>
							</div>
						</Reveal>
						<Reveal delay={0.12}>
							<div className="h-full rounded-2xl border border-slate-100 bg-[#f9fbfc] p-8 transition-all duration-300 hover:border-[#1d7a4a]/20 hover:shadow-lg hover:shadow-slate-200/60">
								<ul
									className="space-y-4 text-base text-slate-700"
									style={{ fontFamily: 'var(--font-secondary)' }}
								>
									<li className="flex items-start gap-3">
										<Briefcase className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#1d7a4a]" />
										<span>
											<strong className="font-semibold text-[#1b365d]">Sector financiero:</strong>{' '}
											gestión contable y administrativa, integración de procesos tecnológicos y
											organizativos.
										</span>
									</li>
									<li className="flex items-start gap-3">
										<Code className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#1d7a4a]" />
										<span>
											<strong className="font-semibold text-[#1b365d]">Desde 2000:</strong> diseño
											instruccional y creación de materiales digitales accesibles para instituciones
											educativas.
										</span>
									</li>
									<li className="flex items-start gap-3">
										<GraduationCap className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#1d7a4a]" />
										<span>
											<strong className="font-semibold text-[#1b365d]">Desde 2015:</strong>{' '}
											consultoría en entornos educativos sobre diseño, perfiles profesionales y
											recursos digitales.
										</span>
									</li>
									<li className="flex items-start gap-3">
										<Accessibility className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#1d7a4a]" />
										<span>
											<strong className="font-semibold text-[#1b365d]">+25 años de docencia:</strong>{' '}
											Informática, TIC y Matemática en escuelas secundarias, terciarios y universidades.
										</span>
									</li>
								</ul>
							</div>
						</Reveal>
					</div>
				</div>
			</div>
		</section>
	);
}
