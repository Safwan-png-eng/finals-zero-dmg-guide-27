
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Upload, X, Scissors, Sparkles } from 'lucide-react';
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onConfigChange('backgroundImage', result);
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
      };
      reader.readAsDataURL(file);
    }
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
          Upload Background
        </Button>
        
        {config.backgroundImage && (
          <div className="relative">
            <img 
              src={config.backgroundImage} 
              alt="Background preview" 
              className="w-full h-24 object-cover rounded-lg border border-white/20"
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

      {/* Overlay Image Section */}
      <div className="space-y-3">
        <Label className="text-white mb-3 block font-medium">Character/Overlay Image</Label>
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
              className="w-full h-24 object-cover rounded-lg border border-white/20"
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

      {/* Accent Color */}
      <div>
        <Label className="text-white mb-3 block font-medium">Accent Color</Label>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {colorPresets.map((color) => (
            <button
              key={color.value}
              onClick={() => onConfigChange('accentColor', color.value)}
              className={`p-3 rounded-lg border-2 transition-all text-xs font-medium ${
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
          className="w-full h-12 bg-white/10 border-white/20 rounded-lg"
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
      </div>
    </div>
  );
};

export default ControlPanel;
