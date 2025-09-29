import type { Agendamento } from "../../../shared/types/database";
import { useSupabaseClient } from "#imports";
import { useAgendamentoStore } from "../../../stores/agendamento";

/**
 * Composable para gerenciar operações relacionadas a agendamentos.
 * Atualmente, inclui apenas a função para buscar agendamentos por ID do profissional,
 * excluindo os cancelados.
 */
export const useAgendamento = () => {
  const supabase = useSupabaseClient();

  /**
   * Busca agendamentos para um profissional específico em um período de datas, excluindo cancelados.
   * @param profissionalId - ID do profissional para filtrar os agendamentos.
   * @param startDate - Data de início do período (início da semana).
   * @param endDate - Data de fim do período (fim da semana).
   * @returns Array de agendamentos ou erro se a consulta falhar.
   */
  const fetchAgendamentosByProfissional = async (
    profissionalId: number,
    startDate: Date,
    endDate: Date
  ): Promise<Agendamento[]> => {
    // Primeiro tente retornar a versão hidratada na store (SSR). Se existir,
    // filtramos pelo intervalo de datas solicitado para manter a compatibilidade.
    try {
      const agStore = useAgendamentoStore();
      const hydrated = agStore.getAgendamentosForProfissional(profissionalId);
      if (hydrated && hydrated.length > 0) {
        // filtrar por data entre startDate e endDate
        const startISO = String(startDate!.toISOString().split("T")[0]);
        const endISO = String(endDate!.toISOString().split("T")[0]);
        const filtered = (hydrated as Agendamento[]).filter((a) => {
          if (!a || !a.data) return false;
          const dt = a.data as string;
          // cancelado pode ser null -> tratamos apenas como excluído quando === true
          const notCanceled = a.cancelado !== true;
          return dt >= startISO && dt <= endISO && notCanceled;
        });
        return filtered;
      }
    } catch (e) {
      // se algo falhar, seguem para o fetch remoto
      console.error("Erro ao ler agendamentos hidratados da store:", e);
    }
    const { data, error } = await supabase
      .from("agendamentos")
      .select("*")
      .eq("profissionais_id", profissionalId)
      .gte("data", startDate.toISOString().split("T")[0])
      .lte("data", endDate.toISOString().split("T")[0])
      .eq("cancelado", false)
      .order("data", { ascending: true })
      .order("hora_inicio", { ascending: true });

    if (error) {
      console.error("Erro ao buscar agendamentos:", error);
      throw error;
    }

    return data as Agendamento[];
  };

  /**
   * Busca todos os agendamentos para um profissional específico, excluindo cancelados.
   * @param profissionalId - ID do profissional para filtrar os agendamentos.
   * @returns Array de agendamentos ou erro se a consulta falhar.
   */
  const fetchAllAgendamentosByProfissional = async (
    profissionalId: number,
    force = false
  ): Promise<Agendamento[]> => {
    // Retornar dados hidratados se existirem, a menos que force=true
    if (!force) {
      try {
        const agStore = useAgendamentoStore();
        const hydrated = agStore.getAgendamentosForProfissional(profissionalId);
        if (hydrated && hydrated.length > 0) return hydrated;
      } catch (e) {
        // segue para fetch caso a leitura falhe
        console.error("Erro ao ler agendamentos hidratados da store:", e);
      }
    }

    const { data, error } = await supabase
      .from("agendamentos")
      .select("*")
      .eq("profissionais_id", profissionalId)
      .eq("cancelado", false)
      .order("data", { ascending: true })
      .order("hora_inicio", { ascending: true });

    if (error) {
      console.error("Erro ao buscar todos os agendamentos:", error);
      throw error;
    }

    // atualiza a store local para manter consistência
    try {
      const agStore = useAgendamentoStore();
      if (data)
        agStore.setAgendamentosForProfissional(
          profissionalId,
          data as Agendamento[]
        );
    } catch (e) {
      console.error("Erro ao atualizar store com agendamentos fetchados:", e);
    }

    return data as Agendamento[];
  };

  /**
   * Insere um novo agendamento diretamente na tabela `agendamentos`.
   * NÃO envia `id`, `created_at` ou `user_id` — esses campos são definidos pelo Supabase/DB.
   * Formata os horários como 'HH:MM:00-03:00' para representar timetz (GMT-3).
   * @param clienteId - ID do cliente.
   * @param cor - Cor do agendamento (opcional, tem valor default no DB).
   * @param data - Data do agendamento no formato YYYY-MM-DD.
   * @param descricao - Descrição do agendamento.
   * @param horaFim - Hora de fim no formato HH:MM.
   * @param horaInicio - Hora de início no formato HH:MM.
   * @param profissionaisId - ID do profissional.
   * @param titulo - Título do agendamento.
   * @returns Os dados do agendamento inserido ou lança erro se falhar.
   */
  const inserirAgendamento = async (
    clienteId: number,
    cor: string,
    data: string,
    descricao: string,
    horaFim: string,
    horaInicio: string,
    profissionaisId: number,
    titulo: string
  ): Promise<Agendamento> => {
    // Formata os horários para incluir segundos e offset de Brasília (GMT-3)
    const formattedHoraInicio = `${horaInicio}:00-03:00`;
    const formattedHoraFim = `${horaFim}:00-03:00`;

    const payload = {
      profissionais_id: profissionaisId,
      cliente_id: clienteId,
      data,
      hora_inicio: formattedHoraInicio,
      hora_fim: formattedHoraFim,
      titulo,
      descricao,
      cor,
    };

    const { data: result, error } = await (supabase as any)
      .from("agendamentos")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("Erro ao inserir agendamento:", error);
      throw error;
    }

    return result as Agendamento;
  };

  /**
   * Atualiza apenas campos permitidos de um agendamento existente.
   * Não usa RPC — realiza um UPDATE direto na tabela `agendamentos`.
   * A autorização/controle (RLS) será gerenciado no Supabase.
   * Campos permitidos: `titulo`, `descricao`, `cor`.
   * @param id - ID do agendamento a ser editado
   * @param titulo - novo título (opcional)
   * @param descricao - nova descrição (opcional)
   * @param cor - nova cor (opcional)
   * @returns Agendamento atualizado ou lança erro
   */
  const editarAgendamento = async (
    id: number,
    titulo?: string,
    descricao?: string,
    cor?: string
  ): Promise<Agendamento> => {
    const updates = {
      ...(titulo !== undefined && { titulo }),
      ...(descricao !== undefined && { descricao }),
      ...(cor !== undefined && { cor }),
    };

    if (Object.keys(updates).length === 0) {
      throw new Error("Nenhum campo fornecido para atualizar");
    }

    // Tenta atualizar e retornar os campos atualizados.
    // Usamos .select(...) sem .single() para evitar erros quando a query
    // retornar zero linhas (por RLS/permissões). Verificamos manualmente.
    const { data, error } = await (supabase as any)
      .from("agendamentos")
      .update(updates)
      .eq("id", id)
      .select("id, titulo, descricao, cor");

    if (error) {
      console.error("Erro ao editar agendamento:", error);
      throw error;
    }

    // Quando nada é retornado, provavelmente o registro não existe ou a
    // política RLS bloqueou a operação. Informamos isso claramente.
    if (!data || (Array.isArray(data) && data.length === 0)) {
      const err: any = new Error(
        "Nenhum registro atualizado no servidor. Verifique se o agendamento existe e se as políticas RLS permitem UPDATE para este usuário."
      );
      // marca para consumidores distinguirem do erro de rede genérico
      err.code = "NO_ROWS_UPDATED";
      throw err;
    }

    const returned = Array.isArray(data) ? (data as any)[0] : data;
    return returned as Agendamento;
  };

  return {
    fetchAgendamentosByProfissional,
    fetchAllAgendamentosByProfissional,
    inserirAgendamento,
    editarAgendamento,
  };
};
