import { describe, it, expect } from 'vitest';
import { ruleOf72 } from '../../src/lib/calculators/ruleOf72';

describe('ruleOf72', () => {
  it('computes doubling time for 8%', () => {
    expect(ruleOf72(8).years).toBeCloseTo(9, 1);
  });
  it('returns Infinity for 0%', () => {
    expect(ruleOf72(0).years).toBe(Infinity);
  });
});
