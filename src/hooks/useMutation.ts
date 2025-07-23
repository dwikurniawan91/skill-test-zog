import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { signInWithPopup, type UserCredential } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "@/api/firebase";
import useAuthStore from "@/store/authStore";
import type {
	APIErrorResponse,
	AuthResponse,
	LoginCredentials,
} from "@/types/auth";
import api from "../api/axios";

export const useLogin = () => {
	const queryClient = useQueryClient();
	const setAuth = useAuthStore((state) => state.setAuth);

	return useMutation<
		AuthResponse,
		AxiosError<APIErrorResponse>,
		LoginCredentials
	>({
		mutationFn: async (credentials) => {
			const response = await api.post<AuthResponse>("/auth/login", credentials);

			return response.data;
		},
		onSuccess: (data) => {
			setAuth({
				access_token: data.access_token,
			});
			queryClient.invalidateQueries({ queryKey: ["token"] });
		},
		onError: (error) => {
			if (error.response) {
				console.error(error.response.data.message);
			} else {
				console.error(error.message);
			}
		},
	});
};

export const useGoogleLogin = () => {
	const setAuth = useAuthStore((state) => state.setAuth);
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation<UserCredential, Error, void>({
		// UserCredential is Firebase's success object
		mutationFn: async () => {
			const result = await signInWithPopup(auth, googleProvider);
			return result;
		},
		onSuccess: async (result) => {
			// Firebase has authenticated the user.
			// Now, get the Firebase ID Token. This is what you'll treat as your app's token.
			const firebaseUser = result.user;
			const firebaseIdToken = await firebaseUser.getIdToken();
			navigate("/");
			setAuth({ access_token: firebaseIdToken }); // Update Zustand store
			queryClient.invalidateQueries({ queryKey: ["user"] }); // Invalidate user query if you still have /auth/me
		},
		onError: (error) => {
			console.error("Firebase Google Login Failed:", error.message);
		},
	});
};

export const useLogout = () => {
	const queryClient = useQueryClient();
	const logout = useAuthStore((state) => state.logout);

	return useMutation({
		onSuccess: () => {
			logout();
			queryClient.clear();
		},
		onError: (error) => {
			console.error(
				"Logout error (local state cleared anyway):",
				error.message,
			);
			logout(); // Always clear local state even if backend logout fails
		},
	});
};
