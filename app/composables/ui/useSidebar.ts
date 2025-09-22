/**
 * Composable para gerenciar o estado da sidebar de forma compatível com SSR
 * Usa useState do Nuxt para evitar problemas de hidratação
 * Mantém o estado sincronizado entre servidor e cliente
 */
export const useSidebar = () => {
  // Estado reativo usando useState do Nuxt para compatibilidade SSR
  const isCollapsed = useState<boolean>('sidebar-collapsed', () => false);

  // Função para alternar o estado da sidebar
  const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value;
  };

  // Função para definir o estado da sidebar
  const setSidebarCollapsed = (collapsed: boolean) => {
    isCollapsed.value = collapsed;
  };

  return {
    isCollapsed: readonly(isCollapsed),
    toggleSidebar,
    setSidebarCollapsed,
  };
};
