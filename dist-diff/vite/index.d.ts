import { ClientOptions } from "./client.js";
import { IslandComponentsOptions, islandComponents } from "./island-components.js";
import { PluginOption } from "vite";
import { DevServerOptions } from "@hono/vite-dev-server";

//#region src/vite/index.d.ts
type Options = {
  islands?: boolean;
  entry?: string;
  devServer?: DevServerOptions;
  islandComponents?: IslandComponentsOptions;
  client?: ClientOptions;
  external?: string[];
};
declare const defaultOptions: Options;
declare const devServerDefaultOptions: {
  exclude: (string | RegExp)[];
  handleHotUpdate: () => undefined;
  entry: string;
  export: string;
  injectClientScript: boolean;
  ignoreWatching: (string | RegExp)[];
  base: "" | `/${string}`;
};
declare function honox(options?: Options): PluginOption[];
//#endregion
export { honox as default, defaultOptions, devServerDefaultOptions, islandComponents };