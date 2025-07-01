import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface Template {
  id: string;
  name: string;
  category: 'gaming' | 'tech' | 'education' | 'entertainment' | 'business' | 'custom';
  thumbnail: string;
  config: any;
  tags: string[];
  isCustom: boolean;
  dateCreated: string;
}

interface TemplateSystemProps {
  currentConfig: any;
  onTemplateApply: (config: any) => void;
  onTemplateSave: (template: Template) => void;
}

export const TemplateSystem = ({ currentConfig, onTemplateApply, onTemplateSave }: TemplateSystemProps) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [customTemplates, setCustomTemplates] = useState<Template[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('gaming');
  const [newTemplateName, setNewTemplateName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  // Predefined templates
  const predefinedTemplates: Template[] = [
    {
      id: 'gaming-action',
      name: 'Gaming Action Hero',
      category: 'gaming',
      thumbnail: '/api/placeholder/200/112',
      config: {
        mainText: 'EPIC BATTLE',
        subText: 'WHO WILL WIN?',
        backgroundPreset: 'finals-arena',
        textColor: '#ffffff',
        accentColor: '#ff0080',
        fontSize: 'xlarge',
        textPosition: 'center-left',
        overlayImageSize: 70,
        characterPosition: 'bottom-right',
        glowEffect: true,
        borderGlow: true,
        textShadow: true,
        textOutline: true,
        animatedText: true
      },
      tags: ['action', 'gaming', 'battle', 'epic'],
      isCustom: false,
      dateCreated: '2025-01-01'
    },
    {
      id: 'gaming-challenge',
      name: 'Challenge Accepted',
      category: 'gaming',
      thumbnail: '/api/placeholder/200/112',
      config: {
        mainText: 'CAN I WIN WITHOUT DAMAGE?',
        subText: 'THE FINALS CHALLENGE',
        backgroundPreset: 'las-vegas',
        textColor: '#ffff00',
        accentColor: '#ff6600',
        fontSize: 'large',
        textPosition: 'center-left',
        overlayImageSize: 75,
        characterPosition: 'bottom-right',
        glowEffect: true,
        borderGlow: false,
        textShadow: true,
        textOutline: true
      },
      tags: ['challenge', 'gaming', 'question', 'vegas'],
      isCustom: false,
      dateCreated: '2025-01-01'
    },
    {
      id: 'tech-tutorial',
      name: 'Tech Tutorial',
      category: 'tech',
      thumbnail: '/api/placeholder/200/112',
      config: {
        mainText: 'LEARN TO CODE',
        subText: 'IN 5 MINUTES',
        backgroundPreset: 'cyberpunk-pink',
        textColor: '#00ff00',
        accentColor: '#0080ff',
        fontSize: 'xlarge',
        textPosition: 'center',
        overlayImageSize: 40,
        characterPosition: 'center-right',
        glowEffect: true,
        borderGlow: true,
        gradientText: true
      },
      tags: ['tutorial', 'coding', 'tech', 'learn'],
      isCustom: false,
      dateCreated: '2025-01-01'
    },
    {
      id: 'entertainment-viral',
      name: 'Viral Content',
      category: 'entertainment',
      thumbnail: '/api/placeholder/200/112',
      config: {
        mainText: 'YOU WON\'T BELIEVE',
        subText: 'WHAT HAPPENS NEXT!',
        backgroundPreset: 'fire-storm',
        textColor: '#ffffff',
        accentColor: '#ff4500',
        fontSize: 'xlarge',
        textPosition: 'center',
        overlayImageSize: 30,
        glowEffect: true,
        borderGlow: true,
        textShadow: true,
        animatedText: true
      },
      tags: ['viral', 'entertainment', 'clickbait', 'dramatic'],
      isCustom: false,
      dateCreated: '2025-01-01'
    },
    {
      id: 'business-professional',
      name: 'Business Professional',
      category: 'business',
      thumbnail: '/api/placeholder/200/112',
      config: {
        mainText: 'BUSINESS SUCCESS',
        subText: 'STRATEGIES THAT WORK',
        backgroundPreset: 'urban-battlefield',
        textColor: '#ffffff',
        accentColor: '#00d4ff',
        fontSize: 'large',
        textPosition: 'center-left',
        overlayImageSize: 50,
        characterPosition: 'center-right',
        glowEffect: false,
        borderGlow: false,
        textShadow: true
      },
      tags: ['business', 'professional', 'success', 'corporate'],
      isCustom: false,
      dateCreated: '2025-01-01'
    },
    {
      id: 'education-learning',
      name: 'Educational Content',
      category: 'education',
      thumbnail: '/api/placeholder/200/112',
      config: {
        mainText: 'MASTER THE BASICS',
        subText: 'COMPLETE GUIDE',
        backgroundPreset: 'crystal-district',
        textColor: '#ffffff',
        accentColor: '#00ff80',
        fontSize: 'large',
        textPosition: 'center',
        overlayImageSize: 45,
        glowEffect: true,
        borderGlow: false,
        textShadow: true,
        gradientText: true
      },
      tags: ['education', 'learning', 'guide', 'tutorial'],
      isCustom: false,
      dateCreated: '2025-01-01'
    }
  ];

  useEffect(() => {
    setTemplates(predefinedTemplates);
    loadCustomTemplates();
  }, []);

  const loadCustomTemplates = () => {
    try {
      const saved = localStorage.getItem('thumbnail-templates');
      if (saved) {
        const parsed = JSON.parse(saved);
        setCustomTemplates(parsed);
      }
    } catch (error) {
      console.error('Error loading custom templates:', error);
    }
  };

  const saveCustomTemplate = () => {
    if (!newTemplateName.trim()) {
      toast({
        title: "Template Name Required",
        description: "Please enter a name for your template",
        variant: "destructive"
      });
      return;
    }

    const newTemplate: Template = {
      id: `custom-${Date.now()}`,
      name: newTemplateName,
      category: 'custom',
      thumbnail: '/api/placeholder/200/112',
      config: { ...currentConfig },
      tags: ['custom', 'user-created'],
      isCustom: true,
      dateCreated: new Date().toISOString().split('T')[0]
    };

    const updatedCustomTemplates = [...customTemplates, newTemplate];
    setCustomTemplates(updatedCustomTemplates);

    try {
      localStorage.setItem('thumbnail-templates', JSON.stringify(updatedCustomTemplates));
      onTemplateSave(newTemplate);
      setNewTemplateName('');
      
      toast({
        title: "Template Saved",
        description: `"${newTemplateName}" has been saved successfully`,
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Could not save template. Please try again.",
        variant: "destructive"
      });
    }
  };

  const deleteCustomTemplate = (templateId: string) => {
    const updatedTemplates = customTemplates.filter(t => t.id !== templateId);
    setCustomTemplates(updatedTemplates);
    
    try {
      localStorage.setItem('thumbnail-templates', JSON.stringify(updatedTemplates));
      toast({
        title: "Template Deleted",
        description: "Template has been removed successfully",
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Could not delete template. Please try again.",
        variant: "destructive"
      });
    }
  };

  const applyTemplate = (template: Template) => {
    onTemplateApply(template.config);
    toast({
      title: "Template Applied",
      description: `"${template.name}" has been applied to your thumbnail`,
    });
  };

  const filteredTemplates = (templateList: Template[]) => {
    return templateList.filter(template => {
      const matchesSearch = searchQuery === '' || 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  };

  const categories = [
    { id: 'all', name: 'All Templates', count: templates.length + customTemplates.length },
    { id: 'gaming', name: 'Gaming', count: templates.filter(t => t.category === 'gaming').length },
    { id: 'tech', name: 'Technology', count: templates.filter(t => t.category === 'tech').length },
    { id: 'entertainment', name: 'Entertainment', count: templates.filter(t => t.category === 'entertainment').length },
    { id: 'business', name: 'Business', count: templates.filter(t => t.category === 'business').length },
    { id: 'education', name: 'Education', count: templates.filter(t => t.category === 'education').length },
    { id: 'custom', name: 'Custom', count: customTemplates.length }
  ];

  const TemplateCard = ({ template }: { template: Template }) => (
    <Card className="bg-black/40 border-white/20 hover:border-white/40 transition-all duration-200">
      <CardContent className="p-3">
        <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
          <div className="text-white/40 text-xs">Preview</div>
          <div className="absolute top-2 right-2">
            {template.category === 'gaming' && <span className="text-xs">🎮</span>}
            {template.category === 'tech' && <span className="text-xs">💻</span>}
            {template.category === 'entertainment' && <span className="text-xs">🎬</span>}
            {template.category === 'business' && <span className="text-xs">💼</span>}
            {template.category === 'education' && <span className="text-xs">📚</span>}
            {template.category === 'custom' && <span className="text-xs">⭐</span>}
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-white font-medium text-sm truncate">{template.name}</h4>
          
          <div className="flex flex-wrap gap-1">
            {template.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => applyTemplate(template)}
              size="sm"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs"
            >
              Apply
            </Button>
            
            {template.isCustom && (
              <Button
                onClick={() => deleteCustomTemplate(template.id)}
                size="sm"
                variant="destructive"
                className="text-xs"
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card className="bg-black/40 border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Template System</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10">
            <TabsTrigger value="browse" className="text-white">Browse Templates</TabsTrigger>
            <TabsTrigger value="create" className="text-white">Create Template</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-4">
            {/* Search */}
            <div className="space-y-2">
              <Label className="text-white text-sm">Search Templates</Label>
              <Input
                placeholder="Search by name or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <Label className="text-white text-sm">Categories</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    className={`text-xs ${
                      selectedCategory === category.id 
                        ? 'bg-blue-600 text-white' 
                        : 'text-white border-white/20 hover:bg-white/10'
                    }`}
                  >
                    {category.name} ({category.count})
                  </Button>
                ))}
              </div>
            </div>

            {/* Templates Grid */}
            <ScrollArea className="h-96">
              <div className="grid grid-cols-2 gap-3">
                {/* Predefined Templates */}
                {filteredTemplates(templates).map(template => (
                  <TemplateCard key={template.id} template={template} />
                ))}
                
                {/* Custom Templates */}
                {filteredTemplates(customTemplates).map(template => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
              
              {filteredTemplates(templates).length === 0 && filteredTemplates(customTemplates).length === 0 && (
                <div className="text-center text-white/60 py-8">
                  No templates found matching your criteria
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white text-sm">Template Name</Label>
                <Input
                  placeholder="Enter template name..."
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
              </div>

              <div className="bg-white/5 rounded-lg p-4 space-y-2">
                <Label className="text-white text-sm">Current Configuration Preview</Label>
                <div className="text-white/60 text-xs space-y-1">
                  <div>Background: {currentConfig.backgroundPreset}</div>
                  <div>Text: "{currentConfig.mainText}"</div>
                  <div>Colors: {currentConfig.textColor} / {currentConfig.accentColor}</div>
                  <div>Character Size: {currentConfig.overlayImageSize || 25}%</div>
                </div>
              </div>

              <Button
                onClick={saveCustomTemplate}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={!newTemplateName.trim()}
              >
                Save as Template
              </Button>

              <div className="text-white/60 text-xs">
                Your current thumbnail configuration will be saved and can be reused later.
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};