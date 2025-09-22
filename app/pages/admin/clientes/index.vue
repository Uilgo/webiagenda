<template>
  <ClientesPage />
</template>

<script setup lang="ts">
// Importando o componente da feature de clientes
import ClientesPage from '~/features/admin/clientes/ClientesPage.vue'

// Configurando o layout admin para esta página
definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
  title: 'Clientes'
})
</script>