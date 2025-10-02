import { serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '../../shared/types/database'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const userId = query.user_id as string

    if (!userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'user_id é obrigatório'
      })
    }

    const supabase = serverSupabaseServiceRole<Database>(event)

    // Deletar perfil da tabela profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('user_id', userId)

    if (profileError) {
      console.error('Erro ao deletar perfil:', profileError)
      // Prosseguir com a deleção do usuário mesmo se o perfil não existir
    }

    // Deletar usuário do Supabase Auth
    const { error: authError } = await supabase.auth.admin.deleteUser(userId)

    if (authError) {
      throw createError({
        statusCode: 400,
        statusMessage: authError.message
      })
    }

    return {
      success: true,
      message: 'Usuário deletado com sucesso'
    }
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message || 'Erro interno do servidor'
    }
  }
})