import React from 'react';
import { Helmet } from 'react-helmet';
import Page from '@/components/builder/Page';
import Seo from '@/components/Seo';
import Header from '@/pages/builder/shared/Header';
import Footer from '@/pages/builder/shared/Footer';
import Section1 from './Section1';
import Section2 from './Section2';
import Section3 from './Section3';
import Section4 from './Section4';
import Section5 from './Section5';
import Section6 from './Section6';
import Section7 from './Section7';

const FAQ_ENTRIES = [
	{
		q: '¿Qué servicios de consultoría pedagógica ofrece Mónica Battaglia?',
		a: 'Diseño y desarrollo de materiales educativos digitales accesibles, asesoría en accesibilidad (WCAG), diseño instruccional, digitalización de procesos institucionales y capacitación docente en Inteligencia Artificial aplicada al aula. Atiende a docentes, directivos e instituciones de toda Argentina, con base en Tupungato, Valle de Uco, Mendoza.',
	},
	{
		q: '¿Cómo ayuda la Inteligencia Artificial y ClaseIAXpress a los docentes?',
		a: 'Con ClaseIAXpress los docentes generan planificaciones anuales, trimestrales y diarias alineadas al currículo (NAP y DCP Mendoza), secuencias didácticas, rúbricas de evaluación por capacidades, cuestionarios con solucionario (Tema 1 y 2) y adaptaciones de inclusión (DUA y PPI) en minutos, exportables a Word (.doc) y PDF.',
	},
	{
		q: '¿Trabajás con Moodle, eXeLearning, SCORM y H5P?',
		a: 'Sí. Desarrollo recursos educativos y aplicaciones interactivas compatibles con Moodle y otras plataformas, incluyendo paquetes SCORM y actividades H5P, y asesoro en contenidos accesibles con eXeLearning.',
	},
	{
		q: '¿Qué significa que un material educativo sea accesible?',
		a: 'Cumple criterios WCAG 2.1 AA: contraste adecuado, tipografía legible, jerarquía de encabezados, texto alternativo en imágenes, PDFs con texto seleccionable y lenguaje claro, para que llegue a todos los estudiantes.',
	},
	{
		q: '¿Ofrecés capacitación para instituciones educativas?',
		a: 'Sí. Talleres 100% prácticos online en vivo sobre IA aplicada al aula, accesibilidad digital educativa y digitalización institucional, con grabaciones y certificado de participación, adaptados a cada escuela.',
	},
	{
		q: '¿Cómo contrato una asesoría o me suscribo a ClaseIAXpress?',
		a: 'Podés probar ClaseIAXpress gratis en app.monicabattaglia.com y suscribirte con Mercado Pago en pesos argentinos. Para asesorías o convenios institucionales, escribime por WhatsApp al +54 9 2622 662596 o por email a meb@monicabattaglia.com.',
	},
];

export default function HomePage() {
	return (
		<>
			<Helmet>
				<html lang={'es-AR'} />
				<title>{'Mónica Battaglia | IA para Docentes (ClaseIAXpress) y Materiales Educativos Accesibles'}</title>
				<meta
					name="description"
					content={
						'Ahorrá hasta 10 horas por semana con ClaseIAXpress (planificaciones, secuencias, rúbricas y DUA/PPI con IA en Word y PDF). Recursos gratuitos para docentes, accesibilidad WCAG y digitalización escolar en Mendoza y toda Argentina.'
					}
				/>
				<meta
					name="keywords"
					content={
						'ClaseIAXpress, app IA para docentes Argentina, planificaciones DCP Mendoza, materiales educativos accesibles, consultoría pedagógica, diseño tecnoeducativo, Moodle, eXeLearning, SCORM, H5P, accesibilidad WCAG, Tupungato, Valle de Uco, Mendoza'
					}
				/>
				<meta name="author" content="Mónica Battaglia" />
				<meta name="geo.region" content="AR-M" />
				<meta name="geo.placename" content="Tupungato, Mendoza, Argentina" />
				<link rel="canonical" href="https://monicabattaglia.com/" />
				<script type="application/ld+json">
					{JSON.stringify({
						'@context': 'https://schema.org',
						'@graph': [
							{
								'@type': 'ProfessionalService',
								'@id': 'https://monicabattaglia.com/#service',
								name: 'Mónica Battaglia - Consultoría Pedagógica, Accesibilidad y ClaseIAXpress',
								url: 'https://monicabattaglia.com',
								telephone: '+5492622662596',
								email: 'meb@monicabattaglia.com',
								image:
									'https://horizons-cdn.hostinger.com/8899df02-63ad-48bb-b79f-af29dfcdaf65/gemini_generated_image_xwhm2oxwhm2oxwhm-fnqVkGGLOkaGXzJ2.jpeg',
								priceRange: '$$',
								address: {
									'@type': 'PostalAddress',
									addressLocality: 'Tupungato',
									addressRegion: 'Mendoza',
									addressCountry: 'AR',
								},
								description:
									'Consultoría pedagógica, diseño instruccional, accesibilidad digital (WCAG), recursos gratuitos para docentes y plataforma ClaseIAXpress de inteligencia artificial aplicada al aula real (NAP y DCP Mendoza).',
								areaServed: [
									{ '@type': 'City', name: 'Tupungato' },
									{ '@type': 'AdministrativeArea', name: 'Valle de Uco' },
									{ '@type': 'State', name: 'Mendoza' },
									{ '@type': 'Country', name: 'Argentina' },
								],
								knowsAbout: [
									'Accesibilidad digital WCAG 2.1 AA',
									'Diseño instruccional',
									'Inteligencia artificial en educación',
									'Planificaciones curriculares NAP y DCP Mendoza',
									'Diseño Universal del Aprendizaje (DUA) y PPI',
									'Moodle, eXeLearning, SCORM y H5P',
								],
								serviceType: [
									'Consultoría pedagógica',
									'Software educativo con IA (ClaseIAXpress)',
									'Diseño de materiales educativos accesibles',
									'Capacitación docente en IA',
									'Digitalización institucional',
								],
							},
							{
								'@type': 'SoftwareApplication',
								'@id': 'https://monicabattaglia.com/claseiaxpress#software',
								name: 'ClaseIAXpress',
								applicationCategory: 'EducationalApplication',
								operatingSystem: 'Web',
								url: 'https://app.monicabattaglia.com/',
								description:
									'Aplicación con IA para docentes que genera planificaciones anuales, secuencias didácticas, rúbricas por capacidades, exámenes con solucionario y adaptaciones DUA/PPI en Word y PDF.',
								offers: [
									{ '@type': 'Offer', name: 'Plan Inicial Gratis', price: '0', priceCurrency: 'ARS' },
									{ '@type': 'Offer', name: 'Plan Docente Pro', price: '20000', priceCurrency: 'ARS' },
									{ '@type': 'Offer', name: 'Plan Docente Experto', price: '40000', priceCurrency: 'ARS' },
								],
							},
							{
								'@type': 'Organization',
								'@id': 'https://monicabattaglia.com/#organization',
								name: 'Mónica Battaglia - Consultoría Pedagógica y Diseño Tecnoeducativo',
								url: 'https://monicabattaglia.com',
								email: 'meb@monicabattaglia.com',
								telephone: '+5492622662596',
								founder: { '@type': 'Person', name: 'Mónica Battaglia' },
								areaServed: 'Argentina',
								sameAs: [
									'https://www.facebook.com/mbattagliaar',
									'https://www.instagram.com/mbattagliaar',
									'https://tiktok.com/monica.battaglia94',
								],
							},
							{
								'@type': 'WebSite',
								'@id': 'https://monicabattaglia.com/#website',
								url: 'https://monicabattaglia.com',
								name: 'Mónica Battaglia | Materiales accesibles e IA para la educación',
								inLanguage: 'es-AR',
								publisher: { '@id': 'https://monicabattaglia.com/#organization' },
							},
							{
								'@type': 'Person',
								'@id': 'https://monicabattaglia.com/#person',
								name: 'Mónica Battaglia',
								jobTitle: 'Analista de Sistemas, Educadora y Consultora en IA y Accesibilidad Educativa',
								url: 'https://monicabattaglia.com',
								email: 'meb@monicabattaglia.com',
								telephone: '+5492622662596',
								worksFor: { '@id': 'https://monicabattaglia.com/#organization' },
							},
							{
								'@type': 'FAQPage',
								'@id': 'https://monicabattaglia.com/#faq',
								mainEntity: FAQ_ENTRIES.map((entry) => ({
									'@type': 'Question',
									name: entry.q,
									acceptedAnswer: { '@type': 'Answer', text: entry.a },
								})),
							},
						],
					})}
				</script>
			</Helmet>
			<Seo
				title={'Mónica Battaglia | App ClaseIAXpress y Materiales Educativos Accesibles'}
				description={
					'Ahorrá hasta 10 horas por semana con ClaseIAXpress y descargá recursos gratuitos para docentes. Consultoría en accesibilidad WCAG e IA aplicada al aula en Mendoza y toda Argentina.'
				}
				siteName={'Mónica Battaglia | Consultoría Pedagógica y Diseño Tecnoeducativo'}
				image={
					'https://horizons-cdn.hostinger.com/8899df02-63ad-48bb-b79f-af29dfcdaf65/gemini_generated_image_xwhm2oxwhm2oxwhm-fnqVkGGLOkaGXzJ2.jpeg'
				}
				url={'https://monicabattaglia.com'}
			/>
			<Page
				pageId={'ai-ykmTx'}
				locale={'system'}
				style={{
					'--font-primary': "'Poppins', 'Atkinson Hyperlegible', sans-serif",
					'--font-secondary': "'Roboto', 'Open Sans', sans-serif",
				}}
				googleFontsHref={
					'https://cdn.zyrosite.com/u1/google-fonts/font-faces?family=Poppins:wght@400;700&family=Roboto:wght@400;500;700&family=Inter:wght@400;500&family=Atkinson%20Hyperlegible:wght@400;700&family=Open%20Sans:wght@700&display=swap'
				}
			>
				<Header />
				<div className="page__blocks">
					<Section1 />
					<Section2 />
					<Section3 />
					<Section4 />
					<Section5 />
					<Section6 />
					<Section7 />
					<Footer />
				</div>
			</Page>
		</>
	);
}
