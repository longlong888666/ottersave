import { describe, it, expect } from 'vitest';
import { investmentReturn } from '../../src/lib/calculators/investmentReturn';

describe('investmentReturn', () => {
  it('computes lump-sum-only growth', () => {
    const r = investmentReturn(10000, 0, 1, 12);
    expect(r.total).toBeCloseTo(11268.25, 0);
    expect(r.lumpOnly).toBeCloseTo(11268.25, 0);
  });
  it('adds monthly contributions', () => {
    const r = investmentReturn(10000, 500, 1, 12);
    expect(r.contributions).toBe(16000);
    expect(r.total).toBeGreaterThan(16000);
  });
  it('produces yearly series', () => {
    const r = investmentReturn(1000, 0, 2, 12);
    expect(r.series).toHaveLength(3);
    expect(r.series[0].year).toBe(0);
  });
});
