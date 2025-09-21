<template>
  <AgendamentosPage />
</template>

<script setup lang="ts">
// Importando o componente da feature de agendamentos
import AgendamentosPage from '~/features/admin/agendamentos/AgendamentosPage.vue'

// Configurando o layout admin para esta página
definePageMeta({
  layout: 'admin',
  title: 'Agendamentos'
})
</script>