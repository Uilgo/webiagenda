<template>
  <Modal
    :modelValue="props.modelValue"
    title="Excluir Cliente"
    @update:modelValue="(v) => emit('update:modelValue', v)"
  >
    <div class="space-y-4">
      <p class="text-sm text-muted-foreground">
        Tem certeza que deseja excluir o cliente
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
import { useClientes } from "~/composables/core/useClientes";
import type { ToastInterface } from "vue-toastification";
import type { Cliente } from "../../../../../shared/types/database";

interface Props {
  modelValue: boolean;
  clienteId?: number | null;
  clienteNome?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  clienteId: null,
  clienteNome: null,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "deleted"): void;
}>();

const saving = ref(false);
const fetching = ref(false);
const name = ref<string | null>(null);

const toast = useToast() as ToastInterface;

const displayName = computed(() => {
  // Se o modal estiver fechado, sempre usar placeholder
  if (!props.modelValue) return "---";
  return name.value ?? props.clienteNome ?? "---";
});

const resetForm = () => {
  saving.value = false;
  fetching.value = false;
  name.value = null;
};

const close = () => {
  resetForm();
  emit("update:modelValue", false);
};

const { deleteCliente, fetchClientes, clientes } = useClientes();

const remove = async () => {
  if (!props.clienteId) {
    toast.error("ID do cliente não informado.");
    return;
  }

  saving.value = true;
  try {
    const idNum = Number(props.clienteId);
    await deleteCliente(idNum);
    toast.success("Cliente excluído com sucesso.");
    emit("deleted");
    // reset antes de emitir para garantir que o modal não persista dados
    resetForm();
    emit("update:modelValue", false);
  } catch (e: any) {
    console.error(e);
    toast.error(e?.message || "Erro ao excluir cliente.");
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
      // Se o nome já foi fornecido pela página, usa diretamente
      if (props.clienteNome) {
        name.value = props.clienteNome;
        return;
      }

      // Senão, tentamos achar no cache de clientes
      const idNum = Number(props.clienteId);
      if (!Number.isNaN(idNum) && clientes.value && clientes.value.length > 0) {
        const found = (clientes.value as Cliente[]).find(
          (c: Cliente) => c.id === idNum
        );
        if (found) {
          name.value = found.nome ?? null;
          return;
        }
      }

      // Caso não esteja em cache, buscamos do servidor
      fetching.value = true;
      fetchClientes()
        .then(() => {
          const found = (clientes.value as Cliente[]).find(
            (c: Cliente) => c.id === idNum
          );
          name.value = found ? found.nome ?? null : null;
        })
        .catch((e) => {
          console.error("Erro ao buscar clientes para preencher nome:", e);
          name.value = null;
        })
        .finally(() => {
          fetching.value = false;
        });
    }
  },
  { immediate: true }
);
</script>
