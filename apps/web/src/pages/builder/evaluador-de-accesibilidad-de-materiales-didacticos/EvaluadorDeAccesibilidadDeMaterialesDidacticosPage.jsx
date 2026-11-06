import React from 'react';
import { Helmet } from 'react-helmet';
import Page from '@/components/builder/Page';
import Header from '@/pages/builder/shared/Header';
import Footer from '@/pages/builder/shared/Footer';
import TeacherShareBar from '@/components/TeacherShareBar';
import Section1 from './Section1';

export default function EvaluadorDeAccesibilidadDeMaterialesDidacticosPage() {
	return (
		<>
			<Helmet>
				<html lang={'es-AR'} />
				<title>{'Evaluador de Accesibilidad de Materiales Didácticos Gratis | Mónica Battaglia'}</title>
				<meta
					name="description"
					content={
						'Auditá gratis y en tiempo real la accesibilidad de tus materiales didácticos (claridad visual, estructura, multimedia y PDFs). Herramienta interactiva para docentes.'
					}
				/>
			</Helmet>
			<Page
				pageId={'zcDbjO'}
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
					<TeacherShareBar
						title="Evaluador Interactivo de Materiales Didácticos Inclusivos (Gratis)"
						shareText="¡Mirá esta herramienta gratuita para evaluar si nuestros materiales y PDFs para clase son accesibles!"
						showAppBanner={true}
					/>
					<Footer />
				</div>
			</Page>
		</>
	);
}
