//#region src/vite/restart-on-add-unlink.ts
function restartOnAddUnlink() {
	return {
		name: "restart-on-add-unlink",
		configureServer(server) {
			server.watcher.add("./app/**");
			server.watcher.on("add", async () => {
				await server.restart();
			});
			server.watcher.on("unlink", async () => {
				await server.restart();
			});
		}
	};
}

//#endregion
export { restartOnAddUnlink };