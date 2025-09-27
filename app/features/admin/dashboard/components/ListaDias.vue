<template>
  <div class="grid grid-cols-8 h-20 bg-transparent w-full">
    <div class="col-span-1 border-b border-gray-300"></div>
    <DiaItem
      v-for="dia in dias"
      :key="dia.getTime()"
      :date="dia"
      class="col-span-1"
    />
  </div>
</template>

<script setup lang="ts">
import DiaItem from "./DiaItem.vue";

const props = defineProps<{
  dias: Date[];
}>();
</script>
