<template>
  <header class="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="flex justify-between px-6 h-20 items-center">
      <!-- Ícone de Sidebar (lado esquerdo) -->
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none"
        @click="toggleSidebar"
        aria-label="Abrir/Fechar menu lateral"
      >
        <!-- Ícone SVG personalizado de sidebar -->
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-panel-right-icon lucide-panel-right"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/></svg>
      </button>

      <!-- Título da Página (centro-esquerda) -->
      <div class="ml-4 flex-1">
        <h1 class="text-lg font-semibold text-foreground">
          {{ pageTitle }}
        </h1>
      </div>

      <!-- Área direita com controles -->
      <div class="flex items-center space-x-2">
        <!-- Toggle de Tema -->
        <ThemeToggle 
          variant="ghost" 
          size="md" 
        />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import ThemeToggle from '~/components/ui/ThemeToggle.vue'

// Props do componente
interface HeaderProps {
  /** Título personalizado (opcional) */
  title?: string
}

const props = withDefaults(defineProps<HeaderProps>(), {
  title: ''
})

// Emits para comunicação com componente pai
const emit = defineEmits<{
  toggleSidebar: []
}>()

// Composables
const route = useRoute()

// Função para alternar sidebar
const toggleSidebar = () => {
  emit('toggleSidebar')
}

// Título dinâmico baseado na rota atual
const pageTitle = computed(() => {
  // Se foi passado um título via props, usa ele
  if (props.title) {
    return props.title
  }

  // Mapeamento de rotas para títulos
  const routeMap: Record<string, string> = {
    '/admin/dashboard': 'Dashboard',
    '/admin/agendamentos': 'Agendamentos',
    '/admin/clientes': 'Clientes',
    '/admin/especialidades': 'Especialidades',
    '/admin/profissionais': 'Profissionais'
  }
  
  return routeMap[route.path] || 'Painel Administrativo'
})

</script>

<style scoped>
/* Garantir que o header tenha uma transição suave */
header {
  transition: all 0.2s ease-in-out;
}

/* Melhorar a aparência do botão de sidebar */
button:hover svg {
  transform: scale(1.05);
  transition: transform 0.2s ease-in-out;
}

/* Suporte para modo escuro */
@media (prefers-color-scheme: dark) {
  header {
    border-color: hsl(var(--border));
  }
}
</style>