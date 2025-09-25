import { ref } from "vue";
import type {
  ProfissionalRPC,
  Especialidades,
} from "../../../shared/types/database";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Composable para buscar profissionais via RPC `get_profissionais`.
 */
export const useProfissionais = () => {
  const profissionais = ref<ProfissionalRPC[]>([]);

  const fetchProfissionais = async () => {
    const client = useSupabaseClient() as SupabaseClient;

    const { data, error } = await client.rpc("get_profissionais");

    if (error) {
      console.error("Erro ao buscar profissionais:", error);
      throw error;
    }

    // Normaliza o retorno para o tipo esperado
    try {
      if (!data) {
        profissionais.value = [];
        return;
      }

      // Supabase pode retornar tipos any; tentamos mapear para ProfissionalRPC
      if (Array.isArray(data)) {
        profissionais.value = data.map((d: any) => ({
          nome_do_profissional: d.nome_do_profissional ?? d.nome ?? null,
          especialidade_do_profissional:
            d.especialidade_do_profissional ?? d.especialidade ?? null,
          id_do_profissional: d.id_do_profissional ?? d.id ?? null,
          id_do_perfil: d.id_do_perfil ?? d.id_perfil ?? null,
          id_da_especialidade:
            d.id_da_especialidade ?? d.id_especialidade ?? null,
        })) as ProfissionalRPC[];
      } else if (typeof data === "object") {
        // Caso venha um objeto único ou formato inesperado
        profissionais.value = [data as ProfissionalRPC];
      } else {
        profissionais.value = [];
      }
    } catch (e) {
      console.error(
        "Erro ao normalizar retorno de get_profissionais:",
        e,
        data
      );
      profissionais.value = [];
    }
  };
  // --- helper para buscar especialidades (exposto dentro de useProfissionais para UI de profissionais)
  const especialidades = ref<Especialidades[]>([]);

  const fetchEspecialidades = async () => {
    const client = useSupabaseClient();
    const { data, error } = await (client.from("especialidades") as any).select(
      "*"
    );

    if (error) {
      console.error(
        "Erro ao buscar especialidades (via useProfissionais):",
        error
      );
      throw error;
    }

    especialidades.value = data || [];
  };

  /**
   * Insere um profissional via RPC 'inserir_profissional'
   */
  const insertProfissional = async (
    p_id_perfil: number | null,
    p_id_especialidade: number | null
  ) => {
    const client = useSupabaseClient() as SupabaseClient;
    // O RPC espera os nomes: p_especialidade_id e p_profile_id
    const { data, error } = await client.rpc("inserir_profissional", {
      p_especialidade_id: p_id_especialidade,
      p_profile_id: p_id_perfil,
    } as any);

    if (error) {
      console.error("Erro ao inserir profissional:", error);
      return { message: "Erro ao inserir profissional.", success: false };
    }

    try {
      if (Array.isArray(data) && data.length > 0) return data[0];
      if (data && typeof data === "object") return data;
      return { success: true, message: "Profissional criado." };
    } catch (e) {
      console.error(
        "Erro ao normalizar retorno do RPC inserir_profissional:",
        e,
        data
      );
      return {
        success: true,
        message: "Profissional criado (retorno inesperado).",
      };
    }
  };

  /**
   * Edita um profissional via RPC 'editar_profissional'
   */
  // Edita um profissional via RPC 'editar_profissional'
  // Observação: o RPC espera apenas o id do profissional (p_id) e a especialidade (p_especialidade_id).
  const editProfissional = async (
    p_id: string | number,
    p_id_especialidade: number | null
  ) => {
    const client = useSupabaseClient() as SupabaseClient;
    // o RPC espera os nomes: p_especialidade_id e p_id
    const { data, error } = await client.rpc("editar_profissional", {
      p_especialidade_id: p_id_especialidade,
      p_id,
    } as any);

    if (error) {
      console.error("Erro ao editar profissional:", error);
      return { message: "Erro ao editar profissional.", success: false };
    }

    try {
      if (Array.isArray(data) && data.length > 0) return data[0];
      if (data && typeof data === "object") return data;
      return { success: true, message: "Profissional atualizado." };
    } catch (e) {
      console.error(
        "Erro ao normalizar retorno do RPC editar_profissional:",
        e,
        data
      );
      return {
        success: true,
        message: "Profissional atualizado (retorno inesperado).",
      };
    }
  };

  /**
   * Deleta um profissional via RPC 'deletar_profissional'
   */
  const deleteProfissional = async (p_id: string | number) => {
    const client = useSupabaseClient() as SupabaseClient;
    // garantir que enviamos um number (bigint) para o RPC
    const idNum = Number(p_id);
    if (Number.isNaN(idNum)) {
      console.error("ID do profissional inválido:", p_id);
      return { message: "ID do profissional inválido.", success: false };
    }

    const { data, error } = await client.rpc("deletar_profissional", {
      p_id: idNum,
    } as any);

    if (error) {
      console.error("Erro ao deletar profissional:", error);
      return { message: "Erro ao deletar profissional.", success: false };
    }

    try {
      if (Array.isArray(data) && data.length > 0) return data[0];
      if (data && typeof data === "object") return data;
      return { success: true, message: "Profissional deletado." };
    } catch (e) {
      console.error(
        "Erro ao normalizar retorno do RPC deletar_profissional:",
        e,
        data
      );
      return {
        success: true,
        message: "Profissional deletado (retorno inesperado).",
      };
    }
  };

  return {
    profissionais,
    fetchProfissionais,
    insertProfissional,
    editProfissional,
    deleteProfissional,
    especialidades,
    fetchEspecialidades,
  };
};
