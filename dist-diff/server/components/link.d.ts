import { Manifest } from "vite";
import { FC } from "hono/jsx";
import { JSX } from "hono/jsx/jsx-runtime";

//#region src/server/components/link.d.ts
type Options = {
  manifest?: Manifest;
  prod?: boolean;
} & JSX.IntrinsicElements['link'];
declare const Link: FC<Options>;
//#endregion
export { Link };