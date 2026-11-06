import React from 'react';
import { ClipboardCheck } from 'lucide-react';
import Reveal from '@/components/Reveal';
import GridForm from '@/components/builder/elements/GridForm';

export default function Section2() {
	return (
		<section className="bg-[#f6f8fa] py-20 md:py-28">
			<div className="mx-auto max-w-3xl px-6">
				<Reveal>
					<div className="overflow-hidden rounded-3xl border border-[#1d7a4a]/15 bg-white shadow-xl shadow-slate-200/50">
						<div className="bg-gradient-to-br from-[#1b365d] to-[#24344c] p-8 text-center md:p-12">
							<ClipboardCheck className="mx-auto h-12 w-12 text-[#74c69d]" />
							<h2
								className="mt-6 text-2xl font-bold text-white sm:text-3xl"
								style={{ fontFamily: 'var(--font-primary)' }}
							>
								Recibí el checklist de accesibilidad de 20 puntos
							</h2>
							<p
								className="mt-4 text-base text-slate-300"
								style={{ fontFamily: 'var(--font-secondary)' }}
							>
								Te lo envío por email para que revises tus materiales antes de compartirlos
							</p>
						</div>
						<div className="p-8 md:p-12">
							<GridForm
								id="ai-9xpkzb"
								formId="Subscribe form 4"
								elementId="ai-9xpkzb"
								collectionName="subscribe_form_4"
								fields={[
									{
										key: 'email',
										sourceName: 'Email',
										label: 'Nombre completo',
										required: false,
										placeholder: 'Escribe tu nombre',
										type: 'text',
										control: 'text',
									},
									{
										key: 'email_2',
										sourceName: 'email',
										label: 'email',
										required: true,
										placeholder: 'tu email',
										type: 'text',
										control: 'text',
									},
								]}
								successMessage={
									'¡Listo! Revisá tu bandeja de entrada — o la carpeta de spam si no llega en unos minutos. Y si tenés alguna pregunta sobre accesibilidad en tus materiales, escribime directamente a meb@monicabattaglia.com.'
								}
								formBackgroundColor={'transparent'}
								formBorderWidth={0}
								formBorderRadius={0}
								formPadding={0}
								inputFillColor={'#f9fbfc'}
								inputFillColorHover={'#ffffff'}
								inputTextColor={'#1b365d'}
								inputTextColorHover={'#1b365d'}
								labelTextColor={'rgb(55, 65, 81)'}
								inputBorderColor={'#e2e8f0'}
								inputBorderColorHover={'#1d7a4a'}
								inputBorderWidth={1}
								inputBorderRadius={12}
								submitButtonBackgroundColor={'rgb(29, 122, 74)'}
								submitButtonBackgroundColorHover={'rgb(24, 102, 63)'}
								submitButtonFontColor={'#ffffff'}
								submitButtonFontColorHover={'#ffffff'}
								submitButtonBorderColor={'rgb(29, 122, 74)'}
								submitButtonBorderColorHover={'rgb(24, 102, 63)'}
								submitButtonBorderRadius={50}
								submitLabel={'Recibir el checklist'}
								submitAlign={'center'}
								className={
									'layout-element__component layout-element__component--GridForm'
								}
							/>
						</div>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
