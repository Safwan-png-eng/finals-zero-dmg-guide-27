
import { useState } from 'react';
import ThumbnailCanvas from '../components/ThumbnailCanvas';
import ControlPanel from '../components/ControlPanel';
import PresetSelector from '../components/PresetSelector';
import { Button } from '@/components/ui/button';
import { Download, Palette, Type, Image, Sparkles, Zap, RefreshCw } from 'lucide-react';
import { exportThumbnail } from '../utils/canvasExport';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [thumbnailConfig, setThumbnailConfig] = useState({
    mainText: 'CAN I WIN WITHOUT DAMAGE?',
    subText: 'THE FINALS CHALLENGE',
    backgroundPreset: 'neon-city',
    textColor: '#ffffff',
    accentColor: '#00ff88',
    fontSize: 'medium',
    textPosition: 'center',
    showParticles: true,
    glowEffect: true,
    backgroundImage: null as string | null,
    overlayImage: null as string | null,
    overlayImageSize: 25, // New property for overlay image size (percentage)
    textShadow: true,
    borderGlow: false,
    textOutline: false,
    textRotation: 0,
    textOpacity: 100,
    animatedText: false,
    gradientText: false,
    customFont: 'impact',
    letterSpacing: 'normal',
    lineHeight: 'normal',
    textBackground: false,
    textBackgroundColor: '#000000',
    textBackgroundOpacity: 50
  });

  const [isExporting, setIsExporting] = useState(false);

  const handleConfigChange = (key: string, value: any) => {
    setThumbnailConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // NEW FEATURE 10: Reset to Default
  const resetToDefault = () => {
    setThumbnailConfig({
      mainText: 'CAN I WIN WITHOUT DAMAGE?',
      subText: 'THE FINALS CHALLENGE',
      backgroundPreset: 'neon-city',
      textColor: '#ffffff',
      accentColor: '#00ff88',
      fontSize: 'medium',
      textPosition: 'center',
      showParticles: true,
      glowEffect: true,
      backgroundImage: null,
      overlayImage: null,
      overlayImageSize: 25,
      textShadow: true,
      borderGlow: false,
      textOutline: false,
      textRotation: 0,
      textOpacity: 100,
      animatedText: false,
      gradientText: false,
      customFont: 'impact',
      letterSpacing: 'normal',
      lineHeight: 'normal',
      textBackground: false,
      textBackgroundColor: '#000000',
      textBackgroundOpacity: 50
    });
    toast({
      title: "Reset Complete!",
      description: "All settings have been restored to default values",
    });
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportThumbnail(thumbnailConfig);
      toast({
        title: "Success!",
        description: "Thumbnail exported successfully",
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export thumbnail. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">THE FINALS Thumbnail Maker</h1>
                <p className="text-sm text-white/60">Professional YouTube thumbnails in seconds</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={resetToDefault}
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 px-6 py-3 rounded-xl transition-all duration-300"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button 
                onClick={handleExport}
                disabled={isExporting}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? (
                  <>
                    <Zap className="w-5 h-5 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Export HD Thumbnail
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 lg:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 lg:gap-8">
          {/* Left Sidebar - Controls */}
          <div className="xl:col-span-2 space-y-6 order-2 xl:order-1">
            {/* Quick Presets */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Quick Presets</h2>
              </div>
              <PresetSelector 
                currentPreset={thumbnailConfig.backgroundPreset}
                onPresetChange={(preset) => handleConfigChange('backgroundPreset', preset)}
              />
            </div>

            {/* Customization Panel */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                  <Type className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Customize Design</h2>
              </div>
              <ControlPanel 
                config={thumbnailConfig}
                onConfigChange={handleConfigChange}
              />
            </div>
          </div>

          {/* Main Canvas Area */}
          <div className="xl:col-span-3 order-1 xl:order-2">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-3">
                  <Image className="w-6 h-6 text-cyan-400" />
                  <span>Live Preview</span>
                </h2>
                <div className="text-sm text-white/60 bg-white/10 px-3 py-1 rounded-full">
                  1280×720 • YouTube Ready
                </div>
              </div>
              <ThumbnailCanvas config={thumbnailConfig} />
            </div>

            {/* Enhanced Tips Section */}
            <div className="mt-6 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl border border-cyan-300/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span>Pro Tips & New Features</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80 text-sm">
                <div>
                  <h4 className="font-medium text-cyan-300 mb-2">Design Tips:</h4>
                  <ul className="space-y-1">
                    <li>• Use contrasting colors for readability</li>
                    <li>• Keep text short and impactful</li>
                    <li>• Test at small sizes for clarity</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-purple-300 mb-2">New Features:</h4>
                  <ul className="space-y-1">
                    <li>• Custom fonts & text styling</li>
                    <li>• Text rotation & opacity controls</li>
                    <li>• Gradient & animated text effects</li>
                    <li>• Text backgrounds & outlines</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
