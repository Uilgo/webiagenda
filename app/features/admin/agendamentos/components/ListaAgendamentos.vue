<template>
  <div class="lista-agendamentos flex flex-col h-full bg-background">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-foreground">Relatório de Agendamentos</h2>
      <p class="text-muted-foreground">Visualização detalhada dos agendamentos</p>
    </div>

    <!-- Container da tabela -->
    <div class="border border-border rounded-lg overflow-hidden flex flex-col flex-1 bg-card">
      <!-- Cabeçalho da tabela -->
      <div class="bg-muted border-b border-border px-4 py-3 hidden md:grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        <div class="md:col-span-3">Título e Data</div>
        <div class="md:col-span-2">Cliente</div>
        <div class="md:col-span-2">Profissional</div>
        <div class="md:col-span-2">Telefone</div>
        <div class="md:col-span-2">Descrição</div>
        <div class="md:col-span-1 text-right">Status</div>
      </div>

      <!-- Área de conteúdo scrollável -->
      <div class="flex-1 overflow-hidden p-2">
        <div class="h-full overflow-auto">
          <!-- Loading -->
          <div v-if="loading" class="flex justify-center items-center py-12 bg-card">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>

          <!-- Mensagem de Erro -->
          <div v-else-if="error" class="bg-destructive/10 border-b border-destructive/30 text-destructive px-4 py-3">
            <p>{{ error }}</p>
          </div>

          <!-- Cards de Agendamentos (layout horizontal como tabela) -->
          <div v-else-if="agendamentos.length > 0" class="space-y-4">
            <CardAgendamento
              v-for="agendamento in agendamentos"
              :key="agendamento.id"
              :agendamento="agendamento"
            />
          </div>
          <div v-else-if="!loading" class="text-center py-8 text-muted-foreground bg-card">
            <p>Nenhum agendamento encontrado</p>
            <p class="text-sm mt-2">Total de agendamentos carregados: {{ agendamentos.length }}</p>
          </div>

          <!-- Mensagem quando não há agendamentos -->
          <div v-else class="bg-card p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 class="mt-4 text-lg font-medium text-foreground">Nenhum agendamento encontrado</h3>
            <p class="mt-1 text-muted-foreground">Nenhum agendamento disponível</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAgendamento } from '../../../../composables/core/useAgendamento';
import type { ViewAgendamento } from '../../../../../shared/types/database';
import { useProfissionais } from '../../../../composables/core/useProfissionais';
import CardAgendamento from './CardAgendamento.vue';

const { fetchRelatorioAgendamentos } = useAgendamento();
const { fetchProfissionais, profissionais } = useProfissionais();

// Estados
const agendamentos = ref<ViewAgendamento[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

// Função para buscar agendamentos
const buscarAgendamentos = async () => {
  loading.value = true;
  error.value = null;

  try {
    console.log('Buscando todos os agendamentos sem filtros');
    
    const ags = await fetchRelatorioAgendamentos();
    
    console.log('Dados recebidos:', ags);
    agendamentos.value = ags;
    
    console.log('Número de agendamentos:', ags.length);
  } catch (err: any) {
    console.error('Erro ao buscar agendamentos:', err);
    error.value = err.message || 'Erro ao buscar agendamentos';
  } finally {
    loading.value = false;
  }
};

// Carregar dados quando o componente for montado
onMounted(async () => {
  try {
    // Buscar agendamentos iniciais
    await buscarAgendamentos();
  } catch (err: any) {
    console.error('Erro ao carregar dados iniciais:', err);
    error.value = err.message || 'Erro ao carregar dados iniciais';
  }
});
</script>

<style scoped>
.lista-agendamentos {
  @apply w-full h-full;
}
</style>