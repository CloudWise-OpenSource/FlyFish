export function tileQueryDataColumns(queryData) {
  if (!queryData || !Array.isArray(queryData)) {
    return [];
  }
  let columns = [];
  for (let i = 0; i < queryData.length; i++) {
    const item = queryData[i];
    if (typeof item === 'object') {
      const keys = Object.keys(item);
      keys.forEach((key) => {
        if (columns.indexOf(key) === -1) {
          columns.push(key);
        }
      });
    }
  }
  return columns;
}
