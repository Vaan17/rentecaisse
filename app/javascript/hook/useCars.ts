import { useSelector } from "react-redux";
import createDeepEqualSelector from "../utils/createDeepEqualSelector";
import type { IVoiture } from "../pages/voitures/Voitures";

const selectCars = createDeepEqualSelector(
	(state) => state.data.voitures,
	(voitures) => voitures,
);

const useCars: () => Record<IVoiture["id"], IVoiture> = () => {
	return useSelector(selectCars) ?? {};
};

export default useCars;
