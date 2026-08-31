export interface CompoundResult {
  total: number;
  contributions: number;
  interest: number;
  series: { year: number; value: number }[];
}

export function compoundInterest(
  principal: number,
  monthlyContribution: number,
  annualRatePct: number,
  years: number,
): CompoundResult {
  const monthlyRate = annualRatePct / 100 / 12;
  let balance = principal;
  let totalContributions = principal;
  const series: { year: number; value: number }[] = [{ year: 0, value: principal }];

  for (let m = 1; m <= years * 12; m++) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;
    if (monthlyContribution > 0) totalContributions += monthlyContribution;
    if (m % 12 === 0) {
      series.push({ year: m / 12, value: balance });
    }
  }

  return {
    total: balance,
    contributions: totalContributions,
    interest: balance - totalContributions,
    series,
  };
}
