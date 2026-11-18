import React from 'react';
import { Helmet } from 'react-helmet';
import Page from '@/components/builder/Page';
import Header from '@/pages/builder/shared/Header';
import Footer from '@/pages/builder/shared/Footer';
import Section1 from './Section1';

export default function MoodleAiCreatorPage() {
	return (
		<>
			<Helmet>
				<html lang={'es-AR'} />
				<title>{'MoodleAI Creator — Generador IA de Actividades, SCORM y H5P para Moodle | Mónica Battaglia'}</title>
				<meta
					name="description"
					content={
						'Transformá cualquier contenido educativo en actividades interactivas, evaluaciones calificables y paquetes Moodle XML, GIFT, SCORM 1.2/2004 y H5P válidos en pocos minutos con Inteligencia Artificial y Diseño Universal (DUA).'
					}
				/>
			</Helmet>
			<Page
				pageId={'zMoodleAiCreator'}
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
