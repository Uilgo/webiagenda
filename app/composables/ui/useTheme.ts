// Composable simplificado para gerenciamento de tema server-side
import type { GlobalTheme, GlobalThemeOption } from '#shared/types/global'

// Re-exporta os tipos para compatibilidade
export type Theme = GlobalTheme
export type ThemeOption = GlobalThemeOption

export const useTheme = () => {
  // Estado reativo do tema atual - simplificado para server-side
  const theme = useState<'light' | 'dark'>('theme', () => {
    if (import.meta.server) {
      // No servidor, usa o valor do estado server-theme se disponível
      const serverTheme = useState<'light' | 'dark'>('server-theme')
      return serverTheme.value || 'light'
    }
    
    // No cliente, tenta obter do cookie primeiro
    if (import.meta.client) {
      const cookies = document.cookie.split(';')
      const themeCookie = cookies.find(c => c.trim().startsWith('theme='))
      if (themeCookie) {
        const value = themeCookie.split('=')[1]
        if (value && ['light', 'dark'].includes(value)) {
          return value as 'light' | 'dark'
        }
      }
    }
    
    return 'light'
  })

  // Função simplificada para definir um novo tema
  const setTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme

    if (import.meta.client) {
      // Atualiza cookie para sincronizar com servidor
      document.cookie = `theme=${newTheme}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
      
      // Aplica o tema ao documento de forma simples
      const root = document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(newTheme)
      root.setAttribute('data-theme', newTheme)
      
      // Atualiza meta theme-color
      let metaThemeColor = document.querySelector('meta[name="theme-color"]')
      if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta')
        metaThemeColor.setAttribute('name', 'theme-color')
        document.head.appendChild(metaThemeColor)
      }
      metaThemeColor.setAttribute('content', newTheme === 'dark' ? '#0f172a' : '#ffffff')
    }
  }

  // Função para alternar entre light e dark
  const toggleTheme = () => {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  // Opções disponíveis de tema (removido 'system' para simplificar)
  const availableThemes: Array<{ value: 'light' | 'dark', label: string, icon: string }> = [
    { value: 'light', label: 'Claro', icon: 'SunIcon' },
    { value: 'dark', label: 'Escuro', icon: 'MoonIcon' }
  ]

  return {
    theme: readonly(theme),
    availableThemes,
    setTheme,
    toggleTheme
  }
}