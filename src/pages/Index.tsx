
import { useState } from 'react';
import ThumbnailCanvas from '../components/ThumbnailCanvas';
import ControlPanel from '../components/ControlPanel';
import PresetSelector from '../components/PresetSelector';
import { Button } from '@/components/ui/button';
import { Download, Palette, Type, Image } from 'lucide-react';

const Index = () => {
  const [thumbnailConfig, setThumbnailConfig] = useState({
    mainText: 'CAN I WIN WITHOUT DAMAGE?',
    subText: 'THE FINALS CHALLENGE',
    backgroundPreset: 'neon-city',
    textColor: '#ffffff',
    accentColor: '#00ff88',
    fontSize: 'large',
    textPosition: 'center',
    showParticles: true,
    glowEffect: true,
    backgroundImage: null as string | null
  });

  const handleConfigChange = (key: string, value: any) => {
    setThumbnailConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleExport = () => {
    // In a real implementation, this would capture the canvas and download it
    console.log('Exporting thumbnail with config:', thumbnailConfig);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                <Image className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">THE FINALS Thumbnail Maker</h1>
            </div>
            <Button 
              onClick={handleExport}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Thumbnail
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-8">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-1 space-y-4 lg:space-y-6 order-2 lg:order-1">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 lg:p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Palette className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-semibold text-white">Quick Presets</h2>
              </div>
              <PresetSelector 
                currentPreset={thumbnailConfig.backgroundPreset}
                onPresetChange={(preset) => handleConfigChange('backgroundPreset', preset)}
              />
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 lg:p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Type className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-semibold text-white">Customize</h2>
              </div>
              <ControlPanel 
                config={thumbnailConfig}
                onConfigChange={handleConfigChange}
              />
            </div>
          </div>

          {/* Main Canvas Area */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 lg:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 lg:mb-6 text-center">
                Thumbnail Preview (1280x720)
              </h2>
              <ThumbnailCanvas config={thumbnailConfig} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
