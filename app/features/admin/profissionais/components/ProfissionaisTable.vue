<template>
  <div
    class="overflow-x-auto rounded-lg border border-border shadow-sm p-4 overflow-hidden"
  >
    <table class="min-w-full divide-y divide-border">
      <thead class="bg-muted">
        <tr>
          <th
            v-for="header in headers"
            :key="header"
            class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
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
                @click="emits('edit-profissional', row[0])"
              >
                <PencilIcon class="w-4 h-4" />
              </button>
              <button
                class="text-muted-foreground hover:text-destructive p-1"
                @click="emits('delete-profissional', row[0], row[1])"
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
import type { ProfissionalRPC } from "../../../../../shared/types/database";
import { PencilIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { useUserStore } from "../../../../../stores/user";

const props = defineProps<{
  profissionais: ProfissionalRPC[];
}>();

const emits = defineEmits(["edit-profissional", "delete-profissional"]);

const userStore = useUserStore();

const isAdmin = computed(() => userStore.profile?.role === "admin");

const headers = computed(() => {
  const base = ["ID", "Nome", "Especialidade", "ID Perfil", "ID Especialidade"];
  if (isAdmin.value) base.push("Ações");
  return base;
});

const formattedRows = computed(() =>
  props.profissionais.map((p) => {
    const id =
      p.id_do_profissional != null ? String(p.id_do_profissional) : "N/A";
    const nome = p.nome_do_profissional ?? "N/A";
    const especialidade = p.especialidade_do_profissional ?? "N/A";
    const idPerfil = p.id_do_perfil != null ? String(p.id_do_perfil) : "N/A";
    const idEspecialidade =
      p.id_da_especialidade != null ? String(p.id_da_especialidade) : "N/A";

    const row: string[] = [id, nome, especialidade, idPerfil, idEspecialidade];
    if (isAdmin.value) row.push("");
    return row;
  })
);
</script>
