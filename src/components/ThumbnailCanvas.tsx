
import { useEffect, useRef } from 'react';

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
}

interface ThumbnailCanvasProps {
  config: ThumbnailConfig;
}

const ThumbnailCanvas = ({ config }: ThumbnailCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const getBackgroundStyle = () => {
    if (config.backgroundImage) {
      return {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${config.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    }

    const presets = {
      'neon-city': 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 25%, #2d1b69 50%, #0f0f23 100%)',
      'fire-storm': 'linear-gradient(135deg, #1a0000 0%, #4a0e0e 25%, #8b0000 50%, #ff4500 75%, #1a0000 100%)',
      'ice-cold': 'linear-gradient(135deg, #0a0a2e 0%, #16213e 25%, #1e3a8a 50%, #3b82f6 75%, #0a0a2e 100%)',
      'toxic-green': 'linear-gradient(135deg, #0d1b0d 0%, #1a4d1a 25%, #228b22 50%, #32cd32 75%, #0d1b0d 100%)',
      'royal-purple': 'linear-gradient(135deg, #1a0033 0%, #2d1b4e 25%, #4c1d95 50%, #8b5cf6 75%, #1a0033 100%)'
    };
    
    return {
      background: presets[config.backgroundPreset as keyof typeof presets] || presets['neon-city']
    };
  };

  const getFontSize = () => {
    const sizes = {
      small: { main: 'text-2xl sm:text-3xl lg:text-4xl', sub: 'text-sm sm:text-base lg:text-lg' },
      medium: { main: 'text-3xl sm:text-4xl lg:text-5xl', sub: 'text-base sm:text-lg lg:text-xl' },
      large: { main: 'text-4xl sm:text-5xl lg:text-6xl', sub: 'text-lg sm:text-xl lg:text-2xl' },
      xlarge: { main: 'text-5xl sm:text-6xl lg:text-7xl', sub: 'text-xl sm:text-2xl lg:text-3xl' }
    };
    return sizes[config.fontSize as keyof typeof sizes] || sizes.large;
  };

  const getTextPosition = () => {
    const positions = {
      top: 'items-start pt-8 sm:pt-12',
      center: 'items-center',
      bottom: 'items-end pb-8 sm:pb-12'
    };
    return positions[config.textPosition as keyof typeof positions] || positions.center;
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div 
        ref={canvasRef}
        className={`relative w-full aspect-video rounded-lg overflow-hidden border-2 border-white/20 ${getTextPosition()}`}
        style={{ 
          ...getBackgroundStyle(),
          boxShadow: '0 0 50px rgba(0, 255, 136, 0.2)'
        }}
      >
        {/* Particles Background */}
        {config.showParticles && (
          <div className="absolute inset-0 opacity-30">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 3}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Content Container */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 sm:px-8">
          {/* Main Text */}
          <h1 
            className={`font-black uppercase tracking-wider mb-2 sm:mb-4 leading-tight ${config.glowEffect ? 'drop-shadow-2xl' : ''} ${getFontSize().main}`}
            style={{ 
              color: config.textColor,
              textShadow: config.glowEffect ? `0 0 30px ${config.accentColor}` : 'none',
              WebkitTextStroke: `1px ${config.accentColor}`,
              filter: config.glowEffect ? `drop-shadow(0 0 20px ${config.accentColor})` : 'none'
            }}
          >
            {config.mainText}
          </h1>

          {/* Sub Text */}
          {config.subText && (
            <p 
              className={`font-bold uppercase tracking-widest opacity-90 ${getFontSize().sub}`}
              style={{ 
                color: config.accentColor,
                textShadow: config.glowEffect ? `0 0 15px ${config.accentColor}` : 'none'
              }}
            >
              {config.subText}
            </p>
          )}

          {/* Accent Elements */}
          <div className="absolute top-4 sm:top-8 right-4 sm:right-8">
            <div 
              className="w-2 h-2 sm:w-4 sm:h-4 rounded-full animate-pulse"
              style={{ backgroundColor: config.accentColor }}
            />
          </div>
          <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8">
            <div 
              className="w-4 h-0.5 sm:w-6 sm:h-1 rounded-full animate-pulse"
              style={{ backgroundColor: config.accentColor }}
            />
          </div>
        </div>

        {/* Border Glow Effect */}
        {config.glowEffect && (
          <div 
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              boxShadow: `inset 0 0 50px ${config.accentColor}20, 0 0 100px ${config.accentColor}10`
            }}
          />
        )}
      </div>

      {/* Dimensions Label */}
      <p className="text-center text-white/60 text-xs sm:text-sm mt-2 sm:mt-4">
        YouTube Thumbnail Format • 1280×720 pixels
      </p>
    </div>
  );
};

export default ThumbnailCanvas;
