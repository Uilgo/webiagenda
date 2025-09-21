<template>
  <AuthPage />
</template>

<script setup lang="ts">
// Importações explícitas do Nuxt para resolver problemas de TypeScript
import { useSeoMeta } from '#app'

// Importação do componente principal da feature de autenticação
import AuthPage from '../features/auth/AuthPage.vue'

// Configuração da página
definePageMeta({
  layout: false, // Remove o layout padrão para ter controle total sobre o design
  title: 'Autenticação - WebAgenda',
  description: 'Faça login ou cadastre-se no WebAgenda para gerenciar seus agendamentos'
})

// SEO e meta tags
useSeoMeta({
  title: 'Autenticação - WebAgenda',
  description: 'Acesse sua conta no WebAgenda ou crie uma nova conta para começar a gerenciar seus agendamentos de forma eficiente.',
  ogTitle: 'WebAgenda - Sua plataforma de agendamento',
  ogDescription: 'Faça login ou cadastre-se no WebAgenda para gerenciar seus agendamentos de forma inteligente.',
  ogType: 'website',
  twitterCard: 'summary_large_image'
})
</script>