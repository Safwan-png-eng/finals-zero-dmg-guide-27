// Enhanced Character Rendering System
// Fixes gray transparent background issues with proper background removal

export interface CharacterRenderOptions {
  removeBackground: boolean;
  enhanceColors: boolean;
  addShadow: boolean;
  blendMode: string;
  backgroundColor: string;
}

// Advanced background removal that prevents gray artifacts
export const removeCharacterBackground = (canvas: HTMLCanvasElement): HTMLCanvasElement => {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // First pass: Identify background colors
  const colorFrequency = new Map<string, number>();
  const edgePixels = new Set<string>();
  
  // Sample edge pixels to identify likely background colors
  for (let x = 0; x < canvas.width; x++) {
    // Top and bottom edges
    [0, canvas.height - 1].forEach(y => {
      const i = (y * canvas.width + x) * 4;
      const colorKey = `${data[i]},${data[i + 1]},${data[i + 2]}`;
      edgePixels.add(colorKey);
      colorFrequency.set(colorKey, (colorFrequency.get(colorKey) || 0) + 1);
    });
  }
  
  for (let y = 0; y < canvas.height; y++) {
    // Left and right edges
    [0, canvas.width - 1].forEach(x => {
      const i = (y * canvas.width + x) * 4;
      const colorKey = `${data[i]},${data[i + 1]},${data[i + 2]}`;
      edgePixels.add(colorKey);
      colorFrequency.set(colorKey, (colorFrequency.get(colorKey) || 0) + 1);
    });
  }
  
  // Find the most common edge color (likely background)
  let dominantBgColor = '';
  let maxFreq = 0;
  colorFrequency.forEach((freq, color) => {
    if (freq > maxFreq) {
      maxFreq = freq;
      dominantBgColor = color;
    }
  });
  
  const [bgR, bgG, bgB] = dominantBgColor ? dominantBgColor.split(',').map(Number) : [0, 255, 0];
  
  // Second pass: Remove background with intelligent detection
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    
    // Skip already transparent pixels
    if (a < 10) continue;
    
    // Calculate color similarity to background
    const colorDiff = Math.sqrt(
      Math.pow(r - bgR, 2) + 
      Math.pow(g - bgG, 2) + 
      Math.pow(b - bgB, 2)
    );
    
    // Enhanced green screen detection
    const isGreenScreen = (
      (g > 100 && g > r * 1.3 && g > b * 1.3) || // Classic green screen
      (g > 150 && r < 100 && b < 100) || // Bright green
      (g > r + 40 && g > b + 40 && g > 80) // Green dominance
    );
    
    // Enhanced blue screen detection
    const isBlueScreen = (
      (b > 100 && b > r * 1.3 && b > g * 1.3) || // Classic blue screen
      (b > 150 && r < 100 && g < 100) || // Bright blue
      (b > r + 40 && b > g + 40 && b > 80) // Blue dominance
    );
    
    // Detect cyan/turquoise variants
    const isCyan = (g > 100 && b > 100 && r < 80 && Math.abs(g - b) < 30);
    
    // Remove background pixels completely
    if (colorDiff < 30 || isGreenScreen || isBlueScreen || isCyan) {
      data[i + 3] = 0; // Fully transparent
    }
    // Clean up edge artifacts - no semi-transparent gray pixels
    else if (colorDiff < 60 || 
             (isGreenScreen && colorDiff < 80) || 
             (isBlueScreen && colorDiff < 80)) {
      // Instead of making semi-transparent, use intelligent edge detection
      const edgeStrength = 255 - Math.min(255, colorDiff * 4);
      data[i + 3] = edgeStrength > 128 ? 255 : 0; // Binary transparency
    }
    
    // Enhance remaining character pixels
    if (data[i + 3] > 0) {
      // Boost contrast and saturation for better character visibility
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      const contrast = 1.15;
      const saturation = 1.1;
      
      // Apply contrast
      data[i] = Math.min(255, Math.max(0, ((r - 128) * contrast) + 128));
      data[i + 1] = Math.min(255, Math.max(0, ((g - 128) * contrast) + 128));
      data[i + 2] = Math.min(255, Math.max(0, ((b - 128) * contrast) + 128));
      
      // Apply saturation
      data[i] = Math.min(255, Math.max(0, luminance + (data[i] - luminance) * saturation));
      data[i + 1] = Math.min(255, Math.max(0, luminance + (data[i + 1] - luminance) * saturation));
      data[i + 2] = Math.min(255, Math.max(0, luminance + (data[i + 2] - luminance) * saturation));
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvas;
};

// Create clean character sprite from image
export const createCharacterSprite = async (
  imageUrl: string, 
  options: CharacterRenderOptions
): Promise<HTMLCanvasElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Clear canvas with transparent background
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw image with high quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0);
      
      // Apply background removal if requested
      if (options.removeBackground) {
        const cleanCanvas = removeCharacterBackground(canvas);
        resolve(cleanCanvas);
      } else {
        resolve(canvas);
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load character image'));
    img.src = imageUrl;
  });
};

// Render character with proper integration into scene
export const renderCharacterOnCanvas = (
  targetCtx: CanvasRenderingContext2D,
  characterCanvas: HTMLCanvasElement,
  x: number,
  y: number,
  width: number,
  height: number,
  options: CharacterRenderOptions
) => {
  // Save current context state
  targetCtx.save();
  
  // Apply shadow if requested
  if (options.addShadow) {
    targetCtx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    targetCtx.shadowBlur = 20;
    targetCtx.shadowOffsetX = 0;
    targetCtx.shadowOffsetY = 10;
  }
  
  // Set blend mode
  if (options.blendMode && options.blendMode !== 'normal') {
    targetCtx.globalCompositeOperation = options.blendMode as GlobalCompositeOperation;
  }
  
  // High quality scaling
  targetCtx.imageSmoothingEnabled = true;
  targetCtx.imageSmoothingQuality = 'high';
  
  // Draw the clean character sprite
  targetCtx.drawImage(characterCanvas, x, y, width, height);
  
  // Restore context state
  targetCtx.restore();
};

// Gaming character effects system
export const addGamingEffects = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  effectType: 'warrior' | 'mage' | 'assassin' | 'tank' = 'warrior'
) => {
  ctx.save();
  
  switch (effectType) {
    case 'warrior':
      // Red energy aura
      const warriorGradient = ctx.createRadialGradient(
        x + width/2, y + height/2, 0,
        x + width/2, y + height/2, Math.max(width, height) * 0.8
      );
      warriorGradient.addColorStop(0, 'rgba(255, 0, 0, 0.3)');
      warriorGradient.addColorStop(0.5, 'rgba(255, 100, 0, 0.15)');
      warriorGradient.addColorStop(1, 'transparent');
      
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = warriorGradient;
      ctx.fillRect(x - 50, y - 50, width + 100, height + 100);
      break;
      
    case 'mage':
      // Blue magic aura
      const mageGradient = ctx.createRadialGradient(
        x + width/2, y + height/2, 0,
        x + width/2, y + height/2, Math.max(width, height) * 0.9
      );
      mageGradient.addColorStop(0, 'rgba(0, 100, 255, 0.4)');
      mageGradient.addColorStop(0.5, 'rgba(100, 0, 255, 0.2)');
      mageGradient.addColorStop(1, 'transparent');
      
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = mageGradient;
      ctx.fillRect(x - 60, y - 60, width + 120, height + 120);
      break;
      
    case 'assassin':
      // Dark shadow effects
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.beginPath();
      ctx.ellipse(x + width/2, y + height - 10, width * 0.6, 30, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
      
    case 'tank':
      // Golden protective aura
      const tankGradient = ctx.createRadialGradient(
        x + width/2, y + height/2, 0,
        x + width/2, y + height/2, Math.max(width, height) * 0.7
      );
      tankGradient.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
      tankGradient.addColorStop(0.5, 'rgba(255, 165, 0, 0.15)');
      tankGradient.addColorStop(1, 'transparent');
      
      ctx.globalCompositeOperation = 'overlay';
      ctx.fillStyle = tankGradient;
      ctx.fillRect(x - 40, y - 40, width + 80, height + 80);
      break;
  }
  
  ctx.restore();
};

// Character positioning presets
export const getCharacterPosition = (
  position: string,
  canvasWidth: number,
  canvasHeight: number,
  characterWidth: number,
  characterHeight: number,
  offsetX: number = 0,
  offsetY: number = 0
): { x: number; y: number } => {
  let x, y;
  
  switch (position) {
    case 'bottom-right':
      x = canvasWidth - characterWidth - 50 + offsetX;
      y = canvasHeight - characterHeight - 30 + offsetY;
      break;
    case 'bottom-left':
      x = 50 + offsetX;
      y = canvasHeight - characterHeight - 30 + offsetY;
      break;
    case 'center-right':
      x = canvasWidth - characterWidth - 50 + offsetX;
      y = (canvasHeight - characterHeight) / 2 + offsetY;
      break;
    case 'center-left':
      x = 50 + offsetX;
      y = (canvasHeight - characterHeight) / 2 + offsetY;
      break;
    case 'top-right':
      x = canvasWidth - characterWidth - 50 + offsetX;
      y = 50 + offsetY;
      break;
    case 'top-left':
      x = 50 + offsetX;
      y = 50 + offsetY;
      break;
    case 'full-center':
      x = (canvasWidth - characterWidth) / 2 + offsetX;
      y = (canvasHeight - characterHeight) / 2 + offsetY;
      break;
    case 'bottom-center':
      x = (canvasWidth - characterWidth) / 2 + offsetX;
      y = canvasHeight - characterHeight - 30 + offsetY;
      break;
    case 'top-center':
      x = (canvasWidth - characterWidth) / 2 + offsetX;
      y = 50 + offsetY;
      break;
    default:
      x = canvasWidth - characterWidth - 50 + offsetX;
      y = canvasHeight - characterHeight - 30 + offsetY;
  }
  
  return { x, y };
};