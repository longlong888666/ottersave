import { describe, it, expect } from 'vitest';
import { formatUSD } from '../../src/lib/calculators/money';

describe('formatUSD', () => {
  it('formats positive dollars with commas and cents', () => {
    expect(formatUSD(1234.567)).toBe('$1,234.57');
  });
  it('formats zero', () => {
    expect(formatUSD(0)).toBe('$0.00');
  });
  it('formats negative values', () => {
    expect(formatUSD(-5)).toBe('-$5.00');
  });
});
