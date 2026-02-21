declare const filterByPattern: <T>(files: Record<string, T>, patterns: RegExp[]) => Record<string, T>;

export { filterByPattern };
