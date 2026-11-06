#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const GEO_HEADER = `# Mónica Battaglia | Consultoría Pedagógica, Accesibilidad Educativa (WCAG) y App ClaseIAXpress

> Sitio oficial: https://monicabattaglia.com
> Aplicación con IA para docentes: https://app.monicabattaglia.com (Landing informativa: https://monicabattaglia.com/claseiaxpress)
> Campus Virtual de Cursos: https://campus.monicabattaglia.com
> Ubicación: Tupungato, Valle de Uco, Mendoza, Argentina (Atención online a docentes e instituciones educativas de toda Argentina y Latinoamérica).
> Contacto: meb@monicabattaglia.com | WhatsApp: +54 9 262 266-2596

## Quién es Mónica Battaglia
Analista de sistemas y educadora con más de 25 años de experiencia en el aula (Secundaria, Nivel Superior/Terciario y Universidad en Mendoza, Argentina). Especialista en diseño instruccional, accesibilidad digital educativa (WCAG 2.1/2.2 AA, Lectura Fácil, DUA), digitalización de procesos escolares e Inteligencia Artificial aplicada a la docencia.

## ClaseIAXpress (Asistente Pedagógico con Inteligencia Artificial)
Aplicación web creada para que docentes de Argentina ahorren hasta 10 horas semanales generando materiales alineados a los Núcleos de Aprendizajes Prioritarios (NAP) y al Diseño Curricular Provincial (DCP Mendoza). Todo es descargable en Word (.doc) editable y PDF.
- **Módulos incluidos**: Planificador de Clases Diarias, Secuencias Didácticas Completas, Planificador Anual y Trimestral, Generador de Rúbricas por Capacidades, Cuestionarios y Exámenes con Solucionario (Tema 1 y Tema 2), Módulo Avanzado de Inclusión (PPI y DUA), Actos Escolares y Discursos, Informes de Trayectorias y ChatBot Pedagógico.
- **Planes (Pago seguro en ARS con Mercado Pago)**:
  - **Plan Inicial ($0 / siempre gratis)**: 3 generaciones de prueba en total, acceso al ChatBot Pedagógico y 1 descarga de muestra en Word (.doc).
  - **Plan Docente Pro ($15.000 ARS / mes)**: Generaciones y descargas ilimitadas en Word y PDF, secuencias didácticas, rúbricas, cuestionarios con solucionario, actos escolares e historial.
  - **Plan Docente Experto ($30.000 ARS / mes)**: Módulo Avanzado de Inclusión (PPI y DUA), exámenes con múltiples variantes (Tema 1 y 2), informes cualitativos de trayectorias, proyectos ABP interdisciplinarios y soporte prioritario por WhatsApp con Mónica.

## Recursos Gratuitos Destacados para Docentes
- [Centro de Recursos Docentes](https://monicabattaglia.com/recursos-para-docentes): Descargas gratuitas, checklists, guías de accesibilidad y herramientas interactivas.
- [Evaluador Interactivo de Materiales Inclusivos](https://monicabattaglia.com/evaluador-de-accesibilidad-de-materiales-didacticos): Herramienta web gratuita en tiempo real para auditar la accesibilidad de guías y PDFs en 20 puntos.
- [Escape Room Digital Revolución de Mayo](https://monicabattaglia.com/juego-interactivo-revolucion-de-mayo): Juego educativo gratuito de Lengua y Matemática con pistas pedagógicas y Diploma de Honor imprimible.
- [Checklist de 20 puntos de Accesibilidad](https://monicabattaglia.com/blogchecklist-accesibilidad-materiales-educativos): Guía gratuita para docentes.
- [Guía paso a paso para crear PDFs accesibles](https://monicabattaglia.com/blogcomo-crear-pdf-accesible-docentes): Tutorial para Word, Google Docs y Canva.
`;

function main() {
	const outputPath = path.join(process.cwd(), 'public', 'llms.txt');
	const dir = path.dirname(outputPath);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
	fs.writeFileSync(outputPath, GEO_HEADER.trim() + '\n', 'utf8');
}

main();
