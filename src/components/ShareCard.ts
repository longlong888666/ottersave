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
