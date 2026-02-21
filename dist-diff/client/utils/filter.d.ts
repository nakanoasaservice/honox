//#region src/client/utils/filter.d.ts
declare const filterByPattern: <T>(files: Record<string, T>, patterns: RegExp[]) => Record<string, T>;
//#endregion
export { filterByPattern };