import React from 'react';
import { Helmet } from 'react-helmet';
import Page from '@/components/builder/Page';
import Header from '@/pages/builder/shared/Header';
import Footer from '@/pages/builder/shared/Footer';
import TeacherShareBar from '@/components/TeacherShareBar';
import Section1 from './Section1';
import Section2 from './Section2';

export default function BlogcomoCrearPdfAccesibleDocentesPage() {
	return (
		<>
			<Helmet>
				<html lang={'es-AR'} />
				<title>{'Cómo crear PDFs accesibles para tus estudiantes: guía paso a paso | Mónica Battaglia'}</title>
				<meta
					name="description"
					content={
						'Guía paso a paso para docentes: cómo crear PDFs accesibles desde Word, Google Docs y Canva con texto seleccionable, contraste y encabezados claros.'
					}
				/>
			</Helmet>
			<Page
				pageId={'zYPleC'}
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
						title="Cómo crear PDFs accesibles para tus estudiantes: guía paso a paso"
						shareText="¡Mirá esta guía paso a paso para exportar PDFs accesibles desde Word, Google Docs o Canva!"
						showAppBanner={true}
					/>
					<Footer />
				</div>
			</Page>
		</>
	);
}
