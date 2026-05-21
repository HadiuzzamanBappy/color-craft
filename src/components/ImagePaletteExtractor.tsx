import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { extractDominantColors } from '@/lib/colorUtils';
import { ColorRole, COLOR_ROLE_LABELS } from '@/types/color';
import { Upload, Copy, Check, Plus, Image as ImageIcon, RefreshCw } from 'lucide-react';

interface ImagePaletteExtractorProps {
  onAddColor: (color: string, role: ColorRole) => void;
}

const SAMPLE_IMAGES = [
  {
    name: 'Sunset Glow',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
    description: 'Vibrant oranges and ocean blues'
  },
  {
    name: 'Forest Mist',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&q=80',
    description: 'Deep earthy greens and soft wood tones'
  },
  {
    name: 'Cyberpunk Neon',
    url: 'https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?auto=format&fit=crop&w=400&q=80',
    description: 'Electric pinks and deep cyber purples'
  }
];

export function ImagePaletteExtractor({ onAddColor }: ImagePaletteExtractorProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [extractedColors, setExtractedColors] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<Record<number, ColorRole>>({
    0: 'primary',
    1: 'secondary',
    2: 'accent',
    3: 'neutral',
    4: 'custom'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleRoleChange = (index: number, role: ColorRole) => {
    setSelectedRoles(prev => ({
      ...prev,
      [index]: role
    }));
  };

  const processImage = (src: string) => {
    setIsLoading(true);
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }

        // Downsample to 50x50 for performance and noise reduction
        canvas.width = 50;
        canvas.height = 50;
        ctx.drawImage(img, 0, 0, 50, 50);

        const imgData = ctx.getImageData(0, 0, 50, 50);
        const colors = extractDominantColors(imgData.data, 5);
        
        setExtractedColors(colors);
        setIsLoading(false);
        toast({
          title: 'Extraction complete!',
          description: 'Successfully extracted 5 dominant color swatches.'
        });
      } catch (err) {
        console.error(err);
        setIsLoading(false);
        toast({
          title: 'Extraction failed',
          description: 'Could not compute image pixels due to cross-origin policies.',
          variant: 'destructive'
        });
      }
    };

    img.onerror = () => {
      setIsLoading(false);
      toast({
        title: 'Loading failed',
        description: 'Failed to load the image source.',
        variant: 'destructive'
      });
    };

    img.src = src;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageUrl(src);
      processImage(src);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file',
        description: 'Please upload an image file (PNG, JPG, WEBP).',
        variant: 'destructive'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageUrl(src);
      processImage(src);
    };
    reader.readAsDataURL(file);
  };

  const handleCopyHex = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedHex(hex);
      setTimeout(() => setCopiedHex(null), 2000);
      toast({
        title: 'Copied!',
        description: `${hex} copied to clipboard`
      });
    } catch (err) {
      toast({
        title: 'Failed to copy',
        description: 'An error occurred while copying to clipboard',
        variant: 'destructive'
      });
    }
  };

  const handleAddColorToSystem = (hex: string, index: number) => {
    const role = selectedRoles[index] || 'custom';
    onAddColor(hex, role);
    toast({
      title: 'Added to System',
      description: `Swatch ${hex} added as ${COLOR_ROLE_LABELS[role]}`
    });
  };

  const selectSampleImage = (url: string) => {
    setImageUrl(url);
    processImage(url);
  };

  return (
    <Card className="p-6 bg-surface border-border shadow-md space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Dominant Image Palette Extractor</h3>
        <p className="text-sm text-muted-foreground">
          Extract 5 distinct, vibrant, and accessible dominant colors from any logo or brand image file using native local canvas analytics.
        </p>
      </div>

      <Separator />

      {/* Main Drag & Drop Zone / Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer p-6 transition-all duration-300 relative overflow-hidden group ${
              isDragging 
                ? 'border-primary bg-primary/5 scale-[0.99]' 
                : 'border-border bg-surface-alt hover:bg-surface-alt/80 hover:border-primary/50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {imageUrl ? (
              <>
                <img
                  src={imageUrl}
                  alt="Source brand"
                  className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300 rounded-lg">
                  <RefreshCw className="h-8 w-8 text-white mb-2 animate-spin-hover" />
                  <p className="text-xs font-semibold text-white">Click or Drop to replace image</p>
                </div>
              </>
            ) : (
              <div className="text-center space-y-3">
                <div className="p-4 bg-surface rounded-full shadow-sm max-w-max mx-auto border border-border group-hover:scale-110 transition-transform duration-300">
                  <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Drag & drop your image here</p>
                  <p className="text-xs text-muted-foreground mt-1">Supports PNG, JPG, SVG, and WEBP files</p>
                </div>
                <Button size="sm" variant="outline" className="border-border">
                  Browse Files
                </Button>
              </div>
            )}
          </div>

          {/* Preset Sample Choices */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Or Try A Premium Preset Sample
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SAMPLE_IMAGES.map((sample, idx) => (
                <div
                  key={idx}
                  onClick={() => selectSampleImage(sample.url)}
                  className="group cursor-pointer rounded-lg border border-border bg-surface hover:border-primary/50 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="h-16 relative overflow-hidden">
                    <img 
                      src={sample.url} 
                      alt={sample.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-2 text-left">
                    <p className="text-xs font-semibold text-foreground truncate">{sample.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{sample.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Extracted Swatches List */}
        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-primary" />
              Extracted Dominant Color Swatches
            </h4>
            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-48 space-y-3">
                <RefreshCw className="h-8 w-8 text-primary animate-spin" />
                <p className="text-xs text-muted-foreground">Quantizing image pixel grids...</p>
              </div>
            ) : extractedColors.length > 0 ? (
              <div className="space-y-3">
                {extractedColors.map((hex, idx) => {
                  const currentRole = selectedRoles[idx] || 'custom';
                  return (
                    <div 
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface-alt/50 hover:bg-surface-alt transition-all duration-200"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Swatch visual */}
                        <div 
                          className="w-12 h-12 rounded-lg border border-border shadow-inner cursor-pointer hover:scale-105 transition-transform" 
                          style={{ backgroundColor: hex }}
                          onClick={() => handleCopyHex(hex)}
                        />
                        <div className="min-w-0">
                          {/* Copy trigger hex */}
                          <button 
                            onClick={() => handleCopyHex(hex)}
                            className="flex items-center gap-1 font-mono text-sm font-bold text-foreground hover:text-primary transition-colors focus:outline-none"
                          >
                            {hex}
                            {copiedHex === hex ? (
                              <Check className="h-3.5 w-3.5 text-success" />
                            ) : (
                              <Copy className="h-3.5 w-3.5 opacity-50" />
                            )}
                          </button>
                          <p className="text-[10px] text-muted-foreground capitalize">Dominant color {idx + 1}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Target Role selection */}
                        <Select 
                          value={currentRole} 
                          onValueChange={(val) => handleRoleChange(idx, val as ColorRole)}
                        >
                          <SelectTrigger className="w-28 h-8 text-xs font-medium border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(COLOR_ROLE_LABELS).map(([roleVal, label]) => (
                              <SelectItem key={roleVal} value={roleVal} className="text-xs">
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Add to palette trigger */}
                        <Button 
                          onClick={() => handleAddColorToSystem(hex, idx)}
                          size="sm" 
                          variant="outline" 
                          className="h-8 w-8 p-0 border-border hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 border border-dashed border-border rounded-lg text-muted-foreground p-4">
                <Upload className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">No color swatches extracted yet</p>
                <p className="text-xs text-center max-w-xs mt-1">Upload an image or pick a premium preset on the left to extract beautiful dominant brand configurations.</p>
              </div>
            )}
          </div>

          {extractedColors.length > 0 && (
            <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20 text-[11px] text-primary">
              Tip: Match matching dominant swatches with specific UI design system roles (e.g. Primary, Secondary, or Success) and click the Plus button to append them to your Color System panel.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
