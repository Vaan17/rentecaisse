import { useSelector } from "react-redux";
import createDeepEqualSelector from "../utils/createDeepEqualSelector";

const selectCars = createDeepEqualSelector(
	(state) => state.data.voitures,
	(voitures) => voitures,
);

const useCars = () => {
	return useSelector(selectCars) ?? {};
};

export default useCars;
