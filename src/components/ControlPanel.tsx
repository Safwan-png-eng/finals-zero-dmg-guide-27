
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { useRef } from 'react';

interface ControlPanelProps {
  config: any;
  onConfigChange: (key: string, value: any) => void;
}

const ControlPanel = ({ config, onConfigChange }: ControlPanelProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const colorPresets = [
    { name: 'Electric Blue', value: '#00d4ff' },
    { name: 'Neon Green', value: '#00ff88' },
    { name: 'Hot Pink', value: '#ff0080' },
    { name: 'Fire Orange', value: '#ff4500' },
    { name: 'Cyber Purple', value: '#8b5cf6' },
    { name: 'Gold Rush', value: '#ffd700' }
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

  const removeBackgroundImage = () => {
    onConfigChange('backgroundImage', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6 max-h-[70vh] lg:max-h-none overflow-y-auto">
      {/* Image Upload Section */}
      <div>
        <Label className="text-white mb-3 block">Background Image</Label>
        <div className="space-y-3">
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
            className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Image
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
                className="absolute top-1 right-1 h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Text Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="mainText" className="text-white mb-2 block">Main Text</Label>
          <Input
            id="mainText"
            value={config.mainText}
            onChange={(e) => onConfigChange('mainText', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder-white/50"
            placeholder="Enter main text..."
          />
        </div>
        
        <div>
          <Label htmlFor="subText" className="text-white mb-2 block">Sub Text</Label>
          <Input
            id="subText"
            value={config.subText}
            onChange={(e) => onConfigChange('subText', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder-white/50"
            placeholder="Enter sub text..."
          />
        </div>
      </div>

      {/* Font Size */}
      <div>
        <Label className="text-white mb-2 block">Font Size</Label>
        <Select value={config.fontSize} onValueChange={(value) => onConfigChange('fontSize', value)}>
          <SelectTrigger className="bg-white/10 border-white/20 text-white">
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

      {/* Text Position */}
      <div>
        <Label className="text-white mb-2 block">Text Position</Label>
        <Select value={config.textPosition} onValueChange={(value) => onConfigChange('textPosition', value)}>
          <SelectTrigger className="bg-white/10 border-white/20 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-white/20">
            <SelectItem value="top" className="text-white">Top</SelectItem>
            <SelectItem value="center" className="text-white">Center</SelectItem>
            <SelectItem value="bottom" className="text-white">Bottom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Accent Color */}
      <div>
        <Label className="text-white mb-3 block">Accent Color</Label>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {colorPresets.map((color) => (
            <button
              key={color.value}
              onClick={() => onConfigChange('accentColor', color.value)}
              className={`p-2 rounded-lg border-2 transition-all text-xs ${
                config.accentColor === color.value 
                  ? 'border-white scale-105' 
                  : 'border-white/20 hover:border-white/40'
              }`}
              style={{ backgroundColor: color.value }}
            >
              <span className="text-white font-medium">{color.name}</span>
            </button>
          ))}
        </div>
        <Input
          type="color"
          value={config.accentColor}
          onChange={(e) => onConfigChange('accentColor', e.target.value)}
          className="w-full h-10 bg-white/10 border-white/20"
        />
      </div>

      {/* Effects Toggles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="particles" className="text-white">Particle Effects</Label>
          <Switch
            id="particles"
            checked={config.showParticles}
            onCheckedChange={(checked) => onConfigChange('showParticles', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="glow" className="text-white">Glow Effects</Label>
          <Switch
            id="glow"
            checked={config.glowEffect}
            onCheckedChange={(checked) => onConfigChange('glowEffect', checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
