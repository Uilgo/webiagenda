<template>
  <div class="w-80">
    <Dropdown
      v-model="isDropdownOpen"
      position="bottom-left"
      width="trigger"
      trigger-class="w-full"
      :close-on-click-outside="true"
      :use-portal="false"
    >
      <!-- Trigger: Exibição do profissional atual -->
      <template #trigger="{ isOpen: dropdownOpen }">
        <div class="w-full">
          <div
            v-if="userStore.profissional"
            class="flex items-center gap-3 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors w-full"
          >
            <div
              class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"
            >
              <span class="text-blue-600 font-semibold text-xs">
                {{
                  userStore.profissional.nome_do_profissional?.charAt(0) || "P"
                }}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-900 truncate">
                {{ userStore.profissional.nome_do_profissional }}
              </h3>
              <p class="text-sm text-gray-600 truncate">
                {{ userStore.profissional.especialidade_do_profissional }}
              </p>
            </div>
            <ChevronDownIcon
              class="h-4 w-4 text-gray-400 transition-transform duration-200"
              :class="{ 'rotate-180': dropdownOpen }"
            />
          </div>
          <div
            v-else-if="userStore.profissionais.length > 0"
            class="flex items-center justify-center p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 w-full"
          >
            Nenhum profissional selecionado
          </div>
          <div
            v-else
            class="flex items-center justify-center p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 w-full"
          >
            Carregando profissional...
          </div>
        </div>
      </template>

      <!-- Conteúdo do Dropdown: Search + Lista -->
      <template #content="{ close }">
        <div class="w-full">
          <!-- Campo de busca -->
          <Input
            v-model="searchQuery"
            placeholder="Buscar por nome ou especialidade..."
            class="w-full mb-2"
            icon="search"
            :debounce="300"
          />

          <!-- Lista de profissionais filtrados -->
          <div v-if="isFetching" class="text-center py-4 text-gray-500">
            Carregando profissionais...
          </div>
          <div
            v-else-if="filteredProfissionais.length === 0"
            class="text-center py-4 text-gray-500"
          >
            Nenhum profissional encontrado.
          </div>
          <div v-else class="max-h-64 overflow-y-auto">
            <DropdownItem
              v-for="profissional in filteredProfissionais"
              :key="
                profissional.id_do_profissional ||
                profissional.id_do_perfil ||
                'default'
              "
              :label="
                profissional.nome_do_profissional || 'Nome não disponível'
              "
              @click="handleSelect(profissional, close)"
            >
              <template #icon>
                <div
                  class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"
                >
                  <span class="text-blue-600 font-semibold text-xs">
                    {{ profissional.nome_do_profissional?.charAt(0) || "P" }}
                  </span>
                </div>
              </template>
              <template #trailing>
                <p class="text-xs text-gray-500 truncate">
                  {{ profissional.especialidade_do_profissional }}
                </p>
              </template>
            </DropdownItem>
          </div>
        </div>
      </template>
    </Dropdown>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import type { ProfissionalRPC } from "../../../../../shared/types/database";
import { useProfissionais } from "../../../../composables/core/useProfissionais";
import { useUserStore } from "../../../../../stores/user";
import Dropdown from "../../../../components/ui/Dropdown.vue";
import DropdownItem from "../../../../components/ui/DropdownItem.vue";
import Input from "../../../../components/ui/Input.vue";
import { ChevronDownIcon } from "@heroicons/vue/24/outline";

interface Emits {
  (e: "select", profissional: ProfissionalRPC): void;
}

const emit = defineEmits<Emits>();

const isDropdownOpen = ref(false);
const { fetchProfissionais, isFetching } = useProfissionais();
const userStore = useUserStore();

const searchQuery = ref("");

const filteredProfissionais = computed(() => {
  if (!searchQuery.value.trim()) {
    return userStore.profissionais;
  }
  const query = searchQuery.value.toLowerCase();
  return userStore.profissionais.filter(
    (profissional) =>
      profissional.nome_do_profissional?.toLowerCase().includes(query) ||
      profissional.especialidade_do_profissional?.toLowerCase().includes(query)
  );
});

// Carrega profissionais se não estiverem no store (para o dropdown)
onMounted(async () => {
  if (userStore.profissionais.length === 0) {
    await fetchProfissionais();
  }
  const savedId = localStorage.getItem("selectedProfissionalId");
  if (savedId) {
    const id = parseInt(savedId, 10);
    const savedProf = userStore.profissionais.find(
      (p) => p.id_do_profissional === id
    );
    if (savedProf) {
      userStore.setProfissional(savedProf);
    }
  }
});

const handleSelect = (
  profissional: ProfissionalRPC,
  closeDropdown: () => void
) => {
  userStore.setProfissional(profissional);
  emit("select", profissional);
  closeDropdown();
  searchQuery.value = "";
};
</script>
