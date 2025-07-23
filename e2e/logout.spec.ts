import { expect, test } from "@playwright/test";

// This test will run with the authenticated state from global-setup.ts

test.describe("Logout Functionality", () => {
	test.beforeEach(async ({ page }) => {
		// Start on an authenticated page, e.g., the home page
		await page.goto("/");
		// Optionally, verify some element that only appears when logged in
		// await expect(page.locator('text=Welcome, E2E Test User!')).toBeVisible();
	});

	test("should successfully log out a user", async ({ page }) => {
		await page.click('button:has-text("Logout")'); // Adjust this selector if needed

		// 🚀 Assert that the user is redirected to the login page
		await expect(page).toHaveURL("/login");

		// Assert that login form elements are now visible
		await expect(page.locator('input[type="email"]')).toBeVisible();
		await expect(page.locator('input[type="password"]')).toBeVisible();
	});
});
