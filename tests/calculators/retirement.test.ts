import { describe, it, expect } from 'vitest';
import { retirementSavings } from '../../src/lib/calculators/retirement';

describe('retirementSavings', () => {
  it('computes total and 4% monthly withdrawal', () => {
    const r = retirementSavings(30, 65, 10000, 500, 7);
    expect(r.yearsToGrow).toBe(35);
    expect(r.total).toBeGreaterThan(500000);
    expect(r.contributions).toBe(220000);
    expect(r.monthlyWithdrawal).toBeCloseTo((r.total * 0.04) / 12, 2);
  });
  it('handles already-retired age', () => {
    const r = retirementSavings(70, 65, 10000, 500, 7);
    expect(r.yearsToGrow).toBe(0);
    expect(r.total).toBe(10000);
  });
});
