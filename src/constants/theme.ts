import { Platform } from 'react-native';

// System-adjacent semantic colors. Decorative tints stay quiet so the link is the focus.
export const palette = {
  blue: '#007AFF', blueSoft: '#EAF2FF', lavender: '#F3EEFA', blush: '#FCEDEE',
  sand: '#F7F2E8', green: '#248A3D', success: '#248A3D', danger: '#D70015',
} as const;

export const light = {
  canvas: '#F2F2F7', surface: '#FFFFFF', surfaceMuted: '#F2F2F7', ink: '#000000',
  muted: '#6C6C70', border: '#D1D1D6', tab: '#FAFAFC', tabText: '#000000',
} as const;
export const dark = {
  canvas: '#000000', surface: '#1C1C1E', surfaceMuted: '#2C2C2E', ink: '#FFFFFF',
  muted: '#98989D', border: '#38383A', tab: '#1C1C1E', tabText: '#FFFFFF',
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28 } as const;
export const radius = { sm: 10, md: 12, lg: 16, xl: 20, pill: 999 } as const;
export const fonts = { mono: Platform.select({ ios: 'ui-monospace', default: 'monospace' }) };
