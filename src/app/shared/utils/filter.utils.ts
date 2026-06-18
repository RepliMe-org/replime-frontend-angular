export function filterByQuery(items, query, fields) {
  const q = query?.toLowerCase().trim();
  if (!q) return items;

  return items.filter(item => {
    return fields.some(field => {
      const val = item[field];
      if (typeof val === 'string') {
        return val.toLowerCase().includes(q);
      }
      return false;
    });
  });
}
