import { useNuxtApp } from '#app';
import { type ToastInterface } from 'vue-toastification';

export const useToast = (): ToastInterface => {
  const nuxtApp = useNuxtApp();
  return nuxtApp.$toast;
};