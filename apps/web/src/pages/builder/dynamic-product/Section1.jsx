import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, ExternalLink } from 'lucide-react';
import BlockEcommerceProduct from '@/components/builder/blocks/BlockEcommerceProduct';
import TeacherShareBar from '@/components/TeacherShareBar';
import { getResourceBySlug } from '@/pages/builder/shared/catalogData';

export default function Section1() {
	const { slug } = useParams();
	const catalogItem = getResourceBySlug(slug);

	if (catalogItem) {
		return (
			<section className="bg-[#f6f8fa] py-16 md:py-24">
				<div className="mx-auto max-w-5xl px-6">
					<Link
						to="/recursos-para-docentes"
						className="inline-flex items-center gap-2 text-sm font-semibold text-[#1d7a4a] hover:underline"
					>
						<ArrowLeft className="h-4 w-4" />
						Volver a Recursos para Docentes
					</Link>

					<div className="mt-6 grid gap-10 overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 shadow-lg lg:grid-cols-12 lg:p-10">
						<div className="lg:col-span-5">
							<img
								src={catalogItem.image}
								alt={catalogItem.title}
								className="aspect-[4/3] w-full rounded-2xl object-cover shadow-md"
							/>
						</div>
						<div className="flex flex-col lg:col-span-7">
							<div className="flex flex-wrap items-center gap-2">
								<span className="rounded-full bg-[#1d7a4a]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#1d7a4a]">
									{catalogItem.categoryLabel}
								</span>
								<span className="rounded-full bg-[#1b365d] px-3 py-1 text-xs font-bold text-white">
									{catalogItem.priceLabel}
								</span>
							</div>
							<h1
								className="mt-4 text-3xl font-bold leading-tight text-[#1b365d]"
								style={{ fontFamily: 'var(--font-primary)' }}
							>
								{catalogItem.title}
							</h1>
							<p className="mt-3 text-base leading-relaxed text-slate-600">
								{catalogItem.description}
							</p>
							{catalogItem.highlights && (
								<ul className="mt-5 space-y-2.5 border-t border-slate-100 pt-5">
									{catalogItem.highlights.map((h) => (
										<li key={h} className="flex items-start gap-2.5 text-sm text-slate-700">
											<Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1d7a4a]" />
											<span>{h}</span>
										</li>
									))}
								</ul>
							)}
							<div className="mt-8 flex flex-wrap gap-3">
								{catalogItem.isInternal ? (
									<Link
										to={catalogItem.ctaUrl}
										className="inline-flex items-center gap-2 rounded-full bg-[#1d7a4a] px-7 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-[#18663f]"
									>
										{catalogItem.ctaText}
										<ArrowRight className="h-4 w-4" />
									</Link>
								) : (
									<a
										href={catalogItem.ctaUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-2 rounded-full bg-[#1d7a4a] px-7 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-[#18663f]"
									>
										{catalogItem.ctaText}
										<ExternalLink className="h-4 w-4" />
									</a>
								)}
								{catalogItem.secondaryCtaText && catalogItem.secondaryCtaUrl && (
									<a
										href={catalogItem.secondaryCtaUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-2 rounded-full border border-[#1b365d]/20 bg-white px-6 py-3.5 text-sm font-semibold text-[#1b365d] hover:bg-[#1b365d] hover:text-white"
									>
										{catalogItem.secondaryCtaText}
									</a>
								)}
							</div>
						</div>
					</div>
				</div>
				<TeacherShareBar title={catalogItem.title} />
			</section>
		);
	}

	return (
		<BlockEcommerceProduct
			blockId={'z-utgn'}
			productId={undefined}
			imageRatio={'contain'}
			imageBorderRadius={'0%'}
			whatsAppNumber={undefined}
			whatsAppMessage={undefined}
			galleryPlacement={'bottom'}
			isQuantityPickerEnabled={true}
			style={{
				'--block-padding-top': '100px',
				'--block-padding': '100px 16px',
				'--block-padding-right': '16px',
				'--block-padding-bottom': '100px',
				'--block-padding-left': '16px',
				'--content-width': '1224px',
				'--m-block-padding': '56px 16px',
				backgroundColor: 'rgb(243, 244, 246)',
				'--h1-color': 'rgb(26, 26, 26)',
				'--h2-color': 'rgb(26, 26, 26)',
				'--h3-color': 'rgb(26, 26, 26)',
				'--h4-color': 'rgb(26, 26, 26)',
				'--h5-color': 'rgb(26, 26, 26)',
				'--h6-color': 'rgb(26, 26, 26)',
				'--body-color': 'rgb(26, 26, 26)',
				'--body-large-color': 'rgb(26, 26, 26)',
				'--grid-button-primary-color': 'rgb(233, 239, 245)',
				'--grid-button-secondary-color': 'rgb(46, 47, 49)',
				'--grid-button-primary-font-size': '16px',
				'--grid-button-primary-padding-x': '40px',
				'--grid-button-primary-padding-y': '18px',
				'--grid-button-primary-color-hover': 'rgb(233, 239, 245)',
				'--grid-button-primary-m-font-size': '16px',
				'--grid-button-primary-m-padding-x': '40px',
				'--grid-button-primary-m-padding-y': '18px',
				'--grid-button-primary-border-color': 'rgb(255, 255, 255)',
				'--grid-button-primary-color-active': 'rgb(233, 239, 245)',
				'--grid-button-secondary-color-hover': 'rgb(29, 30, 32)',
				'--grid-button-secondary-border-color': 'rgb(116, 198, 157)',
				'--grid-button-primary-background-color': 'rgb(29, 122, 74)',
				'--grid-button-primary-border-color-hover': 'rgb(29, 30, 32)',
				'--grid-button-secondary-background-color': 'rgb(116, 198, 157)',
				'--grid-button-primary-border-color-active': 'rgb(255, 255, 255)',
				'--grid-button-secondary-border-color-hover': 'rgb(241, 241, 241)',
				'--grid-button-secondary-border-color-active': 'rgb(116, 198, 157)',
				'--grid-button-primary-background-color-hover': 'rgb(29, 30, 32)',
				'--grid-button-primary-background-color-active': 'rgb(29, 122, 74)',
				'--grid-button-secondary-background-color-hover': 'rgb(241, 241, 241)',
				'--grid-button-secondary-background-color-active': 'rgb(255, 255, 255)',
			}}
		/>
	);
}
