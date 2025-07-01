import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Upload, X, Scissors, Sparkles, User, Type, Palette, RotateCcw, Maximize2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { removeBackground, loadImage } from '../utils/backgroundRemoval';
import { useToast } from '@/hooks/use-toast';

interface ControlPanelProps {
  config: any;
  onConfigChange: (key: string, value: any) => void;
}

const ControlPanel = ({ config, onConfigChange }: ControlPanelProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const overlayInputRef = useRef<HTMLInputElement>(null);
  const [isRemovingBackground, setIsRemovingBackground] = useState(false);

  const colorPresets = [
    { name: 'Electric Blue', value: '#00d4ff' },
    { name: 'Neon Green', value: '#00ff88' },
    { name: 'Hot Pink', value: '#ff0080' },
    { name: 'Fire Orange', value: '#ff4500' },
    { name: 'Cyber Purple', value: '#8b5cf6' },
    { name: 'Gold Rush', value: '#ffd700' },
    { name: 'Toxic Lime', value: '#32ff32' },
    { name: 'Ice Blue', value: '#00ffff' }
  ];

  const characterPresets = [
    {
      name: 'Shield Specialist',
      image: '/lovable-uploads/6aaa02a3-b77f-45ec-9397-781371f3e09b.png',
      description: 'THE FINALS Heavy class',
      position: 'center-right',
      size: 75
    },
    {
      name: 'Assault Fighter',
      image: '/lovable-uploads/6aaa02a3-b77f-45ec-9397-781371f3e09b.png',
      description: 'Aggressive Medium class',
      position: 'bottom-left',
      size: 65
    },
    {
      name: 'Speed Runner',
      image: '/lovable-uploads/6aaa02a3-b77f-45ec-9397-781371f3e09b.png',
      description: 'Fast Light class',
      position: 'center-left',
      size: 55
    }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onConfigChange('backgroundImage', result);
        toast({
          title: "Background Updated!",
          description: "Custom background image has been applied",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOverlayUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onConfigChange('overlayImage', result);
        toast({
          title: "Character Added!",
          description: "Custom character image has been uploaded",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCharacterPreset = (character: any) => {
    onConfigChange('overlayImage', character.image);
    onConfigChange('characterPosition', character.position);
    onConfigChange('overlayImageSize', character.size);
    toast({
      title: "Smart Character Applied!",
      description: `${character.name} positioned ${character.position} at ${character.size}% size`,
    });
  };

  const handleRemoveBackground = async () => {
    if (!config.overlayImage) {
      toast({
        title: "No image selected",
        description: "Please upload an overlay image first",
        variant: "destructive"
      });
      return;
    }

    setIsRemovingBackground(true);
    try {
      const img = await loadImage(await fetch(config.overlayImage).then(r => r.blob()));
      const processedBlob = await removeBackground(img);
      const processedDataUrl = URL.createObjectURL(processedBlob);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        onConfigChange('overlayImage', e.target?.result as string);
      };
      reader.readAsDataURL(processedBlob);
      
      toast({
        title: "Background Removed!",
        description: "Image background has been successfully removed",
      });
    } catch (error) {
      console.error('Background removal failed:', error);
      toast({
        title: "Background Removal Failed",
        description: "Failed to remove background. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRemovingBackground(false);
    }
  };

  const removeBackgroundImage = () => {
    onConfigChange('backgroundImage', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeOverlayImage = () => {
    onConfigChange('overlayImage', null);
    if (overlayInputRef.current) {
      overlayInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
      {/* Text Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="mainText" className="text-white mb-2 block font-medium">Main Text</Label>
          <Input
            id="mainText"
            value={config.mainText}
            onChange={(e) => onConfigChange('mainText', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder-white/50 rounded-lg"
            placeholder="Enter catchy main text..."
            maxLength={50}
          />
        </div>
        
        <div>
          <Label htmlFor="subText" className="text-white mb-2 block font-medium">Sub Text</Label>
          <Input
            id="subText"
            value={config.subText}
            onChange={(e) => onConfigChange('subText', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder-white/50 rounded-lg"
            placeholder="Enter subtitle..."
            maxLength={30}
          />
        </div>
      </div>

      {/* Font Selection */}
      <div className="space-y-3">
        <Label className="text-white mb-3 block font-medium flex items-center">
          <Type className="w-4 h-4 mr-2" />
          Font Family
        </Label>
        <Select value={config.customFont || 'impact'} onValueChange={(value) => onConfigChange('customFont', value)}>
          <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-white/20">
            <SelectItem value="impact" className="text-white">Impact (Bold)</SelectItem>
            <SelectItem value="arial" className="text-white">Arial (Clean)</SelectItem>
            <SelectItem value="bebas" className="text-white">Bebas Neue (Modern)</SelectItem>
            <SelectItem value="oswald" className="text-white">Oswald (Sleek)</SelectItem>
            <SelectItem value="roboto" className="text-white">Roboto (Minimal)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Background Image Section */}
      <div className="space-y-3">
        <Label className="text-white mb-3 block font-medium">Background Image</Label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="secondary"
          className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-lg"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Custom Background
        </Button>
        
        {config.backgroundImage && (
          <div className="relative">
            <img 
              src={config.backgroundImage} 
              alt="Background preview" 
              className="w-full h-20 object-cover rounded-lg border border-white/20"
            />
            <Button
              onClick={removeBackgroundImage}
              size="sm"
              variant="destructive"
              className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Character Presets */}
      <div className="space-y-3">
        <Label className="text-white mb-3 block font-medium flex items-center">
          <User className="w-4 h-4 mr-2" />
          Character Presets
        </Label>
        <div className="grid grid-cols-1 gap-2">
          {characterPresets.map((character, index) => (
            <button
              key={index}
              onClick={() => handleCharacterPreset(character)}
              className="flex items-center space-x-3 p-3 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-all duration-200"
            >
              <img 
                src={character.image} 
                alt={character.name}
                className="w-10 h-10 object-cover rounded-lg"
              />
              <div className="text-left flex-1">
                <h4 className="text-white font-medium text-sm">{character.name}</h4>
                <p className="text-white/60 text-xs">{character.description}</p>
                <p className="text-cyan-400 text-xs font-medium">{character.position} • {character.size}%</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Character/Overlay Section */}
      <div className="space-y-3">
        <Label className="text-white mb-3 block font-medium">Custom Character/Overlay</Label>
        <div className="grid grid-cols-2 gap-2">
          <input
            ref={overlayInputRef}
            type="file"
            accept="image/*"
            onChange={handleOverlayUpload}
            className="hidden"
          />
          <Button
            onClick={() => overlayInputRef.current?.click()}
            variant="secondary"
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-lg"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
          <Button
            onClick={handleRemoveBackground}
            disabled={!config.overlayImage || isRemovingBackground}
            variant="secondary"
            className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 text-white border-cyan-300/20 disabled:opacity-50 rounded-lg"
          >
            {isRemovingBackground ? (
              <Sparkles className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Scissors className="w-4 h-4 mr-2" />
            )}
            Remove BG
          </Button>
        </div>
        
        {config.overlayImage && (
          <div className="relative">
            <img 
              src={config.overlayImage} 
              alt="Overlay preview" 
              className="w-full h-24 object-contain rounded-lg border border-white/20 bg-gradient-to-b from-slate-700 to-slate-800"
            />
            <Button
              onClick={removeOverlayImage}
              size="sm"
              variant="destructive"
              className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Enhanced Character Controls */}
      {config.overlayImage && (
        <div className="space-y-6 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-6 rounded-xl border border-cyan-300/20 shadow-lg">
          {/* Enhanced Visual Character Position Grid */}
          <div className="space-y-4">
            <Label className="text-white mb-3 block font-medium flex items-center">
              <User className="w-5 h-5 mr-2 text-cyan-400" />
              <span className="text-lg">Character Position</span>
              <span className="ml-auto text-sm text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">
                {config.characterPosition || 'bottom-right'}
              </span>
            </Label>
            
            {/* Visual Grid Position Selector */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-black/30 rounded-xl border border-white/10">
              {[
                { pos: 'top-left', label: 'TL', desc: 'Unique' },
                { pos: 'top-center', label: 'TC', desc: 'Centered' },
                { pos: 'top-right', label: 'TR', desc: 'Dramatic' },
                { pos: 'center-left', label: 'CL', desc: 'Bold' },
                { pos: 'full-center', label: 'FC', desc: 'Dominant' },
                { pos: 'center-right', label: 'CR', desc: 'Dynamic' },
                { pos: 'bottom-left', label: 'BL', desc: 'Balance' },
                { pos: 'bottom-center', label: 'BC', desc: 'Stable' },
                { pos: 'bottom-right', label: 'BR', desc: 'Classic' }
              ].map((position) => (
                <button
                  key={position.pos}
                  onClick={() => onConfigChange('characterPosition', position.pos)}
                  className={`
                    relative aspect-square p-2 rounded-lg border-2 transition-all duration-300 group
                    ${(config.characterPosition || 'bottom-right') === position.pos 
                      ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400' 
                      : 'border-white/20 bg-white/5 text-white/70 hover:border-cyan-400/60 hover:bg-cyan-400/10'
                    }
                  `}
                >
                  <div className="text-xs font-bold">{position.label}</div>
                  <div className="text-[10px] opacity-80">{position.desc}</div>
                  
                  {/* Visual indicator dot */}
                  <div className={`
                    absolute w-2 h-2 rounded-full transition-all duration-300
                    ${(config.characterPosition || 'bottom-right') === position.pos 
                      ? 'bg-cyan-400' 
                      : 'bg-white/40 group-hover:bg-cyan-400/70'
                    }
                    ${position.pos.includes('top') ? 'top-1' : position.pos.includes('bottom') ? 'bottom-1' : 'top-1/2 -translate-y-1/2'}
                    ${position.pos.includes('left') ? 'left-1' : position.pos.includes('right') ? 'right-1' : 'left-1/2 -translate-x-1/2'}
                  `} />
                </button>
              ))}
            </div>
            
            {/* Quick Position Presets */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => onConfigChange('characterPosition', 'bottom-right')}
                variant="outline"
                className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-400/30 text-orange-300 hover:from-orange-500/30 hover:to-red-500/30"
              >
                🎮 Gaming Classic
              </Button>
              <Button
                onClick={() => onConfigChange('characterPosition', 'center-right')}
                variant="outline"
                className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/30 text-purple-300 hover:from-purple-500/30 hover:to-pink-500/30"
              >
                ⚡ Dynamic Pro
              </Button>
            </div>
          </div>

          {/* Enhanced Character Size Control */}
          <div className="space-y-4">
            <Label className="text-white mb-3 block font-medium flex items-center">
              <Maximize2 className="w-5 h-5 mr-2 text-cyan-400" />
              <span className="text-lg">Character Size</span>
              <div className="ml-auto flex items-center space-x-2">
                <span className="text-cyan-400 font-bold">{config.overlayImageSize || 25}%</span>
                <div className={`w-3 h-3 rounded-full ${
                  (config.overlayImageSize || 25) >= 80 ? 'bg-red-400' :
                  (config.overlayImageSize || 25) >= 60 ? 'bg-yellow-400' :
                  (config.overlayImageSize || 25) >= 40 ? 'bg-green-400' : 'bg-blue-400'
                }`} />
              </div>
            </Label>
            
            {/* Size Slider with Real-time Preview */}
            <div className="space-y-3">
              <Slider
                value={[config.overlayImageSize || 25]}
                onValueChange={(value) => onConfigChange('overlayImageSize', value[0])}
                max={100}
                min={15}
                step={1}
                className="w-full"
              />
              
              {/* Visual Size Indicator */}
              <div className="flex justify-center">
                <div 
                  className="bg-cyan-400/20 border-2 border-cyan-400 rounded-lg transition-all duration-300"
                  style={{
                    width: `${Math.max(20, (config.overlayImageSize || 25) * 0.6)}px`,
                    height: `${Math.max(15, (config.overlayImageSize || 25) * 0.4)}px`
                  }}
                />
              </div>
            </div>
            
            {/* Quick Size Presets */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { size: 25, label: 'Small', icon: '📱' },
                { size: 50, label: 'Medium', icon: '💻' },
                { size: 75, label: 'Large', icon: '🖥️' },
                { size: 95, label: 'Huge', icon: '📺' }
              ].map((preset) => (
                <Button
                  key={preset.size}
                  onClick={() => onConfigChange('overlayImageSize', preset.size)}
                  variant="outline"
                  className={`text-xs p-2 transition-all duration-300 ${
                    (config.overlayImageSize || 25) === preset.size 
                      ? 'bg-cyan-400/20 border-cyan-400 text-cyan-400' 
                      : 'bg-white/5 border-white/20 text-white/70 hover:bg-cyan-400/10 hover:border-cyan-400/50'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg">{preset.icon}</div>
                    <div className="text-[10px]">{preset.label}</div>
                    <div className="text-[9px] opacity-70">{preset.size}%</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
          
          {/* Real-time Position Preview */}
          <div className="bg-black/20 p-4 rounded-lg border border-white/10">
            <Label className="text-white text-sm font-medium mb-3 block">Live Preview</Label>
            <div className="relative w-full h-20 bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg border border-white/20 overflow-hidden">
              {/* Preview Background */}
              <div className="absolute inset-0 opacity-30">
                <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20" />
              </div>
              
              {/* Preview Character Position */}
              <div className={`
                absolute w-3 h-3 bg-cyan-400 rounded-full border-2 border-white transition-all duration-300
                ${config.characterPosition === 'top-left' ? 'top-1 left-1' :
                  config.characterPosition === 'top-center' ? 'top-1 left-1/2 -translate-x-1/2' :
                  config.characterPosition === 'top-right' ? 'top-1 right-1' :
                  config.characterPosition === 'center-left' ? 'top-1/2 left-1 -translate-y-1/2' :
                  config.characterPosition === 'full-center' ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' :
                  config.characterPosition === 'center-right' ? 'top-1/2 right-1 -translate-y-1/2' :
                  config.characterPosition === 'bottom-left' ? 'bottom-1 left-1' :
                  config.characterPosition === 'bottom-center' ? 'bottom-1 left-1/2 -translate-x-1/2' :
                  'bottom-1 right-1'
                }
              `}>
                <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping opacity-50" />
              </div>
              
              {/* Preview Text Area */}
              <div className="absolute inset-2 flex items-center justify-center">
                <div className="text-white/60 text-xs text-center">
                  <div className="font-bold">MAIN TEXT</div>
                  <div className="text-[10px] opacity-70">Sub Text</div>
                </div>
              </div>
              
              {/* Position Label */}
              <div className="absolute bottom-0 right-0 bg-black/60 text-white text-[10px] px-2 py-1 rounded-tl">
                {(config.characterPosition || 'bottom-right').replace('-', ' ').toUpperCase()}
              </div>
            </div>
            
            <p className="text-xs text-white/60 mt-2 text-center">
              🎯 <strong>AI Tip:</strong> Use AI Character Position for optimal placement!
            </p>
          </div>

          {/* Advanced Positioning Controls */}
          <div className="bg-black/20 p-4 rounded-lg border border-white/10">
            <Label className="text-white text-sm font-medium mb-3 block flex items-center">
              <RotateCcw className="w-4 h-4 mr-2 text-cyan-400" />
              Fine Adjustments
            </Label>
            
            <div className="grid grid-cols-2 gap-3">
              {/* Horizontal Offset */}
              <div className="space-y-2">
                <Label className="text-white/80 text-xs">Horizontal Shift</Label>
                <Slider
                  value={[config.characterHorizontalOffset || 0]}
                  onValueChange={(value) => onConfigChange('characterHorizontalOffset', value[0])}
                  max={50}
                  min={-50}
                  step={1}
                  className="w-full"
                />
                <div className="text-xs text-white/60 text-center">
                  {(config.characterHorizontalOffset || 0) > 0 ? '+' : ''}{config.characterHorizontalOffset || 0}px
                </div>
              </div>
              
              {/* Vertical Offset */}
              <div className="space-y-2">
                <Label className="text-white/80 text-xs">Vertical Shift</Label>
                <Slider
                  value={[config.characterVerticalOffset || 0]}
                  onValueChange={(value) => onConfigChange('characterVerticalOffset', value[0])}
                  max={50}
                  min={-50}
                  step={1}
                  className="w-full"
                />
                <div className="text-xs text-white/60 text-center">
                  {(config.characterVerticalOffset || 0) > 0 ? '+' : ''}{config.characterVerticalOffset || 0}px
                </div>
              </div>
            </div>
            
            {/* Reset Button */}
            <Button
              onClick={() => {
                onConfigChange('characterHorizontalOffset', 0);
                onConfigChange('characterVerticalOffset', 0);
              }}
              variant="outline"
              className="w-full mt-3 bg-white/5 border-white/20 text-white/70 hover:bg-white/10 text-xs"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset Position
            </Button>
          </div>

          {/* Export Preview Feature */}
          <div className="bg-black/20 p-4 rounded-lg border border-white/10">
            <Label className="text-white text-sm font-medium mb-3 block flex items-center">
              <Type className="w-4 h-4 mr-2 text-cyan-400" />
              Export Preview
            </Label>
            
            <div className="space-y-3">
              <div className="text-xs text-white/70 space-y-1">
                <div className="flex justify-between">
                  <span>Resolution:</span>
                  <span className="text-cyan-400 font-mono">1280x720</span>
                </div>
                <div className="flex justify-between">
                  <span>Character Size:</span>
                  <span className="text-cyan-400 font-mono">{config.overlayImageSize || 25}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Position:</span>
                  <span className="text-cyan-400 font-mono">
                    {(config.characterPosition || 'bottom-right').replace('-', ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Quality:</span>
                  <span className="text-green-400 font-mono">YouTube HD</span>
                </div>
              </div>
              
              <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (config.overlayImageSize || 25) + 20)}%` }}
                />
              </div>
              
              <p className="text-xs text-green-400/80 text-center">
                ✓ Ready for export - All settings optimized
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Layout Controls */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-white mb-2 block font-medium">Font Size</Label>
          <Select value={config.fontSize} onValueChange={(value) => onConfigChange('fontSize', value)}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/20">
              <SelectItem value="small" className="text-white">Small</SelectItem>
              <SelectItem value="medium" className="text-white">Medium</SelectItem>
              <SelectItem value="large" className="text-white">Large</SelectItem>
              <SelectItem value="xlarge" className="text-white">Extra Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-white mb-2 block font-medium">Text Position</Label>
          <Select value={config.textPosition} onValueChange={(value) => onConfigChange('textPosition', value)}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/20">
              <SelectItem value="top" className="text-white">Top</SelectItem>
              <SelectItem value="center" className="text-white">Center</SelectItem>
              <SelectItem value="bottom" className="text-white">Bottom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Letter Spacing */}
      <div className="space-y-3">
        <Label className="text-white mb-2 block font-medium">Letter Spacing</Label>
        <Select value={config.letterSpacing || 'normal'} onValueChange={(value) => onConfigChange('letterSpacing', value)}>
          <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-white/20">
            <SelectItem value="tight" className="text-white">Tight</SelectItem>
            <SelectItem value="normal" className="text-white">Normal</SelectItem>
            <SelectItem value="wide" className="text-white">Wide</SelectItem>
            <SelectItem value="wider" className="text-white">Wider</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Line Height */}
      <div className="space-y-3">
        <Label className="text-white mb-2 block font-medium">Line Height</Label>
        <Select value={config.lineHeight || 'normal'} onValueChange={(value) => onConfigChange('lineHeight', value)}>
          <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-white/20">
            <SelectItem value="tight" className="text-white">Tight</SelectItem>
            <SelectItem value="normal" className="text-white">Normal</SelectItem>
            <SelectItem value="relaxed" className="text-white">Relaxed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Text Rotation */}
      <div className="space-y-3">
        <Label className="text-white mb-2 block font-medium flex items-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          Text Rotation: {config.textRotation || 0}°
        </Label>
        <Slider
          value={[config.textRotation || 0]}
          onValueChange={(value) => onConfigChange('textRotation', value[0])}
          max={15}
          min={-15}
          step={1}
          className="w-full"
        />
      </div>

      {/* Text Opacity */}
      <div className="space-y-3">
        <Label className="text-white mb-2 block font-medium">
          Text Opacity: {config.textOpacity || 100}%
        </Label>
        <Slider
          value={[config.textOpacity || 100]}
          onValueChange={(value) => onConfigChange('textOpacity', value[0])}
          max={100}
          min={30}
          step={5}
          className="w-full"
        />
      </div>

      {/* Text Background */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="textBackground" className="text-white font-medium">Text Background</Label>
          <Switch
            id="textBackground"
            checked={config.textBackground || false}
            onCheckedChange={(checked) => onConfigChange('textBackground', checked)}
          />
        </div>
        
        {config.textBackground && (
          <>
            <div>
              <Label className="text-white mb-2 block font-medium">Background Color</Label>
              <Input
                type="color"
                value={config.textBackgroundColor || '#000000'}
                onChange={(e) => onConfigChange('textBackgroundColor', e.target.value)}
                className="w-full h-10 bg-white/10 border-white/20 rounded-lg"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-white mb-2 block font-medium">
                Background Opacity: {config.textBackgroundOpacity || 50}%
              </Label>
              <Slider
                value={[config.textBackgroundOpacity || 50]}
                onValueChange={(value) => onConfigChange('textBackgroundOpacity', value[0])}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
            </div>
          </>
        )}
      </div>

      {/* Accent Color */}
      <div>
        <Label className="text-white mb-3 block font-medium flex items-center">
          <Palette className="w-4 h-4 mr-2" />
          Accent Color
        </Label>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {colorPresets.map((color) => (
            <button
              key={color.value}
              onClick={() => onConfigChange('accentColor', color.value)}
              className={`p-2 rounded-lg border-2 transition-all text-xs font-medium ${
                config.accentColor === color.value 
                  ? 'border-white scale-105 shadow-lg' 
                  : 'border-white/20 hover:border-white/40 hover:scale-102'
              }`}
              style={{ backgroundColor: color.value }}
            >
              <span className="text-white drop-shadow-lg">{color.name}</span>
            </button>
          ))}
        </div>
        <Input
          type="color"
          value={config.accentColor}
          onChange={(e) => onConfigChange('accentColor', e.target.value)}
          className="w-full h-10 bg-white/10 border-white/20 rounded-lg"
        />
      </div>

      {/* Effects Toggles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="particles" className="text-white font-medium">Particle Effects</Label>
          <Switch
            id="particles"
            checked={config.showParticles}
            onCheckedChange={(checked) => onConfigChange('showParticles', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="glow" className="text-white font-medium">Glow Effects</Label>
          <Switch
            id="glow"
            checked={config.glowEffect}
            onCheckedChange={(checked) => onConfigChange('glowEffect', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="textShadow" className="text-white font-medium">Text Shadow</Label>
          <Switch
            id="textShadow"
            checked={config.textShadow}
            onCheckedChange={(checked) => onConfigChange('textShadow', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="borderGlow" className="text-white font-medium">Border Glow</Label>
          <Switch
            id="borderGlow"
            checked={config.borderGlow}
            onCheckedChange={(checked) => onConfigChange('borderGlow', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="textOutline" className="text-white font-medium">Text Outline</Label>
          <Switch
            id="textOutline"
            checked={config.textOutline || false}
            onCheckedChange={(checked) => onConfigChange('textOutline', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="animatedText" className="text-white font-medium">Animated Text</Label>
          <Switch
            id="animatedText"
            checked={config.animatedText || false}
            onCheckedChange={(checked) => onConfigChange('animatedText', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="gradientText" className="text-white font-medium">Gradient Text</Label>
          <Switch
            id="gradientText"
            checked={config.gradientText || false}
            onCheckedChange={(checked) => onConfigChange('gradientText', checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
