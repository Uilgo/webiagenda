import type { User } from '@supabase/supabase-js'

/**
 * Interface para dados de login
 */
export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

/**
 * Interface para resposta de autenticação
 */
export interface AuthResponse {
  success: boolean
  error?: string
  user?: User | null
}