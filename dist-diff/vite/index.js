import { restartOnAddUnlink } from "./restart-on-add-unlink.js";
import { islandComponents } from "./island-components.js";
import { injectImportingIslands } from "./inject-importing-islands.js";
import client from "./client.js";
import path from "path";
import devServer, { defaultOptions as defaultOptions$1 } from "@hono/vite-dev-server";

//#region src/vite/index.ts
const defaultOptions = {
	islands: true,
	entry: path.join(process.cwd(), "./app/server.ts")
};
const devServerDefaultOptions = {
	...defaultOptions$1,
	exclude: [
		...defaultOptions$1.exclude,
		/^\/app\/.+\.tsx?/,
		/^\/favicon.ico/,
		/^\/static\/.+/
	],
	handleHotUpdate: () => {}
};
function honox(options) {
	const plugins = [];
	const entry = options?.entry ?? defaultOptions.entry;
	plugins.push(devServer({
		...devServerDefaultOptions,
		entry,
		...options?.devServer
	}));
	if (options?.islands !== false) plugins.push(islandComponents(options?.islandComponents));
	plugins.push(injectImportingIslands());
	plugins.push(restartOnAddUnlink());
	plugins.push(client(options?.client));
	return [{
		name: "honox-vite-config",
		config: () => {
			return { ssr: { noExternal: true } };
		}
	}, ...plugins];
}

//#endregion
export { honox as default, defaultOptions, devServerDefaultOptions, islandComponents };