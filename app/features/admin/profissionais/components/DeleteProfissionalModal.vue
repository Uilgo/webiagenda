<template>
  <Modal
    :modelValue="props.modelValue"
    title="Excluir Profissional"
    @update:modelValue="(v) => emit('update:modelValue', v)"
  >
    <div class="space-y-4">
      <p class="text-sm text-muted-foreground">
        Tem certeza que deseja excluir o profissional
        <strong class="font-medium">{{ displayName }}</strong
        >?
      </p>
      <p class="text-sm text-destructive">Esta ação é irreversível.</p>
    </div>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          @click="close"
          :disabled="saving || fetching"
          >Cancelar</Button
        >
        <Button
          type="button"
          variant="destructive"
          @click="remove"
          :disabled="saving || fetching"
        >
          <span v-if="saving">Excluindo...</span>
          <span v-else>Excluir</span>
        </Button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import Modal from "~/components/ui/Modal.vue";
import Button from "~/components/ui/Button.vue";
import { useToast } from "~/composables/ui/useToast";
import { useProfissionais } from "~/composables/core/useProfissionais";
import type { ToastInterface } from "vue-toastification";

interface Props {
  modelValue: boolean;
  profissionalId?: string | null;
  profissionalNome?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  profissionalId: null,
  profissionalNome: null,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "deleted"): void;
}>();

const saving = ref(false);
const fetching = ref(false);
const name = ref<string | null>(null);

const toast = useToast() as ToastInterface;

const displayName = computed(
  () => name.value ?? props.profissionalNome ?? "---"
);

const resetForm = () => {
  saving.value = false;
  fetching.value = false;
  name.value = null;
};

const close = () => {
  emit("update:modelValue", false);
  resetForm();
};

const { deleteProfissional } = useProfissionais();

const remove = async () => {
  if (!props.profissionalId) {
    toast.error("ID do profissional não informado.");
    return;
  }

  saving.value = true;
  try {
    const result = await deleteProfissional(props.profissionalId as string);

    const isSuccess =
      result === null ||
      typeof result === "undefined" ||
      (result && (result.success || result.payload));

    if (isSuccess) {
      toast.success(
        (result && result.message) || "Profissional excluído com sucesso."
      );
      emit("deleted");
      emit("update:modelValue", false);
    } else {
      throw new Error(result?.message || "Erro ao excluir profissional.");
    }
  } catch (e: any) {
    console.error(e);
    toast.error(e?.message || "Erro ao excluir profissional.");
  } finally {
    saving.value = false;
  }
};

watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      resetForm();
    } else {
      name.value = props.profissionalNome ?? null;
    }
  },
  { immediate: true }
);
</script>
