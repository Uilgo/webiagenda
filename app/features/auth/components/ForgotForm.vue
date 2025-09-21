<template>
  <Card
    title="Recuperar senha"
    subtitle="Digite seu e-mail para receber as instruções de recuperação"
    size="md"
  >
    <!-- Formulário de recuperação -->
    <form v-if="!emailSent" @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Campo de Email -->
      <Input
        v-model="form.email"
        type="email"
        label="E-mail"
        placeholder="Digite seu e-mail cadastrado"
        :error-message="shouldShowErrors ? errors.email : undefined"
        :disabled="loading"
        required
        autocomplete="email"
        help-text="Enviaremos um link de recuperação para este e-mail"
        @blur="handleFieldBlur('email')"
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
        {{ loading ? 'Enviando...' : 'Enviar link de recuperação' }}
      </Button>

      <!-- Link para voltar ao login -->
      <div class="text-center">
        <button
          type="button"
          class="text-sm text-muted-foreground hover:text-foreground focus:outline-none focus:underline"
          @click="$emit('back-to-login')"
          :disabled="loading"
        >
          ← Voltar para o login
        </button>
      </div>
    </form>

    <!-- Mensagem de sucesso -->
    <div v-else class="space-y-4">
      <!-- Ícone de sucesso -->
      <div class="flex justify-center">
        <div class="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
          <CheckCircleIcon class="w-8 h-8 text-success" />
        </div>
      </div>

      <!-- Mensagem de confirmação -->
      <div class="text-center space-y-2">
        <h3 class="text-lg font-semibold text-foreground">
          E-mail enviado com sucesso!
        </h3>
        <p class="text-sm text-muted-foreground">
          Enviamos um link de recuperação para:
        </p>
        <p class="text-sm font-medium text-foreground">
          {{ form.email }}
        </p>
      </div>

      <!-- Instruções -->
      <div class="p-4 bg-info/10 border border-info/20 rounded-md">
        <div class="flex items-start space-x-3">
          <InformationCircleIcon class="w-5 h-5 text-info mt-0.5 flex-shrink-0" />
          <div class="text-sm text-info-foreground space-y-1">
            <p class="font-medium">Próximos passos:</p>
            <ul class="list-disc list-inside space-y-1 ml-2">
              <li>Verifique sua caixa de entrada</li>
              <li>Clique no link recebido por e-mail</li>
              <li>Defina uma nova senha</li>
              <li>Faça login com a nova senha</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Ações adicionais -->
      <div class="space-y-3">
        <!-- Reenviar e-mail -->
        <Button
          variant="outline"
          size="md"
          :loading="resendLoading"
          :disabled="resendLoading || !canResend"
          full-width
          @click="handleResend"
        >
          {{ resendLoading ? 'Reenviando...' : `Reenviar e-mail ${resendCountdown > 0 ? `(${resendCountdown}s)` : ''}` }}
        </Button>

        <!-- Voltar ao login -->
        <div class="text-center">
          <button
            type="button"
            class="text-sm text-muted-foreground hover:text-foreground focus:outline-none focus:underline"
            @click="$emit('back-to-login')"
          >
            ← Voltar para o login
          </button>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, onUnmounted, watch } from 'vue'
import { CheckCircleIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'
import Card from '../../../components/ui/Card.vue'
import Input from '../../../components/ui/Input.vue'
import Button from '../../../components/ui/Button.vue'

// Interface para o formulário de recuperação
interface ForgotForm {
  email: string
}

// Interface para os erros de validação
interface ForgotErrors {
  email?: string
}

// Props do componente
interface ForgotFormProps {
  loading?: boolean
  resendLoading?: boolean
  generalError?: string
  emailSent?: boolean
}

const props = withDefaults(defineProps<ForgotFormProps>(), {
  loading: false,
  resendLoading: false,
  generalError: '',
  emailSent: false
})

// Emits do componente
const emit = defineEmits<{
  submit: [data: ForgotForm]
  resend: [email: string]
  'back-to-login': []
}>()

// Estado reativo do formulário
const form = reactive<ForgotForm>({
  email: ''
})

// Estado dos erros de validação
const errors = ref<ForgotErrors>({})

// Estado para controlar quando mostrar erros
const hasUserInteracted = ref(false)
const touchedFields = ref<Set<string>>(new Set())

// Computed para determinar se deve mostrar erros
const shouldShowErrors = computed(() => {
  return hasUserInteracted.value || touchedFields.value.size > 0
})

// Estado do countdown para reenvio
const resendCountdown = ref(0)
const resendTimer = ref<number | null>(null)

// Computed para verificar se pode reenviar
const canResend = computed(() => resendCountdown.value === 0)

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

// Validação em tempo real
const validateForm = (): void => {
  errors.value = {
    email: validateEmail(form.email)
  }
}

// Computed para verificar se o formulário é válido
const isFormValid = computed(() => {
  validateForm()
  return !errors.value.email && form.email
})

// Handler do submit do formulário
const handleSubmit = (): void => {
  hasUserInteracted.value = true
  validateForm()
  
  if (isFormValid.value) {
    emit('submit', { ...form })
    startResendCountdown()
  }
}

// Handler para quando o usuário sai de um campo (blur)
const handleFieldBlur = (fieldName: string): void => {
  touchedFields.value.add(fieldName)
}

// Handler para reenviar e-mail
const handleResend = (): void => {
  if (canResend.value) {
    emit('resend', form.email)
    startResendCountdown()
  }
}

// Iniciar countdown para reenvio
const startResendCountdown = (): void => {
  resendCountdown.value = 60 // 60 segundos
  
  resendTimer.value = setInterval(() => {
    resendCountdown.value--
    
    if (resendCountdown.value <= 0) {
      clearInterval(resendTimer.value!)
      resendTimer.value = null
    }
  }, 1000)
}

// Limpar timer ao desmontar o componente
onUnmounted(() => {
  if (resendTimer.value) {
    clearInterval(resendTimer.value)
  }
})

// Limpar erros quando o usuário começar a digitar
watch(() => form.email, () => {
  if (errors.value.email) {
    errors.value.email = undefined
  }
})

// Resetar countdown quando emailSent mudar para false
watch(() => props.emailSent, (newValue) => {
  if (!newValue) {
    resendCountdown.value = 0
    if (resendTimer.value) {
      clearInterval(resendTimer.value)
      resendTimer.value = null
    }
  }
})

// Método para resetar o formulário (exposto para uso externo)
const resetForm = (): void => {
  form.email = ''
  errors.value = {}
  hasUserInteracted.value = false
  touchedFields.value.clear()
  resendCountdown.value = 0
  
  if (resendTimer.value) {
    clearInterval(resendTimer.value)
    resendTimer.value = null
  }
}

// Expor métodos para uso externo
defineExpose({
  resetForm
})
</script>