import { Plugin } from "vite";

//#region src/vite/island-components.d.ts
declare const transformJsxTags: (contents: string, componentName: string) => any;
type IsIsland = (id: string) => boolean;
type IslandComponentsOptions = {
  /**
   * @deprecated
   */
  isIsland?: IsIsland;
  islandDir?: string;
  reactApiImportSource?: string;
};
declare function islandComponents(options?: IslandComponentsOptions): Plugin;
//#endregion
export { IslandComponentsOptions, islandComponents, transformJsxTags };