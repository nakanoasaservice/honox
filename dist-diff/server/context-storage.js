import { AsyncLocalStorage } from "node:async_hooks";

//#region src/server/context-storage.ts
const contextStorage = new AsyncLocalStorage();

//#endregion
export { contextStorage };