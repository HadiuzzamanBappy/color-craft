// Color types for the design system

export interface ColorShade {
    id: string;
    name: string;
    color: string;
    role: ColorRole;
    shades: string[];
    locked: boolean;
  }
  
  export type ColorRole = 
    | 'primary' 
    | 'secondary' 
    | 'accent' 
    | 'success' 
    | 'warning' 
    | 'error' 
    | 'info' 
    | 'neutral'
    | 'custom';
  
  export interface ColorPalette {
    id: string;
    name: string;
    colors: ColorShade[];
    neutrals: NeutralShades;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface NeutralShades {
    white: string[];
    black: string[];
    gray: string[];
  }
  
  export interface ExportFormat {
    css: string;
    scss: string;
    tailwind: string;
    figma: string;
    json: string;
  }
  
  export const COLOR_ROLE_LABELS: Record<ColorRole, string> = {
    primary: 'Primary',
    secondary: 'Secondary', 
    accent: 'Accent',
    success: 'Success',
    warning: 'Warning',
    error: 'Error',
    info: 'Info',
    neutral: 'Neutral',
    custom: 'Custom'
  };
  
  export const COLOR_ROLE_DESCRIPTIONS: Record<ColorRole, string> = {
    primary: 'Main brand color for primary actions',
    secondary: 'Supporting color for secondary actions',
    accent: 'Highlight color for emphasis',
    success: 'Positive feedback and success states',
    warning: 'Caution and warning messages',
    error: 'Error states and destructive actions',
    info: 'Informational content and neutral actions',
    neutral: 'Text, backgrounds, and neutral elements',
    custom: 'Custom color for specific use cases'
  };