import { filterByQuery } from './filter.utils';

describe('filterByQuery()', () => {
  const items = [
    { id: 1, name: 'Angular Framework', category: 'Frontend' },
    { id: 2, name: 'React Library', category: 'Frontend' },
    { id: 3, name: 'Spring Boot', category: 'Backend' },
    { id: 4, name: 'Django', category: 'Backend' },
  ];

  it('should return all items when query is empty string', () => {
    const result = filterByQuery(items, '', ['name']);
    expect(result).toEqual(items);
  });

  it('should return all items when query is null', () => {
    const result = filterByQuery(items, null, ['name']);
    expect(result).toEqual(items);
  });

  it('should return all items when query is undefined', () => {
    const result = filterByQuery(items, undefined, ['name']);
    expect(result).toEqual(items);
  });

  it('should return all items when query is only whitespace', () => {
    const result = filterByQuery(items, '   ', ['name']);
    expect(result).toEqual(items);
  });

  it('should return matched items for a valid query', () => {
    const result = filterByQuery(items, 'angular', ['name']);
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Angular Framework');
  });

  it('should be case-insensitive', () => {
    const resultLower = filterByQuery(items, 'frontend', ['category']);
    const resultUpper = filterByQuery(items, 'FRONTEND', ['category']);

    expect(resultLower.length).toBe(2);
    expect(resultUpper.length).toBe(2);
  });

  it('should match across multiple fields', () => {
    const result = filterByQuery(items, 'backend', ['name', 'category']);
    expect(result.length).toBe(2);
  });

  it('should return empty array when no items match', () => {
    const result = filterByQuery(items, 'Vue', ['name']);
    expect(result).toEqual([]);
  });

  it('should perform partial (substring) matching', () => {
    const result = filterByQuery(items, 'boot', ['name']);
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Spring Boot');
  });

  it('should NOT match non-string fields', () => {
    const data = [{ id: 1, count: 42 }];
    const result = filterByQuery(data, '42', ['count']);
    expect(result).toEqual([]);
  });

  it('should return empty array when items list is empty', () => {
    const result = filterByQuery([], 'angular', ['name']);
    expect(result).toEqual([]);
  });
});
