// e2e/global-setup.ts
import { chromium, type FullConfig } from "@playwright/test";
import path from "path"; // Ensure path is imported

async function globalSetup(config: FullConfig) {
	const { baseURL } = config.projects[0].use;
	// 🚀 FIX: Get the project's root directory from the config
	const projectRootDir = config.rootDir;

	const browser = await chromium.launch();
	const page = await browser.newPage();

	console.log(`[Global Setup] Navigating to login page: ${baseURL}/login`);
	await page.goto(`${baseURL}/login`);

	console.log("[Global Setup] Setting up API route mock for /auth/login");
	await page.route("**/auth/login", async (route) => {
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({
				access_token: "mock-e2e-access-token",
				user: {
					id: "e2e-user-id",
					email: "e2e@example.com",
					name: "E2E Test User",
				},
			}),
		});
	});

	await page.fill('input[type="email"]', "e2e@example.com");
	await page.fill('input[type="password"]', "password123");
	await page.click('button:has-text("Login")');

	console.log(`[Global Setup] Waiting for URL to be ${baseURL}/`);
	// Ensure this line succeeds (solve previous TimeoutError first)
	await page.waitForURL(`${baseURL}/`, { timeout: 60000 });

	// 🚀 FIX: Resolve storageStatePath relative to the project's root directory
	const storageStatePath = path.resolve(
		projectRootDir,
		"playwright-auth-state.json",
	);
	console.log(`[Global Setup] Saving storage state to: ${storageStatePath}`);
	await page.context().storageState({ path: storageStatePath });

	await browser.close();

	console.log("Playwright global setup complete: Auth state saved.");
}

export default globalSetup;
