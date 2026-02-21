import { COMPONENT_EXPORT, COMPONENT_NAME, DATA_HONO_TEMPLATE, DATA_SERIALIZED_PROPS } from "../../constants.js";
import { createContext, createElement, isValidElement, useContext } from "hono/jsx";
import { jsx, jsxs } from "hono/jsx/jsx-runtime";

//#region src/vite/components/honox-island.tsx
const inIsland = Symbol();
const inChildren = Symbol();
const IslandContext = createContext({
	[inIsland]: false,
	[inChildren]: false
});
const isElementPropValue = (value) => Array.isArray(value) ? value.some(isElementPropValue) : typeof value === "object" && isValidElement(value);
const HonoXIsland = ({ componentName, componentExport, Component, props }) => {
	const elementProps = {};
	const restProps = {};
	for (const key in props) {
		const value = props[key];
		if (isElementPropValue(value)) elementProps[key] = value;
		else restProps[key] = value;
	}
	const islandState = useContext(IslandContext);
	return islandState[inChildren] || !islandState[inIsland] ? /* @__PURE__ */ jsxs("honox-island", {
		[COMPONENT_NAME]: componentName,
		[COMPONENT_EXPORT]: componentExport || void 0,
		[DATA_SERIALIZED_PROPS]: JSON.stringify(restProps),
		children: [/* @__PURE__ */ jsx(IslandContext.Provider, {
			value: {
				...islandState,
				[inIsland]: true
			},
			children: /* @__PURE__ */ jsx(Component, { ...props })
		}), Object.entries(elementProps).map(([key, children]) => /* @__PURE__ */ createElement("template", {
			[DATA_HONO_TEMPLATE]: key,
			key
		}, /* @__PURE__ */ jsx(IslandContext.Provider, {
			value: {
				...islandState,
				[inChildren]: true
			},
			children
		})))]
	}) : /* @__PURE__ */ jsx(Component, { ...props });
};

//#endregion
export { HonoXIsland };