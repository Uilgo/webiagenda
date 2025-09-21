<template>
  <div class="min-h-screen bg-background flex">
    <!-- ThemeToggle no canto superior direito -->
    <div class="absolute top-4 right-4 z-10">
      <ThemeToggle variant="ghost" size="md" />
    </div>

    <!-- Coluna Esquerda - Informações do Sistema -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-50 via-slate-100/50 to-primary/10 dark:from-slate-900 dark:via-slate-800/80 dark:to-primary/20 relative overflow-hidden">
      
      <div class="relative z-10 flex flex-col justify-center px-12 py-16">
        <!-- Logo/Título do Sistema -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-foreground mb-4">
            WebiAgenda
          </h1>
          <p class="text-xl text-muted-foreground">
            Sua plataforma completa de agendamento
          </p>
        </div>

        <!-- Recursos do Sistema -->
        <div class="space-y-6">
          <div class="flex items-start space-x-4">
            <div class="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center dark:bg-primary/20">
              <CalendarIcon class="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 class="font-semibold text-foreground mb-1">
                Agendamento Inteligente
              </h3>
              <p class="text-sm text-muted-foreground">
                Gerencie seus compromissos de forma eficiente e organizada
              </p>
            </div>
          </div>

          <div class="flex items-start space-x-4">
            <div class="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center dark:bg-primary/20">
              <UsersIcon class="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 class="font-semibold text-foreground mb-1">
                Gestão de Clientes
              </h3>
              <p class="text-sm text-muted-foreground">
                Mantenha um cadastro completo e histórico de seus clientes
              </p>
            </div>
          </div>

          <div class="flex items-start space-x-4">
            <div class="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center dark:bg-primary/20">
              <ChartBarIcon class="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 class="font-semibold text-foreground mb-1">
                Relatórios Detalhados
              </h3>
              <p class="text-sm text-muted-foreground">
                Acompanhe o desempenho do seu negócio com relatórios completos
              </p>
            </div>
          </div>

          <div class="flex items-start space-x-4">
            <div class="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center dark:bg-primary/20">
              <BellIcon class="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 class="font-semibold text-foreground mb-1">
                Notificações Automáticas
              </h3>
              <p class="text-sm text-muted-foreground">
                Lembre seus clientes automaticamente sobre os agendamentos
              </p>
            </div>
          </div>
        </div>

        <!-- Depoimento -->
        <div class="mt-12 p-6 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 dark:bg-slate-800/60 dark:border-slate-700/50">
          <blockquote class="text-sm text-muted-foreground italic mb-3">
            "O WebAgenda revolucionou a forma como gerencio meus agendamentos. 
            Agora tenho mais tempo para focar no que realmente importa: meus clientes."
          </blockquote>
          <cite class="text-xs font-medium text-foreground">
            — Maria Silva, Proprietária de Salão de Beleza
          </cite>
        </div>
      </div>
    </div>

    <!-- Coluna Direita - Formulários -->
    <div class="flex-1 lg:w-1/2 flex items-center justify-center p-8 bg-card">
      <div class="w-full max-w-md space-y-6">
        <!-- Cabeçalho Mobile (visível apenas em telas pequenas) -->
        <div class="lg:hidden text-center mb-8">
          <h1 class="text-2xl font-bold text-foreground mb-2">
            WebAgenda
          </h1>
          <p class="text-sm text-muted-foreground">
            Sua plataforma de agendamento
          </p>
        </div>

        <!-- Formulários Dinâmicos -->
        <div class="space-y-6">
          <Transition name="form-transition" mode="out-in">
            <!-- Formulário de Login -->
            <div v-if="currentForm === 'login'" key="login">
              <LoginForm 
                @submit="handleLogin"
                @switch-to-signup="switchToForm('signup')"
                @forgot-password="switchToForm('forgot-password')"
              />
            </div>

            <!-- Formulário de Cadastro -->
            <div v-else-if="currentForm === 'signup'" key="signup">
              <SignupForm 
                @submit="handleSignup"
                @switch-to-login="switchToForm('login')"
              />
            </div>

            <!-- Formulário de Esqueceu Senha -->
            <div v-else-if="currentForm === 'forgot-password'" key="forgot-password">
              <ForgotForm 
                @submit="handleForgotPassword"
                @back-to-login="switchToForm('login')"
              />
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import {
  CalendarIcon,
  UsersIcon,
  ChartBarIcon,
  BellIcon
} from '@heroicons/vue/24/outline'

// Importação dos composables
import { useAuth } from '../../composables/core/useAuth'
import { useRouter, useRoute } from '#app'

// Importação dos componentes
import ThemeToggle from '../../components/ui/ThemeToggle.vue'
import LoginForm from './components/LoginForm.vue'
import SignupForm from './components/SignupForm.vue'
import ForgotForm from './components/ForgotForm.vue'

// Tipos para os formulários
type AuthFormType = 'login' | 'signup' | 'forgot-password'

// Interfaces para os dados dos formulários
interface LoginData {
  email: string
  password: string
  rememberMe: boolean
}

interface SignupData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

interface ForgotPasswordData {
  email: string
}

// Composables do Vue Router
const route = useRoute()
const router = useRouter()

// Composable de autenticação
const { isAuthenticated } = useAuth()

// Estado reativo do formulário atual
const currentForm = ref<AuthFormType>('login')

// Flag para controlar initial load e evitar loops
const isInitialLoad = ref(true)

// Valid forms para fallback
const validForms = ['login', 'signup', 'forgot-password'] as const

// Função para alternar entre formulários
const switchToForm = async (formType: AuthFormType) => {
  // Só atualiza se for diferente do formulário atual
  if (currentForm.value === formType) {
    return
  }
  
  currentForm.value = formType
  
  // Atualiza a URL usando query parameters apenas se necessário
  const targetQuery = { form: formType }
  if (route.query.form !== formType) {
    await router.push({ path: '/auth/section', query: targetQuery })
  }
}

// Observa mudanças na query da rota para sincronizar o formulário
watch(
  () => route.query.form,
  (newForm) => {
    if (newForm && ['login', 'signup', 'forgot-password'].includes(newForm as string)) {
      // Só atualiza se for diferente do formulário atual para evitar loops
      if (currentForm.value !== newForm) {
        currentForm.value = newForm as AuthFormType
      }
    } else if (!newForm && route.path === '/auth/section') {
      // Se não há query form e estamos na rota /auth/section, redireciona para /auth/section?form=login
      console.log('🔄 Redirecionando para /auth/section?form=login')
      if (currentForm.value !== 'login') {
        router.replace('/auth/section?form=login')
      }
    }
  },
  { immediate: true }
)

// Inicialização do formulário baseado na query da rota
onMounted(() => {
  const formParam = route.query.form as string
  
  if (formParam && ['login', 'signup', 'forgot-password'].includes(formParam)) {
    currentForm.value = formParam as AuthFormType
  } else {
    // Se não há query form válida, redireciona para /auth/section?form=login
    router.replace('/auth/section?form=login')
  }
  
  isInitialLoad.value = false
})

// Observa mudanças no estado de autenticação para redirecionar quando necessário
watch(isAuthenticated, (authenticated) => {
  if (authenticated && route.path.startsWith('/auth')) {
    // Usuário autenticado - redireciona para página inicial apenas se em página de auth
    // Adiciona guard para evitar múltiplos pushes durante flow
    if (!isInitialLoad.value) {
      router.push('/')
    }
  }
}, { immediate: false }) // immediate: false para evitar execução na inicialização

// Handlers para os formulários
const handleLogin = async (data: LoginData) => {
  // O LoginForm agora gerencia o login diretamente através do composable useAuth
  // Este handler é mantido para compatibilidade, mas a lógica real está no LoginForm
  console.log('Login iniciado via AuthPage:', data)
}

const handleSignup = async (data: SignupData) => {
  try {
    console.log('Signup data:', data)
    // TODO: Implementar lógica de cadastro
    // await authStore.signup(data)
    // router.push('/dashboard')
  } catch (error) {
    console.error('Erro no cadastro:', error)
    // TODO: Mostrar toast de erro
  }
}

const handleForgotPassword = async (data: ForgotPasswordData) => {
  try {
    console.log('Forgot password data:', data)
    // TODO: Implementar lógica de recuperação de senha
    // await authStore.forgotPassword(data)
    // Mostrar mensagem de sucesso
  } catch (error) {
    console.error('Erro na recuperação de senha:', error)
    // TODO: Mostrar toast de erro
  }
}
</script>

<style scoped>
/* Padrão de grade para o fundo decorativo */
.bg-grid-pattern {
  background-image: 
    linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}

/* Animações suaves para transições entre formulários */
.form-transition-enter-active,
.form-transition-leave-active {
  transition: all 0.3s ease-in-out;
}

.form-transition-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.form-transition-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Melhoria de performance para animações */
.form-transition-enter-active,
.form-transition-leave-active {
  will-change: opacity, transform;
}
</style>