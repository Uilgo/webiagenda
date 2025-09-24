<template>
  <Modal
    :modelValue="modelValue"
    :title="isEdicao ? 'Editar Especialidade' : 'Nova Especialidade'"
    @update:modelValue="(value) => emit('update:modelValue', value)"
  >
    <form id="especialidade-form" @submit.prevent="save" class="space-y-4">
      <div>
        <label
          for="especialidade"
          class="block text-sm font-medium text-gray-700 mb-2"
          >Nome da Especialidade</label
        >
        <Input
          id="especialidade"
          v-model="form"
          type="text"
          required
          placeholder="Ex: Cardiologia"
          class="w-full"
        />
      </div>
    </form>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <Button type="button" variant="outline" @click="close">Cancelar</Button>
        <Button type="submit" form="especialidade-form" :disabled="saving"
          >Salvar</Button
        >
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
// import { defineProps, defineEmits } from 'vue'
import Modal from "~/components/ui/Modal.vue";
import Button from "~/components/ui/Button.vue";
import Input from "~/components/ui/Input.vue";
import { useEspecialidades } from "~/composables/core/useEspecialidades";
import { useToast } from "~/composables/ui/useToast";
import { type ToastInterface } from "vue-toastification";

interface Props {
  modelValue: boolean;
  isEdicao?: boolean;
  especialidadeId?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  isEdicao: false,
  especialidadeId: null,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "saved"): void;
}>();

// Removido localModelValue, usando props.modelValue diretamente no template e emitindo update:modelValue na função close

const form = ref("");

const saving = ref(false);

const { insertEspecialidade } = useEspecialidades();
const toast = useToast() as ToastInterface;

const fetchEspecialidade = async (id: string) => {
  const client = useSupabaseClient();
  const { data, error } = await (client.from("especialidades") as any)
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Erro ao buscar especialidade:", error);
    toast.error("Erro ao carregar especialidade para edição.");
    return;
  }

  if (data) {
    form.value = data.especialidade ?? "";
  }
};

const resetForm = () => {
  form.value = "";
  saving.value = false;
};

const close = () => {
  emit("update:modelValue", false);
  resetForm(); // Resetar o formulário e estado ao fechar
};

const save = async () => {
  if (!form.value.trim()) {
    return;
  }

  saving.value = true;

  const client = useSupabaseClient();

  try {
    if (props.isEdicao && props.especialidadeId) {
      // Update
      const { error } = await (client.from("especialidades") as any)
        .update({ especialidade: form.value })
        .eq("id", props.especialidadeId);

      if (error) throw error;

      toast.success("Especialidade atualizada com sucesso!");
    } else {
      // Insert
      const result = await insertEspecialidade(form.value);

      // removed debug log

      // Casos comuns:
      // - result === null/undefined, mas a operação foi realizada (alguns RPCs retornam nada)
      // - result = { success: true, message: '...' }
      // - result = { payload: {...} }
      const isSuccess =
        (result && typeof result === "object" && result.success === true) ||
        (result && typeof result === "object" && result.payload) ||
        result === null ||
        typeof result === "undefined";

      if (isSuccess) {
        toast.success(
          (result && result.message) || "Especialidade criada com sucesso!"
        );
        emit("update:modelValue", false); // Fechar o modal após salvar
        emit("saved");
      } else {
        throw new Error(result?.message || "Erro ao inserir especialidade.");
      }
    }
  } catch (error: any) {
    toast.error(error.message || "Ocorreu um erro ao salvar a especialidade.");
  } finally {
    saving.value = false;
  }
};

watch(
  () => [props.isEdicao, props.especialidadeId],
  ([isEdicao, especialidadeId]) => {
    if (isEdicao && especialidadeId) {
      fetchEspecialidade(especialidadeId as string);
    } else {
      form.value = "";
    }
  },
  { immediate: true }
);

// Quando o pai controla `modelValue` e fecha o modal (emit update:modelValue=false),
// precisamos garantir que o estado interno seja limpo — isto cobre fechar via pai
// ou via save() que emite update:modelValue.
watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      // modal foi fechado -> resetar estado interno
      resetForm();
    } else {
      // modal aberto para criação -> garantir formulário limpo quando não for edição
      if (!props.isEdicao) {
        form.value = "";
      }
    }
  }
);
</script>
