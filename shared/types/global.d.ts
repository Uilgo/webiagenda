// Declarações de tipos globais para o projeto

// Tipos para o sistema de temas
export type Theme = 'light' | 'dark' | 'system'

export interface ThemeOption {
  value: Theme
  label: string
  icon: string
}

// Tipos para o sistema de toast
export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'default'

// Tipos globais disponíveis em toda a aplicação
export type GlobalTheme = Theme
export type GlobalThemeOption = ThemeOption
export type GlobalToastType = ToastType

declare global {
  interface Window {
    // Flag para indicar que o tema system precisa ser resolvido no cliente
    __NUXT_THEME_SYSTEM__?: boolean
    // Flag para indicar que o tema está pronto após hidratação
    __NUXT_THEME_READY__?: boolean
  }
  
  // Torna os tipos disponíveis globalmente
  type GlobalTheme = import('./global').GlobalTheme
  type GlobalThemeOption = import('./global').GlobalThemeOption
  type GlobalToastType = import('./global').GlobalToastType
}