export interface SavingsGoalResult {
  months: number;
  years: number;
  daily: number;
  monthly: number;
  final: number;
}

export function savingsGoal(
  target: number,
  current: number,
  monthlyContribution: number,
  annualRatePct: number,
): SavingsGoalResult {
  if (current >= target) {
    return { months: 0, years: 0, daily: 0, monthly: 0, final: current };
  }
  if (monthlyContribution <= 0) {
    return { months: Infinity, years: Infinity, daily: 0, monthly: 0, final: current };
  }
  const monthlyRate = annualRatePct / 100 / 12;
  let balance = current;
  let months = 0;
  while (balance < target && months < 1200) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;
    months++;
  }
  const daily = monthlyContribution / 30.436875;
  return {
    months,
    years: Math.round((months / 12) * 10) / 10,
    daily,
    monthly: monthlyContribution,
    final: balance,
  };
}
