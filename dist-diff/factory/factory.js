import { Hono } from "hono";
import { createFactory } from "hono/factory";

//#region src/factory/factory.ts
const factory = createFactory();
const createRoute = factory.createHandlers;
const createHono = () => {
	return new Hono();
};

//#endregion
export { createHono, createRoute };