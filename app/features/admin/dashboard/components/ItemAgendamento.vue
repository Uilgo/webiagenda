<template>
  <div class="dia-agendamento flex flex-col h-full relative">
    <!-- Slots de agendamento para esta data serão adicionados aqui -->
    <SlotAgendamento
      v-for="appt in dayAppointments"
      :key="appt.start"
      :start="appt.start"
      :end="appt.end"
      :title="appt.title"
      :description="appt.description"
    />
    <div
      v-for="hora in Array.from({ length: 15 }, (_, i) => 8 + i)"
      :key="hora"
      class="slot-hora h-20 border-l border-b border-l-gray-400 border-b-gray-300 relative"
    >
      <!-- Slot vazio por enquanto, alinhado com horas da régua -->
      <div
        class="absolute inset-x-0 top-1/2 h-px bg-gray-200 transform -translate-y-1/2"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import SlotAgendamento from "./SlotAgendamento.vue";
const props = defineProps<{
  data: Date;
}>();

const appointments = [
  {
    start: new Date("2025-09-28T08:00:00").getTime(),
    end: new Date("2025-09-28T09:00:00").getTime(),
    title: "Consulta João Silva",
    description: "Check-up anual e exames de rotina",
  },
  {
    start: new Date("2025-09-28T14:30:00").getTime(),
    end: new Date("2025-09-28T15:30:00").getTime(),
    title: "Reunião Maria Oliveira",
    description: "Discussão sobre tratamento ortodôntico",
  },
  {
    start: new Date("2025-09-29T10:00:00").getTime(),
    end: new Date("2025-09-29T11:30:00").getTime(),
    title: "Sessão Pedro Santos",
    description: "Acompanhamento pós-cirurgia",
  },
  {
    start: new Date("2025-09-30T16:00:00").getTime(),
    end: new Date("2025-09-30T17:00:00").getTime(),
    title: "Avaliação Ana Costa",
    description: "Consulta inicial para implantes",
  },
  {
    start: new Date("2025-10-01T09:15:00").getTime(),
    end: new Date("2025-10-01T10:15:00").getTime(),
    title: "Limpeza Lucas Ferreira",
    description: "Higienização e profilaxia",
  },
  {
    start: new Date("2025-10-02T13:00:00").getTime(),
    end: new Date("2025-10-02T14:45:00").getTime(),
    title: "Emergência Sofia Ramos",
    description: "Dor aguda e tratamento de urgência",
  },
  {
    start: new Date("2025-10-03T11:00:00").getTime(),
    end: new Date("2025-10-03T12:00:00").getTime(),
    title: "Manutenção Gabriel Lima",
    description: "Ajuste de aparelho ortodôntico",
  },
  {
    start: new Date("2025-10-04T18:30:00").getTime(),
    end: new Date("2025-10-04T19:30:00").getTime(),
    title: "Consulta Final Isabel Souza",
    description: "Encerramento do tratamento",
  },
] as const;

const dayAppointments = computed(() =>
  appointments.filter((appt) => {
    const apptDate = new Date(appt.start);
    return apptDate.toDateString() === props.data.toDateString();
  })
);
</script>
