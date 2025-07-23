// tests/login.spec.ts
import { expect, test } from "@playwright/test";

declare global {
	interface Window {
		firebase: any;
	}
}

// Test group for login functionality
test.describe("Login Page", () => {
	// Runs before each test in this describe block
	test.beforeEach(async ({ page }) => {
		await page.goto("/login"); // Navigate to the login page
	});


	test("should successfully log in with valid email and password", async ({
		page,
	}) => {
		// 🚀 Mock the API response for /auth/login
		await page.route("**/auth/login", async (route) => {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({
					access_token: "mock-jwt-token",
				}),
			});
		});

		await page.fill('input[type="email"]', "test@example.com");
		await page.fill('input[type="password"]', "password123");
		await page.click('button:has-text("Login")');

		// 🚀 Assert that the user is redirected to the home page
		await expect(page).toHaveURL("/");

		// Optionally: Assert that a logged-in element is visible on the home page
		// await expect(page.locator('text=Welcome, Test User!')).toBeVisible();
	});

	test("should display server error message for failed email/password login", async ({
		page,
	}) => {
		// 🚀 Mock the API response for failed login
		await page.route("**/auth/login", async (route) => {
			await route.fulfill({
				status: 401,
				contentType: "application/json",
				body: JSON.stringify({ message: "Invalid credentials provided." }),
			});
		});

		await page.fill('input[type="email"]', "wrong@example.com");
		await page.fill('input[type="password"]', "wrongpass");
		await page.click('button:has-text("Login")');

		// Assert that the error message is visible
		await expect(
			page.locator("text=Invalid credentials provided."),
		).toBeVisible();
		// Should remain on the login page
		await expect(page).toHaveURL("/login");
	});

	test("should redirect to home page if already authenticated", async ({
		page,
	}) => {
		// This test will use the `storageState` saved in `global-setup.ts`
		// So, the page starts already logged in.
		await page.goto("/login"); // Try to visit login page when already logged in

		// Should be redirected to home page immediately by the component's useEffect
		await expect(page).toHaveURL("/");
	});
});
