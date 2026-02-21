import { Manifest } from "vite";

//#region src/server/components/script.d.ts
type Options = {
  src: string;
  async?: boolean;
  prod?: boolean;
  manifest?: Manifest;
  nonce?: string;
};
declare const Script: (options: Options) => any;
//#endregion
export { Script };