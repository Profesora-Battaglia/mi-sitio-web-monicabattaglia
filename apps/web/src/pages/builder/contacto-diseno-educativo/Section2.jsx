import React from 'react';
import { Mail } from 'lucide-react';
import Reveal from '@/components/Reveal';
import GridForm from '@/components/builder/elements/GridForm';

export default function Section2() {
	return (
		<section className="bg-white py-20 md:py-28">
			<div className="mx-auto max-w-3xl px-6">
				<Reveal>
					<div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#1b365d] to-[#24344c] p-8 text-center shadow-xl md:p-12">
						<Mail className="mx-auto h-10 w-10 text-[#74c69d]" />
						<h2
							className="mt-6 text-2xl font-bold text-white sm:text-3xl"
							style={{ fontFamily: 'var(--font-primary)' }}
						>
							Suscríbete aquí
						</h2>
						<p className="mt-4 text-base text-slate-300" style={{ fontFamily: 'var(--font-secondary)' }}>
							Recibe novedades y recursos educativos
						</p>
						<div className="mt-8">
							<GridForm
								id="ai-ez4NpO"
								formId="Subscribe form 5"
								elementId="ai-ez4NpO"
								collectionName="subscribe_form_5"
								fields={[
									{
										key: 'email',
										sourceName: 'Email',
										label: 'Tu nombre',
										required: false,
										placeholder: 'Escribe tu nombre',
										contactAttribute: 'name',
										type: 'text',
										control: 'text',
									},
									{
										key: 'tu_email',
										sourceName: 'tu email',
										label: 'tu email',
										required: true,
										placeholder: 'Email',
										contactAttribute: 'email',
										type: 'email',
										control: 'text',
									},
								]}
								successMessage={'Mensaje enviado'}
								formBackgroundColor={'transparent'}
								formBorderWidth={0}
								formBorderRadius={0}
								formPadding={0}
								inputFillColor={'rgba(255,255,255,0.1)'}
								inputFillColorHover={'rgba(255,255,255,0.15)'}
								inputTextColor={'#ffffff'}
								inputTextColorHover={'#ffffff'}
								labelTextColor={'rgb(203, 213, 225)'}
								inputBorderColor={'rgba(255,255,255,0.2)'}
								inputBorderColorHover={'rgba(255,255,255,0.4)'}
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
