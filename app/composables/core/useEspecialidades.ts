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

      // Se sucesso, atualiza a lista
      if (normalized && normalized.success) {
        await fetchEspecialidades();
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
          await fetchEspecialidades();
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

  return {
    especialidades,
    fetchEspecialidades,
    insertEspecialidade,
  };
};
