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
  characterPosition?: string;
  characterHorizontalOffset?: number;
  characterVerticalOffset?: number;
  characterBlendMode?: string;
  characterRemoveBackground?: boolean;
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
    characterBounds = await drawOverlayImage(ctx, canvas, config.overlayImage, config.overlayImageSize || 25, config);
  }
  
  // Draw text with smart positioning based on character presence and bounds
  drawText(ctx, canvas, config, characterBounds);
  
  // Draw border glow
  if (config.borderGlow) {
    drawBorderGlow(ctx, canvas, config.accentColor);
  }
  
  // Export canvas as image
  // Generate smart filename based on content
  const generateFilename = (config: ThumbnailConfig): string => {
    const sanitizeText = (text: string) => text.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const mainTextClean = sanitizeText(config.mainText.slice(0, 20));
    const timestamp = new Date().toISOString().slice(0, 10);
    
    return `finals-${mainTextClean}-${timestamp}.png`;
  };

  canvas.toBlob((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = generateFilename(config);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, 'image/png', 1.0);
};

const drawBackground = async (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, config: ThumbnailConfig) => {
  const backgroundImageUrl = config.backgroundImage;

  if (backgroundImageUrl && backgroundImageUrl !== 'null') {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = backgroundImageUrl;
      });
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      // Add dark overlay for better text readability
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } catch (error) {
      console.error('Failed to load background image:', error);
      // Fallback to gradient if image fails
      const gradient = getGradientForPreset(ctx, canvas, config.backgroundPreset);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  } else {
    // Use gradient based on preset
    const gradient = getGradientForPreset(ctx, canvas, config.backgroundPreset);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
};

const removeGreenBlueBackground = (imageData: ImageData): ImageData => {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Enhanced chroma key detection
      const greenDominance = g - Math.max(r, b);
      const blueDominance = b - Math.max(r, g);
      
      // Multiple detection methods for better accuracy
      const isGreenScreen = (
        (greenDominance > 40 && g > 80) || // Strong green dominance
        (g > 120 && g > r * 1.4 && g > b * 1.4) || // Bright green
        (g > r + 50 && g > b + 50 && g > 100) // Classic green screen
      );
      
      const isBlueScreen = (
        (blueDominance > 40 && b > 80) || // Strong blue dominance
        (b > 120 && b > r * 1.4 && b > g * 1.4) || // Bright blue
        (b > r + 50 && b > g + 50 && b > 100) // Classic blue screen
      );
      
      // Check for cyan/turquoise variants often used in green screens
      const isCyanScreen = (g > 100 && b > 100 && g + b > r * 2.5 && Math.abs(g - b) < 50);
      
      // Detect lime green variations
      const isLimeGreen = (g > 150 && r > 50 && g > r * 1.8 && g > b * 2);
      
      // Remove background pixels by setting alpha to 0
      if (isGreenScreen || isBlueScreen || isCyanScreen || isLimeGreen) {
        data[i + 3] = 0; // Set alpha to 0 (transparent)
      }
      // Semi-transparent for edge pixels (better blending)
      else if ((greenDominance > 20 && g > 60) || (blueDominance > 20 && b > 60)) {
        data[i + 3] = Math.min(data[i + 3], 128); // Make semi-transparent
      }
    }
  }
  
  return imageData;
};

const drawOverlayImage = async (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, imageSrc: string, sizePercentage: number, config: ThumbnailConfig) => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = imageSrc;
  });
  
  // Much more aggressive size scaling - make characters HUGE
  const sizeMultiplier = Math.max(0.6, Math.min(1.5, sizePercentage / 100));
  
  // Massive dimensions for maximum visibility
  const maxWidth = canvas.width * sizeMultiplier * 0.8; // Increased from 0.6 to 0.8
  const maxHeight = canvas.height * sizeMultiplier * 1.0; // Increased from 0.85 to 1.0
  
  const aspectRatio = img.width / img.height;
  let width = maxWidth;
  let height = width / aspectRatio;
  
  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }
  
  // Position character to take up most of the right side
  let x, y;
  
  if (sizePercentage >= 70) {
    // Large character - fill most of right side
    x = canvas.width - width - 20; // Minimal margin
    y = canvas.height - height - 20; // Minimal margin
  } else if (sizePercentage >= 40) {
    // Medium character - still very large
    x = canvas.width - width - 40;
    y = canvas.height - height - 40;
  } else {
    // Small character - but make it bigger than before
    x = canvas.width - width - 60;
    y = canvas.height - height - 60;
  }
  
  // Character background effects
  if (sizePercentage > 15) {
    // Draw character ground shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.beginPath();
    ctx.ellipse(x + width/2, y + height - 15, width * 0.5, 35, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Add atmospheric glow
    const glowIntensity = Math.min(0.5, sizePercentage * 0.008);
    const gradient = ctx.createRadialGradient(x + width/2, y + height/2, 0, x + width/2, y + height/2, Math.max(width, height) * 1.1);
    gradient.addColorStop(0, `rgba(0, 212, 255, ${glowIntensity})`);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(x - 100, y - 100, width + 200, height + 200);
  }
  
  // Enhanced character effects with scene-aware lighting
  if (sizePercentage > 20) {
    // Apply scene-specific lighting based on background preset
    if (config.backgroundPreset === 'las-vegas') {
      ctx.shadowColor = 'rgba(255, 204, 0, 0.8)';
      ctx.shadowBlur = Math.min(40, sizePercentage * 0.6);
    } else if (config.backgroundPreset === 'finals-arena') {
      ctx.shadowColor = 'rgba(128, 0, 255, 0.8)';
      ctx.shadowBlur = Math.min(40, sizePercentage * 0.6);
    } else {
      ctx.shadowColor = '#00d4ff';
      ctx.shadowBlur = Math.min(50, sizePercentage * 0.8);
    }
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }
  
  // Apply background removal (always enabled for exports to remove green/blue backgrounds)
  if (config.characterRemoveBackground || true) {
    // Create temporary canvas for background removal processing
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) throw new Error('Could not get temp canvas context');
    
    tempCanvas.width = width;
    tempCanvas.height = height;
    
    // Draw character on temp canvas
    tempCtx.imageSmoothingEnabled = true;
    tempCtx.imageSmoothingQuality = 'high';
    tempCtx.drawImage(img, 0, 0, width, height);
    
    // Get image data and remove background
    const imageData = tempCtx.getImageData(0, 0, width, height);
    const processedImageData = removeGreenBlueBackground(imageData);
    
    // Put processed image data back
    tempCtx.putImageData(processedImageData, 0, 0);
    
    // Draw processed image to main canvas
    ctx.drawImage(tempCanvas, x, y);
  } else {
    // Draw the character normally with high quality scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, x, y, width, height);
  }
  
  // Apply ambient lighting overlay for better scene integration
  if (config.backgroundPreset === 'las-vegas' && sizePercentage > 15) {
    ctx.globalCompositeOperation = 'overlay';
    const lightingGradient = ctx.createRadialGradient(x + width/2, y + height/2, 0, x + width/2, y + height/2, Math.max(width, height));
    lightingGradient.addColorStop(0, 'rgba(255, 204, 0, 0.25)');
    lightingGradient.addColorStop(0.4, 'rgba(255, 102, 0, 0.15)');
    lightingGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = lightingGradient;
    ctx.fillRect(x, y, width, height);
    ctx.globalCompositeOperation = 'source-over';
  } else if (config.backgroundPreset === 'finals-arena' && sizePercentage > 15) {
    ctx.globalCompositeOperation = 'overlay';
    const lightingGradient = ctx.createRadialGradient(x + width/2, y + height/2, 0, x + width/2, y + height/2, Math.max(width, height));
    lightingGradient.addColorStop(0, 'rgba(128, 0, 255, 0.2)');
    lightingGradient.addColorStop(0.4, 'rgba(255, 0, 128, 0.1)');
    lightingGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = lightingGradient;
    ctx.fillRect(x, y, width, height);
    ctx.globalCompositeOperation = 'source-over';
  }
  
  // Draw NO DAMAGE badge with better positioning
  if (sizePercentage > 10) {
    drawNoDamageBadge(ctx, x, y, sizePercentage, width, height);
  }
  
  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  
  // Return character bounds for text positioning
  return { x, y, width, height };
};

const drawNoDamageBadge = (ctx: CanvasRenderingContext2D, characterX: number, characterY: number, size: number, characterWidth: number, characterHeight: number) => {
  // Larger badge scaling
  const badgeScale = Math.max(1.0, Math.min(1.6, size / 50));
  const badgeWidth = 120 * badgeScale;
  const badgeHeight = 32 * badgeScale;
  
  // Position badge to avoid overlapping with text area
  let badgeX, badgeY;
  
  if (size >= 70) {
    // Large character - position badge in top right of character
    badgeX = characterX + characterWidth - badgeWidth - 10;
    badgeY = characterY + 15;
  } else if (size >= 40) {
    // Medium character - position above character
    badgeX = characterX + characterWidth * 0.7;
    badgeY = characterY + 10;
  } else {
    // Small character - position safely
    badgeX = characterX + characterWidth * 0.6;
    badgeY = characterY + 10;
  }
  
  // Ensure badge stays within character area
  badgeX = Math.min(badgeX, characterX + characterWidth - badgeWidth - 5);
  badgeX = Math.max(badgeX, characterX + 5);
  badgeY = Math.max(badgeY, characterY + 5);
  
  // Badge background glow
  ctx.shadowColor = '#ff0000';
  ctx.shadowBlur = 20 * badgeScale;
  ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
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
  ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 18);
  ctx.fill();
  
  // Badge border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.lineWidth = 4 * badgeScale;
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 18);
  ctx.stroke();
  
  // Badge text
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 3 * badgeScale;
  ctx.fillStyle = 'white';
  ctx.font = `bold ${14 * badgeScale}px Impact, Arial Black, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Draw indicator dot
  ctx.beginPath();
  ctx.arc(badgeX + 18 * badgeScale, badgeY + badgeHeight/2, 5 * badgeScale, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw badge text
  ctx.fillText('NO DAMAGE', badgeX + badgeWidth/2 + 12 * badgeScale, badgeY + badgeHeight/2);
  
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
  
  // Much more aggressive text positioning to avoid character overlap
  let textX = 60;
  let textY = canvas.height / 2;
  let maxTextWidth = canvas.width - 120;
  
  if (characterBounds) {
    const characterSize = config.overlayImageSize || 25;
    
    if (characterSize >= 70) {
      // Large character - text confined to left 40% of canvas
      textX = 60;
      textY = canvas.height * 0.35;
      maxTextWidth = canvas.width * 0.35; // Only use 35% of width
    } else if (characterSize >= 40) {
      // Medium character - text in upper left area
      textX = 60;
      textY = canvas.height * 0.25;
      maxTextWidth = canvas.width * 0.45; // Use 45% of width
    } else {
      // Small character - more space but still safe
      textX = 60;
      textY = canvas.height * 0.4;
      maxTextWidth = canvas.width * 0.55; // Use 55% of width
    }
  } else {
    // No character - use selected position with full width
    ctx.textAlign = 'center';
    textX = canvas.width / 2;
    if (config.textPosition === 'top') {
      textY = canvas.height * 0.3;
    } else if (config.textPosition === 'bottom') {
      textY = canvas.height * 0.7;
    }
    maxTextWidth = canvas.width - 120;
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
  
  // Word wrapping for long text with stricter width limits
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
    'cyberpunk-pink': ['#1a0033', '#2d1b4e', '#4c1d95', '#8b5cf6'],
    'las-vegas': ['#1a0a00', '#4a1f00', '#ff6600', '#ffcc00'],
    'monaco-streets': ['#0a0a1a', '#1f1f3a', '#4a4a8a', '#6a6aaa'],
    'urban-battlefield': ['#1a1a1a', '#3a3a3a', '#8a6a4a', '#aa8a6a'],
    'casino-royale': ['#0a1a0a', '#1f4a1f', '#4a8a4a', '#6aaa6a'],
    'skybridge-arena': ['#1a1a2a', '#3a3a5a', '#5a5a8a', '#7a7aaa'],
    'neon-paradise': ['#2a0a2a', '#5a1f5a', '#8a4a8a', '#aa6aaa'],
    'crystal-district': ['#0a2a2a', '#1f5a5a', '#4a8a8a', '#6aaaaa']
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
