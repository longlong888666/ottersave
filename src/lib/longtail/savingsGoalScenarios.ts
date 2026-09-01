// 储蓄目标长尾场景：目标金额 × 每月储蓄 × 利率 → "存够 $X 要多久"
import type { LongtailScenario } from './compoundScenarios';

export interface GoalScenario {
  target: number;
  monthly: number;
  rate: number;
  slug: string;
  title: string;
  description: string;
  blurb: string;
}

const goalValues = [5000, 10000, 20000, 50000, 100000, 200000, 500000, 1000000];
const monthlyValues = [100, 200, 500, 1000];
const rateValues = [5, 7];

function fmtMoney(n: number): string {
  return n >= 1000 ? `$${(n / 1000).toLocaleString()}k` : `$${n}`;
}
function fmtMoneyFull(n: number): string {
  return n >= 1000 ? `$${n.toLocaleString()}` : `$${n}`;
}

function build(target: number, monthly: number, rate: number) {
  const slug = `save-${target}-with-${monthly}-a-month-at-${rate}-percent`;
  const title = `How Long to Save ${fmtMoney(target)} Saving ${fmtMoneyFull(monthly)} a Month at ${rate}%`;
  const description =
    `How long does it take to save ${fmtMoney(target)} if you put away ${fmtMoneyFull(monthly)} a month at ${rate}%? ` +
    `See the years, months, and daily amount needed with our free savings goal calculator.`;
  const blurb =
    `Saving ${fmtMoneyFull(monthly)} a month toward ${fmtMoney(target)} is a realistic, chunkable goal. ` +
    `With a ${rate}% average annual return on your growing balance, compound interest helps you cross the finish line sooner than you'd expect. ` +
    `Use the calculator below to try different monthly amounts — the more you save each month, the faster your ${fmtMoney(target)} arrives.`;
  return { target, monthly, rate, slug, title, description, blurb };
}

export function allGoalScenarios(): GoalScenario[] {
  const out: GoalScenario[] = [];
  for (const g of goalValues) {
    for (const m of monthlyValues) {
      for (const r of rateValues) {
        out.push(build(g, m, r));
      }
    }
  }
  return out;
}

export function relatedGoalScenarios(scenario: GoalScenario, count = 6): GoalScenario[] {
  const all = allGoalScenarios();
  return all
    .filter((s) => s.slug !== scenario.slug)
    .sort((a, b) => {
      const score = (x: GoalScenario) =>
        (x.target === scenario.target ? 2 : 0) + (x.monthly === scenario.monthly ? 2 : 0) + (x.rate === scenario.rate ? 1 : 0);
      return score(b) - score(a);
    })
    .slice(0, count);
}

export type { LongtailScenario };
