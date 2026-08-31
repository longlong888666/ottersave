import { describe, it, expect } from 'vitest';
import { compoundInterest } from '../../src/lib/calculators/compound';

describe('compoundInterest', () => {
  it('grows a single principal with zero contributions', () => {
    const r = compoundInterest(1000, 0, 12, 1);
    expect(r.total).toBeCloseTo(1126.83, 2);
    expect(r.contributions).toBe(1000);
    expect(r.interest).toBeCloseTo(126.83, 2);
  });
  it('adds monthly contributions', () => {
    const r = compoundInterest(0, 100, 12, 1);
    expect(r.contributions).toBe(1200);
    expect(r.total).toBeGreaterThan(1200);
    expect(r.total).toBeLessThan(1300);
  });
  it('produces yearly series of length years+1 starting at year 0', () => {
    const r = compoundInterest(1000, 0, 12, 3);
    expect(r.series).toHaveLength(4);
    expect(r.series[0]).toEqual({ year: 0, value: 1000 });
  });
});
