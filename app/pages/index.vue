<script setup lang="ts">
// Configuração da página - deve estar no topo
definePageMeta({
  layout: 'admin'
})

// Composables necessários
import { useAuth } from '~/composables/core/useAuth'

const { user } = useAuth()
const router = useRouter()

// Lógica de redirecionamento baseada no status de autenticação
onMounted(async () => {
  // Aguarda um tick para garantir que o estado de autenticação foi carregado
  await nextTick()
  
  if (user.value) {
    // Usuário autenticado - redireciona para dashboard administrativo
    await router.push('/admin/dashboard')
  } else {
    // Usuário não autenticado - redireciona para login
    await router.push('/auth/section?form=login')
  }
})

// Observa mudanças no estado de autenticação para redirecionamento dinâmico
watch(user, async (newUser) => {
  if (newUser) {
    // Usuário fez login - redireciona para dashboard administrativo
    await router.push('/admin/dashboard')
  } else {
    // Usuário fez logout - redireciona para login
    await router.push('/auth/section?form=login')
  }
}, { immediate: false })
</script>

<template>
  <NuxtLayout>
    <!-- Página de redirecionamento - exibe loading durante redirecionamento -->
    <div class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-2 text-muted-foreground">Carregando...</p>
      </div>
    </div>
  </NuxtLayout>
</template>