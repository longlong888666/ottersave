// 投资回报长尾场景：一次性投入 × 每月追加 × 年限 × 利率 → 最终价值

export interface InvestScenario {
  lump: number;
  monthly: number;
  years: number;
  rate: number;
  slug: string;
  title: string;
  description: string;
  blurb: string;
}

const lumpValues = [10000, 50000, 100000];
const monthlyValues = [0, 500, 1000];
const yearValues = [10, 20, 30];
const rateValues = [5, 7];

function fmtMoney(n: number): string {
  return n >= 1000 ? `$${n.toLocaleString()}` : `$${n}`;
}

function build(lump: number, monthly: number, years: number, rate: number): InvestScenario {
  const monthlyPart = monthly > 0 ? `plus-${monthly}-a-month` : 'with-no-monthly-additions';
  const slug = `invest-${lump}-${monthlyPart}-for-${years}-years-at-${rate}-percent`;
  const title = monthly > 0
    ? `Investing ${fmtMoney(lump)} + ${fmtMoney(monthly)}/Month for ${years} Years at ${rate}%`
    : `Investing ${fmtMoney(lump)} for ${years} Years at ${rate}%`;
  const description = monthly > 0
    ? `What does investing ${fmtMoney(lump)} plus ${fmtMoney(monthly)} a month for ${years} years at ${rate}% grow to? See the final value and investment gain with our free calculator.`
    : `What does a one-time ${fmtMoney(lump)} investment grow to over ${years} years at ${rate}%? See the final value and total gain with our free calculator.`;
  const blurb = monthly > 0
    ? `Starting with ${fmtMoney(lump)} and adding ${fmtMoney(monthly)} every month for ${years} years is a powerful combination — your initial capital works immediately while monthly contributions keep compounding on top. At ${rate}% a year, this scenario shows how the two together build a substantial portfolio. Use the calculator below to adjust the numbers.`
    : `A one-time ${fmtMoney(lump)} left to compound for ${years} years at ${rate}% is the purest form of letting your money work. No deposits needed — just time. Use the calculator below to add monthly contributions and see how much faster the pile grows.`;
  return { lump, monthly, years, rate, slug, title, description, blurb };
}

export function allInvestScenarios(): InvestScenario[] {
  const out: InvestScenario[] = [];
  for (const l of lumpValues) {
    for (const m of monthlyValues) {
      for (const y of yearValues) {
        for (const r of rateValues) {
          out.push(build(l, m, y, r));
        }
      }
    }
  }
  return out;
}

export function relatedInvestScenarios(scenario: InvestScenario, count = 6): InvestScenario[] {
  const all = allInvestScenarios();
  return all
    .filter((s) => s.slug !== scenario.slug)
    .sort((a, b) => {
      const score = (x: InvestScenario) =>
        (x.lump === scenario.lump ? 2 : 0) + (x.monthly === scenario.monthly ? 2 : 0) + (x.years === scenario.years ? 1 : 0);
      return score(b) - score(a);
    })
    .slice(0, count);
}
