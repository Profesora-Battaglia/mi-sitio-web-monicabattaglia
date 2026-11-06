import React from 'react';
import { HelpCircle } from 'lucide-react';
import Reveal from '@/components/Reveal';

const faqs = [
	{
		q: '¿Qué servicios de consultoría pedagógica ofrece Mónica Battaglia?',
		a: 'Ofrezco diseño y desarrollo de materiales educativos digitales accesibles, asesoría en accesibilidad (WCAG), diseño instruccional, digitalización de procesos institucionales y capacitación docente en Inteligencia Artificial aplicada al aula. Trabajo con docentes, directivos e instituciones de toda Argentina, con base en Tupungato, Valle de Uco, Mendoza.',
	},
	{
		q: '¿Cómo ayuda la Inteligencia Artificial a los docentes?',
		a: 'A través de ClaseIAXpress, los docentes generan planificaciones alineadas al currículo, rúbricas de evaluación por capacidades, cuestionarios con solucionario y adaptaciones de inclusión en minutos. El objetivo es ahorrar tiempo administrativo y recuperar hasta 10 horas libres por semana para dedicar a la enseñanza.',
	},
	{
		q: '¿Trabajás con Moodle, eXeLearning, SCORM y H5P?',
		a: 'Sí. Desarrollo recursos educativos y aplicaciones interactivas compatibles con Moodle y otras plataformas educativas, incluyendo paquetes SCORM y actividades H5P. También asesoro en la creación de contenidos accesibles con eXeLearning y en la integración de estos recursos en entornos virtuales de aprendizaje.',
	},
	{
		q: '¿Qué significa que un material educativo sea accesible?',
		a: 'Un material accesible cumple criterios de las pautas WCAG 2.1 AA: contraste adecuado, tipografía legible, jerarquía de encabezados, texto alternativo en imágenes, PDFs con texto seleccionable y lenguaje claro. Esto permite que el recurso llegue a todos los estudiantes, con o sin discapacidad.',
	},
	{
		q: '¿Ofrecés capacitación para instituciones educativas?',
		a: 'Sí. Dicto talleres 100% prácticos sobre IA aplicada al aula, accesibilidad digital educativa y digitalización institucional. Los programas son online en vivo, con grabaciones y certificado de participación, y se adaptan a los tiempos y necesidades de cada escuela.',
	},
	{
		q: '¿Cómo contrato una asesoría o un proyecto a medida?',
		a: 'Podés escribirme por WhatsApp al +54 9 2622 662596 o por email a meb@monicabattaglia.com. Respondo en menos de 24 horas y coordinamos un diagnóstico inicial para definir la mejor solución para tu institución o tu práctica docente.',
	},
];

export default function Section7() {
	return (
		<section className="bg-white py-20 md:py-28">
			<div className="mx-auto max-w-3xl px-6">
				<Reveal>
					<div className="text-center">
						<span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[#1d7a4a]">
							<HelpCircle className="h-4 w-4" />
							Preguntas frecuentes
						</span>
						<h2
							className="mt-3 text-3xl font-bold leading-tight text-[#1b365d] sm:text-4xl"
							style={{ fontFamily: 'var(--font-primary)' }}
						>
							Resolvé tus dudas sobre mis servicios
						</h2>
						<p
							className="mt-4 text-lg text-slate-600"
							style={{ fontFamily: 'var(--font-secondary)' }}
						>
							Respuestas breves y directas sobre consultoría pedagógica, recursos accesibles, IA educativa y
							digitalización institucional.
						</p>
					</div>
				</Reveal>
				<div className="mt-12 space-y-4">
					{faqs.map((faq, i) => (
						<Reveal key={faq.q} delay={i * 0.06}>
							<details className="group rounded-2xl border border-slate-100 bg-[#f9fbfc] p-6 [&_summary]:cursor-pointer">
								<summary
									className="flex items-center justify-between text-base font-semibold text-[#1b365d]"
									style={{ fontFamily: 'var(--font-primary)' }}
								>
									{faq.q}
									<span className="ml-4 flex-shrink-0 text-[#1d7a4a] transition-transform duration-200 group-open:rotate-45">
										+
									</span>
								</summary>
								<p
									className="mt-3 text-base leading-relaxed text-slate-600"
									style={{ fontFamily: 'var(--font-secondary)' }}
								>
									{faq.a}
								</p>
							</details>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}
