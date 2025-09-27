<template>
  <div
    class="regua-horarios flex flex-col h-full min-h-[1200px] bg-gray-100 w-full"
  >
    <div
      v-for="hora in horas"
      :key="hora"
      class="hora flex items-center justify-center h-20 border-b border-gray-300 text-sm font-medium text-gray-700"
    >
      {{ hora }}h
    </div>
  </div>
</template>

<script setup lang="ts">
const horas = Array.from({ length: 15 }, (_, i) => 8 + i);
</script>
