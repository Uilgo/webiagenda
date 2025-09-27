<template>
  <div class="min-h-screen">
    <AgendamentoManager />
  </div>
</template>

<script setup lang="ts">
import AgendamentoManager from "./components/AgendamentoManager.vue";
import { useAgendamentoStore } from "../../../../stores/agendamento";
const agendamentoStore = useAgendamentoStore();
</script>
