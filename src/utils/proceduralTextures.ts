import * as THREE from 'three';

/**
 * Creates procedural CanvasTextures for photorealistic bump/normal maps.
 */
const textureCache: Record<string, THREE.CanvasTexture> = {};

export function getProceduralTexture(type: 'carbon' | 'leather' | 'brushed' | 'perforated' | 'wood' | 'smooth'): THREE.CanvasTexture | null {
  if (type === 'smooth') return null;
  if (textureCache[type]) return textureCache[type];

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  if (type === 'carbon') {
    // Carbon fiber weave pattern
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, 512, 512);

    const size = 32;
    for (let y = 0; y < 512; y += size) {
      for (let x = 0; x < 512; x += size) {
        const isOdd = ((x / size) + (y / size)) % 2 === 0;
        ctx.fillStyle = isOdd ? '#222222' : '#0a0a0a';
        ctx.fillRect(x, y, size, size);

        // Sub-stripe weave texture
        ctx.fillStyle = isOdd ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.2)';
        for (let i = 0; i < size; i += 4) {
          ctx.fillRect(x + i, y, 2, size);
        }
      }
    }
  } else if (type === 'leather') {
    // Perlin-like leather grain noise
    ctx.fillStyle = '#222222';
    ctx.fillRect(0, 0, 512, 512);

    const imgData = ctx.getImageData(0, 0, 512, 512);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const val = Math.floor(128 + (Math.random() - 0.5) * 45);
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
      data[i + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);

    // Overlay soft wrinkles
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 60; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * 512, Math.random() * 512);
      ctx.quadraticCurveTo(
        Math.random() * 512, Math.random() * 512,
        Math.random() * 512, Math.random() * 512
      );
      ctx.stroke();
    }
  } else if (type === 'brushed') {
    // Brushed metal linear streaks
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 512, 512);

    for (let y = 0; y < 512; y++) {
      const alpha = (Math.random() - 0.5) * 0.25;
      ctx.fillStyle = alpha > 0 ? `rgba(255, 255, 255, ${alpha})` : `rgba(0, 0, 0, ${-alpha})`;
      ctx.fillRect(0, y, 512, 1);
    }
  } else if (type === 'perforated') {
    // Perforated hole grid
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, 512, 512);

    ctx.fillStyle = '#000000';
    const step = 24;
    for (let y = 12; y < 512; y += step) {
      for (let x = 12; x < 512; x += step) {
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (type === 'wood') {
    // Fine wood grain rings
    ctx.fillStyle = '#3a2510';
    ctx.fillRect(0, 0, 512, 512);

    for (let i = 0; i < 40; i++) {
      ctx.strokeStyle = `rgba(30, 15, 5, ${0.1 + Math.random() * 0.15})`;
      ctx.lineWidth = 2 + Math.random() * 6;
      ctx.beginPath();
      ctx.ellipse(256, 256, 10 + i * 12, 20 + i * 18, Math.PI / 6, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  textureCache[type] = texture;

  return texture;
}
