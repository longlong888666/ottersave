export interface RuleOf72Result {
  years: number;
  ratePct: number;
}

export function ruleOf72(annualRatePct: number): RuleOf72Result {
  if (annualRatePct === 0) return { years: Infinity, ratePct: 0 };
  return { years: 72 / annualRatePct, ratePct: annualRatePct };
}
