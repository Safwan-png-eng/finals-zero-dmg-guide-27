import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Wand2, Brain, Zap } from 'lucide-react';
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
      
      // Compose enhanced prompt for Gemini
      const prompt = `Given this YouTube thumbnail title: "${config.mainText}" and subtitle: "${config.subText}", which Vegas background from The Finals game would create the most engaging thumbnail?

Options:
${optionDetails.join('\n')}

Consider:
- Which background matches the energy and theme of the text
- Visual impact for a YouTube thumbnail
- Color contrast for text readability

Return only the exact option name (before the colon).`;

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
      const found = vegasOptions.find(option => {
        const match = aiChoice && (
          aiChoice.toLowerCase().includes(option.name.toLowerCase()) ||
          option.name.toLowerCase().includes(aiChoice.toLowerCase())
        );
        console.log(`Checking ${option.name} against ${aiChoice}: ${match}`);
        return match;
      });
      
      if (found) {
        // Set both the background preset to vegas and the selected image URL
        console.log('Found matching image:', found);
        console.log('Setting background image to:', found.url);
        onConfigChange('backgroundPreset', 'las-vegas');
        onConfigChange('backgroundImage', found.url);
        toast({
          title: 'AI Selected Vegas Image!',
          description: `Gemini picked "${found.name}" as the perfect match for your thumbnail.`
        });
      } else {
        // Fallback to random vegas image
        console.log('No match found, using random image');
        const randomImage = vegasOptions[Math.floor(Math.random() * vegasOptions.length)];
        console.log('Random image selected:', randomImage);
        onConfigChange('backgroundPreset', 'las-vegas');
        onConfigChange('backgroundImage', randomImage.url);
        toast({
          title: 'Vegas Image Applied!',
          description: `Applied ${randomImage.name} to your thumbnail.`,
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
          onClick={pickBestVegasImage}
          disabled={isGenerating}
          className="bg-gradient-to-r from-yellow-600 to-pink-600 hover:from-yellow-700 hover:to-pink-700 text-white transition-all duration-300"
        >
          {isGenerating ? (
            <>
              <Zap className="w-4 h-4 mr-2 animate-spin" />
              AI Picking Image...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              AI Pick Vegas Image
            </>
          )}
        </Button>
      </div>
      
      <div className="text-xs text-white/60 mt-3 p-2 bg-black/20 rounded">
        💡 Tip: AI learns from your content to suggest viral-worthy thumbnails!
      </div>
    </div>
  );
};

export default AIEnhancer;
