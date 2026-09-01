// 长尾页场景：拿复利计算器按「月存 × 利率 × 年限」自动生成大量问题页
// 每个场景 = 一个独立的 SEO 长尾页面（URL 即搜索词风格）

export interface LongtailScenario {
  monthly: number;
  rate: number;
  years: number;
  slug: string;
  title: string;
  description: string;
  blurb: string;
}

const monthlyValues = [100, 200, 500, 1000];
const rateValues = [5, 7, 8];
const yearValues = [10, 20, 30];

function fmtMoney(n: number): string {
  return n >= 1000 ? `$${n.toLocaleString()}` : `$${n}`;
}

function build(monthly: number, rate: number, years: number): LongtailScenario {
  const slug = `save-${monthly}-a-month-for-${years}-years-at-${rate}-percent`;
  const title = `Saving ${fmtMoney(monthly)} a Month for ${years} Years at ${rate}%: What It's Worth`;
  const description =
    `How much will saving ${fmtMoney(monthly)} a month for ${years} years at ${rate}% compound interest grow to? ` +
    `See the final balance, total contributions, and interest earned with our free calculator.`;
  const blurb =
    `Saving ${fmtMoney(monthly)} every month might not feel like much at first, but compounding does the heavy lifting. ` +
    `Over ${years} years at a steady ${rate}% annual return, your consistent deposits can grow far beyond what you actually put in. ` +
    `Use the calculator below to adjust any number and see the difference — every extra month of saving makes your money work harder.`;
  return { monthly, rate, years, slug, title, description, blurb };
}

export function allCompoundScenarios(): LongtailScenario[] {
  const out: LongtailScenario[] = [];
  for (const m of monthlyValues) {
    for (const r of rateValues) {
      for (const y of yearValues) {
        out.push(build(m, r, y));
      }
    }
  }
  return out;
}

// 站内互链辅助：返回同利率或同月存的相邻场景链接（利于 SEO 内链）
export function relatedScenarios(scenario: LongtailScenario, count = 6): LongtailScenario[] {
  const all = allCompoundScenarios();
  return all
    .filter((s) => s.slug !== scenario.slug)
    .sort((a, b) => {
      const score = (x: LongtailScenario) =>
        (x.monthly === scenario.monthly ? 2 : 0) +
        (x.rate === scenario.rate ? 2 : 0) +
        (x.years === scenario.years ? 1 : 0);
      return score(b) - score(a);
    })
    .slice(0, count);
}
