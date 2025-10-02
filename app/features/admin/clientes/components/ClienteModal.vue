<template>
  <Modal
    :modelValue="props.modelValue"
    :title="isEdicao ? 'Editar Cliente' : 'Novo Cliente'"
    @update:modelValue="(value) => emit('update:modelValue', value)"
  >
    <form
      id="cliente-form"
      @submit.prevent="save"
      class="space-y-4 px-1 text-left"
    >
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
          @blur="validateNome"
        />
        <div v-if="errors.nome" class="text-red-500 text-sm mt-1">
          {{ errors.nome }}
        </div>
      </div>
      <div v-if="!isEdicao">
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
          @blur="validateEmail"
        />
        <div v-if="errors.email" class="text-red-500 text-sm mt-1">
          {{ errors.email }}
        </div>
      </div>
      <div v-else>
        <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <p class="text-sm text-gray-900 bg-gray-100 p-2 rounded">{{ props.cliente?.email }}</p>
      </div>
      <div v-if="!isEdicao">
        <label for="cpf" class="block text-sm font-medium text-gray-700 mb-2"
          >CPF</label
        >
        <Input
          id="cpf"
          v-model="form.cpf"
          type="text"
          placeholder="Ex: 123.456.789-00"
          class="w-full pr-4"
          @keypress="handleNumberInput"
          @blur="validateCPF"
        />
        <div v-if="errors.cpf" class="text-red-500 text-sm mt-1">
          {{ errors.cpf }}
        </div>
      </div>
      <div v-else>
        <label class="block text-sm font-medium text-gray-700 mb-2">CPF</label>
        <p class="text-sm text-gray-900 bg-gray-100 p-2 rounded">{{ formatCPF(props.cliente?.cpf || '') }}</p>
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
          @keypress="handleNumberInput"
          @blur="validateTelefone"
        />
        <div v-if="errors.telefone" class="text-red-500 text-sm mt-1">
          {{ errors.telefone }}
        </div>
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
import { ref, watch, nextTick, computed } from "vue";
import Modal from "~/components/ui/Modal.vue";
import Button from "~/components/ui/Button.vue";
import Input from "~/components/ui/Input.vue";
import { useClientes } from "~/composables/core/useClientes";
import { useToast } from "~/composables/ui/useToast";
import type { ToastInterface } from "vue-toastification";
import type { Cliente } from "../../../../../shared/types/database";

interface Props {
  modelValue: boolean;
  cliente?: Cliente | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "saved"): void;
}>();

const isEdicao = computed(() => !!props.cliente);

const saving = ref(false);

const errors = ref({
  nome: "",
  email: "",
  cpf: "",
  telefone: "",
});

const form = ref({
  nome: "",
  email: "",
  cpf: "",
  telefone: "",
  endereco: "",
});

const toast = useToast() as ToastInterface;
const { addCliente, updateCliente } = useClientes();

const handleNumberInput = (event: KeyboardEvent) => {
  if (event.key.length === 1 && !/[0-9]/.test(event.key)) {
    event.preventDefault();
  }
};

const formatCPF = (value: string) => {
  const cleaned = value.replace(/\D/g, "");
  return cleaned
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .substring(0, 14);
};

const formatTelefone = (value: string) => {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length >= 11) {
    return cleaned
      .replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2.$3-$4")
      .substring(0, 16);
  } else if (cleaned.length >= 10) {
    return cleaned
      .replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")
      .substring(0, 14);
  }
  return value;
};

const validateNome = () => {
  const nome = form.value.nome.trim();
  if (!nome) {
    errors.value.nome = "Nome é obrigatório.";
    return false;
  }
  errors.value.nome = "";
  return true;
};

const validateEmail = () => {
  const email = form.value.email.trim();
  if (!email) {
    errors.value.email = "Email é obrigatório.";
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.value.email = "Email deve ser um endereço válido.";
    return false;
  }
  errors.value.email = "";
  return true;
};

const validateCPF = () => {
  const cpf = form.value.cpf.replace(/\D/g, "");
  if (!cpf) {
    errors.value.cpf = "";
    return true;
  }
  if (cpf.length !== 11) {
    errors.value.cpf = "CPF deve ter 11 dígitos.";
    return false;
  }
  // Verificar se todos dígitos iguais
  if (/^(\d)\1{10}$/.test(cpf)) {
    errors.value.cpf = "CPF inválido.";
    return false;
  }
  // Algoritmo verificador
  let sum = 0;
  let remainder;
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) {
    errors.value.cpf = "CPF inválido.";
    return false;
  }
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) {
    errors.value.cpf = "CPF inválido.";
    return false;
  }
  errors.value.cpf = "";
  return true;
};

const validateTelefone = () => {
  const telefone = form.value.telefone.replace(/\D/g, "");
  if (!telefone) {
    errors.value.telefone = "";
    return true;
  }
  if (telefone.length !== 10 && telefone.length !== 11) {
    errors.value.telefone = "Telefone deve ter 10 ou 11 dígitos.";
    return false;
  }
  const formatted = formatTelefone(telefone);
  if (telefone.length === 11 && !/^\(\d{2}\) 9\.\d{4}-\d{4}$/.test(formatted)) {
    errors.value.telefone =
      "Formato de telefone inválido (deve ser (XX) 9.XXXX-XXXX).";
    return false;
  } else if (
    telefone.length === 10 &&
    !/^\(\d{2}\) \d{4}-\d{4}$/.test(formatted)
  ) {
    errors.value.telefone =
      "Formato de telefone inválido (deve ser (XX) XXXX-XXXX).";
    return false;
  }
  errors.value.telefone = "";
  return true;
};

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

const populateForm = () => {
  if (props.cliente) {
    form.value = {
      nome: props.cliente.nome || "",
      email: props.cliente.email || "",
      cpf: props.cliente.cpf ? formatCPF(props.cliente.cpf) : "",
      telefone: props.cliente.telefone
        ? formatTelefone(props.cliente.telefone)
        : "",
      endereco: props.cliente.endereco || "",
    };
  }
};

const close = () => {
  emit("update:modelValue", false);
  resetForm();
  errors.value = { nome: "", email: "", cpf: "", telefone: "" };
};

const save = async () => {
  // Limpar erros anteriores
  errors.value = { nome: "", email: "", cpf: "", telefone: "" };

  if (!validateNome()) {
    toast.error("Nome é obrigatório.");
    return;
  }

  if (!isEdicao.value) {
    if (!validateEmail()) {
      toast.error("Email inválido.");
      return;
    }

    if (!validateCPF()) {
      toast.error("CPF inválido.");
      return;
    }
  }

  if (!validateTelefone()) {
    toast.error("Telefone inválido.");
    return;
  }

  saving.value = true;

  try {
    if (isEdicao.value) {
      const updateData = {
        nome: form.value.nome.trim(),
        telefone: form.value.telefone.replace(/\D/g, "") || null,
        endereco: form.value.endereco.trim() || null,
      };
      await updateCliente(props.cliente!.id, updateData);
      toast.success("Cliente atualizado com sucesso!");
    } else {
      const newCliente = {
        nome: form.value.nome.trim(),
        email: form.value.email.trim(),
        cpf: form.value.cpf.replace(/\D/g, "") || null,
        telefone: form.value.telefone.replace(/\D/g, "") || null,
        endereco: form.value.endereco.trim() || null,
      };
      await addCliente(newCliente);
      toast.success("Cliente criado com sucesso!");
    }

    emit("update:modelValue", false);
    emit("saved");
  } catch (error: any) {
    if (error.message && error.message.includes("clientes_cpf_key")) {
      toast.error("Este CPF já está cadastrado.");
    } else {
      toast.error(error.message || "Ocorreu um erro ao salvar o cliente.");
    }
  } finally {
    saving.value = false;
  }
};

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      if (props.cliente) {
        populateForm();
      } else {
        resetForm();
      }
      errors.value = { nome: "", email: "", cpf: "", telefone: "" };
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

// Watchers para máscaras
watch(
  () => form.value.cpf,
  async (newVal) => {
    if (newVal) {
      const formatted = formatCPF(newVal);
      if (formatted !== newVal) {
        await nextTick();
        form.value.cpf = formatted;
      }
    }
  }
);

watch(
  () => form.value.telefone,
  async (newVal) => {
    if (newVal) {
      const formatted = formatTelefone(newVal);
      if (formatted !== newVal) {
        await nextTick();
        form.value.telefone = formatted;
      }
    }
  }
);
</script>
