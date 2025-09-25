<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Profissionais</h1>
      <div class="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="md"
          @click="refreshProfissionais"
          :iconLeft="ArrowPathIcon"
          :loading="isRefreshing"
          :disabled="isRefreshing"
        >
          Atualizar
        </Button>
        <Button v-if="userStore.profile?.role === 'admin'" @click="openModal"
          >Adicionar Profissional</Button
        >
      </div>
    </div>

    <ProfissionaisTable
      :profissionais="profissionais"
      @edit-profissional="openEditModal"
      @delete-profissional="openDeleteModal"
    />

    <ProfissionalModal
      v-model="showModal"
      :isEdicao="isEdicao"
      :profissionalId="profissionalId"
      :initialUserId="initialUserId"
      :initialEspecialidadeId="initialEspecialidadeId"
      :users="users"
      :especialidades="especialidades"
      @saved="handleSaved"
    />

    <DeleteProfissionalModal
      v-model="showDeleteModal"
      :profissionalId="deleteId"
      :profissionalNome="deleteName"
      @deleted="handleDeleted"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import Button from "~/components/ui/Button.vue";
import ProfissionaisTable from "./components/ProfissionaisTable.vue";
import ProfissionalModal from "./components/ProfissionalModal.vue";
import DeleteProfissionalModal from "./components/DeleteProfissionalModal.vue";
import { useUserStore } from "../../../../stores/user";
import { ArrowPathIcon } from "@heroicons/vue/24/outline";
import { useProfissionais } from "../../../composables/core/useProfissionais";
import { useUsers } from "../../../composables/core/useUsers";
import { useEspecialidades } from "../../../composables/core/useEspecialidades";

const userStore = useUserStore();

// Inicializa os composables para ter acesso às funções de fetch
const profissionaisComposable = useProfissionais();
const usersComposable = useUsers();
const especialidadesComposable = useEspecialidades();

const { data: profissionaisData, refresh: refreshProfissionaisData } = await useAsyncData(
  "profissionais",
  async () => {
    await profissionaisComposable.fetchProfissionais();
    return profissionaisComposable.profissionais.value;
  }
);

const { data: usersData, refresh: refreshUsersData } = await useAsyncData(
  "users",
  async () => {
    await usersComposable.fetchUsers();
    return usersComposable.users.value;
  }
);

const { data: especialidadesData, refresh: refreshEspecialidadesData } = await useAsyncData(
  "especialidades",
  async () => {
    await especialidadesComposable.fetchEspecialidades();
    return especialidadesComposable.especialidades.value;
  }
);

const profissionais = computed(() => profissionaisData.value || []);
const users = computed(() => usersData.value || []);
const especialidades = computed(() => especialidadesData.value || []);

const isRefreshing = ref(false);

const showModal = ref(false);
const profissionalId = ref<string | null>(null);
const isEdicao = ref(false);
const initialNome = ref<string | null>(null);
const initialUserId = ref<number | null>(null);
const initialEspecialidadeId = ref<number | null>(null);

const openModal = () => {
  profissionalId.value = null;
  isEdicao.value = false;
  initialNome.value = null;
  initialUserId.value = null;
  initialEspecialidadeId.value = null;
  showModal.value = true;
};

const openEditModal = (id: string) => {
  // Prefill initial values from profissionais list (already fetched)
  const pid = Number(id);
  const prof = (profissionais.value || []).find(
    (p) => Number(p.id_do_profissional) === pid
  );

  profissionalId.value = id;
  isEdicao.value = true;

  if (prof) {
    initialNome.value = null;
    // id_do_perfil -> initialUserId
    initialEspecialidadeId.value = prof.id_da_especialidade ?? null;
    // set initial user id from id_do_perfil
    initialUserId.value = prof.id_do_perfil ?? null;
  } else {
    initialNome.value = null;
    initialEspecialidadeId.value = null;
    initialUserId.value = null;
  }

  showModal.value = true;
};

const showDeleteModal = ref(false);
const deleteId = ref<string | null>(null);
const deleteName = ref<string | null>(null);

const openDeleteModal = (id: string, name?: string | null) => {
  deleteId.value = id;
  deleteName.value = name ?? null;
  showDeleteModal.value = true;
};

const handleDeleted = async () => {
  showDeleteModal.value = false;
  await refreshProfissionaisData();
};

const refreshProfissionais = async () => {
  if (isRefreshing.value) return;
  isRefreshing.value = true;
  try {
    await refreshProfissionaisData();
  } finally {
    isRefreshing.value = false;
  }
};

const handleSaved = async () => {
  showModal.value = false;
  await refreshProfissionaisData();
  await refreshUsersData();
  await refreshEspecialidadesData();
};

</script>
