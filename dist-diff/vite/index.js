import devServer, { defaultOptions as viteDevServerDefaultOptions } from "@hono/vite-dev-server";
import path from "path";
import client from "./client.js";
import { injectImportingIslands } from "./inject-importing-islands.js";
import { islandComponents } from "./island-components.js";
import { restartOnAddUnlink } from "./restart-on-add-unlink.js";
const defaultOptions = {
  islands: true,
  entry: path.join(process.cwd(), "./app/server.ts")
};
const devServerDefaultOptions = {
  ...viteDevServerDefaultOptions,
  exclude: [
    ...viteDevServerDefaultOptions.exclude,
    /^\/app\/.+\.tsx?/,
    /^\/favicon.ico/,
    /^\/static\/.+/
  ],
  handleHotUpdate: () => {
    return void 0;
  }
};
function honox(options) {
  const plugins = [];
  const entry = options?.entry ?? defaultOptions.entry;
  plugins.push(
    devServer({
      ...devServerDefaultOptions,
      entry,
      ...options?.devServer
    })
  );
  if (options?.islands !== false) {
    plugins.push(islandComponents(options?.islandComponents));
  }
  plugins.push(injectImportingIslands());
  plugins.push(restartOnAddUnlink());
  plugins.push(client(options?.client));
  return [
    {
      name: "honox-vite-config",
      config: () => {
        return {
          ssr: {
            noExternal: true
          }
        };
      }
    },
    ...plugins
  ];
}
var vite_default = honox;
export {
  vite_default as default,
  defaultOptions,
  devServerDefaultOptions,
  islandComponents
};
