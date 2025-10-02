import { ref, computed } from "vue";
import type { AuthError } from "@supabase/supabase-js";
import type {
  LoginCredentials,
  AuthResponse,
  User,
} from "../../features/auth/types/auth";
import type { Database } from "../../../shared/types/database";
import { useUserStore } from "../../../stores/user";

/**
 * Composable para gerenciamento de autenticação usando Supabase
 * Fornece funcionalidades de login e logout com gerenciamento de estado do usuário
 */
export const useAuth = () => {
  // Cliente Supabase e usuário reativo
  const supabase = useSupabaseClient<Database>();
  const supabaseUser = useSupabaseUser();
  const router = useRouter();

  // Estados reativos para controle de loading e erros
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Computed para verificar se o usuário está autenticado
  const isAuthenticated = computed(() => !!supabaseUser.value);

  // Computed para obter dados do usuário de forma segura com tipagem customizada
  const user = computed((): User | null => {
    if (!supabaseUser.value) return null;

    // Retorna o usuário do Supabase com tipagem customizada
    return supabaseUser.value as User;
  });

  // Computed para obter dados do usuário de forma segura (mantido para compatibilidade)
  const currentUser = computed(() => user.value);

  /**
   * Limpa erros de autenticação
   */
  const clearError = () => {
    error.value = null;
  };

  /**
   * Realiza o login do usuário
   * @param credentials - Credenciais de login (email, senha, lembrar)
   * @returns Promise com resultado da operação
   */
  const login = async (
    credentials: LoginCredentials
  ): Promise<AuthResponse> => {
    try {
      isLoading.value = true;
      error.value = null;

      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email: credentials.email,
          password: credentials.password,
        }
      );

      if (authError) {
        // Tratamento de erros específicos do Supabase
        const errorMessage = getAuthErrorMessage(authError);
        error.value = errorMessage;

        return {
          success: false,
          error: errorMessage,
        };
      }

      if (data.user) {
        // Login bem-sucedido - redireciona para dashboard administrativo
        await router.push("/admin/dashboard");

        return {
          success: true,
          user: data.user,
        };
      }

      return {
        success: false,
        error: "Erro inesperado durante o login",
      };
    } catch (err) {
      const errorMessage = "Erro de conexão. Tente novamente.";
      error.value = errorMessage;

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Realiza o logout do usuário
   * @returns Promise com resultado da operação
   */
  const logout = async (): Promise<AuthResponse> => {
    try {
      isLoading.value = true;
      error.value = null;

      const { error: authError } = await supabase.auth.signOut();

      if (authError) {
        const errorMessage = "Erro ao fazer logout. Tente novamente.";
        error.value = errorMessage;

        return {
          success: false,
          error: errorMessage,
        };
      }

      // Limpa o store do usuário após logout bem-sucedido
      const userStore = useUserStore();
      userStore.clearUser();

      // Logout bem-sucedido - redireciona para página de autenticação
      await router.push("/auth/login");

      return {
        success: true,
      };
    } catch (err) {
      const errorMessage = "Erro de conexão durante o logout.";
      error.value = errorMessage;

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Altera a senha do usuário autenticado
   * @param newPassword - A nova senha
   * @returns Promise<AuthResponse>
   */
  const changePassword = async (newPassword: string): Promise<AuthResponse> => {
    try {
      isLoading.value = true;
      error.value = null;

      const { data, error: authError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (authError) {
        const errorMessage = getAuthErrorMessage(authError);
        error.value = errorMessage;

        return {
          success: false,
          error: errorMessage,
        };
      }

      return {
        success: true,
      };
    } catch (err) {
      const errorMessage =
        "Erro de conexão ao alterar a senha. Tente novamente.";
      error.value = errorMessage;

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Edita o nome do usuário autenticado
   * @param newName - O novo nome
   * @returns Promise<{ success: boolean; message: string }>
   */
  const editName = async (
    newName: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      isLoading.value = true;
      error.value = null;

      const rpcResult = await (supabase.rpc as any)("editar_nome", {
        p_nome: newName,
      });
      const { data, error: rpcError } = rpcResult;

      if (rpcError) {
        const errorMessage =
          rpcError.message || "Erro ao editar o nome. Tente novamente.";
        error.value = errorMessage;

        return {
          success: false,
          message: errorMessage,
        };
      }

      // Atualiza o store do usuário se disponível
      const userStore = useUserStore();
      if (userStore.profile) {
        userStore.profile.nome = newName;
      }

      return {
        success: true,
        message:
          (data as { success: boolean; message: string }).message ||
          "Nome atualizado com sucesso!",
      };
    } catch (err: any) {
      const errorMessage = "Erro de conexão ao editar o nome. Tente novamente.";
      error.value = errorMessage;

      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Solicita reset de senha enviando email de recuperação
   * @param email - Email do usuário
   * @returns Promise<AuthResponse>
   */
  const forgotPassword = async (email: string): Promise<AuthResponse> => {
    try {
      isLoading.value = true;
      error.value = null;

      const { data, error: authError } =
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/recover`,
        });

      if (authError) {
        const errorMessage = getAuthErrorMessage(authError);
        error.value = errorMessage;

        return {
          success: false,
          error: errorMessage,
        };
      }

      return {
        success: true,
      };
    } catch (err) {
      const errorMessage = "Erro de conexão. Tente novamente.";
      error.value = errorMessage;

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Verifica se o usuário atual é administrador
   * @returns Promise<boolean> - true se é admin, false caso contrário
   */
  const isAdmin = async (): Promise<boolean> => {
    try {
      if (!isAuthenticated.value) return false;

      const { data, error } = await supabase.rpc("isadmin");

      if (error) {
        console.error("Erro ao verificar se é admin:", error);
        return false;
      }

      return (data as { isAdmin: boolean })?.isAdmin ?? false;
    } catch (err) {
      console.error("Erro ao verificar se é admin:", err);
      return false;
    }
  };

  /**
   * Converte erros do Supabase em mensagens amigáveis
   * @param authError - Erro retornado pelo Supabase
   * @returns Mensagem de erro traduzida
   */
  const getAuthErrorMessage = (authError: AuthError): string => {
    switch (authError.message) {
      case "Invalid login credentials":
        return "Email ou senha incorretos";
      case "Email not confirmed":
        return "Email não confirmado. Verifique sua caixa de entrada.";
      case "Unable to validate email address: invalid format":
        return "Formato de email inválido";
      case "Password should be at least 6 characters":
        return "A senha deve ter pelo menos 6 caracteres";
      case "New password cannot be the same as the old password":
        return "A nova senha não pode ser a mesma da senha atual";
      case "Invalid password":
        return "Senha inválida. Verifique os requisitos de segurança.";
      default:
        return authError.message || "Erro de autenticação";
    }
  };

  // Retorna todas as funcionalidades e estados do composable
  return {
    // Estados reativos
    user,
    isAuthenticated,
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Métodos de autenticação
    login,
    logout,
    changePassword,
    editName,
    forgotPassword,
    isAdmin,

    // Utilitários
    clearError,
  };
};
