import { compoundInterest } from './compound';

export interface RetirementResult {
  total: number;
  contributions: number;
  interest: number;
  monthlyWithdrawal: number;
  yearsToGrow: number;
}

export function retirementSavings(
  currentAge: number,
  retirementAge: number,
  currentSavings: number,
  monthlyContribution: number,
  annualRatePct: number,
): RetirementResult {
  const yearsToGrow = Math.max(0, retirementAge - currentAge);
  const r = compoundInterest(currentSavings, monthlyContribution, annualRatePct, yearsToGrow);
  return {
    total: r.total,
    contributions: r.contributions,
    interest: r.interest,
    monthlyWithdrawal: (r.total * 0.04) / 12,
    yearsToGrow,
  };
}
