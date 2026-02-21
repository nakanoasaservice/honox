import { Plugin } from 'vite';

type ClientOptions = {
    jsxImportSource?: string;
    assetsDir?: string;
    input?: string[];
};
declare function client(options?: ClientOptions): Plugin;

export { type ClientOptions, client as default };
