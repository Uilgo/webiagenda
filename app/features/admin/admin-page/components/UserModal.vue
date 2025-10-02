<template>
  <Modal
    :modelValue="props.modelValue"
    title="Novo Usuário"
    @update:modelValue="(value) => emit('update:modelValue', value)"
  >
    <form id="user-form" @submit.prevent="handleSubmit" class="space-y-4 px-1 text-left">
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
          class="w-full"
        />
      </div>
      <div>
        <label for="senha" class="block text-sm font-medium text-gray-700 mb-2"
          >Senha</label
        >
        <Input
          id="senha"
          v-model="form.senha"
          type="password"
          required
          placeholder="Digite a senha"
          class="w-full"
        />
      </div>
      <div>
        <label
          for="confirmar-senha"
          class="block text-sm font-medium text-gray-700 mb-2"
          >Confirmar Senha</label
        >
        <Input
          id="confirmar-senha"
          v-model="form.confirmarSenha"
          type="password"
          required
          placeholder="Confirme a senha"
          class="w-full"
        />
      </div>
      <div>
        <label for="tipo" class="block text-sm font-medium text-gray-700 mb-2">Tipo de Usuário</label>
        <Dropdown class="w-full" :closeOnClickOutside="true" :usePortal="true">
          <template #trigger="{ isOpen, toggle }">
            <div class="flex items-center justify-between w-full px-3 py-2 border border-input rounded-md bg-background text-foreground">
              <span>{{ getTipoLabel(form.tipo) }}</span>
              <ChevronDownIcon
                class="h-4 w-4 transition-transform duration-200"
                :class="{ 'rotate-180': isOpen }"
              />
            </div>
          </template>
          <template #content="{ close }">
            <DropdownItem @click="selectTipo('admin', close)">Admin</DropdownItem>
            <DropdownItem @click="selectTipo('usuario', close)">Usuário</DropdownItem>
          </template>
        </Dropdown>
      </div>
    </form>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <Button type="button" variant="outline" @click="close">Cancelar</Button>
        <Button type="submit" form="user-form">Criar Usuário</Button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Modal from "~/components/ui/Modal.vue";
import Button from "~/components/ui/Button.vue";
import Input from "~/components/ui/Input.vue";
import Dropdown from "~/components/ui/Dropdown.vue";
import DropdownItem from "~/components/ui/DropdownItem.vue";
import { ChevronDownIcon } from "@heroicons/vue/24/outline";
import { useToast } from "~/composables/ui/useToast";

const toast = useToast();

interface Props {
  modelValue: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "user-created"): void;
}>();

const form = ref({
  nome: "",
  email: "",
  senha: "",
  confirmarSenha: "",
  tipo: "usuario",
});

const getTipoLabel = (value: string) => {
  return value === "admin" ? "Admin" : "Usuário";
};

const selectTipo = (value: string, close: () => void) => {
  form.value.tipo = value;
  close();
};

const close = () => {
  emit("update:modelValue", false);
  form.value = { nome: "", email: "", senha: "", confirmarSenha: "", tipo: "usuario" };
};

const handleSubmit = async () => {
  if (!form.value.nome || !form.value.email || !form.value.senha || !form.value.confirmarSenha) {
    toast.error("Todos os campos são obrigatórios");
    return;
  }

  if (form.value.senha !== form.value.confirmarSenha) {
    toast.error("As senhas não coincidem");
    return;
  }

  if (form.value.senha.length < 6) {
    toast.error("A senha deve ter pelo menos 6 caracteres");
    return;
  }

  try {
    const response = await $fetch('/api/create-user', {
      method: 'POST',
      body: {
        nome: form.value.nome,
        email: form.value.email,
        password: form.value.senha,
        role: form.value.tipo === 'admin' ? 'admin' : 'user'
      }
    });

    if (response.success) {
      toast.success("Usuário criado com sucesso!");
      emit('user-created');
      close();
    } else {
      toast.error((response as any).error || "Erro ao criar usuário");
    }
  } catch (error) {
    toast.error("Erro ao criar usuário: " + (error as Error).message);
  }
};
</script>
