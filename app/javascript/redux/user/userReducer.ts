// Reducers
const initialState = {
	id: null,
	nom: null,
	prénom: null,
	entreprise_id: null,
	site_id: null,
	admin_entreprise: false,
	admin_rentecaisse: false,
};

const userReducer = (state = initialState, action) => {
	switch (action.type) {
		case "action1":
			return console.log("action1");
		default:
			return state;
	}
};

export default userReducer;
