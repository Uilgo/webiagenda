import { computed } from "vue";
import { useCookie } from "#app";

/**
 * Composable para gerenciar o estado da sidebar com persistência via cookie (SSR-safe)
 * Mantém o estado de colapso/expansão da sidebar entre recarregamentos da página
 */
export const useSidebar = () => {
  const collapsedCookie = useCookie<boolean>("webiagenda-sidebar-collapsed", {
    default: () => false,
    maxAge: 60 * 60 * 24 * 365, // 1 ano
  });

  const isCollapsed = computed({
    get: () => collapsedCookie.value ?? false,
    set: (value: boolean) => {
      collapsedCookie.value = value;
    },
  });

  const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value;
  };

  const setSidebarCollapsed = (collapsed: boolean) => {
    isCollapsed.value = collapsed;
  };

  return {
    isCollapsed,
    toggleSidebar,
    setSidebarCollapsed,
  };
};
