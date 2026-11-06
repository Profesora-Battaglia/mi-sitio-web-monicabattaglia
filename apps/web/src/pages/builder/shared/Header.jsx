import React from 'react';
import BlockNavigation from '@/components/builder/blocks/BlockNavigation';

export default function Header() {
	return (
		<BlockNavigation
			logoSrc={
				'https://horizons-cdn.hostinger.com/8899df02-63ad-48bb-b79f-af29dfcdaf65/gemini_generated_image_xwhm2oxwhm2oxwhm-fnqVkGGLOkaGXzJ2.jpeg?width=768&fit=scale-down'
			}
			logoText={'Mónica Battaglia | Materiales accesibles e IA para la educación'}
			logoHref={'/'}
			logoHeightDesktop={86}
			logoHeightMobile={78}
			isLogoVisible
			layout={'desktop-1'}
			mobileLayout={'mobile-1'}
			mobileLinksAlignment={'center'}
			isSticky={true}
			isTransparent={false}
			cartIconSize={'24px'}
			style={{
				'--width': '1280px',
				'--padding-top': '10px',
				'--padding': '10px 16px 10px 16px',
				'--padding-right': '16px',
				'--padding-bottom': '10px',
				'--padding-left': '16px',
				'--m-padding-top': '10px',
				'--m-padding': '10px 16px 10px 16px',
				'--m-padding-right': '16px',
				'--m-padding-bottom': '10px',
				'--m-padding-left': '16px',
				'--logo-width': '86px',
				'--cartIconSize': '24px',
				'--link-spacing': '18px',
				'--m-logo-width': '78px',
				'--m-link-spacing': '9px',
				'--element-spacing': '20px',
				'--m-element-spacing': '8px',
				'--contrastBackgroundColor': 'rgb(191, 208, 226)',
				'--nav-bg': 'rgb(233, 239, 245)',
				'--nav-link-font-family': 'Roboto',
				'--nav-link-font-weight': '700',
				'--nav-link-color': 'rgb(27, 54, 93)',
				'--nav-link-text-color': 'rgb(27, 54, 93)',
				'--nav-link-color-hover': 'rgb(29, 122, 74)',
				'--nav-link-text-color-hover': 'rgb(29, 122, 74)',
			}}
			nav={[
				{
					id: '83vUGx',
					href: '/',
					text: 'Inicio',
					isHidden: false,
					hasDropdown: false,
				},
				{
					id: 'zhR5VK',
					href: '/claseiaxpress',
					text: '✨ App ClaseIAXpress',
					isHidden: false,
					hasDropdown: false,
				},
				{
					id: 'zi32Qd',
					href: '/recursos-para-docentes',
					text: 'Recursos Gratis',
					isHidden: false,
					hasDropdown: true,
					subItems: [
						{
							id: 'rec-all',
							href: '/recursos-para-docentes',
							text: 'Centro de Recursos y Descargas',
							isHidden: false,
							hasDropdown: false,
						},
						{
							id: 'rec-eval',
							href: '/evaluador-de-accesibilidad-de-materiales-didacticos',
							text: 'Evaluador de Accesibilidad (App Gratis)',
							isHidden: false,
							hasDropdown: false,
						},
						{
							id: 'rec-mayo',
							href: '/juego-interactivo-revolucion-de-mayo',
							text: 'Escape Room Revolución de Mayo',
							isHidden: false,
							hasDropdown: false,
						},
						{
							id: 'rec-check',
							href: '/blogchecklist-accesibilidad-materiales-educativos',
							text: 'Checklist de 20 Puntos (Interactivo)',
							isHidden: false,
							hasDropdown: false,
						},
						{
							id: 'rec-pdf',
							href: '/blogcomo-crear-pdf-accesible-docentes',
							text: 'Guía: Cómo crear PDFs accesibles',
							isHidden: false,
							hasDropdown: false,
						},
						{
							id: 'rec-guia',
							href: '/materiales-accesibles-ordenados-guia',
							text: 'Guía: Materiales accesibles y ordenados',
							isHidden: false,
							hasDropdown: false,
						},
					],
				},
				{
					id: 'zvUStj',
					href: '/academia',
					text: 'Academia',
					isHidden: false,
					hasDropdown: false,
				},
				{
					id: 'so-DKX',
					href: '/servicios-diseno-educativo',
					text: 'Servicios',
					isHidden: false,
					hasDropdown: false,
				},
				{
					id: 'ZTY99R',
					href: '/portfolio-de-proyectos-educativos',
					text: 'Portafolio',
					isHidden: false,
					hasDropdown: false,
				},
				{
					id: 'r3YaLA',
					href: '/blog-accesibilidad',
					text: 'Blog y Guías',
					isHidden: false,
					hasDropdown: false,
				},
				{
					id: 'rmc-mk',
					href: '/sobre-mi-materiales-educativos',
					text: 'Sobre mí',
					isHidden: false,
					hasDropdown: false,
				},
			]}
			ctaButton={{
				props: {
					text: 'Agendar consulta',
					href: '/contacto-diseno-educativo',
					type: 'primary',
					backgroundColor: 'rgb(29, 122, 74)',
					fontColor: 'rgb(255, 255, 255)',
					borderColor: 'rgb(29, 122, 74)',
					backgroundColorHover: 'rgb(27, 54, 93)',
					fontColorHover: 'rgb(255, 255, 255)',
					borderColorHover: 'rgb(27, 54, 93)',
				},
			}}
		/>
	);
}
