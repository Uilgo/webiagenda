import { serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '../../shared/types/database'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password, nome, role = 'user' } = body

    if (!email || !password || !nome) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email, password e nome são obrigatórios'
      })
    }

    const supabase = serverSupabaseServiceRole<Database>(event)

    // Criar usuário no Supabase Auth usando admin
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
    })

    if (userError) {
      throw createError({
        statusCode: 400,
        statusMessage: userError.message
      })
    }

    // Inserir perfil na tabela profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: userData.user.id,
        nome,
        email,
        role
      } as any)

    if (profileError) {
      // Opcionalmente, deletar o usuário criado em caso de erro no perfil
      await supabase.auth.admin.deleteUser(userData.user.id)
      throw createError({
        statusCode: 500,
        statusMessage: profileError.message
      })
    }

    return {
      success: true,
      userId: userData.user.id
    }
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message || 'Erro interno do servidor'
    }
  }
})