import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom"; // For toBInTheDocument, etc.
import type { UseMutationResult } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { MemoryRouter } from "react-router-dom";
import * as authMutations from "@/hooks/useMutation";
import useAuthStore from "@/store/authStore";
import type {
	APIErrorResponse,
	AuthResponse,
	LoginCredentials,
} from "@/types/auth";
import LoginPage from "./LoginPage";

// src/tests/setup.ts or at the top of your test file
if (typeof window !== "undefined" && !window.ResizeObserver) {
	window.ResizeObserver = class {
		observe() {}
		unobserve() {}
		disconnect() {}
	};
}

// Mock the react-router-dom's useNavigate hook
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
	const actual = await importOriginal<typeof import("react-router-dom")>();
	return {
		...actual,
		useNavigate: () => mockNavigate, // Always return our mockNavigate
	};
});

// Mock the useLogin and useGoogleLogin hooks from useMutation
const mockLoginUserMutate = vi.fn();
const mockGoogleLoginMutate = vi.fn();

describe("LoginPage", () => {
	beforeEach(() => {
		// Reset mocks and Zustand store state before each test
		vi.clearAllMocks();
		useAuthStore.setState({
			user: null,
			access_token: null,
			isAuthenticated: false,
		});

		// Ensure useLogin and useGoogleLogin always return consistent mock objects
		vi.spyOn(authMutations, "useLogin").mockReturnValue({
			mutate: mockLoginUserMutate,
			mutateAsync: vi.fn(),
			isPending: false,
			isSuccess: false,
			isError: false,
			error: null,
			data: undefined,
			variables: undefined,
			status: "idle",
			isIdle: true,
			isLoading: false,
			isPaused: false,
			reset: vi.fn(),
			context: undefined,
			failureCount: 0,
			failureReason: null,
			submittedAt: undefined,
		} as unknown as UseMutationResult<
			AuthResponse,
			AxiosError<APIErrorResponse>,
			LoginCredentials,
			unknown
		>);

		// Do the same for useGoogleLogin
		vi.spyOn(authMutations, "useGoogleLogin").mockReturnValue({
			mutate: mockGoogleLoginMutate,
			mutateAsync: vi.fn(),
			isPending: false,
			isSuccess: false,
			isError: false,
			error: null,
			data: undefined,
			variables: undefined,
			status: "idle",
			isIdle: true,
			isLoading: false,
			isPaused: false,
			reset: vi.fn(),
			context: undefined,
			failureCount: 0,
			failureReason: null,
			submittedAt: undefined,
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		} as unknown as UseMutationResult<any, any, void, unknown>);
	});

	// --- Initial Render Tests ---
	it("should render login form inputs and buttons correctly", () => {
		render(
			<MemoryRouter>
				<LoginPage />
			</MemoryRouter>,
		);

		// Check for email and password input fields
		expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

		// Check for login button
		expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();

		// Check for Google login button
		expect(
			screen.getByRole("button", { name: /continue with google/i }),
		).toBeInTheDocument();

		// Check for "Remember me" checkbox
		expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();

		// Check for "Forgot password?" link
		expect(
			screen.getByRole("link", { name: /forgot password/i }),
		).toBeInTheDocument();

		// Check for "Create an account" link
		expect(
			screen.getByRole("link", { name: /create an account/i }),
		).toBeInTheDocument();
	});

	it("should navigate to home on successful email/password login", async () => {
		// Place the mock implementation here
		mockLoginUserMutate.mockImplementationOnce((_data, options) => {
			// Simulate what your real onSuccess would do
			useAuthStore.setState({
				isAuthenticated: true,
				access_token: "access_token",
			});
			options.onSuccess();
		});

		render(
			<MemoryRouter>
				<LoginPage />
			</MemoryRouter>,
		);

		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "test@example.com" },
		});
		fireEvent.change(screen.getByLabelText(/password/i), {
			target: { value: "password123" },
		});
		fireEvent.click(screen.getByRole("button", { name: /login/i }));

		// Expect navigation to home page
		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
		});
	});

	// --- Email/Password Login Tests ---
	it("should show validation errors for empty email and password on submit", async () => {
		render(
			<MemoryRouter>
				<LoginPage />
			</MemoryRouter>,
		);

		fireEvent.click(screen.getByRole("button", { name: /login/i }));

		await waitFor(() => {
			expect(screen.getByText(/invalid email/i)).toBeInTheDocument(); // Zod's default email error
			expect(
				screen.getByText("Password must contain at least 8 characters"),
			).toBeInTheDocument();
		});
	});

	it("should call useLogin mutate with correct data on valid email/password submission", async () => {
		render(
			<MemoryRouter>
				<LoginPage />
			</MemoryRouter>,
		);

		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "test@example.com" },
		});
		fireEvent.change(screen.getByLabelText(/password/i), {
			target: { value: "password123" },
		});
		fireEvent.click(screen.getByRole("button", { name: /login/i }));

		await waitFor(() => {
			expect(mockLoginUserMutate).toHaveBeenCalledTimes(1);
			expect(mockLoginUserMutate).toHaveBeenCalledWith(
				{ email: "test@example.com", password: "password123" },
				expect.any(Object), // Expects the options object (onSuccess, onError)
			);
		});
	});

	it("should display server error message on email/password login failure", async () => {
		const errorMessage = "Invalid credentials from server.";
		mockLoginUserMutate.mockImplementationOnce((_data, options) => {
			options.onError({
				response: { data: { message: errorMessage } },
			} as AxiosError<APIErrorResponse>);
		});

		render(
			<MemoryRouter>
				<LoginPage />
			</MemoryRouter>,
		);

		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "test@example.com" },
		});
		fireEvent.change(screen.getByLabelText(/password/i), {
			target: { value: "password123" },
		});
		fireEvent.click(screen.getByRole("button", { name: /login/i }));

		await waitFor(() => {
			expect(screen.getByText(errorMessage)).toBeInTheDocument();
		});
	});

	// --- Google Login Tests ---
	it('should call useGoogleLogin mutate on "Continue with Google" button click', async () => {
		render(
			<MemoryRouter>
				<LoginPage />
			</MemoryRouter>,
		);

		fireEvent.click(
			screen.getByRole("button", { name: /continue with google/i }),
		);

		await waitFor(() => {
			expect(mockGoogleLoginMutate).toHaveBeenCalledTimes(1);
			expect(mockGoogleLoginMutate).toHaveBeenCalledWith(); // Google login mutate is called without arguments
		});
	});

	it("should show loading spinner for login when pending", () => {
		// Mock useLogin to be in pending state
		vi.spyOn(authMutations, "useLogin").mockReturnValue({
			mutate: mockLoginUserMutate,
			mutateAsync: vi.fn(),
			isPending: true,
			isSuccess: false,
			isError: false,
			error: null,
			data: undefined,
			variables: undefined,
			status: "idle",
			isIdle: true,
			isLoading: false,
			isPaused: false,
			reset: vi.fn(),
			context: undefined,
			failureCount: 0,
			failureReason: null,
			submittedAt: undefined,
		} as unknown as UseMutationResult<
			AuthResponse,
			AxiosError<APIErrorResponse>,
			LoginCredentials,
			unknown
		>);

		render(
			<MemoryRouter>
				<LoginPage />
			</MemoryRouter>,
		);

		// Expect the login button to show "Logging In..." or a spinner
		expect(screen.getByRole("button", { name: /login/i })).toBeDisabled();
		expect(screen.getByRole("button", { name: /login/i })).toContainHTML(
			"animate-spin",
		); // Check for the spinner icon
	});

	it("should show loading spinner for Google login when pending", () => {
		// Mock useGoogleLogin to be in pending state
		vi.spyOn(authMutations, "useGoogleLogin").mockReturnValue({
			// Do the same for useGoogleLogin
			mutate: mockGoogleLoginMutate,
			mutateAsync: vi.fn(),
			isPending: true,
			isSuccess: false,
			isError: false,
			error: null,
			data: undefined,
			variables: undefined,
			status: "idle",
			isIdle: true,
			isLoading: false,
			isPaused: false,
			reset: vi.fn(),
			context: undefined,
			failureCount: 0,
			failureReason: null,
			submittedAt: undefined,
		} as unknown as UseMutationResult<any, any, void, unknown>);

		render(
			<MemoryRouter>
				<LoginPage />
			</MemoryRouter>,
		);

		// Expect the Google button to show "Signing in with Google..." or a spinner
		expect(
			screen.getByRole("button", { name: /continue with google/i }),
		).toBeDisabled();
		expect(
			screen.getByRole("button", { name: /continue with google/i }),
		).toContainHTML("animate-spin"); // Check for the spinner icon
	});
});
