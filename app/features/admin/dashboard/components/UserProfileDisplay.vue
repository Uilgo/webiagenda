<template>
  <div class="flex flex-col items-center justify-center">
    <h2 class="text-xl font-bold text-gray-800">
      {{ profissional?.nome_do_profissional || "Nome não disponível" }}
    </h2>
    <p class="text-base text-gray-600">
      {{
        profissional?.especialidade_do_profissional ||
        "Especialidade não disponível"
      }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { ProfissionalRPC } from "../../../../../shared/types/database";
import type { Profile } from "../../../../../shared/types/database";
import { useUserStore } from "../../../../../stores/user";
import { nextTick } from "vue";
import { useProfissionais } from "../../../../composables/core/useProfissionais";

const user = useSupabaseUser();
const userStore = useUserStore();

const profissionaisComposable = useProfissionais();

const { data: profissional } = await useAsyncData("user-profile", async () => {
  if (!user.value || !userStore.profile) {
    await nextTick();
    if (!userStore.profile) {
      return null;
    }
  }

  // Usa o profile do store
  const profileData = userStore.profile;

  // Tenta obter profissionais do cache/composable sem forçar
  await profissionaisComposable.fetchProfissionais();

  // Se outra chamada estiver em andamento, aguardamos um tick simples
  if (profissionaisComposable.isFetching?.value) {
    await nextTick();
  }

  let profissionaisList = profissionaisComposable.profissionais.value;

  // Se a lista ainda estiver vazia, tenta forçar um refetch (ex.: primeira carga)
  if (
    (!profissionaisList || profissionaisList.length === 0) &&
    typeof profissionaisComposable.fetchProfissionais === "function"
  ) {
    await profissionaisComposable.fetchProfissionais(true);
    profissionaisList = profissionaisComposable.profissionais.value;
  }

  if (!profissionaisList || profissionaisList.length === 0) {
    return null;
  }

  // Filtra pelo id do profile
  const matchingProfissional = profissionaisList.find(
    (p: ProfissionalRPC) => p.id_do_perfil === profileData.id
  );
  return matchingProfissional || profissionaisList[0] || null;
});
</script>
