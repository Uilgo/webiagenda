// Plugin do servidor para aplicar tema de forma simples e eficiente
import { getCookie } from 'h3'
import type { GlobalTheme } from '#shared/types/global'

export default defineNuxtPlugin({
  name: 'theme-server',
  setup() {
    // Só executa no servidor
    if (!import.meta.server) return

    // Obtém o tema do cookie com fallback para 'light'
    const getServerTheme = (): 'light' | 'dark' => {
      try {
        const event = useRequestEvent()
        if (!event) return 'light'

        // Tenta obter do cookie
        const themeCookie = getCookie(event, 'theme') as GlobalTheme
        
        // Se for 'system' ou inválido, usa 'light' como padrão
        if (!themeCookie || !['light', 'dark'].includes(themeCookie)) {
          return 'light'
        }
        
        return themeCookie as 'light' | 'dark'
      } catch (error) {
        console.warn('Erro ao detectar tema no servidor:', error)
        return 'light'
      }
    }

    // Aplica o tema no HTML do servidor de forma simples
    const applyServerTheme = (theme: 'light' | 'dark') => {
      try {
        // Aplica classes e atributos no HTML inicial
        useHead({
          htmlAttrs: {
            class: theme,
            'data-theme': theme
          }
        })
        
        // Adiciona meta theme-color
        useHead({
          meta: [
            {
              name: 'theme-color',
              content: theme === 'dark' ? '#0f172a' : '#ffffff'
            }
          ]
        })
        
        // CSS crítico para evitar FOUC
        useHead({
          style: [
            {
              innerHTML: `
                html { 
                  color-scheme: ${theme};
                }
                html.light {
                  --bg-color: #ffffff;
                  --text-color: #000000;
                }
                html.dark {
                  --bg-color: #0f172a;
                  --text-color: #ffffff;
                }
              `,
              tagPriority: 'critical'
            }
          ]
        })
      } catch (error) {
        console.warn('Erro ao aplicar tema no servidor:', error)
      }
    }

    try {
      // Detecta e aplica o tema
      const serverTheme = getServerTheme()
      applyServerTheme(serverTheme)

      // Disponibiliza o tema para o cliente se necessário
      useState<'light' | 'dark'>('server-theme', () => serverTheme)
    } catch (error) {
      console.warn('Erro no plugin de tema do servidor:', error)
      // Define tema padrão em caso de erro
      useState<'light' | 'dark'>('server-theme', () => 'light')
    }
  }
})