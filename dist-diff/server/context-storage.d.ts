import { Context } from "hono";
import { AsyncLocalStorage } from "node:async_hooks";

//#region src/server/context-storage.d.ts
declare const contextStorage: AsyncLocalStorage<Context<any, any, {}>>;
//#endregion
export { contextStorage };