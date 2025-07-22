import { create } from "zustand";
import type { PersistStorage, StorageValue } from "zustand/middleware";
import { devtools, persist } from "zustand/middleware";
import type { User } from "../types/auth";

interface AuthState {
	user: User | null;
	access_token: string | null; // Token is stored in Zustand state and persisted
	refresh_token: string | null; // Token is stored in Zustand state and persisted
	isAuthenticated: boolean;
	setAuth: ({
		access_token,
		refresh_token,
	}: {
		access_token: string;
		refresh_token: string;
	}) => void;
	logout: () => void;
}

type PersistedState = Pick<AuthState, "access_token" | "refresh_token">;

const customStorage: PersistStorage<PersistedState> = {
	getItem: (name: string): StorageValue<PersistedState> | null => {
		try {
			const str = localStorage.getItem(name);
			console.log(`[Persist] Getting item: ${name}`);
			if (!str) return null;
			return JSON.parse(str) as StorageValue<PersistedState>;
		} catch (error) {
			console.error("Error getting item from localStorage:", error);
			return null;
		}
	},
	setItem: (name: string, value: StorageValue<PersistedState>): void => {
		try {
			localStorage.setItem(name, JSON.stringify(value));
			console.log(`[Persist] SET item: ${JSON.stringify(value)}`);
		} catch (error) {
			console.error("Error setting item in localStorage:", error);
		}
	},
	removeItem: (name: string): void => {
		try {
			localStorage.removeItem(name);
		} catch (error) {
			console.error("Error removing item from localStorage:", error);
		}
	},
};

// src/store/authStore.ts
// ...
const useAuthStore = create<AuthState>()(
	devtools(
		persist(
			(set) => ({
				user: null,
				access_token: null,
				refresh_token: null,
				isAuthenticated: false,
				setAuth: ({ access_token, refresh_token }) => {
					set({ access_token, refresh_token, isAuthenticated: !!access_token });
				},
				logout: () =>
					set({
						access_token: null,
						refresh_token: null,
						isAuthenticated: false,
					}),
			}),
			{
				name: "auth-storage",
				storage: customStorage,
				partialize: (state) => {
					const persistedState = {
						access_token: state.access_token,
						refresh_token: state.refresh_token,
						isAuthenticated: state.isAuthenticated,
					};
					return persistedState;
				},
			},
		),
		{ name: "AuthStore" },
	),
);

export default useAuthStore;
