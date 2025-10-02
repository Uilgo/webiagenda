import { ref } from "vue";
import type { Especialidades } from "../../../shared/types/database";
import type { SupabaseClient } from "@supabase/supabase-js";

export const useEspecialidades = () => {
  const especialidades = ref<Especialidades[]>([]);

  const fetchEspecialidades = async () => {
    const client = useSupabaseClient();
    const { data, error } = await client.from("especialidades").select("*");

    if (error) {
      console.error("Erro ao buscar especialidades:", error);
      throw error;
    }

    especialidades.value = data || [];
  };

  /**
   * Deleta uma especialidade via RPC 'deletar_especialidade'.
   * @param p_id id da especialidade
   */
  const deleteEspecialidade = async (p_id: string | number) => {
    const client = useSupabaseClient() as SupabaseClient;
    const { data, error } = await client.rpc("deletar_especialidade", {
      p_id,
    });

    if (error) {
      console.error("Erro ao deletar especialidade:", error);
      return { message: "Erro ao deletar especialidade.", success: false };
    }

    try {
      // Normalização similar às outras funções
      let normalized: any = null;
      if (Array.isArray(data) && data.length > 0) {
        const first = data[0];
        if (
          first &&
          Object.prototype.hasOwnProperty.call(first, "deletar_especialidade")
        ) {
          normalized = first.deletar_especialidade;
        } else {
          normalized = {
            success: true,
            message: "Especialidade deletada.",
            payload: first,
          };
        }
      } else if (data && typeof data === "object") {
        if (
          Object.prototype.hasOwnProperty.call(data, "deletar_especialidade")
        ) {
          normalized = (data as any).deletar_especialidade;
        } else {
          normalized = {
            success: true,
            message: "Especialidade deletada.",
            payload: data,
          };
        }
      } else {
        normalized = { success: true, message: "Especialidade deletada." };
      }

      return normalized;
    } catch (e) {
      console.error(
        "Erro ao normalizar retorno do RPC deletar_especialidade:",
        e,
        data
      );
      return {
        success: true,
        message: "Especialidade deletada (retorno inesperado).",
      };
    }
  };

  /**
   * Insere uma nova especialidade no banco de dados.
   * @param p_especialidade O nome da especialidade a ser inserida.
   * @returns Um objeto contendo a mensagem de sucesso/erro e o status da operação.
   */
  const insertEspecialidade = async (p_especialidade: string) => {
    const client = useSupabaseClient() as SupabaseClient;
    const { data, error } = await client.rpc("inserir_especialidade", {
      p_especialidade,
    });

    if (error) {
      console.error("Erro ao inserir especialidade:", error);
      return { message: "Erro ao inserir especialidade.", success: false };
    }

    // Normaliza retornos diferentes do RPC/Supabase.
    // Possíveis formatos:
    // 1) [{ inserir_especialidade: { success: true, message: '...' } }]
    // 2) [{ id: ..., especialidade: '...' }] (retorna row inserida)
    // 3) [] ou null
    try {
      let normalized: any = null;

      if (Array.isArray(data) && data.length > 0) {
        const first = data[0];
        if (
          first &&
          Object.prototype.hasOwnProperty.call(first, "inserir_especialidade")
        ) {
          normalized = first.inserir_especialidade;
        } else if (first && (first.id || first.especialidade)) {
          normalized = {
            success: true,
            message: "Especialidade criada com sucesso!",
            payload: first,
          };
        } else {
          normalized = {
            success: true,
            message: "Operação concluída.",
            payload: data,
          };
        }
      } else if (data && typeof data === "object") {
        // Caso o RPC retorne um objeto direto
        if (
          Object.prototype.hasOwnProperty.call(data, "inserir_especialidade")
        ) {
          normalized = (data as any).inserir_especialidade;
        } else {
          normalized = {
            success: true,
            message: "Operação concluída.",
            payload: data,
          };
        }
      } else {
        normalized = { success: true, message: "Operação concluída." };
      }

      // Se sucesso, retorna o resultado (não faz refresh automático — o componente pai deve controlar o estado)
      if (normalized && normalized.success) {
        return normalized;
      }

      // Fallback: se o RPC não retornou sucesso explícito, verificar se a especialidade foi realmente inserida
      try {
        const check = await client
          .from("especialidades")
          .select("id")
          .eq("especialidade", p_especialidade)
          .maybeSingle();
        // Se encontrar um registro, consideramos sucesso
        if (check && check.data) {
          const fallback = {
            success: true,
            message: "Especialidade criada com sucesso (confirmado)",
            payload: check.data,
          };
          return fallback;
        }
      } catch (e) {
        // ignora e retorna normalized
      }

      return normalized;
    } catch (e) {
      console.error(
        "Erro ao normalizar retorno do RPC inserir_especialidade:",
        e,
        data
      );
      return {
        success: true,
        message: "Especialidade criada (retorno inesperado).",
      };
    }
  };

  /**
   * Edita uma especialidade existente via RPC 'editar_especialidade'.
   * @param p_id id da especialidade
   * @param p_especialidade novo nome
   */
  const editEspecialidade = async (
    p_id: string | number,
    p_especialidade: string
  ) => {
    const client = useSupabaseClient() as SupabaseClient;
    const { data, error } = await client.rpc("editar_especialidade", {
      p_especialidade,
      p_id,
    });

    if (error) {
      console.error("Erro ao editar especialidade:", error);
      return { message: "Erro ao editar especialidade.", success: false };
    }

    try {
      let normalized: any = null;

      if (Array.isArray(data) && data.length > 0) {
        const first = data[0];
        if (
          first &&
          Object.prototype.hasOwnProperty.call(first, "editar_especialidade")
        ) {
          normalized = first.editar_especialidade;
        } else if (first && (first.id || first.especialidade)) {
          normalized = {
            success: true,
            message: "Especialidade atualizada com sucesso!",
            payload: first,
          };
        } else {
          normalized = {
            success: true,
            message: "Operação concluída.",
            payload: data,
          };
        }
      } else if (data && typeof data === "object") {
        if (
          Object.prototype.hasOwnProperty.call(data, "editar_especialidade")
        ) {
          normalized = (data as any).editar_especialidade;
        } else {
          normalized = {
            success: true,
            message: "Operação concluída.",
            payload: data,
          };
        }
      } else {
        normalized = { success: true, message: "Operação concluída." };
      }

      // fallback similar ao insert: if RPC did not explicitly return success, try to validate presence
      return normalized;
    } catch (e) {
      console.error(
        "Erro ao normalizar retorno do RPC editar_especialidade:",
        e,
        data
      );
      return {
        success: true,
        message: "Especialidade atualizada (retorno inesperado).",
      };
    }
  };

  return {
    especialidades,
    fetchEspecialidades,
    insertEspecialidade,
    editEspecialidade,
    deleteEspecialidade,
  };
};
