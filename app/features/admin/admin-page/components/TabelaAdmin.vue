<template>
  <div
    class="overflow-x-auto border border-border rounded-lg shadow-sm h-[calc(100vh-12rem)] overflow-y-auto"
  >
    <table class="min-w-full divide-y divide-border">
      <thead class="bg-muted">
        <tr>
          <th
            v-for="header in headers"
            :key="header"
            class="sticky top-0 bg-muted px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody class="bg-card divide-y divide-border">
        <tr v-for="user in props.users" :key="user.id" class="hover:bg-accent">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">
            {{ user.id }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">
            {{ user.role ?? "N/A" }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">
            {{ user.nome ?? "N/A" }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">
            {{ user.email ?? "N/A" }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">
            {{ formatDateTime(user.created_at) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">
            {{ formatDateTime(user.updated_at) }}
          </td>
          <td
            class="px-6 py-4 whitespace-nowrap text-sm text-foreground text-right"
          >
            <Button
              variant="ghost"
              size="sm"
              @click="openDeleteModal(user)"
              :iconLeft="TrashIcon"
              class="text-destructive hover:text-destructive"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <DeleteUserModal
    v-if="showDeleteModal"
    v-model="showDeleteModal"
    :userId="selectedUserId!"
    :userName="selectedUserName!"
    @user-deleted="handleUserDeleted"
  />
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import type { UserProfileRPC } from "../../../../../shared/types/database";
  import Button from "~/components/ui/Button.vue";
  import { TrashIcon } from "@heroicons/vue/24/outline";
  import DeleteUserModal from "./DeleteUserModal.vue";
 
  interface Props {
    users: UserProfileRPC[];
    refresh?: () => Promise<void>;
  }
 
  const props = defineProps<Props>();

const showDeleteModal = ref(false);
const selectedUserId = ref<string | null>(null);
const selectedUserName = ref<string | null>(null);

const headers = [
  "ID",
  "Função",
  "Nome",
  "Email",
  "Criado em",
  "Atualizado em",
  "Ações",
];

const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const datePart = date.toLocaleDateString("pt-BR");
  const timePart = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return `${datePart} | ${timePart}`;
};

const openDeleteModal = (user: UserProfileRPC) => {
  selectedUserId.value = user.user_id;
  selectedUserName.value = user.nome ?? "N/A";
  showDeleteModal.value = true;
};

const handleUserDeleted = async () => {
  await props.refresh?.();
  showDeleteModal.value = false;
  selectedUserId.value = null;
  selectedUserName.value = null;
};
</script>
