import { useSelector } from "react-redux";
import createDeepEqualSelector from "../utils/createDeepEqualSelector";

export interface ICle {
	id: string;
	statut_cle: string;
	voiture_id: number;
	site_id: number;
	updated_at: string;
}

const selectKeys = createDeepEqualSelector(
	(state) => state.data.cles,
	(cles) => cles,
);

const useCles: () => Record<ICle["id"], ICle> = () => {
	return useSelector(selectKeys) ?? {};
};

export default useCles;
