import { useEffect, useRef, useState } from 'react';
import { createCharacterSprite, CharacterRenderOptions } from '../utils/characterRenderer';

interface CharacterDisplayProps {
  imageSrc: string | null;
  config: {
    characterRemoveBackground?: boolean;
    characterBlendMode?: string;
    glowEffect?: boolean;
    backgroundPreset?: string;
    accentColor?: string;
    overlayImageSize?: number;
    characterPosition?: string;
    characterHorizontalOffset?: number;
    characterVerticalOffset?: number;
  };
  className?: string;
  style?: React.CSSProperties;
}

export const CharacterDisplay = ({ 
  imageSrc, 
  config, 
  className = "", 
  style = {} 
}: CharacterDisplayProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!imageSrc || !canvasRef.current) return;

    const renderCharacter = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');

        // Clear canvas with transparent background
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Create render options
        const renderOptions: CharacterRenderOptions = {
          removeBackground: config.characterRemoveBackground !== false,
          enhanceColors: true,
          addShadow: config.glowEffect || false,
          blendMode: config.characterBlendMode || 'normal',
          backgroundColor: config.backgroundPreset || 'transparent'
        };

        // Create clean character sprite
        const characterCanvas = await createCharacterSprite(imageSrc, renderOptions);
        
        // Calculate size to fit canvas while maintaining aspect ratio
        const scale = Math.min(
          canvas.width / characterCanvas.width,
          canvas.height / characterCanvas.height
        );
        
        const width = characterCanvas.width * scale;
        const height = characterCanvas.height * scale;
        const x = (canvas.width - width) / 2;
        const y = (canvas.height - height) / 2;

        // Draw the clean character sprite
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(characterCanvas, x, y, width, height);

        // Add subtle glow effect if enabled
        if (config.glowEffect) {
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          ctx.shadowColor = config.accentColor || '#00d4ff';
          ctx.shadowBlur = 20;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          
          // Draw a subtle glow around the character
          const glowGradient = ctx.createRadialGradient(
            x + width/2, y + height/2, 0,
            x + width/2, y + height/2, Math.max(width, height) * 0.6
          );
          glowGradient.addColorStop(0, `${config.accentColor}20` || 'rgba(0, 212, 255, 0.2)');
          glowGradient.addColorStop(1, 'transparent');
          
          ctx.fillStyle = glowGradient;
          ctx.fillRect(x - 50, y - 50, width + 100, height + 100);
          ctx.restore();
        }

      } catch (err) {
        console.error('Error rendering character:', err);
        setError('Failed to render character');
      } finally {
        setIsLoading(false);
      }
    };

    renderCharacter();
  }, [imageSrc, config]);

  if (!imageSrc) {
    return (
      <div className={`${className} flex items-center justify-center bg-black/20 rounded-lg border-2 border-dashed border-white/20`} style={style}>
        <div className="text-center text-white/60">
          <div className="text-2xl mb-2">🎮</div>
          <div className="text-sm">Upload Character</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-red-900/20 rounded-lg border-2 border-red-500/30`} style={style}>
        <div className="text-center text-red-400">
          <div className="text-2xl mb-2">⚠️</div>
          <div className="text-sm">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative overflow-hidden rounded-lg`} style={style}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}
      
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="w-full h-full object-contain"
        style={{
          backgroundColor: 'transparent',
          imageRendering: 'crisp-edges'
        }}
      />
      
      {/* Character info overlay */}
      <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm rounded-lg p-2">
        <div className="flex items-center justify-between text-xs text-white">
          <span>
            {config.characterRemoveBackground ? '🎭 Background Removed' : '🖼️ Original'}
          </span>
          <span className="text-white/60">
            {config.characterBlendMode || 'Normal'} • {config.overlayImageSize || 25}%
          </span>
        </div>
      </div>
    </div>
  );
};