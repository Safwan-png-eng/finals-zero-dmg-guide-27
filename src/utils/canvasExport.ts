
interface ThumbnailConfig {
  mainText: string;
  subText: string;
  backgroundPreset: string;
  textColor: string;
  accentColor: string;
  fontSize: string;
  textPosition: string;
  showParticles: boolean;
  glowEffect: boolean;
  backgroundImage: string | null;
  overlayImage: string | null;
  textShadow: boolean;
  borderGlow: boolean;
}

export const exportThumbnail = async (config: ThumbnailConfig): Promise<void> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Could not get canvas context');
  
  // Set canvas size to YouTube thumbnail dimensions
  canvas.width = 1280;
  canvas.height = 720;
  
  // Draw background
  await drawBackground(ctx, canvas, config);
  
  // Draw overlay image if present
  if (config.overlayImage) {
    await drawOverlayImage(ctx, canvas, config.overlayImage);
  }
  
  // Draw particles
  if (config.showParticles) {
    drawParticles(ctx, canvas, config.accentColor);
  }
  
  // Draw text
  drawText(ctx, canvas, config);
  
  // Draw border glow
  if (config.borderGlow) {
    drawBorderGlow(ctx, canvas, config.accentColor);
  }
  
  // Export canvas as image
  canvas.toBlob((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `finals-thumbnail-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, 'image/png', 1.0);
};

const drawBackground = async (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, config: ThumbnailConfig) => {
  // Check if preset has a specific background image
  const presetBackgrounds: Record<string, string> = {
    'monaco-streets': '/lovable-uploads/ff01c07f-8a42-4b34-bd5d-814ea69de169.png',
    'urban-battlefield': '/lovable-uploads/2385a088-db61-4395-a7df-433b98126931.png'
  };

  const backgroundImageUrl = config.backgroundImage || presetBackgrounds[config.backgroundPreset];

  if (backgroundImageUrl) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = backgroundImageUrl;
    });
    
    // Draw image to fit canvas
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    // Add dark overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    // Draw gradient background
    const gradient = getGradientForPreset(ctx, canvas, config.backgroundPreset);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
};

const drawOverlayImage = async (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, imageSrc: string) => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = imageSrc;
  });
  
  // Draw overlay image in bottom right corner with better proportions for character
  const maxWidth = canvas.width * 0.25;
  const maxHeight = canvas.height * 0.55;
  
  // Calculate aspect ratio to maintain image proportions
  const aspectRatio = img.width / img.height;
  let width = maxWidth;
  let height = width / aspectRatio;
  
  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }
  
  const x = canvas.width - width - 40;
  const y = canvas.height - height - 40;
  
  ctx.drawImage(img, x, y, width, height);
};

const drawParticles = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, accentColor: string) => {
  ctx.fillStyle = accentColor;
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 4 + 1;
    
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
};

const drawText = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, config: ThumbnailConfig) => {
  const fontSize = getFontSizeForCanvas(config.fontSize);
  const subFontSize = Math.floor(fontSize * 0.4);
  
  // Set text properties
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Calculate text position
  const centerX = canvas.width / 2;
  let centerY = canvas.height / 2;
  
  if (config.textPosition === 'top') {
    centerY = canvas.height * 0.25;
  } else if (config.textPosition === 'bottom') {
    centerY = canvas.height * 0.75;
  }
  
  // Draw main text
  ctx.font = `900 ${fontSize}px Arial, sans-serif`;
  
  if (config.textShadow) {
    ctx.shadowColor = config.accentColor;
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;
  }
  
  // Text stroke
  ctx.strokeStyle = config.accentColor;
  ctx.lineWidth = 6;
  ctx.strokeText(config.mainText.toUpperCase(), centerX, centerY - subFontSize/2);
  
  // Text fill
  ctx.fillStyle = config.textColor;
  ctx.fillText(config.mainText.toUpperCase(), centerX, centerY - subFontSize/2);
  
  // Draw sub text
  if (config.subText) {
    ctx.font = `700 ${subFontSize}px Arial, sans-serif`;
    ctx.strokeStyle = config.accentColor;
    ctx.lineWidth = 3;
    ctx.strokeText(config.subText.toUpperCase(), centerX, centerY + fontSize/3);
    
    ctx.fillStyle = config.accentColor;
    ctx.fillText(config.subText.toUpperCase(), centerX, centerY + fontSize/3);
  }
  
  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
};

const drawBorderGlow = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, accentColor: string) => {
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 8;
  ctx.shadowColor = accentColor;
  ctx.shadowBlur = 20;
  ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);
  
  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
};

const getGradientForPreset = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, preset: string) => {
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  
  const presets: Record<string, string[]> = {
    'neon-city': ['#0f0f23', '#1a1a3e', '#2d1b69', '#0f0f23'],
    'destruction-zone': ['#1a1a1a', '#4a4a4a', '#ff6b35', '#666'],
    'finals-arena': ['#0f0f1a', '#1a1a3e', '#3d2a78', '#ff0080'],
    'fire-storm': ['#1a0000', '#4a0e0e', '#8b0000', '#ff4500'],
    'ice-cold': ['#0a0a2e', '#16213e', '#1e3a8a', '#3b82f6'],
    'toxic-green': ['#0d1b0d', '#1a4d1a', '#228b22', '#32cd32'],
    'smoke-dust': ['#2a2520', '#5c5247', '#8b7355', '#d4c4a8'],
    'cyberpunk-pink': ['#1a0033', '#2d1b4e', '#4c1d95', '#8b5cf6']
  };
  
  const colors = presets[preset] || presets['neon-city'];
  
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(0.33, colors[1]);
  gradient.addColorStop(0.66, colors[2]);
  gradient.addColorStop(1, colors[3]);
  
  return gradient;
};

const getFontSizeForCanvas = (size: string): number => {
  const sizes: Record<string, number> = {
    small: 70,
    medium: 90,
    large: 110,
    xlarge: 130
  };
  return sizes[size] || 110;
};
