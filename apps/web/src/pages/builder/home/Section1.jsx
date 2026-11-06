import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Clock, ShieldCheck, Gift } from 'lucide-react';
import Reveal from '@/components/Reveal';

const HERO_IMAGE_URL =
	'https://images.hostinger.com/8899df02-63ad-48bb-b79f-af29dfcdaf65/e55bb04f-4c1a-47e6-9c9e-34dc9db15eb9.png';
const HERO_IMAGE_SRCSET =
	'https://images.hostinger.com/8899df02-63ad-48bb-b79f-af29dfcdaf65/e55bb04f-4c1a-47e6-9c9e-34dc9db15eb9.png?width=375 375w, https://images.hostinger.com/8899df02-63ad-48bb-b79f-af29dfcdaf65/e55bb04f-4c1a-47e6-9c9e-34dc9db15eb9.png?width=768 768w, https://images.hostinger.com/8899df02-63ad-48bb-b79f-af29dfcdaf65/e55bb04f-4c1a-47e6-9c9e-34dc9db15eb9.png 1024w';

export default function Section1() {
	return (
		<section className="relative overflow-hidden bg-gradient-to-br from-[#e9eff5] via-white to-[#e3f1ea]">
			{/* Decorative blobs */}
			<div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#74c69d]/20 blur-3xl" />
			<div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-[#1b365d]/10 blur-3xl" />

			<div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28 lg:py-32">
				<div className="grid items-center gap-12 lg:grid-cols-2">
					<div className="mx-auto max-w-4xl text-center lg:mx-0 lg:text-left">
						<Reveal>
							<span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-[#1d7a4a] shadow-sm ring-1 ring-[#1d7a4a]/15 backdrop-blur">
								<Sparkles className="h-4 w-4" />
								Inteligencia Artificial y Accesibilidad Aplicada al Aula
							</span>
						</Reveal>

						<Reveal delay={0.1}>
							<h1
								className="mt-6 text-4xl font-bold leading-[1.15] text-[#1b365d] sm:text-5xl lg:text-6xl"
								style={{ fontFamily: 'var(--font-primary)' }}
							>
								Tu Socia Tecnológica en Educación
							</h1>
						</Reveal>

						<Reveal delay={0.2}>
							<p
								className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl lg:mx-0"
								style={{ fontFamily: 'var(--font-secondary)' }}
							>
								Ahorrá tiempo y automatizá tus planificaciones, rúbricas y adaptaciones con Inteligencia Artificial.
								Ayudo a docentes, directivos e instituciones a eliminar cuellos de botella y recuperar hasta{' '}
								<strong className="font-semibold text-[#1d7a4a]">10 horas libres por semana</strong>.
							</p>
						</Reveal>

						<Reveal delay={0.3}>
							<div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
								<Link
									to="/claseiaxpress"
									className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1d7a4a] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#1d7a4a]/25 transition-all duration-200 hover:bg-[#18663f] hover:shadow-xl hover:shadow-[#1d7a4a]/30 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1d7a4a]/30 active:scale-[0.98] sm:w-auto"
								>
									Conocer y Probar ClaseIAXpress Gratis
									<ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
								</Link>
								<Link
									to="/recursos-para-docentes"
									className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#1b365d]/15 bg-white px-7 py-4 text-base font-semibold text-[#1b365d] transition-all duration-200 hover:border-[#1b365d]/30 hover:bg-[#1b365d] hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1b365d]/20 active:scale-[0.98] sm:w-auto"
								>
									<Gift className="h-4 w-4 text-[#1d7a4a]" />
									Recursos Docentes Gratis
								</Link>
							</div>
						</Reveal>

						<Reveal delay={0.4}>
							<div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-500 lg:justify-start">
								<span className="inline-flex items-center gap-2">
									<Clock className="h-4 w-4 text-[#1d7a4a]" />
									+25 años en el aula
								</span>
								<span className="hidden h-4 w-px bg-slate-300 sm:block" />
								<span className="inline-flex items-center gap-2">
									<ShieldCheck className="h-4 w-4 text-[#1d7a4a]" />
									Materiales accesibles (WCAG)
								</span>
								<span className="hidden h-4 w-px bg-slate-300 sm:block" />
								<a
									href="https://wa.me/5492622662596?text=Hola%20M%C3%B3nica%20quiero%20consultar%20por%20soluciones%20tecnol%C3%B3gicas%20para%20mi%20escuela"
									target="_blank"
									rel="noopener noreferrer"
									className="font-semibold text-[#1b365d] underline decoration-[#1d7a4a] underline-offset-4 hover:text-[#1d7a4a]"
								>
									¿Sos directivo? Consultá por Asesoría Institucional
								</a>
							</div>
						</Reveal>
					</div>

					<Reveal delay={0.2} className="order-first lg:order-last">
						<div className="relative mx-auto max-w-md lg:max-w-none">
							<div className="pointer-events-none absolute inset-0 -z-10 rounded-[2rem] bg-[#74c69d]/15 blur-2xl" />
							<img
								src={HERO_IMAGE_URL}
								srcSet={HERO_IMAGE_SRCSET}
								sizes="(min-width: 1024px) 45vw, (min-width: 640px) 60vw, 100vw"
								alt="Ilustración de recursos pedagógicos inclusivos y entornos digitales de aprendizaje"
								className="mx-auto w-full max-w-lg drop-shadow-xl"
								loading="eager"
							/>
						</div>
					</Reveal>
				</div>
			</div>
		</section>
	);
}
