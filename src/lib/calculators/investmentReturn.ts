import { compoundInterest } from './compound';

export interface InvestmentReturnResult {
  total: number;
  contributions: number;
  interest: number;
  lumpOnly: number;
  series: { year: number; value: number }[];
}

export function investmentReturn(
  lumpSum: number,
  monthlyContribution: number,
  years: number,
  annualRatePct: number,
): InvestmentReturnResult {
  const r = compoundInterest(lumpSum, monthlyContribution, annualRatePct, years);
  const monthlyRate = annualRatePct / 100 / 12;
  const lumpOnly = lumpSum * Math.pow(1 + monthlyRate, years * 12);
  return { ...r, lumpOnly };
}
