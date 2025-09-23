<template>
  <DashboardPage />
</template>

<script setup lang="ts">
// Importando o componente da feature de dashboard
import DashboardPage from '~/features/admin/dashboard/DashboardPage.vue'

// Configurando o layout admin para esta página
definePageMeta({
  layout: 'admin',
  title: 'Dashboard'
})
</script>