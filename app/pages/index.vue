<template>
  <div class="min-h-screen bg-background">
    <!-- Header da página -->
    <header class="bg-card border-b border-border">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-3xl font-bold text-foreground">
              Design System - Componentes UI
            </h1>
            <p class="text-muted-foreground mt-2">
              Demonstração dos componentes Button, Input, Card e ThemeToggle
            </p>
          </div>
          
          <!-- Componente ThemeToggle -->
          <div class="flex items-center gap-4">
            <span class="text-sm text-muted-foreground hidden sm:block">
              Tema:
            </span>
            <ThemeToggle variant="outline" size="md" />
          </div>
        </div>
      </div>
    </header>

    <!-- Conteúdo principal -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Seção de ThemeToggle -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-foreground mb-6">
          Componente ThemeToggle
        </h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Variantes do ThemeToggle -->
          <Card title="Variantes" subtitle="Diferentes estilos do seletor de tema">
            <div class="space-y-4">
              <div class="flex flex-wrap items-center gap-4">
                <div class="flex flex-col items-center gap-2">
                  <ThemeToggle variant="default" size="md" />
                  <span class="text-xs text-muted-foreground">Default</span>
                </div>
                <div class="flex flex-col items-center gap-2">
                  <ThemeToggle variant="ghost" size="md" />
                  <span class="text-xs text-muted-foreground">Ghost</span>
                </div>
                <div class="flex flex-col items-center gap-2">
                  <ThemeToggle variant="outline" size="md" />
                  <span class="text-xs text-muted-foreground">Outline</span>
                </div>
              </div>
            </div>
          </Card>

          <!-- Tamanhos do ThemeToggle -->
          <Card title="Tamanhos" subtitle="Diferentes tamanhos disponíveis">
            <div class="space-y-4">
              <div class="flex flex-wrap items-center gap-4">
                <div class="flex flex-col items-center gap-2">
                  <ThemeToggle variant="outline" size="sm" />
                  <span class="text-xs text-muted-foreground">Small</span>
                </div>
                <div class="flex flex-col items-center gap-2">
                  <ThemeToggle variant="outline" size="md" />
                  <span class="text-xs text-muted-foreground">Medium</span>
                </div>
                <div class="flex flex-col items-center gap-2">
                  <ThemeToggle variant="outline" size="lg" />
                  <span class="text-xs text-muted-foreground">Large</span>
                </div>
              </div>
            </div>
          </Card>

          <!-- Funcionalidade -->
          <Card title="Funcionalidade" subtitle="Como usar o seletor de tema" class="lg:col-span-2">
            <div class="space-y-4">
              <p class="text-muted-foreground">
                O componente ThemeToggle permite alternar entre os temas disponíveis:
              </p>
              <ul class="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Light:</strong> Tema claro com fundo branco</li>
                <li><strong>Dark:</strong> Tema escuro com fundo preto</li>
                <li><strong>System:</strong> Segue a preferência do sistema operacional</li>
              </ul>
              <div class="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <span class="text-sm font-medium">Teste aqui:</span>
                <ThemeToggle variant="default" size="md" />
                <span class="text-xs text-muted-foreground">
                  Clique para alternar entre os temas
                </span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <!-- Seção de Buttons -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-foreground mb-6">
          Componente Button
        </h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Variantes -->
          <Card title="Variantes" subtitle="Diferentes estilos de botões">
            <div class="space-y-4">
              <div class="flex flex-wrap gap-3">
                <Button variant="default">Default</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>
          </Card>

          <!-- Tamanhos -->
          <Card title="Tamanhos" subtitle="Diferentes tamanhos disponíveis">
            <div class="space-y-4">
              <div class="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>
          </Card>

          <!-- Estados -->
          <Card title="Estados" subtitle="Estados de interação">
            <div class="space-y-4">
              <div class="flex flex-wrap gap-3">
                <Button>Normal</Button>
                <Button loading>Loading</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </Card>

          <!-- Botões com ações -->
          <Card title="Interações" subtitle="Botões com funcionalidades">
            <div class="space-y-4">
              <div class="flex flex-wrap gap-3">
                <Button @click="showToast('success', 'Sucesso!')">
                  Mostrar Sucesso
                </Button>
                <Button 
                  variant="destructive" 
                  @click="showToast('error', 'Erro!')"
                >
                  Mostrar Erro
                </Button>
                <Button 
                  variant="outline" 
                  @click="showToast('info', 'Informação!')"
                >
                  Mostrar Info
                </Button>
              </div>
            </div>
          </Card>

          <!-- Demonstração completa de Toasts -->
          <Card title="Demonstração de Toasts" subtitle="Todos os tipos de notificação disponíveis" class="lg:col-span-2">
            <div class="space-y-6">
              <p class="text-muted-foreground">
                Teste todos os tipos de notificação toast disponíveis no sistema:
              </p>
              
              <!-- Toasts básicos -->
              <div class="space-y-3">
                <h4 class="font-medium text-foreground">Tipos Básicos</h4>
                <div class="flex flex-wrap gap-3">
                  <Button 
                    variant="default"
                    @click="showToast('success', '✅ Operação realizada com sucesso!')"
                  >
                    Success Toast
                  </Button>
                  
                  <Button 
                    variant="destructive"
                    @click="showToast('error', '❌ Erro ao processar a solicitação!')"
                  >
                    Error Toast
                  </Button>
                  
                  <Button 
                    variant="outline"
                    @click="showToast('warning', '⚠️ Atenção: Verifique os dados inseridos!')"
                  >
                    Warning Toast
                  </Button>
                  
                  <Button 
                    variant="secondary"
                    @click="showToast('info', 'ℹ️ Informação importante para o usuário!')"
                  >
                    Info Toast
                  </Button>
                  
                  <Button 
                    variant="ghost"
                    @click="showToast('default', '📝 Notificação padrão do sistema!')"
                  >
                    Default Toast
                  </Button>
                </div>
              </div>

              <!-- Toasts com mensagens longas -->
              <div class="space-y-3">
                <h4 class="font-medium text-foreground">Mensagens Longas</h4>
                <div class="flex flex-wrap gap-3">
                  <Button 
                    size="sm"
                    @click="showToast('success', 'Parabéns! Seu cadastro foi realizado com sucesso. Você receberá um e-mail de confirmação em breve com todas as instruções necessárias para ativar sua conta.')"
                  >
                    Success Longo
                  </Button>
                  
                  <Button 
                    variant="destructive"
                    size="sm"
                    @click="showToast('error', 'Ops! Ocorreu um erro inesperado ao processar sua solicitação. Por favor, verifique sua conexão com a internet e tente novamente. Se o problema persistir, entre em contato com o suporte técnico.')"
                  >
                    Error Longo
                  </Button>
                </div>
              </div>

              <!-- Toasts em sequência -->
              <div class="space-y-3">
                <h4 class="font-medium text-foreground">Múltiplos Toasts</h4>
                <div class="flex flex-wrap gap-3">
                  <Button 
                    variant="outline"
                    @click="showMultipleToasts"
                  >
                    Mostrar Sequência
                  </Button>
                  
                  <Button 
                    variant="outline"
                    @click="showRandomToasts"
                  >
                    Toasts Aleatórios
                  </Button>
                  
                  <Button 
                    variant="outline"
                    @click="showProgressToasts"
                  >
                    Simulação de Progresso
                  </Button>
                </div>
              </div>

              <!-- Toasts temáticos -->
              <div class="space-y-3">
                <h4 class="font-medium text-foreground">Cenários Específicos</h4>
                <div class="flex flex-wrap gap-3">
                  <Button 
                    size="sm"
                    @click="showToast('success', '💾 Dados salvos automaticamente!')"
                  >
                    Auto Save
                  </Button>
                  
                  <Button 
                    variant="destructive"
                    size="sm"
                    @click="showToast('error', '🔒 Sessão expirada. Faça login novamente.')"
                  >
                    Sessão Expirada
                  </Button>
                  
                  <Button 
                    variant="outline"
                    size="sm"
                    @click="showToast('warning', '📶 Conexão instável detectada!')"
                  >
                    Conexão
                  </Button>
                  
                  <Button 
                    variant="secondary"
                    size="sm"
                    @click="showToast('info', '🔄 Sincronizando dados...')"
                  >
                    Sincronização
                  </Button>
                  
                  <Button 
                    variant="ghost"
                    size="sm"
                    @click="showToast('default', '👋 Bem-vindo ao sistema!')"
                  >
                    Boas-vindas
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <!-- Seção de Inputs -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-foreground mb-6">
          Componente Input
        </h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Tipos básicos -->
          <Card title="Tipos de Input" subtitle="Diferentes tipos de entrada">
            <div class="space-y-4">
              <Input
                v-model="formData.name"
                label="Nome"
                placeholder="Digite seu nome"
                help-text="Nome completo do usuário"
              />
              
              <Input
                v-model="formData.email"
                type="email"
                label="E-mail"
                placeholder="usuario@exemplo.com"
                required
              />
              
              <Input
                v-model="formData.password"
                type="password"
                label="Senha"
                placeholder="Digite sua senha"
                required
              />
              
              <Input
                v-model="formData.phone"
                type="tel"
                label="Telefone"
                placeholder="(11) 99999-9999"
              />
            </div>
          </Card>

          <!-- Tamanhos e estados -->
          <Card title="Tamanhos e Estados" subtitle="Variações de tamanho e estado">
            <div class="space-y-4">
              <Input
                v-model="formData.small"
                size="sm"
                label="Input Pequeno"
                placeholder="Tamanho pequeno"
              />
              
              <Input
                v-model="formData.medium"
                size="md"
                label="Input Médio"
                placeholder="Tamanho médio (padrão)"
              />
              
              <Input
                v-model="formData.large"
                size="lg"
                label="Input Grande"
                placeholder="Tamanho grande"
              />
              
              <Input
                v-model="formData.disabled"
                label="Input Desabilitado"
                placeholder="Este input está desabilitado"
                disabled
              />
              
              <Input
                v-model="formData.error"
                label="Input com Erro"
                placeholder="Digite algo"
                error-message="Este campo é obrigatório"
              />
              
              <Input
                v-model="formData.loading"
                label="Input com Loading"
                placeholder="Carregando..."
                loading
              />
            </div>
          </Card>
        </div>
      </section>

      <!-- Seção de Cards -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-foreground mb-6">
          Componente Card
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Card padrão -->
          <Card 
            title="Card Padrão" 
            subtitle="Exemplo de card básico"
          >
            <p class="text-muted-foreground">
              Este é um exemplo de card com header, body e conteúdo básico.
              Perfeito para exibir informações organizadas.
            </p>
            
            <template #footer>
              <div class="flex justify-end gap-2">
                <Button variant="outline" size="sm">Cancelar</Button>
                <Button size="sm">Confirmar</Button>
              </div>
            </template>
          </Card>

          <!-- Card outlined -->
          <Card 
            variant="outlined"
            title="Card Outlined" 
            subtitle="Variante com borda"
          >
            <p class="text-muted-foreground">
              Card com borda mais destacada, ideal para elementos que precisam
              de mais destaque visual.
            </p>
          </Card>

          <!-- Card elevated -->
          <Card 
            variant="elevated"
            title="Card Elevated" 
            subtitle="Com sombra elevada"
          >
            <p class="text-muted-foreground">
              Card com sombra, criando um efeito de elevação que se destaca
              do fundo da página.
            </p>
          </Card>

          <!-- Card clickable -->
          <Card 
            title="Card Clicável" 
            subtitle="Interativo"
            clickable
            hoverable
            @click="showToast('info', 'Card clicado!')"
          >
            <p class="text-muted-foreground">
              Este card é clicável e possui efeitos de hover. Clique para
              ver a interação.
            </p>
          </Card>

          <!-- Card com formulário -->
          <Card 
            title="Formulário de Contato" 
            subtitle="Card com inputs"
            size="lg"
          >
            <div class="space-y-4">
              <Input
                v-model="contactForm.name"
                label="Nome"
                placeholder="Seu nome"
                required
              />
              
              <Input
                v-model="contactForm.message"
                label="Mensagem"
                placeholder="Sua mensagem"
                required
              />
            </div>
            
            <template #footer>
              <Button 
                class="w-full" 
                @click="submitContact"
                :loading="contactLoading"
              >
                Enviar Mensagem
              </Button>
            </template>
          </Card>

          <!-- Card de estatísticas -->
          <Card 
            title="Estatísticas" 
            subtitle="Dados do sistema"
            variant="elevated"
          >
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-muted-foreground">Usuários</span>
                <span class="font-semibold">1,234</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-muted-foreground">Vendas</span>
                <span class="font-semibold">R$ 45,678</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-muted-foreground">Crescimento</span>
                <span class="font-semibold text-green-600">+12%</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <!-- Seção de exemplo completo -->
      <section>
        <h2 class="text-2xl font-semibold text-foreground mb-6">
          Exemplo Completo
        </h2>
        
        <Card 
          title="Cadastro de Usuário" 
          subtitle="Formulário completo usando todos os componentes"
          size="lg"
          class="max-w-2xl mx-auto"
        >
          <form @submit.prevent="submitForm" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                v-model="userForm.firstName"
                label="Nome"
                placeholder="João"
                required
                :error-message="errors.firstName"
              />
              
              <Input
                v-model="userForm.lastName"
                label="Sobrenome"
                placeholder="Silva"
                required
                :error-message="errors.lastName"
              />
            </div>
            
            <Input
              v-model="userForm.email"
              type="email"
              label="E-mail"
              placeholder="joao@exemplo.com"
              required
              :error-message="errors.email"
            />
            
            <Input
              v-model="userForm.password"
              type="password"
              label="Senha"
              placeholder="Digite uma senha segura"
              required
              :error-message="errors.password"
              help-text="Mínimo 8 caracteres"
            />
            
            <Input
              v-model="userForm.confirmPassword"
              type="password"
              label="Confirmar Senha"
              placeholder="Digite a senha novamente"
              required
              :error-message="errors.confirmPassword"
            />
          </form>
          
          <template #footer>
            <div class="flex justify-end gap-3">
              <Button 
                variant="outline" 
                @click="resetForm"
              >
                Limpar
              </Button>
              <Button 
                @click="submitForm"
                :loading="formLoading"
              >
                Cadastrar
              </Button>
            </div>
          </template>
        </Card>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { GlobalToastType } from '#shared/types/global'

// Acesso ao toast via plugin do Nuxt
const { $toast } = useNuxtApp()

// Configuração da página
useHead({
  title: 'Design System - Componentes UI'
})

// Dados dos formulários
const formData = reactive({
  name: '',
  email: '',
  password: '',
  phone: '',
  small: '',
  medium: '',
  large: '',
  disabled: 'Valor desabilitado',
  error: '',
  loading: ''
})

const contactForm = reactive({
  name: '',
  message: ''
})

const userForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// Estados de loading
const contactLoading = ref(false)
const formLoading = ref(false)

// Erros de validação
const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// Função para mostrar toast - expandida para suportar todos os tipos
const showToast = (type: GlobalToastType, message: string) => {
  switch (type) {
    case 'success':
      $toast.success(message)
      break
    case 'error':
      $toast.error(message)
      break
    case 'info':
      $toast.info(message)
      break
    case 'warning':
      $toast.warning(message)
      break
    case 'default':
      $toast(message) // Toast padrão
      break
  }
}

// Função para mostrar múltiplos toasts em sequência
const showMultipleToasts = async () => {
  const messages: Array<{ type: GlobalToastType, message: string }> = [
    { type: 'info' as const, message: '🔄 Iniciando processo...' },
    { type: 'warning' as const, message: '⚠️ Validando dados...' },
    { type: 'success' as const, message: '✅ Processo concluído!' }
  ]
  
  for (let i = 0; i < messages.length; i++) {
    setTimeout(() => {
      showToast(messages[i]!.type, messages[i]!.message)
    }, i * 1000) // Intervalo de 1 segundo entre cada toast
  }
}

// Função para mostrar toasts aleatórios
const showRandomToasts = () => {
  const toastTypes: readonly GlobalToastType[] = ['success', 'error', 'info', 'warning', 'default'] as const
  const messages: string[] = [
    '🎯 Toast aleatório número 1!',
    '🎲 Mensagem surpresa!',
    '🌟 Notificação especial!',
    '🚀 Toast dinâmico!',
    '💫 Mensagem mágica!'
  ]
  
  // Gera 3 toasts aleatórios
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      const randomType = toastTypes[Math.floor(Math.random() * toastTypes.length)]!
      const randomMessage = messages[Math.floor(Math.random() * messages.length)]!
      showToast(randomType, randomMessage)
    }, i * 500) // Intervalo de 0.5 segundos
  }
}

// Função para simular progresso com toasts
const showProgressToasts = async () => {
  const steps: Array<{ type: GlobalToastType, message: string }> = [
    { type: 'info' as const, message: '📋 Preparando dados... (1/5)' },
    { type: 'info' as const, message: '🔍 Validando informações... (2/5)' },
    { type: 'warning' as const, message: '⚡ Processando... (3/5)' },
    { type: 'info' as const, message: '💾 Salvando alterações... (4/5)' },
    { type: 'success' as const, message: '🎉 Concluído com sucesso! (5/5)' }
  ]
  
  for (let i = 0; i < steps.length; i++) {
    setTimeout(() => {
      showToast(steps[i]!.type, steps[i]!.message)
    }, i * 800) // Intervalo de 0.8 segundos
  }
}

// Função para enviar contato
const submitContact = async () => {
  if (!contactForm.name || !contactForm.message) {
    showToast('error', 'Preencha todos os campos!')
    return
  }
  
  contactLoading.value = true
  
  // Simula envio
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  showToast('success', 'Mensagem enviada com sucesso!')
  contactForm.name = ''
  contactForm.message = ''
  contactLoading.value = false
}

// Validação do formulário
const validateForm = () => {
  // Limpa erros anteriores
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
  
  let isValid = true
  
  if (!userForm.firstName) {
    errors.firstName = 'Nome é obrigatório'
    isValid = false
  }
  
  if (!userForm.lastName) {
    errors.lastName = 'Sobrenome é obrigatório'
    isValid = false
  }
  
  if (!userForm.email) {
    errors.email = 'E-mail é obrigatório'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(userForm.email)) {
    errors.email = 'E-mail inválido'
    isValid = false
  }
  
  if (!userForm.password) {
    errors.password = 'Senha é obrigatória'
    isValid = false
  } else if (userForm.password.length < 8) {
    errors.password = 'Senha deve ter pelo menos 8 caracteres'
    isValid = false
  }
  
  if (!userForm.confirmPassword) {
    errors.confirmPassword = 'Confirmação de senha é obrigatória'
    isValid = false
  } else if (userForm.password !== userForm.confirmPassword) {
    errors.confirmPassword = 'Senhas não coincidem'
    isValid = false
  }
  
  return isValid
}

// Função para enviar formulário
const submitForm = async () => {
  if (!validateForm()) {
    showToast('error', 'Corrija os erros no formulário')
    return
  }
  
  formLoading.value = true
  
  // Simula envio
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  showToast('success', 'Usuário cadastrado com sucesso!')
  resetForm()
  formLoading.value = false
}

// Função para limpar formulário
const resetForm = () => {
  Object.keys(userForm).forEach(key => {
    userForm[key as keyof typeof userForm] = ''
  })
  
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
}
</script>