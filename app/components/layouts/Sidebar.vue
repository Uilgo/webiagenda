<template>
  <aside :class="sidebarClasses">
    <!-- Cabeçalho com Logo e Nome -->
    <div
      :class="
        collapsed
          ? 'flex items-center justify-center px-2 h-20 border-b border-border'
          : 'flex items-center px-4 h-20 border-b border-border'
      "
    >
      <!-- Logo usando Heroicon - tamanho ajustado para modo colapsado -->
      <div
        :class="collapsed ? 'w-10 h-10' : 'w-12 h-12'"
        class="bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300"
      >
        <CalendarDaysIcon
          :class="collapsed ? 'w-4 h-4' : 'w-6 h-6'"
          class="text-white transition-all duration-300"
        />
      </div>

      <!-- Textos à direita (ocultos quando colapsado) -->
      <div v-if="!collapsed" class="ml-4 flex-1">
        <!-- Nome da Aplicação -->
        <h1 class="text-xl font-bold text-card-foreground">WebiAgenda</h1>
      </div>
    </div>

    <!-- Navegação Principal -->
    <nav class="flex-1 px-2 py-6 space-y-2 overflow-y-auto">
      <button
        v-for="item in menuItems"
        :key="item.name"
        :class="getMenuItemClasses(item.path)"
        @click="navigateToRoute(item.path)"
        :title="collapsed ? item.name : ''"
      >
        <!-- Ícone do item -->
        <div
          :class="
            collapsed ? 'flex justify-center w-full' : 'flex-shrink-0 pr-2'
          "
          class="transition-all duration-300"
        >
          <component
            :is="getMenuIcon(item.icon)"
            :class="getIconClasses(item.path)"
          />
        </div>

        <!-- Nome do item (oculto quando colapsado) -->
        <span v-if="!collapsed" class="font-medium text-sm truncate">
          {{ item.name }}
        </span>

        <!-- Indicador de item ativo -->
        <div
          v-if="isActiveRoute(item.path) && !collapsed"
          class="ml-auto w-2 h-2 bg-primary rounded-full flex-shrink-0"
        />
      </button>
    </nav>

    <!-- Card do Usuário no Rodapé -->
    <div
      :class="
        collapsed ? 'p-2 border-t border-border' : 'p-4 border-t border-border'
      "
      class="flex-shrink-0"
      :style="{ 
        maxWidth: collapsed ? '4rem' : '16rem',
        width: '100%',
        boxSizing: 'border-box'
      }"
    >
      <!-- Dropdown do usuário -->
      <Dropdown
        :position="collapsed ? 'right' : 'top-right'"
        :width="collapsed ? 'sm' : 'trigger'"
        :close-on-click-outside="true"
      >
        <!-- Trigger do dropdown - Card do usuário -->
        <template #trigger="{ isOpen }">
          <div
            class="bg-muted hover:bg-accent transition-colors cursor-pointer rounded-lg w-full max-w-full overflow-hidden"
            :class="[
              collapsed ? 'p-2' : 'p-3',
              isOpen ? 'bg-accent' : ''
            ]"
            style="box-sizing: border-box;"
          >
            <div
              class="flex items-center w-full max-w-full overflow-hidden"
              :class="collapsed ? 'justify-center' : 'space-x-3'"
              style="box-sizing: border-box;"
            >
              <!-- Foto do Usuário - tamanho ajustado para modo colapsado -->
              <div class="relative flex-shrink-0">
                <img
                  v-if="user?.avatar_url"
                  :src="user.avatar_url"
                  :alt="user.name || 'Usuário'"
                  :class="collapsed ? 'w-8 h-8' : 'w-10 h-10'"
                  class="rounded-full object-cover border-2 border-border transition-all duration-300"
                />
                <!-- Avatar padrão caso não tenha foto -->
                <div
                  v-else
                  :class="collapsed ? 'w-8 h-8' : 'w-10 h-10'"
                  class="rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center border-2 border-border transition-all duration-300"
                >
                  <span
                    :class="collapsed ? 'text-xs' : 'text-sm'"
                    class="text-white font-medium transition-all duration-300"
                  >
                    {{ getUserInitials(user?.name) }}
                  </span>
                </div>
              </div>

              <!-- Informações do Usuário (ocultas quando colapsado) -->
              <div v-if="!collapsed" class="flex-1 min-w-0 overflow-hidden" style="box-sizing: border-box;">
                <p class="text-sm font-medium text-card-foreground truncate text-left">
                  {{ displayName }}
                </p>
                <p class="text-xs text-muted-foreground truncate text-left">
                  {{ displayEmail }}
                </p>
              </div>

              <!-- Ícone de configurações usando Heroicon (oculto quando colapsado) -->
              <div
                v-if="!collapsed"
                class="p-1 rounded-md transition-colors flex-shrink-0"
                :class="isOpen ? 'bg-accent' : 'hover:bg-accent'"
              >
                <EllipsisVerticalIcon class="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </template>

        <!-- Conteúdo do dropdown -->
        <template #content="{ close }">
          <DropdownItem
            :icon="UserIcon"
            label="Perfil"
            @click="handleProfileClick(close)"
          />
          <DropdownItem
            :icon="ArrowRightOnRectangleIcon"
            label="Sair"
            variant="destructive"
            @click="handleLogoutClick(close)"
          />
        </template>
      </Dropdown>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  CalendarDaysIcon,
  Squares2X2Icon,
  BeakerIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  UserGroupIcon,
  EllipsisVerticalIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/vue/24/outline";
import { useAuth } from "~/composables/core/useAuth";
import Dropdown from "~/components/ui/Dropdown.vue";
import DropdownItem from "~/components/ui/DropdownItem.vue";
import type { User } from "~/features/auth/types/auth";

// Composables
const { user, logout } = useAuth();
const router = useRouter();
const route = useRoute();

// Props do componente
interface SidebarProps {
  /** Estado de colapso da sidebar */
  collapsed?: boolean;
}

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsed: false,
});

// Emits para comunicação com componente pai (removido toggle-collapse)
const emit = defineEmits<{}>();

// Classes dinâmicas da sidebar baseadas no estado de colapso
const sidebarClasses = computed(() => {
  const baseClasses =
    "flex flex-col h-screen bg-card border-r border-border shadow-sm transition-all duration-300 ease-in-out relative z-50";

  if (props.collapsed) {
    return `${baseClasses} w-16`;
  } else {
    return `${baseClasses} w-64`;
  }
});

// Interface para itens do menu
interface MenuItem {
  name: string;
  path: string;
  icon: string;
}

// Itens do menu de navegação
const menuItems: MenuItem[] = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: "dashboard",
  },
  {
    name: "Especialidades",
    path: "/admin/especialidades",
    icon: "specialties",
  },
  {
    name: "Agendamentos",
    path: "/admin/agendamentos",
    icon: "appointments",
  },
  {
    name: "Clientes",
    path: "/admin/clientes",
    icon: "clients",
  },
  {
    name: "Profissionais",
    path: "/admin/profissionais",
    icon: "professionals",
  },
];

// Mapeamento de ícones do Heroicons
const iconMap = {
  dashboard: Squares2X2Icon,
  specialties: BeakerIcon,
  appointments: ClipboardDocumentListIcon,
  clients: UsersIcon,
  professionals: UserGroupIcon,
};

// Função para obter o ícone correto
const getMenuIcon = (iconName: string) => {
  return iconMap[iconName as keyof typeof iconMap] || Squares2X2Icon;
};

// Função para verificar se a rota está ativa
const isActiveRoute = (path: string): boolean => {
  return route.path === path || route.path.startsWith(path + "/");
};

// Função para obter as classes do ícone
const getIconClasses = (path: string) => {
  const baseClasses = props.collapsed ? "w-6 h-6" : "w-6 h-6";
  const isActive = isActiveRoute(path);

  if (isActive) {
    return `${baseClasses} text-primary`;
  } else {
    return `${baseClasses} text-muted-foreground group-hover:text-foreground`;
  }
};

// Função para obter as classes do item do menu
const getMenuItemClasses = (path: string) => {
  const baseClasses = [
    "flex items-center w-full text-left rounded-lg transition-all duration-200 group",
  ];

  // Ajustar padding baseado no estado de colapso
  const paddingClasses = props.collapsed
    ? "p-2.5 justify-center"
    : "px-3 py-2.5";

  const isActive = isActiveRoute(path);

  if (isActive) {
    return [
      ...baseClasses,
      paddingClasses,
      "bg-primary/10",
      "text-primary",
      "border border-primary/20",
      "shadow-sm",
    ];
  } else {
    return [
      ...baseClasses,
      paddingClasses,
      "text-card-foreground",
      "hover:bg-accent",
      "hover:text-accent-foreground",
      "focus:bg-accent",
      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    ];
  }
};

// Função para navegar para uma rota
const navigateToRoute = async (path: string) => {
  await router.push(path);
};

// Computed properties para exibição segura dos dados do usuário
const displayName = computed(() => {
  return user.value?.user_metadata?.full_name || user.value?.email || 'Usuário';
});

const displayEmail = computed(() => {
  return user.value?.email || 'email@exemplo.com';
});

// Função para obter as iniciais do nome do usuário
const getUserInitials = (name?: string): string => {
  if (!name) return "?";

  const names = name.trim().split(" ");
  if (names.length === 1) {
    return names[0]?.charAt(0).toUpperCase() || "U";
  }

  const firstName = names[0]?.charAt(0) || "";
  const lastName = names[names.length - 1]?.charAt(0) || "";
  return (firstName + lastName).toUpperCase() || "U";
};

// Handlers do dropdown do usuário
const handleProfileClick = async (closeDropdown: () => void) => {
  closeDropdown();
  if (!user.value) return; // evita navegação quando não autenticado
  await router.push('/admin/profile');
};

const handleLogoutClick = async (closeDropdown: () => void) => {
  closeDropdown();
  if (!user.value) return; // sem usuário, nada a fazer
  try {
    await logout();
    await router.push('/auth/login');
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
  }
};
</script>
