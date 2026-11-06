/// <reference path="../pb_data/types.d.ts" />

migrate(
	(app) => {
		const definitions = [
			{
				"name": "contact_form_2",
				"fields": [
					{
						"name": "nombre_del_directivo",
						"type": "text"
					},
					{
						"name": "nombre_de_la_instituci_n",
						"type": "text"
					},
					{
						"name": "email",
						"type": "email"
					},
					{
						"name": "n_mero_de_celular_o_tel_fono",
						"type": "text"
					},
					{
						"name": "mensaje",
						"type": "text"
					}
				]
			},
			{
				"name": "subscribe_form_4",
				"fields": [
					{
						"name": "email",
						"type": "text"
					},
					{
						"name": "email_2",
						"type": "text"
					}
				]
			},
			{
				"name": "contact_form_3",
				"fields": [
					{
						"name": "full_name",
						"type": "text"
					},
					{
						"name": "email",
						"type": "email"
					},
					{
						"name": "message",
						"type": "text"
					}
				]
			},
			{
				"name": "subscribe_form_5",
				"fields": [
					{
						"name": "email",
						"type": "text"
					},
					{
						"name": "tu_email",
						"type": "email"
					}
				]
			}
		];

		for (const definition of definitions) {
			let exists = true;

			try {
				app.findCollectionByNameOrId(definition.name);
			} catch (_) {
				exists = false;
			}

			if (exists) {
				continue;
			}

			const collection = new Collection({
				type: "base",
				name: definition.name,
				listRule: null,
				viewRule: null,
				createRule: "",
				updateRule: null,
				deleteRule: null,
				fields: [
					...definition.fields,
					{ name: "submitted_at", type: "date" },
					{ name: "created", type: "autodate", onCreate: true, onUpdate: false },
					{ name: "updated", type: "autodate", onCreate: true, onUpdate: true },
				],
			});

			app.save(collection);
		}

		const labels = definitions.map((definition) => `${definition.name}:create`);
		const settings = app.settings();
		const rules = [];
		const existingRules = settings.rateLimits.rules || [];

		for (let index = 0; index < existingRules.length; index += 1) {
			const rule = existingRules[index];

			if (labels.indexOf(rule.label) === -1) {
				rules.push({
					label: rule.label,
					audience: rule.audience,
					duration: rule.duration,
					maxRequests: rule.maxRequests,
				});
			}
		}

		for (const label of labels) {
			rules.push({
				label,
				audience: "",
				duration: 10 * 60,
				maxRequests: 10,
			});
		}

		settings.rateLimits = {
			enabled: true,
			rules,
		};

		app.save(settings);
	},
	(app) => {
		const names = ["contact_form_2","subscribe_form_4","contact_form_3","subscribe_form_5"];
		const labels = names.map((name) => `${name}:create`);
		const settings = app.settings();
		const rules = [];
		const existingRules = settings.rateLimits.rules || [];

		for (let index = 0; index < existingRules.length; index += 1) {
			const rule = existingRules[index];

			if (labels.indexOf(rule.label) === -1) {
				rules.push({
					label: rule.label,
					audience: rule.audience,
					duration: rule.duration,
					maxRequests: rule.maxRequests,
				});
			}
		}

		settings.rateLimits = {
			enabled: settings.rateLimits.enabled,
			rules,
		};

		app.save(settings);

		for (const name of names) {
			try {
				app.delete(app.findCollectionByNameOrId(name));
			} catch (_) {
				continue;
			}
		}
	},
);
