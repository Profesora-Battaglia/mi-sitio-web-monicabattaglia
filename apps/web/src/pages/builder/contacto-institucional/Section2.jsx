import React from 'react';
import Reveal from '@/components/Reveal';
import GridForm from '@/components/builder/elements/GridForm';

export default function Section2() {
	return (
		<section className="bg-white py-20 md:py-28">
			<div className="mx-auto max-w-3xl px-6">
				<Reveal>
					<div className="rounded-3xl border border-slate-100 bg-[#f9fbfc] p-8 shadow-xl shadow-slate-200/50 md:p-12">
						<GridForm
							id="zGN76q"
							formId="Contact form 2"
							elementId="zGN76q"
							collectionName="contact_form_2"
							fields={[
								{
									key: 'nombre_del_directivo',
									sourceName: 'Nombre del Directivo',
									label: 'Nombre del Directivo',
									required: true,
									placeholder: 'Directivo',
									type: 'text',
									control: 'text',
								},
								{
									key: 'nombre_de_la_instituci_n',
									sourceName: 'Nombre de la Institución',
									label: 'Nombre de la Institución',
									required: true,
									placeholder: ' Institución',
									type: 'text',
									control: 'text',
								},
								{
									key: 'email',
									sourceName: 'Email',
									label: 'Email',
									required: true,
									placeholder: 'Correo electrónico',
									contactAttribute: 'email',
									type: 'email',
									control: 'text',
								},
								{
									key: 'n_mero_de_celular_o_tel_fono',
									sourceName: 'Número de celular o teléfono',
									label: 'Número de celular o teléfono',
									required: false,
									placeholder: 'Nro. de Celular',
									contactAttribute: 'phone',
									type: 'text',
									control: 'text',
								},
								{
									key: 'mensaje',
									sourceName: 'Mensaje',
									label: 'Mensaje',
									required: true,
									placeholder:
										'Contame qué necesitás para tu institución. Revisaré tu consulta y te responderé dentro de 24 horas hábiles con el siguiente paso recomendado',
									type: 'text',
									control: 'textarea',
								},
							]}
							successMessage={
								'Muchas gracias, en breve nos comunicaremos con Usted.'
							}
							formBackgroundColor={'transparent'}
							formBorderWidth={0}
							formBorderRadius={0}
							formPadding={0}
							inputFillColor={'#ffffff'}
							inputFillColorHover={'#f8fafc'}
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
							submitLabel={'Enviar'}
							submitAlign={'center'}
							showPrivacyConsent
							className={
								'layout-element__component layout-element__component--GridForm'
							}
						/>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
