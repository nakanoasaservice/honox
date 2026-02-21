import { Plugin } from "vite";

//#region src/vite/inject-importing-islands.d.ts
type InjectImportingIslandsOptions = {
  appDir?: string;
  islandDir?: string;
};
declare function injectImportingIslands(options?: InjectImportingIslandsOptions): Promise<Plugin>;
//#endregion
export { injectImportingIslands };