import { useState, useEffect } from 'react';
import ThumbnailCanvas from '../components/ThumbnailCanvas';
import ControlPanel from '../components/ControlPanel';
import PresetSelector from '../components/PresetSelector';
import AIEnhancer from '../components/AIEnhancer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Palette, Type, Image, Sparkles, Zap, RefreshCw, Brain, Save, Upload, Share2, Eye, History, Star } from 'lucide-react';
import { exportThumbnail } from '../utils/canvasExport';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [thumbnailConfig, setThumbnailConfig] = useState({
    mainText: 'CAN I WIN WITHOUT DAMAGE?',
    subText: 'THE FINALS CHALLENGE',
    backgroundPreset: 'las-vegas',
    textColor: '#ffffff',
    accentColor: '#FFD700',
    fontSize: 'medium',
    textPosition: 'center',
    showParticles: true,
    glowEffect: true,
    backgroundImage: null as string | null,
    overlayImage: null as string | null,
    overlayImageSize: 25,
    characterPosition: 'bottom-right',
    characterBlendMode: 'natural',
    characterRemoveBackground: false,
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
  const [savedProjects, setSavedProjects] = useState<any[]>([]);
  const [currentProjectName, setCurrentProjectName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [recentChanges, setRecentChanges] = useState(0);

  // Load saved projects from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('thumbnailProjects');
    if (saved) {
      setSavedProjects(JSON.parse(saved));
    }
  }, []);

  // Auto-save functionality
  useEffect(() => {
    setRecentChanges(prev => prev + 1);
  }, [thumbnailConfig]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            const name = prompt('Enter project name:');
            if (name) saveProject(name);
            break;
          case 'e':
            e.preventDefault();
            handleExport();
            break;
          case 'r':
            e.preventDefault();
            resetToDefault();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [thumbnailConfig]);

  const handleConfigChange = (key: string, value: any) => {
    setThumbnailConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Save current project
  const saveProject = (name: string) => {
    const project = {
      id: Date.now().toString(),
      name,
      config: thumbnailConfig,
      timestamp: new Date().toISOString(),
      thumbnail: null // We could add thumbnail preview later
    };
    
    const updatedProjects = [...savedProjects, project];
    setSavedProjects(updatedProjects);
    localStorage.setItem('thumbnailProjects', JSON.stringify(updatedProjects));
    setCurrentProjectName(name);
    
    toast({
      title: "Project Saved!",
      description: `"${name}" has been saved successfully`,
    });
  };

  // Load existing project
  const loadProject = (project: any) => {
    setThumbnailConfig(project.config);
    setCurrentProjectName(project.name);
    
    toast({
      title: "Project Loaded!",
      description: `"${project.name}" has been loaded`,
    });
  };

  // Delete project
  const deleteProject = (projectId: string) => {
    const updatedProjects = savedProjects.filter(p => p.id !== projectId);
    setSavedProjects(updatedProjects);
    localStorage.setItem('thumbnailProjects', JSON.stringify(updatedProjects));
    
    toast({
      title: "Project Deleted",
      description: "Project has been removed from your saved projects",
    });
  };

  // Share project (copy config to clipboard)
  const shareProject = () => {
    const shareData = {
      config: thumbnailConfig,
      timestamp: new Date().toISOString()
    };
    
    navigator.clipboard.writeText(JSON.stringify(shareData, null, 2));
    toast({
      title: "Config Copied!",
      description: "Project configuration copied to clipboard",
    });
  };

  // NEW FEATURE 10: Reset to Default
  const resetToDefault = () => {
    setThumbnailConfig({
      mainText: 'CAN I WIN WITHOUT DAMAGE?',
      subText: 'THE FINALS CHALLENGE',
      backgroundPreset: 'las-vegas',
      textColor: '#ffffff',
      accentColor: '#FFD700',
      fontSize: 'medium',
      textPosition: 'center',
      showParticles: true,
      glowEffect: true,
      backgroundImage: null,
      overlayImage: null,
      overlayImageSize: 25,
      characterPosition: 'bottom-right',
      characterBlendMode: 'natural',
      characterRemoveBackground: false,
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
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {currentProjectName && (
                <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-400/30 px-3 py-1">
                  <Save className="w-3 h-3 mr-1" />
                  {currentProjectName}
                </Badge>
              )}
              
              <Button 
                onClick={() => {
                  const name = prompt('Enter project name:');
                  if (name) saveProject(name);
                }}
                variant="outline"
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              
              <Button 
                onClick={shareProject}
                variant="outline"
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              
              <Button 
                onClick={resetToDefault}
                variant="outline"
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              
              <Button 
                onClick={handleExport}
                disabled={isExporting}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Export HD
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
            {/* Saved Projects Section */}
            {savedProjects.length > 0 && (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-2xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                    <History className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Saved Projects</h2>
                  <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 border-amber-400/30">
                    {savedProjects.length}
                  </Badge>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {savedProjects.slice(-5).reverse().map((project) => (
                    <div key={project.id} className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/10">
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm">{project.name}</h4>
                        <p className="text-white/60 text-xs">
                          {new Date(project.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => loadProject(project)}
                          size="sm"
                          variant="outline"
                          className="bg-white/10 hover:bg-white/20 text-white border-white/20 h-7 px-2"
                        >
                          <Upload className="w-3 h-3" />
                        </Button>
                        <Button
                          onClick={() => deleteProject(project.id)}
                          size="sm"
                          variant="outline"
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-400/30 h-7 px-2"
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* NEW: AI Enhancer Section */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">AI Studio Enhancement</h2>
                <div className="px-2 py-1 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full border border-green-400/30">
                  <span className="text-xs text-green-400 font-bold">GEMINI AI</span>
                </div>
              </div>
              <AIEnhancer 
                config={thumbnailConfig}
                onConfigChange={handleConfigChange}
              />
            </div>

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
                  {recentChanges > 0 && (
                    <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400 border-cyan-400/30 animate-pulse">
                      <Eye className="w-3 h-3 mr-1" />
                      Live
                    </Badge>
                  )}
                </h2>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-400/30">
                    <Star className="w-3 h-3 mr-1" />
                    HD Quality
                  </Badge>
                  <div className="text-sm text-white/60 bg-white/10 px-3 py-1 rounded-full">
                    1280×720 • YouTube Ready
                  </div>
                </div>
              </div>
              <ThumbnailCanvas config={thumbnailConfig} />
              
              {/* Quick Action Bar */}
              <div className="mt-4 flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center space-x-4 text-sm text-white/70">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Real-time updates</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>AI-powered effects</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => {
                      const canvas = document.querySelector('canvas');
                      if (canvas) {
                        canvas.requestFullscreen?.();
                      }
                    }}
                    size="sm"
                    variant="outline"
                    className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <Button
                    onClick={handleExport}
                    disabled={isExporting}
                    size="sm"
                    className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            </div>

            {/* Enhanced Tips & Templates Section */}
            <div className="mt-6 space-y-4">
              {/* Quick Templates */}
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl border border-purple-300/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <Star className="w-5 h-5 text-purple-400" />
                  <span>Quick Templates</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { name: 'Gaming Challenge', main: 'CAN I WIN THIS?', sub: 'IMPOSSIBLE CHALLENGE', color: '#ff0080' },
                    { name: 'No Damage Run', main: 'NO DAMAGE RUN', sub: 'THE FINALS', color: '#00ff88' },
                    { name: 'Epic Comeback', main: 'EPIC COMEBACK!', sub: '1 VS 3 CLUTCH', color: '#ffd700' },
                    { name: 'First Time', main: 'FIRST TIME PLAYING', sub: 'TOTAL NOOB', color: '#00d4ff' }
                  ].map((template, index) => (
                    <Button
                      key={index}
                      onClick={() => {
                        handleConfigChange('mainText', template.main);
                        handleConfigChange('subText', template.sub);
                        handleConfigChange('accentColor', template.color);
                      }}
                      variant="outline"
                      className="bg-white/5 hover:bg-white/10 text-white border-white/20 p-3 h-auto flex-col items-start text-left"
                    >
                      <div className="font-medium text-sm">{template.name}</div>
                      <div className="text-xs text-white/60 mt-1">{template.main}</div>
                      <div className="text-xs text-white/40">{template.sub}</div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Pro Tips */}
              <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl border border-cyan-300/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <span>Pro Tips & Features</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white/80 text-sm">
                  <div>
                    <h4 className="font-medium text-cyan-300 mb-2">Design Tips:</h4>
                    <ul className="space-y-1">
                      <li>• Use bold, contrasting colors</li>
                      <li>• Keep text under 6 words</li>
                      <li>• Test thumbnail at 150px width</li>
                      <li>• Use emotional expressions</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-300 mb-2">AI Features:</h4>
                    <ul className="space-y-1">
                      <li>• Gemini AI text generation</li>
                      <li>• Smart color combinations</li>
                      <li>• Auto character positioning</li>
                      <li>• Background removal AI</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-purple-300 mb-2">New Features:</h4>
                    <ul className="space-y-1">
                      <li>• Save/load projects</li>
                      <li>• Share configurations</li>
                      <li>• Quick templates</li>
                      <li>• Real-time preview</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Footer */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white/60 text-sm">
            <div>
              <h4 className="font-semibold text-white mb-3">Keyboard Shortcuts</h4>
              <ul className="space-y-1">
                <li><kbd className="bg-white/10 px-2 py-1 rounded text-xs">Ctrl+S</kbd> Save Project</li>
                <li><kbd className="bg-white/10 px-2 py-1 rounded text-xs">Ctrl+E</kbd> Export Thumbnail</li>
                <li><kbd className="bg-white/10 px-2 py-1 rounded text-xs">Ctrl+R</kbd> Reset to Default</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Features</h4>
              <ul className="space-y-1">
                <li>• HD Export (1280x720)</li>
                <li>• AI Text Generation</li>
                <li>• Background Removal</li>
                <li>• Project Save/Load</li>
                <li>• Real-time Preview</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">About</h4>
              <p className="text-xs leading-relaxed">
                Professional YouTube thumbnail generator specifically designed for THE FINALS content creators. 
                Features AI-powered text generation, smart character positioning, and export optimization 
                for maximum click-through rates.
              </p>
              <div className="mt-3 flex space-x-2">
                <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400 border-cyan-400/30 text-xs">
                  v2.0 Enhanced
                </Badge>
                <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-400/30 text-xs">
                  AI Powered
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
