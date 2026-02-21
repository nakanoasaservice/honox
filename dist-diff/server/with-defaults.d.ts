import { ServerOptions } from "./server.js";
import * as hono from "hono";
import { Env } from "hono";
import * as hono_types0 from "hono/types";

//#region src/server/with-defaults.d.ts
declare const createApp: <E extends Env>(options?: ServerOptions<E>) => hono.Hono<E, hono_types0.BlankSchema, "/">;
//#endregion
export { createApp };