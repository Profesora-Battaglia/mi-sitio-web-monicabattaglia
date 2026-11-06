import React from 'react';
import { Helmet } from 'react-helmet';
import Page from '@/components/builder/Page';
import Header from '@/pages/builder/shared/Header';
import Footer from '@/pages/builder/shared/Footer';
import TeacherShareBar from '@/components/TeacherShareBar';
import Section1 from './Section1';
import Section2 from './Section2';

export default function MaterialesAccesiblesOrdenadosGuiaPage() {
	return (
		<>
			<Helmet>
				<html lang={'es-AR'} />
				<title>{'Materiales accesibles y ordenados: guía práctica para docentes | Mónica Battaglia'}</title>
				<meta
					name="description"
					content={
						'Tipografías, contraste, jerarquía, lectura fácil y PDFs accesibles: guía práctica para crear materiales que se entienden y no excluyen.'
					}
				/>
			</Helmet>
			<Page
				pageId={'zytf-T'}
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
						title="Materiales accesibles y ordenados: guía práctica para docentes"
						shareText="¡Mirá esta guía sobre tipografías, contraste y lectura fácil para armar materiales de clase!"
						showAppBanner={true}
					/>
					<Footer />
				</div>
			</Page>
		</>
	);
}
