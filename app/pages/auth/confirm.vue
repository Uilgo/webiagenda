<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
          Confirmando login...
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Aguarde enquanto processamos sua autenticação
        </p>
      </div>
      
      <!-- Loading spinner -->
      <div class="flex justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
      
      <!-- Mensagem de erro se houver -->
      <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
              Erro na confirmação
            </h3>
            <div class="mt-2 text-sm text-red-700 dark:text-red-300">
              {{ error }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Metadados da página
definePageMeta({
  layout: false,
  title: 'Confirmando Login - WebiAgenda'
})

// Composables do Nuxt e Supabase
const user = useSupabaseUser()
const router = useRouter()
const route = useRoute()

// Estado reativo para controle de erro
const error = ref<string | null>(null)

/**
 * Observa mudanças no usuário autenticado
 * Quando o usuário é confirmado, redireciona para a página apropriada
 */
watch(user, async (newUser) => {
  if (newUser) {
    try {
      // Usuário autenticado com sucesso
      console.log('Usuário confirmado:', newUser.email)
      
      // Redireciona para a página inicial ou página salva no cookie
      await router.push('/')
    } catch (err) {
      console.error('Erro ao redirecionar após confirmação:', err)
      error.value = 'Erro ao redirecionar. Tente acessar a página inicial manualmente.'
    }
  }
}, { immediate: true })

/**
 * Verifica se há erros na URL (parâmetros de query)
 * O Supabase pode retornar erros via query parameters
 */
onMounted(() => {
  // Verifica se há erro nos parâmetros da URL
  const errorParam = route.query.error
  const errorDescription = route.query.error_description
  
  if (errorParam) {
    error.value = errorDescription as string || 'Erro durante a confirmação do login'
    console.error('Erro na confirmação:', errorParam, errorDescription)
  }
  
  // Se não há usuário após 10 segundos, mostra erro
  setTimeout(() => {
    if (!user.value && !error.value) {
      error.value = 'Tempo limite excedido. Tente fazer login novamente.'
    }
  }, 10000)
})
</script>