import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { exportToFormat } from '../utils/exportFormats';

interface AdvancedExportPanelProps {
  config: any;
  canvasData: string;
}

interface ExportFormat {
  id: string;
  name: string;
  description: string;
  icon: string;
  fileSize: string;
  features: string[];
  recommended: boolean;
  category: 'editable' | 'vector' | 'raster' | 'animation';
}

export const AdvancedExportPanel = ({ config, canvasData }: AdvancedExportPanelProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [currentExport, setCurrentExport] = useState<string>('');
  const { toast } = useToast();

  const exportFormats: ExportFormat[] = [
    {
      id: 'krita',
      name: 'Krita Project',
      description: 'Fully editable layered project for Krita digital painting software',
      icon: '🎨',
      fileSize: '2-5 MB',
      features: ['Separate layers', 'Text objects', 'Effects', 'Vector elements', 'Color profiles'],
      recommended: true,
      category: 'editable'
    },
    {
      id: 'powerpoint',
      name: 'PowerPoint',
      description: 'Editable presentation slide with text and image elements',
      icon: '📊',
      fileSize: '1-3 MB',
      features: ['Editable text', 'Moveable objects', 'Background layers', 'Professional format'],
      recommended: true,
      category: 'editable'
    },
    {
      id: 'svg',
      name: 'SVG Vector',
      description: 'Scalable vector graphics format for web and print',
      icon: '🔗',
      fileSize: '50-200 KB',
      features: ['Infinite scaling', 'Small file size', 'Web compatible', 'Editable code'],
      recommended: false,
      category: 'vector'
    },
    {
      id: 'psd',
      name: 'Photoshop Data',
      description: 'Layer information and metadata for Photoshop import',
      icon: '🖼️',
      fileSize: '500 KB - 1 MB',
      features: ['Layer structure', 'Blend modes', 'Effects data', 'Metadata'],
      recommended: false,
      category: 'editable'
    },
    {
      id: 'aftereffects',
      name: 'After Effects',
      description: 'Animation project with keyframes and effects',
      icon: '🎬',
      fileSize: '1-2 MB',
      features: ['Animation data', 'Keyframes', 'Effects', 'Composition setup'],
      recommended: false,
      category: 'animation'
    }
  ];

  const standardFormats = [
    {
      id: 'png-hd',
      name: 'PNG High Quality',
      description: 'High resolution PNG (1920x1080)',
      icon: '📷',
      fileSize: '2-4 MB'
    },
    {
      id: 'jpg-optimized',
      name: 'JPEG Optimized',
      description: 'Web-optimized JPEG (1280x720)',
      icon: '🖼️',
      fileSize: '200-500 KB'
    },
    {
      id: 'webp',
      name: 'WebP Modern',
      description: 'Next-gen web format with better compression',
      icon: '🌐',
      fileSize: '150-300 KB'
    }
  ];

  const handleExport = async (formatId: string) => {
    if (!canvasData) {
      toast({
        title: "No Content",
        description: "Please create a thumbnail first before exporting",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    setCurrentExport(formatId);
    setExportProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const { blob, filename } = await exportToFormat(
        formatId as any,
        config,
        canvasData
      );

      setExportProgress(100);
      clearInterval(progressInterval);

      // Download the file
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `${filename} has been downloaded successfully`,
      });

    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: `Failed to export ${formatId}. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
      setCurrentExport('');
      setExportProgress(0);
    }
  };

  const handleStandardExport = async (formatId: string) => {
    if (!canvasData) {
      toast({
        title: "No Content",
        description: "Please create a thumbnail first before exporting",
        variant: "destructive"
      });
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');

      const img = new Image();
      img.onload = () => {
        let width = 1280;
        let height = 720;
        
        if (formatId === 'png-hd') {
          width = 1920;
          height = 1080;
        }

        canvas.width = width;
        canvas.height = height;
        
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        let mimeType = 'image/png';
        let quality = 1.0;
        let extension = 'png';

        if (formatId === 'jpg-optimized') {
          mimeType = 'image/jpeg';
          quality = 0.85;
          extension = 'jpg';
        } else if (formatId === 'webp') {
          mimeType = 'image/webp';
          quality = 0.8;
          extension = 'webp';
        }

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `thumbnail-${new Date().toISOString().split('T')[0]}.${extension}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast({
              title: "Export Successful",
              description: `${formatId} exported successfully`,
            });
          }
        }, mimeType, quality);
      };

      img.src = canvasData;
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const FormatCard = ({ format }: { format: ExportFormat }) => (
    <Card className={`bg-black/40 border-white/20 hover:border-white/40 transition-all duration-200 ${format.recommended ? 'ring-2 ring-green-500/30' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{format.icon}</span>
            <div>
              <h4 className="text-white font-semibold flex items-center gap-2">
                {format.name}
                {format.recommended && (
                  <Badge className="bg-green-600 text-white text-xs">Recommended</Badge>
                )}
              </h4>
              <p className="text-white/60 text-sm">{format.description}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-xs">
            <span className="text-white/60">File Size:</span>
            <span className="text-white">{format.fileSize}</span>
          </div>

          <div className="space-y-1">
            <span className="text-white/60 text-xs">Features:</span>
            <div className="flex flex-wrap gap-1">
              {format.features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-xs px-1 py-0">
                  {feature}
                </Badge>
              ))}
              {format.features.length > 3 && (
                <Badge variant="outline" className="text-xs px-1 py-0 text-white/60">
                  +{format.features.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          <Button
            onClick={() => handleExport(format.id)}
            disabled={isExporting && currentExport !== format.id}
            className={`w-full ${format.recommended ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
          >
            {isExporting && currentExport === format.id ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                Exporting...
              </div>
            ) : (
              `Export ${format.name}`
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const StandardFormatCard = ({ format }: { format: any }) => (
    <Card className="bg-black/40 border-white/20 hover:border-white/40 transition-all duration-200">
      <CardContent className="p-3">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xl">{format.icon}</span>
          <div className="flex-1">
            <h4 className="text-white font-medium text-sm">{format.name}</h4>
            <p className="text-white/60 text-xs">{format.description}</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-xs mb-3">
          <span className="text-white/60">Size: {format.fileSize}</span>
        </div>

        <Button
          onClick={() => handleStandardExport(format.id)}
          size="sm"
          className="w-full bg-gray-600 hover:bg-gray-700 text-white text-xs"
        >
          Export {format.name}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <Card className="bg-black/40 border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Advanced Export System</CardTitle>
        <p className="text-white/60 text-sm">
          Export your thumbnail in professional formats for editing and use across different platforms
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="editable" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10">
            <TabsTrigger value="editable" className="text-white text-xs">Editable Formats</TabsTrigger>
            <TabsTrigger value="standard" className="text-white text-xs">Standard Formats</TabsTrigger>
            <TabsTrigger value="bulk" className="text-white text-xs">Bulk Export</TabsTrigger>
          </TabsList>

          <TabsContent value="editable" className="space-y-4">
            {/* Progress indicator */}
            {isExporting && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Exporting {currentExport}...</span>
                  <span className="text-white">{exportProgress}%</span>
                </div>
                <Progress value={exportProgress} className="w-full" />
              </div>
            )}

            {/* Category filters */}
            <div className="flex flex-wrap gap-2 mb-4">
              {['all', 'editable', 'vector', 'animation'].map(category => (
                <Badge 
                  key={category} 
                  variant="outline" 
                  className="text-xs cursor-pointer hover:bg-white/10 text-white border-white/20"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Badge>
              ))}
            </div>

            {/* Export formats grid */}
            <div className="grid grid-cols-1 gap-4">
              {exportFormats.map(format => (
                <FormatCard key={format.id} format={format} />
              ))}
            </div>

            <div className="bg-blue-900/20 rounded-lg p-4 space-y-2">
              <h4 className="text-white font-medium flex items-center gap-2">
                💡 Pro Tips
              </h4>
              <ul className="text-white/70 text-sm space-y-1">
                <li>• <strong>Krita</strong> - Best for detailed character editing and artistic refinement</li>
                <li>• <strong>PowerPoint</strong> - Perfect for quick text changes and presentation slides</li>
                <li>• <strong>After Effects</strong> - Ideal for creating animated intros and motion graphics</li>
                <li>• <strong>SVG</strong> - Great for web use and infinite scaling without quality loss</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="standard" className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {standardFormats.map(format => (
                <StandardFormatCard key={format.id} format={format} />
              ))}
            </div>

            <div className="bg-gray-900/20 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Standard Format Guidelines</h4>
              <div className="text-white/70 text-sm space-y-1">
                <p>• <strong>PNG HD</strong> - Use for high-quality prints and professional presentations</p>
                <p>• <strong>JPEG Optimized</strong> - Best for YouTube uploads and social media</p>
                <p>• <strong>WebP</strong> - Modern web format with 30% smaller file sizes</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bulk" className="space-y-4">
            <div className="space-y-4">
              <div className="bg-purple-900/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">Export All Formats</h4>
                <p className="text-white/60 text-sm mb-4">
                  Export your thumbnail in all available formats at once for maximum flexibility
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => {
                      // Export all editable formats
                      exportFormats.forEach(async (format, index) => {
                        setTimeout(() => handleExport(format.id), index * 1000);
                      });
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={isExporting}
                  >
                    Export All Editable
                  </Button>
                  
                  <Button
                    onClick={() => {
                      // Export all standard formats
                      standardFormats.forEach(async (format, index) => {
                        setTimeout(() => handleStandardExport(format.id), index * 500);
                      });
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white"
                    disabled={isExporting}
                  >
                    Export All Standard
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-white font-medium">Custom Export Settings</h4>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <span className="text-white/60">Resolution Multiplier</span>
                    <select className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-white">
                      <option value="1">1x (1280x720)</option>
                      <option value="1.5">1.5x (1920x1080)</option>
                      <option value="2">2x (2560x1440)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-white/60">Quality Setting</span>
                    <select className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-white">
                      <option value="high">High Quality</option>
                      <option value="medium">Medium Quality</option>
                      <option value="optimized">Web Optimized</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};