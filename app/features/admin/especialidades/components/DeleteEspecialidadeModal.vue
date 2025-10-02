<template>
  <Modal
    :modelValue="props.modelValue"
    title="Excluir Especialidade"
    @update:modelValue="(v) => emit('update:modelValue', v)"
  >
    <div class="space-y-4">
      <p class="text-sm text-muted-foreground">
        Tem certeza que deseja excluir a especialidade
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
import { useEspecialidades } from "~/composables/core/useEspecialidades";
import type { ToastInterface } from "vue-toastification";

interface Props {
  modelValue: boolean;
  especialidadeId?: string | null;
  especialidadeNome?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  especialidadeId: null,
  especialidadeNome: null,
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
  () => name.value ?? props.especialidadeNome ?? "---"
);

const fetchName = async (id: string) => {
  const client = useSupabaseClient();
  fetching.value = true;
  try {
    const { data, error } = await client
      .from("especialidades")
      .select("especialidade")
      .eq("id", id)
      .maybeSingle();
    if (error) {
      console.error("Erro ao buscar especialidade:", error);
      return;
    }
    if (data) name.value = (data as any).especialidade ?? null;
  } finally {
    fetching.value = false;
  }
};

const resetForm = () => {
  saving.value = false;
  fetching.value = false;
  name.value = null;
};

const close = () => {
  emit("update:modelValue", false);
  resetForm();
};

const { deleteEspecialidade } = useEspecialidades();

const remove = async () => {
  if (!props.especialidadeId) {
    toast.error("ID da especialidade não informado.");
    return;
  }

  saving.value = true;
  try {
    const result = await deleteEspecialidade(props.especialidadeId as string);

    const isSuccess =
      result === null ||
      typeof result === "undefined" ||
      (result && result.success) ||
      (result && result.payload);

    if (isSuccess) {
      toast.success(
        (result && result.message) || "Especialidade excluída com sucesso."
      );
      emit("update:modelValue", false);
      emit("deleted");
    } else {
      throw new Error(result?.message || "Erro ao excluir especialidade.");
    }
  } catch (e: any) {
    console.error(e);
    toast.error(e?.message || "Erro ao excluir especialidade.");
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
      // modal aberto
      if (!props.especialidadeNome && props.especialidadeId) {
        // buscar nome se não foi passado pelo pai
        fetchName(props.especialidadeId);
      } else {
        name.value = props.especialidadeNome ?? null;
      }
    }
  },
  { immediate: true }
);
</script>
