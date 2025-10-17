const canvasOptions = [
  'Gradient', 'Stars', 'Waves', 'Particles', 'Grid', 'Noise', 'Circles', 'Lines',
  'Triangles', 'Fractals', 'Ripples', 'Snow', 'Fire', 'Abstract'
];

function initCanvas() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.zIndex = -1;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let selectedOption = localStorage.getItem('canvasOption') || 'Gradient';

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawCanvas(ctx, selectedOption);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  return { canvas, ctx, selectedOption, setOption };
}

function setOption(option) {
  selectedOption = option;
  localStorage.setItem('canvasOption', option);
  drawCanvas(ctx, option);
}

function drawCanvas(ctx, option) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  switch (option) {
    case 'Gradient':
      const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
      gradient.addColorStop(0, '#333');
      gradient.addColorStop(1, '#666');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      break;
    // Add more cases for other options as needed
  }
}

const { canvas, ctx, selectedOption, setOption } = initCanvas();
