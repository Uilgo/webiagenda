// Plugin do cliente para aplicar tema e evitar FOUC
export default defineNuxtPlugin({
  name: 'theme-client',
  setup() {
    // Só executa no cliente
    if (!import.meta.client) return

    // Função para aplicar o tema no DOM
    const applyThemeToDOM = (theme: 'light' | 'dark') => {
      const root = document.documentElement
      
      // Remove classes anteriores e aplica a nova
      root.classList.remove('light', 'dark')
      root.classList.add(theme)
      root.setAttribute('data-theme', theme)
      
      // Atualiza color-scheme para melhor suporte nativo
      root.style.colorScheme = theme
      
      // Atualiza meta theme-color
      let metaThemeColor = document.querySelector('meta[name="theme-color"]')
      if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta')
        metaThemeColor.setAttribute('name', 'theme-color')
        document.head.appendChild(metaThemeColor)
      }
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0f172a' : '#ffffff')
    }

    // Função para detectar o tema inicial
    const getInitialTheme = (): 'light' | 'dark' => {
      // 1. Verifica cookie primeiro
      const cookies = document.cookie.split(';')
      const themeCookie = cookies.find(c => c.trim().startsWith('theme='))
      if (themeCookie) {
        const value = themeCookie.split('=')[1]
        if (value && ['light', 'dark'].includes(value)) {
          return value as 'light' | 'dark'
        }
      }

      // 2. Verifica localStorage como fallback
      try {
        const stored = localStorage.getItem('theme')
        if (stored && ['light', 'dark'].includes(stored)) {
          return stored as 'light' | 'dark'
        }
      } catch (error) {
        console.warn('Erro ao acessar localStorage:', error)
      }

      // 3. Usa preferência do sistema como último recurso
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark'
      }

      return 'light'
    }

    // Aplica o tema imediatamente para evitar FOUC
    const initialTheme = getInitialTheme()
    applyThemeToDOM(initialTheme)

    // Sincroniza com o estado do Nuxt
    const themeState = useState<'light' | 'dark'>('theme')
    if (!themeState.value) {
      themeState.value = initialTheme
    }

    // Escuta mudanças na preferência do sistema
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      
      const handleSystemThemeChange = (e: MediaQueryListEvent) => {
        // Só aplica se não houver preferência salva
        const cookies = document.cookie.split(';')
        const hasThemeCookie = cookies.some(c => c.trim().startsWith('theme='))
        
        if (!hasThemeCookie) {
          const systemTheme = e.matches ? 'dark' : 'light'
          applyThemeToDOM(systemTheme)
          themeState.value = systemTheme
        }
      }

      // Adiciona listener para mudanças
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleSystemThemeChange)
      } else {
        // Fallback para navegadores mais antigos
        mediaQuery.addListener(handleSystemThemeChange)
      }
    }

    // Observa mudanças no estado do tema
    watch(() => themeState.value, (newTheme) => {
      if (newTheme && ['light', 'dark'].includes(newTheme)) {
        applyThemeToDOM(newTheme)
        
        // Salva no cookie para sincronizar com o servidor
        document.cookie = `theme=${newTheme}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
        
        // Salva no localStorage como backup
        try {
          localStorage.setItem('theme', newTheme)
        } catch (error) {
          console.warn('Erro ao salvar tema no localStorage:', error)
        }
      }
    }, { immediate: true })

    // Marca que o tema está pronto
    window.__NUXT_THEME_READY__ = true
  }
})