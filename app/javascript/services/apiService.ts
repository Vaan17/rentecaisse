import axios from "axios";

const API_URL = "http://localhost:3000"; //todo later : create a .env file for this

// Création d'une instance axios personnalisée
const axiosSecured = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

// Ajout d'un intercepteur pour les requêtes
axiosSecured.interceptors.request.use(
	(config) => {
		// Récupération du token depuis le localStorage
		const token = localStorage.getItem("token");

		// Ajout du token d'authentification si disponible
		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

// Ajout d'un intercepteur pour les réponses
axiosSecured.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		// Redirection vers la page de login en cas d'erreur 401 (non autorisé)
		if (error.response && error.response.status === 401) {
			localStorage.removeItem("token");
			window.location.href = "/login";
		}
		return Promise.reject(error);
	},
);

export default axiosSecured;
