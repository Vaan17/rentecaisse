import { useSelector } from "react-redux";
import createDeepEqualSelector from "../utils/createDeepEqualSelector";

export interface IPassager {
    id: number;
    nom: string;
    prenom: string;
    email: string;
}

export interface IEmprunt {
	id: number,
    statut_emprunt: string,
    nom_emprunt: string,
    description: string,
    date_debut: string,
    date_fin: string,
    utilisateur_demande_id: number,
    liste_passager_id: number[] | string[],
    voiture_id: number,
    cle_id: number,
    localisation_id: number,
    updated_at: string,
    passagers?: IPassager[]
}

const selectEmprunts = createDeepEqualSelector(
	(state) => state.data.emprunts,
	(emprunts) => emprunts,
);

const useEmprunts: () => Record<IEmprunt["id"], IEmprunt> = () => {
	return useSelector(selectEmprunts) ?? {};
};

export default useEmprunts;
