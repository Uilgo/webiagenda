<template>
  <div class="h-[calc(100vh-8rem)] flex flex-col overflow-y-auto pr-2">
    <!-- Header do Gerenciador de Agendamentos -->
    <div class="header flex flex-col gap-4 sticky top-0 z-20 bg-background">
      <div class="flex items-center justify-between">
        <SemanaControlador />
        <UserProfileDisplay @select="handleSelectProfissional" />
        <Button variant="primary" size="md" @click="isModalOpen = true"
          >Novo Agendamento</Button
        >
      </div>
      <ListaDias :dias="agendamentoStore.diasSemana" />
    </div>

    <!-- Corpo do Gerenciador de Agendamentos -->
    <div class="body grid grid-cols-8 flex-1">
      <ReguaHorarios class="col-span-1" />
      <ItemAgendamento
        v-for="dia in agendamentoStore.diasSemana"
        :key="dia.toISOString()"
        :data="dia"
        :all-agendamentos="allAgendamentos"
        class="col-span-1"
        @edit-agendamento="openEdit"
      />
    </div>
  </div>

  <AgendamentoModal
    v-model="isModalOpen"
    @save="handleSaveAgendamento"
    @cancel-agendamento="handleCancelAgendamento"
    @update-agendamento="handleUpdateAgendamento"
    :profissional-nome="profissionalNome"
    :profissional-id="profissionalId"
    :dias-semana="agendamentoStore.diasSemana"
    :clientes="allClientes"
    :all-agendamentos="allAgendamentos"
    :is-edicao="isEdicao"
    :initial-agendamento="selectedAgendamento"
  />
</template>
<script setup lang="ts">
import { onMounted, ref, watch, computed, nextTick } from "vue";
import { useSupabaseClient } from "#imports";
import type {
  Agendamento,
  Cliente,
  ProfissionalRPC,
} from "../../../../../shared/types/database";
import { useAgendamento } from "../../../../composables/core/useAgendamento";
import { useToast } from "../../../../composables/ui/useToast";
import SemanaControlador from "./SemanaControlador.vue";
import Button from "../../../../components/ui/Button.vue";
import UserProfileDisplay from "./UserProfileDisplay.vue";
import { useAgendamentoStore } from "../../../../../stores/agendamento";
import { useUserStore } from "../../../../../stores/user";
import ListaDias from "./ListaDias.vue";
import ReguaHorarios from "./ReguaHorarios.vue";
import ItemAgendamento from "./ItemAgendamento.vue";
import AgendamentoModal from "./AgendamentoModal.vue";

import { useClientes } from "../../../../composables/core/useClientes";

const toast = useToast();

const agendamentoStore = useAgendamentoStore();

const userStore = useUserStore();
const { clientes: allClientes, fetchClientes } = useClientes();
const {
  fetchAllAgendamentosByProfissional,
  inserirAgendamento,
  editarAgendamento,
  deletarAgendamento,
  cancelarAgendamento,
} = useAgendamento() as any;
const isModalOpen = ref(false);
const isEdicao = ref(false);
const selectedAgendamento = ref<any | null>(null);
const allAgendamentos = ref<Agendamento[]>([]);
// fullAgendamentos lido preferencialmente da store (pode ser hidratado no SSR)
const fullAgendamentosComputed = computed<Agendamento[]>(() => {
  // Prioridade: userStore.profissional -> store.agendamentosByProfissional
  const pidFromUser = userStore.profissional?.id_do_profissional ?? null;
  let pid: number | null = null;
  if (pidFromUser) pid = pidFromUser;
  else {
    // se não há profissional definido no userStore, mas o servidor hidratou agendamentos,
    // usamos a primeira key disponível em agendamentosByProfissional
    try {
      const keys = Object.keys(
        agendamentoStore.agendamentosByProfissional || {}
      );
      if (keys.length > 0) pid = Number(keys[0]);
    } catch (e) {
      pid = null;
    }
  }

  if (!pid) return [];
  const fromStore = agendamentoStore.getAgendamentosForProfissional(pid);
  return Array.isArray(fromStore) ? fromStore : [];
});
const cache = ref<Map<string, Agendamento[]>>(new Map());
const profissionalId = ref<number | null>(null);
const profissionalNome = ref<string>("");

const openEdit = (ag: any) => {
  selectedAgendamento.value = ag;
  isEdicao.value = true;
  isModalOpen.value = true;
};

watch(
  () => isModalOpen.value,
  (v) => {
    if (!v) {
      isEdicao.value = false;
      selectedAgendamento.value = null;
    }
  }
);

// Sincroniza profissionalId com userStore (ou com a chave hidratada)
const derivedProfissionalId = computed<number | null>(() => {
  if (userStore.profissional?.id_do_profissional)
    return userStore.profissional.id_do_profissional;
  try {
    const keys = Object.keys(agendamentoStore.agendamentosByProfissional || {});
    if (keys.length > 0) return Number(keys[0]);
  } catch (e) {
    /* ignore */
  }
  return null;
});

watch(
  derivedProfissionalId,
  (v) => {
    profissionalId.value = v;
    if (userStore.profissional)
      profissionalNome.value =
        userStore.profissional.nome_do_profissional || "";
    else profissionalNome.value = "";
  },
  { immediate: true }
);

onMounted(async () => {
  // Se já temos agendamentos hidratados no SSR (fullAgendamentosComputed), usamos direto.
  // Caso contrário, se houver um profissional conhecido, tentamos buscar do Supabase no client.
  const pid = derivedProfissionalId.value;

  if (pid) {
    try {
      const existing = fullAgendamentosComputed.value;
      if (!existing || existing.length === 0) {
        // só chama se não houver dados hidratados
        const fetched = await fetchAllAgendamentosByProfissional(pid);
        // se o composable retornou dados, atualizamos a store (o composable já faz isso indiretamente)
        // e o computed fullAgendamentosComputed refletirá os dados.
      }
      // monta a semana com os dados disponíveis
      loadAgendamentosForWeek();
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      allAgendamentos.value = [];
    }
    // Além disso, disparamos um fetch client-side forçado em background para que
    // a chamada apareça no Network do navegador (select=*). Não alteramos a
    // experiência do usuário pois a UI já usa os dados hidratados.
    try {
      // não aguardamos - roda em background
      fetchAllAgendamentosByProfissional(pid, true).catch((e: any) => {
        console.error("Erro no fetch client-side forçado de agendamentos:", e);
      });
    } catch (e) {
      // swallow
    }
  }

  await fetchClientes();
});

const handleSaveAgendamento = async (formData: {
  clienteId: number;
  cor?: string;
  data: string;
  descricao?: string;
  horaFim: string;
  horaInicio: string;
  titulo: string;
}) => {
  if (!userStore.user || !profissionalId.value) {
    console.error("Usuário ou ID do profissional não definido");
    toast.error("Usuário ou profissional não definido");
    return;
  }

  try {
    // Tenta inserir e usa o retorno para atualizar imediatamente a UI (optimistic update)
    const inserted: any = await inserirAgendamento(
      formData.clienteId,
      formData.cor || "",
      formData.data,
      formData.descricao || "",
      formData.horaFim,
      formData.horaInicio,
      profissionalId.value,
      formData.titulo
    );

    // Se o RPC retornou o agendamento inserido, normalizamos o objeto e atualizamos a store local imediatamente
    if (inserted && profissionalId.value) {
      try {
        // A RPC pode retornar um array ([row]) ou o objeto diretamente
        const payload = Array.isArray(inserted)
          ? (inserted as any)[0]
          : inserted;
        // Normaliza campos críticos para a UI: data no formato YYYY-MM-DD e horas HH:MM
        const normalizeDate = (d: any) => {
          if (!d) return null;
          if (typeof d === "string") {
            // já no formato YYYY-MM-DD
            if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
            // formato ISO com 'T'
            if (d.includes("T")) return d.split("T")[0];
            // pode ser '2025-09-28 00:00:00' ou com timezone
            const m = d.match(/^(\d{4}-\d{2}-\d{2})/);
            if (m) return m[1];
            const parsed = new Date(d);
            if (!isNaN(parsed.getTime())) return formatLocalDate(parsed);
          }
          if (d instanceof Date && !isNaN(d.getTime()))
            return formatLocalDate(d);
          return null;
        };

        const normalizeTime = (t: any) => {
          if (!t) return "00:00";
          if (typeof t === "string") {
            // extrai o primeiro par HH:MM encontrado em qualquer parte da string
            // funciona para '08:00:00-03:00', '2025-09-28T10:00:00Z', '10:00'
            const m = t.match(/(\d{2}:\d{2})/);
            if (m) return m[1];
          }
          // fallback: tenta criar Date e extrair horário local (menos preferível pois aplica timezone)
          const parsed = new Date(t);
          if (!isNaN(parsed.getTime())) {
            const hh = String(parsed.getHours()).padStart(2, "0");
            const mm = String(parsed.getMinutes()).padStart(2, "0");
            return `${hh}:${mm}`;
          }
          return "00:00";
        };

        const normalized: Agendamento = {
          // se o servidor retornou id, usa; caso contrário, usa um id temporário negativo
          id: (payload as any).id ?? -Date.now(),
          cliente_id: (payload as any).cliente_id ?? formData.clienteId,
          cor: ((payload as any).cor ?? formData.cor) || "",
          // Prioriza os valores do formulário (evita problemas de timezone/format retornados pelo RPC)
          data: formData.data ?? normalizeDate((payload as any).data) ?? "",
          descricao: (payload as any).descricao ?? formData.descricao ?? "",
          hora_inicio:
            formData.horaInicio ??
            normalizeTime((payload as any).hora_inicio) ??
            "00:00",
          hora_fim:
            formData.horaFim ??
            normalizeTime((payload as any).hora_fim) ??
            "00:00",
          titulo: (payload as any).titulo ?? formData.titulo ?? "",
          profissionais_id:
            (payload as any).profissionais_id ?? profissionalId.value,
          cancelado: (payload as any).cancelado ?? false,
        } as Agendamento;

        const current =
          agendamentoStore.getAgendamentosForProfissional(
            profissionalId.value
          ) || [];
        const newList = Array.isArray(current)
          ? [...current, normalized]
          : [normalized];
        agendamentoStore.setAgendamentosForProfissional(
          profissionalId.value,
          newList
        );
        // logs de debug removidos
      } catch (e) {
        console.error(
          "Erro ao atualizar store de agendamentos após inserção:",
          e
        );
      }

      // Atualiza view da semana atual imediatamente usando os dados locais
      cache.value.clear();
      const diasSemana = agendamentoStore.diasSemana;
      if (diasSemana.length > 0) {
        const start = diasSemana[0]!;
        const end = diasSemana[6]!;
        const startStr = formatLocalDate(start);
        const endStr = formatLocalDate(end);

        const full =
          agendamentoStore.getAgendamentosForProfissional(
            profissionalId.value
          ) || [];

        const weekData = (full as Agendamento[]).filter((ag: Agendamento) => {
          return ag.data && ag.data >= startStr && ag.data <= endStr;
        });

        allAgendamentos.value = weekData.sort(
          (a: Agendamento, b: Agendamento) => {
            const aDate = a.data || "";
            const bDate = b.data || "";
            if (aDate !== bDate) return aDate.localeCompare(bDate);
            const aHora = a.hora_inicio || "";
            const bHora = b.hora_inicio || "";
            return aHora.localeCompare(bHora);
          }
        );

        cache.value.set(startStr, allAgendamentos.value);
      }

      // Dispara um refetch em background para re-sincronizar com o servidor
      try {
        fetchAllAgendamentosByProfissional(profissionalId.value, true).catch(
          (e: any) => {
            console.error("Erro no refetch background de agendamentos:", e);
          }
        );
      } catch (e) {
        /* swallow */
      }
    } else {
      // fallback: se o RPC não retornou o registro, faz o refetch síncrono como antes
      const fetched = await fetchAllAgendamentosByProfissional(
        profissionalId.value
      );

      try {
        agendamentoStore.setAgendamentosForProfissional(
          profissionalId.value,
          fetched
        );
      } catch (e) {
        console.error(
          "Erro ao atualizar store de agendamentos após inserção:",
          e
        );
      }

      cache.value.clear();
      const diasSemana = agendamentoStore.diasSemana;
      if (diasSemana.length > 0) {
        const start = diasSemana[0]!;
        const end = diasSemana[6]!;
        const startStr = formatLocalDate(start);
        const endStr = formatLocalDate(end);

        const weekData = (fetched as Agendamento[]).filter(
          (ag: Agendamento) => {
            return ag.data && ag.data >= startStr && ag.data <= endStr;
          }
        );

        allAgendamentos.value = weekData.sort(
          (a: Agendamento, b: Agendamento) => {
            const aDate = a.data || "";
            const bDate = b.data || "";
            if (aDate !== bDate) return aDate.localeCompare(bDate);
            const aHora = a.hora_inicio || "";
            const bHora = b.hora_inicio || "";
            return aHora.localeCompare(bHora);
          }
        );

        cache.value.set(startStr, allAgendamentos.value);
      }
    }

    toast.success("Agendamento salvo com sucesso!");
    isModalOpen.value = false;
  } catch (error: any) {
    console.error("Erro ao salvar agendamento:", error);
    toast.error(`Erro ao salvar agendamento: ${error.message}`);
  }
};

// Cancela um agendamento: tenta persistir no backend; em caso de erro de rede
// faz uma tentativa de retry rápida antes de aplicar apenas a marcação local.
const handleCancelAgendamento = async (agendamentoId: number) => {
  try {
    let pid: number | null = profissionalId.value;
    let found: Agendamento | undefined;

    if (pid) {
      const list = agendamentoStore.getAgendamentosForProfissional(pid) || [];
      found = (list as Agendamento[]).find((a) => a.id === agendamentoId);
    }

    if (!found) {
      const map = agendamentoStore.agendamentosByProfissional;
      for (const key of Object.keys(map)) {
        const arr = map[Number(key)] || [];
        const f = (arr as Agendamento[]).find((a) => a.id === agendamentoId);
        if (f) {
          found = f;
          pid = Number(key);
          break;
        }
      }
    }

    if (!found || !pid) {
      toast.error("Agendamento não encontrado para cancelar");
      return;
    }

    // tenta persistir no backend
    try {
      const updated = await cancelarAgendamento(agendamentoId);

      // atualiza a store com retorno do servidor
      const list = agendamentoStore.getAgendamentosForProfissional(pid) || [];
      const newList = (list as Agendamento[]).map((a) =>
        a.id === agendamentoId
          ? { ...a, cancelado: true, cancelado_as: updated.cancelado_as }
          : a
      );
      agendamentoStore.setAgendamentosForProfissional(
        pid,
        newList as Agendamento[]
      );

      cache.value.clear();
      loadAgendamentosForWeek();
      toast.success("Agendamento cancelado");
      isModalOpen.value = false;
      isEdicao.value = false;
      selectedAgendamento.value = null;
      return;
    } catch (err: any) {
      // Se o servidor devolveu que nenhuma linha foi atualizada, provavelmente RLS
      if (err && err.code === "NO_ROWS_UPDATED") {
        console.error(
          "Cancelamento bloqueado por RLS/nenhuma linha atualizada:",
          err
        );
        toast.error(
          "Permissão negada ao cancelar agendamento. Verifique políticas RLS ou se o registro ainda existe."
        );
        return;
      }

      // Logs detalhados para debug de falhas de rede/cliente
      console.error("Erro ao cancelar agendamento (primeira tentativa):", err);

      // Tenta uma segunda tentativa rápida antes de aplicar fallback local
      try {
        const retry = await cancelarAgendamento(agendamentoId);
        // se funcionar na segunda tentativa, aplica o retorno do servidor
        const list = agendamentoStore.getAgendamentosForProfissional(pid) || [];
        const newList = (list as Agendamento[]).map((a) =>
          a.id === agendamentoId
            ? { ...a, cancelado: true, cancelado_as: retry.cancelado_as }
            : a
        );
        agendamentoStore.setAgendamentosForProfissional(
          pid,
          newList as Agendamento[]
        );
        cache.value.clear();
        loadAgendamentosForWeek();
        toast.success("Agendamento cancelado (após retry)");
        isModalOpen.value = false;
        isEdicao.value = false;
        selectedAgendamento.value = null;
        return;
      } catch (err2: any) {
        console.error("Retry de cancelamento falhou:", err2);
      }

      // fallback local se ambas tentativas falharem (rede temporariamente indisponível)
      const updatedLocal = (
        agendamentoStore.getAgendamentosForProfissional(pid) || []
      ).map((a: Agendamento) =>
        a.id === agendamentoId
          ? { ...a, cancelado: true, cancelado_as: new Date().toISOString() }
          : a
      );
      agendamentoStore.setAgendamentosForProfissional(
        pid,
        updatedLocal as Agendamento[]
      );
      cache.value.clear();
      loadAgendamentosForWeek();
      toast.success("Agendamento marcado como cancelado (local)");
      isModalOpen.value = false;
      isEdicao.value = false;
      selectedAgendamento.value = null;
      return;
    }
  } catch (e) {
    console.error("Erro ao cancelar agendamento:", e);
    toast.error("Erro ao cancelar agendamento");
  }
};

// Deleta um agendamento no backend e atualiza a store local
const handleDeleteAgendamento = async (agendamentoId: number) => {
  if (!profissionalId.value) {
    toast.error("Profissional não definido");
    return;
  }

  try {
    // chama composable
    const deletedId = await deletarAgendamento(agendamentoId);

    // remove da store local
    const pid = profissionalId.value!;
    const current = agendamentoStore.getAgendamentosForProfissional(pid) || [];
    const updated = (current as Agendamento[]).filter(
      (a) => a.id !== deletedId
    );
    agendamentoStore.setAgendamentosForProfissional(
      pid,
      updated as Agendamento[]
    );

    cache.value.clear();
    loadAgendamentosForWeek();
    toast.success("Agendamento excluído");
    isModalOpen.value = false;
    isEdicao.value = false;
    selectedAgendamento.value = null;
    return;
  } catch (err: any) {
    if (err && err.code === "NO_ROWS_DELETED") {
      console.error("Deleção bloqueada por RLS/nenhuma linha deletada:", err);
      toast.error(
        "Permissão negada ao deletar agendamento. Verifique políticas RLS ou se o registro ainda existe."
      );
      return;
    }

    // fallback: remove localmente para manter UX (marque que sync falhou)
    try {
      const pid = profissionalId.value!;
      const current =
        agendamentoStore.getAgendamentosForProfissional(pid) || [];
      const updated = (current as Agendamento[]).filter(
        (a) => a.id !== agendamentoId
      );
      agendamentoStore.setAgendamentosForProfissional(
        pid,
        updated as Agendamento[]
      );
      cache.value.clear();
      loadAgendamentosForWeek();
      toast.success("Agendamento removido localmente (backend indisponível)");
      isModalOpen.value = false;
      isEdicao.value = false;
      selectedAgendamento.value = null;
      return;
    } catch (e) {
      console.error("Erro ao aplicar remoção localmente:", e);
      toast.error("Erro ao deletar agendamento");
      return;
    }
  }
};

// Atualiza localmente campos simples do agendamento (sem chamada à API)
const handleUpdateAgendamento = async (payload: {
  id: number;
  titulo?: string;
  descricao?: string;
  cor?: string;
}) => {
  const agId = payload.id;
  let pid: number | null = profissionalId.value;
  let found: Agendamento | undefined;

  try {
    if (pid) {
      const list = agendamentoStore.getAgendamentosForProfissional(pid) || [];
      found = (list as Agendamento[]).find((a) => a.id === agId);
    }

    if (!found) {
      const map = agendamentoStore.agendamentosByProfissional;
      for (const key of Object.keys(map)) {
        const arr = map[Number(key)] || [];
        const f = (arr as Agendamento[]).find((a) => a.id === agId);
        if (f) {
          found = f;
          pid = Number(key);
          break;
        }
      }
    }

    if (!found || !pid) {
      toast.error("Agendamento não encontrado para atualizar");
      return;
    }

    // Tenta persistir no backend via composable
    try {
      const result: any = await editarAgendamento(
        agId,
        payload.titulo,
        payload.descricao,
        payload.cor
      );

      // O RPC pode retornar o objeto atualizado ou um array
      const returned = Array.isArray(result) ? result[0] : result;

      // Atualiza a store com os campos retornados (fallback para payload quando undefined)
      const updated = (
        agendamentoStore.getAgendamentosForProfissional(pid) || []
      ).map((a: Agendamento) =>
        a.id === agId
          ? {
              ...a,
              titulo: returned?.titulo ?? payload.titulo ?? a.titulo,
              descricao:
                returned?.descricao ?? payload.descricao ?? a.descricao,
              cor: returned?.cor ?? payload.cor ?? a.cor,
            }
          : a
      );
      agendamentoStore.setAgendamentosForProfissional(
        pid,
        updated as Agendamento[]
      );

      // atualiza view da semana
      cache.value.clear();
      loadAgendamentosForWeek();
      toast.success("Agendamento atualizado");
      isModalOpen.value = false;
      isEdicao.value = false;
      selectedAgendamento.value = null;
      return;
    } catch (rpcErr: any) {
      // Se o servidor respondeu sem linhas atualizadas, é provável que RLS
      // esteja bloqueando a operação. Nesse caso avisamos o usuário e não
      // aplicamos a alteração apenas localmente (pois estaria inconsistente).
      if (rpcErr && rpcErr.code === "NO_ROWS_UPDATED") {
        console.error(
          "Edição bloqueada por RLS/nenhuma linha atualizada:",
          rpcErr
        );
        toast.error(
          "Permissão negada ao atualizar agendamento. Verifique políticas RLS ou se o registro ainda existe."
        );
        return;
      }

      // Para outros erros (ex: indisponibilidade de rede), aplicamos fallback local
      // para manter a UX, mas informamos que persiste um sync pendente.
      const updated = (
        agendamentoStore.getAgendamentosForProfissional(pid) || []
      ).map((a: Agendamento) =>
        a.id === agId
          ? {
              ...a,
              titulo: payload.titulo ?? a.titulo,
              descricao: payload.descricao ?? a.descricao,
              cor: payload.cor ?? a.cor,
            }
          : a
      );
      agendamentoStore.setAgendamentosForProfissional(
        pid,
        updated as Agendamento[]
      );
      cache.value.clear();
      loadAgendamentosForWeek();
      toast.success("Alteração aplicada localmente (backend indisponível)");
      isModalOpen.value = false;
      isEdicao.value = false;
      selectedAgendamento.value = null;
      return;
    }
  } catch (e) {
    console.error("Erro ao atualizar agendamento:", e);
    toast.error("Erro ao atualizar agendamento");
  }
};

const loadAgendamentosForWeek = () => {
  const diasSemana = agendamentoStore.diasSemana;
  const full = fullAgendamentosComputed.value;
  if (diasSemana.length === 0 || !full || full.length === 0) {
    allAgendamentos.value = [];
    return;
  }

  const start = diasSemana[0]!;
  const end = diasSemana[6]!;
  const weekKey = start.toISOString().split("T")[0]!;

  if (cache.value.has(weekKey)) {
    allAgendamentos.value = cache.value.get(weekKey)!;
    return;
  }

  // Filtra client-side dos agendamentos completos usando comparação de strings locais
  const startStr = formatLocalDate(start);
  const endStr = formatLocalDate(end);
  const data = full.filter((ag) => {
    return ag.data && ag.data >= startStr && ag.data <= endStr;
  });

  cache.value.set(weekKey, data);
  allAgendamentos.value = data;
};

const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

watch(
  () => [
    agendamentoStore.diasSemana[0]?.getTime(),
    fullAgendamentosComputed.value.length,
  ],
  () => {
    loadAgendamentosForWeek();
  }
);

const handleSelectProfissional = (profissional: ProfissionalRPC) => {
  userStore.profissional = profissional;
  // Fetch new agendamentos for the selected professional
  if (profissional.id_do_profissional) {
    fetchAllAgendamentosByProfissional(profissional.id_do_profissional)
      .then(() => {
        loadAgendamentosForWeek();
      })
      .catch((error: unknown) => {
        console.error(
          "Erro ao buscar agendamentos do profissional selecionado:",
          error
        );
        toast.error("Erro ao carregar agendamentos do profissional");
      });
  }
};
</script>
