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
      :color="appt.color"
      :agendamento="appt.agendamento"
      @edit="$emit('edit-agendamento', $event)"
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
import type { Agendamento } from "../../../../../shared/types/database";
import SlotAgendamento from "./SlotAgendamento.vue";
const props = defineProps<{
  data: Date;
  allAgendamentos: Agendamento[];
}>();

const dayAppointments = computed(() => {
  const year = props.data.getFullYear();
  const month = props.data.getMonth();
  const day = props.data.getDate();
  const targetDateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
    day
  ).padStart(2, "0")}`;
  return props.allAgendamentos
    .filter((appt) => appt.data === targetDateStr && !appt.cancelado)
    .map((appt) => {
      const [startH, startM] = (appt.hora_inicio || "00:00")
        .split(":")
        .map(Number);
      const [endH, endM] = (appt.hora_fim || "00:00").split(":").map(Number);
      const startDate = new Date(year, month, day, startH, startM);
      const endDate = new Date(year, month, day, endH, endM);
      return {
        id: appt.id,
        agendamento: appt,
        start: startDate.getTime(),
        end: endDate.getTime(),
        title: appt.titulo || "",
        description: appt.descricao || "",
        color: appt.cor || "#3b82f6",
      };
    });
});
</script>
