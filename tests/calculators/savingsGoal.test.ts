import { describe, it, expect } from 'vitest';
import { savingsGoal } from '../../src/lib/calculators/savingsGoal';

describe('savingsGoal', () => {
  it('computes months needed for a goal', () => {
    const r = savingsGoal(12000, 0, 1000, 0);
    expect(r.months).toBe(12);
    expect(r.years).toBe(1);
    expect(r.monthly).toBe(1000);
    expect(r.daily).toBeCloseTo(32.85, 1);
  });
  it('returns zeros when target already reached', () => {
    const r = savingsGoal(1000, 2000, 100, 0);
    expect(r.months).toBe(0);
    expect(r.years).toBe(0);
    expect(r.final).toBe(2000);
  });
  it('returns Infinity months when no contribution', () => {
    const r = savingsGoal(1000, 0, 0, 0);
    expect(r.months).toBe(Infinity);
    expect(r.years).toBe(Infinity);
  });
});
