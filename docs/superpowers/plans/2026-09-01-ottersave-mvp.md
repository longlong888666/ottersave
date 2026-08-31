# OtterSave MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the OtterSave static site with 5 working financial calculators, cozy "Animal Crossing-like" visual style, SEO basics (sitemap/FAQ JSON-LD), and AdSense-ready privacy/about pages.

**Architecture:** Static Astro site. All math lives in pure TypeScript functions in `src/lib/calculators/`, each with Vitest unit tests (TDD). Each calculator is one page using shared components (`BaseLayout`, `OtterLogo`, `ResultPanel`) and inline client scripts (Chart.js for growth curves, canvas share card). No backend, no database.

**Tech Stack:** Astro 5, Tailwind CSS v4 (via @tailwindcss/vite), TypeScript, Vitest, Chart.js, @astrojs/sitemap. Deploy: Cloudflare Pages.

**Spec:** `docs/superpowers/specs/2026-09-01-ottersave-design.md`

## Global Constraints

- Palette (verbatim from spec): bg `#FFF9EF`, primary mint `#7BC8A6`, sky blue `#A8D8F0`, coral pink `#F5B8A9`, cream yellow `#F9E29C`, text brown `#4A3F35`. No dark backgrounds, no harsh saturated colors.
- Fonts: `Baloo 2` (display/headings), `Nunito` (body), loaded via Google Fonts in `BaseLayout`.
- All illustrations are original SVG (otter, shell, pebble, coin, sprout, cloud, wave). Never copy Nintendo assets.
- All money math uses monthly compounding; rates input as annual percent (e.g. 7 means 7%/year).
- Numbers displayed with `formatUSD` ($1,234.56) unless noted.
- Every calculator page: H1 with exact keyword, working calculator, ResultPanel, 3-5 FAQ items, FAQ JSON-LD (`https://schema.org/FAQPage`), links to the other 4 tools, ad placeholder div.
- Every calculator function must be pure (no side effects) and tested with Vitest.
- Commits after every task, message style: `feat: ...` / `test: ...` / `chore: ...`.

---

### Task 1: Project scaffold, theme, base layout, otter logo

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/styles/global.css`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/OtterLogo.astro`
- Create: `public/favicon.svg`
- Create: `src/pages/index.astro` (skeleton, fleshed out in Task 7)
- Create: `.gitignore`

**Interfaces:**
- Consumes: nothing.
- Produces: `BaseLayout` (props: `title`, `description`, `faqJsonLd?: string`, slot children), `OtterLogo` (props: `size?: number`), global CSS with `.btn`, `.card`, `.input` utility classes that later pages rely on.

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "ottersave",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "vitest run"
  },
  "dependencies": {
    "@astrojs/sitemap": "^3.2.1",
    "astro": "^5.5.0",
    "chart.js": "^4.4.7",
    "tailwindcss": "^4.1.0",
    "@tailwindcss/vite": "^4.1.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "vitest": "^3.0.0"
  }
}
```

- [ ] **Step 2: Write `astro.config.mjs`**

```js
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ottersave.com',
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
```

- [ ] **Step 3: Write `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/base",
  "compilerOptions": {
    "strict": true,
    "types": ["vitest/globals"]
  },
  "include": ["src/**/*", "tests/**/*"]
}
```

- [ ] **Step 4: Write `.gitignore`**

```
node_modules/
dist/
.astro/
```

- [ ] **Step 5: Write `src/styles/global.css` (Tailwind v4 theme)**

```css
@import "tailwindcss";

@theme {
  --color-cream: #FFF9EF;
  --color-mint: #7BC8A6;
  --color-mint-dark: #5BA887;
  --color-sky: #A8D8F0;
  --color-coral: #F5B8A9;
  --color-butter: #F9E29C;
  --color-coco: #4A3F35;
  --color-coco-light: #7A6A5C;
  --font-display: "Baloo 2", "Nunito", sans-serif;
  --font-body: "Nunito", sans-serif;
}

body {
  @apply bg-cream text-coco font-body antialiased;
}

.btn {
  @apply inline-flex items-center justify-center rounded-full px-6 py-3 font-display font-bold text-lg text-white bg-mint hover:bg-mint-dark transition-colors cursor-pointer border-none;
}

.card {
  @apply bg-white rounded-3xl shadow-[0_6px_24px_rgba(122,106,92,0.12)] p-6;
}

.input {
  @apply w-full rounded-2xl border-2 border-mint/50 bg-cream px-4 py-3 text-lg text-coco outline-none focus:border-mint transition-colors;
}

.label {
  @apply block font-display font-bold text-coco mb-1;
}

@keyframes coin-pop {
  0% { transform: scale(0); opacity: 0; }
  70% { transform: scale(1.15); }
  100% { transform: scale(1); opacity: 1; }
}

.animate-coin-pop { animation: coin-pop 0.5s ease-out both; }

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.animate-float { animation: float 3s ease-in-out infinite; }
```

- [ ] **Step 6: Write `src/layouts/BaseLayout.astro`**

```astro
---
interface Props {
  title: string;
  description: string;
  faqJsonLd?: string;
}
const { title, description, faqJsonLd } = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site!);
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Nunito:wght@400;600;700&display=swap"
      rel="stylesheet"
    />
    {
      faqJsonLd && <script type="application/ld+json" set:html={faqJsonLd}></script>
    }
  </head>
  <body>
    <header class="sticky top-0 z-20 bg-cream/90 backdrop-blur border-b-2 border-mint/20">
      <div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" class="flex items-center gap-2">
          <OtterLogo size={40} />
          <span class="font-display font-800 text-2xl text-coco">OtterSave</span>
        </a>
        <nav class="flex items-center gap-4 text-coco-light font-bold">
          <a href="/" class="hover:text-coco">Tools</a>
          <a href="/about/" class="hover:text-coco">About</a>
          <a href="/contact/" class="hover:text-coco">Contact</a>
        </nav>
      </div>
    </header>
    <main class="max-w-4xl mx-auto px-4 py-8 min-h-[60vh]">
      <slot />
    </main>
    <footer class="max-w-4xl mx-auto px-4 py-8 border-t-2 border-mint/20 text-center text-coco-light">
      <p class="font-bold">&copy; {new Date().getFullYear()} OtterSave · <a href="/privacy-policy/" class="hover:text-coco">Privacy Policy</a> · <a href="/contact/" class="hover:text-coco">Contact</a></p>
      <p class="text-sm mt-1">Savings, but make it cozy.</p>
    </footer>
  </body>
</html>

<style>
  @import url(../styles/global.css);
</style>
```

> Note: `Astro.site` is set because `site` is configured; `OtterLogo` is auto-imported by Astro from `src/components`.

- [ ] **Step 7: Write `public/favicon.svg` (original otter-mark)**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#7BC8A6"/>
  <circle cx="22" cy="26" r="11" fill="#4A3F35"/>
  <circle cx="42" cy="26" r="11" fill="#4A3F35"/>
  <circle cx="19" cy="23" r="3.5" fill="#FFF9EF"/>
  <circle cx="25" cy="23" r="3.5" fill="#FFF9EF"/>
  <circle cx="39" cy="23" r="3.5" fill="#FFF9EF"/>
  <circle cx="45" cy="23" r="3.5" fill="#FFF9EF"/>
  <circle cx="19" cy="23" r="1.6" fill="#4A3F35"/>
  <circle cx="25" cy="23" r="1.6" fill="#4A3F35"/>
  <circle cx="39" cy="23" r="1.6" fill="#4A3F35"/>
  <circle cx="45" cy="23" r="1.6" fill="#4A3F35"/>
  <ellipse cx="32" cy="40" rx="14" ry="9" fill="#F5B8A9"/>
  <circle cx="32" cy="36" r="4" fill="#4A3F35"/>
</svg>
```

- [ ] **Step 8: Write `src/components/OtterLogo.astro` (reusable logo: otter face + pebble)**

```astro
---
interface Props { size?: number; }
const { size = 48 } = Astro.props;
---

<svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="Ollie the otter" class="shrink-0">
  <circle cx="22" cy="26" r="11" fill="#4A3F35"/>
  <circle cx="42" cy="26" r="11" fill="#4A3F35"/>
  <circle cx="19" cy="23" r="3.5" fill="#FFF9EF"/>
  <circle cx="25" cy="23" r="3.5" fill="#FFF9EF"/>
  <circle cx="39" cy="23" r="3.5" fill="#FFF9EF"/>
  <circle cx="45" cy="23" r="3.5" fill="#FFF9EF"/>
  <circle cx="19" cy="23" r="1.6" fill="#4A3F35"/>
  <circle cx="25" cy="23" r="1.6" fill="#4A3F35"/>
  <circle cx="39" cy="23" r="1.6" fill="#4A3F35"/>
  <circle cx="45" cy="23" r="1.6" fill="#4A3F35"/>
  <ellipse cx="32" cy="40" rx="14" ry="9" fill="#F5B8A9"/>
  <circle cx="32" cy="36" r="4" fill="#4A3F35"/>
  <ellipse cx="48" cy="50" rx="6" ry="5" fill="#A8D8F0"/>
</svg>
```

- [ ] **Step 9: Write skeleton `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout
  title="OtterSave — Cozy Savings Calculators"
  description="Friendly compound interest, retirement, and savings goal calculators. Watch your money grow the cozy way."
>
  <h1 class="font-display text-4xl font-800 text-coco text-center mt-6">Savings, but make it cozy.</h1>
  <p class="text-center text-coco-light text-lg mt-2">Tools coming soon.</p>
</BaseLayout>
```

- [ ] **Step 10: Install dependencies**

Run: `npm install`
Expected: node_modules created, no errors.

- [ ] **Step 11: Build to verify scaffold**

Run: `npm run build`
Expected: `dist/` created with `index.html`, `sitemap-0.xml`, no errors.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "chore: scaffold OtterSave Astro site with cozy theme"
```

---

### Task 2: Calculator engine — formatUSD + compound interest + savings goal

**Files:**
- Create: `src/lib/calculators/money.ts`
- Create: `src/lib/calculators/compound.ts`
- Create: `src/lib/calculators/savingsGoal.ts`
- Test: `tests/calculators/money.test.ts`
- Test: `tests/calculators/compound.test.ts`
- Test: `tests/calculators/savingsGoal.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `formatUSD(n: number): string` — `$1,234.56`; negatives as `-$5.00`; round half-up to cents.
  - `compoundInterest(principal: number, monthlyContribution: number, annualRatePct: number, years: number): { total: number; contributions: number; interest: number; series: { year: number; value: number }[] }`
    - monthly rate = annualRatePct / 100 / 12; compounding monthly; contributions added at end of each month; `series` has one entry per year (value at month 12×year).
  - `savingsGoal(target: number, current: number, monthlyContribution: number, annualRatePct: number): { months: number; years: number; daily: number; monthly: number; final: number }`
    - `daily = monthlyContribution / 30.436875` (avg days/month); if target already reached, months=0, years=0, daily=0, monthly=0, final=current.
    - If `monthlyContribution <= 0` and target > current: `months = Infinity`, years = Infinity, daily=0, monthly=0, final=current.

- [ ] **Step 1: Write failing tests for `money.ts`**

```ts
// tests/calculators/money.test.ts
import { describe, it, expect } from 'vitest';
import { formatUSD } from '../../src/lib/calculators/money';

describe('formatUSD', () => {
  it('formats positive dollars with commas and cents', () => {
    expect(formatUSD(1234.567)).toBe('$1,234.57');
  });
  it('formats zero', () => {
    expect(formatUSD(0)).toBe('$0.00');
  });
  it('formats negative values', () => {
    expect(formatUSD(-5)).toBe('-$5.00');
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run tests/calculators/money.test.ts`
Expected: FAIL (module not found / function undefined).

- [ ] **Step 3: Implement `src/lib/calculators/money.ts`**

```ts
export function formatUSD(n: number): string {
  const sign = n < 0 ? '-' : '';
  const abs = Math.abs(n);
  const rounded = Math.round(abs * 100) / 100;
  const [intPart, decPart = '00'] = rounded.toFixed(2).split('.');
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${sign}$${withCommas}.${decPart}`;
}
```

- [ ] **Step 4: Run test, verify it passes**

Run: `npx vitest run tests/calculators/money.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Write failing tests for `compound.ts`**

```ts
// tests/calculators/compound.test.ts
import { describe, it, expect } from 'vitest';
import { compoundInterest } from '../../src/lib/calculators/compound';

describe('compoundInterest', () => {
  it('grows a single principal with zero contributions', () => {
    const r = compoundInterest(1000, 0, 12, 1);
    expect(r.total).toBeCloseTo(1126.83, 2);
    expect(r.contributions).toBe(1000);
    expect(r.interest).toBeCloseTo(126.83, 2);
  });
  it('adds monthly contributions', () => {
    const r = compoundInterest(0, 100, 12, 1);
    expect(r.contributions).toBe(1200);
    expect(r.total).toBeGreaterThan(1200);
    expect(r.total).toBeLessThan(1300);
  });
  it('produces yearly series of length years+1 starting at year 0', () => {
    const r = compoundInterest(1000, 0, 12, 3);
    expect(r.series).toHaveLength(4);
    expect(r.series[0]).toEqual({ year: 0, value: 1000 });
  });
});
```

- [ ] **Step 6: Run test, verify it fails**

Run: `npx vitest run tests/calculators/compound.test.ts`
Expected: FAIL (module not found).

- [ ] **Step 7: Implement `src/lib/calculators/compound.ts`**

```ts
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
```

- [ ] **Step 8: Run test, verify it passes**

Run: `npx vitest run tests/calculators/compound.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 9: Write failing tests for `savingsGoal.ts`**

```ts
// tests/calculators/savingsGoal.test.ts
import { describe, it, expect } from 'vitest';
import { savingsGoal } from '../../src/lib/calculators/savingsGoal';

describe('savingsGoal', () => {
  it('computes months needed for a goal', () => {
    const r = savingsGoal(12000, 0, 1000, 0);
    expect(r.months).toBe(12);
    expect(r.years).toBe(1);
    expect(r.monthly).toBe(1000);
    expect(r.daily).toBeCloseTo(32.86, 2);
  });
  it('returns zeros when target already reached', () => {
    const r = savingsGoal(1000, 2000, 100, 0);
    expect(r.months).toBe(0);
    expect(r.years).toBe(0);
    expect(r.final).toBe(2000);
  });
  it('returns Infinity months when no contribution', () => {
    const r = savingsGoal(1000, 0, 0, 0);
    expect(r.months).toBe(Infinity);
    expect(r.years).toBe(Infinity);
  });
});
```

- [ ] **Step 10: Run test, verify it fails**

Run: `npx vitest run tests/calculators/savingsGoal.test.ts`
Expected: FAIL (module not found).

- [ ] **Step 11: Implement `src/lib/calculators/savingsGoal.ts`**

```ts
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
```

- [ ] **Step 12: Run test, verify it passes**

Run: `npx vitest run tests/calculators/savingsGoal.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 13: Run full test suite**

Run: `npm test`
Expected: PASS (9 tests total).

- [ ] **Step 14: Commit**

```bash
git add src/lib/calculators tests/calculators
git commit -m "feat: add compound interest and savings goal calculator engines (TDD)"
```

---

### Task 3: Calculator engine — retirement, rule of 72, investment return

**Files:**
- Create: `src/lib/calculators/retirement.ts`
- Create: `src/lib/calculators/ruleOf72.ts`
- Create: `src/lib/calculators/investmentReturn.ts`
- Test: `tests/calculators/retirement.test.ts`
- Test: `tests/calculators/ruleOf72.test.ts`
- Test: `tests/calculators/investmentReturn.test.ts`

**Interfaces:**
- Consumes: `compoundInterest` from Task 2.
- Produces:
  - `retirementSavings(currentAge: number, retirementAge: number, currentSavings: number, monthlyContribution: number, annualRatePct: number): { total: number; contributions: number; interest: number; monthlyWithdrawal: number; yearsToGrow: number }`
    - `yearsToGrow = max(0, retirementAge - currentAge)`; `total`/`contributions`/`interest` from `compoundInterest(currentSavings, monthlyContribution, annualRatePct, yearsToGrow)`; `monthlyWithdrawal = total * 0.04 / 12`.
  - `ruleOf72(annualRatePct: number): { years: number; ratePct: number }` — `years = 72 / rate`; rate 0 → `years = Infinity`.
  - `investmentReturn(lumpSum: number, monthlyContribution: number, years: number, annualRatePct: number): { total: number; contributions: number; interest: number; lumpOnly: number; series: { year: number; value: number }[] }`
    - `lumpOnly = lumpSum * Math.pow(1 + annualRatePct / 100 / 12, years * 12)`; `series` from compoundInterest.

- [ ] **Step 1: Write failing tests for `retirement.ts`**

```ts
// tests/calculators/retirement.test.ts
import { describe, it, expect } from 'vitest';
import { retirementSavings } from '../../src/lib/calculators/retirement';

describe('retirementSavings', () => {
  it('computes total and 4% monthly withdrawal', () => {
    const r = retirementSavings(30, 65, 10000, 500, 7);
    expect(r.yearsToGrow).toBe(35);
    expect(r.total).toBeGreaterThan(500000);
    expect(r.contributions).toBe(220000); // 10k + 500*12*35
    expect(r.monthlyWithdrawal).toBeCloseTo(r.total * 0.04 / 12, 2);
  });
  it('handles already-retired age', () => {
    const r = retirementSavings(70, 65, 10000, 500, 7);
    expect(r.yearsToGrow).toBe(0);
    expect(r.total).toBe(10000);
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run tests/calculators/retirement.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement `src/lib/calculators/retirement.ts`**

```ts
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
```

- [ ] **Step 4: Run test, verify it passes**

Run: `npx vitest run tests/calculators/retirement.test.ts`
Expected: PASS.

- [ ] **Step 5: Write failing tests for `ruleOf72.ts`**

```ts
// tests/calculators/ruleOf72.test.ts
import { describe, it, expect } from 'vitest';
import { ruleOf72 } from '../../src/lib/calculators/ruleOf72';

describe('ruleOf72', () => {
  it('computes doubling time for 8%', () => {
    expect(ruleOf72(8).years).toBeCloseTo(9, 1);
  });
  it('returns Infinity for 0%', () => {
    expect(ruleOf72(0).years).toBe(Infinity);
  });
});
```

- [ ] **Step 6: Run test, verify it fails**

Run: `npx vitest run tests/calculators/ruleOf72.test.ts`
Expected: FAIL.

- [ ] **Step 7: Implement `src/lib/calculators/ruleOf72.ts`**

```ts
export interface RuleOf72Result {
  years: number;
  ratePct: number;
}

export function ruleOf72(annualRatePct: number): RuleOf72Result {
  if (annualRatePct === 0) return { years: Infinity, ratePct: 0 };
  return { years: 72 / annualRatePct, ratePct: annualRatePct };
}
```

- [ ] **Step 8: Run test, verify it passes**

Run: `npx vitest run tests/calculators/ruleOf72.test.ts`
Expected: PASS.

- [ ] **Step 9: Write failing tests for `investmentReturn.ts`**

```ts
// tests/calculators/investmentReturn.test.ts
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
```

- [ ] **Step 10: Run test, verify it fails**

Run: `npx vitest run tests/calculators/investmentReturn.test.ts`
Expected: FAIL.

- [ ] **Step 11: Implement `src/lib/calculators/investmentReturn.ts`**

```ts
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
```

- [ ] **Step 12: Run test, verify it passes**

Run: `npx vitest run tests/calculators/investmentReturn.test.ts`
Expected: PASS.

- [ ] **Step 13: Run full suite**

Run: `npm test`
Expected: PASS (15 tests total).

- [ ] **Step 14: Commit**

```bash
git add src/lib/calculators tests/calculators
git commit -m "feat: add retirement, rule of 72, and investment return engines (TDD)"
```

---

### Task 4: Shared calculator UI components + Compound Interest page

**Files:**
- Create: `src/components/ResultPanel.astro`
- Create: `src/components/CoinScatter.ts` (client module: coin-pop confetti on compute)
- Create: `src/components/ShareCard.ts` (canvas share card generator)
- Create: `src/pages/compound-interest-calculator/index.astro`

**Interfaces:**
- Consumes: `formatUSD` (Task 2), `compoundInterest` (Task 2), `BaseLayout` (Task 1), global CSS classes (Task 1).
- Produces: reusable `ResultPanel` (props: `results: Record<string,string>`, slot footer), `CoinScatter` (exports `scatterCoins(container: HTMLElement)`), `ShareCard` (exports `renderShareCard(canvas: HTMLCanvasElement, { title, rows }: { title: string; rows: [string,string][] })`). The compound page is the reference implementation other tool pages copy.

- [ ] **Step 1: Write `src/components/CoinScatter.ts`**

```ts
export function scatterCoins(container: HTMLElement): void {
  container.innerHTML = '';
  for (let i = 0; i < 12; i++) {
    const coin = document.createElement('div');
    coin.className = 'animate-coin-pop';
    coin.style.position = 'absolute';
    coin.style.width = '16px';
    coin.style.height = '16px';
    coin.style.borderRadius = '50%';
    coin.style.background = i % 3 === 0 ? '#F9E29C' : i % 3 === 1 ? '#7BC8A6' : '#A8D8F0';
    coin.style.left = `${8 + Math.random() * 84}%`;
    coin.style.top = `${10 + Math.random() * 60}%`;
    coin.style.animationDelay = `${i * 0.04}s`;
    container.appendChild(coin);
  }
}
```

- [ ] **Step 2: Write `src/components/ShareCard.ts`**

```ts
export function renderShareCard(
  canvas: HTMLCanvasElement,
  data: { title: string; rows: [string, string][] },
): void {
  const ctx = canvas.getContext('2d')!;
  const w = 1080;
  const h = 1080;
  canvas.width = w;
  canvas.height = h;

  ctx.fillStyle = '#FFF9EF';
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = '#7BC8A6';
  ctx.beginPath();
  ctx.arc(150, 150, 90, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#4A3F35';
  ctx.font = 'bold 72px "Baloo 2", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(data.title, w / 2, 220);

  ctx.font = '44px "Nunito", sans-serif';
  let y = 420;
  for (const [label, value] of data.rows) {
    ctx.fillStyle = '#7A6A5C';
    ctx.textAlign = 'left';
    ctx.fillText(label, 120, y);
    ctx.fillStyle = '#4A3F35';
    ctx.textAlign = 'right';
    ctx.fillText(value, w - 120, y);
    y += 110;
  }

  ctx.fillStyle = '#5BA887';
  ctx.font = 'bold 40px "Baloo 2", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('OtterSave — savings, but make it cozy.', w / 2, h - 120);
}
```

- [ ] **Step 3: Write `src/components/ResultPanel.astro`**

```astro
---
interface Props { results: Record<string, string>; }
const { results } = Astro.props;
const entries = Object.entries(results);
---

<div class="card mt-6 relative overflow-hidden" aria-live="polite">
  <div id="coin-scatter" class="absolute inset-0 pointer-events-none"></div>
  <h2 class="font-display text-2xl font-800 text-coco mb-4">Your cozy results</h2>
  <dl class="space-y-3">
    {entries.map(([label, value]) => (
      <div class="flex items-center justify-between border-b border-mint/20 pb-2">
        <dt class="text-coco-light font-bold">{label}</dt>
        <dd class="font-display text-xl font-800 text-mint-dark">{value}</dd>
      </div>
    ))}
  </dl>
  <div class="mt-4">
    <canvas id="share-canvas" width="1080" height="1080" class="hidden"></canvas>
    <button type="button" id="share-btn" class="btn bg-sky text-coco">Share this</button>
  </div>
</div>

<script>
  import { scatterCoins } from './CoinScatter';
  import { renderShareCard } from './ShareCard';

  const panel = document.currentScript?.closest('.card') as HTMLElement | null;
  if (panel) scatterCoins(panel.querySelector('#coin-scatter') as HTMLElement);

  const shareBtn = document.getElementById('share-btn') as HTMLButtonElement | null;
  const canvas = document.getElementById('share-canvas') as HTMLCanvasElement | null;
  if (shareBtn && canvas) {
    shareBtn.addEventListener('click', () => {
      const rows: [string, string][] = [];
      panel?.querySelectorAll('dt, dd').forEach((el, i) => {
        const isDt = i % 2 === 0;
        if (isDt) rows.push([el.textContent?.trim() ?? '', '']);
        else rows[rows.length - 1][1] = el.textContent?.trim() ?? '';
      });
      renderShareCard(canvas, { title: 'My savings', rows });
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ottersave-share.png';
        a.click();
        URL.revokeObjectURL(url);
      });
    });
  }
</script>
```

- [ ] **Step 4: Write `src/pages/compound-interest-calculator/index.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import ResultPanel from '../../components/ResultPanel.astro';
import { compoundInterest } from '../../lib/calculators/compound';
import { formatUSD } from '../../lib/calculators/money';

const faq = [
  { q: 'How does compound interest work?', a: 'Compound interest means you earn interest on your interest. Each month, interest is added to your balance, and the next month you earn interest on the larger amount.' },
  { q: 'How often is interest compounded here?', a: 'This calculator compounds monthly, which is the standard for savings accounts and most investment projections.' },
  { q: 'Is the 7% rate realistic?', a: '7% is a common long-term average for diversified stock market returns, but past performance never guarantees future results.' },
  { q: 'Can I include monthly contributions?', a: 'Yes. Enter a monthly contribution to see how regular saving dramatically boosts your final amount.' },
  { q: 'What is the formula used?', a: 'FV = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) − 1) / (r/n)], with monthly compounding (n = 12).' },
];
const faqJsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});
---
<BaseLayout
  title="Compound Interest Calculator — OtterSave"
  description="Free compound interest calculator with monthly contributions. See your money grow over time with a chart, the cozy way."
  faqJsonLd={faqJsonLd}
>
  <h1 class="font-display text-4xl font-800 text-coco">Compound Interest Calculator</h1>
  <p class="text-coco-light mt-2 text-lg">Watch your savings grow — like Ollie collecting pebbles, one month at a time.</p>

  <form id="compound-form" class="card mt-6 grid gap-4 md:grid-cols-2">
    <div>
      <label class="label" for="principal">Initial amount ($)</label>
      <input class="input" id="principal" type="number" min="0" step="100" value="1000" required />
    </div>
    <div>
      <label class="label" for="monthly">Monthly contribution ($)</label>
      <input class="input" id="monthly" type="number" min="0" step="50" value="200" />
    </div>
    <div>
      <label class="label" for="rate">Annual interest rate (%)</label>
      <input class="input" id="rate" type="number" min="0" max="30" step="0.1" value="7" />
    </div>
    <div>
      <label class="label" for="years">Years</label>
      <input class="input" id="years" type="number" min="1" max="60" step="1" value="20" />
    </div>
    <div class="md:col-span-2">
      <button class="btn w-full" type="submit">Calculate</button>
    </div>
  </form>

  <div id="chart-box" class="mt-6 hidden">
    <canvas id="growth-chart" class="w-full max-h-72"></canvas>
  </div>

  <div id="results" class="hidden">
    <ResultPanel
      results={{
        'Final balance': '',
        'Total contributions': '',
        'Interest earned': '',
        'Years': '',
      }}
    />
  </div>

  <section class="mt-10">
    <h2 class="font-display text-2xl font-800 text-coco">Compound interest FAQ</h2>
    {faq.map(f => (
      <div class="card mt-4">
        <h3 class="font-display font-bold text-coco text-lg">{f.q}</h3>
        <p class="text-coco-light mt-1">{f.a}</p>
      </div>
    ))}
  </section>

  <nav class="mt-10">
    <h2 class="font-display text-2xl font-800 text-coco mb-2">More cozy calculators</h2>
    <div class="flex flex-wrap gap-2">
      <a class="btn bg-sky text-coco" href="/retirement-savings-calculator/">Retirement</a>
      <a class="btn bg-butter text-coco" href="/savings-goal-calculator/">Savings Goal</a>
      <a class="btn bg-coral text-coco" href="/rule-of-72-calculator/">Rule of 72</a>
      <a class="btn bg-mint" href="/investment-return-calculator/">Investment Return</a>
    </div>
  </nav>

  <div class="mt-10 text-center text-coco-light text-sm">
    <span>Advertisement placeholder</span>
  </div>

  <script>
    import { compoundInterest } from '../../lib/calculators/compound';
    import { formatUSD } from '../../lib/calculators/money';
    import { Chart } from 'chart.js/auto';

    const form = document.getElementById('compound-form') as HTMLFormElement;
    const resultsBox = document.getElementById('results') as HTMLElement;
    const chartBox = document.getElementById('chart-box') as HTMLElement;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const principal = Number((document.getElementById('principal') as HTMLInputElement).value) || 0;
      const monthly = Number((document.getElementById('monthly') as HTMLInputElement).value) || 0;
      const rate = Number((document.getElementById('rate') as HTMLInputElement).value) || 0;
      const years = Number((document.getElementById('years') as HTMLInputElement).value) || 1;

      const r = compoundInterest(principal, monthly, rate, years);

      const dts = resultsBox.querySelectorAll('dt');
      const dds = resultsBox.querySelectorAll('dd');
      const values = [formatUSD(r.total), formatUSD(r.contributions), formatUSD(r.interest), `${years} years`];
      dts.forEach((dt, i) => { (dt as HTMLElement).textContent = ['Final balance', 'Total contributions', 'Interest earned', 'Years'][i]; });
      dds.forEach((dd, i) => { (dd as HTMLElement).textContent = values[i]; });
      resultsBox.classList.remove('hidden');

      chartBox.classList.remove('hidden');
      const canvas = document.getElementById('growth-chart') as HTMLCanvasElement;
      new Chart(canvas, {
        type: 'line',
        data: {
          labels: r.series.map(s => `Y${s.year}`),
          datasets: [{
            label: 'Balance ($)',
            data: r.series.map(s => Math.round(s.value)),
            borderColor: '#7BC8A6',
            backgroundColor: 'rgba(123, 200, 166, 0.15)',
            fill: true,
            tension: 0.4,
          }],
        },
        options: { plugins: { legend: { display: false } }, scales: { y: { ticks: { callback: (v: string | number) => formatUSD(Number(v)) } } } },
      });
    });
  </script>
</BaseLayout>
```

> Note: The inline `<script>` in Astro bundles with the page; `chart.js/auto` is a Chart.js convenience import. The ResultPanel's own script handles coin scatter + share card; the page script updates its `dt`/`dd` text. Because Astro compiles scripts, `document.getElementById` casts are valid TS.

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: `dist/compound-interest-calculator/index.html` exists, build succeeds.

- [ ] **Step 6: Manual smoke test**

Run: `npm run preview` (or `npm run dev`), open the compound page, enter values, click Calculate.
Expected: results panel appears with coin animation; "Final balance" for 1000/200/7%/20y ≈ $104,000+; chart renders; Share button downloads a PNG.

- [ ] **Step 7: Commit**

```bash
git add src/components src/pages/compound-interest-calculator
git commit -m "feat: add compound interest calculator page with cozy UI"
```

---

### Task 5: Retirement + Savings Goal pages

**Files:**
- Create: `src/pages/retirement-savings-calculator/index.astro`
- Create: `src/pages/savings-goal-calculator/index.astro`

**Interfaces:**
- Consumes: `retirementSavings` (Task 3), `savingsGoal` (Task 2), `formatUSD` (Task 2), `ResultPanel` (Task 4).
- Produces: two more tool pages following the Task 4 reference pattern.

- [ ] **Step 1: Write `src/pages/retirement-savings-calculator/index.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import ResultPanel from '../../components/ResultPanel.astro';
import { retirementSavings } from '../../lib/calculators/retirement';
import { formatUSD } from '../../lib/calculators/money';

const faq = [
  { q: 'What is the 4% rule?', a: 'The 4% rule says you can withdraw 4% of your savings each year in retirement with low risk of running out over 30 years.' },
  { q: 'How much do I need to retire?', a: 'A common target is 25x your annual expenses. This calculator shows your projected total and monthly withdrawal at retirement.' },
  { q: 'What return should I assume?', a: '7% is a common long-term average for a diversified portfolio, but returns vary and past performance is no guarantee.' },
  { q: 'Does this include Social Security?', a: 'No. This calculator only projects your personal savings; Social Security is separate.' },
];
const faqJsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});
---
<BaseLayout
  title="Retirement Savings Calculator — OtterSave"
  description="Free retirement savings calculator with the 4% rule. Project your balance at retirement and monthly income, the cozy way."
  faqJsonLd={faqJsonLd}
>
  <h1 class="font-display text-4xl font-800 text-coco">Retirement Savings Calculator</h1>
  <p class="text-coco-light mt-2 text-lg">Picture future-you, floating on a raft of savings.</p>

  <form id="ret-form" class="card mt-6 grid gap-4 md:grid-cols-2">
    <div><label class="label" for="age">Current age</label><input class="input" id="age" type="number" min="18" max="90" value="30" /></div>
    <div><label class="label" for="ret-age">Retirement age</label><input class="input" id="ret-age" type="number" min="30" max="90" value="65" /></div>
    <div><label class="label" for="savings">Current savings ($)</label><input class="input" id="savings" type="number" min="0" step="1000" value="10000" /></div>
    <div><label class="label" for="monthly">Monthly contribution ($)</label><input class="input" id="monthly" type="number" min="0" step="50" value="500" /></div>
    <div><label class="label" for="rate">Annual return (%)</label><input class="input" id="rate" type="number" min="0" max="30" step="0.1" value="7" /></div>
    <div class="md:col-span-2"><button class="btn w-full" type="submit">Calculate</button></div>
  </form>

  <div id="results" class="hidden">
    <ResultPanel results={{ 'Projected total': '', 'Monthly income (4%)': '', 'Total contributed': '', 'Interest earned': '' }} />
  </div>

  <section class="mt-10">
    <h2 class="font-display text-2xl font-800 text-coco">Retirement savings FAQ</h2>
    {faq.map(f => (
      <div class="card mt-4"><h3 class="font-display font-bold text-coco text-lg">{f.q}</h3><p class="text-coco-light mt-1">{f.a}</p></div>
    ))}
  </section>

  <nav class="mt-10">
    <h2 class="font-display text-2xl font-800 text-coco mb-2">More cozy calculators</h2>
    <div class="flex flex-wrap gap-2">
      <a class="btn bg-sky text-coco" href="/compound-interest-calculator/">Compound Interest</a>
      <a class="btn bg-butter text-coco" href="/savings-goal-calculator/">Savings Goal</a>
      <a class="btn bg-coral text-coco" href="/rule-of-72-calculator/">Rule of 72</a>
      <a class="btn bg-mint" href="/investment-return-calculator/">Investment Return</a>
    </div>
  </nav>

  <div class="mt-10 text-center text-coco-light text-sm"><span>Advertisement placeholder</span></div>

  <script>
    import { retirementSavings } from '../../lib/calculators/retirement';
    import { formatUSD } from '../../lib/calculators/money';

    document.getElementById('ret-form')!.addEventListener('submit', (e) => {
      e.preventDefault();
      const age = Number((document.getElementById('age') as HTMLInputElement).value) || 0;
      const retAge = Number((document.getElementById('ret-age') as HTMLInputElement).value) || 65;
      const savings = Number((document.getElementById('savings') as HTMLInputElement).value) || 0;
      const monthly = Number((document.getElementById('monthly') as HTMLInputElement).value) || 0;
      const rate = Number((document.getElementById('rate') as HTMLInputElement).value) || 0;
      const r = retirementSavings(age, retAge, savings, monthly, rate);
      const box = document.getElementById('results') as HTMLElement;
      const dts = box.querySelectorAll('dt');
      const dds = box.querySelectorAll('dd');
      dts.forEach((dt, i) => { (dt as HTMLElement).textContent = ['Projected total', 'Monthly income (4%)', 'Total contributed', 'Interest earned'][i]; });
      dds.forEach((dd, i) => { (dd as HTMLElement).textContent = [formatUSD(r.total), formatUSD(r.monthlyWithdrawal), formatUSD(r.contributions), formatUSD(r.interest)][i]; });
      box.classList.remove('hidden');
    });
  </script>
</BaseLayout>
```

- [ ] **Step 2: Write `src/pages/savings-goal-calculator/index.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import ResultPanel from '../../components/ResultPanel.astro';
import { savingsGoal } from '../../lib/calculators/savingsGoal';
import { formatUSD } from '../../lib/calculators/money';

const faq = [
  { q: 'How does the daily amount work?', a: 'We divide your monthly contribution by the average days per month (30.44) to show how small daily steps add up.' },
  { q: 'What if I already reached my goal?', a: 'The calculator shows zero months needed — time to celebrate like Ollie with a shiny new pebble!' },
  { q: 'Do contributions earn interest here?', a: 'Yes. Enter an annual return and your balance grows with monthly compounding.' },
];
const faqJsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});
---
<BaseLayout
  title="Savings Goal Calculator — OtterSave"
  description="Free savings goal calculator: how long until you reach your target, how much to save daily or monthly."
  faqJsonLd={faqJsonLd}
>
  <h1 class="font-display text-4xl font-800 text-coco">Savings Goal Calculator</h1>
  <p class="text-coco-light mt-2 text-lg">Big dreams, tiny steps. Ollie approves.</p>

  <form id="goal-form" class="card mt-6 grid gap-4 md:grid-cols-2">
    <div><label class="label" for="target">Target amount ($)</label><input class="input" id="target" type="number" min="1" value="50000" /></div>
    <div><label class="label" for="current">Already saved ($)</label><input class="input" id="current" type="number" min="0" value="5000" /></div>
    <div><label class="label" for="monthly">Monthly contribution ($)</label><input class="input" id="monthly" type="number" min="0" value="500" /></div>
    <div><label class="label" for="rate">Annual return (%)</label><input class="input" id="rate" type="number" min="0" max="30" step="0.1" value="5" /></div>
    <div class="md:col-span-2"><button class="btn w-full" type="submit">Calculate</button></div>
  </form>

  <div id="results" class="hidden">
    <ResultPanel results={{ 'Time to goal': '', 'Years': '', 'Daily amount': '', 'Monthly amount': '' }} />
  </div>

  <section class="mt-10">
    <h2 class="font-display text-2xl font-800 text-coco">Savings goal FAQ</h2>
    {faq.map(f => (
      <div class="card mt-4"><h3 class="font-display font-bold text-coco text-lg">{f.q}</h3><p class="text-coco-light mt-1">{f.a}</p></div>
    ))}
  </section>

  <nav class="mt-10">
    <h2 class="font-display text-2xl font-800 text-coco mb-2">More cozy calculators</h2>
    <div class="flex flex-wrap gap-2">
      <a class="btn bg-sky text-coco" href="/compound-interest-calculator/">Compound Interest</a>
      <a class="btn bg-mint" href="/retirement-savings-calculator/">Retirement</a>
      <a class="btn bg-coral text-coco" href="/rule-of-72-calculator/">Rule of 72</a>
      <a class="btn bg-butter text-coco" href="/investment-return-calculator/">Investment Return</a>
    </div>
  </nav>

  <div class="mt-10 text-center text-coco-light text-sm"><span>Advertisement placeholder</span></div>

  <script>
    import { savingsGoal } from '../../lib/calculators/savingsGoal';
    import { formatUSD } from '../../lib/calculators/money';

    document.getElementById('goal-form')!.addEventListener('submit', (e) => {
      e.preventDefault();
      const target = Number((document.getElementById('target') as HTMLInputElement).value) || 0;
      const current = Number((document.getElementById('current') as HTMLInputElement).value) || 0;
      const monthly = Number((document.getElementById('monthly') as HTMLInputElement).value) || 0;
      const rate = Number((document.getElementById('rate') as HTMLInputElement).value) || 0;
      const r = savingsGoal(target, current, monthly, rate);
      const box = document.getElementById('results') as HTMLElement;
      const dts = box.querySelectorAll('dt');
      const dds = box.querySelectorAll('dd');
      const time = Number.isFinite(r.months) ? (r.months < 12 ? `${r.months} months` : `${(r.months / 12).toFixed(1)} years`) : 'Keep going!';
      const years = Number.isFinite(r.years) ? String(r.years) : '—';
      dts.forEach((dt, i) => { (dt as HTMLElement).textContent = ['Time to goal', 'Years', 'Daily amount', 'Monthly amount'][i]; });
      dds.forEach((dd, i) => { (dd as HTMLElement).textContent = [time, years, formatUSD(r.daily), formatUSD(r.monthly)][i]; });
      box.classList.remove('hidden');
    });
  </script>
</BaseLayout>
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: both page dirs exist in `dist/`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/retirement-savings-calculator src/pages/savings-goal-calculator
git commit -m "feat: add retirement and savings goal calculator pages"
```

---

### Task 6: Rule of 72 + Investment Return pages

**Files:**
- Create: `src/pages/rule-of-72-calculator/index.astro`
- Create: `src/pages/investment-return-calculator/index.astro`

**Interfaces:**
- Consumes: `ruleOf72` (Task 3), `investmentReturn` (Task 3), `formatUSD` (Task 2), `ResultPanel` (Task 4).

- [ ] **Step 1: Write `src/pages/rule-of-72-calculator/index.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import ResultPanel from '../../components/ResultPanel.astro';
import { ruleOf72 } from '../../lib/calculators/ruleOf72';

const faq = [
  { q: 'What is the Rule of 72?', a: 'It is a quick mental shortcut: divide 72 by your annual return to estimate how many years it takes your money to double.' },
  { q: 'Is the Rule of 72 exact?', a: 'It is a close approximation, most accurate for returns between 6% and 10%. For exact numbers use the compound interest calculator.' },
];
const faqJsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});
---
<BaseLayout
  title="Rule of 72 Calculator — OtterSave"
  description="Free Rule of 72 calculator: how many years until your money doubles at a given return rate."
  faqJsonLd={faqJsonLd}
>
  <h1 class="font-display text-4xl font-800 text-coco">Rule of 72 Calculator</h1>
  <p class="text-coco-light mt-2 text-lg">How long until your money doubles? Ollie counts pebbles while you wait.</p>

  <form id="r72-form" class="card mt-6 grid gap-4">
    <div><label class="label" for="rate">Annual return (%)</label><input class="input" id="rate" type="number" min="0.1" max="30" step="0.1" value="8" /></div>
    <div><button class="btn w-full" type="submit">Calculate</button></div>
  </form>

  <div id="results" class="hidden">
    <ResultPanel results={{ 'Years to double': '', 'Rate': '' }} />
  </div>

  <section class="mt-10">
    <h2 class="font-display text-2xl font-800 text-coco">Rule of 72 FAQ</h2>
    {faq.map(f => (
      <div class="card mt-4"><h3 class="font-display font-bold text-coco text-lg">{f.q}</h3><p class="text-coco-light mt-1">{f.a}</p></div>
    ))}
  </section>

  <nav class="mt-10">
    <h2 class="font-display text-2xl font-800 text-coco mb-2">More cozy calculators</h2>
    <div class="flex flex-wrap gap-2">
      <a class="btn bg-sky text-coco" href="/compound-interest-calculator/">Compound Interest</a>
      <a class="btn bg-mint" href="/retirement-savings-calculator/">Retirement</a>
      <a class="btn bg-butter text-coco" href="/savings-goal-calculator/">Savings Goal</a>
      <a class="btn bg-coral text-coco" href="/investment-return-calculator/">Investment Return</a>
    </div>
  </nav>

  <div class="mt-10 text-center text-coco-light text-sm"><span>Advertisement placeholder</span></div>

  <script>
    import { ruleOf72 } from '../../lib/calculators/ruleOf72';

    document.getElementById('r72-form')!.addEventListener('submit', (e) => {
      e.preventDefault();
      const rate = Number((document.getElementById('rate') as HTMLInputElement).value) || 0;
      const r = ruleOf72(rate);
      const box = document.getElementById('results') as HTMLElement;
      const dts = box.querySelectorAll('dt');
      const dds = box.querySelectorAll('dd');
      const years = Number.isFinite(r.years) ? `${r.years.toFixed(1)} years` : '∞';
      dts.forEach((dt, i) => { (dt as HTMLElement).textContent = ['Years to double', 'Rate'][i]; });
      dds.forEach((dd, i) => { (dd as HTMLElement).textContent = [years, `${rate}%`][i]; });
      box.classList.remove('hidden');
    });
  </script>
</BaseLayout>
```

- [ ] **Step 2: Write `src/pages/investment-return-calculator/index.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import ResultPanel from '../../components/ResultPanel.astro';
import { investmentReturn } from '../../lib/calculators/investmentReturn';
import { formatUSD } from '../../lib/calculators/money';

const faq = [
  { q: 'What is the difference between lump sum and monthly investing?', a: 'A lump sum starts working immediately; monthly investing (dollar-cost averaging) spreads risk. Both can work well.' },
  { q: 'Does this account for inflation?', a: 'No. Returns are nominal; subtract expected inflation (~2-3%) for a rough real return.' },
];
const faqJsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});
---
<BaseLayout
  title="Investment Return Calculator — OtterSave"
  description="Free investment return calculator: compare lump sum vs monthly investing with compound growth chart."
  faqJsonLd={faqJsonLd}
>
  <h1 class="font-display text-4xl font-800 text-coco">Investment Return Calculator</h1>
  <p class="text-coco-light mt-2 text-lg">Lump sum or steady pebbles? See which path grows your pile.</p>

  <form id="inv-form" class="card mt-6 grid gap-4 md:grid-cols-2">
    <div><label class="label" for="lump">Initial investment ($)</label><input class="input" id="lump" type="number" min="0" step="100" value="10000" /></div>
    <div><label class="label" for="monthly">Monthly contribution ($)</label><input class="input" id="monthly" type="number" min="0" step="50" value="500" /></div>
    <div><label class="label" for="years">Years</label><input class="input" id="years" type="number" min="1" max="60" value="10" /></div>
    <div><label class="label" for="rate">Annual return (%)</label><input class="input" id="rate" type="number" min="0" max="30" step="0.1" value="7" /></div>
    <div class="md:col-span-2"><button class="btn w-full" type="submit">Calculate</button></div>
  </form>

  <div id="chart-box" class="mt-6 hidden"><canvas id="inv-chart" class="w-full max-h-72"></canvas></div>

  <div id="results" class="hidden">
    <ResultPanel results={{ 'Final value': '', 'Total invested': '', 'Investment gain': '', 'Lump sum alone': '' }} />
  </div>

  <section class="mt-10">
    <h2 class="font-display text-2xl font-800 text-coco">Investment return FAQ</h2>
    {faq.map(f => (
      <div class="card mt-4"><h3 class="font-display font-bold text-coco text-lg">{f.q}</h3><p class="text-coco-light mt-1">{f.a}</p></div>
    ))}
  </section>

  <nav class="mt-10">
    <h2 class="font-display text-2xl font-800 text-coco mb-2">More cozy calculators</h2>
    <div class="flex flex-wrap gap-2">
      <a class="btn bg-sky text-coco" href="/compound-interest-calculator/">Compound Interest</a>
      <a class="btn bg-mint" href="/retirement-savings-calculator/">Retirement</a>
      <a class="btn bg-butter text-coco" href="/savings-goal-calculator/">Savings Goal</a>
      <a class="btn bg-coral text-coco" href="/rule-of-72-calculator/">Rule of 72</a>
    </div>
  </nav>

  <div class="mt-10 text-center text-coco-light text-sm"><span>Advertisement placeholder</span></div>

  <script>
    import { investmentReturn } from '../../lib/calculators/investmentReturn';
    import { formatUSD } from '../../lib/calculators/money';
    import { Chart } from 'chart.js/auto';

    document.getElementById('inv-form')!.addEventListener('submit', (e) => {
      e.preventDefault();
      const lump = Number((document.getElementById('lump') as HTMLInputElement).value) || 0;
      const monthly = Number((document.getElementById('monthly') as HTMLInputElement).value) || 0;
      const years = Number((document.getElementById('years') as HTMLInputElement).value) || 1;
      const rate = Number((document.getElementById('rate') as HTMLInputElement).value) || 0;
      const r = investmentReturn(lump, monthly, years, rate);

      const box = document.getElementById('results') as HTMLElement;
      const dts = box.querySelectorAll('dt');
      const dds = box.querySelectorAll('dd');
      dts.forEach((dt, i) => { (dt as HTMLElement).textContent = ['Final value', 'Total invested', 'Investment gain', 'Lump sum alone'][i]; });
      dds.forEach((dd, i) => { (dd as HTMLElement).textContent = [formatUSD(r.total), formatUSD(r.contributions), formatUSD(r.interest), formatUSD(r.lumpOnly)][i]; });
      box.classList.remove('hidden');

      const chartBox = document.getElementById('chart-box') as HTMLElement;
      chartBox.classList.remove('hidden');
      new Chart(document.getElementById('inv-chart') as HTMLCanvasElement, {
        type: 'line',
        data: {
          labels: r.series.map(s => `Y${s.year}`),
          datasets: [{ label: 'Balance ($)', data: r.series.map(s => Math.round(s.value)), borderColor: '#A8D8F0', backgroundColor: 'rgba(168,216,240,0.15)', fill: true, tension: 0.4 }],
        },
        options: { plugins: { legend: { display: false } }, scales: { y: { ticks: { callback: (v: string | number) => formatUSD(Number(v)) } } } },
      });
    });
  </script>
</BaseLayout>
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: both page dirs exist in `dist/`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/rule-of-72-calculator src/pages/investment-return-calculator
git commit -m "feat: add rule of 72 and investment return calculator pages"
```

---

### Task 7: Homepage, About, Privacy, Contact pages

**Files:**
- Modify: `src/pages/index.astro` (replace skeleton)
- Create: `src/pages/about/index.astro`
- Create: `src/pages/contact/index.astro`
- Create: `src/pages/privacy-policy/index.astro`

**Interfaces:**
- Consumes: `BaseLayout` (Task 1), `OtterLogo` (Task 1).

- [ ] **Step 1: Rewrite `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import OtterLogo from '../components/OtterLogo.astro';

const tools = [
  { href: '/compound-interest-calculator/', title: 'Compound Interest', desc: 'See your savings snowball over time.', emoji: '🌱', color: 'bg-mint' },
  { href: '/retirement-savings-calculator/', title: 'Retirement Savings', desc: 'Project your nest egg and 4% income.', emoji: '🦦', color: 'bg-sky' },
  { href: '/savings-goal-calculator/', title: 'Savings Goal', desc: 'How long until you reach your target?', emoji: '🎯', color: 'bg-butter' },
  { href: '/rule-of-72-calculator/', title: 'Rule of 72', desc: 'When will your money double?', emoji: '✨', color: 'bg-coral' },
  { href: '/investment-return-calculator/', title: 'Investment Return', desc: 'Lump sum vs steady contributions.', emoji: '📈', color: 'bg-mint' },
];
---
<BaseLayout
  title="OtterSave — Cozy Savings Calculators"
  description="Friendly compound interest, retirement, and savings goal calculators. Watch your money grow the cozy way."
>
  <section class="text-center pt-10 pb-8">
    <div class="animate-float inline-block"><OtterLogo size={120} /></div>
    <h1 class="font-display text-5xl font-800 text-coco mt-4">Savings, but make it cozy.</h1>
    <p class="text-coco-light text-xl mt-3 max-w-xl mx-auto">Meet Ollie the Otter. He collects pebbles; you collect savings. Our calculators make money feel like a game — simple, warm, and a little bit adorable.</p>
  </section>

  <section class="grid gap-4 md:grid-cols-2 mt-6">
    {tools.map(t => (
      <a href={t.href} class="card hover:scale-[1.02] transition-transform block">
        <div class={`inline-flex w-12 h-12 items-center justify-center rounded-2xl ${t.color} text-2xl`}>{t.emoji}</div>
        <h2 class="font-display text-2xl font-800 text-coco mt-3">{t.title}</h2>
        <p class="text-coco-light mt-1">{t.desc}</p>
        <span class="inline-block mt-3 font-bold text-mint-dark">Try it →</span>
      </a>
    ))}
  </section>
</BaseLayout>
```

- [ ] **Step 2: Write `src/pages/about/index.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
---
<BaseLayout
  title="About — OtterSave"
  description="About OtterSave: cozy, accurate savings calculators for everyone."
>
  <h1 class="font-display text-4xl font-800 text-coco">About OtterSave</h1>
  <div class="card mt-6 space-y-4 text-coco-light">
    <p>OtterSave makes money feel approachable. We build free, accurate savings calculators with a cozy, playful style.</p>
    <p>Our mascot, Ollie the Otter, collects favorite pebbles the way you collect savings — one small, satisfying piece at a time.</p>
    <p>All calculations run in your browser. Nothing is stored, and we never ask for personal financial data.</p>
  </div>
</BaseLayout>
```

- [ ] **Step 3: Write `src/pages/contact/index.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
---
<BaseLayout
  title="Contact — OtterSave"
  description="Contact OtterSave — we read every message."
>
  <h1 class="font-display text-4xl font-800 text-coco">Contact</h1>
  <div class="card mt-6">
    <p class="text-coco-light">Questions, feedback, or spotted a bug? Email us:</p>
    <p class="font-display text-xl font-800 text-coco mt-2">hello@ottersave.com</p>
  </div>
</BaseLayout>
```

- [ ] **Step 4: Write `src/pages/privacy-policy/index.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
---
<BaseLayout
  title="Privacy Policy — OtterSave"
  description="OtterSave privacy policy — we collect almost nothing."
>
  <h1 class="font-display text-4xl font-800 text-coco">Privacy Policy</h1>
  <div class="card mt-6 space-y-4 text-coco-light">
    <p>OtterSave is a static website. All calculations happen locally in your browser — we never see or store your numbers.</p>
    <p>We use Cloudflare (our hosting/CDN provider) which may process standard server logs (IP, user agent) for security and performance.</p>
    <p>We do not use cookies for tracking today. If we later add advertising or analytics, this policy will be updated and this page will clearly state what is collected.</p>
    <p>Contact: hello@ottersave.com</p>
  </div>
</BaseLayout>
```

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: `dist/about/`, `dist/contact/`, `dist/privacy-policy/` exist; sitemap includes all 8 pages.

- [ ] **Step 6: Commit**

```bash
git add src/pages/index.astro src/pages/about src/pages/contact src/pages/privacy-policy
git commit -m "feat: add homepage, about, contact, privacy pages"
```

---

### Task 8: Final verification

**Files:** none modified.

- [ ] **Step 1: Run full test suite**

Run: `npm test`
Expected: PASS (15 tests).

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: success, 8+ pages in `dist/`, `sitemap-0.xml` lists all tool pages.

- [ ] **Step 3: Verify sitemap content**

Run: `cat dist/sitemap-0.xml`
Expected: URLs for all 5 tools + about + contact + privacy.

- [ ] **Step 4: Preview smoke test**

Run: `npm run preview`, open homepage + each tool page.
Expected: pages render, calculators compute, share card downloads.

- [ ] **Step 5: AdSense-readiness checklist**

Verify in code: privacy policy page exists, contact page exists, about page exists, no placeholder lorem text anywhere, each tool has FAQ + JSON-LD.
Expected: all pass.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "chore: final verification for OtterSave MVP"
```

---
