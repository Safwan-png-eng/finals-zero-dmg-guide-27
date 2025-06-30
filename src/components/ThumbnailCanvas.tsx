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

interface ThumbnailCanvasProps {
  config: ThumbnailConfig;
}

const ThumbnailCanvas = ({ config }: ThumbnailCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const getBackgroundStyle = () => {
    if (config.backgroundImage) {
      return {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.4)), url(${config.backgroundImage})`,
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
      'monaco-streets': {
        background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.4)), url(/lovable-uploads/ff01c07f-8a42-4b34-bd5d-814ea69de169.png)`,
        overlay: 'radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.15) 0%, transparent 70%)'
      },
      'urban-battlefield': {
        background: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.3)), url(/lovable-uploads/2385a088-db61-4395-a7df-433b98126931.png)`,
        overlay: 'radial-gradient(circle at 40% 60%, rgba(255, 107, 53, 0.2) 0%, transparent 60%)'
      },
      'smoke-dust': {
        background: 'linear-gradient(135deg, #2a2520 0%, #3d3528 20%, #5c5247 40%, #8b7355 70%, #d4c4a8 95%, #f0e6d2 100%)',
        overlay: 'radial-gradient(circle at 50% 80%, rgba(212, 196, 168, 0.25) 0%, transparent 70%), radial-gradient(circle at 20% 20%, rgba(139, 115, 85, 0.15) 0%, transparent 50%)'
      },
      'fire-storm': {
        background: 'linear-gradient(135deg, #0f0000 0%, #2a0505 15%, #4a0e0e 30%, #8b0000 50%, #b91c1c 70%, #dc2626 85%, #ff4500 100%)',
        overlay: 'radial-gradient(circle at 30% 30%, rgba(255, 69, 0, 0.25) 0%, transparent 60%), radial-gradient(circle at 70% 70%, rgba(220, 38, 38, 0.15) 0%, transparent 50%)'
      },
      'ice-cold': {
        background: 'linear-gradient(135deg, #020617 0%, #0f172a 15%, #1e293b 30%, #334155 45%, #1e3a8a 60%, #3b82f6 75%, #60a5fa 90%, #93c5fd 100%)',
        overlay: 'radial-gradient(circle at 50% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(147, 197, 253, 0.1) 0%, transparent 50%)'
      },
      'toxic-green': {
        background: 'linear-gradient(135deg, #0d1b0d 0%, #1a4d1a 15%, #166534 30%, #15803d 45%, #16a34a 60%, #22c55e 75%, #4ade80 90%, #86efac 100%)',
        overlay: 'radial-gradient(circle at 70% 30%, rgba(34, 197, 94, 0.2) 0%, transparent 60%), radial-gradient(circle at 30% 70%, rgba(74, 222, 128, 0.1) 0%, transparent 50%)'
      },
      'cyberpunk-pink': {
        background: 'linear-gradient(135deg, #1a0033 0%, #330066 20%, #4c0080 40%, #8000ff 60%, #ff00ff 80%, #ff80ff 100%)',
        overlay: 'radial-gradient(circle at 60% 40%, rgba(255, 0, 255, 0.25) 0%, transparent 60%), radial-gradient(circle at 40% 60%, rgba(128, 0, 255, 0.15) 0%, transparent 50%)'
      }
    };
    
    const preset = presets[config.backgroundPreset as keyof typeof presets] || presets['neon-city'];
    return {
      background: preset.background,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
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
      small: { main: 'text-xl sm:text-2xl lg:text-3xl', sub: 'text-xs sm:text-sm lg:text-base' },
      medium: { main: 'text-2xl sm:text-3xl lg:text-4xl', sub: 'text-sm sm:text-base lg:text-lg' },
      large: { main: 'text-3xl sm:text-4xl lg:text-5xl', sub: 'text-base sm:text-lg lg:text-xl' },
      xlarge: { main: 'text-4xl sm:text-5xl lg:text-6xl', sub: 'text-lg sm:text-xl lg:text-2xl' }
    };
    return sizes[config.fontSize as keyof typeof sizes] || sizes.medium;
  };

  const getTextPosition = () => {
    const positions = {
      top: 'items-start justify-center pt-6 sm:pt-8',
      center: 'items-center justify-center',
      bottom: 'items-end justify-center pb-6 sm:pb-8'
    };
    return positions[config.textPosition as keyof typeof positions] || positions.center;
  };

  const getFontFamily = () => {
    const fonts = {
      'arial': 'Arial, sans-serif',
      'impact': 'Impact, Arial Black, sans-serif',
      'bebas': 'Bebas Neue, Impact, sans-serif',
      'oswald': 'Oswald, Impact, sans-serif',
      'roboto': 'Roboto, Arial, sans-serif'
    };
    return fonts[config.customFont as keyof typeof fonts] || fonts.impact;
  };

  const getLetterSpacing = () => {
    const spacing = {
      'tight': '-0.025em',
      'normal': '0em',
      'wide': '0.1em',
      'wider': '0.2em'
    };
    return spacing[config.letterSpacing as keyof typeof spacing] || spacing.normal;
  };

  const getLineHeight = () => {
    const heights = {
      'tight': '0.9',
      'normal': '1.1',
      'relaxed': '1.3'
    };
    return heights[config.lineHeight as keyof typeof heights] || heights.normal;
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div 
        ref={canvasRef}
        className={`relative w-full aspect-video rounded-xl overflow-hidden border transition-all duration-500 ${config.borderGlow ? 'border-white/20 shadow-xl' : 'border-white/10'} ${getTextPosition()}`}
        style={{ 
          ...getBackgroundStyle(),
          boxShadow: config.borderGlow ? `0 0 30px ${config.accentColor}30, 0 0 60px ${config.accentColor}15` : '0 0 25px rgba(0, 0, 0, 0.3)'
        }}
      >
        {/* Particles Background */}
        {config.showParticles && (
          <div className="absolute inset-0 opacity-30">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 4 + 1}px`,
                  height: `${Math.random() * 4 + 1}px`,
                  backgroundColor: i % 3 === 0 ? config.accentColor : i % 3 === 1 ? '#ffffff60' : '#ffdd0060',
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 4}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Subtle Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

        {/* Overlay Image */}
        {config.overlayImage && (
          <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 w-24 h-32 sm:w-36 sm:h-48 lg:w-48 lg:h-64 rounded-lg overflow-hidden border-2 border-white/30 shadow-lg">
            <img 
              src={config.overlayImage} 
              alt="Character" 
              className="w-full h-full object-cover object-center"
              style={{
                filter: config.glowEffect ? `drop-shadow(0 0 15px ${config.accentColor}40) contrast(1.05) saturate(1.1)` : 'contrast(1.05) saturate(1.1)',
                opacity: 0.95
              }}
            />
          </div>
        )}

        {/* Content Container */}
        <div className={`relative z-20 h-full flex flex-col text-center px-4 sm:px-6 ${config.animatedText ? 'animate-pulse' : ''}`}>
          {/* Text Background */}
          {config.textBackground && (
            <div 
              className="absolute inset-0 rounded-lg"
              style={{
                backgroundColor: config.textBackgroundColor,
                opacity: config.textBackgroundOpacity / 100,
                backdropFilter: 'blur(4px)'
              }}
            />
          )}

          {/* Main Text */}
          <h1 
            className={`font-black uppercase leading-tight transition-all duration-300 ${getFontSize().main} relative z-10`}
            style={{ 
              color: config.gradientText ? 'transparent' : config.textColor,
              fontFamily: getFontFamily(),
              fontWeight: '900',
              textShadow: config.textShadow ? 
                `2px 2px 4px rgba(0,0,0,0.7), 0 0 20px ${config.accentColor}60` : 
                '2px 2px 4px rgba(0,0,0,0.7)',
              WebkitTextStroke: config.textOutline ? `1px ${config.accentColor}` : 'none',
              filter: config.glowEffect ? 
                `drop-shadow(0 0 20px ${config.accentColor}60) contrast(1.05)` : 
                'contrast(1.05)',
              letterSpacing: getLetterSpacing(),
              lineHeight: getLineHeight(),
              opacity: config.textOpacity / 100,
              transform: `rotate(${config.textRotation}deg)`,
              background: config.gradientText ? 
                `linear-gradient(45deg, ${config.textColor}, ${config.accentColor}, ${config.textColor})` : 
                'none',
              WebkitBackgroundClip: config.gradientText ? 'text' : 'unset',
              backgroundClip: config.gradientText ? 'text' : 'unset'
            }}
          >
            {config.mainText}
          </h1>

          {/* Sub Text */}
          {config.subText && (
            <p 
              className={`font-bold uppercase tracking-wide opacity-90 mt-2 transition-all duration-300 ${getFontSize().sub} relative z-10`}
              style={{ 
                color: config.gradientText ? 'transparent' : config.accentColor,
                fontFamily: getFontFamily(),
                fontWeight: '700',
                textShadow: config.textShadow ? 
                  `1px 1px 3px rgba(0,0,0,0.7), 0 0 15px ${config.accentColor}50` : 
                  '1px 1px 3px rgba(0,0,0,0.7)',
                filter: config.glowEffect ? 
                  `drop-shadow(0 0 15px ${config.accentColor}50) contrast(1.05)` : 
                  'contrast(1.05)',
                letterSpacing: getLetterSpacing(),
                opacity: (config.textOpacity / 100) * 0.9,
                background: config.gradientText ? 
                  `linear-gradient(45deg, ${config.accentColor}, ${config.textColor}, ${config.accentColor})` : 
                  'none',
                WebkitBackgroundClip: config.gradientText ? 'text' : 'unset',
                backgroundClip: config.gradientText ? 'text' : 'unset'
              }}
            >
              {config.subText}
            </p>
          )}
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i}
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ 
                backgroundColor: config.accentColor,
                animationDelay: `${i * 0.3}s`,
                opacity: 0.7
              }}
            />
          ))}
        </div>
        
        <div className="absolute bottom-4 left-4">
          <div 
            className="w-12 h-1 rounded-full animate-pulse"
            style={{ 
              backgroundColor: config.accentColor,
              opacity: 0.6
            }}
          />
        </div>

        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-20 h-20">
          <div 
            className="w-full h-full rounded-br-2xl opacity-15"
            style={{ 
              background: `linear-gradient(135deg, ${config.accentColor} 0%, transparent 100%)`
            }}
          />
        </div>

        <div className="absolute bottom-0 right-0 w-16 h-16">
          <div 
            className="w-full h-full rounded-tl-2xl opacity-10"
            style={{ 
              background: `linear-gradient(315deg, ${config.accentColor} 0%, transparent 100%)`
            }}
          />
        </div>

        {/* Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(${config.accentColor}30 1px, transparent 1px), linear-gradient(90deg, ${config.accentColor}30 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Dimensions Label */}
      <div className="text-center mt-3">
        <p className="text-white/50 text-sm">
          <span className="text-cyan-400 font-medium">YouTube Thumbnail</span> • 1280×720 • HD Ready
        </p>
      </div>
    </div>
  );
};

export default ThumbnailCanvas;
