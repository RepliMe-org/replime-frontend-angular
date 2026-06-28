import { formatDate, formatTime } from './date.utils';

describe('date.utils', () => {
  describe('formatDate()', () => {
    it('should return empty string for empty input', () => {
      expect(formatDate('')).toBe('');
    });

    it('should return "Today" for today\'s date', () => {
      const today = new Date().toISOString();
      expect(formatDate(today)).toBe('Today');
    });

    it('should return "Yesterday" for yesterday\'s date', () => {
      const yesterday = new Date(Date.now() - 86400000).toISOString();
      expect(formatDate(yesterday)).toBe('Yesterday');
    });

    it('should return "Xd ago" for dates within the past week (2-6 days)', () => {
      for (let days = 2; days <= 6; days++) {
        const date = new Date(Date.now() - days * 86400000).toISOString();
        expect(formatDate(date)).toBe(`${days}d ago`);
      }
    });

    it('should return a locale-formatted date for dates 7 or more days ago', () => {
      const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);
      const result = formatDate(sevenDaysAgo.toISOString());

      expect(result).not.toContain('ago');
      expect(result).not.toBe('Today');
      expect(result).not.toBe('Yesterday');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return a locale date string for dates several weeks ago', () => {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);
      const expected = thirtyDaysAgo.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      expect(formatDate(thirtyDaysAgo.toISOString())).toBe(expected);
    });
  });

  describe('formatTime()', () => {
    it('should return empty string for empty input', () => {
      expect(formatTime('')).toBe('');
    });

    it('should return a valid time string for a valid ISO date', () => {
      const isoStr = '2024-06-15T14:30:00Z';
      const result = formatTime(isoStr);

      expect(result).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/i);
    });

    it('should produce two-digit minutes', () => {
      const isoStr = '2024-06-15T10:05:00Z';
      const result = formatTime(isoStr);

      expect(result).toMatch(/:\d{2}/);
    });
  });
});
