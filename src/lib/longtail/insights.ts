// 长尾页差异化"深度洞察"内容生成器
// 目标：让 223 个长尾页的内容各不相同（避免 thin/duplicate content），同时把正文补厚。
// 原理：每个场景根据其参数组合，用真实计算函数生成独立的「阶段增长表 + 参数对比洞察 + 针对性总结」。
// 所有数字都由现有计算函数算出，与页面主结果一致，可独立复核。

import { compoundInterest } from '../calculators/compound';
import { formatUSD } from '../calculators/money';
import { savingsGoal } from '../calculators/savingsGoal';
import { retirementSavings } from '../calculators/retirement';
import { investmentReturn } from '../calculators/investmentReturn';

export interface MilestoneRow {
  label: string;
  value: string;
  note?: string;
}

export interface ComparisonPoint {
  title: string;
  text: string;
  highlight?: string;
}

export interface LongtailInsight {
  sectionTitle: string;
  intro: string;
  milestones: MilestoneRow[];
  comparisons: ComparisonPoint[];
  takeaway: string;
}

/** 紧凑金额：$12500 -> $12.5k */
function fmtShort(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toLocaleString(undefined, { maximumFractionDigits: 1 })}m`;
  if (n >= 1_000) return `$${(n / 1_000).toLocaleString(undefined, { maximumFractionDigits: 1 })}k`;
  return `$${Math.round(n)}`;
}

/** 达到目标一定比例所需月数（复制 savingsGoal 内部逻辑，避免依赖私有状态） */
function goalMonthsTo(targetFraction: number, monthly: number, annualRatePct: number): number {
  const monthlyRate = annualRatePct / 100 / 12;
  let balance = 0;
  let months = 0;
  while (balance < targetFraction && months < 1200) {
    balance = balance * (1 + monthlyRate) + monthly;
    months++;
  }
  return months;
}

function fmtYears(months: number): string {
  if (months >= 1200) return 'Not reached';
  const y = Math.round((months / 12) * 10) / 10;
  return `${y} years`;
}

// ============ 1. 复利（compound） ============
export function compoundInsight(monthly: number, rate: number, years: number): LongtailInsight {
  const r = compoundInterest(0, monthly, rate, years);
  const quarters = [0.25, 0.5, 0.75, 1];
  const milestones: MilestoneRow[] = quarters.map((q) => {
    const y = Math.max(1, Math.round(years * q));
    const rr = compoundInterest(0, monthly, rate, y);
    const last = y === years;
    return {
      label: last ? `After ${y} years (final)` : `By year ${y}`,
      value: formatUSD(rr.total),
      note: last ? `${fmtShort(r.contributions)} of it is your own deposits` : undefined,
    };
  });

  const comparisons: ComparisonPoint[] = [];
  const rDouble = compoundInterest(0, monthly * 2, rate, years);
  comparisons.push({
    title: `What if you saved ${fmtShort(monthly * 2)} a month instead?`,
    text: `Doubling your deposit to ${fmtShort(monthly * 2)}/month would grow to about ${formatUSD(rDouble.total)} after ${years} years — roughly ${formatUSD(rDouble.total - r.total)} more than the ${formatUSD(monthly)}/month plan.`,
    highlight: formatUSD(rDouble.total),
  });
  const rLonger = compoundInterest(0, monthly, rate, years + 5);
  comparisons.push({
    title: `What about ${years + 5} years instead of ${years}?`,
    text: `Extending the horizon to ${years + 5} years would lift the balance to roughly ${formatUSD(rLonger.total)}. The last few years of compounding do most of the work, which is why consistency pays.`,
    highlight: formatUSD(rLonger.total),
  });
  const rHigher = compoundInterest(0, monthly, rate + 2, years);
  comparisons.push({
    title: `And at ${rate + 2}% instead of ${rate}%?`,
    text: `Just two extra percentage points of average annual return would make the same ${fmtShort(monthly)}/month deposits worth about ${formatUSD(rHigher.total)} after ${years} years. Expected return matters as much as the amount you save.`,
    highlight: formatUSD(rHigher.total),
  });

  return {
    sectionTitle: `How ${fmtShort(monthly)}/month at ${rate}% grows over ${years} years`,
    intro: `Breaking this scenario down year by year shows where the growth actually happens. Most of the final balance arrives in the later years — a direct illustration of why starting early and staying consistent matters so much.`,
    milestones,
    comparisons,
    takeaway: `The bottom line: ${fmtShort(monthly)} a month at ${rate}% for ${years} years turns ${fmtShort(r.contributions)} of your own deposits into ${formatUSD(r.total)}. Of that, ${formatUSD(r.interest)} is pure compound interest — growth you never had to earn through extra work.`,
  };
}

// ============ 2. 储蓄目标（savings goal） ============
export function goalInsight(target: number, monthly: number, rate: number): LongtailInsight {
  const r = savingsGoal(target, 0, monthly, rate);
  const noInterest = savingsGoal(target, 0, monthly, 0);
  const savedByInterest = noInterest.months - r.months;

  const milestones: MilestoneRow[] = [0.25, 0.5, 0.75, 1].map((f) => ({
    label: `Reach ${Math.round(f * 100)}% of ${fmtShort(target)}`,
    value: fmtYears(goalMonthsTo(target * f, monthly, rate)),
    note: f === 1 ? `with a ${rate}% average annual return` : undefined,
  }));

  const comparisons: ComparisonPoint[] = [];
  const faster = savingsGoal(target, 0, monthly + 100, rate);
  comparisons.push({
    title: `Save $100 more each month?`,
    text: `Bumping up to ${fmtShort(monthly + 100)}/month would get you to ${fmtShort(target)} in about ${faster.years.toFixed(1)} years instead of ${r.years.toFixed(1)} — that's roughly ${Math.max(1, Math.round(r.months - faster.months))} months sooner.`,
    highlight: `${faster.years.toFixed(1)} years`,
  });
  const slower = savingsGoal(target, 0, Math.max(25, monthly / 2), rate);
  comparisons.push({
    title: `What if you only saved ${fmtShort(Math.max(25, monthly / 2))}/month?`,
    text: `Halving your monthly deposit stretches the journey to about ${slower.years.toFixed(1)} years — a clear look at how much your monthly habit is worth in time.`,
    highlight: `${slower.years.toFixed(1)} years`,
  });
  comparisons.push({
    title: `What is compound interest worth here?`,
    text: `Without any return, reaching ${fmtShort(target)} with ${fmtShort(monthly)}/month would take about ${noInterest.years.toFixed(1)} years. At ${rate}% it takes ${r.years.toFixed(1)} years — the interest saves you roughly ${savedByInterest} months of saving.`,
    highlight: `${savedByInterest} months saved`,
  });

  return {
    sectionTitle: `How long ${fmtShort(target)} really takes at ${fmtShort(monthly)}/month`,
    intro: `Saving ${fmtShort(target)} is a marathon, not a sprint. The table below shows how long each stage takes with a ${rate}% average annual return, and the comparisons reveal how small changes to your monthly habit — or your expected return — reshape the timeline.`,
    milestones,
    comparisons,
    takeaway: `To reach ${fmtShort(target)} you'll need about ${r.years.toFixed(1)} years at ${fmtShort(monthly)}/month and ${rate}%. Compound interest quietly does about ${Math.round((savedByInterest / Math.max(1, noInterest.months)) * 100)}% of the heavy lifting, so staying consistent matters more than timing the market.`,
  };
}

// ============ 3. 退休（retirement） ============
export function retirementInsight(age: number, monthly: number, rate: number): LongtailInsight {
  const yearsToGrow = 65 - age;
  const r = retirementSavings(age, 65, 0, monthly, rate);

  const milestones: MilestoneRow[] = [];
  for (let y = 10; y < yearsToGrow; y += 10) {
    const rr = compoundInterest(0, monthly, rate, y);
    milestones.push({ label: `Age ${age + y} (after ${y} years)`, value: formatUSD(rr.total) });
  }
  milestones.push({
    label: `Age 65 — retirement`,
    value: formatUSD(r.total),
    note: `≈ ${formatUSD(r.monthlyWithdrawal)}/month income under the 4% rule`,
  });

  const comparisons: ComparisonPoint[] = [];
  const earlier = retirementSavings(Math.max(20, age - 5), 65, 0, monthly, rate);
  comparisons.push({
    title: `Starting 5 years earlier at age ${Math.max(20, age - 5)}?`,
    text: `If you'd started at ${Math.max(20, age - 5)} instead of ${age}, the nest egg would be about ${formatUSD(earlier.total)} — roughly ${formatUSD(earlier.total - r.total)} more, just for starting sooner.`,
    highlight: formatUSD(earlier.total),
  });
  const more = retirementSavings(age, 65, 0, monthly + 100, rate);
  comparisons.push({
    title: `Saving $100 more each month?`,
    text: `Adding ${fmtShort(monthly + 100)}/month instead of ${fmtShort(monthly)} would grow to about ${formatUSD(more.total)} by 65 — and bump your monthly retirement income (4% rule) to roughly ${formatUSD(more.monthlyWithdrawal)}/month.`,
    highlight: formatUSD(more.monthlyWithdrawal) + '/mo',
  });
  comparisons.push({
    title: `Your retirement income in practice`,
    text: `With ${formatUSD(r.total)} saved, the 4% rule suggests withdrawing about ${formatUSD(r.monthlyWithdrawal)} per month in retirement without running out of money over a 30-year horizon.`,
    highlight: formatUSD(r.monthlyWithdrawal) + '/mo',
  });

  return {
    sectionTitle: `Retiring at 65 from age ${age} with ${fmtShort(monthly)}/month`,
    intro: `Starting at ${age}, you have ${yearsToGrow} years of contributions plus compounding ahead. The milestones below show the balance at each decade, and the comparisons show why "start earlier" and "save a little more" are the two levers you actually control.`,
    milestones,
    comparisons,
    takeaway: `By 65, ${fmtShort(monthly)}/month from age ${age} at ${rate}% builds a nest egg of about ${formatUSD(r.total)}, supporting roughly ${formatUSD(r.monthlyWithdrawal)}/month in retirement. The earlier you start, the smaller each monthly deposit needs to be.`,
  };
}

// ============ 4. 投资回报（investment return） ============
export function investInsight(lump: number, monthly: number, years: number, rate: number): LongtailInsight {
  const r = investmentReturn(lump, monthly, years, rate);
  const quarters = [0.25, 0.5, 0.75, 1];
  const milestones: MilestoneRow[] = quarters.map((q) => {
    const y = Math.max(1, Math.round(years * q));
    const rr = investmentReturn(lump, monthly, y, rate);
    const last = y === years;
    return {
      label: last ? `After ${y} years (final)` : `By year ${y}`,
      value: formatUSD(rr.total),
      note: last ? `gain of ${formatUSD(r.interest)}` : undefined,
    };
  });

  const comparisons: ComparisonPoint[] = [];
  if (monthly > 0) {
    const lumpOnly = investmentReturn(lump, 0, years, rate);
    comparisons.push({
      title: `The power of monthly additions`,
      text: `With no monthly contributions, your ${fmtShort(lump)} alone would grow to about ${formatUSD(lumpOnly.lumpOnly)} after ${years} years. Adding ${fmtShort(monthly)}/month more than doubles that, to ${formatUSD(r.total)}.`,
      highlight: formatUSD(r.total),
    });
  }
  const longer = investmentReturn(lump, monthly, years + 5, rate);
  comparisons.push({
    title: `Holding for ${years + 5} years instead of ${years}?`,
    text: `Extending the time horizon to ${years + 5} years would bring the portfolio to roughly ${formatUSD(longer.total)} — the extra years let the compounding curve do its steepest work.`,
    highlight: formatUSD(longer.total),
  });
  const higher = investmentReturn(lump, monthly, years, rate + 2);
  comparisons.push({
    title: `And at ${rate + 2}% instead of ${rate}%?`,
    text: `If the average annual return were ${rate + 2}% instead of ${rate}%, the same plan would be worth about ${formatUSD(higher.total)} after ${years} years. Small return differences compound into large gaps over time.`,
    highlight: formatUSD(higher.total),
  });

  const how = monthly > 0
    ? `${fmtShort(lump)} up front plus ${fmtShort(monthly)}/month for ${years} years`
    : `a one-time ${fmtShort(lump)} held for ${years} years`;
  return {
    sectionTitle: `What ${fmtShort(lump)}${monthly > 0 ? ` + ${fmtShort(monthly)}/mo` : ''} grows to in ${years} years`,
    intro: `With ${how} and a ${rate}% average annual return, the timeline below shows how the balance builds. The comparisons make the two biggest levers obvious: time in the market and the return you earn.`,
    milestones,
    comparisons,
    takeaway: `At ${rate}%, ${how} grows to about ${formatUSD(r.total)} — of which ${formatUSD(r.interest)} is investment gain. Time and consistency are the engine; the return is the fuel.`,
  };
}
