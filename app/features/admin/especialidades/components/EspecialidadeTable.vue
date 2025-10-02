<template>
  <div
    class="overflow-x-auto border border-border rounded-lg shadow-sm max-h-[calc(100vh-12rem)] overflow-y-auto"
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
        <tr
          v-for="(row, index) in formattedRows"
          :key="index"
          class="hover:bg-accent"
        >
          <td
            v-for="(cell, cellIndex) in row"
            :key="cellIndex"
            class="px-6 py-4 whitespace-nowrap text-sm text-foreground"
          >
            <span v-if="!isAdmin || cellIndex < headers.length - 1">{{
              cell
            }}</span>
            <div v-else class="flex space-x-2">
              <button
                class="text-muted-foreground hover:text-primary p-1"
                @click="emits('edit-especialidade', row[0])"
              >
                <PencilIcon class="w-4 h-4" />
              </button>
              <button
                class="text-muted-foreground hover:text-destructive p-1"
                @click="emits('delete-especialidade', row[0], row[1])"
              >
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Especialidades } from "../../../../../shared/types/database";
import { PencilIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { useUserStore } from "../../../../../stores/user";

const props = defineProps<{
  especialidades: Especialidades[];
}>();

const emits = defineEmits(["edit-especialidade", "delete-especialidade"]);

const userStore = useUserStore();

const formatDate = (date: string) => new Date(date).toLocaleDateString("pt-BR");

const isAdmin = computed(() => userStore.profile?.role === "admin");

const headers = computed(() => {
  const baseHeaders = ["ID", "Especialidade", "Criado em", "Atualizado em"];
  if (isAdmin.value) {
    baseHeaders.push("Ações");
  }
  return baseHeaders;
});

const formattedRows = computed(() =>
  props.especialidades.map((esp) => {
    const row = [
      esp.id.toString(),
      esp.especialidade,
      formatDate(esp.created_at),
      esp.updated_at ? formatDate(esp.updated_at) : "N/A",
    ];
    if (isAdmin.value) {
      row.push("");
    }
    return row;
  })
);
</script>
