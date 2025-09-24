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
      @delete-especialidade="openDeleteModal"
    />

    <EspecialidadeModal
      v-model="showModal"
      :especialidadeId="especialidadeId"
      :isEdicao="isEdicao"
      :initialEspecialidade="initialEspecialidade"
      @saved="handleSaved"
    />

    <DeleteEspecialidadeModal
      v-model="showDeleteModal"
      :especialidadeId="deleteId"
      :especialidadeNome="deleteName"
      @deleted="handleDeleted"
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
const initialEspecialidade = ref<string | null>(null);

const openModal = () => {
  especialidadeId.value = null;
  isEdicao.value = false;
  initialEspecialidade.value = null;
  showModal.value = true;
};

const openEditModal = async (id: string) => {
  // Pré-carrega a especialidade antes de abrir o modal
  try {
    const client = useSupabaseClient();
    const { data, error } = await client
      .from("especialidades")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Erro ao buscar especialidade para edição:", error);
      // abrir o modal mesmo sem valor pré-carregado (modal fará fetch se necessário)
      especialidadeId.value = id;
      isEdicao.value = true;
      initialEspecialidade.value = null;
      showModal.value = true;
      return;
    }

    especialidadeId.value = id;
    isEdicao.value = true;
    // passa o valor pré-carregado para o modal e só então abre
    initialEspecialidade.value = (data as any)?.especialidade ?? null;
    showModal.value = true;
  } catch (e) {
    console.error(e);
    especialidadeId.value = id;
    isEdicao.value = true;
    showModal.value = true;
  }
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
import DeleteEspecialidadeModal from "./components/DeleteEspecialidadeModal.vue";

const isRefreshing = vueRef(false);

const showDeleteModal = ref(false);
const deleteId = ref<string | null>(null);
const deleteName = ref<string | null>(null);

const openDeleteModal = (id: string, name?: string | null) => {
  deleteId.value = id;
  deleteName.value = name ?? null;
  showDeleteModal.value = true;
};

const handleDeleted = () => {
  showDeleteModal.value = false;
  // refresh list
  fetchEspecialidades();
};

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
