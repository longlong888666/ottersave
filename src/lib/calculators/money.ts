export function formatUSD(n: number): string {
  const sign = n < 0 ? '-' : '';
  const abs = Math.abs(n);
  const rounded = Math.round(abs * 100) / 100;
  const [intPart, decPart = '00'] = rounded.toFixed(2).split('.');
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${sign}$${withCommas}.${decPart}`;
}
