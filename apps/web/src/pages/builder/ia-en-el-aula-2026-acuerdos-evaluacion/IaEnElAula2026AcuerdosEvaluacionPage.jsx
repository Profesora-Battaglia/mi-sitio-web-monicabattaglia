import React from 'react';
import { Helmet } from 'react-helmet';
import Page from '@/components/builder/Page';
import Header from '@/pages/builder/shared/Header';
import Footer from '@/pages/builder/shared/Footer';
import TeacherShareBar from '@/components/TeacherShareBar';
import Section1 from './Section1';
import Section2 from './Section2';

export default function IaEnElAula2026AcuerdosEvaluacionPage() {
	return (
		<>
			<Helmet>
				<html lang={'es-AR'} />
				<title>{'IA en el aula en 2026: acuerdos y evaluación sin persecución | Mónica Battaglia'}</title>
				<meta
					name="description"
					content={
						'En 2026 la IA ya está en la escuela. Te cuento cómo armar acuerdos claros, cuidar la privacidad y evaluar aprendizajes auténticos sin volverte policía.'
					}
				/>
			</Helmet>
			<Page
				pageId={'zKf4dd'}
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
					<TeacherShareBar
						title="IA en el aula en 2026: acuerdos y evaluación sin persecución"
						shareText="¡Muy buena nota sobre cómo trabajar acuerdos de IA y evaluación en el aula este año!"
						showAppBanner={true}
					/>
					<Footer />
				</div>
			</Page>
		</>
	);
}
