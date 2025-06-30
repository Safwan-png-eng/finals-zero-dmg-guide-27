
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

interface ControlPanelProps {
  config: any;
  onConfigChange: (key: string, value: any) => void;
}

const ControlPanel = ({ config, onConfigChange }: ControlPanelProps) => {
  const colorPresets = [
    { name: 'Electric Blue', value: '#00d4ff' },
    { name: 'Neon Green', value: '#00ff88' },
    { name: 'Hot Pink', value: '#ff0080' },
    { name: 'Fire Orange', value: '#ff4500' },
    { name: 'Cyber Purple', value: '#8b5cf6' },
    { name: 'Gold Rush', value: '#ffd700' }
  ];

  return (
    <div className="space-y-6">
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
              className={`p-2 rounded-lg border-2 transition-all ${
                config.accentColor === color.value 
                  ? 'border-white scale-105' 
                  : 'border-white/20 hover:border-white/40'
              }`}
              style={{ backgroundColor: color.value }}
            >
              <span className="text-xs text-white font-medium">{color.name}</span>
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
