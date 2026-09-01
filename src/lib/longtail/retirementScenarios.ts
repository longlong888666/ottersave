// 退休长尾场景：起始年龄 × 每月储蓄 × 利率 → 65 岁时有多少钱 + 每月可提取（4%规则）

export interface RetirementScenario {
  age: number;
  retAge: number;
  monthly: number;
  rate: number;
  slug: string;
  title: string;
  description: string;
  blurb: string;
}

const ageValues = [25, 30, 35, 40, 45];
const monthlyValues = [200, 500, 1000, 2000];
const rateValues = [5, 7, 9];
const RET_AGE = 65;

function fmtMoney(n: number): string {
  return n >= 1000 ? `$${n.toLocaleString()}` : `$${n}`;
}

function build(age: number, monthly: number, rate: number): RetirementScenario {
  const slug = `retire-at-65-saving-${monthly}-a-month-from-age-${age}-at-${rate}-percent`;
  const title = `Retiring at 65: ${fmtMoney(monthly)}/Month from Age ${age} at ${rate}%`;
  const description =
    `If you save ${fmtMoney(monthly)} a month from age ${age} to 65 at ${rate}%, how much will you have for retirement? ` +
    `See your projected nest egg and monthly income under the 4% rule.`;
  const blurb =
    `Starting at age ${age}, saving ${fmtMoney(monthly)} every month until 65 is one of the most powerful moves you can make — ${RET_AGE - age} years of monthly contributions plus compounding. ` +
    `At a ${rate}% average annual return, this scenario projects a retirement nest egg that could support you for decades. ` +
    `Use the calculator below to adjust the numbers and see how starting earlier or saving more changes your future.`;
  return { age, retAge: RET_AGE, monthly, rate, slug, title, description, blurb };
}

export function allRetirementScenarios(): RetirementScenario[] {
  const out: RetirementScenario[] = [];
  for (const a of ageValues) {
    for (const m of monthlyValues) {
      for (const r of rateValues) {
        out.push(build(a, m, r));
      }
    }
  }
  return out;
}

export function relatedRetirementScenarios(scenario: RetirementScenario, count = 6): RetirementScenario[] {
  const all = allRetirementScenarios();
  return all
    .filter((s) => s.slug !== scenario.slug)
    .sort((a, b) => {
      const score = (x: RetirementScenario) =>
        (x.age === scenario.age ? 2 : 0) + (x.monthly === scenario.monthly ? 2 : 0) + (x.rate === scenario.rate ? 1 : 0);
      return score(b) - score(a);
    })
    .slice(0, count);
}
