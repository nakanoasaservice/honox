import { Plugin } from "vite";

//#region src/vite/client.d.ts
type ClientOptions = {
  jsxImportSource?: string;
  assetsDir?: string;
  input?: string[];
};
declare function client(options?: ClientOptions): Plugin;
//#endregion
export { ClientOptions, client as default };