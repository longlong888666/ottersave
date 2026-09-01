// OtterSave share card renderer — cozy game-like 1080x1080 card.
// Palette (brand): cream #FFF4DF, mint #7BAE5B, mint-dark #5B8C46,
// sky #A6D8F0, butter #F7D774, coral #F5AFA4, coco #4A3620, coco-light #7A6248.

const W = 1080;
const H = 1080;
const MASCOT = '/img/otter-logo-256.png';

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawCoin(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
): void {
  ctx.save();
  ctx.shadowColor = 'rgba(74,54,32,0.15)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;
  ctx.fillStyle = '#F7D774';
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle = '#E4B94F';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#D9A83A';
  ctx.font = 'bold 26px "Nunito", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('$', x, y + 2);
  ctx.textBaseline = 'alphabetic';
}

function drawSparkle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  s: number,
): void {
  ctx.save();
  ctx.strokeStyle = '#7BAE5B';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.translate(x, y);
  for (let i = 0; i < 4; i++) {
    ctx.rotate(Math.PI / 4);
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.lineTo(0, s);
    ctx.stroke();
  }
  ctx.restore();
}

export function renderShareCard(
  canvas: HTMLCanvasElement,
  data: { title: string; rows: [string, string][] },
  onReady?: () => void,
): void {
  const ctx = canvas.getContext('2d')!;
  canvas.width = W;
  canvas.height = H;

  // ---- background ----
  ctx.fillStyle = '#FFF4DF';
  ctx.fillRect(0, 0, W, H);

  // soft decorative blobs
  ctx.fillStyle = 'rgba(166,216,240,0.25)';
  ctx.beginPath();
  ctx.arc(940, 120, 200, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(245,175,164,0.22)';
  ctx.beginPath();
  ctx.arc(120, 980, 170, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(123,174,91,0.14)';
  ctx.beginPath();
  ctx.arc(1000, 900, 120, 0, Math.PI * 2);
  ctx.fill();

  // scattered coins + sparkles
  drawCoin(ctx, 210, 300, 34);
  drawCoin(ctx, 880, 260, 28);
  drawCoin(ctx, 150, 620, 26);
  drawCoin(ctx, 930, 660, 32);
  drawCoin(ctx, 520, 880, 26);
  drawSparkle(ctx, 860, 340, 22);
  drawSparkle(ctx, 200, 440, 18);
  drawSparkle(ctx, 1000, 520, 20);

  // ---- header: mascot avatar + title ----
  // white ring behind avatar
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(170, 170, 104, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#7BAE5B';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(170, 170, 104, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#4A3620';
  ctx.font = '800 78px "Fredoka", "Baloo 2", "Nunito", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(data.title, 320, 130);

  ctx.fillStyle = '#8A7458';
  ctx.font = '500 34px "Nunito", sans-serif';
  ctx.fillText('savings, but make it cozy.', 324, 196);
  ctx.textBaseline = 'alphabetic';

  // ---- data card ----
  const cardX = 110;
  const cardW = W - 220;
  const cardY = 400;
  const rowGap = 108;
  const cardH = Math.max(300, data.rows.length * rowGap + 110);

  ctx.save();
  ctx.shadowColor = 'rgba(74,54,32,0.10)';
  ctx.shadowBlur = 28;
  ctx.shadowOffsetY = 10;
  ctx.fillStyle = '#FFFFFF';
  roundRect(ctx, cardX, cardY, cardW, cardH, 44);
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle = 'rgba(123,174,91,0.35)';
  ctx.lineWidth = 4;
  roundRect(ctx, cardX, cardY, cardW, cardH, 44);
  ctx.stroke();

  data.rows.forEach(([label, value], i) => {
    const y = cardY + 96 + i * rowGap;
    ctx.fillStyle = '#7A6248';
    ctx.font = '600 40px "Nunito", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(label, cardX + 64, y);

    ctx.fillStyle = '#4A3620';
    ctx.font = '800 52px "Fredoka", "Baloo 2", "Nunito", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(value, cardX + cardW - 64, y);

    if (i < data.rows.length - 1) {
      ctx.strokeStyle = 'rgba(123,174,91,0.25)';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 14]);
      ctx.beginPath();
      ctx.moveTo(cardX + 64, y + 46);
      ctx.lineTo(cardX + cardW - 64, y + 46);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  });

  // ---- footer ----
  ctx.fillStyle = '#5B8C46';
  ctx.font = '800 42px "Fredoka", "Baloo 2", "Nunito", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('OtterSave — savings, but make it cozy.', W / 2, H - 92);

  // mascot photo (async)
  const img = new Image();
  img.onload = () => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(170, 170, 96, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(img, 170 - 96, 170 - 96, 192, 192);
    ctx.restore();
    onReady?.();
  };
  img.onerror = () => onReady?.();
  img.src = MASCOT;
  if (img.complete && img.naturalWidth > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(170, 170, 96, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(img, 170 - 96, 170 - 96, 192, 192);
    ctx.restore();
    onReady?.();
  }
}
