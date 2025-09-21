<template>
  <!-- Página de redirecionamento - não exibe conteúdo visual -->
</template>

<script setup lang="ts">
// Composables necessários
import { useAuth } from '~/composables/core/useAuth'

const { user } = useAuth()
const router = useRouter()

// Configuração da página
definePageMeta({
  layout: false // Remove layout para redirecionamento mais rápido
})

// Lógica de redirecionamento baseada no status de autenticação
onMounted(async () => {
  // Aguarda um tick para garantir que o estado de autenticação foi carregado
  await nextTick()
  
  if (user.value) {
    // Usuário autenticado - redireciona para admin
    await router.push('/admin')
  } else {
    // Usuário não autenticado - redireciona para login
    await router.push('/auth/section?form=login')
  }
})

// Observa mudanças no estado de autenticação para redirecionamento dinâmico
watch(user, async (newUser) => {
  if (newUser) {
    // Usuário fez login - redireciona para admin
    await router.push('/admin')
  } else {
    // Usuário fez logout - redireciona para login
    await router.push('/auth/section?form=login')
  }
}, { immediate: false })
</script>