<template>
  <div class="min-h-screen bg-background flex flex-col">
    <div class="flex flex-col flex-1">
      <!-- Header da Página -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-foreground">Meu Perfil</h1>
        <p class="mt-2 text-sm text-muted-foreground">
          Gerencie suas informações de perfil e segurança.
        </p>
      </div>

      <div class="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Seção de Informações do Perfil -->
        <div class="bg-card shadow-sm rounded-lg h-full">
          <ProfileInfo />
        </div>

        <!-- Seção de Mudança de Senha -->
        <div class="bg-card shadow-sm rounded-lg h-full">
         <ChangePassword />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Importações necessárias
import { computed } from "vue";
import { useUserStore } from "../../../../stores/user";
import type { Profile } from "../../../../shared/types/database";
import ChangePassword from "~/features/admin/perfil/components/ChangePassword.vue";
import ProfileInfo from "./components/ProfileInfo.vue";

// Composables e Stores
const userStore = useUserStore();
</script>
