import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { loginUser, registerUser, setAuthToken } from "./apiClient";

interface User {
	id: string;
	name: string;
	email: string;
	phone: string;
}

interface AuthContextValue {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	login: (credentials: { emailOrPhone: string; password: string }) => Promise<void>;
	register: (payload: {
		name: string;
		email: string;
		phone: string;
		password: string;
	}) => Promise<void>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);

	const login = async ({
		emailOrPhone,
		password,
	}: {
		emailOrPhone: string;
		password: string;
	}) => {
		const payload: any = { password };
		if (emailOrPhone.includes("@")) {
			payload.email = emailOrPhone;
		} else {
			payload.phone = emailOrPhone;
		}

		const response = await loginUser(payload);
		setToken(response.data.token);
		setAuthToken(response.data.token);
		setUser(response.data.user);
	};

	const register = async (payload: {
		name: string;
		email: string;
		phone: string;
		password: string;
	}) => {
		await registerUser(payload);
	};

	const logout = () => {
		setUser(null);
		setToken(null);
		setAuthToken(null);
	};

	const value = useMemo(
		() => ({
			user,
			token,
			isAuthenticated: Boolean(user && token),
			login,
			register,
			logout,
		}),
		[user, token],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within AuthProvider");
	}
	return context;
}
