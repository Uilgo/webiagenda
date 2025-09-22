<template>
  <div class="flex h-screen bg-background">
    <!-- Overlay para mobile quando sidebar está aberta -->
    <div
      v-if="isMobileVisible"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
      @click="closeMobileSidebar"
    />
    
    <!-- Sidebar com comportamento responsivo -->
    <Sidebar 
      :collapsed="sidebarCollapsed"
      :mobile-visible="isMobileVisible"
      @toggle-collapse="toggleSidebarCollapse"
      @close-mobile="closeMobileSidebar"
    />
    
    <!-- Área Principal de Conteúdo -->
    <main class="flex-1 flex flex-col overflow-hidden">
      <!-- Header Personalizado -->
      <Header @toggle-sidebar="toggleSidebar" />
      
      <!-- Conteúdo Scrollável da Página -->
      <div class="flex-1 overflow-y-auto">
        <div class="p-6">
          <slot />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '~/components/layouts/Sidebar.vue'
import Header from '~/components/layouts/Header.vue'
import { useSidebar } from '~/composables/ui/useSidebar'

// Usando o composable para gerenciar o estado persistente da sidebar
const { 
  isCollapsed: sidebarCollapsed, 
  isMobileVisible,
  toggleSidebar,
  closeMobileSidebar 
} = useSidebar()

// Função para alternar o colapso da sidebar (usado pelo botão do header)
const toggleSidebarCollapse = () => {
  toggleSidebar()
}
</script>

<style scoped>
/* Transições suaves para a sidebar */
.sidebar-enter-active,
.sidebar-leave-active {
  transition: all 0.3s ease-in-out;
}

.sidebar-enter-from,
.sidebar-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* Garantir que o layout seja responsivo */
@media (max-width: 768px) {
  .sidebar-visible {
    position: fixed;
    z-index: 50;
  }
}
</style>