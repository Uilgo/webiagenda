<template>
  <Modal
    :modelValue="props.modelValue"
    title="Novo Cliente"
    @update:modelValue="(value) => emit('update:modelValue', value)"
  >
    <form id="cliente-form" @submit.prevent="save" class="space-y-4 px-1 text-left">
      <div>
        <label for="nome" class="block text-sm font-medium text-gray-700 mb-2"
          >Nome</label
        >
        <Input
          id="nome"
          v-model="form.nome"
          type="text"
          required
          placeholder="Ex: João Silva"
          class="w-full"
        />
      </div>
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-2"
          >Email</label
        >
        <Input
          id="email"
          v-model="form.email"
          type="email"
          required
          placeholder="Ex: joao@example.com"
          class="w-full pr-4"
        />
      </div>
      <div>
        <label for="cpf" class="block text-sm font-medium text-gray-700 mb-2"
          >CPF</label
        >
        <Input
          id="cpf"
          v-model="form.cpf"
          type="text"
          placeholder="Ex: 123.456.789-00"
          class="w-full pr-4"
        />
      </div>
      <div>
        <label
          for="telefone"
          class="block text-sm font-medium text-gray-700 mb-2"
          >Telefone</label
        >
        <Input
          id="telefone"
          v-model="form.telefone"
          type="tel"
          placeholder="Ex: (11) 99999-9999"
          class="w-full pr-4"
        />
      </div>
      <div>
        <label
          for="endereco"
          class="block text-sm font-medium text-gray-700 mb-2"
          >Endereço</label
        >
        <Input
          id="endereco"
          v-model="form.endereco"
          type="text"
          placeholder="Ex: Rua Exemplo, 123"
          class="w-full pr-4"
        />
      </div>
    </form>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <Button type="button" variant="outline" @click="close">Cancelar</Button>
        <Button type="submit" form="cliente-form" :disabled="saving"
          >Salvar</Button
        >
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import Modal from "~/components/ui/Modal.vue";
import Button from "~/components/ui/Button.vue";
import Input from "~/components/ui/Input.vue";
import { useClientes } from "~/composables/core/useClientes";
import { useToast } from "~/composables/ui/useToast";
import type { ToastInterface } from "vue-toastification";
import type { Cliente } from "../../../../../shared/types/database";

interface Props {
  modelValue: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "saved"): void;
}>();

const saving = ref(false);

const form = ref({
  nome: "",
  email: "",
  cpf: "",
  telefone: "",
  endereco: "",
});

const toast = useToast() as ToastInterface;
const { addCliente } = useClientes();

const resetForm = () => {
  form.value = {
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    endereco: "",
  };
  saving.value = false;
};

const close = () => {
  emit("update:modelValue", false);
  resetForm();
};

const save = async () => {
  if (!form.value.nome.trim() || !form.value.email.trim()) {
    toast.error("Nome e email são obrigatórios.");
    return;
  }

  saving.value = true;

  try {
    const newCliente = {
      nome: form.value.nome.trim(),
      email: form.value.email.trim(),
      cpf: form.value.cpf.trim() || null,
      telefone: form.value.telefone.trim() || null,
      endereco: form.value.endereco.trim() || null,
    };

    await addCliente(newCliente);

    toast.success("Cliente criado com sucesso!");
    emit("update:modelValue", false);
    emit("saved");
  } catch (error: any) {
    toast.error(error.message || "Ocorreu um erro ao salvar o cliente.");
  } finally {
    saving.value = false;
  }
};

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      // Modal aberto para criação
      resetForm();
    } else {
      resetForm();
    }
  },
  { immediate: true }
);
</script>
