import { useState, useCallback, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Palette, Pipette } from 'lucide-react';
import { hexToHsl, hslToHex, isValidHex } from '@/lib/colorUtils';

interface ColorPickerProps {
  onColorChange: (color: string) => void;
  currentColor: string;
}

export function ColorPicker({ onColorChange, currentColor }: ColorPickerProps) {
  const [hexInput, setHexInput] = useState(currentColor);
  const [hslInput, setHslInput] = useState(() => {
    const hsl = hexToHsl(currentColor);
    return `${hsl.h}, ${hsl.s}%, ${hsl.l}%`;
  });

  const handleHexChange = useCallback((value: string) => {
    setHexInput(value);
    if (isValidHex(value)) {
      onColorChange(value);
      const hsl = hexToHsl(value);
      setHslInput(`${hsl.h}, ${hsl.s}%, ${hsl.l}%`);
    }
  }, [onColorChange]);

  const handleHslChange = useCallback((value: string) => {
    setHslInput(value);
    const match = value.match(/(\d+),\s*(\d+)%,\s*(\d+)%/);
    if (match) {
      const [, h, s, l] = match;
      const hex = hslToHex(parseInt(h), parseInt(s), parseInt(l));
      setHexInput(hex);
      onColorChange(hex);
    }
  }, [onColorChange]);

  const openEyedropper = useCallback(async () => {
    if ('EyeDropper' in window) {
      try {
        // @ts-expect-error - EyeDropper is not in TypeScript types yet
        const eyeDropper = new EyeDropper();
        const result = await eyeDropper.open();
        handleHexChange(result.sRGBHex);
      } catch (error) {
        console.log('Eyedropper cancelled');
      }
    }
  }, [handleHexChange]);

  const colorInputRef = useRef<HTMLInputElement>(null);
  const openNativePicker = () => colorInputRef.current?.click();

  return (
    <Card className="p-6 bg-surface border-border shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-foreground">Color Input</h3>
        </div>

        {/* Color Preview */}
        <div className="flex items-center gap-4">
          <input
            ref={colorInputRef}
            type="color"
            value={hexInput}
            onChange={(e) => handleHexChange(e.target.value)}
            className="hidden"
            aria-hidden
          />
          <div 
            role="button"
            title="Click to pick a color"
            onClick={openNativePicker}
            className="w-16 h-16 rounded-xl shadow-md border-2 border-border transition-transform duration-300 hover:scale-105 cursor-pointer"
            style={{ backgroundColor: currentColor }}
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{currentColor}</p>
            <p className="text-xs text-muted-foreground">Click the swatch to use the native color picker</p>
          </div>
        </div>

        {/* Hex Input */}
        <div className="space-y-2">
          <Label htmlFor="hex-input" className="text-sm font-medium text-foreground">
            HEX Color
          </Label>
          <Input
            id="hex-input"
            type="text"
            placeholder="#FF5733"
            value={hexInput}
            onChange={(e) => handleHexChange(e.target.value)}
            className="font-mono bg-surface-alt border-border focus:ring-primary"
          />
        </div>

        {/* HSL Input */}
        <div className="space-y-2">
          <Label htmlFor="hsl-input" className="text-sm font-medium text-foreground">
            HSL Color
          </Label>
          <Input
            id="hsl-input"
            type="text"
            placeholder="0, 100%, 50%"
            value={hslInput}
            onChange={(e) => handleHslChange(e.target.value)}
            className="font-mono bg-surface-alt border-border focus:ring-primary"
          />
        </div>

        {/* Eyedropper */}
        {'EyeDropper' in window && (
          <Button
            onClick={openEyedropper}
            variant="outline"
            className="w-full border-border hover:bg-surface-alt hover:border-primary transition-colors duration-300"
          >
            <Pipette className="mr-2 h-4 w-4" />
            Pick Color from Screen
          </Button>
        )}
      </div>
    </Card>
  );
}