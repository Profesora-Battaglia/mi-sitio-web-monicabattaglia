export async function loadCookieConsentRunner() {
	const [{ run }] = await Promise.all([
		import('vanilla-cookieconsent'),
		import('vanilla-cookieconsent/dist/cookieconsent.css'),
	]);

	return run;
}
