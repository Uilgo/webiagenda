import { ref, computed } from 'vue'
import type { AuthError } from '@supabase/supabase-js'
import type { LoginCredentials, AuthResponse, User } from '../../features/auth/types/auth'

/**
 * Composable para gerenciamento de autenticação usando Supabase
 * Fornece funcionalidades de login e logout com gerenciamento de estado do usuário
 */
export const useAuth = () => {
  // Cliente Supabase e usuário reativo
  const supabase = useSupabaseClient()
  const supabaseUser = useSupabaseUser()
  const router = useRouter()

  // Estados reativos para controle de loading e erros
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed para verificar se o usuário está autenticado
  const isAuthenticated = computed(() => !!supabaseUser.value)

  // Computed para obter dados do usuário de forma segura com tipagem customizada
  const user = computed((): User | null => {
    if (!supabaseUser.value) return null
    
    // Retorna o usuário do Supabase com tipagem customizada
    return supabaseUser.value as User
  })

  // Computed para obter dados do usuário de forma segura (mantido para compatibilidade)
  const currentUser = computed(() => user.value)

  /**
   * Limpa erros de autenticação
   */
  const clearError = () => {
    error.value = null
  }

  /**
   * Realiza o login do usuário
   * @param credentials - Credenciais de login (email, senha, lembrar)
   * @returns Promise com resultado da operação
   */
  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      isLoading.value = true
      error.value = null

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      if (authError) {
        // Tratamento de erros específicos do Supabase
        const errorMessage = getAuthErrorMessage(authError)
        error.value = errorMessage
        
        return {
          success: false,
          error: errorMessage
        }
      }

      if (data.user) {
        // Login bem-sucedido - redireciona para dashboard administrativo
        await router.push('/admin/dashboard')
        
        return {
          success: true,
          user: data.user
        }
      }

      return {
        success: false,
        error: 'Erro inesperado durante o login'
      }

    } catch (err) {
      const errorMessage = 'Erro de conexão. Tente novamente.'
      error.value = errorMessage
      
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Realiza o logout do usuário
   * @returns Promise com resultado da operação
   */
  const logout = async (): Promise<AuthResponse> => {
    try {
      isLoading.value = true
      error.value = null

      const { error: authError } = await supabase.auth.signOut()

      if (authError) {
        const errorMessage = 'Erro ao fazer logout. Tente novamente.'
        error.value = errorMessage
        
        return {
          success: false,
          error: errorMessage
        }
      }

      // Logout bem-sucedido - redireciona para página de autenticação
      await router.push('/auth/section?form=login')
      
      return {
        success: true
      }

    } catch (err) {
      const errorMessage = 'Erro de conexão durante o logout.'
      error.value = errorMessage
      
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Converte erros do Supabase em mensagens amigáveis
   * @param authError - Erro retornado pelo Supabase
   * @returns Mensagem de erro traduzida
   */
  const getAuthErrorMessage = (authError: AuthError): string => {
    switch (authError.message) {
      case 'Invalid login credentials':
        return 'Email ou senha incorretos'
      case 'Email not confirmed':
        return 'Email não confirmado. Verifique sua caixa de entrada.'
      case 'Unable to validate email address: invalid format':
        return 'Formato de email inválido'
      default:
        return authError.message || 'Erro de autenticação'
    }
  }

  // Retorna todas as funcionalidades e estados do composable
  return {
    // Estados reativos
    user,
    isAuthenticated,
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Métodos de autenticação
    login,
    logout,

    // Utilitários
    clearError
  }
}