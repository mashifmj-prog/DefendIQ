/* Canvas background rendering */
const CANVAS_OPTIONS = [
  { value: 'blue-sky', label: 'Blue Sky' },
  { value: 'cyber-grid', label: 'Cyber Grid' },
  { value: 'calm-ocean', label: 'Calm Ocean' },
  { value: 'starry-night', label: 'Starry Night' },
  { value: 'forest', label: 'Forest' },
  { value: 'sunset', label: 'Sunset' },
  { value: 'abstract-cyber', label: 'Abstract Cyber' },
  { value: 'mountain-view', label: 'Mountain View' },
  { value: 'urban-city', label: 'Urban City' },
  { value: 'aurora-borealis', label: 'Aurora Borealis' },
  { value: 'desert-dunes', label: 'Desert Dunes' },
  { value: 'neon-circuit', label: 'Neon Circuit' },
  { value: 'galaxy-swirl', label: 'Galaxy Swirl' },
  { value: 'tropical-island', label: 'Tropical Island' }
];

function drawCanvas(canvasType) {
  const canvas = document.getElementById('supportCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = moduleBody.offsetWidth;
  canvas.height = moduleBody.offsetHeight;
  switch (canvasType) {
    case 'blue-sky':
      ctx.fillStyle = 'var(--canvas-blue-sky)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#FFFFFF';
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(100, 50, 30, 0, 2 * Math.PI);
      ctx.arc(130, 50, 40, 0, 2 * Math.PI);
      ctx.arc(160, 50, 30, 0, 2 * Math.PI);
      ctx.fill();
      ctx.globalAlpha = 1;
      break;
    case 'cyber-grid':
      ctx.fillStyle = 'var(--canvas-cyber-grid)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#00FF00';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }
      break;
    case 'calm-ocean':
      ctx.fillStyle = 'var(--canvas-calm-ocean)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#1E90FF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 10) {
        ctx.moveTo(x, canvas.height / 2 + Math.sin(x / 20) * 10);
        ctx.lineTo(x, canvas.height);
      }
      ctx.stroke();
      break;
    case 'starry-night':
      ctx.fillStyle = 'var(--canvas-starry-night)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#FFFFFF';
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, Math.random() * 2, 0, 2 * Math.PI);
        ctx.fill();
      }
      break;
    case 'forest':
      ctx.fillStyle = 'var(--canvas-forest)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(100, canvas.height - 100, 20, 100);
      ctx.fillStyle = '#228B22';
      ctx.beginPath();
      ctx.arc(110, canvas.height - 100, 40, 0, 2 * Math.PI);
      ctx.fill();
      break;
    case 'sunset':
      ctx.fillStyle = 'var(--canvas-sunset)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#FF4500';
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height - 50, 50, 0, 2 * Math.PI);
      ctx.fill();
      break;
    case 'abstract-cyber':
      ctx.fillStyle = 'var(--canvas-abstract-cyber)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#FF00FF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(canvas.width, 0);
      ctx.lineTo(0, canvas.height);
      ctx.stroke();
      break;
    case 'mountain-view':
      ctx.fillStyle = 'var(--canvas-mountain-view)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#A9A9A9';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      ctx.lineTo(canvas.width / 2, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      ctx.fill();
      break;
    case 'urban-city':
      ctx.fillStyle = 'var(--canvas-urban-city)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#808080';
      ctx.fillRect(50, canvas.height - 150, 50, 150);
      ctx.fillRect(120, canvas.height - 200, 50, 200);
      ctx.fillRect(190, canvas.height - 100, 50, 100);
      break;
    case 'aurora-borealis':
      ctx.fillStyle = 'var(--canvas-aurora-borealis)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 255, 127, 0.3)';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.quadraticCurveTo(canvas.width / 2, canvas.height / 4, canvas.width, canvas.height / 2);
      ctx.fill();
      break;
    case 'desert-dunes':
      ctx.fillStyle = 'var(--canvas-desert-dunes)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#F4A460';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      ctx.quadraticCurveTo(canvas.width / 3, canvas.height - 100, canvas.width * 2 / 3, canvas.height);
      ctx.quadraticCurveTo(canvas.width, canvas.height - 50, canvas.width, canvas.height);
      ctx.fill();
      break;
    case 'neon-circuit':
      ctx.fillStyle = 'var(--canvas-neon-circuit)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#00FFFF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(50, 50);
      ctx.lineTo(50, canvas.height - 50);
      ctx.lineTo(canvas.width - 50, canvas.height - 50);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(canvas.width - 50, canvas.height - 50, 10, 0, 2 * Math.PI);
      ctx.stroke();
      break;
    case 'galaxy-swirl':
      ctx.fillStyle = 'var(--canvas-galaxy-swirl)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#FFFFFF';
      ctx.globalAlpha = 0.5;
      for (let i = 0; i < 50; i++) {
        const x = canvas.width / 2 + Math.cos(i / 5) * i * 2;
        const y = canvas.height / 2 + Math.sin(i / 5) * i * 2;
        ctx.beginPath();
        ctx.arc(x, y, Math.random() * 3, 0, 2 * Math.PI);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      break;
    case 'tropical-island':
      ctx.fillStyle = 'var(--canvas-tropical-island)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height - 50, 30, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#228B22';
      ctx.fillRect(canvas.width / 2 - 20, canvas.height - 80, 40, 30);
      break;
  }
}
