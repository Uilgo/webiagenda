<template>
  <Card
    title="Criar nova conta"
    subtitle="Preencha os dados abaixo para criar sua conta"
    size="md"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Campo de Nome -->
      <Input
        v-model="form.name"
        type="text"
        label="Nome completo"
        placeholder="Digite seu nome completo"
        :error-message="shouldShowErrors ? errors.name : undefined"
        :disabled="loading"
        required
        autocomplete="name"
        @blur="handleFieldBlur('name')"
      />

      <!-- Campo de Email -->
      <Input
        v-model="form.email"
        type="email"
        label="E-mail"
        placeholder="Digite seu e-mail"
        :error-message="shouldShowErrors ? errors.email : undefined"
        :disabled="loading"
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
        :disabled="loading"
        required
        autocomplete="new-password"
        :show-password-toggle="true"
        help-text="Mínimo de 8 caracteres, incluindo letras e números"
        @blur="handleFieldBlur('password')"
      />

      <!-- Campo de Confirmação de Senha -->
      <Input
        v-model="form.confirmPassword"
        type="password"
        label="Confirmar senha"
        placeholder="Digite novamente sua senha"
        :error-message="shouldShowErrors ? errors.confirmPassword : undefined"
        :disabled="loading"
        required
        autocomplete="new-password"
        :show-password-toggle="true"
        @blur="handleFieldBlur('confirmPassword')"
      />

      <!-- Mensagem de erro geral -->
      <div v-if="generalError" class="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
        <p class="text-sm text-destructive">{{ generalError }}</p>
      </div>

      <!-- Botão de Submit -->
      <Button
        type="submit"
        variant="primary"
        size="md"
        :loading="loading"
        :disabled="!isFormValid || loading"
        full-width
      >
        {{ loading ? 'Criando conta...' : 'Criar conta' }}
      </Button>

      <!-- Link para login -->
      <div class="text-center">
        <p class="text-sm text-muted-foreground">
          Já tem uma conta?
          <button
            type="button"
            class="text-primary hover:text-primary-600 focus:outline-none focus:underline font-medium"
            @click="$emit('switch-to-login')"
            :disabled="loading"
          >
            Faça login aqui
          </button>
        </p>
      </div>
    </form>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import Card from '../../../components/ui/Card.vue'
import Input from '../../../components/ui/Input.vue'
import Button from '../../../components/ui/Button.vue'

// Interface para o formulário de cadastro
interface SignupForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

// Interface para os erros de validação
interface SignupErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

// Props do componente
interface SignupFormProps {
  loading?: boolean
  generalError?: string
}

const props = withDefaults(defineProps<SignupFormProps>(), {
  loading: false,
  generalError: ''
})

// Emits do componente
const emit = defineEmits<{
  submit: [data: SignupForm]
  'switch-to-login': []
}>()

// Estado reativo do formulário
const form = reactive<SignupForm>({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// Estado dos erros de validação
const errors = ref<SignupErrors>({})

// Estado para controlar quando mostrar erros
const hasUserInteracted = ref(false)
const touchedFields = ref<Set<string>>(new Set())

// Computed para determinar se deve mostrar erros
const shouldShowErrors = computed(() => {
  return hasUserInteracted.value || touchedFields.value.size > 0
})

// Função de validação do nome
const validateName = (name: string): string | undefined => {
  if (!name.trim()) {
    return 'Nome é obrigatório'
  }
  
  if (name.trim().length < 2) {
    return 'Nome deve ter pelo menos 2 caracteres'
  }
  
  return undefined
}

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
  
  if (password.length < 8) {
    return 'Senha deve ter pelo menos 8 caracteres'
  }
  
  // Verificar se tem pelo menos uma letra e um número
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  
  if (!hasLetter || !hasNumber) {
    return 'Senha deve conter pelo menos uma letra e um número'
  }
  
  return undefined
}

// Função de validação da confirmação de senha
const validateConfirmPassword = (confirmPassword: string, password: string): string | undefined => {
  if (!confirmPassword) {
    return 'Confirmação de senha é obrigatória'
  }
  
  if (confirmPassword !== password) {
    return 'Senhas não coincidem'
  }
  
  return undefined
}

// Validação em tempo real
const validateForm = (): void => {
  errors.value = {
    name: validateName(form.name),
    email: validateEmail(form.email),
    password: validatePassword(form.password),
    confirmPassword: validateConfirmPassword(form.confirmPassword, form.password)
  }
}

// Computed para verificar se o formulário é válido
const isFormValid = computed(() => {
  validateForm()
  return !errors.value.name && 
         !errors.value.email && 
         !errors.value.password && 
         !errors.value.confirmPassword &&
         form.name && 
         form.email && 
         form.password && 
         form.confirmPassword
})

// Handler do submit do formulário
const handleSubmit = (): void => {
  hasUserInteracted.value = true
  validateForm()
  
  if (isFormValid.value) {
    emit('submit', { ...form })
  }
}

// Handler para quando o usuário sai de um campo (blur)
const handleFieldBlur = (fieldName: string): void => {
  touchedFields.value.add(fieldName)
}

// Limpar erros quando o usuário começar a digitar
watch(() => form.name, () => {
  if (errors.value.name) {
    errors.value.name = undefined
  }
})

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

watch(() => form.confirmPassword, () => {
  if (errors.value.confirmPassword) {
    errors.value.confirmPassword = undefined
  }
})

// Método para resetar o formulário (exposto para uso externo)
const resetForm = (): void => {
  form.name = ''
  form.email = ''
  form.password = ''
  form.confirmPassword = ''
  errors.value = {}
  hasUserInteracted.value = false
  touchedFields.value.clear()
}

// Expor métodos para uso externo
defineExpose({
  resetForm
})
</script>