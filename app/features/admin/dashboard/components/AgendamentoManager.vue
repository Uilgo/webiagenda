<template>
  <div class="h-[calc(100vh-8rem)] flex flex-col overflow-y-auto pr-2">
    <!-- Header do Gerenciador de Agendamentos -->
    <div class="header flex flex-col gap-2 sticky top-0 z-20 bg-background">
      <div class="flex items-center justify-between">
        <SemanaControlador />
        <UserProfileDisplay />
        <Button variant="primary" size="md">Novo Agendamento</Button>
      </div>
      <ListaDias :dias="agendamentoStore.diasSemana" />
    </div>

    <!-- Corpo do Gerenciador de Agendamentos -->
    <div class="body grid grid-cols-8 flex-1">
      <ReguaHorarios class="col-span-1" />
      <ItemAgendamento
        v-for="dia in agendamentoStore.diasSemana"
        :key="dia.toISOString()"
        :data="dia"
        class="col-span-1"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import SemanaControlador from "./SemanaControlador.vue";
import Button from "../../../../components/ui/Button.vue";
import UserProfileDisplay from "./UserProfileDisplay.vue";
import { useAgendamentoStore } from "../../../../../stores/agendamento";
import ListaDias from "./ListaDias.vue";
import ReguaHorarios from "./ReguaHorarios.vue";
import ItemAgendamento from "./ItemAgendamento.vue";

const agendamentoStore = useAgendamentoStore();
</script>
