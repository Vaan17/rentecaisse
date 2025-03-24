export interface User {
	id: number;
	username: string;
	role: string;
}

export interface RootState {
	auth: {
		user: User | null;
		isAuthenticated: boolean;
	};
}
