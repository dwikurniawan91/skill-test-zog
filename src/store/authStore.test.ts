import { beforeEach, describe, expect, it, vi } from "vitest";
import useAuthStore from "./authStore";

describe("authStore", () => {
	beforeEach(() => {
		useAuthStore.setState({
			user: null,
			access_token: null,
			isAuthenticated: false,
		});
		window.localStorage.clear();
	});

	it("should have initial state set correctly", () => {
		const state = useAuthStore.getState();
		expect(state.user).toBeNull();
		expect(state.access_token).toBeNull();
		expect(state.isAuthenticated).toBe(false);
	});

	it("should set authentication details on setAuth", () => {
		const mockToken = "mock-jwt-token";

		useAuthStore.getState().setAuth({ access_token: mockToken });

		const state = useAuthStore.getState();
		expect(state.access_token).toBe(mockToken);
		expect(state.isAuthenticated).toBe(true);
	});

	it("should persist state to localStorage after setAuth", () => {
		const mockToken = "mock-jwt-token";
		const setItemSpy = vi.spyOn(window.localStorage, "setItem"); // Spy on setItem

		useAuthStore.getState().setAuth({ access_token: mockToken });

		expect(setItemSpy).toHaveBeenCalledTimes(1);
		expect(setItemSpy).toHaveBeenCalledWith(
			"auth-storage",
			JSON.stringify({
				state: {
					access_token: mockToken,
					isAuthenticated: true, // Should be true if your partialize is correct
				},
				version: 0, // Default version from Zustand persist
			}),
		);
	});

	it("should clear authentication details on logout", () => {
		// First, set some auth details
		useAuthStore.getState().setAuth({
			access_token: "some-token",
		});

		// Then, logout
		useAuthStore.getState().logout();

		const state = useAuthStore.getState();
		expect(state.user).toBeNull();
		expect(state.access_token).toBeNull();
		expect(state.isAuthenticated).toBe(false);
	});

	// expect setItem with cleared data, not removeItem
	it("should persist cleared state to localStorage on logout", () => {
		// Populate state and localStorage first
		useAuthStore.getState().setAuth({
			access_token: "some-token",
		});
		const setItemSpy = vi.spyOn(window.localStorage, "setItem");

		// Clear the spy's history so we only check the call *after* logout
		setItemSpy.mockClear();

		useAuthStore.getState().logout();

		expect(setItemSpy).toHaveBeenCalledTimes(1);

		//  Assert the structure of the JSON string, not the exact string
		const [key, valueString] = setItemSpy.mock.calls[0]; // Get the arguments from the first call
		const parsedValue = JSON.parse(valueString); // Parse the stringified value

		expect(key).toBe("auth-storage");
		expect(parsedValue.state).toEqual({
			access_token: null,
			isAuthenticated: false,
		});
		expect(parsedValue.version).toBe(0);

		const storedItem = JSON.parse(
			window.localStorage.getItem("auth-storage") || "{}",
		);
		expect(storedItem.state).toEqual({
			access_token: null,
			isAuthenticated: false,
		});
	});
});
