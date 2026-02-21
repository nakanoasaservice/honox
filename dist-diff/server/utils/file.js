//#region src/server/utils/file.ts
const filePathToPath = (filePath) => {
	filePath = filePath.replace(/\.tsx?$/g, "").replace(/\.mdx?$/g, "").replace(/^\/?index$/, "/").replace(/\/index$/, "").replace(/\[\.{3}(.+?)\]/, ":$1{.+}").replace(/\((.+?)\)/g, "").replace(/\[(.+?)\]/g, ":$1").replace(/\/\/+/g, "/");
	return filePath.startsWith("/") ? filePath : "/" + filePath;
};
const groupByDirectory = (files) => {
	const organizedFiles = {};
	for (const [path, content] of Object.entries(files)) {
		const pathParts = path.split("/");
		const fileName = pathParts.pop();
		const directory = pathParts.join("/");
		if (!organizedFiles[directory]) organizedFiles[directory] = {};
		if (fileName) organizedFiles[directory][fileName] = content;
	}
	for (const [directory, files] of Object.entries(organizedFiles)) {
		const sortedEntries = Object.entries(files).sort(([keyA], [keyB]) => {
			if (keyA[0] === "[" && keyB[0] !== "[") return 1;
			if (keyA[0] !== "[" && keyB[0] === "[") return -1;
			return keyA.localeCompare(keyB);
		});
		organizedFiles[directory] = Object.fromEntries(sortedEntries);
	}
	return organizedFiles;
};
const sortDirectoriesByDepth = (directories) => {
	return Object.keys(directories).sort((a, b) => {
		return a.split("/").length - b.split("/").length || b.localeCompare(a);
	}).map((key) => ({ [key]: directories[key] }));
};
const listByDirectory = (files) => {
	const organizedFiles = {};
	for (const path of Object.keys(files)) {
		const pathParts = path.split("/");
		pathParts.pop();
		const directory = pathParts.join("/");
		if (!organizedFiles[directory]) organizedFiles[directory] = [];
		if (!organizedFiles[directory].includes(path)) organizedFiles[directory].push(path);
	}
	const directories = Object.keys(organizedFiles).sort((a, b) => b.length - a.length);
	for (const dir of directories) for (const subDir of directories) if (subDir.startsWith(dir) && subDir !== dir) organizedFiles[subDir] = [...new Set([...organizedFiles[subDir], ...organizedFiles[dir]])];
	return organizedFiles;
};
const pathToDirectoryPath = (path) => {
	return path.replace(/[^\/]+$/, "");
};

//#endregion
export { filePathToPath, groupByDirectory, listByDirectory, pathToDirectoryPath, sortDirectoriesByDepth };