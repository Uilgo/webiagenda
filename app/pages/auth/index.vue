<template>
  <AuthPage />
</template>

<script setup lang="ts">
import AuthPage from '~/features/auth/AuthPage.vue'

definePageMeta({
  layout: false,
  title: 'Autenticação - WebAgenda',
  description: 'Faça login ou cadastre-se no WebAgenda para gerenciar seus agendamentos'
})

useSeoMeta({
  title: 'Autenticação - WebAgenda',
  description: 'Acesse sua conta no WebAgenda ou crie uma nova conta para começar a gerenciar seus agendamentos de forma eficiente.',
  ogTitle: 'WebAgenda - Sua plataforma de agendamento',
  ogDescription: 'Faça login ou cadastre-se no WebAgenda para gerenciar seus agendamentos de forma inteligente.',
  ogType: 'website',
  twitterCard: 'summary_large_image'
})
</script>