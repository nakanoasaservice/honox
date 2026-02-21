import { isComponentName, matchIslandComponentId } from "./utils/path.js";
import _generate from "@babel/generator";
import { parse } from "@babel/parser";
import _traverse from "@babel/traverse";
import { blockStatement, conditionalExpression, exportDefaultDeclaration, exportNamedDeclaration, exportSpecifier, functionExpression, identifier, importDeclaration, importSpecifier, jsxAttribute, jsxClosingElement, jsxElement, jsxExpressionContainer, jsxIdentifier, jsxOpeningElement, jsxSpreadAttribute, memberExpression, returnStatement, stringLiteral, variableDeclaration, variableDeclarator } from "@babel/types";
import { parse as parse$1 } from "jsonc-parser";
import fs from "fs/promises";
import path from "path";

//#region src/vite/island-components.ts
const generate = _generate.default ?? _generate;
const traverse = _traverse.default ?? _traverse;
function addSSRCheck(funcName, componentName, componentExport) {
	const isSSR = memberExpression(memberExpression(identifier("import"), identifier("meta")), identifier("env.SSR"));
	const props = [
		jsxAttribute(jsxIdentifier("componentName"), stringLiteral(componentName)),
		jsxAttribute(jsxIdentifier("Component"), jsxExpressionContainer(identifier(funcName))),
		jsxAttribute(jsxIdentifier("props"), jsxExpressionContainer(identifier("props")))
	];
	if (componentExport && componentExport !== "default") props.push(jsxAttribute(jsxIdentifier("componentExport"), stringLiteral(componentExport)));
	const returnStmt = returnStatement(conditionalExpression(isSSR, jsxElement(jsxOpeningElement(jsxIdentifier("HonoXIsland"), props, true), null, []), jsxElement(jsxOpeningElement(jsxIdentifier(funcName), [jsxSpreadAttribute(identifier("props"))], false), jsxClosingElement(jsxIdentifier(funcName)), [])));
	return functionExpression(null, [identifier("props")], blockStatement([returnStmt]));
}
const transformJsxTags = (contents, componentName) => {
	const ast = parse(contents, {
		sourceType: "module",
		plugins: ["typescript", "jsx"]
	});
	if (ast) {
		let isTransformed = false;
		traverse(ast, {
			ExportNamedDeclaration(path) {
				if (path.node.declaration?.type === "FunctionDeclaration") {
					const name = path.node.declaration.id?.name;
					if (name && isComponentName(name)) {
						path.insertBefore(path.node.declaration);
						path.replaceWith(exportNamedDeclaration(null, [exportSpecifier(identifier(name), identifier(name))]));
					}
					return;
				}
				if (path.node.declaration?.type === "VariableDeclaration") {
					const kind = path.node.declaration.kind;
					for (const declaration of path.node.declaration.declarations) if (declaration.id.type === "Identifier") {
						const name = declaration.id.name;
						if (!isComponentName(name)) continue;
						path.insertBefore(variableDeclaration(kind, [declaration]));
						path.insertBefore(exportNamedDeclaration(null, [exportSpecifier(identifier(name), identifier(name))]));
						path.remove();
					}
					return;
				}
				for (const specifier of path.node.specifiers) {
					if (specifier.type !== "ExportSpecifier") continue;
					const exportAs = specifier.exported.type === "StringLiteral" ? specifier.exported.value : specifier.exported.name;
					if (exportAs !== "default" && !isComponentName(exportAs)) continue;
					isTransformed = true;
					const wrappedFunction = addSSRCheck(specifier.local.name, componentName, exportAs);
					const wrappedFunctionId = identifier("Wrapped" + specifier.local.name);
					path.insertBefore(variableDeclaration("const", [variableDeclarator(wrappedFunctionId, wrappedFunction)]));
					specifier.local.name = wrappedFunctionId.name;
				}
			},
			ExportDefaultDeclaration(path) {
				const declarationType = path.node.declaration.type;
				if (declarationType === "FunctionDeclaration" || declarationType === "FunctionExpression" || declarationType === "ArrowFunctionExpression" || declarationType === "Identifier") {
					isTransformed = true;
					const functionName = (declarationType === "Identifier" ? path.node.declaration.name : (declarationType === "FunctionDeclaration" || declarationType === "FunctionExpression") && path.node.declaration.id?.name) || "__HonoIsladComponent__";
					let originalFunctionId;
					if (declarationType === "Identifier") originalFunctionId = path.node.declaration;
					else {
						originalFunctionId = identifier(functionName + "Original");
						const originalFunction = path.node.declaration.type === "FunctionExpression" || path.node.declaration.type === "ArrowFunctionExpression" ? path.node.declaration : functionExpression(null, path.node.declaration.params, path.node.declaration.body, void 0, path.node.declaration.async);
						path.insertBefore(variableDeclaration("const", [variableDeclarator(originalFunctionId, originalFunction)]));
					}
					const wrappedFunction = addSSRCheck(originalFunctionId.name, componentName);
					const wrappedFunctionId = identifier("Wrapped" + functionName);
					path.replaceWith(variableDeclaration("const", [variableDeclarator(wrappedFunctionId, wrappedFunction)]));
					ast.program.body.push(exportDefaultDeclaration(wrappedFunctionId));
				}
			}
		});
		if (isTransformed) ast.program.body.unshift(importDeclaration([importSpecifier(identifier("HonoXIsland"), identifier("HonoXIsland"))], stringLiteral("honox/vite/components")));
		const { code } = generate(ast);
		return code;
	}
};
function islandComponents(options) {
	let root = "";
	let reactApiImportSource = options?.reactApiImportSource;
	const islandDir = options?.islandDir ?? "/app/islands";
	return {
		name: "transform-island-components",
		configResolved: async (config) => {
			root = config.root;
			if (!reactApiImportSource) {
				const tsConfigFiles = [
					"deno.json",
					"deno.jsonc",
					"tsconfig.json"
				];
				let tsConfigRaw;
				for (const tsConfigFile of tsConfigFiles) try {
					const tsConfigPath = path.resolve(process.cwd(), tsConfigFile);
					tsConfigRaw = await fs.readFile(tsConfigPath, "utf8");
					break;
				} catch {}
				if (!tsConfigRaw) {
					console.warn("Cannot find tsconfig.json or deno.json(c)");
					return;
				}
				reactApiImportSource = parse$1(tsConfigRaw)?.compilerOptions?.jsxImportSource;
				if (reactApiImportSource === "hono/jsx/dom") reactApiImportSource = "hono/jsx";
			}
		},
		async load(id) {
			if (/\/honox\/.*?\/(?:server|vite)\/components\//.test(id)) {
				if (!reactApiImportSource) return;
				return {
					code: (await fs.readFile(id, "utf-8")).replaceAll("hono/jsx", reactApiImportSource),
					map: null
				};
			}
			const match = matchIslandComponentId("/" + path.relative(root, id).replace(/\\/g, "/"), islandDir);
			if (match) {
				const componentName = match[0];
				const code = transformJsxTags(await fs.readFile(id, "utf-8"), componentName);
				if (code) return {
					code,
					map: null
				};
			}
		}
	};
}

//#endregion
export { islandComponents, transformJsxTags };