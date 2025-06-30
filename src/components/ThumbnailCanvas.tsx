
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
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1b3e 15%, #2d1b69 35%, #4c1d95 55%, #6b46c1 75%, #3b1d4f 100%)',
        overlay: 'radial-gradient(circle at 20% 80%, rgba(0, 255, 136, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)'
      },
      'fire-storm': {
        background: 'linear-gradient(135deg, #0f0000 0%, #2a0505 15%, #4a0e0e 30%, #8b0000 50%, #b91c1c 70%, #dc2626 85%, #ff4500 100%)',
        overlay: 'radial-gradient(circle at 30% 30%, rgba(255, 69, 0, 0.3) 0%, transparent 60%), radial-gradient(circle at 70% 70%, rgba(220, 38, 38, 0.2) 0%, transparent 50%)'
      },
      'ice-cold': {
        background: 'linear-gradient(135deg, #020617 0%, #0f172a 15%, #1e293b 30%, #334155 45%, #1e3a8a 60%, #3b82f6 75%, #60a5fa 90%, #93c5fd 100%)',
        overlay: 'radial-gradient(circle at 50% 20%, rgba(59, 130, 246, 0.2) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(147, 197, 253, 0.15) 0%, transparent 50%)'
      },
      'toxic-green': {
        background: 'linear-gradient(135deg, #0d1b0d 0%, #1a4d1a 15%, #166534 30%, #15803d 45%, #16a34a 60%, #22c55e 75%, #4ade80 90%, #86efac 100%)',
        overlay: 'radial-gradient(circle at 70% 30%, rgba(34, 197, 94, 0.25) 0%, transparent 60%), radial-gradient(circle at 30% 70%, rgba(74, 222, 128, 0.15) 0%, transparent 50%)'
      },
      'royal-purple': {
        background: 'linear-gradient(135deg, #1a0033 0%, #2d1b4e 15%, #4c1d95 30%, #6b46c1 45%, #8b5cf6 60%, #a855f7 75%, #c084fc 90%, #d8b4fe 100%)',
        overlay: 'radial-gradient(circle at 80% 30%, rgba(139, 92, 246, 0.2) 0%, transparent 60%), radial-gradient(circle at 20% 70%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)'
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
      small: { main: 'text-3xl sm:text-4xl lg:text-5xl xl:text-6xl', sub: 'text-base sm:text-lg lg:text-xl xl:text-2xl' },
      medium: { main: 'text-4xl sm:text-5xl lg:text-6xl xl:text-7xl', sub: 'text-lg sm:text-xl lg:text-2xl xl:text-3xl' },
      large: { main: 'text-5xl sm:text-6xl lg:text-7xl xl:text-8xl', sub: 'text-xl sm:text-2xl lg:text-3xl xl:text-4xl' },
      xlarge: { main: 'text-6xl sm:text-7xl lg:text-8xl xl:text-9xl', sub: 'text-2xl sm:text-3xl lg:text-4xl xl:text-5xl' }
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
        {/* Enhanced Animated Particles Background */}
        {config.showParticles && (
          <div className="absolute inset-0 opacity-50">
            {[...Array(40)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 8 + 2}px`,
                  height: `${Math.random() * 8 + 2}px`,
                  backgroundColor: i % 4 === 0 ? config.accentColor : i % 4 === 1 ? '#ffffff' : i % 4 === 2 ? `${config.accentColor}80` : '#f0f0f0',
                  animationDelay: `${Math.random() * 4}s`,
                  animationDuration: `${2 + Math.random() * 6}s`,
                  filter: 'blur(0.5px)',
                  boxShadow: `0 0 ${Math.random() * 10 + 5}px ${i % 2 === 0 ? config.accentColor : '#ffffff'}40`
                }}
              />
            ))}
          </div>
        )}

        {/* Enhanced Dynamic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/10 to-black/50" />

        {/* Overlay Image */}
        {config.overlayImage && (
          <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48 rounded-xl overflow-hidden border-3 border-white/40 shadow-2xl">
            <img 
              src={config.overlayImage} 
              alt="Overlay" 
              className="w-full h-full object-cover"
              style={{
                filter: config.glowEffect ? `drop-shadow(0 0 20px ${config.accentColor}60)` : 'none'
              }}
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
              fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              fontWeight: '900',
              textShadow: config.textShadow ? `0 0 40px ${config.accentColor}, 0 0 80px ${config.accentColor}60, 6px 6px 12px rgba(0,0,0,0.9), 0 0 100px ${config.accentColor}40` : '6px 6px 12px rgba(0,0,0,0.9)',
              WebkitTextStroke: `3px ${config.accentColor}`,
              filter: config.glowEffect ? `drop-shadow(0 0 30px ${config.accentColor}) drop-shadow(0 0 60px ${config.accentColor}40) drop-shadow(0 0 90px ${config.accentColor}20)` : 'none',
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}
          >
            {config.mainText}
          </h1>

          {/* Sub Text */}
          {config.subText && (
            <p 
              className={`font-bold uppercase tracking-widest opacity-95 mt-3 sm:mt-5 transition-all duration-300 ${getFontSize().sub}`}
              style={{ 
                color: config.accentColor,
                fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                fontWeight: '800',
                textShadow: config.textShadow ? `0 0 30px ${config.accentColor}, 0 0 60px ${config.accentColor}50, 4px 4px 8px rgba(0,0,0,0.9), 0 0 80px ${config.accentColor}30` : '4px 4px 8px rgba(0,0,0,0.9)',
                filter: config.glowEffect ? `drop-shadow(0 0 25px ${config.accentColor}) drop-shadow(0 0 50px ${config.accentColor}40)` : 'none',
                letterSpacing: '0.15em'
              }}
            >
              {config.subText}
            </p>
          )}
        </div>

        {/* Enhanced Decorative Elements */}
        <div className="absolute top-6 sm:top-10 right-6 sm:right-10 flex space-x-3">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i}
              className="w-3 h-3 sm:w-4 sm:h-4 rounded-full animate-pulse"
              style={{ 
                backgroundColor: config.accentColor,
                animationDelay: `${i * 0.4}s`,
                filter: `drop-shadow(0 0 12px ${config.accentColor}) drop-shadow(0 0 24px ${config.accentColor}60)`,
                boxShadow: `0 0 20px ${config.accentColor}80`
              }}
            />
          ))}
        </div>
        
        <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10">
          <div 
            className="w-12 h-2 sm:w-16 sm:h-2.5 rounded-full animate-pulse"
            style={{ 
              backgroundColor: config.accentColor,
              filter: `drop-shadow(0 0 12px ${config.accentColor}) drop-shadow(0 0 24px ${config.accentColor}60)`,
              boxShadow: `0 0 20px ${config.accentColor}80`
            }}
          />
        </div>

        {/* Enhanced Corner Accents */}
        <div className="absolute top-0 left-0 w-24 h-24 sm:w-40 sm:h-40">
          <div 
            className="w-full h-full rounded-br-3xl opacity-25"
            style={{ 
              background: `linear-gradient(135deg, ${config.accentColor} 0%, ${config.accentColor}80 50%, transparent 100%)`
            }}
          />
        </div>

        <div className="absolute bottom-0 right-0 w-20 h-20 sm:w-32 sm:h-32">
          <div 
            className="w-full h-full rounded-tl-3xl opacity-20"
            style={{ 
              background: `linear-gradient(315deg, ${config.accentColor} 0%, ${config.accentColor}60 50%, transparent 100%)`
            }}
          />
        </div>

        {/* Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(${config.accentColor}40 1px, transparent 1px), linear-gradient(90deg, ${config.accentColor}40 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
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
