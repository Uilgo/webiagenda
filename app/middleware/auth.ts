// Middleware de autenticação para proteger rotas administrativas
// Usa Supabase para verificar se há um usuário autenticado
export default defineNuxtRouteMiddleware((to, from) => {
  // Obtém usuário atual do Supabase de forma reativa
  const supabaseUser = useSupabaseUser()

  // Se não houver usuário, redireciona para a página de login
  if (!supabaseUser.value) {
    // Mantém a query padrão para abrir a aba de login
    return navigateTo('/auth/login?form=login')
  }

  // Caso autenticado, permite seguir normalmente
  return
})