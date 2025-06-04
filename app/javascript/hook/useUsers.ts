import { useSelector } from "react-redux";
import createDeepEqualSelector from "../utils/createDeepEqualSelector";
import type { IUser } from "./useUser";

const selectUsers = createDeepEqualSelector(
	(state) => state.data.utilisateurs,
	(utilisateurs) => utilisateurs,
);

const useUsers: () => Record<IUser["id"], IUser> = () => {
	return useSelector(selectUsers) ?? {};
};

export default useUsers;
