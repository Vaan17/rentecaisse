import { createSelectorCreator, weakMapMemoize } from "reselect";
import _ from "lodash";

// Use lodash isEqual instead of ===
const createDeepEqualSelector = createSelectorCreator(
	weakMapMemoize,
	_.isEqual,
);

export default createDeepEqualSelector;
