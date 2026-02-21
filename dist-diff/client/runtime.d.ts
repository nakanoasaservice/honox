import { CreateChildren, CreateElement, HydrateComponent } from "../types.js";

//#region src/client/runtime.d.ts
type ImportComponent = (name: string) => Promise<Function | undefined>;
declare const buildCreateChildrenFn: (createElement: CreateElement, importComponent: ImportComponent) => CreateChildren;
declare const hydrateComponentHonoSuspense: (hydrateComponent: HydrateComponent) => Promise<void>;
//#endregion
export { buildCreateChildrenFn, hydrateComponentHonoSuspense };