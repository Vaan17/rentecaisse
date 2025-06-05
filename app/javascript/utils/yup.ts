import * as Yup from "yup";

Yup.setLocale({
	mixed: {
		required: "Le champ est requis",
		notType: function notType(_ref) {
			switch (_ref.type) {
				case "number":
					return "Ce champ doit contenir un nombre";
				case "string":
					return "Ce champ doit contenir une chaîne de caractères";
				default:
					return "Champ invalide";
			}
		},
	},
	string: {
		email: "L'adresse email est invalide",
	},
	array: {
		min: ({ min }) =>
			min > 1
				? `Au moins ${min} éléments doivent sélectionnés`
				: "Le champ est requis",
	},
});

export default Yup;
