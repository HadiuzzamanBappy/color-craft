import { useState } from 'react';
import { Header } from '@/components/Header';
import { ColorPicker } from '@/components/ColorPicker';
import { ShadeGenerator } from '@/components/ShadeGenerator';
import { HarmonyGenerator } from '@/components/HarmonyGenerator';
import { PreviewPanel } from '@/components/PreviewPanel';
import { ColorSystemManager } from '@/components/ColorSystemManager';
import { NeutralColorPanel } from '@/components/NeutralColorPanel';
import { ContrastMatrix } from '@/components/ContrastMatrix';
import { ImagePaletteExtractor } from '@/components/ImagePaletteExtractor';
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
    updatePaletteName,
    updateNeutrals
  } = useColorPalette();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
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
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-6 bg-muted/50 p-1.5 h-auto">
                <TabsTrigger value="generator" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs font-semibold py-2">Generator</TabsTrigger>
                <TabsTrigger value="system" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs font-semibold py-2">Color System</TabsTrigger>
                <TabsTrigger value="neutrals" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs font-semibold py-2">Neutrals</TabsTrigger>
                <TabsTrigger value="harmony" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs font-semibold py-2">Harmony</TabsTrigger>
                <TabsTrigger value="contrast" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs font-semibold py-2">Contrast Matrix</TabsTrigger>
                <TabsTrigger value="extractor" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs font-semibold py-2">Image Extractor</TabsTrigger>
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
                <NeutralColorPanel 
                  neutrals={palette.neutrals} 
                  onUpdateNeutrals={updateNeutrals}
                />
              </TabsContent>
              
              <TabsContent value="harmony" className="space-y-6">
                <HarmonyGenerator baseColor={currentColor} />
              </TabsContent>

              <TabsContent value="contrast" className="space-y-6">
                <ContrastMatrix colors={palette.colors} neutrals={palette.neutrals} />
              </TabsContent>

              <TabsContent value="extractor" className="space-y-6">
                <ImagePaletteExtractor onAddColor={addColor} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border bg-surface-alt mt-auto">
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