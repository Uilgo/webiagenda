<template>
  <div class="lista-agendamentos flex flex-col h-full bg-background">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-foreground">
        Relatório de Agendamentos
      </h2>
      <div class="flex justify-between items-center mt-1">
        <p class="text-muted-foreground">
          Visualização detalhada dos agendamentos | ({{ agendamentos.length }}
          Agendamentos)
        </p>
        <Button
          variant="outline"
          size="sm"
          :icon-left="ArrowPathIcon"
          @click="buscarAgendamentos"
        >
          Refresh
        </Button>
      </div>
    </div>

    <!-- Filtros -->
    <div class="flex gap-4 mb-4 items-end justify-start max-w-2xl">
      <!-- Filtro de Cliente -->
      <div class="flex-1 max-w-80">
        <label class="block text-sm font-medium text-foreground mb-2">
          Filtrar por Cliente
        </label>
        <Dropdown :use-portal="true" width="md">
          <template #trigger>
            <Input
              :modelValue="
                selectedCliente ? selectedCliente.nome : 'Selecione um cliente'
              "
              readonly
              class="w-full"
            />
          </template>
          <template #content="{ close }">
            <div class="p-2">
              <Input
                v-model="searchClienteTerm"
                placeholder="Buscar cliente..."
                :icon-left="MagnifyingGlassIcon"
                class="w-full"
              />
              <div class="max-h-60 overflow-y-auto mt-2">
                <DropdownItem
                  v-for="cliente in displayClientes"
                  :key="cliente.id"
                  @click="
                    selectedCliente = cliente;
                    close();
                  "
                >
                  {{ cliente.nome }}
                </DropdownItem>
              </div>
              <div
                v-if="displayClientes.length === 0 && searchClienteTerm"
                class="px-2 py-2 text-sm text-muted-foreground"
              >
                Nenhum cliente encontrado.
              </div>
            </div>
          </template>
        </Dropdown>
      </div>

      <!-- Filtro de Profissional -->
      <div class="flex-1 max-w-80">
        <label class="block text-sm font-medium text-foreground mb-2">
          Filtrar por Profissional
        </label>
        <Dropdown :use-portal="true" width="md">
          <template #trigger>
            <Input
              :modelValue="
                selectedProfissional
                  ? selectedProfissional.nome
                  : 'Selecione um profissional'
              "
              readonly
              class="w-full"
            />
          </template>
          <template #content="{ close }">
            <div class="p-2">
              <Input
                v-model="searchProfissionalTerm"
                placeholder="Buscar profissional..."
                :icon-left="MagnifyingGlassIcon"
                class="w-full"
              />
              <div class="max-h-60 overflow-y-auto mt-2">
                <DropdownItem
                  v-for="profissional in displayProfissionais"
                  :key="profissional.id"
                  @click="
                    selectedProfissional = profissional;
                    close();
                  "
                >
                  {{ profissional.nome }}
                </DropdownItem>
              </div>
              <div
                v-if="
                  displayProfissionais.length === 0 && searchProfissionalTerm
                "
                class="px-2 py-2 text-sm text-muted-foreground"
              >
                Nenhum profissional encontrado.
              </div>
            </div>
          </template>
        </Dropdown>
      </div>
      <div class="flex-shrink-0">
        <Button
          variant="outline"
          size="sm"
          @click="clearFilters"
        >
          Limpar Filtros
        </Button>
      </div>
    </div>

    <!-- Container da tabela -->
    <div
      class="border border-border rounded-lg overflow-hidden flex flex-col flex-1 bg-card"
    >
      <!-- Cabeçalho da tabela -->
      <div
        class="bg-muted border-b border-border pl-4 pr-8 py-3 hidden md:grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground uppercase tracking-wider"
      >
        <div class="md:col-span-2">Título e Data</div>
        <div class="md:col-span-2">Descrição</div>
        <div class="md:col-span-2">Cliente</div>
        <div class="md:col-span-2">Profissional</div>
        <div class="md:col-span-2">Telefone</div>
        <div class="md:col-span-1">Criado em</div>
        <div class="md:col-span-1 text-center">Status</div>
      </div>

      <!-- Área de conteúdo scrollável -->
      <div class="flex-1 overflow-hidden p-4">
        <div class="h-full overflow-auto">
          <!-- Loading -->
          <div
            v-if="loading"
            class="flex justify-center items-center py-12 bg-card"
          >
            <div
              class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"
            ></div>
          </div>

          <!-- Mensagem de Erro -->
          <div
            v-else-if="error"
            class="bg-destructive/10 border-b border-destructive/30 text-destructive px-4 py-3"
          >
            <p>{{ error }}</p>
          </div>

          <!-- Cards de Agendamentos (layout horizontal como tabela) -->
          <div v-else-if="agendamentos.length > 0" class="space-y-4 pr-4">
            <CardAgendamento
              v-for="agendamento in filteredAgendamentos"
              :key="agendamento.id"
              :agendamento="agendamento"
            />
          </div>
          <div
            v-else-if="!loading"
            class="text-center py-8 text-muted-foreground bg-card"
          >
            <p>Nenhum agendamento encontrado</p>
            <p class="text-sm mt-2">
              Total de agendamentos filtrados:
              {{ filteredAgendamentos.length }} (total:
              {{ agendamentos.length }})
            </p>
          </div>

          <!-- Mensagem quando não há agendamentos -->
          <div v-else class="bg-card p-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-16 w-16 mx-auto text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 class="mt-4 text-lg font-medium text-foreground">
              Nenhum agendamento encontrado
            </h3>
            <p class="mt-1 text-muted-foreground">
              Nenhum agendamento disponível
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useAgendamento } from "../../../../composables/core/useAgendamento";
import { useClientes } from "../../../../composables/core/useClientes";
import type { ViewAgendamento } from "../../../../../shared/types/database";
import { useProfissionais } from "../../../../composables/core/useProfissionais";
import CardAgendamento from "./CardAgendamento.vue";
import Button from "../../../../components/ui/Button.vue";
import Dropdown from "../../../../components/ui/Dropdown.vue";
import DropdownItem from "../../../../components/ui/DropdownItem.vue";
import Input from "../../../../components/ui/Input.vue";
import { ArrowPathIcon } from "@heroicons/vue/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/vue/24/outline";

const { fetchRelatorioAgendamentos } = useAgendamento();
const { fetchClientes, clientes } = useClientes();
const { fetchProfissionais, profissionais } = useProfissionais();

// Estados
const agendamentos = ref<ViewAgendamento[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const selectedCliente = ref<{ id: number; nome: string } | null>(null);
const searchClienteTerm = ref("");
const selectedProfissional = ref<{ id: number; nome: string } | null>(null);
const searchProfissionalTerm = ref("");

const displayClientes = computed(() =>
  clientes.value
    .filter((cliente: any) => cliente.nome != null)
    .filter((cliente) =>
      cliente
        .nome!.toLowerCase()
        .includes(searchClienteTerm.value.toLowerCase())
    )
    .map((cliente) => ({ id: cliente.id, nome: cliente.nome! }))
);

const displayProfissionais = computed(() =>
  profissionais.value
    .filter((profissional: any) => profissional.nome_do_profissional != null)
    .filter((profissional) =>
      profissional
        .nome_do_profissional!.toLowerCase()
        .includes(searchProfissionalTerm.value.toLowerCase())
    )
    .map((profissional) => ({
      id: profissional.id_do_profissional!,
      nome: profissional.nome_do_profissional!,
    }))
);

const filteredAgendamentos = computed(() => {
  let filtered = agendamentos.value;
  if (selectedCliente.value) {
    filtered = filtered.filter(
      (a) => a.cliente_id === selectedCliente.value!.id
    );
  }
  if (selectedProfissional.value) {
    filtered = filtered.filter(
      (a) => a.profissionais_id === selectedProfissional.value!.id
    );
  }
  return filtered;
});

const clearFilters = () => {
  selectedCliente.value = null;
  selectedProfissional.value = null;
  searchClienteTerm.value = '';
  searchProfissionalTerm.value = '';
};

// Função para buscar agendamentos
const buscarAgendamentos = async () => {
  loading.value = true;
  error.value = null;

  try {
    console.log("Buscando todos os agendamentos sem filtros");

    const ags = await fetchRelatorioAgendamentos();

    console.log("Dados recebidos:", ags);
    agendamentos.value = ags;

    console.log("Número de agendamentos:", ags.length);
  } catch (err: any) {
    console.error("Erro ao buscar agendamentos:", err);
    error.value = err.message || "Erro ao buscar agendamentos";
  } finally {
    loading.value = false;
  }
};

// Carregar dados quando o componente for montado
onMounted(async () => {
  try {
    await Promise.all([
      fetchClientes(),
      fetchProfissionais(),
      buscarAgendamentos(),
    ]);
  } catch (err: any) {
    console.error("Erro ao carregar dados iniciais:", err);
    error.value = err.message || "Erro ao carregar dados iniciais";
  }
});
</script>

<style scoped>
.lista-agendamentos {
  @apply w-full h-full;
}
</style>
