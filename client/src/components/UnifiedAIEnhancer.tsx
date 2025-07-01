import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Bot, Wand2, Crown, Target, RefreshCw, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UnifiedAIEnhancerProps {
  config: any;
  onConfigChange: (key: string, value: any) => void;
}

const UnifiedAIEnhancer = ({ config, onConfigChange }: UnifiedAIEnhancerProps) => {
  const { toast } = useToast();
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancementStage, setEnhancementStage] = useState('');
  
  const API_KEY = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY || 'AIzaSyCbuWhugmrcCT02RyUYr-2S18T4sV1Ud44';

  // Unified AI enhancement that improves everything at once
  const enhanceEverything = async () => {
    setIsEnhancing(true);
    let enhancements = 0;
    
    try {
      // Stage 1: Analyze and improve text content
      setEnhancementStage('Analyzing content...');
      const textAnalysis = await analyzeAndImproveText();
      if (textAnalysis.success) enhancements++;
      
      // Stage 2: Optimize visual design
      setEnhancementStage('Optimizing visuals...');
      const visualOptimization = await optimizeVisualDesign();
      if (visualOptimization.success) enhancements++;
      
      // Stage 3: Select perfect background
      setEnhancementStage('Selecting background...');
      const backgroundSelection = await selectOptimalBackground();
      if (backgroundSelection.success) enhancements++;
      
      // Stage 4: Position character optimally
      setEnhancementStage('Positioning character...');
      const characterPositioning = await optimizeCharacterPlacement();
      if (characterPositioning.success) enhancements++;
      
      // Stage 5: Apply finishing touches
      setEnhancementStage('Applying finishing touches...');
      applyFinishingTouches();
      enhancements++;
      
      toast({
        title: `🚀 AI Enhancement Complete!`,
        description: `Applied ${enhancements}/5 viral optimizations. Your thumbnail is now click-worthy!`,
        duration: 6000
      });
      
    } catch (error) {
      console.error('AI enhancement failed:', error);
      toast({
        title: "Enhancement Error",
        description: "Some optimizations failed, but applied what we could.",
        variant: "destructive"
      });
    } finally {
      setIsEnhancing(false);
      setEnhancementStage('');
    }
  };

  const analyzeAndImproveText = async () => {
    try {
      const prompt = `You are a viral YouTube thumbnail expert. Analyze and improve this gaming thumbnail:

CURRENT CONTENT:
Title: "${config.mainText}"
Subtitle: "${config.subText}"
Game: The Finals (competitive FPS)
Theme: ${config.backgroundPreset}

REQUIREMENTS:
1. Create viral main title (max 4 words, ALL CAPS, action-packed)
2. Create compelling subtitle (max 3 words, creates urgency/curiosity)
3. Ensure high click-through rate potential
4. Match gaming/action theme
5. Use psychological triggers (challenge, mystery, achievement)

EXAMPLES OF VIRAL TITLES:
- "CAN I WIN WITHOUT DAMAGE?"
- "IMPOSSIBLE FINALS CHALLENGE"
- "NO ARMOR RUN INSANE"
- "WORLD RECORD ATTEMPT"

Return format: MAIN_TITLE|SUBTITLE

Focus on creating curiosity and challenge that makes viewers want to click immediately.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      
      if (aiText && aiText.includes('|')) {
        const [mainText, subText] = aiText.split('|');
        onConfigChange('mainText', mainText.trim());
        onConfigChange('subText', subText.trim());
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('Text analysis failed:', error);
      return { success: false };
    }
  };

  const optimizeVisualDesign = async () => {
    try {
      const prompt = `Optimize colors and effects for a gaming thumbnail:

CONTENT: "${config.mainText}" - "${config.subText}"
BACKGROUND: ${config.backgroundPreset}
CHARACTER: ${config.overlayImage ? 'Present' : 'None'}

Provide optimal settings for maximum visual impact:
- Text color (hex)
- Accent color (hex) 
- Font size (small/medium/large/xlarge)
- Effects needed (comma-separated: glow,particles,shadow,outline,border)

Return format: TEXT_COLOR|ACCENT_COLOR|FONT_SIZE|EFFECTS|EXPLANATION`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      
      if (aiResponse && aiResponse.includes('|')) {
        const [textColor, accentColor, fontSize, effects] = aiResponse.split('|');
        
        // Apply colors
        if (textColor.trim().startsWith('#')) {
          onConfigChange('textColor', textColor.trim());
        }
        if (accentColor.trim().startsWith('#')) {
          onConfigChange('accentColor', accentColor.trim());
        }
        
        // Apply font size
        if (['small', 'medium', 'large', 'xlarge'].includes(fontSize.trim())) {
          onConfigChange('fontSize', fontSize.trim());
        }
        
        // Apply effects
        const effectsList = effects.trim().toLowerCase();
        onConfigChange('glowEffect', effectsList.includes('glow'));
        onConfigChange('showParticles', effectsList.includes('particles'));
        onConfigChange('textShadow', effectsList.includes('shadow'));
        onConfigChange('textOutline', effectsList.includes('outline'));
        onConfigChange('borderGlow', effectsList.includes('border'));
        
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('Visual optimization failed:', error);
      return { success: false };
    }
  };

  const selectOptimalBackground = async () => {
    try {
      // Smart background selection based on content
      const textContent = `${config.mainText} ${config.subText}`.toLowerCase();
      
      if (textContent.includes('vegas') || textContent.includes('casino') || textContent.includes('neon')) {
        onConfigChange('backgroundPreset', 'las-vegas');
        await selectOptimalVegasImage();
      } else if (textContent.includes('arena') || textContent.includes('finals') || textContent.includes('cyber')) {
        onConfigChange('backgroundPreset', 'finals-arena');
      } else if (textContent.includes('fire') || textContent.includes('explosion') || textContent.includes('destroy')) {
        onConfigChange('backgroundPreset', 'fire-storm');
      } else if (textContent.includes('damage') || textContent.includes('challenge') || textContent.includes('impossible')) {
        onConfigChange('backgroundPreset', 'las-vegas');
        await selectOptimalVegasImage();
      } else {
        // Default to most engaging option
        onConfigChange('backgroundPreset', 'finals-arena');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Background selection failed:', error);
      return { success: false };
    }
  };

  const selectOptimalVegasImage = async () => {
    try {
      const res = await fetch('/api/las-vegas-images');
      const vegasOptions = await res.json();
      
      if (!Array.isArray(vegasOptions) || vegasOptions.length === 0) return;

      const prompt = `Select the most dramatic Vegas background for a gaming thumbnail:

THUMBNAIL: "${config.mainText}" - "${config.subText}"
PURPOSE: Maximum click-through rate and visual impact

OPTIONS:
${vegasOptions.map(opt => `${opt.name}: ${opt.description}`).join('\n')}

Choose the option that creates the most epic, dramatic backdrop that screams "MUST WATCH".
Consider: visual drama, lighting, composition, and gaming appeal.

Return ONLY the exact name (before the colon).`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();
      const aiChoice = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      
      const selectedImage = vegasOptions.find(opt => 
        opt.name === aiChoice || opt.name.includes(aiChoice)
      );
      
      if (selectedImage) {
        onConfigChange('backgroundImage', selectedImage.url);
      }
    } catch (error) {
      console.error('Vegas image selection failed:', error);
    }
  };

  const optimizeCharacterPlacement = async () => {
    try {
      if (!config.overlayImage) {
        return { success: false };
      }

      const prompt = `Optimize character placement for gaming thumbnail:

CONTENT: "${config.mainText}" - "${config.subText}"
BACKGROUND: ${config.backgroundPreset}
CURRENT SIZE: ${config.overlayImageSize || 25}%

Determine optimal character setup for maximum impact:
- Position (bottom-right, bottom-left, center-right, center-left, full-center, top-right, top-left, bottom-center, top-center)
- Size percentage (15-90)
- Blend mode (normal, multiply, screen, overlay)

Consider text placement, visual balance, and gaming thumbnail best practices.

Return format: POSITION|SIZE|BLEND_MODE`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      
      if (aiResponse && aiResponse.includes('|')) {
        const [position, size, blendMode] = aiResponse.split('|');
        
        onConfigChange('characterPosition', position.trim());
        
        const sizeNum = parseInt(size.trim());
        if (sizeNum >= 15 && sizeNum <= 90) {
          onConfigChange('overlayImageSize', sizeNum);
        }
        
        onConfigChange('characterBlendMode', blendMode.trim());
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('Character positioning failed:', error);
      return { success: false };
    }
  };

  const applyFinishingTouches = () => {
    // Enable background removal for cleaner character
    onConfigChange('characterRemoveBackground', true);
    
    // Optimize text settings
    onConfigChange('textOpacity', 100);
    onConfigChange('animatedText', true);
    onConfigChange('gradientText', true);
    
    // Enhance overall visual appeal
    onConfigChange('textPosition', 'center-left');
    onConfigChange('letterSpacing', 'wide');
    onConfigChange('lineHeight', 'tight');
  };

  // Quick preset applications
  const applyViralPreset = () => {
    onConfigChange('backgroundPreset', 'las-vegas');
    onConfigChange('textColor', '#ffffff');
    onConfigChange('accentColor', '#ffcc00');
    onConfigChange('fontSize', 'xlarge');
    onConfigChange('glowEffect', true);
    onConfigChange('showParticles', true);
    onConfigChange('textShadow', true);
    onConfigChange('textOutline', true);
    onConfigChange('borderGlow', true);
    onConfigChange('gradientText', true);
    
    toast({
      title: "🔥 Viral Preset Applied!",
      description: "Maximum engagement settings activated",
    });
  };

  const applyMinimalPreset = () => {
    onConfigChange('backgroundPreset', 'neon-city');
    onConfigChange('textColor', '#ffffff');
    onConfigChange('accentColor', '#00d4ff');
    onConfigChange('fontSize', 'large');
    onConfigChange('glowEffect', false);
    onConfigChange('showParticles', false);
    onConfigChange('textShadow', true);
    onConfigChange('textOutline', false);
    onConfigChange('borderGlow', false);
    onConfigChange('gradientText', false);
    
    toast({
      title: "✨ Clean Style Applied!",
      description: "Professional minimal design activated",
    });
  };

  return (
    <div className="space-y-4">
      {/* Main AI Enhancement Button */}
      <div className="relative">
        <Button 
          onClick={enhanceEverything}
          disabled={isEnhancing}
          className="w-full h-16 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white font-bold text-lg shadow-xl border-2 border-white/20"
        >
          {isEnhancing ? (
            <>
              <Bot className="w-6 h-6 mr-3 animate-spin" />
              <div className="flex flex-col">
                <span>AI ENHANCING...</span>
                <span className="text-xs opacity-80">{enhancementStage}</span>
              </div>
            </>
          ) : (
            <>
              <Crown className="w-6 h-6 mr-3" />
              AI AUTO ENHANCE ALL
            </>
          )}
        </Button>
        
        {/* Enhancement progress indicator */}
        {isEnhancing && (
          <div className="absolute -bottom-1 left-0 right-0 h-1 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse"></div>
          </div>
        )}
      </div>

      {/* Quick Preset Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button 
          onClick={applyViralPreset}
          variant="outline"
          className="bg-red-500/10 border-red-500/30 hover:bg-red-500/20 text-red-400"
        >
          <Target className="w-4 h-4 mr-2" />
          Viral Mode
        </Button>
        
        <Button 
          onClick={applyMinimalPreset}
          variant="outline"
          className="bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20 text-blue-400"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Clean Style
        </Button>
      </div>

      {/* Feature Description */}
      <div className="text-xs text-white/60 p-3 bg-black/20 rounded-lg border border-white/10">
        <div className="flex items-center mb-2">
          <Wand2 className="w-4 h-4 mr-2 text-purple-400" />
          <span className="font-semibold text-white/80">AI Enhancement Features</span>
        </div>
        <ul className="space-y-1 text-white/50">
          <li>• Viral text optimization with psychological triggers</li>
          <li>• Smart color and visual effects selection</li>
          <li>• Intelligent background matching</li>
          <li>• Optimal character positioning</li>
          <li>• Professional finishing touches</li>
        </ul>
      </div>
    </div>
  );
};

export default UnifiedAIEnhancer;