<template>
  <div class="flex h-screen bg-background">
    <!-- Sidebar com controle de visibilidade -->
    <Transition name="sidebar" mode="out-in">
      <Sidebar v-show="sidebarVisible" />
    </Transition>
    
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
import { ref } from 'vue'
import Sidebar from '~/components/layouts/Sidebar.vue'
import Header from '~/components/layouts/Header.vue'

// Estado da sidebar (visível/oculta)
const sidebarVisible = ref(true)

// Função para alternar a visibilidade da sidebar
const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value
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