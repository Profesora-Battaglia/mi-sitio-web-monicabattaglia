import React from 'react';

function buildSrcdoc(content) {
	const html = content || '';

	return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
html{overflow:hidden}*{margin:0;padding:0;box-sizing:border-box}iframe{max-width:100%}
</style></head><body>${html}</body></html>`;
}

function toCssHeight(value) {
	if (value == null || value === '') {
		return undefined;
	}

	return typeof value === 'number' ? `${value}px` : value;
}

export default function GridEmbed({
	id,
	content = '',
	initialHeight,
	initialHeightMobile,
}) {
	if (!content) {
		return (
			<div className="grid-embed" data-element-id={id}>
				<span>GridEmbed</span>
			</div>
		);
	}

	const style = {
		'--embed-height': toCssHeight(initialHeight),
		'--m-embed-height': toCssHeight(initialHeightMobile),
	};

	return (
		<div
			className="grid-embed"
			data-element-id={id}
			style={style}
		>
			<iframe
				title="Custom embed"
				srcDoc={buildSrcdoc(content)}
				sandbox="allow-scripts allow-forms allow-popups"
				style={{
					width: '100%',
					height: '100%',
					border: 0,
					display: 'block',
				}}
			/>
		</div>
	);
}
