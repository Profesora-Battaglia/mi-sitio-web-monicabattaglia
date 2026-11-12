import React from 'react';
import { Helmet } from 'react-helmet';
import Page from '@/components/builder/Page';
import Header from '@/pages/builder/shared/Header';
import Footer from '@/pages/builder/shared/Footer';
import Section1 from './Section1';

export default function LibroDeTemasDigitalPage() {
	return (
		<>
			<Helmet>
				<html lang={'es-AR'} />
				<title>{'Libro de Temas Digital para Instituciones Educativas | Mónica Battaglia'}</title>
				<meta
					name="description"
					content={
						'Plataforma web multi-institución para digitalizar el Libro de Temas escolar: carga rápida docente, cálculo automático para ponerse al día y tablero de seguimiento en tiempo real para Equipos Directivos.'
					}
				/>
			</Helmet>
			<Page
				pageId={'zLibroTemas'}
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
