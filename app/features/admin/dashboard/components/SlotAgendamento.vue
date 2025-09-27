<template>
  <div
    class="absolute bg-blue-500 text-white p-4 justify-center rounded shadow-lg z-10 flex flex-col"
    :style="{
      left: `${leftPercentage}%`,
      top: `${topPercentage}%`,
      width: `${widthPercentage}%`,
      height: `${heightPercentage}%`,
    }"
  >
    <p class="text-xs font-bold mb-0.5">{{ startDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }} as {{ endDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }}</p>
    <h4 class="font-medium text-xs text-left mb-0.5 truncate">{{ title }}</h4>
    <p class="text-xs text-left truncate leading-tight">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";

const props = defineProps({
  start: {
    type: Number as PropType<number>,
    required: true,
  },
  end: {
    type: Number as PropType<number>,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const startDate = new Date(props.start);
const endDate = new Date(props.end);

const startHourFraction = startDate.getHours() + startDate.getMinutes() / 60;
const endHourFraction = endDate.getHours() + endDate.getMinutes() / 60;
const durationHours = (props.end - props.start) / (1000 * 60 * 60);

const visibleStartHour = 8;
const visibleTotalHours = 15; // 8h to 23h

const effectiveStart = Math.max(0, startHourFraction - visibleStartHour);
const topPercentage = (effectiveStart / visibleTotalHours) * 100;
const effectiveDuration = Math.min(visibleTotalHours - effectiveStart, durationHours);
const heightPercentage = Math.max((effectiveDuration / visibleTotalHours) * 100, 4); // Min height 4%

const leftPercentage = 0;
const widthPercentage = 100;
</script>

<style scoped>
/* Estilos adicionais se necessário */
</style>
