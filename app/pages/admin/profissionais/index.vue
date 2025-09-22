<template>
  <ProfissionaisPage />
</template>

<script setup lang="ts">
// Importando o componente da feature de profissionais
import ProfissionaisPage from '~/features/admin/profissionais/ProfissionaisPage.vue'

// Configurando o layout admin para esta página
definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
  title: 'Profissionais'
})
</script>