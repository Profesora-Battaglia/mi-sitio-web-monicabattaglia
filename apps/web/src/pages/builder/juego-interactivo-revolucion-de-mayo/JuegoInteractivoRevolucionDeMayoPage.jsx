import React from 'react';
import { Helmet } from 'react-helmet';
import Page from '@/components/builder/Page';
import Header from '@/pages/builder/shared/Header';
import Footer from '@/pages/builder/shared/Footer';
import TeacherShareBar from '@/components/TeacherShareBar';
import Section1 from './Section1';
import Section2 from './Section2';

export default function JuegoInteractivoRevolucionDeMayoPage() {
	return (
		<>
			<Helmet>
				<html lang={'es-AR'} />
				<title>{'Escape Room Digital Revolución de Mayo (Lengua y Matemática) | Mónica Battaglia'}</title>
				<meta
					name="description"
					content={
						'Juego interactivo gratuito de la Revolución de Mayo para primaria y secundaria (Lengua y Matemática) con pistas pedagógicas y Diploma de Honor imprimible.'
					}
				/>
			</Helmet>
			<Page
				pageId={'z4XcVb'}
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
						title="Escape Room Digital: Misión El Grito de Libertad (25 de Mayo)"
						shareText="¡Mirá este Escape Room gratuito del 25 de Mayo para Lengua y Matemática! Tiene pistas y diploma imprimible para los chicos:"
						showAppBanner={true}
					/>
					<Footer />
				</div>
			</Page>
		</>
	);
}
