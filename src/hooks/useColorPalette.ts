import { useState, useCallback, useEffect } from 'react';
import { ColorShade, ColorPalette, NeutralShades, ColorRole } from '@/types/color';
import { generateShades, generateNeutralShades, hexToRgb } from '@/lib/colorUtils';

export function useColorPalette() {
  const [palette, setPalette] = useState<ColorPalette>(() => {
    const saved = localStorage.getItem('color-craft-palette');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          createdAt: new Date(parsed.createdAt),
          updatedAt: new Date(parsed.updatedAt)
        };
      } catch (e) {
        console.error('Failed to parse saved palette', e);
      }
    }
    return {
      id: 'default',
      name: 'My Color System',
      colors: [
        {
          id: 'primary',
          name: 'Primary',
          color: '#6366f1',
          role: 'primary',
          shades: generateShades('#6366f1', 5),
          locked: false
        }
      ],
      neutrals: generateNeutralShades(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
  });

  useEffect(() => {
    localStorage.setItem('color-craft-palette', JSON.stringify(palette));
  }, [palette]);

  const addColor = useCallback((color: string, role: ColorRole = 'custom') => {
    const newColor: ColorShade = {
      id: `color-${Date.now()}`,
      name: role.charAt(0).toUpperCase() + role.slice(1),
      color,
      role,
      shades: generateShades(color, 5),
      locked: false
    };

    setPalette(prev => ({
      ...prev,
      colors: [...prev.colors, newColor],
      updatedAt: new Date()
    }));

    return newColor.id;
  }, []);

  const updateColor = useCallback((id: string, updates: Partial<ColorShade>) => {
    setPalette(prev => ({
      ...prev,
      colors: prev.colors.map(color =>
        color.id === id 
          ? { 
              ...color, 
              ...updates,
              shades: updates.color ? generateShades(updates.color, 5) : color.shades
            }
          : color
      ),
      updatedAt: new Date()
    }));
  }, []);

  const removeColor = useCallback((id: string) => {
    setPalette(prev => ({
      ...prev,
      colors: prev.colors.filter(color => color.id !== id),
      updatedAt: new Date()
    }));
  }, []);

  const updateColorRole = useCallback((id: string, role: ColorRole) => {
    setPalette(prev => ({
      ...prev,
      colors: prev.colors.map(color =>
        color.id === id 
          ? { ...color, role, name: role.charAt(0).toUpperCase() + role.slice(1) }
          : color
      ),
      updatedAt: new Date()
    }));
  }, []);

  const updateColorName = useCallback((id: string, name: string) => {
    setPalette(prev => ({
      ...prev,
      colors: prev.colors.map(color =>
        color.id === id ? { ...color, name } : color
      ),
      updatedAt: new Date()
    }));
  }, []);

  const lockColor = useCallback((id: string, locked: boolean) => {
    setPalette(prev => ({
      ...prev,
      colors: prev.colors.map(color =>
        color.id === id ? { ...color, locked } : color
      ),
      updatedAt: new Date()
    }));
  }, []);

  const regenerateShades = useCallback((id: string, steps: number = 5) => {
    setPalette(prev => ({
      ...prev,
      colors: prev.colors.map(color =>
        color.id === id && !color.locked
          ? { ...color, shades: generateShades(color.color, steps) }
          : color
      ),
      updatedAt: new Date()
    }));
  }, []);

  const updatePaletteName = useCallback((name: string) => {
    setPalette(prev => ({
      ...prev,
      name,
      updatedAt: new Date()
    }));
  }, []);

  const updateNeutrals = useCallback((whiteBase: string, blackBase: string, grayBase: string) => {
    const alphaPercents = [8, 16, 24, 32, 40, 48, 56, 64, 72, 80];
    const toRgba = (hex: string, alpha: number) => {
      const rgb = hexToRgb(hex);
      return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
    };

    const whiteAlphaShades = alphaPercents.map((p) => toRgba(whiteBase, p / 100));
    const blackAlphaShades = alphaPercents.map((p) => toRgba(blackBase, p / 100));
    const grayShades = generateShades(grayBase, 5);

    setPalette(prev => ({
      ...prev,
      neutrals: {
        white: whiteAlphaShades,
        black: blackAlphaShades,
        gray: grayShades
      },
      updatedAt: new Date()
    }));
  }, []);

  return {
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
  };
}