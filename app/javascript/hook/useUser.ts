import { useSelector } from "react-redux";
import createDeepEqualSelector from "../utils/createDeepEqualSelector";

export interface IUser {
	id: number;
	nom: string;
	prenom: string;
	email: string;
	genre: string;
	date_naissance: string;
	adresse: string;
	code_postal: string;
	ville: string;
	pays: string;
	telephone: string;
	categorie_permis: string;
	lien_image_utilisateur: string;
	email_confirme: boolean;
	entreprise_id: number;
	site_id: number;
	confirmation_entreprise: boolean;
	admin_entreprise: boolean;
	admin_rentecaisse: boolean;
	derniere_connexion: string;
	desactive: boolean;
	date_demande_suppression: string;
	updated_at: string;
}

const selectUser = createDeepEqualSelector(
	(state) => state.user,
	(user) => user,
);

const useUser: () => IUser = () => {
	return useSelector(selectUser) ?? {};
};

export default useUser;
