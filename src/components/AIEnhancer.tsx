
import { useState } from 'react';
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
  const API_KEY = 'AIzaSyCbuWhugmrcCT02RyUYr-2S18T4sV1Ud44';

  const generateAIText = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
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
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
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
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
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
      </div>
      
      <div className="text-xs text-white/60 mt-3 p-2 bg-black/20 rounded">
        💡 Tip: AI learns from your content to suggest viral-worthy thumbnails!
      </div>
    </div>
  );
};

export default AIEnhancer;
