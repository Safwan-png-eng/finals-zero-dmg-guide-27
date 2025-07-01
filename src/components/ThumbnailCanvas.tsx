
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
    if (config.backgroundImage) {
      console.log('Using custom background image');
      return {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.4)), url(${config.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    }

    const presets = {
      'neon-city': {
        backgroundImage: 'linear-gradient(135deg, #0a0a0f 0%, #1a1b3e 15%, #2d1b69 35%, #4c1d95 55%, #6b46c1 75%, #3b1d4f 100%)',
        overlay: 'radial-gradient(circle at 20% 80%, rgba(0, 255, 136, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)'
      },
      'destruction-zone': {
        backgroundImage: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 20%, #4a4a4a 40%, #ff6b35 70%, #ffaa00 90%, #999 100%)',
        overlay: 'radial-gradient(circle at 30% 70%, rgba(255, 107, 53, 0.3) 0%, transparent 60%), radial-gradient(circle at 70% 30%, rgba(255, 170, 0, 0.2) 0%, transparent 50%)'
      },
      'finals-arena': {
        backgroundImage: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a3e 15%, #2d1b4e 30%, #3d2a78 50%, #ff0080 80%, #00d4ff 100%)',
        overlay: 'radial-gradient(circle at 25% 25%, rgba(255, 0, 128, 0.25) 0%, transparent 60%), radial-gradient(circle at 75% 75%, rgba(0, 212, 255, 0.2) 0%, transparent 50%)'
      },
      'monaco-streets': {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.4)), url(/lovable-uploads/ff01c07f-8a42-4b34-bd5d-814ea69de169.png)`,
        overlay: 'radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.15) 0%, transparent 70%)'
      },
      'urban-battlefield': {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.3)), url(/lovable-uploads/2385a088-db61-4395-a7df-433b98126931.png)`,
        overlay: 'radial-gradient(circle at 40% 60%, rgba(255, 107, 53, 0.2) 0%, transparent 60%)'
      },
      'casino-royale': {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.3)), url(/lovable-uploads/8f9ecc3b-dad0-4fd0-b0dc-95097941de66.png)`,
        overlay: 'radial-gradient(circle at 50% 30%, rgba(255, 215, 0, 0.2) 0%, transparent 70%)'
      },
      'skybridge-arena': {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.35)), url(/lovable-uploads/ddad55a5-b9b9-46e0-ab90-b3f759cdb55e.png)`,
        overlay: 'radial-gradient(circle at 70% 40%, rgba(0, 212, 255, 0.15) 0%, transparent 60%)'
      },
      'neon-paradise': {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.3)), url(/lovable-uploads/e859ab1d-04b2-4dc9-a666-a4a3411160ed.png)`,
        overlay: 'radial-gradient(circle at 50% 50%, rgba(255, 0, 255, 0.2) 0%, transparent 70%)'
      },
      'crystal-district': {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.25)), url(/lovable-uploads/29e843a9-6fbf-4584-b09d-a99cdd7bd93b.png)`,
        overlay: 'radial-gradient(circle at 60% 60%, rgba(139, 92, 246, 0.2) 0%, transparent 70%)'
      },
      'smoke-dust': {
        backgroundImage: 'linear-gradient(135deg, #2a2520 0%, #3d3528 20%, #5c5247 40%, #8b7355 70%, #d4c4a8 95%, #f0e6d2 100%)',
        overlay: 'radial-gradient(circle at 50% 80%, rgba(212, 196, 168, 0.25) 0%, transparent 70%), radial-gradient(circle at 20% 20%, rgba(139, 115, 85, 0.15) 0%, transparent 50%)'
      },
      'fire-storm': {
        backgroundImage: 'linear-gradient(135deg, #0f0000 0%, #2a0505 15%, #4a0e0e 30%, #8b0000 50%, #b91c1c 70%, #dc2626 85%, #ff4500 100%)',
        overlay: 'radial-gradient(circle at 30% 30%, rgba(255, 69, 0, 0.25) 0%, transparent 60%), radial-gradient(circle at 70% 70%, rgba(220, 38, 38, 0.15) 0%, transparent 50%)'
      },
      'ice-cold': {
        backgroundImage: 'linear-gradient(135deg, #020617 0%, #0f172a 15%, #1e293b 30%, #334155 45%, #1e3a8a 60%, #3b82f6 75%, #60a5fa 90%, #93c5fd 100%)',
        overlay: 'radial-gradient(circle at 50% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(147, 197, 253, 0.1) 0%, transparent 50%)'
      },
      'toxic-green': {
        backgroundImage: 'linear-gradient(135deg, #0d1b0d 0%, #1a4d1a 15%, #166534 30%, #15803d 45%, #16a34a 60%, #22c55e 75%, #4ade80 90%, #86efac 100%)',
        overlay: 'radial-gradient(circle at 70% 30%, rgba(34, 197, 94, 0.2) 0%, transparent 60%), radial-gradient(circle at 30% 70%, rgba(74, 222, 128, 0.1) 0%, transparent 50%)'
      },
      'cyberpunk-pink': {
        backgroundImage: 'linear-gradient(135deg, #1a0033 0%, #330066 20%, #4c0080 40%, #8000ff 60%, #ff00ff 80%, #ff80ff 100%)',
        overlay: 'radial-gradient(circle at 60% 40%, rgba(255, 0, 255, 0.25) 0%, transparent 60%), radial-gradient(circle at 40% 60%, rgba(128, 0, 255, 0.15) 0%, transparent 50%)'
      }
    };
    
    const preset = presets[config.backgroundPreset as keyof typeof presets] || presets['neon-city'];
    console.log('Using preset background:', config.backgroundPreset);
    return {
      backgroundImage: preset.backgroundImage,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
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
      width: `${clampedSize}%`,
      aspectRatio: '3/4'
    };
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
        
        {/* Character Integration Layer - helps blend character with background */}
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

        {/* Enhanced Overlay Image with Better Integration */}
        {config.overlayImage && (
          <div className="absolute bottom-0 right-0 z-10">
            <div 
              className="relative transition-all duration-500"
              style={getOverlayImageSize()}
            >
              {/* Character Ground Shadow - makes character feel grounded */}
              <div 
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-4 opacity-40 rounded-full blur-md"
                style={{
                  background: `radial-gradient(ellipse, rgba(0,0,0,0.8) 0%, transparent 70%)`,
                }}
              />

              {/* Enhanced Character Background Integration */}
              <div 
                className="absolute -inset-8 rounded-full opacity-20 animate-pulse"
                style={{
                  background: `radial-gradient(ellipse at center, ${config.accentColor}40 0%, ${config.accentColor}20 50%, transparent 80%)`,
                  animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}
              />
              
              {/* Atmospheric Lighting Effect */}
              <div 
                className="absolute -inset-12 opacity-15"
                style={{
                  background: `conic-gradient(from 45deg at center, transparent 0deg, ${config.accentColor}30 90deg, transparent 180deg, ${config.accentColor}20 270deg, transparent 360deg)`,
                  borderRadius: '50%',
                  animation: 'spin 12s linear infinite'
                }}
              />
              
              {/* Character Color Matching Overlay */}
              <div 
                className="absolute inset-0 rounded-xl opacity-10 mix-blend-overlay"
                style={{
                  background: `linear-gradient(135deg, ${config.accentColor}60 0%, transparent 50%, ${config.textColor}40 100%)`
                }}
              />

              {/* Main Character Image with Enhanced Integration */}
              <img 
                src={config.overlayImage} 
                alt="Character" 
                className="w-full h-full object-contain relative z-10"
                style={{
                  filter: config.glowEffect ? 
                    `drop-shadow(0 0 30px ${config.accentColor}60) drop-shadow(0 0 60px ${config.accentColor}30) drop-shadow(0 12px 25px rgba(0,0,0,0.7)) contrast(1.1) saturate(1.2) brightness(1.05) hue-rotate(5deg)` : 
                    'drop-shadow(0 8px 20px rgba(0,0,0,0.5)) contrast(1.05) saturate(1.1) brightness(1.02)',
                  objectFit: 'contain'
                }}
                onLoad={() => console.log('Overlay image loaded successfully')}
                onError={() => console.error('Failed to load overlay image')}
              />

              {/* NO DAMAGE Badge - positioned near character */}
              <div className="absolute top-6 left-6 z-20">
                <div className="relative">
                  {/* Badge Background Glow */}
                  <div 
                    className="absolute -inset-2 rounded-full opacity-60 animate-pulse blur-sm"
                    style={{
                      background: `radial-gradient(circle, #ff0000 0%, #ff6600 50%, transparent 100%)`,
                    }}
                  />
                  
                  {/* Main Badge */}
                  <div className="relative bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white px-4 py-2 rounded-full border-3 border-white/80 shadow-2xl backdrop-blur-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse shadow-lg"></div>
                      <span className="font-black text-sm tracking-wider drop-shadow-lg">NO DAMAGE</span>
                    </div>
                  </div>
                  
                  {/* Badge Shine Effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" style={{animationDelay: '1s'}} />
                </div>
              </div>
              
              {/* Enhanced Character Stats Badge */}
              <div className="absolute bottom-6 left-6 bg-gradient-to-r from-black/90 to-black/70 text-white text-sm px-4 py-2 rounded-full border-2 border-white/40 backdrop-blur-sm shadow-xl">
                <span className="font-bold text-cyan-400">{config.overlayImageSize || 25}%</span>
                <span className="text-white/60 ml-2">SIZE</span>
              </div>
              
              {/* Character Class Badge */}
              <div className="absolute bottom-6 right-6 bg-gradient-to-r from-purple-600/90 to-blue-600/90 text-white text-sm px-4 py-2 rounded-full border-2 border-white/40 backdrop-blur-sm shadow-xl">
                <span className="font-semibold">★ HEAVY</span>
              </div>

              {/* Enhanced Character Highlight Effects */}
              <div 
                className="absolute -inset-1 rounded-xl border-2 opacity-50 animate-pulse"
                style={{
                  borderColor: config.accentColor,
                  boxShadow: `0 0 25px ${config.accentColor}50, inset 0 0 25px ${config.accentColor}15`
                }}
              />

              {/* Animated Energy Rings */}
              <div 
                className="absolute -inset-8 rounded-full border border-white/15 opacity-25"
                style={{
                  animation: 'spin 10s linear infinite',
                  background: `conic-gradient(from 0deg, transparent 0deg, ${config.accentColor}15 60deg, transparent 120deg, ${config.accentColor}10 180deg, transparent 240deg, ${config.accentColor}20 300deg, transparent 360deg)`
                }}
              />
            </div>
          </div>
        )}

        {/* Content Container */}
        <div className={`relative z-20 h-full flex flex-col text-center px-3 sm:px-4 ${config.animatedText ? 'animate-pulse' : ''}`}>
          {/* Enhanced Text Background */}
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

          {/* Main Text */}
          <h1 
            className={`font-black uppercase leading-tight transition-all duration-300 ${getFontSize().main} relative z-10 max-w-full break-words`}
            style={{ 
              color: config.gradientText ? 'transparent' : config.textColor,
              fontFamily: getFontFamily(),
              fontWeight: '900',
              textShadow: config.textShadow ? 
                `3px 3px 6px rgba(0,0,0,0.9), 0 0 25px ${config.accentColor}60, 0 0 50px ${config.accentColor}40, 1px 1px 0px ${config.accentColor}80` : 
                '3px 3px 6px rgba(0,0,0,0.9), 1px 1px 0px rgba(0,0,0,0.5)',
              WebkitTextStroke: config.textOutline ? `2px ${config.accentColor}` : 'none',
              filter: config.glowEffect ? 
                `drop-shadow(0 0 25px ${config.accentColor}60) drop-shadow(0 0 50px ${config.accentColor}35) contrast(1.1)` : 
                'contrast(1.05)',
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
              hyphens: 'auto'
            }}
          >
            {config.mainText}
          </h1>

          {/* Sub Text */}
          {config.subText && (
            <p 
              className={`font-bold uppercase tracking-wide opacity-90 mt-2 transition-all duration-300 ${getFontSize().sub} relative z-10 max-w-full break-words`}
              style={{ 
                color: config.gradientText ? 'transparent' : config.accentColor,
                fontFamily: getFontFamily(),
                fontWeight: '700',
                textShadow: config.textShadow ? 
                  `2px 2px 4px rgba(0,0,0,0.9), 0 0 20px ${config.accentColor}50, 1px 1px 0px ${config.accentColor}60` : 
                  '2px 2px 4px rgba(0,0,0,0.9)',
                filter: config.glowEffect ? 
                  `drop-shadow(0 0 20px ${config.accentColor}50) contrast(1.05)` : 
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

        {/* Enhanced Decorative Elements */}
        <div className="absolute top-3 right-3 flex space-x-2">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i}
              className="w-2 h-2 rounded-full animate-pulse border border-white/20"
              style={{ 
                backgroundColor: config.accentColor,
                animationDelay: `${i * 0.4}s`,
                opacity: 0.7,
                boxShadow: `0 0 8px ${config.accentColor}40`
              }}
            />
          ))}
        </div>
        
        <div className="absolute bottom-3 left-3 flex space-x-1">
          <div 
            className="w-12 h-1 rounded-full animate-pulse border-t border-white/20"
            style={{ 
              backgroundColor: config.accentColor,
              opacity: 0.6,
              boxShadow: `0 0 10px ${config.accentColor}30`
            }}
          />
          <div 
            className="w-6 h-1 rounded-full animate-pulse"
            style={{ 
              backgroundColor: config.accentColor,
              opacity: 0.4,
              animationDelay: '0.5s'
            }}
          />
        </div>

        {/* Enhanced Corner Accents */}
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

        {/* Enhanced Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(${config.accentColor}30 1px, transparent 1px), linear-gradient(90deg, ${config.accentColor}30 1px, transparent 1px)`,
            backgroundSize: '25px 25px'
          }}
        />

        {/* Enhanced Atmospheric Effects with More Layers */}
        <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full opacity-6 animate-pulse" 
             style={{ background: `radial-gradient(circle, ${config.accentColor}50 0%, transparent 70%)` }} />
        <div className="absolute bottom-1/3 right-1/3 w-32 h-32 rounded-full opacity-5 animate-pulse" 
             style={{ background: `radial-gradient(circle, ${config.textColor}40 0%, transparent 70%)`, animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full opacity-4 animate-pulse" 
             style={{ background: `radial-gradient(circle, #ffffff30 0%, transparent 70%)`, animationDelay: '2s' }} />
      </div>

      {/* Enhanced Dimensions Label */}
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
