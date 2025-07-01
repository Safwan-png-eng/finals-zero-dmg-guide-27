import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Wand2, Brain, Zap, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIEnhancerProps {
  config: any;
  onConfigChange: (key: string, value: any) => void;
}

const AIEnhancer = ({ config, onConfigChange }: AIEnhancerProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const API_KEY = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY || 'AIzaSyCbuWhugmrcCT02RyUYr-2S18T4sV1Ud44';

  const generateAIText = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Generate an exciting YouTube gaming thumbnail text for "THE FINALS" game. Current text: "${config.mainText}". Create a catchy main title (max 4 words) and subtitle (max 3 words) that would get high click-through rates. Focus on action, challenge, and excitement. Return only: MAIN_TITLE|SUBTITLE`
            }]
          }]
        })
      });

      const data = await response.json();
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (aiText) {
        const [mainText, subText] = aiText.split('|');
        onConfigChange('mainText', mainText.trim());
        onConfigChange('subText', subText.trim());
        
        toast({
          title: "AI Magic Applied! ✨",
          description: "Your thumbnail text has been enhanced with AI",
        });
      }
    } catch (error) {
      console.error('AI generation failed:', error);
      toast({
        title: "AI Enhancement Failed",
        description: "Could not generate AI text. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const optimizeColors = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Suggest optimal color combinations for a gaming thumbnail with current preset "${config.backgroundPreset}". Return format: TEXT_COLOR|ACCENT_COLOR (use hex codes only)`
            }]
          }]
        })
      });

      const data = await response.json();
      const aiColors = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (aiColors && aiColors.includes('|')) {
        const [textColor, accentColor] = aiColors.split('|');
        const cleanTextColor = textColor.trim().replace(/[^#0-9a-fA-F]/g, '');
        const cleanAccentColor = accentColor.trim().replace(/[^#0-9a-fA-F]/g, '');
        
        if (cleanTextColor.startsWith('#') && cleanAccentColor.startsWith('#')) {
          onConfigChange('textColor', cleanTextColor);
          onConfigChange('accentColor', cleanAccentColor);
          
          toast({
            title: "Colors Optimized! 🎨",
            description: "AI has enhanced your color scheme",
          });
        }
      }
    } catch (error) {
      console.error('Color optimization failed:', error);
      toast({
        title: "Color Optimization Failed",
        description: "Could not optimize colors. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const suggestPreset = async () => {
    setIsGenerating(true);
    try {
      const presets = ['neon-city', 'destruction-zone', 'finals-arena', 'monaco-streets', 'urban-battlefield', 'casino-royale', 'skybridge-arena', 'neon-paradise', 'crystal-district', 'fire-storm', 'ice-cold', 'toxic-green', 'cyberpunk-pink'];
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Based on the text "${config.mainText}" and subtitle "${config.subText}", which of these presets would work best: ${presets.join(', ')}. Return only the preset name.`
            }]
          }]
        })
      });

      const data = await response.json();
      const aiPreset = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toLowerCase();
      
      if (aiPreset && presets.includes(aiPreset)) {
        onConfigChange('backgroundPreset', aiPreset);
        
        toast({
          title: "Smart Preset Applied! 🚀",
          description: `AI selected "${aiPreset}" as the perfect match`,
        });
      }
    } catch (error) {
      console.error('Preset suggestion failed:', error);
      toast({
        title: "Preset Suggestion Failed",
        description: "Could not suggest preset. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // AI-powered character positioning system
  const optimizeCharacterPosition = async () => {
    if (!config.overlayImage) {
      toast({
        title: "No Character Selected",
        description: "Please upload or select a character first.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = `Analyze this YouTube gaming thumbnail composition:

Title: "${config.mainText}"
Subtitle: "${config.subText}"
Background: ${config.backgroundPreset}
Current Character Size: ${config.overlayImageSize || 25}%
Font Size: ${config.fontSize}
Text Position: ${config.textPosition}

Determine the optimal character positioning strategy for maximum visual impact and engagement:

POSITIONING OPTIONS:
1. bottom-right: Character anchored to bottom-right corner (classic gaming style)
2. bottom-left: Character on bottom-left for text balance  
3. center-right: Character positioned on right side, vertically centered
4. center-left: Character on left side for dynamic composition
5. top-right: Character in upper right for dramatic effect
6. full-center: Character dominates center with text overlay

SIZING RECOMMENDATIONS:
- small (20-35%): For text-heavy thumbnails
- medium (40-60%): Balanced character/text presence  
- large (65-85%): Character-focused thumbnails
- dominant (90-100%): Character is the main focus

Consider:
- Text readability and contrast
- Visual hierarchy and flow
- Gaming thumbnail best practices
- Character prominence vs text importance
- Background compatibility
- Eye-catching composition

Return format: POSITION|SIZE|EXPLANATION
Example: center-right|75|Character positioned on right creates dynamic composition while leaving space for impactful text on left side`;

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
        const [position, size, explanation] = aiResponse.split('|');
        const cleanPosition = position.trim().toLowerCase();
        const cleanSize = parseInt(size.trim());
        
        // Validate AI recommendations
        const validPositions = ['bottom-right', 'bottom-left', 'center-right', 'center-left', 'top-right', 'full-center'];
        const finalPosition = validPositions.includes(cleanPosition) ? cleanPosition : 'center-right';
        const finalSize = Math.max(20, Math.min(100, cleanSize || 50));
        
        // Apply AI recommendations
        onConfigChange('characterPosition', finalPosition);
        onConfigChange('overlayImageSize', finalSize);
        
        // Also optimize text position based on character placement
        if (finalPosition.includes('left')) {
          onConfigChange('textPosition', 'center-right');
        } else if (finalPosition.includes('right')) {
          onConfigChange('textPosition', 'center-left');
        } else if (finalPosition === 'full-center') {
          onConfigChange('textPosition', 'overlay-top');
        }
        
        toast({
          title: "Character Position Optimized!",
          description: `AI positioned character ${finalPosition} at ${finalSize}% size. ${explanation?.substring(0, 50)}...`,
          duration: 5000
        });
      } else {
        // Fallback intelligent positioning
        const textLength = (config.mainText + config.subText).length;
        const backgroundType = config.backgroundPreset;
        
        let optimalPosition = 'center-right';
        let optimalSize = 60;
        
        if (textLength > 20) {
          optimalPosition = 'bottom-right';
          optimalSize = 45;
        } else if (backgroundType.includes('neon') || backgroundType.includes('cyber')) {
          optimalPosition = 'center-left';
          optimalSize = 70;
        }
        
        onConfigChange('characterPosition', optimalPosition);
        onConfigChange('overlayImageSize', optimalSize);
        
        toast({
          title: "Smart Position Applied!",
          description: `Applied ${optimalPosition} positioning with ${optimalSize}% size.`
        });
      }
    } catch (error) {
      console.error('Character positioning failed:', error);
      toast({
        title: "Positioning Failed",
        description: "Could not optimize character position. Using smart fallback.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // NEW: Let Gemini AI pick the best Las Vegas image
  const pickBestVegasImage = async () => {
    setIsGenerating(true);
    try {
      // Fetch Vegas background options from backend
      const res = await fetch('/api/las-vegas-images');
      const vegasOptions = await res.json();
      console.log('Vegas options received:', vegasOptions);
      if (!Array.isArray(vegasOptions) || vegasOptions.length === 0) throw new Error('No Vegas options found');

      // Extract names and descriptions for better AI selection
      const optionDetails = vegasOptions.map(option => `${option.name}: ${option.description || ''}`);
      console.log('Vegas options for AI selection:', optionDetails);
      
      // Enhanced prompt for better AI decision making
      const prompt = `You are an expert YouTube thumbnail designer analyzing The Finals game backgrounds for maximum click-through rate.

THUMBNAIL CONTENT:
Title: "${config.mainText}" 
Subtitle: "${config.subText}"
Current Theme: Gaming challenge/action
Target: High engagement, viral potential

AVAILABLE VEGAS BACKGROUNDS:
${optionDetails.join('\n')}

ANALYSIS CRITERIA:
1. Visual Impact: Which creates the most dramatic, eye-catching backdrop?
2. Text Readability: Which provides best contrast for white/colored text overlay?
3. Mood Match: Which background amplifies the energy of "${config.mainText}"?
4. Gaming Appeal: Which location screams "epic gaming moment"?
5. Thumbnail Psychology: Which makes viewers want to click immediately?

Consider ALL options carefully. Choose the single best option that maximizes:
- Click-through rate potential
- Visual drama and excitement  
- Professional gaming thumbnail appeal
- Text overlay compatibility

Return ONLY the exact background name (before the colon), nothing else.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      const data = await response.json();
      console.log('Gemini API response:', data);
      const aiChoice = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim().replace(/\n/g, '');
      console.log('AI Choice cleaned:', aiChoice);
      
      // Improved flexible matching logic
      let found = vegasOptions.find(option => {
        const match = aiChoice && (
          aiChoice.toLowerCase().includes(option.name.toLowerCase()) ||
          option.name.toLowerCase().includes(aiChoice.toLowerCase()) ||
          // Check for partial word matches
          option.name.toLowerCase().split('-').some((word: string) => aiChoice.toLowerCase().includes(word))
        );
        console.log(`Checking ${option.name} against ${aiChoice}: ${match}`);
        return match;
      });
      
      // If no match, try keyword-based intelligent selection
      if (!found && aiChoice) {
        const keywords = aiChoice.toLowerCase();
        if (keywords.includes('neon') || keywords.includes('alley')) {
          found = vegasOptions.find(opt => opt.name.includes('neon-alley'));
        } else if (keywords.includes('overview') || keywords.includes('aerial') || keywords.includes('battle')) {
          found = vegasOptions.find(opt => opt.name.includes('overview-battle'));
        } else if (keywords.includes('garage') || keywords.includes('chaos')) {
          found = vegasOptions.find(opt => opt.name.includes('garage-chaos'));
        } else if (keywords.includes('strip') || keywords.includes('panoramic')) {
          found = vegasOptions.find(opt => opt.name.includes('strip-overview'));
        }
      }
      
      if (found) {
        console.log('Found matching image:', found);
        console.log('Setting background image to:', found.url);
        onConfigChange('backgroundPreset', 'las-vegas');
        onConfigChange('backgroundImage', found.url);
        toast({
          title: 'AI Selected Perfect Vegas Scene!',
          description: `Gemini analyzed all options and chose "${found.name.replace(/-/g, ' ')}" for maximum impact.`,
          duration: 4000
        });
      } else {
        // Smart fallback: analyze thumbnail content to pick best option
        console.log('Using smart content-based selection from all options');
        const textContent = (config.mainText + ' ' + config.subText).toLowerCase();
        let smartChoice;
        
        if (textContent.includes('damage') || textContent.includes('challenge')) {
          smartChoice = vegasOptions.find(opt => opt.name.includes('garage-chaos')) || vegasOptions[2];
        } else if (textContent.includes('win') || textContent.includes('battle')) {
          smartChoice = vegasOptions.find(opt => opt.name.includes('overview-battle')) || vegasOptions[0];
        } else if (textContent.includes('finals')) {
          smartChoice = vegasOptions.find(opt => opt.name.includes('strip-overview')) || vegasOptions[6];
        } else {
          // Rotate through different options based on current selection
          const currentUrl = config.backgroundImage;
          const currentIndex = vegasOptions.findIndex(opt => opt.url === currentUrl);
          smartChoice = vegasOptions[(currentIndex + 1) % vegasOptions.length];
        }
        
        console.log('Smart choice selected:', smartChoice);
        onConfigChange('backgroundPreset', 'las-vegas');
        onConfigChange('backgroundImage', smartChoice.url);
        toast({
          title: 'Smart Vegas Selection!',
          description: `AI analyzed your content and selected "${smartChoice.name.replace(/-/g, ' ')}" from all available options.`,
          duration: 4000
        });
      }
    } catch (error) {
      console.error('AI image selection failed:', error);
      // Fallback to just setting vegas preset
      onConfigChange('backgroundPreset', 'las-vegas');
      toast({
        title: 'Vegas Theme Applied!',
        description: 'Applied Las Vegas theme to your thumbnail.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Cycle through different Vegas images
  const cycleVegasImages = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/las-vegas-images');
      const vegasOptions = await res.json();
      
      if (!Array.isArray(vegasOptions) || vegasOptions.length === 0) {
        throw new Error('No Vegas options available');
      }
      
      // Find current image and get next one
      const currentUrl = config.backgroundImage;
      const currentIndex = vegasOptions.findIndex(opt => opt.url === currentUrl);
      const nextIndex = (currentIndex + 1) % vegasOptions.length;
      const nextImage = vegasOptions[nextIndex];
      
      onConfigChange('backgroundPreset', 'las-vegas');
      onConfigChange('backgroundImage', nextImage.url);
      
      toast({
        title: 'Vegas Scene Changed!',
        description: `Now showing "${nextImage.name.replace(/-/g, ' ')}" (${nextIndex + 1}/${vegasOptions.length})`,
        duration: 3000
      });
    } catch (error) {
      console.error('Vegas cycling failed:', error);
      toast({
        title: "Could not cycle images",
        description: "Please try the AI picker instead.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // NEW FEATURE: Auto-enhance entire thumbnail with AI
  const autoEnhanceThumbnail = async () => {
    setIsGenerating(true);
    try {
      const prompt = `You are a viral YouTube thumbnail expert. Analyze this gaming thumbnail and provide optimal settings for maximum click-through rate:

CURRENT THUMBNAIL:
Title: "${config.mainText}"
Subtitle: "${config.subText}"
Background: ${config.backgroundPreset}
Has Character: ${config.overlayImage ? 'Yes' : 'No'}
Current Colors: Text(${config.textColor}), Accent(${config.accentColor})

ENHANCEMENT GOALS:
1. Maximum visual impact and click-worthiness
2. Professional gaming thumbnail aesthetics  
3. High contrast for mobile viewing
4. Trending YouTube gaming styles
5. Psychological triggers for engagement

PROVIDE OPTIMAL SETTINGS:
Return format: TEXT_COLOR|ACCENT_COLOR|FONT_SIZE|EFFECTS|EXPLANATION

Effects options: glow+particles+shadow+outline (use + to combine)
Font sizes: small|medium|large|xlarge
Colors: Use hex codes that create maximum contrast and appeal

Example: #FFFFFF|#FF6B35|xlarge|glow+particles+outline|High contrast orange accent with large text creates maximum impact for action content`;

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
        const [textColor, accentColor, fontSize, effects, explanation] = aiResponse.split('|');
        
        // Apply AI recommendations
        if (textColor.trim().startsWith('#')) {
          onConfigChange('textColor', textColor.trim());
        }
        if (accentColor.trim().startsWith('#')) {
          onConfigChange('accentColor', accentColor.trim());
        }
        if (['small', 'medium', 'large', 'xlarge'].includes(fontSize.trim())) {
          onConfigChange('fontSize', fontSize.trim());
        }
        
        // Apply effects
        const effectsList = effects.trim().toLowerCase();
        onConfigChange('glowEffect', effectsList.includes('glow'));
        onConfigChange('showParticles', effectsList.includes('particles'));
        onConfigChange('textShadow', effectsList.includes('shadow'));
        onConfigChange('textOutline', effectsList.includes('outline'));
        onConfigChange('borderGlow', effectsList.includes('glow'));
        
        // Auto-optimize for mobile
        onConfigChange('textOpacity', 100);
        onConfigChange('animatedText', true);
        
        toast({
          title: "Thumbnail Auto-Enhanced!",
          description: `AI applied viral-worthy settings: ${explanation?.substring(0, 60)}...`,
          duration: 6000
        });
      } else {
        // Fallback enhancement based on content analysis
        const isActionContent = (config.mainText + config.subText).toLowerCase().includes('damage') || 
                              (config.mainText + config.subText).toLowerCase().includes('win') ||
                              (config.mainText + config.subText).toLowerCase().includes('challenge');
        
        if (isActionContent) {
          onConfigChange('textColor', '#FFFFFF');
          onConfigChange('accentColor', '#FF4500'); 
          onConfigChange('fontSize', 'xlarge');
          onConfigChange('glowEffect', true);
          onConfigChange('showParticles', true);
          onConfigChange('textShadow', true);
          onConfigChange('borderGlow', true);
        } else {
          onConfigChange('textColor', '#FFFFFF');
          onConfigChange('accentColor', '#00D4FF');
          onConfigChange('fontSize', 'large');
          onConfigChange('glowEffect', true);
          onConfigChange('showParticles', false);
          onConfigChange('textShadow', true);
        }
        
        toast({
          title: "Smart Enhancement Applied!",
          description: "Auto-optimized for maximum visual impact based on content analysis.",
        });
      }
    } catch (error) {
      console.error('Auto enhancement failed:', error);
      toast({
        title: "Enhancement Failed",
        description: "Could not auto-enhance. Please try individual AI tools.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl border border-purple-300/20">
      <div className="flex items-center space-x-2 mb-3">
        <Brain className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">AI Thumbnail Enhancer</h3>
        <div className="px-2 py-1 bg-green-500/20 rounded-full">
          <span className="text-xs text-green-400 font-medium">POWERED BY GEMINI</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        <Button
          onClick={generateAIText}
          disabled={isGenerating}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all duration-300"
        >
          {isGenerating ? (
            <>
              <Zap className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              AI Smart Text
            </>
          )}
        </Button>
        
        <Button
          onClick={optimizeColors}
          disabled={isGenerating}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white transition-all duration-300"
        >
          {isGenerating ? (
            <>
              <Zap className="w-4 h-4 mr-2 animate-spin" />
              Optimizing...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              AI Color Boost
            </>
          )}
        </Button>
        
        <Button
          onClick={suggestPreset}
          disabled={isGenerating}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transition-all duration-300"
        >
          {isGenerating ? (
            <>
              <Zap className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4 mr-2" />
              AI Perfect Preset
            </>
          )}
        </Button>
        
        <Button
          onClick={optimizeCharacterPosition}
          disabled={isGenerating}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all duration-300"
        >
          {isGenerating ? (
            <>
              <Zap className="w-4 h-4 mr-2 animate-spin" />
              AI Positioning...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4 mr-2" />
              AI Character Position
            </>
          )}
        </Button>

        <Button
          onClick={autoEnhanceThumbnail}
          disabled={isGenerating}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white transition-all duration-300"
        >
          {isGenerating ? (
            <>
              <Zap className="w-4 h-4 mr-2 animate-spin" />
              Auto Enhancing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              AI Auto Enhance All
            </>
          )}
        </Button>
        
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={pickBestVegasImage}
            disabled={isGenerating}
            className="bg-gradient-to-r from-yellow-600 to-pink-600 hover:from-yellow-700 hover:to-pink-700 text-white transition-all duration-300"
          >
            {isGenerating ? (
              <>
                <Zap className="w-4 h-4 mr-2 animate-spin" />
                AI Picking...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                AI Pick Vegas
              </>
            )}
          </Button>
          
          <Button
            onClick={cycleVegasImages}
            disabled={isGenerating}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white transition-all duration-300"
          >
            {isGenerating ? (
              <>
                <Zap className="w-4 h-4 mr-2 animate-spin" />
                Cycling...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Different
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="text-xs text-white/60 mt-3 p-2 bg-black/20 rounded">
        ⚡ NEW: AI Auto Enhance applies viral-worthy colors, effects, and sizing in one click! Character box issue fixed.
      </div>
    </div>
  );
};

export default AIEnhancer;
