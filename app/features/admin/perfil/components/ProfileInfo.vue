<template>
  <div
    class="bg-card border border-border rounded-lg shadow-sm p-6 h-[calc(100vh-14rem)]"
  >
    <h2 class="text-xl font-semibold text-foreground mb-6">
      Informações Pessoais
    </h2>

    <!-- Avatar Placeholder -->
    <div class="flex items-center mb-6">
      <div
        class="w-20 h-20 bg-muted rounded-full flex items-center justify-center mr-4"
      >
        <span class="text-muted-foreground text-xl">👤</span>
      </div>
      <div>
        <label class="block text-sm font-medium text-foreground mb-1"
          >Foto de Perfil</label
        >
        <input type="file" accept="image/*" class="hidden" id="avatar-upload" />
        <label
          for="avatar-upload"
          class="cursor-pointer inline-flex items-center px-4 py-2 border border-border rounded-md shadow-sm text-sm font-medium text-foreground bg-card hover:bg-accent"
        >
          Alterar Foto
        </label>
      </div>
    </div>

    <!-- Campos de Nome e Email -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label for="nome" class="block text-sm font-medium text-foreground mb-2"
          >Nome Completo</label
        >
        <Input
          id="nome"
          v-model="profileName"
          type="text"
          placeholder="Digite seu nome"
          class="w-full"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-foreground mb-2"
          >Email</label
        >
        <p class="text-foreground bg-muted px-3 py-2 rounded-md">
          {{ profileEmail }}
        </p>
      </div>
    </div>

    <!-- Botão Salvar -->
    <div class="mt-6 flex justify-end">
      <Button
        type="button"
        :disabled="isLoading"
        @click="handleSave"
        class="px-6 py-2"
      >
        <span v-if="isLoading">Salvando...</span>
        <span v-else>Salvar Alterações</span>
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useUserStore } from "../../../../../stores/user";
import { useAuth } from "~/composables/core/useAuth";
import { useToast } from "~/composables/ui/useToast";
import { TYPE } from 'vue-toastification';
import Input from "~/components/ui/Input.vue";
import Button from "~/components/ui/Button.vue";

const userStore = useUserStore();
const { editName, isLoading } = useAuth();
const toast = useToast();

const profileName = computed({
  get: () => userStore.profile?.nome || "",
  set: (value: string) => {
    if (userStore.profile) {
      userStore.profile.nome = value;
    }
  },
});

const profileEmail = computed(() => userStore.user?.email || "");

const handleSave = async () => {
  if (!profileName.value.trim()) {
    toast("O nome não pode estar vazio.", { type: TYPE.ERROR });
    return;
  }

  const result = await editName(profileName.value);
  if (result.success) {
    toast(result.message, { type: TYPE.SUCCESS });
  } else {
    toast(result.message, { type: TYPE.ERROR });
  }
};
</script>
