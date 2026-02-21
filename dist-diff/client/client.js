import { COMPONENT_EXPORT, COMPONENT_NAME, DATA_HONO_TEMPLATE, DATA_SERIALIZED_PROPS } from "../constants.js";
import { filterByPattern } from "./utils/filter.js";
import { createElement, render } from "hono/jsx/dom";

//#region src/client/client.ts
const createClient = async (options) => {
	const FILES = options?.ISLAND_FILES ?? filterByPattern({
		...import.meta.glob("/app/islands/**/*.tsx"),
		...import.meta.glob("/app/**/*.island.tsx"),
		...import.meta.glob("/app/**/$*.tsx")
	}, [
		/\/[a-zA-Z0-9-]+\.tsx$/,
		/\/_[a-zA-Z0-9-]+\.island\.tsx$/,
		/\/\$[a-zA-Z0-9-]+\.tsx$/
	]);
	const hydrateComponent = async (document) => {
		const filePromises = Object.keys(FILES).map(async (filePath) => {
			const componentName = filePath;
			const elements = document.querySelectorAll(`[${COMPONENT_NAME}="${componentName}"]:not([data-hono-hydrated])`);
			if (elements) {
				const elementPromises = Array.from(elements).map(async (element) => {
					element.setAttribute("data-hono-hydrated", "true");
					const exportName = element.getAttribute(COMPONENT_EXPORT) || "default";
					const fileCallback = FILES[filePath];
					const Component = await (await fileCallback())[exportName];
					const serializedProps = element.attributes.getNamedItem(DATA_SERIALIZED_PROPS)?.value;
					const props = JSON.parse(serializedProps ?? "{}");
					const hydrate = options?.hydrate ?? render;
					const createElement$1 = options?.createElement ?? createElement;
					let maybeTemplate = element.childNodes[element.childNodes.length - 1];
					while (maybeTemplate?.nodeName === "TEMPLATE") {
						const propKey = maybeTemplate.getAttribute(DATA_HONO_TEMPLATE);
						if (propKey == null) break;
						let createChildren = options?.createChildren;
						if (!createChildren) {
							const { buildCreateChildrenFn } = await import("./runtime.js");
							createChildren = buildCreateChildrenFn(createElement$1, async (name) => (await FILES[`${name}`]()).default);
						}
						props[propKey] = await createChildren(maybeTemplate.content.childNodes);
						maybeTemplate = maybeTemplate.previousSibling;
					}
					await hydrate(await createElement$1(Component, props), element);
				});
				await Promise.all(elementPromises);
			}
		});
		await Promise.all(filePromises);
	};
	await (options?.triggerHydration ?? (async (hydrateComponent) => {
		if (document.querySelector("template[id^=\"H:\"], template[id^=\"E:\"]")) {
			const { hydrateComponentHonoSuspense } = await import("./runtime.js");
			await hydrateComponentHonoSuspense(hydrateComponent);
		}
		await hydrateComponent(document);
	}))?.(hydrateComponent);
};

//#endregion
export { createClient };