import * as hono_types from 'hono/types';
import * as hono_factory from 'hono/factory';
import { Env, Hono } from 'hono';

declare const createRoute: hono_factory.CreateHandlersInterface<Env, string>;
declare const createHono: () => Hono<Env, hono_types.BlankSchema, "/">;

export { createHono, createRoute };
