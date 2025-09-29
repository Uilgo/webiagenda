<template>
  <div
    class="flex flex-col items-center justify-center cursor-pointer"
    @click="$emit('open-modal')"
  >
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
import { onMounted, ref, watch } from "vue";
import type { ProfissionalRPC } from "../../../../../shared/types/database";
import type { Profile } from "../../../../../shared/types/database";
import { useUserStore } from "../../../../../stores/user";
import { useProfissionais } from "../../../../composables/core/useProfissionais";

defineEmits<{
  (e: "open-modal"): void;
}>();

const userStore = useUserStore();
const profissionaisComposable = useProfissionais();

const profissional = ref<ProfissionalRPC | null>(null);

const updateProfissional = () => {
  if (userStore.profissional) {
    profissional.value = userStore.profissional;
    return;
  }

  if (!userStore.profile || profissionaisComposable.profissionais.value.length === 0) {
    profissional.value = null;
    return;
  }

  const matchingProfissional = profissionaisComposable.profissionais.value.find(
    (p: ProfissionalRPC) => p.id_do_perfil === userStore.profile?.id
  );
  profissional.value = matchingProfissional || null;
};

onMounted(async () => {
  await profissionaisComposable.fetchProfissionais(true);
  updateProfissional();
});

watch(
  () => userStore.profissional,
  () => {
    updateProfissional();
  }
);

watch(
  () => userStore.profile,
  () => {
    updateProfissional();
  }
);

watch(
  () => profissionaisComposable.profissionais.value.length,
  () => {
    updateProfissional();
  }
);
</script>
