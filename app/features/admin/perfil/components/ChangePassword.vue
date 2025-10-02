<template>
  <div class="bg-card border border-border rounded-lg shadow-sm p-6 h-[calc(100vh-14rem)]">
    <h2 class="text-xl font-semibold text-foreground mb-6">Alterar Senha</h2>
    
    <form class="space-y-6">
      <!-- Senha Atual -->
      <div>
        <label for="senha-atual" class="block text-sm font-medium text-foreground mb-2">Senha Atual</label>
        <Input
          id="senha-atual"
          v-model="currentPassword"
          type="password"
          placeholder="Digite sua senha atual"
          class="w-full"
        />
      </div>

      <!-- Nova Senha -->
      <div>
        <label for="nova-senha" class="block text-sm font-medium text-foreground mb-2">Nova Senha</label>
        <Input
          id="nova-senha"
          v-model="newPassword"
          type="password"
          placeholder="Digite a nova senha"
          class="w-full"
        />
      </div>

      <!-- Confirmar Nova Senha -->
      <div>
        <label for="confirmar-nova-senha" class="block text-sm font-medium text-foreground mb-2">Confirmar Nova Senha</label>
        <Input
          id="confirmar-nova-senha"
          v-model="confirmNewPassword"
          type="password"
          placeholder="Confirme a nova senha"
          class="w-full"
        />
      </div>

      <!-- Mensagem de erro -->
      <div v-if="validationError || error" class="text-red-500 text-sm mt-2 p-2 bg-red-50 rounded">
        {{ validationError || error }}
      </div>

      <!-- Botão Salvar -->
      <div class="flex justify-end">
        <Button
          type="button"
          :disabled="isLoading"
          @click="handlePasswordChange"
          class="px-6 py-2"
        >
          {{ isLoading ? 'Alterando...' : 'Alterar Senha' }}
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Input from '~/components/ui/Input.vue'
import Button from '~/components/ui/Button.vue'
import { useAuth } from '~/composables/core/useAuth'
import { useToast } from '~/composables/ui/useToast'

const { changePassword, isLoading, error, clearError } = useAuth()
const toast = useToast()

const validationError = ref<string | null>(null)
// Dados reativos para senhas
const currentPassword = ref('')
const newPassword = ref('')
const confirmNewPassword = ref('')

// Função para alterar senha
const handlePasswordChange = async () => {
  // Limpa erros anteriores
  clearError()
  validationError.value = null

  // Validações básicas
  if (!currentPassword.value) {
    validationError.value = 'Senha atual é obrigatória'
    toast.error(validationError.value)
    return
  }

  if (!newPassword.value || newPassword.value.length < 6) {
    validationError.value = 'A nova senha deve ter pelo menos 6 caracteres'
    toast.error(validationError.value)
    return
  }

  if (newPassword.value !== confirmNewPassword.value) {
    validationError.value = 'As senhas não coincidem'
    toast.error(validationError.value)
    return
  }

  // Chama a função de alteração de senha
  const result = await changePassword(newPassword.value)

  if (result.success) {
    // Sucesso - limpa os campos
    currentPassword.value = ''
    newPassword.value = ''
    confirmNewPassword.value = ''
    validationError.value = null
    toast.success('Senha alterada com sucesso!')
  } else {
    // Erro já tratado pelo useAuth
    toast.error(result.error || 'Erro ao alterar senha')
  }
}
</script>