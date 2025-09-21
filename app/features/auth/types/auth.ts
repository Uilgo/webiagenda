import type { User as SupabaseUser } from '@supabase/supabase-js'

/**
 * Interface customizada para User que estende o tipo do Supabase
 * com propriedades adicionais necessárias para a aplicação
 */
export interface User extends SupabaseUser {
  name?: string
  avatar_url?: string
}

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