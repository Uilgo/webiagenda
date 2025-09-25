<template>
  <Modal
    :modelValue="props.modelValue"
    :title="isEdicao ? 'Editar Profissional' : 'Novo Profissional'"
    @update:modelValue="(v) => emit('update:modelValue', v)"
  >
    <form id="profissional-form" @submit.prevent="save" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >Usuário (Perfil)</label
        >

        <Dropdown
          :usePortal="true"
          width="trigger"
          :triggerClass="'w-full rounded-md border px-3 py-2 text-left'"
        >
          <template #trigger="{ isOpen, toggle }">
            <div class="flex w-full justify-between items-center">
              <div class="truncate">
                <span v-if="form.user_id">{{
                  users?.find((u) => u.id === form.user_id)?.nome
                }}</span>
                <span v-else class="text-muted-foreground">Selecione</span>
              </div>
              <svg class="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </template>

          <template #content="{ close }">
            <div class="max-h-60 overflow-auto">
              <DropdownItem
                :label="'Nenhum'"
                @click="
                  () => {
                    form.user_id = null;
                    close();
                  }
                "
              />
              <DropdownItem
                v-for="u in users"
                :key="u.id"
                :label="u.nome || ''"
                @click="
                  () => {
                    form.user_id = u.id;
                    close();
                  }
                "
              />
            </div>
          </template>
        </Dropdown>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >Especialidade</label
        >

        <Dropdown
          :usePortal="true"
          width="trigger"
          :triggerClass="'w-full rounded-md border px-3 py-2 text-left'"
        >
          <template #trigger="{ isOpen, toggle }">
            <div class="flex w-full justify-between items-center">
              <div class="truncate">
                <span v-if="form.id_da_especialidade">{{
                  especialidades?.find((e) => e.id === form.id_da_especialidade)
                    ?.especialidade
                }}</span>
                <span v-else class="text-muted-foreground">Selecione</span>
              </div>
              <svg class="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </template>

          <template #content="{ close }">
            <div class="max-h-60 overflow-auto">
              <DropdownItem
                :label="'Nenhuma'"
                @click="
                  () => {
                    form.id_da_especialidade = null;
                    close();
                  }
                "
              />
              <DropdownItem
                v-for="esp in especialidades"
                :key="esp.id"
                :label="esp.especialidade || ''"
                @click="
                  () => {
                    form.id_da_especialidade = esp.id;
                    close();
                  }
                "
              />
            </div>
          </template>
        </Dropdown>
      </div>
    </form>

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
          type="submit"
          form="profissional-form"
          :disabled="saving || fetching"
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
import Dropdown from "~/components/ui/Dropdown.vue";
import DropdownItem from "~/components/ui/DropdownItem.vue";
import { useToast } from "~/composables/ui/useToast";
import { useProfissionais } from "~/composables/core/useProfissionais";
import type { ToastInterface } from "vue-toastification";

interface Props {
  modelValue: boolean;
  isEdicao?: boolean;
  profissionalId?: string | null;
  initialUserId?: number | null;
  initialEspecialidadeId?: number | null;
  users?: { id: number; nome: string | null }[];
  especialidades?: { id: number; especialidade: string | null }[];
}

const props = withDefaults(defineProps<Props>(), {
  isEdicao: false,
  profissionalId: null,
  initialUserId: null,
  initialEspecialidadeId: null,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "saved"): void;
}>();

const saving = ref(false);
const fetching = ref(false);

const form = ref({
  user_id: null as number | null,
  id_da_especialidade: null as number | null,
});

const toast = useToast() as ToastInterface;

const { insertProfissional, editProfissional } = useProfissionais();

const resetForm = () => {
  saving.value = false;
  fetching.value = false;
  form.value = { user_id: null, id_da_especialidade: null };
};

const close = () => {
  emit("update:modelValue", false);
  resetForm();
};

const save = async () => {
  if (!form.value.user_id) {
    toast.error("Selecione um usuário (perfil).");
    return;
  }
  if (!form.value.id_da_especialidade) {
    toast.error("Selecione uma especialidade.");
    return;
  }

  saving.value = true;

  try {
    if (props.isEdicao && props.profissionalId) {
      const result = await editProfissional(
        props.profissionalId,
        form.value.user_id,
        form.value.id_da_especialidade
      );

      const isSuccess =
        result === null ||
        typeof result === "undefined" ||
        (result && (result.success || result.payload));

      if (isSuccess) {
        toast.success(
          (result && result.message) || "Profissional atualizado com sucesso."
        );
        emit("saved");
        emit("update:modelValue", false);
      } else {
        throw new Error(result?.message || "Erro ao editar profissional.");
      }
    } else {
      const result = await insertProfissional(
        form.value.user_id,
        form.value.id_da_especialidade
      );

      const isSuccess =
        result === null ||
        typeof result === "undefined" ||
        (result && (result.success || result.payload));

      if (isSuccess) {
        toast.success(
          (result && result.message) || "Profissional criado com sucesso."
        );
        emit("saved");
        emit("update:modelValue", false);
      } else {
        throw new Error(result?.message || "Erro ao inserir profissional.");
      }
    }
  } catch (e: any) {
    console.error(e);
    toast.error(e?.message || "Erro ao salvar profissional.");
  } finally {
    saving.value = false;
  }
};

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      // modal aberto -> os dados (users/especialidades) já foram providos pela página
      if (props.isEdicao) {
        if (props.initialUserId) form.value.user_id = props.initialUserId;
        if (props.initialEspecialidadeId)
          form.value.id_da_especialidade = props.initialEspecialidadeId;
      } else {
        resetForm();
      }
    } else {
      resetForm();
    }
  },
  { immediate: true }
);
</script>
