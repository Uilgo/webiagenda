# Configuração de Rotas Dinâmicas com Supabase no Nuxt 4

## Visão Geral
Este documento explica como integrar redirecionamentos do Supabase com rotas dinâmicas no Nuxt 4, usando a estrutura de features para autenticação. O foco é na rota `/auth/[form].vue` que captura params como 'login', 'signup' ou 'forgot-password' via AuthPage.vue. Supabase redireciona para paths exatos (ex.: `/auth/login`), e o Nuxt define `params.form = 'login'` automaticamente, sem necessidade de configuração especial no Supabase.

### Configuração no nuxt.config.ts
Mantenha `redirectOptions` para apontar para o path dinâmico:

```typescript
export default defineNuxtConfig({
  modules: ["@nuxtjs/supabase"],
  supabase: {
    redirectOptions: {
      login: '/auth/login',  // Supabase redireciona para este path; Nuxt captura como params.form = 'login'
      callback: '/confirm',  // Ou '/auth/confirm' se mover a página
      exclude: ['/']  // Exclui rotas públicas
    }
  }
})
```

- **Como funciona**: Supabase envia o user para `/auth/login`. A rota dinâmica `app/pages/auth/[form].vue` é acionada, definindo `route.params.form = 'login'`. AuthPage.vue usa isso para renderizar o form correto.
- **Pitfalls comuns**: Loops em `router.replace` durante redirects (ex.: watch em params fazendo replace desnecessário, causando re-renders infinitos). Solução: Adicionar guards (ver abaixo).

## Estrutura de Rotas Recomendada
- `app/pages/auth.vue`: Index para `/auth` (sem param) — renderiza AuthPage com default 'login'.
- `app/pages/auth/[form].vue`: Rota dinâmica para `/auth/{form}` — renderiza `<AuthPage />` usando `useRoute().params.form`.
- `app/pages/confirm.vue`: Callback Supabase (mantido em raiz para simplicidade).

Exemplo em `app/pages/auth/[form].vue`:
```vue
<template>
  <AuthPage />
</template>

<script setup lang="ts">
import AuthPage from '~/features/auth/AuthPage.vue'
</script>
```

## Otimização da AuthPage.vue para Evitar Loops
A AuthPage.vue gerencia `currentForm` baseado em `route.params.form`. Para prevenir loops durante redirects Supabase:

1. **Flag para Initial Load**: Evita replaces no primeiro render.
2. **Guards em Replace**: Só replace se path atual != target.
3. **Fallback Seguro**: Define 'login' para params inválidos sem redirect imediato.
4. **Guard em Auth Watch**: Só redirect se autenticado e em página de auth, sem immediate.

Exemplo otimizado (aplicado no projeto):
```typescript
// Flag para initial load
const isInitialLoad = ref(true)

// Valid forms
const validForms = ['login', 'signup', 'forgot-password'] as const

// Watch em params.form
watch(() => route.params.form, (newForm) => {
  if (newForm && validForms.includes(newForm as AuthFormType)) {
    currentForm.value = newForm as AuthFormType
  } else {
    currentForm.value = 'login'  // Fallback sem redirect
  }
}, { immediate: true })

// onMounted
onMounted(() => {
  const formFromParam = route.params.form as AuthFormType
  if (formFromParam && validForms.includes(formFromParam)) {
    currentForm.value = formFromParam
  } else {
    currentForm.value = 'login'
    // Guard: só replace se não já no path e não initial
    if (route.path !== '/auth/login' && !isInitialLoad.value) {
      router.replace('/auth/login')
    }
  }
  isInitialLoad.value = false
})

// Watch isAuthenticated com guard
watch(isAuthenticated, (authenticated) => {
  if (authenticated && route.path.startsWith('/auth') && !isInitialLoad.value) {
    router.push('/')
  }
}, { immediate: false })
```

## Troubleshooting
- **Erro de Loop/Redirect Infinito**: Verifique console para múltiplos `router.replace`. Solução: Adicione `console.log('Replacing to', targetPath)` em replaces para debug; use flag `isNavigating` para debounce.
- **Param Não Capturado**: Confirme que `login: '/auth/login'` em config; teste navegando manualmente para `/auth/login` — deve setar `params.form = 'login'`.
- **Supabase Não Redireciona**: Verifique variáveis de ambiente (SUPABASE_URL, SUPABASE_KEY); rode `npm run dev` e teste auth flow.
- **Teste Manual**: 
  1. Rode dev server.
  2. Acesse `/auth/login` — deve mostrar login form sem erro.
  3. Simule Supabase: Use `useSupabaseClient().auth.signInWithPassword` em console e verifique redirect.
- **Se Persistir**: Mova para rotas estáticas (`/auth/login.vue` renderizando LoginForm diretamente) para isolar.

Esta configuração mantém UX fluida com um único componente AuthPage, escalável para mais forms.