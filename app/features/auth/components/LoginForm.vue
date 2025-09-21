<template>
  <Card
    title="Entrar na sua conta"
    subtitle="Digite suas credenciais para acessar o sistema"
    size="md"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Campo de Email -->
      <Input
        v-model="form.email"
        type="email"
        label="E-mail"
        placeholder="Digite seu e-mail"
        :error-message="shouldShowErrors ? errors.email : undefined"
        :disabled="isFormLoading"
        required
        autocomplete="email"
        @blur="handleFieldBlur('email')"
      />

      <!-- Campo de Senha -->
      <Input
        v-model="form.password"
        type="password"
        label="Senha"
        placeholder="Digite sua senha"
        :error-message="shouldShowErrors ? errors.password : undefined"
        :disabled="isFormLoading"
        required
        autocomplete="current-password"
        :show-password-toggle="true"
        @blur="handleFieldBlur('password')"
      />

      <!-- Opções adicionais -->
      <div class="flex items-center justify-between">
        <label class="flex items-center">
          <input
            id="remember-me"
            name="rememberMe"
            v-model="form.rememberMe"
            type="checkbox"
            class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            :disabled="isFormLoading"
          />
          <span class="ml-2 text-sm text-muted-foreground">Lembrar de mim</span>
        </label>

        <button
          type="button"
          class="text-sm text-primary hover:text-primary-600 focus:outline-none focus:underline"
          @click="$emit('forgot-password')"
          :disabled="isFormLoading"
        >
          Esqueceu a senha?
        </button>
      </div>

      <!-- Mensagem de erro geral -->
      <div v-if="generalError" class="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
        <p class="text-sm text-destructive">{{ generalError }}</p>
      </div>

      <!-- Botão de Submit -->
      <Button
        type="submit"
        variant="primary"
        size="md"
        :loading="isFormLoading"
        :disabled="!isFormValid || isFormLoading"
        full-width
      >
        {{ isFormLoading ? 'Entrando...' : 'Entrar' }}
      </Button>

      <!-- Link para cadastro -->
      <div class="text-center">
        <p class="text-sm text-muted-foreground">
          Não tem uma conta?
          <button
            type="button"
            class="text-primary hover:text-primary-600 focus:outline-none focus:underline font-medium"
            @click="$emit('switch-to-signup')"
            :disabled="isFormLoading"
          >
            Cadastre-se aqui
          </button>
        </p>
      </div>
    </form>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { useAuth } from '../../../composables/core/useAuth'
import Card from '../../../components/ui/Card.vue'
import Input from '../../../components/ui/Input.vue'
import Button from '../../../components/ui/Button.vue'

// Interface para o formulário de login
interface LoginForm {
  email: string
  password: string
  rememberMe: boolean
}

// Interface para os erros de validação
interface LoginErrors {
  email?: string
  password?: string
}

// Props do componente
interface LoginFormProps {
  loading?: boolean
  generalError?: string
}

const props = withDefaults(defineProps<LoginFormProps>(), {
  loading: false,
  generalError: ''
})

// Emits do componente
const emit = defineEmits<{
  submit: [data: LoginForm]
  'forgot-password': []
  'switch-to-signup': []
}>()

// Composable de autenticação
const { login, isLoading, error: authError, clearError } = useAuth()

// Estado reativo do formulário
const form = reactive<LoginForm>({
  email: '',
  password: '',
  rememberMe: false
})

// Estado dos erros de validação
const errors = ref<LoginErrors>({})

// Estado para controlar quando mostrar erros
const hasUserInteracted = ref(false)
const touchedFields = ref<Set<string>>(new Set())

// Computed para determinar se deve mostrar erros
const shouldShowErrors = computed(() => {
  return hasUserInteracted.value || touchedFields.value.size > 0
})

// Computed para verificar se está carregando (props ou composable)
const isFormLoading = computed(() => {
  return props.loading || isLoading.value
})

// Computed para erro geral (props ou composable)
const generalError = computed(() => {
  return props.generalError || authError.value
})

// Função de validação do email
const validateEmail = (email: string): string | undefined => {
  if (!email) {
    return 'E-mail é obrigatório'
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return 'Digite um e-mail válido'
  }
  
  return undefined
}

// Função de validação da senha
const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return 'Senha é obrigatória'
  }
  
  if (password.length < 6) {
    return 'Senha deve ter pelo menos 6 caracteres'
  }
  
  return undefined
}

// Validação em tempo real
const validateForm = (): void => {
  errors.value = {
    email: validateEmail(form.email),
    password: validatePassword(form.password)
  }
}

// Computed para verificar se o formulário é válido
const isFormValid = computed(() => {
  validateForm()
  return !errors.value.email && !errors.value.password && form.email && form.password
})

// Handler do submit do formulário
const handleSubmit = async (): Promise<void> => {
  hasUserInteracted.value = true
  validateForm()
  
  if (isFormValid.value) {
    // Limpa erros anteriores
    clearError()
    
    // Executa o login usando o composable
    const result = await login({
      email: form.email,
      password: form.password,
      rememberMe: form.rememberMe
    })
    
    // Se o login falhou, o erro já está sendo exibido pelo composable
    // Se teve sucesso, o redirecionamento já foi feito pelo composable
    
    // Emite o evento para compatibilidade com componentes pais (se necessário)
    emit('submit', { ...form })
  }
}

// Handler para quando o usuário sai de um campo (blur)
const handleFieldBlur = (fieldName: string): void => {
  touchedFields.value.add(fieldName)
}

// Limpar erros quando o usuário começar a digitar
watch(() => form.email, () => {
  if (errors.value.email) {
    errors.value.email = undefined
  }
})

watch(() => form.password, () => {
  if (errors.value.password) {
    errors.value.password = undefined
  }
})

// Método para resetar o formulário (exposto para uso externo)
const resetForm = (): void => {
  form.email = ''
  form.password = ''
  form.rememberMe = false
  errors.value = {}
  hasUserInteracted.value = false
  touchedFields.value.clear()
}

// Expor métodos para uso externo
defineExpose({
  resetForm
})
</script>