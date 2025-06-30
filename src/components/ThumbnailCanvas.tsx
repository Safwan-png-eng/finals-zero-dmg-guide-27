
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
      'destruction-zone': {
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 20%, #4a4a4a 40%, #ff6b35 70%, #ffaa00 90%, #999 100%)',
        overlay: 'radial-gradient(circle at 30% 70%, rgba(255, 107, 53, 0.3) 0%, transparent 60%), radial-gradient(circle at 70% 30%, rgba(255, 170, 0, 0.2) 0%, transparent 50%)'
      },
      'finals-arena': {
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a3e 15%, #2d1b4e 30%, #3d2a78 50%, #ff0080 80%, #00d4ff 100%)',
        overlay: 'radial-gradient(circle at 25% 25%, rgba(255, 0, 128, 0.25) 0%, transparent 60%), radial-gradient(circle at 75% 75%, rgba(0, 212, 255, 0.2) 0%, transparent 50%)'
      },
      'smoke-dust': {
        background: 'linear-gradient(135deg, #2a2520 0%, #3d3528 20%, #5c5247 40%, #8b7355 70%, #d4c4a8 95%, #f0e6d2 100%)',
        overlay: 'radial-gradient(circle at 50% 80%, rgba(212, 196, 168, 0.3) 0%, transparent 70%), radial-gradient(circle at 20% 20%, rgba(139, 115, 85, 0.2) 0%, transparent 50%)'
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
      'cyberpunk-pink': {
        background: 'linear-gradient(135deg, #1a0033 0%, #330066 20%, #4c0080 40%, #8000ff 60%, #ff00ff 80%, #ff80ff 100%)',
        overlay: 'radial-gradient(circle at 60% 40%, rgba(255, 0, 255, 0.3) 0%, transparent 60%), radial-gradient(circle at 40% 60%, rgba(128, 0, 255, 0.2) 0%, transparent 50%)'
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
          <div className="absolute inset-0 opacity-40">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 8 + 2}px`,
                  height: `${Math.random() * 8 + 2}px`,
                  backgroundColor: i % 5 === 0 ? config.accentColor : i % 5 === 1 ? '#ffffff' : i % 5 === 2 ? `${config.accentColor}80` : i % 5 === 3 ? '#f0f0f0' : '#ffdd00',
                  animationDelay: `${Math.random() * 4}s`,
                  animationDuration: `${2 + Math.random() * 6}s`,
                  filter: 'blur(0.5px)',
                  boxShadow: `0 0 ${Math.random() * 12 + 5}px ${i % 3 === 0 ? config.accentColor : i % 3 === 1 ? '#ffffff' : '#ffdd00'}50`
                }}
              />
            ))}
          </div>
        )}

        {/* Enhanced Dynamic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/5 to-black/40" />

        {/* Destruction/Smoke Effect Overlay */}
        {(config.backgroundPreset === 'destruction-zone' || config.backgroundPreset === 'smoke-dust') && (
          <div className="absolute inset-0 opacity-30">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 40 + 20}px`,
                  height: `${Math.random() * 40 + 20}px`,
                  backgroundColor: i % 3 === 0 ? '#8b7355' : i % 3 === 1 ? '#d4c4a8' : '#5c5247',
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${4 + Math.random() * 8}s`,
                  filter: 'blur(8px)',
                  opacity: 0.4
                }}
              />
            ))}
          </div>
        )}

        {/* Overlay Image */}
        {config.overlayImage && (
          <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48 rounded-xl overflow-hidden border-3 border-white/40 shadow-2xl">
            <img 
              src={config.overlayImage} 
              alt="Overlay" 
              className="w-full h-full object-cover"
              style={{
                filter: config.glowEffect ? `drop-shadow(0 0 25px ${config.accentColor}60) contrast(1.1) saturate(1.2)` : 'contrast(1.1) saturate(1.2)'
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
              fontFamily: '"Arial Black", "Helvetica Neue", Arial, sans-serif',
              fontWeight: '900',
              textShadow: config.textShadow ? 
                `0 0 50px ${config.accentColor}, 0 0 100px ${config.accentColor}60, 8px 8px 16px rgba(0,0,0,0.9), 0 0 120px ${config.accentColor}40, 4px 4px 0px rgba(0,0,0,0.8), -4px -4px 0px rgba(0,0,0,0.8)` : 
                '8px 8px 16px rgba(0,0,0,0.9), 4px 4px 0px rgba(0,0,0,0.8), -4px -4px 0px rgba(0,0,0,0.8)',
              WebkitTextStroke: `4px ${config.accentColor}`,
              filter: config.glowEffect ? 
                `drop-shadow(0 0 40px ${config.accentColor}) drop-shadow(0 0 80px ${config.accentColor}40) drop-shadow(0 0 120px ${config.accentColor}20) contrast(1.1)` : 
                'contrast(1.1)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}
          >
            {config.mainText}
          </h1>

          {/* Sub Text */}
          {config.subText && (
            <p 
              className={`font-bold uppercase tracking-widest opacity-95 mt-4 sm:mt-6 transition-all duration-300 ${getFontSize().sub}`}
              style={{ 
                color: config.accentColor,
                fontFamily: '"Arial Black", "Helvetica Neue", Arial, sans-serif',
                fontWeight: '800',
                textShadow: config.textShadow ? 
                  `0 0 40px ${config.accentColor}, 0 0 80px ${config.accentColor}50, 6px 6px 12px rgba(0,0,0,0.9), 0 0 100px ${config.accentColor}30, 2px 2px 0px rgba(0,0,0,0.8), -2px -2px 0px rgba(0,0,0,0.8)` : 
                  '6px 6px 12px rgba(0,0,0,0.9), 2px 2px 0px rgba(0,0,0,0.8), -2px -2px 0px rgba(0,0,0,0.8)',
                filter: config.glowEffect ? 
                  `drop-shadow(0 0 30px ${config.accentColor}) drop-shadow(0 0 60px ${config.accentColor}40) contrast(1.1)` : 
                  'contrast(1.1)',
                letterSpacing: '0.2em'
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
                filter: `drop-shadow(0 0 15px ${config.accentColor}) drop-shadow(0 0 30px ${config.accentColor}60)`,
                boxShadow: `0 0 25px ${config.accentColor}80`
              }}
            />
          ))}
        </div>
        
        <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10">
          <div 
            className="w-16 h-2 sm:w-20 sm:h-3 rounded-full animate-pulse"
            style={{ 
              backgroundColor: config.accentColor,
              filter: `drop-shadow(0 0 15px ${config.accentColor}) drop-shadow(0 0 30px ${config.accentColor}60)`,
              boxShadow: `0 0 25px ${config.accentColor}80`
            }}
          />
        </div>

        {/* Enhanced Corner Accents */}
        <div className="absolute top-0 left-0 w-28 h-28 sm:w-44 sm:h-44">
          <div 
            className="w-full h-full rounded-br-3xl opacity-25"
            style={{ 
              background: `linear-gradient(135deg, ${config.accentColor} 0%, ${config.accentColor}80 50%, transparent 100%)`
            }}
          />
        </div>

        <div className="absolute bottom-0 right-0 w-24 h-24 sm:w-36 sm:h-36">
          <div 
            className="w-full h-full rounded-tl-3xl opacity-20"
            style={{ 
              background: `linear-gradient(315deg, ${config.accentColor} 0%, ${config.accentColor}60 50%, transparent 100%)`
            }}
          />
        </div>

        {/* Enhanced Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-8"
          style={{
            backgroundImage: `linear-gradient(${config.accentColor}40 1px, transparent 1px), linear-gradient(90deg, ${config.accentColor}40 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />

        {/* THE FINALS Style Corner Elements */}
        <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
          <div 
            className="w-8 h-1 sm:w-12 sm:h-1.5 mb-1 rounded-full"
            style={{ 
              backgroundColor: config.accentColor,
              boxShadow: `0 0 20px ${config.accentColor}60`
            }}
          />
          <div 
            className="w-4 h-1 sm:w-6 sm:h-1 rounded-full opacity-60"
            style={{ 
              backgroundColor: config.accentColor,
              boxShadow: `0 0 15px ${config.accentColor}40`
            }}
          />
        </div>

        <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 flex flex-col items-end">
          <div 
            className="w-6 h-1 sm:w-8 sm:h-1 mb-1 rounded-full opacity-60"
            style={{ 
              backgroundColor: config.accentColor,
              boxShadow: `0 0 15px ${config.accentColor}40`
            }}
          />
          <div 
            className="w-10 h-1 sm:w-14 sm:h-1.5 rounded-full"
            style={{ 
              backgroundColor: config.accentColor,
              boxShadow: `0 0 20px ${config.accentColor}60`
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
