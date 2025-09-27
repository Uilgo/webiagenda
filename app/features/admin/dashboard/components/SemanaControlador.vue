<template>
  <div class="flex flex-col items-center space-y-2">
    <p class="text-sm text-muted-foreground">
      {{ semanaTexto }}
    </p>
    <div class="flex space-x-2">
      <Button variant="ghost" size="sm" @click="store.voltarSemana">
        <ChevronLeftIcon class="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" @click="store.avancarSemana">
        <ChevronRightIcon class="h-4 w-4" />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";
import Button from "../../../../components/ui/Button.vue";
import { useAgendamentoStore } from "../../../../../stores/agendamento";

const store = useAgendamentoStore();

const semanaTexto = computed(() => {
  const start = store.diasSemana[0]!;
  const end = store.diasSemana[6]!;
  const formatDate = (date: Date) =>
    `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
  return `De ${formatDate(start)} até ${formatDate(end)}`;
});
</script>
