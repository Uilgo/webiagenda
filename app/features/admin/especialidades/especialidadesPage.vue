<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Especialidades</h1>
      <div class="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="md"
          @click="refreshEspecialidades"
          :iconLeft="ArrowPathIcon"
          :loading="isRefreshing"
          :disabled="isRefreshing"
        >
          Atualizar
        </Button>
        <Button v-if="userStore.profile?.role === 'admin'" @click="openModal">
          Adicionar Especialidade
        </Button>
      </div>
    </div>
    <EspecialidadeTable
      :especialidades="especialidades"
      @edit-especialidade="openEditModal"
    />

    <EspecialidadeModal
      v-model="showModal"
      :especialidadeId="especialidadeId"
      :isEdicao="isEdicao"
      @saved="handleSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import Button from "~/components/ui/Button.vue";
import EspecialidadeTable from "./components/EspecialidadeTable.vue";
import EspecialidadeModal from "./components/EspecialidadeModal.vue";
import { useUserStore } from "../../../../stores/user";
import { ArrowPathIcon } from "@heroicons/vue/24/outline";

const userStore = useUserStore();

const showModal = ref(false);
const especialidadeId = ref<string | null>(null);
const isEdicao = ref(false);

const openModal = () => {
  especialidadeId.value = null;
  isEdicao.value = false;
  showModal.value = true;
};

const openEditModal = (id: string) => {
  especialidadeId.value = id;
  isEdicao.value = true;
  showModal.value = true;
};

const { data: especialidadesData, refresh: fetchEspecialidades } =
  await useAsyncData("especialidades", async () => {
    const client = useSupabaseClient();
    const { data, error } = await client.from("especialidades").select("*");

    if (error) {
      console.error("Erro ao buscar especialidades:", error);
      throw error;
    }

    return data || [];
  });

import { ref as vueRef } from "vue";

const isRefreshing = vueRef(false);

const refreshEspecialidades = async () => {
  if (isRefreshing.value) return;
  isRefreshing.value = true;
  try {
    await fetchEspecialidades();
  } finally {
    isRefreshing.value = false;
  }
};

const handleSaved = () => {
  showModal.value = false;
  fetchEspecialidades();
};

const especialidades = computed(() => especialidadesData.value || []);
</script>
