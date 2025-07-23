// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
	// 🚀 FIX: Update testDir to match your E2E test folder
	testDir: "./e2e", // Assuming your E2E tests are in the 'e2e' folder

	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: "html",
	use: {
		baseURL: "http://localhost:5173",
		trace: "on-first-retry",
		storageState: path.resolve(__dirname, "e2e", "playwright-auth-state.json"),
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
	webServer: {
		command: "npm run dev",
		url: "http://localhost:5173",
		reuseExistingServer: !process.env.CI,
	},
	globalSetup: path.join(__dirname, "e2e", "global-setup.ts"),
});
