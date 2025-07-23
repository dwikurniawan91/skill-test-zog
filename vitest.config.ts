import path from "path";
import { defineConfig } from "vitest/config";

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
				"**/cypress/**",
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
