import React from 'react';
import { Helmet } from 'react-helmet';
import Page from '@/components/builder/Page';
import Seo from '@/components/Seo';
import Header from '@/pages/builder/shared/Header';
import Footer from '@/pages/builder/shared/Footer';
import Section1 from './Section1';

const SOFTWARE_SCHEMA = {
	'@context': 'https://schema.org',
	'@graph': [
		{
			'@type': 'SoftwareApplication',
			'@id': 'https://monicabattaglia.com/claseiaxpress#software',
			name: 'ClaseIAXpress',
			applicationCategory: 'EducationalApplication',
			operatingSystem: 'Web, Android, iOS, Windows, macOS',
			url: 'https://app.monicabattaglia.com/',
			inLanguage: 'es-AR',
			description:
				'Asistente pedagógico con Inteligencia Artificial para docentes de Argentina. Genera planificaciones anuales, secuencias didácticas, rúbricas analíticas por capacidades, exámenes (Tema 1 y 2) con solucionario, actos escolares y adaptaciones de inclusión (DUA y PPI) alineadas a NAP y DCP Mendoza. Exportable a Word (.doc) y PDF.',
			creator: {
				'@type': 'Person',
				name: 'Mónica Battaglia',
				url: 'https://monicabattaglia.com',
			},
			areaServed: {
				'@type': 'Country',
				name: 'Argentina',
			},
			offers: [
				{
					'@type': 'Offer',
					name: 'Plan Inicial (Prueba Gratuita)',
					price: '0',
					priceCurrency: 'ARS',
					url: 'https://app.monicabattaglia.com/',
				},
				{
					'@type': 'Offer',
					name: 'Plan Docente Pro',
					price: '20000',
					priceCurrency: 'ARS',
					url: 'https://app.monicabattaglia.com/planes',
				},
				{
					'@type': 'Offer',
					name: 'Plan Docente Experto',
					price: '40000',
					priceCurrency: 'ARS',
					url: 'https://app.monicabattaglia.com/planes',
				},
			],
		},
	],
};

export default function HttpsclaseiaxpressvercelappPage() {
	return (
		<>
			<Helmet>
				<html lang={'es-AR'} />
				<title>{'ClaseIAXpress: App con IA para Planificaciones, Secuencias y Rúbricas Docentes'}</title>
				<meta
					name="description"
					content={
						'Ahorrá hasta 10 horas por semana con ClaseIAXpress: generá planificaciones anuales, secuencias didácticas, rúbricas, exámenes y adaptaciones DUA/PPI alineadas a NAP y DCP Mendoza. Descargá en Word y PDF.'
					}
				/>
				<meta
					name="keywords"
					content={
						'ClaseIAXpress, app para docentes, planificaciones con IA Argentina, secuencias didácticas DCP Mendoza, generador de rúbricas, adaptaciones DUA PPI, inteligencia artificial para profesores'
					}
				/>
				<link rel="canonical" href="https://monicabattaglia.com/claseiaxpress" />
				<script type="application/ld+json">{JSON.stringify(SOFTWARE_SCHEMA)}</script>
			</Helmet>
			<Seo
				title={'ClaseIAXpress: App con IA para Docentes | Mónica Battaglia'}
				description={
					'Generá planificaciones, secuencias didácticas, rúbricas, exámenes y adaptaciones DUA/PPI en minutos. Exportable a Word y PDF. Probá gratis o suscribite con Mercado Pago.'
				}
				siteName={'Mónica Battaglia | Consultoría Pedagógica y Diseño Tecnoeducativo'}
				url={'https://monicabattaglia.com/claseiaxpress'}
			/>
			<Page
				pageId={'zeg05-'}
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
					<Footer />
				</div>
			</Page>
		</>
	);
}
