<template>
  <aside class="flex flex-col h-screen w-64 bg-card border-r border-border shadow-sm">
    <!-- Cabeçalho com Logo e Nome -->
    <div class="flex items-center p-6 border-b border-border">
      <!-- Logo usando Heroicon -->
      <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
        <CalendarDaysIcon class="w-6 h-6 text-white" />
      </div>
      
      <!-- Textos à direita -->
      <div class="ml-4 flex-1">
        <!-- Nome da Aplicação -->
        <h1 class="text-xl font-bold text-card-foreground">
          WebiAgenda
        </h1>
      </div>
    </div>

    <!-- Navegação Principal -->
    <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
      <button
        v-for="item in menuItems"
        :key="item.name"
        :class="getMenuItemClasses(item.path)"
        @click="navigateToRoute(item.path)"
      >
        <!-- Ícone do item -->
        <div class="flex-shrink-0 pr-2">
          <component
            :is="getMenuIcon(item.icon)"
            :class="getIconClasses(item.path)"
          />
        </div>

        <!-- Nome do item -->
        <span class="font-medium text-sm truncate">
          {{ item.name }}
        </span>

        <!-- Indicador de item ativo -->
        <div
          v-if="isActiveRoute(item.path)"
          class="ml-auto w-2 h-2 bg-primary rounded-full flex-shrink-0"
        />
      </button>
    </nav>

    <!-- Card do Usuário no Rodapé -->
    <div class="p-4 border-t border-border">
      <div class="bg-muted hover:bg-accent transition-colors cursor-pointer rounded-lg p-3">
        <div class="flex items-center space-x-3">
          <!-- Foto do Usuário -->
          <div class="relative">
            <img
              v-if="user?.avatar_url"
              :src="user.avatar_url"
              :alt="user.name || 'Usuário'"
              class="w-10 h-10 rounded-full object-cover border-2 border-border"
            >
            <!-- Avatar padrão caso não tenha foto -->
            <div
              v-else
              class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center border-2 border-border"
            >
              <span class="text-white font-medium text-sm">
                {{ getUserInitials(user?.name) }}
              </span>
            </div>
            
            
          </div>

          <!-- Informações do Usuário -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-card-foreground truncate">
              {{ user?.name || 'Usuário' }}
            </p>
            <p class="text-xs text-muted-foreground truncate">
              {{ user?.email || 'email@exemplo.com' }}
            </p>
          </div>

          <!-- Ícone de configurações usando Heroicon -->
          <button
            class="p-1 rounded-md hover:bg-accent transition-colors"
            @click="openUserMenu"
          >
            <EllipsisVerticalIcon class="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  CalendarDaysIcon,
  Squares2X2Icon,
  BeakerIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  UserGroupIcon,
  EllipsisVerticalIcon
} from '@heroicons/vue/24/outline'
import { useAuth } from '~/composables/core/useAuth'
import type { User } from '~/features/auth/types/auth'

// Composables
const { user } = useAuth()
const router = useRouter()
const route = useRoute()

// Interface para itens do menu
interface MenuItem {
  name: string
  path: string
  icon: string
}

// Itens do menu de navegação
const menuItems: MenuItem[] = [
  {
    name: 'Dashboard',
    path: '/admin/dashboard',
    icon: 'dashboard'
  },
  {
    name: 'Especialidades',
    path: '/admin/especialidades',
    icon: 'specialties'
  },
  {
    name: 'Agendamentos',
    path: '/admin/agendamentos',
    icon: 'appointments'
  },
  {
    name: 'Clientes',
    path: '/admin/clientes',
    icon: 'clients'
  },
  {
    name: 'Profissionais',
    path: '/admin/profissionais',
    icon: 'professionals'
  }
]

// Mapeamento de ícones do Heroicons
const iconMap = {
  dashboard: Squares2X2Icon,
  specialties: BeakerIcon,
  appointments: ClipboardDocumentListIcon,
  clients: UsersIcon,
  professionals: UserGroupIcon
}

// Função para obter o ícone correto
const getMenuIcon = (iconName: string) => {
  return iconMap[iconName as keyof typeof iconMap] || Squares2X2Icon
}

// Função para verificar se a rota está ativa
const isActiveRoute = (path: string): boolean => {
  return route.path === path || route.path.startsWith(path + '/')
}

// Função para obter as classes do ícone
const getIconClasses = (path: string) => {
  const baseClasses = 'w-5 h-5'
  const isActive = isActiveRoute(path)
  
  if (isActive) {
    return `${baseClasses} text-primary`
  } else {
    return `${baseClasses} text-muted-foreground group-hover:text-foreground`
  }
}

// Função para obter as classes do item do menu
const getMenuItemClasses = (path: string) => {
  const baseClasses = [
    'flex items-center w-full px-3 py-2.5 text-left rounded-lg transition-all duration-200 group'
  ]
  
  const isActive = isActiveRoute(path)
  
  if (isActive) {
    return [
      ...baseClasses,
      'bg-primary/10',
      'text-primary',
      'border border-primary/20',
      'shadow-sm'
    ]
  } else {
    return [
      ...baseClasses,
      'text-card-foreground',
      'hover:bg-accent',
      'hover:text-accent-foreground',
      'focus:bg-accent',
      'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
    ]
  }
}

// Função para navegar para uma rota
const navigateToRoute = async (path: string) => {
  await router.push(path)
}

// Função para obter as iniciais do nome do usuário
const getUserInitials = (name?: string): string => {
  if (!name) return 'U'
  
  const names = name.trim().split(' ')
  if (names.length === 1) {
    return names[0]?.charAt(0).toUpperCase() || 'U'
  }
  
  const firstName = names[0]?.charAt(0) || ''
  const lastName = names[names.length - 1]?.charAt(0) || ''
  return (firstName + lastName).toUpperCase() || 'U'
}

// Função para abrir menu do usuário (placeholder)
const openUserMenu = () => {
  // TODO: Implementar menu dropdown do usuário
  console.log('Abrir menu do usuário')
}
</script>