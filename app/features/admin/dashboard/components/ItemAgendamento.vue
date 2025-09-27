<template>
  <div class="dia-agendamento flex flex-col h-full">
    <!-- Slots de agendamento para esta data serão adicionados aqui -->
    <div
      v-for="hora in Array.from({ length: 24 }, (_, i) => i)"
      :key="hora"
      class="slot-hora flex-1 border-l border-gray-200 relative"
    >
      <!-- Slot vazio por enquanto, alinhado com horas da régua -->
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: Date;
}>();
</script>
