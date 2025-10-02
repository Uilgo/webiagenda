<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- ThemeToggle no canto superior direito -->
      <div class="absolute top-4 right-4 z-10">
        <ThemeToggle variant="ghost" size="md" />
      </div>

      <!-- Formulário de Recuperação de Senha -->
      <ResetPasswordForm
        :loading="loading"
        :general-error="generalError"
        :password-updated="passwordUpdated"
        @submit="handleResetPassword"
        @go-to-login="() => router.push('/admin/dashboard')"
        @back-to-login="() => router.push('/auth?form=forgot-password')"
      />

      <!-- Mensagem de redirecionamento automático (opcional) -->
      <Transition name="fade">
        <div
          v-if="showRedirectMessage"
          class="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-md text-center"
        >
          <p class="text-sm text-primary-foreground">
            Redirecionando para o dashboard em 3 segundos...
          </p>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { useRouter, useRoute } from "#app";
import { useSeoMeta } from "#imports";
import ResetPasswordForm from "../../features/auth/components/ResetPasswordForm.vue";
import ThemeToggle from "../../components/ui/ThemeToggle.vue";
import { useAuth } from "../../composables/core/useAuth";
import { useSupabaseUser } from "#imports";
import { useToast } from "../../composables/ui/useToast";

// Composables
const router = useRouter();
const route = useRoute();
const toast = useToast();
const { changePassword, isAuthenticated, logout } = useAuth();
const supabaseUser = useSupabaseUser();

// Estados reativos
const loading = ref(false);
const generalError = ref("");
const passwordUpdated = ref(false);
const showRedirectMessage = ref(false);
const redirectTimeout = ref<NodeJS.Timeout | null>(null);

// Flag para modo recovery - bloqueia redirecionamentos automáticos
const recoveryMode = ref(false);

// Configuração de SEO
useSeoMeta({
  title: "Recuperar Senha - WebiAgenda",
  description: "Defina uma nova senha para sua conta no WebiAgenda.",
  ogTitle: "Recuperar Senha - WebiAgenda",
  ogDescription: "Atualize sua senha e acesse sua conta no WebiAgenda.",
});

// Verificar se o usuário está autenticado via link de recuperação
onMounted(async () => {
  const query = route.query as any;
  const { type, error, error_code, error_description } = query;

  console.log('Recovery onMounted - query:', query); // Debug

  // Verifica erros do Supabase na URL
  if (error) {
    let errorMsg = 'Erro na recuperação de senha. Tente novamente.';
    if (error_description) {
      const decodedDesc = decodeURIComponent(error_description);
      if (decodedDesc.includes('expired') || error_code === 'otp_expired') {
        errorMsg = 'O link de recuperação expirou. Solicite um novo.';
      } else if (decodedDesc.includes('invalid') || error === 'access_denied') {
        errorMsg = 'Link de recuperação inválido. Faça uma nova solicitação.';
      } else {
        errorMsg = decodedDesc;
      }
    }
    generalError.value = errorMsg;
    toast.error(errorMsg);

    // Logout se autenticado com token inválido
    if (supabaseUser.value) {
      logout();
    }

    // Limpa URL e redireciona
    router.replace({ query: {}, hash: '' });
    setTimeout(() => {
      router.push('/auth?form=forgot-password');
    }, 3000);
    return;
  }

  if (type !== 'recovery') {
    generalError.value = 'Acesso inválido. Use o link enviado por email.';
    toast.error(generalError.value);
    setTimeout(() => {
      router.push('/auth?form=forgot-password');
    }, 2000);
    return;
  }

  recoveryMode.value = true;
  console.log('Recovery mode activated - blocking redirects');

  // Aguarda o Supabase processar o token de recovery (polling para 10s)
  const waitForUser = () => {
    if (supabaseUser.value) {
      console.log('User authenticated via recovery token - ready for password reset');
      return true;
    }
    return false;
  };

  if (waitForUser()) {
    return;
  }

  const maxWait = 10000;
  let waited = 0;
  const interval = setInterval(() => {
    waited += 500;
    if (waitForUser()) {
      clearInterval(interval);
      return;
    }
    if (waited >= maxWait) {
      clearInterval(interval);
      generalError.value = 'Falha ao processar link de recuperação. Tente novamente.';
      toast.error(generalError.value);
      if (supabaseUser.value) logout();
      nextTick(() => {
        router.push('/auth?form=forgot-password');
      });
      recoveryMode.value = false;
    }
  }, 500);
});

// Handler para reset de senha
const handleResetPassword = async (data: {
  newPassword: string;
  confirmPassword: string;
}) => {
  if (data.newPassword !== data.confirmPassword) {
    generalError.value = "As senhas não coincidem";
    return;
  }

  try {
    loading.value = true;
    generalError.value = "";

    const result = await changePassword(data.newPassword);

    if (result.success) {
      passwordUpdated.value = true;
      recoveryMode.value = false; // Desativa modo recovery para permitir redirect
      toast.success("Senha atualizada com sucesso!");

      // Iniciar redirecionamento automático para dashboard
      showRedirectMessage.value = true;
      redirectTimeout.value = setTimeout(() => {
        router.push('/admin/dashboard');
      }, 3000);
    } else {
      generalError.value = result.error || "Erro ao atualizar a senha";
      toast.error(generalError.value);
    }
  } catch (error) {
    console.error("Erro na recuperação de senha:", error);
    const errorMsg = "Erro inesperado. Tente novamente.";
    generalError.value = errorMsg;
    toast.error(errorMsg);
  } finally {
    loading.value = false;
  }
};

// Limpar timeout ao desmontar
onUnmounted(() => {
  if (redirectTimeout.value) {
    clearTimeout(redirectTimeout.value);
  }
  recoveryMode.value = false;
});

// Se o usuário já está autenticado normalmente, redireciona para dashboard
watch(
  isAuthenticated,
  (authenticated) => {
    // Bloqueia redirecionamento durante recovery mode
    if (recoveryMode.value) {
      console.log('Redirect blocked - in recovery mode');
      return;
    }
    if (authenticated && supabaseUser.value) {
      console.log('Auth redirect to dashboard');
      router.push('/admin/dashboard');
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
