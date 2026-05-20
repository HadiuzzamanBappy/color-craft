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