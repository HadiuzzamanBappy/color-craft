import { ColorShade, NeutralShades, ColorRole } from '@/types/color';

// Color utility functions for the Color Shade Generator

export interface HSL {
    h: number;
    s: number;
    l: number;
  }
  
  export interface RGB {
    r: number;
    g: number;
    b: number;
  }
  
  // Validate hex color
  export function isValidHex(hex: string): boolean {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  }
  
  // Convert hex to RGB
  export function hexToRgb(hex: string): RGB {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }
  
  // Convert RGB to hex
  export function rgbToHex(r: number, g: number, b: number): string {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  
  // Convert hex to HSL
  export function hexToHsl(hex: string): HSL {
    const rgb = hexToRgb(hex);
    return rgbToHsl(rgb.r, rgb.g, rgb.b);
  }
  
  // Convert RGB to HSL
  export function rgbToHsl(r: number, g: number, b: number): HSL {
    r /= 255;
    g /= 255;
    b /= 255;
  
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
  
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
  
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }
  
  // Convert HSL to RGB
  export function hslToRgb(h: number, s: number, l: number): RGB {
    h /= 360;
    s /= 100;
    l /= 100;
  
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
  
    let r, g, b;
  
    if (s === 0) {
      r = g = b = l;
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
  }
  
  // Convert HSL to hex
  export function hslToHex(h: number, s: number, l: number): string {
    const rgb = hslToRgb(h, s, l);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
  }
  
  // Generate color shades
  export function generateShades(baseColor: string, steps: number = 9): string[] {
    const hsl = hexToHsl(baseColor);
    const shades: string[] = [];
    
    // Generate lighter shades
    for (let i = steps - 1; i >= 1; i--) {
      const lightness = Math.min(95, hsl.l + (i * (90 - hsl.l) / steps));
      shades.push(hslToHex(hsl.h, hsl.s, lightness));
    }
    
    // Add base color
    shades.push(baseColor);
    
    // Generate darker shades
    for (let i = 1; i < steps; i++) {
      const lightness = Math.max(5, hsl.l - (i * hsl.l / steps));
      shades.push(hslToHex(hsl.h, hsl.s, lightness));
    }
    
    return shades;
  }
  
  // Generate color harmonies
  export function generateComplementary(baseColor: string): string[] {
    const hsl = hexToHsl(baseColor);
    const complementHue = (hsl.h + 180) % 360;
    return [baseColor, hslToHex(complementHue, hsl.s, hsl.l)];
  }
  
  export function generateAnalogous(baseColor: string): string[] {
    const hsl = hexToHsl(baseColor);
    return [
      hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l),
      baseColor,
      hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l)
    ];
  }
  
  export function generateTriadic(baseColor: string): string[] {
    const hsl = hexToHsl(baseColor);
    return [
      baseColor,
      hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
      hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l)
    ];
  }
  
  export function generateTetradic(baseColor: string): string[] {
    const hsl = hexToHsl(baseColor);
    return [
      baseColor,
      hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l),
      hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
      hslToHex((hsl.h + 270) % 360, hsl.s, hsl.l)
    ];
  }
  
  export function generateSplitComplementary(baseColor: string): string[] {
    const hsl = hexToHsl(baseColor);
    const complement = (hsl.h + 180) % 360;
    return [
      baseColor,
      hslToHex((complement - 30 + 360) % 360, hsl.s, hsl.l),
      hslToHex((complement + 30) % 360, hsl.s, hsl.l)
    ];
  }
  
  // Calculate contrast ratio for accessibility
  export function calculateContrastRatio(color1: string, color2: string): number {
    const getLuminance = (hex: string) => {
      const rgb = hexToRgb(hex);
      const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
  
    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  }
  
  // Generate neutral shades (white, black, gray)
  export function generateNeutralShades() {
    const alphaPercents = [8, 16, 24, 32, 40, 48, 56, 64, 72, 80];
    const toRgba = (hex: string, alpha: number) => {
      const rgb = hexToRgb(hex);
      return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
    };
    return {
      white: alphaPercents.map(p => toRgba('#ffffff', p / 100)),
      black: alphaPercents.map(p => toRgba('#000000', p / 100)),
      gray: generateShades('#808080', 5)
    };
  }
  
  // Export to CSS variables
  export function exportToCssVariables(shades: string[], name: string = 'color'): string {
    return shades.map((shade, index) => {
      const stepNumbers = generateStepNumbers(shades.length);
      return `  --${name}-${stepNumbers[index]}: ${shade};`;
    }).join('\n');
  }
  
  // Generate step numbers for shades (50, 100, 200, etc.)
  export function generateStepNumbers(count: number): number[] {
    if (count === 9) {
      return [100, 200, 300, 400, 500, 600, 700, 800, 900];
    }
    if (count === 10) {
      return [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
    }
    
    // Generic monotonic step numbering
    const middle = Math.floor(count / 2);
    return Array.from({ length: count }, (_, index) => {
      if (index < middle) {
        const step = 400 / middle;
        return Math.round((index + 1) * step);
      } else if (index === middle) {
        return 500;
      } else {
        const step = 400 / (count - middle - 1 || 1);
        return Math.round(500 + (index - middle) * step);
      }
    });
  }
  
  // Export full palette to different formats
  export function exportPalette(
    colors: ColorShade[], 
    neutrals: NeutralShades, 
    format: 'css' | 'scss' | 'tailwind' | 'tailwind-hex' | 'tailwind-var' | 'tailwind-v4' | 'json' = 'css'
  ): string {
    switch (format) {
      case 'css':
        return exportToCss(colors, neutrals);
      case 'scss':
        return exportToScss(colors, neutrals);
      case 'tailwind':
      case 'tailwind-hex':
        return exportToTailwind(colors, neutrals);
      case 'tailwind-var':
        return exportToTailwindVar(colors, neutrals);
      case 'tailwind-v4':
        return exportToTailwindV4(colors, neutrals);
      case 'json':
        return exportToJson(colors, neutrals);
      default:
        return exportToCss(colors, neutrals);
    }
  }
  
  function exportToCss(colors: ColorShade[], neutrals: NeutralShades): string {
    let css = ':root {\n';
    
    // Brand colors
    colors.forEach(color => {
      const name = color.name.toLowerCase().replace(/\s+/g, '-');
      color.shades.forEach((shade: string, index: number) => {
        const stepNumbers = generateStepNumbers(color.shades.length);
        css += `  --${name}-${stepNumbers[index]}: ${shade};\n`;
      });
    });
    
    // Neutral colors
    Object.entries(neutrals).forEach(([type, shades]) => {
      const isOpacityBase = type === 'white' || type === 'black';
      const alphaPercents = [8, 16, 24, 32, 40, 48, 56, 64, 72, 80];
      shades.forEach((shade: string, index: number) => {
        const stepName = (isOpacityBase && shades.length === 10)
          ? alphaPercents[index]
          : generateStepNumbers(shades.length)[index];
        css += `  --${type}-${stepName}: ${shade};\n`;
      });
    });
    
    css += '}';
    return css;
  }
  
  function exportToScss(colors: ColorShade[], neutrals: NeutralShades): string {
    let scss = '// Color Variables\n\n';
    
    colors.forEach(color => {
      const name = color.name.toLowerCase().replace(/\s+/g, '-');
      scss += `// ${color.name} Colors\n`;
      color.shades.forEach((shade: string, index: number) => {
        const stepNumbers = generateStepNumbers(color.shades.length);
        scss += `$${name}-${stepNumbers[index]}: ${shade};\n`;
      });
      scss += '\n';
    });
    
    scss += '// Neutral Colors\n';
    Object.entries(neutrals).forEach(([type, shades]) => {
      scss += `// ${type.charAt(0).toUpperCase() + type.slice(1)} Colors\n`;
      const isOpacityBase = type === 'white' || type === 'black';
      const alphaPercents = [8, 16, 24, 32, 40, 48, 56, 64, 72, 80];
      shades.forEach((shade: string, index: number) => {
        const stepName = (isOpacityBase && shades.length === 10)
          ? alphaPercents[index]
          : generateStepNumbers(shades.length)[index];
        scss += `$${type}-${stepName}: ${shade};\n`;
      });
      scss += '\n';
    });
    
    return scss;
  }
  
  function exportToTailwind(colors: ColorShade[], neutrals: NeutralShades): string {
    const config: { theme: { extend: { colors: Record<string, Record<string, string>> } } } = { 
      theme: { extend: { colors: {} } } 
    };
    
    colors.forEach(color => {
      const name = color.name.toLowerCase().replace(/\s+/g, '-');
      const colorObj: Record<string, string> = {};
      color.shades.forEach((shade: string, index: number) => {
        const stepNumbers = generateStepNumbers(color.shades.length);
        colorObj[stepNumbers[index]] = shade;
      });
      config.theme.extend.colors[name] = colorObj;
    });
    
    Object.entries(neutrals).forEach(([type, shades]) => {
      const colorObj: Record<string, string> = {};
      const isOpacityBase = type === 'white' || type === 'black';
      const alphaPercents = [8, 16, 24, 32, 40, 48, 56, 64, 72, 80];
      shades.forEach((shade: string, index: number) => {
        const stepName = (isOpacityBase && shades.length === 10)
          ? alphaPercents[index]
          : generateStepNumbers(shades.length)[index];
        colorObj[stepName] = shade;
      });
      config.theme.extend.colors[type] = colorObj;
    });
    
    return JSON.stringify(config, null, 2);
  }

  function exportToTailwindVar(colors: ColorShade[], neutrals: NeutralShades): string {
    const config: { theme: { extend: { colors: Record<string, Record<string, string>> } } } = { 
      theme: { extend: { colors: {} } } 
    };
    
    colors.forEach(color => {
      const name = color.name.toLowerCase().replace(/\s+/g, '-');
      const colorObj: Record<string, string> = {};
      color.shades.forEach((_, index: number) => {
        const stepNumbers = generateStepNumbers(color.shades.length);
        colorObj[stepNumbers[index]] = `var(--${name}-${stepNumbers[index]})`;
      });
      config.theme.extend.colors[name] = colorObj;
    });
    
    Object.entries(neutrals).forEach(([type, shades]) => {
      const colorObj: Record<string, string> = {};
      const isOpacityBase = type === 'white' || type === 'black';
      const alphaPercents = [8, 16, 24, 32, 40, 48, 56, 64, 72, 80];
      shades.forEach((_, index: number) => {
        const stepName = (isOpacityBase && shades.length === 10)
          ? alphaPercents[index]
          : generateStepNumbers(shades.length)[index];
        colorObj[stepName] = `var(--${type}-${stepName})`;
      });
      config.theme.extend.colors[type] = colorObj;
    });
    
    return JSON.stringify(config, null, 2);
  }

  function exportToTailwindV4(colors: ColorShade[], neutrals: NeutralShades): string {
    let css = '@theme {\n';
    
    colors.forEach(color => {
      const name = color.name.toLowerCase().replace(/\s+/g, '-');
      color.shades.forEach((shade: string, index: number) => {
        const stepNumbers = generateStepNumbers(color.shades.length);
        css += `  --color-${name}-${stepNumbers[index]}: ${shade};\n`;
      });
    });
    
    Object.entries(neutrals).forEach(([type, shades]) => {
      const isOpacityBase = type === 'white' || type === 'black';
      const alphaPercents = [8, 16, 24, 32, 40, 48, 56, 64, 72, 80];
      shades.forEach((shade: string, index: number) => {
        const stepName = (isOpacityBase && shades.length === 10)
          ? alphaPercents[index]
          : generateStepNumbers(shades.length)[index];
        css += `  --color-${type}-${stepName}: ${shade};\n`;
      });
    });
    
    css += '}';
    return css;
  }
  
  function exportToJson(colors: ColorShade[], neutrals: NeutralShades): string {
    const palette = {
      colors: {} as Record<string, { name: string; role: ColorRole; base: string; shades: Record<string, string> }>,
      neutrals: neutrals,
      metadata: {
        generatedAt: new Date().toISOString(),
        version: '1.0.0'
      }
    };
    
    colors.forEach(color => {
      const name = color.name.toLowerCase().replace(/\s+/g, '-');
      const colorObj = {
        name: color.name,
        role: color.role,
        base: color.color,
        shades: {} as Record<string, string>
      };
      
      color.shades.forEach((shade: string, index: number) => {
        const stepNumbers = generateStepNumbers(color.shades.length);
        colorObj.shades[stepNumbers[index]] = shade;
      });
      
      palette.colors[name] = colorObj;
    });
    
    return JSON.stringify(palette, null, 2);
  }

  // Extract dominant colors from a downsampled pixel list using spatial grouping and HSL distancing
  export function extractDominantColors(pixels: Uint8ClampedArray, count: number = 5): string[] {
    const colorCounts: Record<string, number> = {};
    
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const a = pixels[i + 3];
      
      // Skip transparent pixels
      if (a < 125) continue;
      
      const isGray = Math.abs(r - g) < 15 && Math.abs(g - b) < 15 && Math.abs(r - b) < 15;
      
      // Convert to hex with light clustering
      const roundedR = Math.round(r / 16) * 16;
      const roundedG = Math.round(g / 16) * 16;
      const roundedB = Math.round(b / 16) * 16;
      
      const rClamp = Math.min(255, Math.max(0, roundedR));
      const gClamp = Math.min(255, Math.max(0, roundedG));
      const bClamp = Math.min(255, Math.max(0, roundedB));
      
      const hex = rgbToHex(rClamp, gClamp, bClamp);
      
      // Weight vibrant colors higher than neutral gray background levels
      const weight = isGray ? 1 : 3;
      colorCounts[hex] = (colorCounts[hex] || 0) + weight;
    }
    
    // Sort by frequency
    const sortedColors = Object.keys(colorCounts).sort((a, b) => colorCounts[b] - colorCounts[a]);
    
    // Select unique colors that are visually distinct (HSL Hue difference > 35 degrees)
    const distinctColors: string[] = [];
    
    for (const hex of sortedColors) {
      if (distinctColors.length >= count) break;
      
      const hsl = hexToHsl(hex);
      
      const isTooSimilar = distinctColors.some(selectedHex => {
        const selectedHsl = hexToHsl(selectedHex);
        const hueDiff = Math.min(
          Math.abs(hsl.h - selectedHsl.h),
          360 - Math.abs(hsl.h - selectedHsl.h)
        );
        
        return hueDiff < 35 && Math.abs(hsl.s - selectedHsl.s) < 25 && Math.abs(hsl.l - selectedHsl.l) < 25;
      });
      
      if (!isTooSimilar) {
        distinctColors.push(hex);
      }
    }
    
    // Backfill with high frequency colors if count not satisfied
    let idx = 0;
    while (distinctColors.length < count && idx < sortedColors.length) {
      const hex = sortedColors[idx++];
      if (!distinctColors.includes(hex)) {
        distinctColors.push(hex);
      }
    }
    
    // Fallback if extraction yielded nothing
    if (distinctColors.length === 0) {
      return ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];
    }
    
    return distinctColors.slice(0, count);
  }