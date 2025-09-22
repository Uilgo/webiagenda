/**
 * Composable para gerenciar o estado da sidebar de forma compatível com SSR
 * Usa useState do Nuxt para evitar problemas de hidratação
 * Mantém o estado sincronizado entre servidor e cliente
 * Inclui controle específico para dispositivos móveis
 */
export const useSidebar = () => {
  // Estado para colapso da sidebar usando useCookie para persistência automática
  const isCollapsed = useCookie<boolean>("sidebar-collapsed", { default: () => false });

  // Estado para controlar visibilidade em dispositivos móveis
  const isMobileVisible = useState<boolean>(
    "sidebar-mobile-visible",
    () => false
  );

  // Função para alternar o estado da sidebar (desktop - colapso)
  const toggleSidebar = () => {
    // Em dispositivos móveis, controla a visibilidade
    if (process.client && window.innerWidth < 1024) {
      isMobileVisible.value = !isMobileVisible.value;
    } else {
      // Em desktop, controla o colapso
      isCollapsed.value = !isCollapsed.value;
    }
  };

  // Função para definir o estado da sidebar (desktop)
  const setSidebarCollapsed = (collapsed: boolean) => {
    isCollapsed.value = collapsed;
  };

  // Função para controlar visibilidade móvel
  const setMobileVisible = (visible: boolean) => {
    isMobileVisible.value = visible;
  };

  // Função para fechar sidebar móvel
  const closeMobileSidebar = () => {
    isMobileVisible.value = false;
  };

  return {
    isCollapsed: readonly(isCollapsed),
    isMobileVisible: readonly(isMobileVisible),
    toggleSidebar,
    setSidebarCollapsed,
    setMobileVisible,
    closeMobileSidebar,
  };
};
