const filterByPattern = (files, patterns) => {
  return Object.fromEntries(
    Object.entries(files).filter(([path]) => patterns.some((pattern) => pattern.test(path)))
  );
};
export {
  filterByPattern
};
