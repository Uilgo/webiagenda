<template>
  <EspecialidadesPage />
</template>

<script setup lang="ts">
// Importando o componente da feature de especialidades
import EspecialidadesPage from '~/features/admin/especialidades/especialidadesPage.vue'

// Configurando o layout admin para esta página
definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
  title: 'Especialidades'
})
</script>