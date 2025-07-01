import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';

interface ColorPickerProps {
  color: string;
  onColorChange: (color: string) => void;
  label: string;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

export const AdvancedColorPicker = ({ color, onColorChange, label }: ColorPickerProps) => {
  const [currentColor, setCurrentColor] = useState(color);
  const [hsl, setHsl] = useState<HSL>({ h: 0, s: 50, l: 50 });
  const [rgb, setRgb] = useState<RGB>({ r: 255, g: 255, b: 255 });
  const [hexInput, setHexInput] = useState(color);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [recentColors, setRecentColors] = useState<string[]>([]);

  // Color palette presets
  const colorPalettes = {
    gaming: [
      '#ff0080', '#00ff80', '#0080ff', '#ff4500', '#ffff00', '#ff6600',
      '#8000ff', '#ff0040', '#00ffff', '#ff8000', '#40ff00', '#0040ff'
    ],
    neon: [
      '#ff00ff', '#00ffff', '#ffff00', '#ff0000', '#00ff00', '#0000ff',
      '#ff8080', '#80ff80', '#8080ff', '#ffff80', '#ff80ff', '#80ffff'
    ],
    dark: [
      '#1a1a1a', '#2d2d2d', '#404040', '#595959', '#737373', '#8c8c8c',
      '#a6a6a6', '#bfbfbf', '#d9d9d9', '#f2f2f2', '#ffffff', '#000000'
    ],
    warm: [
      '#ff6b35', '#f7931e', '#ffd23f', '#ff4757', '#ff6b9d', '#ff9ff3',
      '#f368e0', '#bf9000', '#ffa502', '#ff6348', '#ff4757', '#ff3742'
    ],
    cool: [
      '#00d2d3', '#0abde3', '#006ba6', '#0c2461', '#40407a', '#706fd3',
      '#f0932b', '#eb4d4b', '#6c5ce7', '#a29bfe', '#fd79a8', '#fdcb6e'
    ]
  };

  // Gaming-specific color schemes
  const gamingSchemes = [
    { name: 'Cyber Warrior', primary: '#00ff80', secondary: '#ff0080', accent: '#ffff00' },
    { name: 'Fire Storm', primary: '#ff4500', secondary: '#ff6600', accent: '#ffff00' },
    { name: 'Ice Cold', primary: '#00d4ff', secondary: '#0080ff', accent: '#ffffff' },
    { name: 'Toxic Green', primary: '#32cd32', secondary: '#00ff00', accent: '#ffff00' },
    { name: 'Royal Purple', primary: '#8000ff', secondary: '#ff00ff', accent: '#ffffff' },
    { name: 'Blood Red', primary: '#dc143c', secondary: '#ff0000', accent: '#ffff00' }
  ];

  useEffect(() => {
    loadRecentColors();
    updateColorValues(currentColor);
  }, []);

  useEffect(() => {
    setCurrentColor(color);
    setHexInput(color);
    updateColorValues(color);
  }, [color]);

  const loadRecentColors = () => {
    try {
      const saved = localStorage.getItem('recent-colors');
      if (saved) {
        setRecentColors(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading recent colors:', error);
    }
  };

  const saveRecentColor = (newColor: string) => {
    const updated = [newColor, ...recentColors.filter(c => c !== newColor)].slice(0, 12);
    setRecentColors(updated);
    try {
      localStorage.setItem('recent-colors', JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving recent colors:', error);
    }
  };

  const hexToRgb = (hex: string): RGB => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const rgbToHsl = (r: number, g: number, b: number): HSL => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    const sum = max + min;
    const l = sum / 2;
    
    let h = 0;
    let s = 0;
    
    if (diff !== 0) {
      s = l > 0.5 ? diff / (2 - sum) : diff / sum;
      
      switch (max) {
        case r:
          h = ((g - b) / diff) + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / diff + 2;
          break;
        case b:
          h = (r - g) / diff + 4;
          break;
      }
      h /= 6;
    }
    
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const hslToRgb = (h: number, s: number, l: number): RGB => {
    h /= 360;
    s /= 100;
    l /= 100;
    
    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  const updateColorValues = (hexColor: string) => {
    const rgbColor = hexToRgb(hexColor);
    const hslColor = rgbToHsl(rgbColor.r, rgbColor.g, rgbColor.b);
    
    setRgb(rgbColor);
    setHsl(hslColor);
  };

  const updateFromHsl = (newHsl: HSL) => {
    setHsl(newHsl);
    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    setRgb(newRgb);
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setCurrentColor(newHex);
    setHexInput(newHex);
    onColorChange(newHex);
  };

  const updateFromRgb = (newRgb: RGB) => {
    setRgb(newRgb);
    const newHsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b);
    setHsl(newHsl);
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setCurrentColor(newHex);
    setHexInput(newHex);
    onColorChange(newHex);
  };

  const handleColorSelect = (selectedColor: string) => {
    setCurrentColor(selectedColor);
    setHexInput(selectedColor);
    updateColorValues(selectedColor);
    onColorChange(selectedColor);
    saveRecentColor(selectedColor);
  };

  const handleHexInput = (hex: string) => {
    setHexInput(hex);
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      handleColorSelect(hex);
    }
  };

  const generateRandomColor = () => {
    const randomHex = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    handleColorSelect(randomHex);
  };

  const getComplementaryColor = () => {
    const complementaryHue = (hsl.h + 180) % 360;
    const complementaryHsl = { ...hsl, h: complementaryHue };
    const complementaryRgb = hslToRgb(complementaryHsl.h, complementaryHsl.s, complementaryHsl.l);
    const complementaryHex = rgbToHex(complementaryRgb.r, complementaryRgb.g, complementaryRgb.b);
    handleColorSelect(complementaryHex);
  };

  const ColorPreview = ({ color, size = 'w-8 h-8' }: { color: string; size?: string }) => (
    <div 
      className={`${size} rounded border-2 border-white/20 cursor-pointer transition-all hover:scale-110`}
      style={{ backgroundColor: color }}
      onClick={() => handleColorSelect(color)}
    />
  );

  return (
    <Card className="bg-black/40 border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          {label}
          <div className="flex items-center gap-2">
            <ColorPreview color={currentColor} size="w-10 h-10" />
            <span className="text-sm text-white/60">{currentColor}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="palettes" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/10">
            <TabsTrigger value="palettes" className="text-white text-xs">Palettes</TabsTrigger>
            <TabsTrigger value="hsl" className="text-white text-xs">HSL</TabsTrigger>
            <TabsTrigger value="rgb" className="text-white text-xs">RGB</TabsTrigger>
            <TabsTrigger value="schemes" className="text-white text-xs">Schemes</TabsTrigger>
          </TabsList>

          <TabsContent value="palettes" className="space-y-4">
            {/* Hex Input */}
            <div className="space-y-2">
              <Label className="text-white text-sm">Hex Color</Label>
              <div className="flex gap-2">
                <Input
                  value={hexInput}
                  onChange={(e) => handleHexInput(e.target.value)}
                  placeholder="#ffffff"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
                <Button
                  onClick={generateRandomColor}
                  variant="outline"
                  size="sm"
                  className="text-white border-white/20 hover:bg-white/10"
                >
                  Random
                </Button>
              </div>
            </div>

            {/* Color Palettes */}
            {Object.entries(colorPalettes).map(([paletteName, colors]) => (
              <div key={paletteName} className="space-y-2">
                <Label className="text-white text-sm capitalize">{paletteName} Palette</Label>
                <div className="grid grid-cols-6 gap-2">
                  {colors.map((paletteColor, index) => (
                    <ColorPreview key={index} color={paletteColor} />
                  ))}
                </div>
              </div>
            ))}

            {/* Recent Colors */}
            {recentColors.length > 0 && (
              <div className="space-y-2">
                <Label className="text-white text-sm">Recent Colors</Label>
                <div className="grid grid-cols-6 gap-2">
                  {recentColors.map((recentColor, index) => (
                    <ColorPreview key={index} color={recentColor} />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="hsl" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white text-sm">Hue: {hsl.h}°</Label>
                <Slider
                  value={[hsl.h]}
                  onValueChange={([value]) => updateFromHsl({ ...hsl, h: value })}
                  min={0}
                  max={360}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white text-sm">Saturation: {hsl.s}%</Label>
                <Slider
                  value={[hsl.s]}
                  onValueChange={([value]) => updateFromHsl({ ...hsl, s: value })}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white text-sm">Lightness: {hsl.l}%</Label>
                <Slider
                  value={[hsl.l]}
                  onValueChange={([value]) => updateFromHsl({ ...hsl, l: value })}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              <Button
                onClick={getComplementaryColor}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Use Complementary Color
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="rgb" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white text-sm">Red: {rgb.r}</Label>
                <Slider
                  value={[rgb.r]}
                  onValueChange={([value]) => updateFromRgb({ ...rgb, r: value })}
                  min={0}
                  max={255}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white text-sm">Green: {rgb.g}</Label>
                <Slider
                  value={[rgb.g]}
                  onValueChange={([value]) => updateFromRgb({ ...rgb, g: value })}
                  min={0}
                  max={255}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white text-sm">Blue: {rgb.b}</Label>
                <Slider
                  value={[rgb.b]}
                  onValueChange={([value]) => updateFromRgb({ ...rgb, b: value })}
                  min={0}
                  max={255}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schemes" className="space-y-4">
            <div className="space-y-3">
              {gamingSchemes.map((scheme, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-white text-sm font-medium">{scheme.name}</Label>
                    <div className="flex gap-1">
                      <ColorPreview color={scheme.primary} size="w-6 h-6" />
                      <ColorPreview color={scheme.secondary} size="w-6 h-6" />
                      <ColorPreview color={scheme.accent} size="w-6 h-6" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <Button
                      onClick={() => handleColorSelect(scheme.primary)}
                      variant="outline"
                      size="sm"
                      className="text-white border-white/20 hover:bg-white/10"
                    >
                      Primary
                    </Button>
                    <Button
                      onClick={() => handleColorSelect(scheme.secondary)}
                      variant="outline"
                      size="sm"
                      className="text-white border-white/20 hover:bg-white/10"
                    >
                      Secondary
                    </Button>
                    <Button
                      onClick={() => handleColorSelect(scheme.accent)}
                      variant="outline"
                      size="sm"
                      className="text-white border-white/20 hover:bg-white/10"
                    >
                      Accent
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};