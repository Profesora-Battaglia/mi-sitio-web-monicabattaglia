import React from 'react';
import { Helmet } from 'react-helmet';
import Page from '@/components/builder/Page';
import Header from '@/pages/builder/shared/Header';
import Footer from '@/pages/builder/shared/Footer';
import TeacherShareBar from '@/components/TeacherShareBar';
import Section1 from './Section1';
import Section2 from './Section2';

export default function BlogchecklistAccesibilidadMaterialesEducativosPage() {
	return (
		<>
			<Helmet>
				<html lang={'es-AR'} />
				<title>{'Checklist de Accesibilidad para Materiales Educativos Digitales | Mónica Battaglia'}</title>
				<meta
					name="description"
					content={
						'Descargá gratis el checklist de accesibilidad digital de 20 puntos para materiales educativos. Guía práctica para docentes.'
					}
				/>
			</Helmet>
			<Page
				pageId={'zHzneZ'}
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
						title="Checklist de 20 Puntos de Accesibilidad para Materiales Educativos"
						shareText="¡Te comparto este checklist gratuito de 20 puntos para revisar guías y PDFs antes de darlos en clase!"
						showAppBanner={true}
					/>
					<Footer />
				</div>
			</Page>
		</>
	);
}
