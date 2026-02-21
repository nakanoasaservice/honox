import { DevServerOptions } from '@hono/vite-dev-server';
import { PluginOption } from 'vite';
import { ClientOptions } from './client.js';
import { IslandComponentsOptions } from './island-components.js';
export { islandComponents } from './island-components.js';

type Options = {
    islands?: boolean;
    entry?: string;
    devServer?: DevServerOptions;
    islandComponents?: IslandComponentsOptions;
    client?: ClientOptions;
    external?: string[];
};
declare const defaultOptions: Options;
declare const devServerDefaultOptions: {
    exclude: (string | RegExp)[];
    handleHotUpdate: () => undefined;
    base: "" | `/${string}`;
    entry: string;
    export: string;
    injectClientScript: boolean;
    ignoreWatching: (string | RegExp)[];
};
declare function honox(options?: Options): PluginOption[];

export { honox as default, defaultOptions, devServerDefaultOptions };
