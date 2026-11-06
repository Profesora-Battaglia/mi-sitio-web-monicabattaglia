import React from 'react';
import { Link } from 'react-router-dom';

export function isInternalHref(href) {
	if (!href || typeof href !== 'string') {
		return false;
	}

	if (href.startsWith('//') || href.startsWith('/\\')) {
		return false;
	}

	return href.startsWith('/');
}

export default function SmartLink({
	href = '#',
	to,
	target,
	rel,
	children,
	...rest
}) {
	const destination = to ?? href;
	const openInNewTab = Boolean(target) && target !== '_self';

	if (!openInNewTab && isInternalHref(destination)) {
		return (
			<Link to={destination} target={target} rel={rel} {...rest}>
				{children}
			</Link>
		);
	}

	return (
		<a
			href={destination}
			target={target}
			rel={rel}
			{...rest}
		>
			{children}
		</a>
	);
}
