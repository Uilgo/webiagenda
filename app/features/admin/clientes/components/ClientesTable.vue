<template>
  <div
    class="overflow-x-auto rounded-lg border border-border shadow-sm p-4 overflow-hidden"
  >
    <table class="min-w-full divide-y divide-border">
      <thead class="bg-muted">
        <tr>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            ID
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            Nome
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            Email
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            CPF
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            Telefone
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            Endereço
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            Criado Em
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            Atualizado Em
          </th>
          <th
            scope="col"
            class="relative px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            Ações
          </th>
        </tr>
      </thead>
      <tbody class="bg-card divide-y divide-border">
        <tr
          v-for="cliente in clientes"
          :key="cliente.id"
          class="hover:bg-accent"
        >
          <td
            class="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground"
          >
            {{ cliente.id }}
          </td>
          <td
            class="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground"
          >
            {{ cliente.nome }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">
            {{ cliente.email }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">
            {{ formatCPF(cliente.cpf) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">
            {{ formatTelefone(cliente.telefone) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">
            {{ cliente.endereco }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">
            {{ formatDate(cliente.created_at) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">
            {{ formatDate(cliente.updated_at) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
            <div class="flex items-center justify-start space-x-2">
              <!-- Ícone de Editar -->
              <button class="text-blue-600 hover:text-blue-900" @click="$emit('edit-cliente', cliente)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.827-2.828z"
                  />
                </svg>
              </button>
              <!-- Ícone de Excluir -->
              <button class="text-red-600 hover:text-red-900" @click="$emit('delete-cliente', cliente)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
const formatCPF = (cpf: string | null) => {
  if (!cpf) return "";
  const cleaned = cpf.replace(/\D/g, "");
  return cleaned
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .substring(0, 14);
};

const formatTelefone = (telefone: string | null) => {
  if (!telefone) return "";
  const cleaned = telefone.replace(/\D/g, "");
  if (cleaned.length >= 11) {
    return cleaned
      .replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2.$3-$4")
      .substring(0, 16);
  } else if (cleaned.length >= 10) {
    return cleaned
      .replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")
      .substring(0, 14);
  }
  return "";
};

const emit = defineEmits<{
  'edit-cliente': [cliente: Cliente];
  'delete-cliente': [cliente: Cliente];
}>();

import type { Cliente } from "../../../../../shared/types/database";

interface Props {
  clientes: Cliente[];
}

const props = defineProps<Props>();

// Função para formatar a data
const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR");
};
</script>
