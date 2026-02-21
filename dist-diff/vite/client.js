//#region src/vite/client.ts
const defaultOptions = {
	jsxImportSource: "hono/jsx/dom",
	assetsDir: "static",
	input: ["/app/client.ts"]
};
function client(options) {
	return {
		name: "honox-vite-client",
		apply: (_config, { command, mode }) => {
			if (command === "build" && mode === "client") return true;
			return false;
		},
		config: () => {
			return {
				build: {
					rollupOptions: { input: options?.input ?? defaultOptions.input },
					assetsDir: options?.assetsDir ?? defaultOptions.assetsDir,
					manifest: true
				},
				esbuild: { jsxImportSource: options?.jsxImportSource ?? defaultOptions.jsxImportSource }
			};
		}
	};
}

//#endregion
export { client as default };