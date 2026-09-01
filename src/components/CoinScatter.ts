export function scatterCoins(container: HTMLElement): void {
  container.innerHTML = '';
  const colors = ['#F9E29C', '#7BC8A6', '#A8D8F0'];
  for (let i = 0; i < 12; i++) {
    const coin = document.createElement('div');
    coin.className = 'animate-coin-pop';
    coin.style.position = 'absolute';
    coin.style.width = '16px';
    coin.style.height = '16px';
    coin.style.borderRadius = '50%';
    coin.style.background = colors[i % 3];
    // Full-area scatter as designed; the pop-fade animation removes them from
    // view shortly after, so they never permanently cover the text on phones.
    coin.style.left = `${8 + Math.random() * 84}%`;
    coin.style.top = `${10 + Math.random() * 60}%`;
    coin.style.animationDelay = `${i * 0.04}s`;
    container.appendChild(coin);
  }
}
