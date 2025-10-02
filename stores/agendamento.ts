import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Agendamento } from "../shared/types/database";

/**
 * Store de agendamentos com suporte a hidratação SSR.
 * Mantemos um mapa de agendamentos por `profissionais_id` para permitir
 * que o servidor escreva os agendamentos durante a renderização e o cliente
 * utilize os dados já presentes sem refetch.
 */
export const useAgendamentoStore = defineStore("agendamento", () => {
  const dataReferencia = ref(new Date());

  // mapa: profissionalId -> lista de agendamentos
  const agendamentosByProfissional = ref<Record<number, Agendamento[]>>({});

  const diasSemana = computed(() => {
    const refDate = dataReferencia.value;
    const startOfWeek = new Date(refDate);
    startOfWeek.setDate(refDate.getDate() - refDate.getDay());
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  });

  const avancarSemana = () => {
    const novaData = new Date(dataReferencia.value);
    novaData.setDate(novaData.getDate() + 7);
    dataReferencia.value = novaData;
  };

  const voltarSemana = () => {
    const novaData = new Date(dataReferencia.value);
    novaData.setDate(novaData.getDate() - 7);
    dataReferencia.value = novaData;
  };

  // --- Hidratação / acesso aos agendamentos por profissional ---
  const setAgendamentosForProfissional = (
    profissionalId: number,
    list: Agendamento[]
  ) => {
    if (!profissionalId) return;
    // clonamos para garantir reatividade
    agendamentosByProfissional.value = {
      ...agendamentosByProfissional.value,
      [profissionalId]: Array.isArray(list) ? list : [],
    };
  };

  const getAgendamentosForProfissional = (
    profissionalId: number
  ): Agendamento[] | undefined => {
    return agendamentosByProfissional.value[profissionalId];
  };

  const hasAgendamentosForProfissional = (profissionalId: number): boolean => {
    const v = agendamentosByProfissional.value[profissionalId];
    return Array.isArray(v) && v.length > 0;
  };
  
  const clearAgendamentos = () => {
    agendamentosByProfissional.value = {};
  };

  return {
    dataReferencia,
    diasSemana,
    avancarSemana,
    voltarSemana,
    // hidratação
    agendamentosByProfissional,
    setAgendamentosForProfissional,
    getAgendamentosForProfissional,
    hasAgendamentosForProfissional,
    clearAgendamentos,
  };
});
