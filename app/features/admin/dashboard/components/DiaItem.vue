<template>
  <div
    class="flex flex-col items-center justify-center h-full border border-opacity-50"
  >
    <div class="text-lg font-semibold text-gray-800">{{ date.getDate() }}</div>
    <div class="text-xs text-gray-500 uppercase tracking-wide">
      {{ getDayName(date) }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  date: Date;
}>();

const days = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"] as const;

const getDayName = (date: Date): string => {
  return days[date.getDay()]!;
};
</script>
