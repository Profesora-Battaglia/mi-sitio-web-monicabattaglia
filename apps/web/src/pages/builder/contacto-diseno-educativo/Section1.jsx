import React from 'react';
import { Mail, MessageCircle } from 'lucide-react';
import Reveal from '@/components/Reveal';
import GridForm from '@/components/builder/elements/GridForm';

export default function Section1() {
	return (
		<section className="relative overflow-hidden bg-gradient-to-br from-[#e9eff5] via-white to-[#e3f1ea]">
			<div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#74c69d]/20 blur-3xl" />
			<div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
				<div className="grid gap-12 lg:grid-cols-2">
					<Reveal>
						<div>
							<span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-[#1d7a4a] shadow-sm ring-1 ring-[#1d7a4a]/15 backdrop-blur">
								Contacto
							</span>
							<h1
								className="mt-6 text-4xl font-bold leading-[1.15] text-[#1b365d] sm:text-5xl"
								style={{ fontFamily: 'var(--font-primary)' }}
							>
								Contáctame aquí
							</h1>
							<h2
								className="mt-4 text-2xl font-bold leading-tight text-[#1d7a4a] sm:text-3xl"
								style={{ fontFamily: 'var(--font-primary)' }}
							>
								¿Quieres asesoría o un proyecto personalizado? Escríbeme.
							</h2>
							<p
								className="mt-6 text-lg leading-relaxed text-slate-600"
								style={{ fontFamily: 'var(--font-secondary)' }}
							>
								Trabajemos juntos para crear experiencias educativas que marquen la diferencia. Diseño
								pedagógico, accesibilidad e IA aplicada al aula real.
							</p>
							<div className="mt-8 space-y-4">
								<a
									href="https://wa.me/5492622662596"
									target="_blank"
									rel="nofollow noreferrer"
									className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 transition-all duration-200 hover:border-[#1d7a4a]/20 hover:shadow-lg hover:shadow-slate-200/60"
								>
									<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1d7a4a]/10 text-[#1d7a4a]">
										<MessageCircle className="h-6 w-6" />
									</div>
									<div>
										<p
											className="text-sm font-semibold text-[#1b365d]"
											style={{ fontFamily: 'var(--font-primary)' }}
										>
											WhatsApp
										</p>
										<p className="text-sm text-slate-500">+54 9 262 266-2596</p>
									</div>
								</a>
								<a
									href="mailto:meb@monicabattaglia.com"
									className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 transition-all duration-200 hover:border-[#1d7a4a]/20 hover:shadow-lg hover:shadow-slate-200/60"
								>
									<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1d7a4a]/10 text-[#1d7a4a]">
										<Mail className="h-6 w-6" />
									</div>
									<div>
										<p
											className="text-sm font-semibold text-[#1b365d]"
											style={{ fontFamily: 'var(--font-primary)' }}
										>
											Email
										</p>
										<p className="text-sm text-slate-500">meb@monicabattaglia.com</p>
									</div>
								</a>
							</div>
						</div>
					</Reveal>
					<Reveal delay={0.15}>
						<div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50 md:p-10">
							<GridForm
								id="ai-_HeLPP"
								formId="Contact form 3"
								elementId="ai-_HeLPP"
								collectionName="contact_form_3"
								fields={[
									{
										key: 'full_name',
										sourceName: 'Full name',
										label: 'Nombre completo',
										required: false,
										placeholder: 'Escribe tu nombre',
										type: 'text',
										control: 'text',
									},
									{
										key: 'email',
										sourceName: 'Email',
										label: 'Correo electrónico',
										required: true,
										placeholder: 'tu correo',
										contactAttribute: 'email',
										type: 'email',
										control: 'text',
									},
									{
										key: 'message',
										sourceName: 'Message',
										label: 'Mensaje',
										required: true,
										placeholder: 'Contame en qué puedo ayudarte',
										type: 'text',
										control: 'textarea',
									},
								]}
								successMessage={'Mensaje enviado'}
								formBackgroundColor={'transparent'}
								formBorderWidth={0}
								formBorderRadius={20}
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
								submitButtonFontFamily={'Roboto'}
								submitButtonFontWeight={500}
								submitButtonBorderColor={'rgb(29, 122, 74)'}
								submitButtonBorderColorHover={'rgb(24, 102, 63)'}
								submitButtonBorderRadius={50}
								submitLabel={'Enviar mensaje'}
								submitAlign={'center'}
								showPrivacyConsent
								className={
									'layout-element__component layout-element__component--GridForm'
								}
							/>
						</div>
					</Reveal>
				</div>
			</div>
		</section>
	);
}
