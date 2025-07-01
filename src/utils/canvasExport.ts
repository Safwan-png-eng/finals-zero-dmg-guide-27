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
  overlayImageSize: number;
  textShadow: boolean;
  borderGlow: boolean;
  textOutline: boolean;
  textRotation: number;
  textOpacity: number;
  animatedText: boolean;
  gradientText: boolean;
  customFont: string;
  letterSpacing: string;
  lineHeight: string;
  textBackground: boolean;
  textBackgroundColor: string;
  textBackgroundOpacity: number;
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
  
  // Draw particles first (behind everything)
  if (config.showParticles) {
    drawParticles(ctx, canvas, config.accentColor);
  }
  
  // Smart positioning: Draw overlay image if present with proper sizing
  if (config.overlayImage) {
    await drawOverlayImage(ctx, canvas, config.overlayImage, config.overlayImageSize || 25);
  }
  
  // Draw text with smart positioning based on character presence
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
    'urban-battlefield': '/lovable-uploads/2385a088-db61-4395-a7df-433b98126931.png',
    'casino-royale': '/lovable-uploads/8f9ecc3b-dad0-4fd0-b0dc-95097941de66.png',
    'skybridge-arena': '/lovable-uploads/ddad55a5-b9b9-46e0-ab90-b3f759cdb55e.png',
    'neon-paradise': '/lovable-uploads/e859ab1d-04b2-4dc9-a666-a4a3411160ed.png',
    'crystal-district': '/lovable-uploads/29e843a9-6fbf-4584-b09d-a99cdd7bd93b.png'
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

const drawOverlayImage = async (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, imageSrc: string, sizePercentage: number) => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = imageSrc;
  });
  
  // Calculate size with better spacing to prevent overlaps
  const sizeMultiplier = Math.max(0.15, Math.min(1.0, sizePercentage / 100));
  
  // Reduced max dimensions to prevent overlap
  const maxWidth = canvas.width * sizeMultiplier * 0.5; // Reduced from 0.6 to 0.5
  const maxHeight = canvas.height * sizeMultiplier * 0.7; // Reduced from 0.8 to 0.7
  
  const aspectRatio = img.width / img.height;
  let width = maxWidth;
  let height = width / aspectRatio;
  
  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }
  
  // Improved positioning with better spacing
  let x, y;
  
  if (sizePercentage >= 70) {
    // Large character - positioned to leave more space for text
    x = canvas.width - width - 80; // Increased margin
    y = canvas.height - height - 60; // Increased margin
  } else if (sizePercentage >= 40) {
    // Medium character - positioned lower to avoid text overlap
    x = canvas.width - width - 100; // Increased margin
    y = canvas.height - height - 80; // Increased margin
  } else {
    // Small character - more corner placement
    x = canvas.width - width - 120; // Increased margin
    y = canvas.height - height - 100; // Increased margin
  }
  
  // Character background effects
  if (sizePercentage > 30) {
    // Draw character ground shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.ellipse(x + width/2, y + height - 15, width * 0.35, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Add atmospheric glow
    const glowIntensity = Math.min(0.3, sizePercentage * 0.004);
    const gradient = ctx.createRadialGradient(x + width/2, y + height/2, 0, x + width/2, y + height/2, Math.max(width, height) * 0.8);
    gradient.addColorStop(0, `rgba(0, 212, 255, ${glowIntensity})`);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(x - 60, y - 60, width + 120, height + 120);
  }
  
  // Enhanced character effects for larger sizes
  if (sizePercentage > 50) {
    ctx.shadowColor = '#00d4ff';
    ctx.shadowBlur = Math.min(25, sizePercentage * 0.4);
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }
  
  // Draw the character with high quality scaling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, x, y, width, height);
  
  // Draw enhanced NO DAMAGE badge with better positioning
  if (sizePercentage > 25) {
    drawNoDamageBadge(ctx, x, y, sizePercentage);
  }
  
  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
};

const drawNoDamageBadge = (ctx: CanvasRenderingContext2D, characterX: number, characterY: number, size: number) => {
  // Scale badge with character size
  const badgeScale = Math.max(0.8, Math.min(1.2, size / 60)); // Reduced max scale
  const badgeWidth = 120 * badgeScale; // Reduced width
  const badgeHeight = 30 * badgeScale; // Reduced height
  
  // Position badge to avoid overlap with text
  let badgeX, badgeY;
  if (size >= 70) {
    // Large character - position badge in top right area
    badgeX = characterX + 40 * badgeScale;
    badgeY = characterY + 20 * badgeScale;
  } else {
    // Smaller characters - standard positioning
    badgeX = characterX + 30 * badgeScale;
    badgeY = characterY + 30 * badgeScale;
  }
  
  // Badge background glow
  ctx.shadowColor = '#ff0000';
  ctx.shadowBlur = 20 * badgeScale;
  ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.roundRect(badgeX - 8, badgeY - 8, badgeWidth + 16, badgeHeight + 16, 25);
  ctx.fill();
  
  // Main badge background
  const badgeGradient = ctx.createLinearGradient(badgeX, badgeY, badgeX + badgeWidth, badgeY);
  badgeGradient.addColorStop(0, '#dc2626');
  badgeGradient.addColorStop(0.5, '#ef4444');
  badgeGradient.addColorStop(1, '#f97316');
  ctx.fillStyle = badgeGradient;
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 20);
  ctx.fill();
  
  // Badge border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.lineWidth = 4 * badgeScale;
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 20);
  ctx.stroke();
  
  // Badge text
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 3 * badgeScale;
  ctx.fillStyle = 'white';
  ctx.font = `bold ${16 * badgeScale}px Impact, Arial Black, sans-serif`; // Reduced font size
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Draw indicator dot
  ctx.beginPath();
  ctx.arc(badgeX + 20 * badgeScale, badgeY + badgeHeight/2, 6 * badgeScale, 0, Math.PI * 2); // Reduced dot size
  ctx.fill();
  
  // Draw badge text
  ctx.fillText('NO DAMAGE', badgeX + badgeWidth/2 + 15 * badgeScale, badgeY + badgeHeight/2);
  
  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
};

const drawParticles = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, accentColor: string) => {
  ctx.fillStyle = accentColor;
  ctx.globalAlpha = 0.6;
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 3 + 1;
    
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;
};

const drawText = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, config: ThumbnailConfig) => {
  const fontSize = getFontSizeForCanvas(config.fontSize);
  const subFontSize = Math.floor(fontSize * 0.45);
  
  // Set text properties
  ctx.textAlign = 'left'; // Changed to left align for better positioning
  ctx.textBaseline = 'middle';
  
  // Improved text positioning with better spacing calculations
  let textX = 80;
  let textY = canvas.height / 2;
  let maxTextWidth = canvas.width - 160;
  
  if (config.overlayImage) {
    const characterSize = config.overlayImageSize || 25;
    
    if (characterSize >= 70) {
      // Large character - text takes left 65% with more spacing
      textX = 60;
      textY = canvas.height * 0.45;
      maxTextWidth = canvas.width * 0.42; // Reduced to prevent overlap
    } else if (characterSize >= 40) {
      // Medium character - text in upper area with better spacing
      textX = canvas.width * 0.1;
      textY = canvas.height * 0.32; // Moved higher
      maxTextWidth = canvas.width * 0.75; // Reduced width
      ctx.textAlign = 'center';
      textX = canvas.width / 2;
    } else {
      // Small character - centered with more margin
      textX = canvas.width * 0.15;
      textY = canvas.height * 0.5;
      maxTextWidth = canvas.width * 0.6; // Reduced width
    }
  } else {
    // No character - use selected position
    ctx.textAlign = 'center';
    textX = canvas.width / 2;
    if (config.textPosition === 'top') {
      textY = canvas.height * 0.3;
    } else if (config.textPosition === 'bottom') {
      textY = canvas.height * 0.7;
    }
  }
  
  // Get font family
  const fontFamily = getFontFamilyForCanvas(config.customFont);
  
  // Draw text background if enabled
  if (config.textBackground) {
    ctx.font = `900 ${fontSize}px ${fontFamily}`;
    const mainTextMetrics = ctx.measureText(config.mainText.toUpperCase());
    const textWidth = Math.min(mainTextMetrics.width, maxTextWidth);
    const padding = 30;
    
    ctx.fillStyle = config.textBackgroundColor;
    ctx.globalAlpha = config.textBackgroundOpacity / 100;
    
    const bgX = ctx.textAlign === 'center' ? textX - textWidth/2 - padding : textX - padding;
    const bgY = textY - fontSize/2 - padding;
    const bgWidth = textWidth + padding * 2;
    const bgHeight = fontSize + subFontSize + padding * 2;
    
    ctx.fillRect(bgX, bgY, bgWidth, bgHeight);
    ctx.globalAlpha = 1.0;
  }
  
  // Apply rotation if needed
  if (config.textRotation !== 0) {
    ctx.save();
    ctx.translate(textX, textY);
    ctx.rotate((config.textRotation * Math.PI) / 180);
    ctx.translate(-textX, -textY);
  }
  
  // Draw main text with better spacing
  ctx.font = `900 ${fontSize}px ${fontFamily}`;
  
  if (config.textShadow) {
    ctx.shadowColor = config.accentColor;
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
  }
  
  // Text outline
  if (config.textOutline) {
    ctx.strokeStyle = config.accentColor;
    ctx.lineWidth = 6;
    ctx.strokeText(config.mainText.toUpperCase(), textX, textY - subFontSize/2);
  }
  
  // Text fill with opacity and gradient
  if (config.gradientText) {
    const gradient = ctx.createLinearGradient(textX - 200, textY, textX + 200, textY);
    gradient.addColorStop(0, config.textColor);
    gradient.addColorStop(0.5, config.accentColor);
    gradient.addColorStop(1, config.textColor);
    ctx.fillStyle = gradient;
  } else {
    ctx.fillStyle = config.textColor;
  }
  
  ctx.globalAlpha = config.textOpacity / 100;
  ctx.fillText(config.mainText.toUpperCase(), textX, textY - subFontSize/2);
  ctx.globalAlpha = 1.0;
  
  // Draw sub text with improved spacing
  if (config.subText) {
    ctx.font = `700 ${subFontSize}px ${fontFamily}`;
    
    if (config.textOutline) {
      ctx.strokeStyle = config.accentColor;
      ctx.lineWidth = 3;
      ctx.strokeText(config.subText.toUpperCase(), textX, textY + fontSize/3);
    }
    
    if (config.gradientText) {
      const gradient = ctx.createLinearGradient(textX - 150, textY, textX + 150, textY);
      gradient.addColorStop(0, config.accentColor);
      gradient.addColorStop(0.5, config.textColor);
      gradient.addColorStop(1, config.accentColor);
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = config.accentColor;
    }
    
    ctx.globalAlpha = (config.textOpacity / 100) * 0.85;
    ctx.fillText(config.subText.toUpperCase(), textX, textY + fontSize/3);
    ctx.globalAlpha = 1.0;
  }
  
  // Restore rotation
  if (config.textRotation !== 0) {
    ctx.restore();
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
    small: 75,
    medium: 90,
    large: 105,
    xlarge: 120
  };
  return sizes[size] || 90;
};

const getFontFamilyForCanvas = (font: string): string => {
  const fonts: Record<string, string> = {
    'arial': 'Arial, sans-serif',
    'impact': 'Impact, Arial Black, sans-serif',
    'bebas': 'Bebas Neue, Impact, sans-serif',
    'oswald': 'Oswald, Impact, sans-serif',
    'roboto': 'Roboto, Arial, sans-serif'
  };
  return fonts[font] || 'Impact, Arial Black, sans-serif';
};
