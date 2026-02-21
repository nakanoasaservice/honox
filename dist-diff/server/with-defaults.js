import { createApp as baseCreateApp } from "./server.js";
const createApp = (options) => {
  const newOptions = {
    root: options?.root ?? "/app/routes",
    app: options?.app,
    init: options?.init,
    trailingSlash: options?.trailingSlash,
    // Avoid extglobs for rolldown-vite compatibility
    // ref: https://github.com/vitejs/rolldown-vite/issues/365
    NOT_FOUND: options?.NOT_FOUND ?? import.meta.glob("/app/routes/**/_404.{ts,tsx}", {
      eager: true
    }),
    ERROR: options?.ERROR ?? import.meta.glob("/app/routes/**/_error.{ts,tsx}", {
      eager: true
    }),
    RENDERER: options?.RENDERER ?? import.meta.glob("/app/routes/**/_renderer.tsx", {
      eager: true
    }),
    MIDDLEWARE: options?.MIDDLEWARE ?? import.meta.glob("/app/routes/**/_middleware.{ts,tsx}", {
      eager: true
    }),
    ROUTES: options?.ROUTES ?? import.meta.glob(
      [
        "/app/routes/**/*.{ts,tsx,md,mdx}",
        "/app/routes/.well-known/**/*.{ts,tsx,md,mdx}",
        "!/app/routes/**/_*.{ts,tsx,md,mdx}",
        "!/app/routes/**/-*.{ts,tsx,md,mdx}",
        "!/app/routes/**/$*.{ts,tsx,md,mdx}",
        "!/app/routes/**/*.test.{ts,tsx}",
        "!/app/routes/**/*.spec.{ts,tsx}",
        "!/app/routes/**/-*/**/*"
      ],
      {
        eager: true
      }
    )
  };
  return baseCreateApp(newOptions);
};
export {
  createApp
};
