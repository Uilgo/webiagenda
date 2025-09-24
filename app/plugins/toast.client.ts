import { defineNuxtPlugin } from '#app'
import Toast, { POSITION, type PluginOptions, useToast } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

/**
 * Plugin do Vue Toastification para Nuxt 4
 * Configura as notificações toast globalmente na aplicação
 */
export default defineNuxtPlugin((nuxtApp) => {
  // Configurações do Toastification
  const options: PluginOptions = {
    // Posição dos toasts na tela
    position: POSITION.TOP_RIGHT,

    // Tempo de exibição em milissegundos (5 segundos)
    timeout: 5000,

    // Permitir fechar clicando no toast
    closeOnClick: true,

    // Pausar timer quando hover
    pauseOnFocusLoss: true,
    pauseOnHover: true,

    // Permitir arrastar para fechar
    draggable: true,
    draggablePercent: 0.6,

    // Mostrar barra de progresso
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",

    // Ícone padrão
    icon: true,

    // Máximo de toasts simultâneos
    maxToasts: 20,

    // Comportamento de novos toasts quando há muitos
    newestOnTop: true,

    // Transições
    transition: "Vue-Toastification__bounce",

    // Container personalizado
    container: document.body,

    // Classes CSS personalizadas para integração com Tailwind
    toastClassName: "vue-toast-custom",
    bodyClassName: ["vue-toast-body"],

    // Configurações de acessibilidade
    accessibility: {
      toastRole: "alert",
      closeButtonLabel: "Fechar notificação"
    }
  }

  // Registra o plugin no Vue
  nuxtApp.vueApp.use(Toast, options);

  const toast = useToast();

  nuxtApp.provide('toast', toast);

  // Remove the return block as nuxtApp.provide already handles global availability
  // return {
  //   provide: {
  //     toast,
  //   },
  // };
});