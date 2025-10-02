<template>
  <div>
    <header class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-foreground">Admin</h1>
      <div class="flex items-center gap-2">
        <Button variant="outline" size="md" @click="refreshData" :iconLeft="ArrowPathIcon">
          Atualizar
        </Button>
        <Button size="md" @click="openAddUser">
          Adicionar Usuário
        </Button>
      </div>
    </header>
    <TabelaAdmin :users="users" :refresh="fetchUsers" />
    <UserModal v-model="showUserModal" @user-created="handleUserCreated" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import TabelaAdmin from "./components/TabelaAdmin.vue";
import UserModal from "./components/UserModal.vue";
import Button from "~/components/ui/Button.vue";
import { ArrowPathIcon } from '@heroicons/vue/24/outline';
import { useUsers } from "~/composables/core/useUsers";

const { users, fetchUsers } = useUsers();

const showUserModal = ref(false);

const refreshData = async () => {
  await fetchUsers();
};

const openAddUser = () => {
  showUserModal.value = true;
};

const handleUserCreated = async () => {
  await refreshData();
};

onMounted(async () => {
  await fetchUsers();
});

// Aqui você pode adicionar lógica específica para a página Admin
</script>
