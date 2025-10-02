<template>
  <Modal
    :modelValue="props.modelValue"
    title="Confirmar Deleção"
    @update:modelValue="(value) => emit('update:modelValue', value)"
  >
    <div class="p-6 text-center">
      <div
        class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-destructive/10 mb-4"
      >
        <TrashIcon class="h-6 w-6 text-destructive" />
      </div>
      <h3 class="text-lg font-medium text-foreground mb-2">Deletar Usuário</h3>
      <p class="text-sm text-muted-foreground mb-6">
        Tem certeza que deseja deletar o usuário <strong>{{ props.userName }}</strong>? Esta ação não pode ser desfeita.
      </p>
    </div>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <Button type="button" variant="outline" @click="close">Cancelar</Button>
        <Button type="button" variant="destructive" @click="handleDelete"
          >Deletar Usuário</Button
        >
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Modal from "~/components/ui/Modal.vue";
import Button from "~/components/ui/Button.vue";
import { TrashIcon } from "@heroicons/vue/24/outline";
import { useToast } from "~/composables/ui/useToast";
import { useUsers } from "~/composables/core/useUsers";

const toast = useToast();
const { fetchUsers } = useUsers();

interface Props {
  modelValue: boolean;
  userId: string;
  userName: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "user-deleted"): void;
}>();

const close = () => {
  emit("update:modelValue", false);
};

const handleDelete = async () => {
  try {
    interface DeleteResponse {
      success: boolean;
      error?: string;
      message?: string;
    }

    const response = await $fetch<DeleteResponse>("/api/delete-user", {
      method: "DELETE",
      params: { user_id: props.userId },
    });

    if (response.success) {
      toast.success("Usuário deletado com sucesso!");
      emit("user-deleted");
      close();
    } else {
      toast.error(response.error || "Erro ao deletar usuário");
    }
  } catch (error) {
    toast.error("Erro ao deletar usuário: " + (error as Error).message);
  }
};
</script>
