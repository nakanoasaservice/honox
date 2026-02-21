import { createApp as createApp$1 } from "./server.js";

//#region src/server/with-defaults.ts
const createApp = (options) => {
	return createApp$1({
		root: options?.root ?? "/app/routes",
		app: options?.app,
		init: options?.init,
		trailingSlash: options?.trailingSlash,
		NOT_FOUND: options?.NOT_FOUND ?? import.meta.glob("/app/routes/**/_404.{ts,tsx}", { eager: true }),
		ERROR: options?.ERROR ?? import.meta.glob("/app/routes/**/_error.{ts,tsx}", { eager: true }),
		RENDERER: options?.RENDERER ?? import.meta.glob("/app/routes/**/_renderer.tsx", { eager: true }),
		MIDDLEWARE: options?.MIDDLEWARE ?? import.meta.glob("/app/routes/**/_middleware.{ts,tsx}", { eager: true }),
		ROUTES: options?.ROUTES ?? import.meta.glob([
			"/app/routes/**/*.{ts,tsx,md,mdx}",
			"/app/routes/.well-known/**/*.{ts,tsx,md,mdx}",
			"!/app/routes/**/_*.{ts,tsx,md,mdx}",
			"!/app/routes/**/-*.{ts,tsx,md,mdx}",
			"!/app/routes/**/$*.{ts,tsx,md,mdx}",
			"!/app/routes/**/*.test.{ts,tsx}",
			"!/app/routes/**/*.spec.{ts,tsx}",
			"!/app/routes/**/-*/**/*"
		], { eager: true })
	});
};

//#endregion
export { createApp };