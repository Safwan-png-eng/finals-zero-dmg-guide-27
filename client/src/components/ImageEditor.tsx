import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface ImageFilters {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  blur: number;
  sepia: number;
  grayscale: number;
  invert: number;
  opacity: number;
}

interface CropSettings {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageEditorProps {
  imageSrc: string | null;
  onImageUpdate: (processedImage: string) => void;
  onFiltersChange: (filters: ImageFilters) => void;
}

export const ImageEditor = ({ imageSrc, onImageUpdate, onFiltersChange }: ImageEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [filters, setFilters] = useState<ImageFilters>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    blur: 0,
    sepia: 0,
    grayscale: 0,
    invert: 0,
    opacity: 100
  });

  const [cropSettings, setCropSettings] = useState<CropSettings>({
    x: 0,
    y: 0,
    width: 100,
    height: 100
  });

  const [selectedEffect, setSelectedEffect] = useState<string>('none');
  const [isProcessing, setIsProcessing] = useState(false);

  // Predefined filter presets
  const filterPresets = {
    none: { brightness: 100, contrast: 100, saturation: 100, hue: 0, blur: 0, sepia: 0, grayscale: 0, invert: 0, opacity: 100 },
    vintage: { brightness: 110, contrast: 120, saturation: 80, hue: 10, blur: 0, sepia: 30, grayscale: 0, invert: 0, opacity: 100 },
    dramatic: { brightness: 90, contrast: 150, saturation: 130, hue: 0, blur: 0, sepia: 0, grayscale: 0, invert: 0, opacity: 100 },
    cool: { brightness: 105, contrast: 110, saturation: 120, hue: 200, blur: 0, sepia: 0, grayscale: 0, invert: 0, opacity: 100 },
    warm: { brightness: 115, contrast: 105, saturation: 110, hue: 30, blur: 0, sepia: 20, grayscale: 0, invert: 0, opacity: 100 },
    blackwhite: { brightness: 100, contrast: 120, saturation: 0, hue: 0, blur: 0, sepia: 0, grayscale: 100, invert: 0, opacity: 100 },
    cyberpunk: { brightness: 120, contrast: 140, saturation: 150, hue: 280, blur: 0, sepia: 0, grayscale: 0, invert: 0, opacity: 100 }
  };

  const applyFilters = async () => {
    if (!imageSrc || !canvasRef.current) return;

    setIsProcessing(true);
    
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageSrc;
      });

      canvas.width = img.width;
      canvas.height = img.height;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply filters using CSS filter string
      const filterString = `
        brightness(${filters.brightness}%) 
        contrast(${filters.contrast}%) 
        saturate(${filters.saturation}%) 
        hue-rotate(${filters.hue}deg) 
        blur(${filters.blur}px) 
        sepia(${filters.sepia}%) 
        grayscale(${filters.grayscale}%) 
        invert(${filters.invert}%) 
        opacity(${filters.opacity}%)
      `;

      ctx.filter = filterString;
      ctx.drawImage(img, 0, 0);

      // Get processed image data
      const processedImage = canvas.toDataURL('image/png');
      onImageUpdate(processedImage);
      onFiltersChange(filters);

    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFilterChange = (filterName: keyof ImageFilters, value: number) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
  };

  const applyPreset = (presetName: string) => {
    const preset = filterPresets[presetName as keyof typeof filterPresets];
    if (preset) {
      setFilters(preset);
      setSelectedEffect(presetName);
    }
  };

  const resetFilters = () => {
    setFilters(filterPresets.none);
    setSelectedEffect('none');
  };

  const applyCrop = () => {
    if (!imageSrc || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const cropX = (cropSettings.x / 100) * img.width;
      const cropY = (cropSettings.y / 100) * img.height;
      const cropWidth = (cropSettings.width / 100) * img.width;
      const cropHeight = (cropSettings.height / 100) * img.height;

      canvas.width = cropWidth;
      canvas.height = cropHeight;

      ctx.drawImage(
        img,
        cropX, cropY, cropWidth, cropHeight,
        0, 0, cropWidth, cropHeight
      );

      const croppedImage = canvas.toDataURL('image/png');
      onImageUpdate(croppedImage);
    };

    img.src = imageSrc;
  };

  // Apply filters when they change
  useEffect(() => {
    if (imageSrc) {
      applyFilters();
    }
  }, [filters, imageSrc]);

  if (!imageSrc) {
    return (
      <Card className="bg-black/40 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Image Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-white/60 py-8">
            Upload an image to start editing
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/40 border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          Image Editor
          {isProcessing && (
            <Badge variant="secondary" className="animate-pulse">
              Processing...
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="filters" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10">
            <TabsTrigger value="filters" className="text-white">Filters</TabsTrigger>
            <TabsTrigger value="presets" className="text-white">Presets</TabsTrigger>
            <TabsTrigger value="crop" className="text-white">Crop</TabsTrigger>
          </TabsList>

          <TabsContent value="filters" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
              {/* Brightness */}
              <div className="space-y-2">
                <Label className="text-white text-sm">Brightness: {filters.brightness}%</Label>
                <Slider
                  value={[filters.brightness]}
                  onValueChange={([value]) => handleFilterChange('brightness', value)}
                  min={0}
                  max={200}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Contrast */}
              <div className="space-y-2">
                <Label className="text-white text-sm">Contrast: {filters.contrast}%</Label>
                <Slider
                  value={[filters.contrast]}
                  onValueChange={([value]) => handleFilterChange('contrast', value)}
                  min={0}
                  max={200}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Saturation */}
              <div className="space-y-2">
                <Label className="text-white text-sm">Saturation: {filters.saturation}%</Label>
                <Slider
                  value={[filters.saturation]}
                  onValueChange={([value]) => handleFilterChange('saturation', value)}
                  min={0}
                  max={200}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Hue */}
              <div className="space-y-2">
                <Label className="text-white text-sm">Hue: {filters.hue}°</Label>
                <Slider
                  value={[filters.hue]}
                  onValueChange={([value]) => handleFilterChange('hue', value)}
                  min={-180}
                  max={180}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Blur */}
              <div className="space-y-2">
                <Label className="text-white text-sm">Blur: {filters.blur}px</Label>
                <Slider
                  value={[filters.blur]}
                  onValueChange={([value]) => handleFilterChange('blur', value)}
                  min={0}
                  max={10}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Sepia */}
              <div className="space-y-2">
                <Label className="text-white text-sm">Sepia: {filters.sepia}%</Label>
                <Slider
                  value={[filters.sepia]}
                  onValueChange={([value]) => handleFilterChange('sepia', value)}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Grayscale */}
              <div className="space-y-2">
                <Label className="text-white text-sm">Grayscale: {filters.grayscale}%</Label>
                <Slider
                  value={[filters.grayscale]}
                  onValueChange={([value]) => handleFilterChange('grayscale', value)}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={resetFilters} 
                variant="outline" 
                size="sm"
                className="text-white border-white/20 hover:bg-white/10"
              >
                Reset
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="presets" className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(filterPresets).map((presetName) => (
                <Button
                  key={presetName}
                  onClick={() => applyPreset(presetName)}
                  variant={selectedEffect === presetName ? "default" : "outline"}
                  size="sm"
                  className={`capitalize ${
                    selectedEffect === presetName 
                      ? 'bg-blue-600 text-white' 
                      : 'text-white border-white/20 hover:bg-white/10'
                  }`}
                >
                  {presetName.replace(/([A-Z])/g, ' $1').trim()}
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="crop" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white text-sm">X Position: {cropSettings.x}%</Label>
                <Slider
                  value={[cropSettings.x]}
                  onValueChange={([value]) => setCropSettings(prev => ({ ...prev, x: value }))}
                  min={0}
                  max={50}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white text-sm">Y Position: {cropSettings.y}%</Label>
                <Slider
                  value={[cropSettings.y]}
                  onValueChange={([value]) => setCropSettings(prev => ({ ...prev, y: value }))}
                  min={0}
                  max={50}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white text-sm">Width: {cropSettings.width}%</Label>
                <Slider
                  value={[cropSettings.width]}
                  onValueChange={([value]) => setCropSettings(prev => ({ ...prev, width: value }))}
                  min={50}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white text-sm">Height: {cropSettings.height}%</Label>
                <Slider
                  value={[cropSettings.height]}
                  onValueChange={([value]) => setCropSettings(prev => ({ ...prev, height: value }))}
                  min={50}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            <Button 
              onClick={applyCrop} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Apply Crop
            </Button>
          </TabsContent>
        </Tabs>

        {/* Hidden canvas for processing */}
        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  );
};