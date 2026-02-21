//#region src/server/utils/path.ts
const ensureTrailngSlash = (path) => {
	return path.endsWith("/") ? path : path + "/";
};

//#endregion
export { ensureTrailngSlash };