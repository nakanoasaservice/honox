import { Env, Hono } from "hono";
import * as hono_factory0 from "hono/factory";
import * as hono_types0 from "hono/types";

//#region src/factory/factory.d.ts
declare const createRoute: hono_factory0.CreateHandlersInterface<Env, string>;
declare const createHono: () => Hono<Env, hono_types0.BlankSchema, "/">;
//#endregion
export { createHono, createRoute };