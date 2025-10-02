<template>
  <Modal
    :modelValue="modelValue"
    @update:modelValue="(value) => emit('update:modelValue', value)"
    :title="props.isEdicao ? 'Editar Agendamento' : 'Novo Agendamento'"
  >
    <form class="space-y-4 p-1">
      <!-- Profissional -->
      <div>
        <label
          class="block text-sm text-left font-medium text-popover-foreground mb-2"
        >
          Profissional
        </label>
        <div class="flex items-center space-x-3 p-3 bg-muted rounded-md">
          <div
            class="w-10 h-10 bg-primary rounded-full flex items-center justify-center"
          >
            <span class="text-white text-sm font-medium">{{
              profissionalNome ? profissionalNome.charAt(0).toUpperCase() : "N"
            }}</span>
          </div>
          <div class="flex flex-col justify-center items-start text-left">
            <p class="text-sm font-medium text-popover-foreground text-left">
              {{ profissionalNome || "" }}
            </p>
            <p
              v-if="profissionalEspecialidade"
              class="text-sm text-muted-foreground text-left"
            >
              {{ profissionalEspecialidade }}
            </p>
          </div>
        </div>
      </div>

      <!-- Cliente -->
      <div>
        <label
          for="cliente"
          class="block text-sm text-left font-medium text-popover-foreground mb-2"
        >
          Cliente *
        </label>
        <!-- Em modo edição, não permitir troca do cliente -->
        <div v-if="props.isEdicao">
          <Input
            id="cliente"
            :modelValue="
              selectedCliente
                ? selectedCliente.nome
                : props.initialAgendamento?.cliente_id
                ? String(props.initialAgendamento.cliente_id)
                : 'Cliente'
            "
            readonly
            class="w-full opacity-70 cursor-not-allowed"
          />
        </div>
        <div v-else>
          <Dropdown :use-portal="true" width="md">
            <template #trigger>
              <Input
                id="cliente"
                :modelValue="
                  selectedCliente
                    ? selectedCliente.nome
                    : 'Selecione um cliente'
                "
                readonly
                class="w-full"
              />
            </template>
            <template #content="{ close }">
              <div class="p-2">
                <Input
                  v-model="searchTerm"
                  placeholder="Buscar cliente..."
                  :icon-left="MagnifyingGlassIcon"
                  class="w-full"
                />
                <div class="max-h-60 overflow-y-auto mt-2">
                  <DropdownItem
                    v-for="cliente in displayClientes"
                    :key="cliente.id"
                    @click="
                      selectedCliente = cliente;
                      close();
                    "
                  >
                    {{ cliente.nome }}
                  </DropdownItem>
                </div>
                <div
                  v-if="displayClientes.length === 0 && searchTerm"
                  class="px-2 py-2 text-sm text-muted-foreground"
                >
                  Nenhum cliente encontrado.
                </div>
              </div>
            </template>
          </Dropdown>
          <div class="text-left">
            <span class="text-muted-foreground">Não encontrou cliente? </span>
            <Button
              variant="link"
              class="pl-0 inline"
              @click="cadastrarNovoCliente"
            >
              Cadastrar novo cliente
            </Button>
          </div>
        </div>
      </div>

      <!-- Título -->
      <div>
        <label
          for="titulo"
          class="block text-sm text-left font-medium text-popover-foreground mb-2"
        >
          Título *
        </label>
        <Input
          id="titulo"
          type="text"
          v-model="titulo"
          placeholder="Ex: Consulta rotina"
          class="w-full"
        />
      </div>

      <!-- Descrição -->
      <div>
        <label
          for="descricao"
          class="block text-sm text-left font-medium text-popover-foreground mb-2"
        >
          Descrição
        </label>
        <textarea
          id="descricao"
          v-model="descricao"
          placeholder="Detalhes do agendamento (opcional)"
          class="w-full p-2 border border-border rounded-md bg-popover text-popover-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
          rows="3"
        ></textarea>
      </div>

      <!-- Cor -->
      <div>
        <label
          for="cor"
          class="block text-sm text-left font-medium text-popover-foreground mb-2"
        >
          Cor (opcional)
        </label>
        <ColorPicker v-model="colorModel" />
      </div>

      <!-- Data -->
      <div>
        <label
          for="data"
          class="block text-sm text-left font-medium text-popover-foreground mb-2"
        >
          Data *
        </label>
        <div v-if="props.isEdicao">
          <Input
            id="data"
            :modelValue="
              selectedData
                ? formatDate(selectedData)
                : props.initialAgendamento?.data || '—'
            "
            readonly
            class="w-full opacity-70 cursor-not-allowed"
          />
        </div>
        <div v-else>
          <Dropdown :use-portal="true">
            <template #trigger>
              <Input
                id="data"
                :modelValue="
                  selectedData ? formatDate(selectedData) : 'Selecione uma data'
                "
                readonly
                class="w-full"
              />
            </template>
            <template #content="{ close }">
              <CalendarPicker
                v-model="selectedData"
                :min-date="today"
                :disabled-dates="disabledDates"
                :hide-input="true"
                @update:modelValue="() => close()"
              />
            </template>
          </Dropdown>
        </div>
      </div>

      <!-- Hora Início e Hora Fim (só exibidos após seleção de data) -->
      <div
        v-if="selectedData && !props.isEdicao"
        class="grid grid-cols-2 gap-4"
      >
        <div>
          <label
            for="horaInicio"
            class="block text-sm text-left font-medium text-popover-foreground mb-2"
          >
            Hora Início *
          </label>
          <TimePicker
            v-model="selectedHoraInicio"
            :available-times="availableStartHours"
            placeholder="Selecione hora início"
            :disabled="props.isEdicao"
          />
        </div>
        <div>
          <label
            for="horaFim"
            class="block text-sm text-left font-medium text-popover-foreground mb-2"
          >
            Hora Fim *
          </label>
          <TimePicker
            v-model="selectedHoraFim"
            :available-times="availableEndHours"
            placeholder="Selecione hora fim"
            :empty-message="
              !selectedHoraInicio
                ? 'Selecione hora início primeiro'
                : 'Nenhum horário disponível'
            "
            :disabled="props.isEdicao"
          />
        </div>
      </div>
    </form>

    <template #footer>
      <div class="flex justify-end space-x-3 w-full">
        <template v-if="props.isEdicao && props.initialAgendamento">
          <Button
            type="button"
            variant="destructive"
            @click="showConfirmCancel = true"
          >
            Cancelar Agendamento
          </Button>
          <Button
            type="button"
            variant="default"
            @click="salvar"
            :disabled="saving"
          >
            Salvar Alterações
          </Button>
        </template>
        <template v-else>
          <Button
            type="button"
            variant="outline"
            @click="close"
            :disabled="saving"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="default"
            @click="salvar"
            :disabled="saving"
          >
            Salvar Agendamento
          </Button>
        </template>
      </div>
    </template>
  </Modal>

  <!-- Modal de Confirmação de Cancelamento -->
  <Modal
    v-model="showConfirmCancel"
    title="Confirmar Cancelamento"
    :show-close="true"
  >
    <div class="p-4 text-center">
      <p class="text-sm text-muted-foreground mb-4">
        Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.
      </p>
    </div>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          @click="showConfirmCancel = false"
        >
          Não, Manter
        </Button>
        <Button
          type="button"
          variant="destructive"
          @click="handleConfirmCancel"
        >
          Sim, Cancelar
        </Button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useAgendamento } from "~/composables/core/useAgendamento";
import { useUserStore } from "../../../../../stores/user";
import type {
  Agendamento,
  Cliente,
} from "../../../../../shared/types/database";
import Modal from "~/components/ui/Modal.vue";
import Button from "~/components/ui/Button.vue";
import Input from "~/components/ui/Input.vue";
import Dropdown from "~/components/ui/Dropdown.vue";
import DropdownItem from "~/components/ui/DropdownItem.vue";
import TimePicker from "~/components/ui/TimePicker.vue";
import ColorPicker from "~/components/ui/ColorPicker.vue";
import { MagnifyingGlassIcon } from "@heroicons/vue/24/outline";
import CalendarPicker from "~/components/ui/CalendarPicker.vue";
import { useToast } from "~/composables/ui/useToast";

// Props
const props = defineProps<{
  modelValue: boolean;
  profissionalNome?: string;
  profissionalId?: number | null;
  diasSemana?: Date[];
  clientes?: Cliente[];
  allAgendamentos?: Agendamento[];
  isEdicao?: boolean;
  initialAgendamento?: Agendamento | null;
}>();

// Emits
const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (
    e: "save",
    formData: {
      clienteId: number;
      cor?: string;
      data: string;
      descricao?: string;
      horaFim: string;
      horaInicio: string;
      titulo: string;
    }
  ): void;
  (e: "cancel-agendamento", agendamentoId: number): void;
  (
    e: "update-agendamento",
    payload: { id: number; titulo?: string; descricao?: string; cor?: string }
  ): void;
}>();

// Estado local
const displayClientes = computed(() =>
  (props.clientes || [])
    .filter((cliente: Cliente) => cliente.nome != null)
    .filter((cliente) =>
      cliente.nome!.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
    .map((cliente) => ({ id: cliente.id, nome: cliente.nome! }))
);

const selectedCliente = ref<{ id: number; nome: string } | null>(null);
const searchTerm = ref("");
const selectedData = ref<Date | null>(null);
const selectedHoraInicio = ref<string | undefined>(undefined);
const selectedHoraFim = ref<string | undefined>(undefined);
const titulo = ref("");
const descricao = ref("");
const selectedColor = ref<string | null>(null);
const router = useRouter();
const toast = useToast();
const { editarAgendamento } = useAgendamento();
const saving = ref(false);

const showConfirmCancel = ref(false);

const handleConfirmCancel = () => {
  emit('cancel-agendamento', props.initialAgendamento!.id);
  showConfirmCancel.value = false;
};

// Wrapper para o ColorPicker que mantém selectedColor como string|null
const colorModel = computed<string>({
  get: () => selectedColor.value ?? "",
  set: (v: string) => {
    selectedColor.value = v === "" ? null : v;
  },
});

// Reset fields when modal closes
watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) {
      selectedCliente.value = null;
      searchTerm.value = "";
      selectedData.value = null;
      selectedHoraInicio.value = undefined;
      selectedHoraFim.value = undefined;
      titulo.value = "";
      descricao.value = "";
      selectedColor.value = "";
      showConfirmCancel.value = false;
    }
  }
);

// Se estivermos em modo edição, preencher campos iniciais
watch(
  () => props.isEdicao,
  (v) => {
    if (v && props.initialAgendamento) {
      const ag = props.initialAgendamento;
      titulo.value = ag.titulo || "";
      descricao.value = ag.descricao || "";
      selectedColor.value = ag.cor || "";
      // tenta encontrar cliente
      if (props.clientes && ag.cliente_id) {
        const found = props.clientes.find((c) => c.id === ag.cliente_id);
        if (found) selectedCliente.value = { id: found.id, nome: found.nome! };
      }
      // mantém data/hora selecionadas apenas para exibição, não para edição
      if (ag.data) selectedData.value = new Date(ag.data + "T00:00:00");
      selectedHoraInicio.value = ag.hora_inicio || undefined;
      selectedHoraFim.value = ag.hora_fim || undefined;
    }
  },
  { immediate: true }
);

// Horas de 8h a 22h (intervalo de 30 minutos)
const hours = ref<string[]>(
  Array.from({ length: 29 }, (_, i) => {
    const totalMinutes = 8 * 60 + i * 30;
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  })
);

// Funções auxiliares
const formatDate = (date: Date) => {
  return date.toLocaleDateString("pt-BR");
};

const userStore = useUserStore();

const profissionalNome = computed(() => {
  // Prioridade: prop recebida pelo componente -> userStore (usuário logado)
  return (
    props.profissionalNome || userStore.profissional?.nome_do_profissional || ""
  );
});

const profissionalEspecialidade = computed(() => {
  return (
    // prefer props se vier (nem todos components passam especialidade atualmente)
    // caso contrário, pega do userStore.profissional
    // fallback vazia para não mostrar texto genérico
    (userStore.profissional?.especialidade_do_profissional as string) || ""
  );
});
const diasSemana = computed(() => props.diasSemana || []);

const today = new Date();
today.setHours(0, 0, 0, 0);

const futureDias = computed(() => {
  return (props.diasSemana || []).filter((dia: Date) => {
    const d = new Date(dia);
    d.setHours(0, 0, 0, 0);
    return d >= today;
  });
});

const disabledDates = computed<Date[]>(() => {
  const disabled: Date[] = [];
  // Adicionar dias passados (já filtrado no min-date, mas para segurança)
  const todayStr = today.toISOString().split("T")[0]!;
  // Para dias sem horários disponíveis, verificar se todos os slots estão ocupados
  // Por simplicidade, desabilitar dias com agendamentos existentes (ajustar conforme necessidade)
  if (props.allAgendamentos) {
    const occupiedDays = [
      ...new Set(
        props.allAgendamentos
          .filter((ag) => ag.data != null)
          .map((ag) => new Date(ag.data!).toISOString().split("T")[0])
          .filter((dayStr): dayStr is string => dayStr != null)
      ),
    ];
    occupiedDays.forEach((dayStr) => {
      if (dayStr >= todayStr) {
        disabled.push(new Date(dayStr));
      }
    });
  }
  return disabled;
});

const existingAgendamentos = computed(() => {
  if (!selectedData.value || !props.allAgendamentos?.length) return [];
  const dateStr = selectedData.value.toISOString().split("T")[0];
  return props.allAgendamentos.filter((ag: Agendamento) => {
    if (!ag.data) return false;
    const agDate = new Date(ag.data);
    if (isNaN(agDate.getTime())) return false;
    return agDate.toISOString().split("T")[0] === dateStr;
  });
});

const timeToMinutes = (time: string): number => {
  const parts = time.split(":");
  const h = parseInt(parts[0] || "0", 10);
  const m = parseInt(parts[1] || "0", 10);
  return h * 60 + m;
};

const overlaps = (s1: number, e1: number, s2: number, e2: number): boolean => {
  return s1 < e2 && e1 > s2;
};

const availableStartHours = computed(() => {
  if (!existingAgendamentos.value.length) return hours.value;
  return hours.value.filter((hora) => {
    const startMin = timeToMinutes(hora);
    const proposedEndMin = startMin + 30;
    return !existingAgendamentos.value.some((ag) => {
      if (!ag.hora_inicio || !ag.hora_fim) return false;
      const eiStart = timeToMinutes(ag.hora_inicio);
      const eiEnd = timeToMinutes(ag.hora_fim);
      return overlaps(startMin, proposedEndMin, eiStart, eiEnd);
    });
  });
});

const availableEndHours = computed(() => {
  if (!selectedHoraInicio.value) return [];
  const startMin = timeToMinutes(selectedHoraInicio.value!);
  const minEndMin = startMin + 30;
  const possibleEnds = hours.value.filter((h) => timeToMinutes(h) >= minEndMin);
  if (!existingAgendamentos.value.length) return possibleEnds;
  return possibleEnds.filter((hora) => {
    const endMin = timeToMinutes(hora);
    return !existingAgendamentos.value.some((ag) => {
      if (!ag.hora_inicio || !ag.hora_fim) return false;
      const eiStart = timeToMinutes(ag.hora_inicio);
      const eiEnd = timeToMinutes(ag.hora_fim);
      return overlaps(startMin, endMin, eiStart, eiEnd);
    });
  });
});

watch(selectedData, () => {
  selectedHoraInicio.value = undefined;
  selectedHoraFim.value = undefined;
});

watch(selectedHoraInicio, () => {
  selectedHoraFim.value = undefined;
});

// Funções (sem lógica real)
const close = () => {
  emit("update:modelValue", false);
};

const salvar = async () => {
  // Se estivermos em modo edição, não exigir os campos obrigatórios do formulário
  // de criação. Em vez disso, detectamos apenas os campos que realmente
  // mudaram e enviamos apenas eles.
  if (props.isEdicao && props.initialAgendamento) {
    const original = props.initialAgendamento;
    const changes: { titulo?: string; descricao?: string; cor?: string } = {};

    if ((titulo.value || "") !== (original.titulo || ""))
      changes.titulo = titulo.value;
    if ((descricao.value || "") !== (original.descricao || ""))
      changes.descricao = descricao.value;
    if (String(selectedColor.value || "") !== String(original.cor || ""))
      changes.cor = (selectedColor.value ?? undefined) as string | undefined;

    if (Object.keys(changes).length === 0) {
      toast.info("Nenhuma alteração detectada");
      return;
    }

    // não chamamos o backend aqui — o manager é responsável por persistir via composable
    emit("update-agendamento", { id: original.id, ...changes });
    emit("update:modelValue", false);

    return;
  }

  // Fluxo de criação — validação permanece a mesma
  if (
    !selectedCliente.value ||
    !titulo.value ||
    !selectedData.value ||
    !selectedHoraInicio.value ||
    !selectedHoraFim.value
  ) {
    toast.error("Preencha todos os campos obrigatórios");
    return;
  }

  // determina id do profissional a partir da prop ou do usuário logado
  const profissionalIdPayload =
    props.profissionalId ?? userStore.profissional?.id_do_profissional ?? null;

  if (
    !selectedCliente.value ||
    !titulo.value ||
    !selectedData.value ||
    !selectedHoraInicio.value ||
    !selectedHoraFim.value ||
    !profissionalIdPayload
  ) {
    toast.error("Preencha todos os campos obrigatórios");
    return;
  }

  const year = selectedData.value.getFullYear();
  const month = String(selectedData.value.getMonth() + 1).padStart(2, "0");
  const day = String(selectedData.value.getDate()).padStart(2, "0");
  const dataStr = `${year}-${month}-${day}`;

  const formData = {
    clienteId: selectedCliente.value.id,
    cor: selectedColor.value || "",
    data: dataStr,
    descricao: descricao.value || "",
    horaFim: selectedHoraFim.value!,
    horaInicio: selectedHoraInicio.value!,
    titulo: titulo.value,
    profissionaisId: profissionalIdPayload,
  };

  emit("save", formData as any);
};

const cadastrarNovoCliente = () => {
  close();
  router.push("/admin/clientes");
};
</script>
