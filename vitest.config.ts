import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vitest/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(() =>
	defineConfig({
		test: {
			globals: true,
			environment: "jsdom",
			setupFiles: "./src/tests/setup.ts",
			css: false,
			exclude: [
				"packages/template/*",
				"**/node_modules/**",
				"**/dist/**",
				"**/playwright/**",
				"**/.cache/**",
				"**/.git/**",
			],
			include: ["src/**/*.{test,spec}.{ts,tsx}"],
		},
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
	}),
);
