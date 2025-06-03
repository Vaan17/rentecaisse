import { useSelector } from "react-redux";
import createDeepEqualSelector from "../utils/createDeepEqualSelector";
import type { ISite } from "../pages/sites/Sites";

const selectSites = createDeepEqualSelector(
	(state) => state.data.sites,
	(sites) => sites,
);

const useSites: () => Record<ISite["id"], ISite> = () => {
	return useSelector(selectSites) ?? {};
};

export default useSites;
