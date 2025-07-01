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
}

interface ThumbnailCanvasProps {
  config: ThumbnailConfig;
}

const ThumbnailCanvas = ({ config }: ThumbnailCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  console.log('ThumbnailCanvas render with config:', {
    overlayImage: config.overlayImage ? 'present' : 'null',
    overlayImageSize: config.overlayImageSize,
    backgroundImage: config.backgroundImage ? 'present' : 'null',
    backgroundPreset: config.backgroundPreset
  });

  const getBackgroundStyle = () => {
    if (config.backgroundImage && config.backgroundImage !== 'null') {
      return {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.4)), url(${config.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    }
    
    // Use gradient based on preset
    const presetGradients = {
      'las-vegas': 'linear-gradient(135deg, #1a0a00 0%, #4a1f00 25%, #ff6600 75%, #ffcc00 100%)',
      'neon-city': 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 25%, #2d1b69 75%, #0f0f23 100%)',
      'destruction-zone': 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 25%, #ff6b35 75%, #666666 100%)',
      'finals-arena': 'linear-gradient(135deg, #0f0f1a 0%, #1a1a3e 25%, #3d2a78 75%, #ff0080 100%)',
      'fire-storm': 'linear-gradient(135deg, #1a0000 0%, #4a0e0e 25%, #8b0000 75%, #ff4500 100%)',
      'ice-cold': 'linear-gradient(135deg, #0a0a2e 0%, #16213e 25%, #1e3a8a 75%, #3b82f6 100%)',
      'toxic-green': 'linear-gradient(135deg, #0d1b0d 0%, #1a4d1a 25%, #228b22 75%, #32cd32 100%)',
      'smoke-dust': 'linear-gradient(135deg, #2a2520 0%, #5c5247 25%, #8b7355 75%, #d4c4a8 100%)',
      'cyberpunk-pink': 'linear-gradient(135deg, #1a0033 0%, #2d1b4e 25%, #4c1d95 75%, #8b5cf6 100%)'
    };
    
    return {
      background: presetGradients[config.backgroundPreset as keyof typeof presetGradients] || presetGradients['las-vegas']
    };
  };

  const getFontSize = () => {
    const sizes = {
      small: { main: 'text-lg sm:text-xl lg:text-2xl', sub: 'text-xs sm:text-sm' },
      medium: { main: 'text-xl sm:text-2xl lg:text-3xl', sub: 'text-sm sm:text-base' },
      large: { main: 'text-2xl sm:text-3xl lg:text-4xl', sub: 'text-base sm:text-lg' },
      xlarge: { main: 'text-3xl sm:text-4xl lg:text-5xl', sub: 'text-lg sm:text-xl' }
    };
    return sizes[config.fontSize as keyof typeof sizes] || sizes.medium;
  };

  const getTextPosition = () => {
    if (config.overlayImage) {
      const characterSize = config.overlayImageSize || 25;
      if (characterSize >= 70) {
        return 'items-center justify-start';
      } else if (characterSize >= 40) {
        return 'items-start justify-center pt-4';
      } else {
        return 'items-center justify-center';
      }
    }
    
    const positions = {
      top: 'items-start justify-center pt-4 sm:pt-6',
      center: 'items-center justify-center',
      bottom: 'items-end justify-center pb-4 sm:pb-6'
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
      'wide': '0.05em',
      'wider': '0.1em'
    };
    return spacing[config.letterSpacing as keyof typeof spacing] || spacing.normal;
  };

  const getLineHeight = () => {
    const heights = {
      'tight': '0.95',
      'normal': '1.1',
      'relaxed': '1.25'
    };
    return heights[config.lineHeight as keyof typeof heights] || heights.normal;
  };

  const getOverlayImageSize = () => {
    const baseSize = config.overlayImageSize || 25;
    const clampedSize = Math.max(15, Math.min(100, baseSize));
    console.log('Overlay image size calculation:', { baseSize, clampedSize });
    
    return {
      width: `${Math.min(clampedSize * 0.5, 50)}%`,
      maxHeight: `${Math.min(clampedSize * 0.7, 75)}%`,
      aspectRatio: 'auto'
    };
  };

  const getCharacterPosition = () => {
    const size = config.overlayImageSize || 25;
    const position = config.characterPosition || 'bottom-right';
    
    // Enhanced positioning classes with all grid positions
    const positionClasses = {
      'bottom-right': 'bottom-0 right-0 items-end justify-end',
      'bottom-left': 'bottom-0 left-0 items-end justify-start',
      'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2 items-end justify-center',
      'center-right': 'top-1/2 right-0 -translate-y-1/2 items-center justify-end',
      'center-left': 'top-1/2 left-0 -translate-y-1/2 items-center justify-start',
      'top-right': 'top-0 right-0 items-start justify-end',
      'top-left': 'top-0 left-0 items-start justify-start',
      'top-center': 'top-0 left-1/2 -translate-x-1/2 items-start justify-center',
      'full-center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center'
    };
    
    // Dynamic padding based on character size and position
    let padding = 'p-4';
    if (size >= 80) {
      padding = 'p-1';
    } else if (size >= 60) {
      padding = 'p-2';
    } else if (size >= 40) {
      padding = 'p-3';
    } else {
      padding = 'p-4';
    }
    
    // Special handling for center positions
    if (position === 'full-center') {
      padding = 'p-0';
    } else if (position.includes('center')) {
      padding = size >= 60 ? 'p-2' : 'p-3';
    }
    
    const baseClasses = positionClasses[position as keyof typeof positionClasses] || positionClasses['bottom-right'];
    
    // Add fine adjustment offsets
    const horizontalOffset = config.characterHorizontalOffset || 0;
    const verticalOffset = config.characterVerticalOffset || 0;
    
    return `absolute z-10 flex ${baseClasses} ${padding} transition-all duration-300`;
  };

  const getCharacterStyles = () => {
    const horizontalOffset = config.characterHorizontalOffset || 0;
    const verticalOffset = config.characterVerticalOffset || 0;
    
    return {
      transform: `translate(${horizontalOffset}px, ${verticalOffset}px)`,
      transition: 'transform 0.3s ease'
    };
  };

  const getTextContainerClass = () => {
    const size = config.overlayImageSize || 25;
    const characterPosition = config.characterPosition || 'bottom-right';
    const textPosition = config.textPosition;
    
    if (!config.overlayImage) {
      return 'relative z-20 h-full flex flex-col text-center px-4 sm:px-6';
    }
    
    // Handle specific text position overrides
    if (textPosition === 'center-right') {
      return 'relative z-20 h-full flex flex-col text-right px-4 sm:px-6 pr-8 w-3/5 ml-auto';
    } else if (textPosition === 'center-left') {
      return 'relative z-20 h-full flex flex-col text-left px-4 sm:px-6 pl-8 w-3/5';
    } else if (textPosition === 'overlay-top') {
      return 'relative z-30 h-full flex flex-col text-center px-4 sm:px-6 pt-8 pb-4';
    }
    
    // Smart text positioning based on character position
    if (characterPosition.includes('left')) {
      return `relative z-20 h-full flex flex-col text-right px-4 sm:px-6 w-3/5 ml-auto ${size >= 70 ? 'pr-2' : 'pr-8'}`;
    } else if (characterPosition.includes('right')) {
      return `relative z-20 h-full flex flex-col text-left px-4 sm:px-6 w-3/5 ${size >= 70 ? 'pl-2' : 'pl-8'}`;
    } else if (characterPosition === 'full-center') {
      return 'relative z-30 h-full flex flex-col text-center px-4 sm:px-6 pt-8';
    } else if (characterPosition.includes('top')) {
      return 'relative z-20 h-full flex flex-col text-center px-4 sm:px-6 pt-32';
    } else {
      // Default bottom positioning
      return `relative z-20 h-full flex flex-col text-center px-4 sm:px-6 ${size >= 70 ? 'pb-4' : 'pb-12'}`;
    }
  };

  const getNoDamageBadgePosition = () => {
    const size = config.overlayImageSize || 25;
    if (size >= 70) {
      return 'absolute top-8 left-8 z-30';
    } else if (size >= 40) {
      return 'absolute top-6 right-6 z-30';
    } else {
      return 'absolute top-4 right-4 z-30';
    }
  };

  const backgroundStyle = getBackgroundStyle();
  const containerStyle = {
    ...backgroundStyle,
    boxShadow: config.borderGlow ? `0 0 20px ${config.accentColor}40, 0 0 40px ${config.accentColor}20` : '0 0 15px rgba(0, 0, 0, 0.3)'
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div 
        ref={canvasRef}
        className={`relative w-full aspect-video rounded-xl overflow-hidden border transition-all duration-500 ${config.borderGlow ? 'border-white/20 shadow-xl' : 'border-white/10'} ${getTextPosition()}`}
        style={containerStyle}
      >
        {/* Enhanced Particles Background */}
        {config.showParticles && (
          <div className="absolute inset-0 opacity-25">
            {[...Array(40)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 4 + 1}px`,
                  height: `${Math.random() * 4 + 1}px`,
                  backgroundColor: i % 4 === 0 ? config.accentColor : 
                                 i % 4 === 1 ? '#ffffff40' : 
                                 i % 4 === 2 ? '#ffdd0040' : '#ff006040',
                  animationDelay: `${Math.random() * 4}s`,
                  animationDuration: `${2 + Math.random() * 4}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Enhanced Background Overlay with Multiple Layers */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/20 to-black/40" />
        
        {config.overlayImage && (
          <div className="absolute bottom-0 right-0 w-full h-full">
            <div 
              className="absolute bottom-0 right-0 w-1/2 h-3/4 opacity-30"
              style={{
                background: `radial-gradient(ellipse at bottom right, ${config.accentColor}20 0%, ${config.accentColor}10 40%, transparent 70%)`,
              }}
            />
          </div>
        )}

        {config.overlayImage && (
          <div className={getCharacterPosition()}>
            <div 
              className="relative transition-all duration-500"
              style={{...getOverlayImageSize(), ...getCharacterStyles()}}
            >
              {/* Smart Character Ground Shadow - AI Controlled */}
              {config.glowEffect && (
                <div 
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2/3 h-3 opacity-40 rounded-full blur-sm"
                  style={{
                    background: `radial-gradient(ellipse, ${config.accentColor}60 0%, ${config.accentColor}20 40%, transparent 80%)`,
                  }}
                />
              )}

              {/* Subtle Character Aura - Only if glow enabled */}
              {config.glowEffect && (
                <div 
                  className="absolute -inset-4 opacity-20 animate-pulse pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at center, ${config.accentColor}30 0%, transparent 70%)`,
                    animation: 'pulse 6s ease-in-out infinite',
                    borderRadius: '50%'
                  }}
                />
              )}

              {/* Main Character Image with Better Positioning */}
              <img 
                src={config.overlayImage} 
                alt="Character" 
                className="w-full h-full object-contain relative z-10"
                style={{
                  filter: config.glowEffect ? 
                    `drop-shadow(0 0 40px ${config.accentColor}70) drop-shadow(0 0 80px ${config.accentColor}40) drop-shadow(0 15px 35px rgba(0,0,0,0.8)) contrast(1.15) saturate(1.25) brightness(1.08)` : 
                    'drop-shadow(0 10px 25px rgba(0,0,0,0.6)) contrast(1.08) saturate(1.15) brightness(1.05)',
                  objectFit: 'contain',
                  maxWidth: '100%',
                  maxHeight: '100%'
                }}
                onLoad={() => console.log('Overlay image loaded successfully')}
                onError={() => console.error('Failed to load overlay image')}
              />

              {/* Enhanced Dynamic Challenge Badge */}
              <div className={getNoDamageBadgePosition()}>
                <div className="relative">
                  {/* Smart Badge Background Glow */}
                  <div 
                    className="absolute -inset-3 rounded-xl opacity-70 blur-md animate-pulse"
                    style={{
                      background: `radial-gradient(circle, ${config.accentColor} 0%, ${config.textColor}50 40%, transparent 80%)`,
                      animation: 'pulse 3s ease-in-out infinite'
                    }}
                  />
                  
                  {/* Main Badge with Dynamic Colors */}
                  <div 
                    className="relative text-white px-3 py-2 rounded-xl border-2 shadow-xl backdrop-blur-sm transform transition-all duration-300"
                    style={{ 
                      transform: `scale(${Math.max(0.8, Math.min(1.2, (config.overlayImageSize || 25) / 60))})`,
                      background: `linear-gradient(135deg, ${config.accentColor} 0%, ${config.textColor}80 100%)`,
                      borderColor: config.textColor,
                      boxShadow: `0 0 20px ${config.accentColor}60, 0 0 40px ${config.accentColor}30`
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      {/* Class Indicator */}
                      <div className="text-xs font-bold opacity-90">MED</div>
                      
                      {/* Badge Text */}
                      <span className="font-black text-sm tracking-wide drop-shadow-md uppercase">
                        NO DAMAGE
                      </span>
                      
                      {/* Dynamic Icon */}
                      <div className="text-sm animate-pulse">🛡️</div>
                    </div>
                    
                    {/* Challenge Type */}
                    <div className="text-center text-xs font-bold opacity-80 uppercase tracking-wider">
                      MEDIUM CHALLENGE
                    </div>
                  </div>
                  
                  {/* Subtle Shine Effect */}
                  <div 
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50" 
                    style={{
                      animation: 'shine 4s ease-in-out infinite',
                      animationDelay: '1s'
                    }} 
                  />
                </div>
              </div>
              
              {/* Character Stats Badge */}
              <div 
                className="absolute -bottom-2 -left-2 bg-gradient-to-r from-black/95 to-black/80 text-white text-xs px-3 py-1 rounded-xl border border-white/50 backdrop-blur-md shadow-lg"
                style={{ transform: `scale(${Math.max(0.7, Math.min(1.0, (config.overlayImageSize || 25) / 70))})` }}
              >
                <span className="font-bold text-cyan-400">{config.overlayImageSize || 25}%</span>
                <span className="text-white/70 ml-1 text-xs">SIZE</span>
              </div>
              
              {/* Character Class Badge */}
              <div 
                className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-600/95 to-blue-600/95 text-white text-xs px-3 py-1 rounded-xl border border-white/50 backdrop-blur-md shadow-lg"
                style={{ transform: `scale(${Math.max(0.7, Math.min(1.0, (config.overlayImageSize || 25) / 70))})` }}
              >
                <span className="font-bold text-xs">⭐ HEAVY</span>
              </div>

              {/* Enhanced Character Frame Effect */}
              <div 
                className="absolute -inset-2 rounded-2xl border-2 opacity-60 animate-pulse"
                style={{
                  borderColor: config.accentColor,
                  boxShadow: `0 0 30px ${config.accentColor}60, inset 0 0 30px ${config.accentColor}20`
                }}
              />
            </div>
          </div>
        )}

        <div className={`${getTextContainerClass()} ${config.animatedText ? 'animate-pulse' : ''}`}>
          {config.textBackground && (
            <div 
              className="absolute inset-2 rounded-xl backdrop-blur-md border border-white/10"
              style={{
                backgroundColor: config.textBackgroundColor,
                opacity: config.textBackgroundOpacity / 100,
                boxShadow: `inset 0 0 20px rgba(255,255,255,0.1)`
              }}
            />
          )}

          <h1 
            className={`font-black uppercase leading-tight transition-all duration-300 ${getFontSize().main} relative z-10 max-w-full break-words`}
            style={{ 
              color: config.gradientText ? 'transparent' : config.textColor,
              fontFamily: getFontFamily(),
              fontWeight: '900',
              textShadow: config.textShadow ? 
                `4px 4px 8px rgba(0,0,0,0.95), 0 0 30px ${config.accentColor}70, 0 0 60px ${config.accentColor}50, 2px 2px 0px ${config.accentColor}90` : 
                '4px 4px 8px rgba(0,0,0,0.95), 2px 2px 0px rgba(0,0,0,0.6)',
              WebkitTextStroke: config.textOutline ? `3px ${config.accentColor}` : 'none',
              filter: config.glowEffect ? 
                `drop-shadow(0 0 30px ${config.accentColor}70) drop-shadow(0 0 60px ${config.accentColor}40) contrast(1.15)` : 
                'contrast(1.08)',
              letterSpacing: getLetterSpacing(),
              lineHeight: getLineHeight(),
              opacity: config.textOpacity / 100,
              transform: `rotate(${config.textRotation}deg)`,
              background: config.gradientText ? 
                `linear-gradient(45deg, ${config.textColor}, ${config.accentColor}, ${config.textColor})` : 
                'none',
              WebkitBackgroundClip: config.gradientText ? 'text' : 'unset',
              backgroundClip: config.gradientText ? 'text' : 'unset',
              wordWrap: 'break-word',
              hyphens: 'auto',
              marginBottom: config.subText ? '0.5rem' : '0'
            }}
          >
            {config.mainText}
          </h1>

          {config.subText && (
            <p 
              className={`font-bold uppercase tracking-wide opacity-90 transition-all duration-300 ${getFontSize().sub} relative z-10 max-w-full break-words`}
              style={{ 
                color: config.gradientText ? 'transparent' : config.accentColor,
                fontFamily: getFontFamily(),
                fontWeight: '700',
                textShadow: config.textShadow ? 
                  `3px 3px 6px rgba(0,0,0,0.95), 0 0 25px ${config.accentColor}60, 2px 2px 0px ${config.accentColor}70` : 
                  '3px 3px 6px rgba(0,0,0,0.95)',
                filter: config.glowEffect ? 
                  `drop-shadow(0 0 25px ${config.accentColor}60) contrast(1.1)` : 
                  'contrast(1.05)',
                letterSpacing: getLetterSpacing(),
                opacity: (config.textOpacity / 100) * 0.9,
                background: config.gradientText ? 
                  `linear-gradient(45deg, ${config.accentColor}, ${config.textColor}, ${config.accentColor})` : 
                  'none',
                WebkitBackgroundClip: config.gradientText ? 'text' : 'unset',
                backgroundClip: config.gradientText ? 'text' : 'unset',
                wordWrap: 'break-word',
                hyphens: 'auto'
              }}
            >
              {config.subText}
            </p>
          )}
        </div>

        {/* Dynamic Gaming HUD Elements */}
        {config.glowEffect && (
          <div className="absolute top-3 right-3 flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i}
                className="w-3 h-3 rounded-full animate-pulse border-2 border-white/30 backdrop-blur-sm"
                style={{ 
                  backgroundColor: `${config.accentColor}80`,
                  animationDelay: `${i * 0.3}s`,
                  opacity: 0.8,
                  boxShadow: `0 0 12px ${config.accentColor}60, inset 0 0 8px rgba(255,255,255,0.3)`
                }}
              />
            ))}
          </div>
        )}

        {/* Energy Bar Visual */}
        {config.showParticles && (
          <div className="absolute bottom-3 left-3 w-24 h-2 bg-black/40 rounded-full border border-white/20 backdrop-blur-sm overflow-hidden">
            <div 
              className="h-full rounded-full animate-pulse"
              style={{ 
                background: `linear-gradient(90deg, ${config.accentColor} 0%, ${config.textColor} 100%)`,
                width: '85%',
                boxShadow: `0 0 8px ${config.accentColor}50`
              }}
            />
          </div>
        )}


        <div className="absolute top-0 left-0 w-16 h-16">
          <div 
            className="w-full h-full rounded-br-2xl opacity-15 border-r border-b border-white/10"
            style={{ 
              background: `linear-gradient(135deg, ${config.accentColor} 0%, ${config.accentColor}50 50%, transparent 100%)`
            }}
          />
        </div>

        <div className="absolute bottom-0 right-0 w-14 h-14">
          <div 
            className="w-full h-full rounded-tl-2xl opacity-12 border-l border-t border-white/10"
            style={{ 
              background: `linear-gradient(315deg, ${config.accentColor} 0%, ${config.accentColor}40 50%, transparent 100%)`
            }}
          />
        </div>

        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(${config.accentColor}30 1px, transparent 1px), linear-gradient(90deg, ${config.accentColor}30 1px, transparent 1px)`,
            backgroundSize: '25px 25px'
          }}
        />

        <div 
          className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full opacity-6 animate-pulse" 
          style={{ background: `radial-gradient(circle, ${config.accentColor}50 0%, transparent 70%)` }} 
        />
        <div 
          className="absolute bottom-1/3 right-1/3 w-32 h-32 rounded-full opacity-5 animate-pulse" 
          style={{ background: `radial-gradient(circle, ${config.textColor}40 0%, transparent 70%)`, animationDelay: '1s' }} 
        />
        <div 
          className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full opacity-4 animate-pulse" 
          style={{ background: `radial-gradient(circle, #ffffff30 0%, transparent 70%)`, animationDelay: '2s' }} 
        />
      </div>

      <div className="text-center mt-4">
        <div className="inline-flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <p className="text-white/70 text-sm font-medium">
            <span className="text-cyan-400 font-semibold">YouTube Thumbnail</span> • 1280×720 • HD Ready
          </p>
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" style={{animationDelay: '0.5s'}}></div>
        </div>
      </div>
    </div>
  );
};

export default ThumbnailCanvas;
