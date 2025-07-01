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
  
  // Draw overlay image if present with proper sizing
  let characterBounds = null;
  if (config.overlayImage) {
    characterBounds = await drawOverlayImage(ctx, canvas, config.overlayImage, config.overlayImageSize || 25);
  }
  
  // Draw text with smart positioning based on character presence and bounds
  drawText(ctx, canvas, config, characterBounds);
  
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
  
  // Much more aggressive size scaling - characters should be prominent
  const sizeMultiplier = Math.max(0.4, Math.min(1.2, sizePercentage / 100));
  
  // Significantly increased dimensions for better visibility
  const maxWidth = canvas.width * sizeMultiplier * 0.6; // Increased from 0.35 to 0.6
  const maxHeight = canvas.height * sizeMultiplier * 0.85; // Increased from 0.55 to 0.85
  
  const aspectRatio = img.width / img.height;
  let width = maxWidth;
  let height = width / aspectRatio;
  
  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }
  
  // Adjusted positioning with larger characters in mind
  let x, y;
  
  if (sizePercentage >= 70) {
    // Large character - positioned right with space for text
    x = canvas.width - width - 60; // Reduced margin to show more character
    y = canvas.height - height - 40; // Reduced margin
  } else if (sizePercentage >= 40) {
    // Medium character - positioned lower right
    x = canvas.width - width - 80;
    y = canvas.height - height - 60;
  } else {
    // Small character - but still make it visible
    x = canvas.width - width - 100;
    y = canvas.height - height - 80;
  }
  
  // Character background effects
  if (sizePercentage > 20) { // Lowered threshold
    // Draw character ground shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.beginPath();
    ctx.ellipse(x + width/2, y + height - 10, width * 0.4, 25, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Add atmospheric glow
    const glowIntensity = Math.min(0.4, sizePercentage * 0.006);
    const gradient = ctx.createRadialGradient(x + width/2, y + height/2, 0, x + width/2, y + height/2, Math.max(width, height) * 0.9);
    gradient.addColorStop(0, `rgba(0, 212, 255, ${glowIntensity})`);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(x - 80, y - 80, width + 160, height + 160);
  }
  
  // Enhanced character effects for larger visibility
  if (sizePercentage > 30) { // Lowered threshold
    ctx.shadowColor = '#00d4ff';
    ctx.shadowBlur = Math.min(35, sizePercentage * 0.5);
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }
  
  // Draw the character with high quality scaling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, x, y, width, height);
  
  // Draw NO DAMAGE badge with better positioning
  if (sizePercentage > 15) { // Lowered threshold
    drawNoDamageBadge(ctx, x, y, sizePercentage, width, height);
  }
  
  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  
  // Return character bounds for text positioning
  return { x, y, width, height };
};

const drawNoDamageBadge = (ctx: CanvasRenderingContext2D, characterX: number, characterY: number, size: number, characterWidth: number, characterHeight: number) => {
  // Better badge scaling - more visible
  const badgeScale = Math.max(0.8, Math.min(1.4, size / 60)); // Increased scale
  const badgeWidth = 110 * badgeScale; // Slightly larger
  const badgeHeight = 28 * badgeScale;
  
  // Better positioning to avoid text overlap
  let badgeX, badgeY;
  
  if (size >= 70) {
    // Large character - position badge in safe zone
    badgeX = characterX + characterWidth - badgeWidth - 20;
    badgeY = characterY + 20;
  } else if (size >= 40) {
    // Medium character - position more conservatively
    badgeX = characterX + characterWidth * 0.7;
    badgeY = characterY + characterHeight * 0.1;
  } else {
    // Small character - keep badge visible but not overlapping
    badgeX = characterX + characterWidth * 0.6;
    badgeY = characterY + 15;
  }
  
  // Ensure badge stays within character bounds
  badgeX = Math.min(badgeX, characterX + characterWidth - badgeWidth - 5);
  badgeY = Math.max(badgeY, characterY + 5);
  
  // Badge background glow
  ctx.shadowColor = '#ff0000';
  ctx.shadowBlur = 15 * badgeScale;
  ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.roundRect(badgeX - 6, badgeY - 6, badgeWidth + 12, badgeHeight + 12, 20);
  ctx.fill();
  
  // Main badge background
  const badgeGradient = ctx.createLinearGradient(badgeX, badgeY, badgeX + badgeWidth, badgeY);
  badgeGradient.addColorStop(0, '#dc2626');
  badgeGradient.addColorStop(0.5, '#ef4444');
  badgeGradient.addColorStop(1, '#f97316');
  ctx.fillStyle = badgeGradient;
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 15);
  ctx.fill();
  
  // Badge border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.lineWidth = 3 * badgeScale;
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 15);
  ctx.stroke();
  
  // Badge text
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 2 * badgeScale;
  ctx.fillStyle = 'white';
  ctx.font = `bold ${13 * badgeScale}px Impact, Arial Black, sans-serif`; // Smaller font
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Draw indicator dot
  ctx.beginPath();
  ctx.arc(badgeX + 15 * badgeScale, badgeY + badgeHeight/2, 4 * badgeScale, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw badge text
  ctx.fillText('NO DAMAGE', badgeX + badgeWidth/2 + 10 * badgeScale, badgeY + badgeHeight/2);
  
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

const drawText = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, config: ThumbnailConfig, characterBounds: any) => {
  const fontSize = getFontSizeForCanvas(config.fontSize);
  const subFontSize = Math.floor(fontSize * 0.45);
  
  // Set text properties
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  
  // Much more conservative text positioning with larger characters
  let textX = 80;
  let textY = canvas.height / 2;
  let maxTextWidth = canvas.width - 160;
  
  if (characterBounds) {
    const characterSize = config.overlayImageSize || 25;
    
    if (characterSize >= 70) {
      // Large character - text on left side with much more space
      textX = 60;
      textY = canvas.height * 0.35;
      maxTextWidth = characterBounds.x - 180; // Much larger gap
    } else if (characterSize >= 40) {
      // Medium character - text in upper area with safe spacing
      textX = 80;
      textY = canvas.height * 0.2; // Moved higher
      maxTextWidth = canvas.width - 300; // Very conservative width
      ctx.textAlign = 'left';
    } else {
      // Small character - text on left with moderate spacing
      textX = 80;
      textY = canvas.height * 0.4;
      maxTextWidth = characterBounds.x - 140; // Safe gap
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
  
  // Draw main text with better spacing and word wrapping
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
  
  // Word wrapping for long text
  const words = config.mainText.toUpperCase().split(' ');
  const lines = [];
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxTextWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  
  // Draw text lines with proper spacing
  const lineHeight = fontSize * 1.1;
  const totalHeight = lines.length * lineHeight;
  let startY = textY - totalHeight / 2 + lineHeight / 2;
  
  lines.forEach((line, index) => {
    const lineY = startY + index * lineHeight;
    ctx.fillText(line, textX, lineY);
  });
  
  ctx.globalAlpha = 1.0;
  
  // Draw sub text with improved spacing
  if (config.subText) {
    ctx.font = `700 ${subFontSize}px ${fontFamily}`;
    
    if (config.textOutline) {
      ctx.strokeStyle = config.accentColor;
      ctx.lineWidth = 3;
      ctx.strokeText(config.subText.toUpperCase(), textX, startY + lines.length * lineHeight + subFontSize);
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
    ctx.fillText(config.subText.toUpperCase(), textX, startY + lines.length * lineHeight + subFontSize);
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
