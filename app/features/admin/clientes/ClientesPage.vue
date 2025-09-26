<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Clientes</h1>
      <div class="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="md"
          @click="refreshClientes"
          :iconLeft="ArrowPathIcon"
          :loading="isRefreshing"
          :disabled="isRefreshing"
        >
          Atualizar
        </Button>
        <Button @click="showModal = true"> Adicionar Cliente </Button>
      </div>
    </div>
    <ClientesTable :clientes="clientes" />
    <ClienteModal v-model="showModal" @saved="refreshClientes" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Button from "~/components/ui/Button.vue";
import ClientesTable from "./components/ClientesTable.vue";
import ClienteModal from "./components/ClienteModal.vue";
import { useClientes } from "../../../../app/composables/core/useClientes";
import { ArrowPathIcon } from "@heroicons/vue/24/outline";

const { clientes, loading, error, fetchClientes } = useClientes();

const isRefreshing = ref(false);
const showModal = ref(false);

const refreshClientes = async () => {
  if (isRefreshing.value) return;
  isRefreshing.value = true;
  try {
    await fetchClientes();
  } finally {
    isRefreshing.value = false;
  }
};

// Fetch clientes on component mount
await refreshClientes();
</script>
