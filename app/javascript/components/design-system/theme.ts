// Système de design moderne pour l'administration
export const modernTheme = {
  colors: {
    // Couleurs principales
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe', 
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      900: '#0c4a6e'
    },
    // Couleurs sémantiques pour les rôles
    roles: {
      admin: '#f59e0b', // Amber
      member: '#10b981', // Emerald  
      invited: '#6b7280', // Gray
      pending: '#f97316' // Orange
    },
    // Couleurs d'actions
    actions: {
      edit: '#3b82f6', // Blue
      delete: '#ef4444', // Red
      accept: '#10b981', // Green
      reject: '#ef4444' // Red
    },
    // Couleurs de fond
    background: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
      card: '#ffffff',
      hover: '#f8fafc'
    },
    // Couleurs de texte
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
      tertiary: '#94a3b8'
    },
    // Couleurs de bordure
    border: {
      light: '#e2e8f0',
      medium: '#cbd5e1',
      dark: '#94a3b8'
    }
  },
  
  // Espacements cohérents
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem',  // 8px
    md: '1rem',    // 16px
    lg: '1.5rem',  // 24px
    xl: '2rem',    // 32px
    '2xl': '3rem', // 48px
    '3xl': '4rem'  // 64px
  },
  
  // Rayons de bordure
  borderRadius: {
    sm: '0.375rem', // 6px
    md: '0.5rem',   // 8px
    lg: '0.75rem',  // 12px
    xl: '1rem'      // 16px
  },
  
  // Ombres
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
  },
  
  // Typographie
  typography: {
    h1: {
      fontSize: '2.25rem', // 36px
      fontWeight: '700',
      lineHeight: '2.5rem'
    },
    h2: {
      fontSize: '1.875rem', // 30px
      fontWeight: '600', 
      lineHeight: '2.25rem'
    },
    h3: {
      fontSize: '1.5rem', // 24px
      fontWeight: '600',
      lineHeight: '2rem'
    },
    h4: {
      fontSize: '1.25rem', // 20px
      fontWeight: '500',
      lineHeight: '1.75rem'
    },
    body: {
      fontSize: '1rem', // 16px
      fontWeight: '400',
      lineHeight: '1.5rem'
    },
    caption: {
      fontSize: '0.875rem', // 14px
      fontWeight: '400',
      lineHeight: '1.25rem'
    }
  }
} as const;

export type ModernTheme = typeof modernTheme;
