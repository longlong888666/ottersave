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
