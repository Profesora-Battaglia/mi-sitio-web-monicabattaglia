import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Reveal from '@/components/Reveal';

export default function Section3() {
	return (
		<section className="bg-white pb-20 md:pb-28">
			<div className="mx-auto max-w-7xl px-6 text-center">
				<Reveal>
					<a
						href="/recursos-para-docentes"
						className="inline-flex items-center gap-2 rounded-full border-2 border-[#1b365d]/15 bg-white px-8 py-4 text-base font-semibold text-[#1b365d] transition-all duration-200 hover:border-[#1b365d]/30 hover:bg-[#1b365d] hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1b365d]/20 active:scale-[0.98]"
					>
						<ArrowLeft className="h-5 w-5" />
						Volver a Recursos
					</a>
				</Reveal>
			</div>
		</section>
	);
}
