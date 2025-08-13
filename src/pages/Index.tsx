import { useState } from 'react';
import { Header } from '@/components/Header';
import { ColorPicker } from '@/components/ColorPicker';
import { ShadeGenerator } from '@/components/ShadeGenerator';
import { HarmonyGenerator } from '@/components/HarmonyGenerator';
import { PreviewPanel } from '@/components/PreviewPanel';
import { ColorSystemManager } from '@/components/ColorSystemManager';
import { NeutralColorPanel } from '@/components/NeutralColorPanel';
import { useColorPalette } from '@/hooks/useColorPalette';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [currentColor, setCurrentColor] = useState('#6366f1');
  const {
    palette,
    addColor,
    updateColor,
    removeColor,
    updateColorRole,
    updateColorName,
    lockColor,
    regenerateShades,
    updatePaletteName
  } = useColorPalette();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-12 px-4 bg-gradient-surface border-b border-border">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
              Professional
              <span className="block bg-gradient-primary bg-clip-text text-transparent">
                Color Generator
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create stunning color palettes, generate perfect shades, and build accessible color systems 
              for your next design project.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                ✨ Harmony Generation
              </span>
              <span className="flex items-center gap-1">
                🎨 Accessibility Checker
              </span>
              <span className="flex items-center gap-1">
                📱 Export Ready
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-4 space-y-6">
            <ColorPicker 
              currentColor={currentColor} 
              onColorChange={setCurrentColor} 
            />
            <PreviewPanel 
              primaryColor={currentColor} 
              secondaryColor="#ffffff" 
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            <Tabs defaultValue="generator" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="generator">Generator</TabsTrigger>
                <TabsTrigger value="system">Color System</TabsTrigger>
                <TabsTrigger value="neutrals">Neutrals</TabsTrigger>
                <TabsTrigger value="harmony">Harmony</TabsTrigger>
              </TabsList>
              
              <TabsContent value="generator" className="space-y-6">
                <ShadeGenerator baseColor={currentColor} />
              </TabsContent>
              
              <TabsContent value="system" className="space-y-6">
                <ColorSystemManager
                  colors={palette.colors}
                  neutrals={palette.neutrals}
                  onAddColor={addColor}
                  onUpdateColor={updateColor}
                  onRemoveColor={removeColor}
                  onUpdateColorRole={updateColorRole}
                  onUpdateColorName={updateColorName}
                  onLockColor={lockColor}
                  onRegenerateShades={regenerateShades}
                />
              </TabsContent>
              
              <TabsContent value="neutrals" className="space-y-6">
                <NeutralColorPanel neutrals={palette.neutrals} />
              </TabsContent>
              
              <TabsContent value="harmony" className="space-y-6">
                <HarmonyGenerator baseColor={currentColor} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 px-4 border-t border-border bg-surface-alt">
        <div className="container mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            Built with ❤️ for designers and developers. 
            <span className="mx-2">•</span>
            Powered by modern web technologies.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;