<template>
  <Card
    title="Recuperar senha"
    subtitle="Defina uma nova senha para sua conta"
    size="md"
  >
    <!-- Formulário de nova senha -->
    <form v-if="!passwordUpdated" @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Campo de Nova Senha -->
      <Input
        v-model="form.newPassword"
        type="password"
        label="Nova senha"
        placeholder="Digite sua nova senha"
        :error-message="shouldShowErrors ? errors.newPassword : undefined"
        :disabled="loading"
        required
        autocomplete="new-password"
        help-text="A senha deve ter pelo menos 6 caracteres"
        @blur="handleFieldBlur('newPassword')"
      />

      <!-- Campo de Confirmação de Senha -->
      <Input
        v-model="form.confirmPassword"
        type="password"
        label="Confirmar nova senha"
        placeholder="Confirme sua nova senha"
        :error-message="shouldShowErrors ? errors.confirmPassword : undefined"
        :disabled="loading"
        required
        autocomplete="new-password"
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
        {{ loading ? 'Atualizando...' : 'Atualizar senha' }}
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
          Senha atualizada com sucesso!
        </h3>
        <p class="text-sm text-muted-foreground">
          Você pode agora fazer login com sua nova senha.
        </p>
      </div>

      <!-- Ações -->
      <div class="space-y-3">
        <!-- Ir para login -->
        <Button
          variant="primary"
          size="md"
          full-width
          @click="$emit('go-to-login')"
        >
          Ir para o login
        </Button>

        <!-- Voltar ao login (alternativa) -->
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
import { ref, computed, reactive, watch } from 'vue'
import { CheckCircleIcon } from '@heroicons/vue/24/outline'
import Card from '../../../components/ui/Card.vue'
import Input from '../../../components/ui/Input.vue'
import Button from '../../../components/ui/Button.vue'

// Interface para o formulário de reset de senha
interface ResetPasswordForm {
  newPassword: string
  confirmPassword: string
}

// Interface para os erros de validação
interface ResetPasswordErrors {
  newPassword?: string
  confirmPassword?: string
}

// Props do componente
interface ResetPasswordFormProps {
  loading?: boolean
  generalError?: string
  passwordUpdated?: boolean
}

const props = withDefaults(defineProps<ResetPasswordFormProps>(), {
  loading: false,
  generalError: '',
  passwordUpdated: false
})

// Emits do componente
const emit = defineEmits<{
  submit: [data: ResetPasswordForm]
  'back-to-login': []
  'go-to-login': []
}>()

// Estado reativo do formulário
const form = reactive<ResetPasswordForm>({
  newPassword: '',
  confirmPassword: ''
})

// Estado dos erros de validação
const errors = ref<ResetPasswordErrors>({})

// Estado para controlar quando mostrar erros
const hasUserInteracted = ref(false)
const touchedFields = ref<Set<string>>(new Set())

// Computed para determinar se deve mostrar erros
const shouldShowErrors = computed(() => {
  return hasUserInteracted.value || touchedFields.value.size > 0
})

// Função de validação da senha
const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return 'Senha é obrigatória'
  }
  
  if (password.length < 6) {
    return 'A senha deve ter pelo menos 6 caracteres'
  }
  
  return undefined
}

// Função de validação da confirmação de senha
const validateConfirmPassword = (confirmPassword: string): string | undefined => {
  if (!confirmPassword) {
    return 'Confirmação de senha é obrigatória'
  }
  
  if (confirmPassword !== form.newPassword) {
    return 'As senhas não coincidem'
  }
  
  return undefined
}

// Validação em tempo real
const validateForm = (): void => {
  errors.value = {
    newPassword: validatePassword(form.newPassword),
    confirmPassword: validateConfirmPassword(form.confirmPassword)
  }
}

// Computed para verificar se o formulário é válido
const isFormValid = computed(() => {
  validateForm()
  return !errors.value.newPassword && !errors.value.confirmPassword && 
         form.newPassword && form.confirmPassword
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
watch(() => form.newPassword, () => {
  if (errors.value.newPassword) {
    errors.value.newPassword = undefined
  }
  // Revalidar confirmação
  errors.value.confirmPassword = validateConfirmPassword(form.confirmPassword)
})

watch(() => form.confirmPassword, () => {
  if (errors.value.confirmPassword) {
    errors.value.confirmPassword = undefined
  }
})

// Método para resetar o formulário (exposto para uso externo)
const resetForm = (): void => {
  form.newPassword = ''
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