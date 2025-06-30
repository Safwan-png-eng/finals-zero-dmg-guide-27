
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
  overlayImage: string | null;
  textShadow: boolean;
  borderGlow: boolean;
}

interface ThumbnailCanvasProps {
  config: ThumbnailConfig;
}

const ThumbnailCanvas = ({ config }: ThumbnailCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const getBackgroundStyle = () => {
    if (config.backgroundImage) {
      return {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${config.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    }

    const presets = {
      'neon-city': {
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 25%, #2d1b69 50%, #4c1d95 75%, #0f0f23 100%)',
        overlay: 'radial-gradient(circle at 30% 30%, rgba(0, 255, 136, 0.1) 0%, transparent 50%)'
      },
      'fire-storm': {
        background: 'linear-gradient(135deg, #1a0000 0%, #4a0e0e 25%, #8b0000 50%, #ff4500 75%, #ff6b00 100%)',
        overlay: 'radial-gradient(circle at 70% 70%, rgba(255, 69, 0, 0.2) 0%, transparent 50%)'
      },
      'ice-cold': {
        background: 'linear-gradient(135deg, #0a0a2e 0%, #16213e 25%, #1e3a8a 50%, #3b82f6 75%, #60a5fa 100%)',
        overlay: 'radial-gradient(circle at 50% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)'
      },
      'toxic-green': {
        background: 'linear-gradient(135deg, #0d1b0d 0%, #1a4d1a 25%, #228b22 50%, #32cd32 75%, #00ff00 100%)',
        overlay: 'radial-gradient(circle at 20% 80%, rgba(50, 205, 50, 0.15) 0%, transparent 50%)'
      },
      'royal-purple': {
        background: 'linear-gradient(135deg, #1a0033 0%, #2d1b4e 25%, #4c1d95 50%, #8b5cf6 75%, #a855f7 100%)',
        overlay: 'radial-gradient(circle at 80% 30%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)'
      }
    };
    
    const preset = presets[config.backgroundPreset as keyof typeof presets] || presets['neon-city'];
    return {
      background: preset.background,
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        background: preset.overlay,
        pointerEvents: 'none'
      }
    };
  };

  const getFontSize = () => {
    const sizes = {
      small: { main: 'text-2xl sm:text-3xl lg:text-4xl xl:text-5xl', sub: 'text-sm sm:text-base lg:text-lg xl:text-xl' },
      medium: { main: 'text-3xl sm:text-4xl lg:text-5xl xl:text-6xl', sub: 'text-base sm:text-lg lg:text-xl xl:text-2xl' },
      large: { main: 'text-4xl sm:text-5xl lg:text-6xl xl:text-7xl', sub: 'text-lg sm:text-xl lg:text-2xl xl:text-3xl' },
      xlarge: { main: 'text-5xl sm:text-6xl lg:text-7xl xl:text-8xl', sub: 'text-xl sm:text-2xl lg:text-3xl xl:text-4xl' }
    };
    return sizes[config.fontSize as keyof typeof sizes] || sizes.large;
  };

  const getTextPosition = () => {
    const positions = {
      top: 'items-start justify-start pt-8 sm:pt-12 lg:pt-16',
      center: 'items-center justify-center',
      bottom: 'items-end justify-end pb-8 sm:pb-12 lg:pb-16'
    };
    return positions[config.textPosition as keyof typeof positions] || positions.center;
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div 
        ref={canvasRef}
        className={`relative w-full aspect-video rounded-2xl overflow-hidden border-2 transition-all duration-500 ${config.borderGlow ? 'border-white/30 shadow-2xl' : 'border-white/20'} ${getTextPosition()}`}
        style={{ 
          ...getBackgroundStyle(),
          boxShadow: config.borderGlow ? `0 0 60px ${config.accentColor}40, 0 0 120px ${config.accentColor}20` : '0 0 50px rgba(0, 0, 0, 0.5)'
        }}
      >
        {/* Animated Particles Background */}
        {config.showParticles && (
          <div className="absolute inset-0 opacity-40">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 6 + 2}px`,
                  height: `${Math.random() * 6 + 2}px`,
                  backgroundColor: i % 3 === 0 ? config.accentColor : '#ffffff',
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 4}s`,
                  filter: 'blur(0.5px)'
                }}
              />
            ))}
          </div>
        )}

        {/* Dynamic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-transparent" />

        {/* Overlay Image */}
        {config.overlayImage && (
          <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 w-20 h-20 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-xl overflow-hidden border-2 border-white/30 shadow-2xl">
            <img 
              src={config.overlayImage} 
              alt="Overlay" 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content Container */}
        <div className="relative z-20 h-full flex flex-col text-center px-4 sm:px-8 lg:px-12">
          {/* Main Text */}
          <h1 
            className={`font-black uppercase tracking-wider leading-tight transition-all duration-300 ${getFontSize().main}`}
            style={{ 
              color: config.textColor,
              textShadow: config.textShadow ? `0 0 30px ${config.accentColor}, 0 0 60px ${config.accentColor}80, 4px 4px 8px rgba(0,0,0,0.8)` : '4px 4px 8px rgba(0,0,0,0.8)',
              WebkitTextStroke: `2px ${config.accentColor}`,
              filter: config.glowEffect ? `drop-shadow(0 0 20px ${config.accentColor}) drop-shadow(0 0 40px ${config.accentColor}40)` : 'none',
              letterSpacing: '0.05em'
            }}
          >
            {config.mainText}
          </h1>

          {/* Sub Text */}
          {config.subText && (
            <p 
              className={`font-bold uppercase tracking-widest opacity-95 mt-2 sm:mt-4 transition-all duration-300 ${getFontSize().sub}`}
              style={{ 
                color: config.accentColor,
                textShadow: config.textShadow ? `0 0 20px ${config.accentColor}, 0 0 40px ${config.accentColor}60, 2px 2px 4px rgba(0,0,0,0.8)` : '2px 2px 4px rgba(0,0,0,0.8)',
                filter: config.glowEffect ? `drop-shadow(0 0 15px ${config.accentColor}) drop-shadow(0 0 30px ${config.accentColor}40)` : 'none'
              }}
            >
              {config.subText}
            </p>
          )}
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 sm:top-8 right-4 sm:right-8 flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i}
              className="w-2 h-2 sm:w-3 sm:h-3 rounded-full animate-pulse"
              style={{ 
                backgroundColor: config.accentColor,
                animationDelay: `${i * 0.3}s`,
                filter: `drop-shadow(0 0 8px ${config.accentColor})`
              }}
            />
          ))}
        </div>
        
        <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8">
          <div 
            className="w-8 h-1 sm:w-12 sm:h-1.5 rounded-full animate-pulse"
            style={{ 
              backgroundColor: config.accentColor,
              filter: `drop-shadow(0 0 8px ${config.accentColor})`
            }}
          />
        </div>

        {/* Corner Accent */}
        <div className="absolute top-0 left-0 w-20 h-20 sm:w-32 sm:h-32">
          <div 
            className="w-full h-full rounded-br-3xl opacity-20"
            style={{ 
              background: `linear-gradient(135deg, ${config.accentColor} 0%, transparent 70%)`
            }}
          />
        </div>
      </div>

      {/* Enhanced Dimensions Label */}
      <div className="text-center mt-4 sm:mt-6">
        <p className="text-white/60 text-sm sm:text-base">
          <span className="text-cyan-400 font-semibold">YouTube Thumbnail Format</span> • 1280×720 pixels • HD Ready
        </p>
      </div>
    </div>
  );
};

export default ThumbnailCanvas;
