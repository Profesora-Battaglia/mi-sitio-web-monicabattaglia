import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import ScrollToTop from '@/components/ScrollToTop';
import CustomSiteCode from '@/components/builder/CustomSiteCode';
import CookieConsent from '@/components/builder/CookieConsent';
import WhatsAppBubble from '@/components/builder/WhatsAppBubble';
import { EcommerceCartProvider } from '@/components/builder/blocks/EcommerceCart';
import EcommerceCheckoutSuccess from '@/components/builder/blocks/EcommerceCheckoutSuccess';
import JuegoInteractivoRevolucionDeMayoPage_system_z4XcVb from '@/pages/builder/juego-interactivo-revolucion-de-mayo/JuegoInteractivoRevolucionDeMayoPage';
import AplicacionesInteractivasPage_system_z6m0FG from '@/pages/builder/aplicaciones-interactivas/AplicacionesInteractivasPage';
import RecursosParaDocentesPage_system_zH7SVS from '@/pages/builder/recursos-para-docentes/RecursosParaDocentesPage';
import BlogchecklistAccesibilidadMaterialesEducativosPage_system_zHzneZ from '@/pages/builder/blogchecklist-accesibilidad-materiales-educativos/BlogchecklistAccesibilidadMaterialesEducativosPage';
import PoliticasDePrivacidadPage_system_zJIEZB from '@/pages/builder/politicas-de-privacidad/PoliticasDePrivacidadPage';
import IaEnElAula2026AcuerdosEvaluacionPage_system_zKf4dd from '@/pages/builder/ia-en-el-aula-2026-acuerdos-evaluacion/IaEnElAula2026AcuerdosEvaluacionPage';
import SistemaDeGestionDeInscripcionesAMesasDeExamenYActasDigitalesPage_system_zUErCn from '@/pages/builder/sistema-de-gestion-de-inscripciones-a-mesas-de-examen-y-actas-digitales/SistemaDeGestionDeInscripcionesAMesasDeExamenYActasDigitalesPage';
import LibroDeTemasDigitalPage from '@/pages/builder/libro-de-temas-digital/LibroDeTemasDigitalPage';
import BlogcomoCrearPdfAccesibleDocentesPage_system_zYPleC from '@/pages/builder/blogcomo-crear-pdf-accesible-docentes/BlogcomoCrearPdfAccesibleDocentesPage';
import EvaluadorDeAccesibilidadDeMaterialesDidacticosPage_system_zcDbjO from '@/pages/builder/evaluador-de-accesibilidad-de-materiales-didacticos/EvaluadorDeAccesibilidadDeMaterialesDidacticosPage';
import HttpsclaseiaxpressvercelappPage_system_zeg05 from '@/pages/builder/httpsclaseiaxpressvercelapp/HttpsclaseiaxpressvercelappPage';
import ContactoInstitucionalPage_system_zn4Fu3 from '@/pages/builder/contacto-institucional/ContactoInstitucionalPage';
import TerminosYCondicionesPage_system_zn5oG2 from '@/pages/builder/terminos-y-condiciones/TerminosYCondicionesPage';
import PensamientoCriticoEnLaEraDeLaInteligenciaArtificialLaHabilidadQueMarcaraLaDiferenciaPage_system_zpwVox from '@/pages/builder/pensamiento-critico-en-la-era-de-la-inteligencia-artificial-la-habilidad-que-marcara-la-diferencia/PensamientoCriticoEnLaEraDeLaInteligenciaArtificialLaHabilidadQueMarcaraLaDiferenciaPage';
import AcademiaPage_system_zv7NaW from '@/pages/builder/academia/AcademiaPage';
import InfografiasYPresentacionesAccesiblesPage_system_zxRCEo from '@/pages/builder/infografias-y-presentaciones-accesibles/InfografiasYPresentacionesAccesiblesPage';
import MaterialesAccesiblesOrdenadosGuiaPage_system_zytf_T from '@/pages/builder/materiales-accesibles-ordenados-guia/MaterialesAccesiblesOrdenadosGuiaPage';
import SobreMiMaterialesEducativosPage_system_ai_8TAit from '@/pages/builder/sobre-mi-materiales-educativos/SobreMiMaterialesEducativosPage';
import PortfolioDeProyectosEducativosPage_system_ai_E2zo9 from '@/pages/builder/portfolio-de-proyectos-educativos/PortfolioDeProyectosEducativosPage';
import BlogAccesibilidadPage_system_ai_FpYMJ from '@/pages/builder/blog-accesibilidad/BlogAccesibilidadPage';
import ServiciosDisenoEducativoPage_system_ai_hEovS from '@/pages/builder/servicios-diseno-educativo/ServiciosDisenoEducativoPage';
import ContactoDisenoEducativoPage_system_ai_hZ353 from '@/pages/builder/contacto-diseno-educativo/ContactoDisenoEducativoPage';
import HomePage_system_ai_ykmTx from '@/pages/builder/home/HomePage';
import DynamicProductPage_system from '@/pages/builder/dynamic-product/DynamicProductPage';
import '@/components/builder/styles/global.css';

function App() {
	return (
		<TooltipProvider>
			<EcommerceCartProvider>
				<Router>
					<a href="#contenido-principal" className="skip-link">
						Saltar al contenido principal
					</a>
					<ScrollToTop />
					<CustomSiteCode />
					<CookieConsent />
					<WhatsAppBubble />
					<EcommerceCheckoutSuccess />
					<Routes>
						{/* Rutas originales (100% mantenidas para no romper ningún link existente) */}
						<Route
							path={'/juego-interactivo-revolucion-de-mayo'}
							element={<JuegoInteractivoRevolucionDeMayoPage_system_z4XcVb />}
						/>
						<Route
							path={'/aplicaciones-interactivas'}
							element={<AplicacionesInteractivasPage_system_z6m0FG />}
						/>
						<Route
							path={'/recursos-para-docentes'}
							element={<RecursosParaDocentesPage_system_zH7SVS />}
						/>
						<Route
							path={'/blogchecklist-accesibilidad-materiales-educativos'}
							element={<BlogchecklistAccesibilidadMaterialesEducativosPage_system_zHzneZ />}
						/>
						<Route
							path={'/politicas-de-privacidad'}
							element={<PoliticasDePrivacidadPage_system_zJIEZB />}
						/>
						<Route
							path={'/ia-en-el-aula-2026-acuerdos-evaluacion'}
							element={<IaEnElAula2026AcuerdosEvaluacionPage_system_zKf4dd />}
						/>
						<Route
							path={'/sistema-de-gestion-de-inscripciones-a-mesas-de-examen-y-actas-digitales'}
							element={
								<SistemaDeGestionDeInscripcionesAMesasDeExamenYActasDigitalesPage_system_zUErCn />
							}
						/>
						<Route
							path={'/libro-de-temas-digital'}
							element={<LibroDeTemasDigitalPage />}
						/>
						<Route
							path={'/blogcomo-crear-pdf-accesible-docentes'}
							element={<BlogcomoCrearPdfAccesibleDocentesPage_system_zYPleC />}
						/>
						<Route
							path={'/evaluador-de-accesibilidad-de-materiales-didacticos'}
							element={<EvaluadorDeAccesibilidadDeMaterialesDidacticosPage_system_zcDbjO />}
						/>
						<Route
							path={'/httpsclaseiaxpressvercelapp'}
							element={<HttpsclaseiaxpressvercelappPage_system_zeg05 />}
						/>
						<Route
							path={'/contacto-institucional'}
							element={<ContactoInstitucionalPage_system_zn4Fu3 />}
						/>
						<Route
							path={'/terminos-y-condiciones'}
							element={<TerminosYCondicionesPage_system_zn5oG2 />}
						/>
						<Route
							path={
								'/pensamiento-critico-en-la-era-de-la-inteligencia-artificial-la-habilidad-que-marcara-la-diferencia'
							}
							element={
								<PensamientoCriticoEnLaEraDeLaInteligenciaArtificialLaHabilidadQueMarcaraLaDiferenciaPage_system_zpwVox />
							}
						/>
						<Route path={'/academia'} element={<AcademiaPage_system_zv7NaW />} />
						<Route path={'/campus'} element={<AcademiaPage_system_zv7NaW />} />
						<Route
							path={'/infografias-y-presentaciones-accesibles'}
							element={<InfografiasYPresentacionesAccesiblesPage_system_zxRCEo />}
						/>
						<Route
							path={'/materiales-accesibles-ordenados-guia'}
							element={<MaterialesAccesiblesOrdenadosGuiaPage_system_zytf_T />}
						/>
						<Route
							path={'/sobre-mi-materiales-educativos'}
							element={<SobreMiMaterialesEducativosPage_system_ai_8TAit />}
						/>
						<Route
							path={'/portfolio-de-proyectos-educativos'}
							element={<PortfolioDeProyectosEducativosPage_system_ai_E2zo9 />}
						/>
						<Route
							path={'/blog-accesibilidad'}
							element={<BlogAccesibilidadPage_system_ai_FpYMJ />}
						/>
						<Route
							path={'/servicios-diseno-educativo'}
							element={<ServiciosDisenoEducativoPage_system_ai_hEovS />}
						/>
						<Route
							path={'/contacto-diseno-educativo'}
							element={<ContactoDisenoEducativoPage_system_ai_hZ353 />}
						/>

						{/* Nuevas URLs limpias y amigables para compartir y posicionar en SEO */}
						<Route
							path={'/claseiaxpress'}
							element={<HttpsclaseiaxpressvercelappPage_system_zeg05 />}
						/>
						<Route
							path={'/app-claseiaxpress'}
							element={<HttpsclaseiaxpressvercelappPage_system_zeg05 />}
						/>
						<Route
							path={'/blog/checklist-accesibilidad-materiales-educativos'}
							element={<BlogchecklistAccesibilidadMaterialesEducativosPage_system_zHzneZ />}
						/>
						<Route
							path={'/blog/como-crear-pdf-accesible-docentes'}
							element={<BlogcomoCrearPdfAccesibleDocentesPage_system_zYPleC />}
						/>
						<Route
							path={'/evaluador-accesibilidad'}
							element={<EvaluadorDeAccesibilidadDeMaterialesDidacticosPage_system_zcDbjO />}
						/>

						<Route path={'/'} element={<HomePage_system_ai_ykmTx />} />
						<Route path={'/:slug'} element={<DynamicProductPage_system />} />
					</Routes>
				</Router>
			</EcommerceCartProvider>
			<Toaster />
		</TooltipProvider>
	);
}

export default App;
