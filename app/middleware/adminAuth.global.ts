import { useAuth } from '~/composables/core/useAuth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Protege apenas a rota /admin/admin
  if (to.path !== '/admin/admin') {
    return
  }

  const auth = useAuth()
  
  if (!auth.isAuthenticated.value) {
    return navigateTo('/auth/login')
  }

  const isAdminUser = await auth.isAdmin()
  
  if (!isAdminUser) {
    return navigateTo('/admin')
  }
  
  // Se for admin, permite o acesso
})