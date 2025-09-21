<template>
  <div class="min-h-screen bg-background p-6">
    <!-- Header do Dashboard -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-foreground">Dashboard Administrativo</h1>
      <p class="text-muted-foreground mt-2">Visão geral das atividades e estatísticas do sistema</p>
    </div>

    <!-- Cards de Estatísticas -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-card rounded-lg shadow-sm p-6 border border-border">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-muted-foreground">Total de Usuários</p>
            <p class="text-3xl font-bold text-card-foreground">{{ stats.totalUsers }}</p>
          </div>
          <div class="p-3 bg-primary/10 rounded-full">
            <UsersIcon class="h-6 w-6 text-primary" />
          </div>
        </div>
        <div class="mt-4">
          <span class="text-sm text-success font-medium">+12% este mês</span>
        </div>
      </div>

      <div class="bg-card rounded-lg shadow-sm p-6 border border-border">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-muted-foreground">Agendamentos</p>
            <p class="text-3xl font-bold text-card-foreground">{{ stats.totalAppointments }}</p>
          </div>
          <div class="p-3 bg-secondary/10 rounded-full">
            <CalendarDaysIcon class="h-6 w-6 text-secondary" />
          </div>
        </div>
        <div class="mt-4">
          <span class="text-sm text-success font-medium">+8% esta semana</span>
        </div>
      </div>

      <div class="bg-card rounded-lg shadow-sm p-6 border border-border">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-muted-foreground">Receita Mensal</p>
            <p class="text-3xl font-bold text-card-foreground">R$ {{ formatCurrency(stats.monthlyRevenue) }}</p>
          </div>
          <div class="p-3 bg-warning/10 rounded-full">
            <CurrencyDollarIcon class="h-6 w-6 text-warning" />
          </div>
        </div>
        <div class="mt-4">
          <span class="text-sm text-success font-medium">+15% este mês</span>
        </div>
      </div>

      <div class="bg-card rounded-lg shadow-sm p-6 border border-border">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-muted-foreground">Taxa de Satisfação</p>
            <p class="text-3xl font-bold text-card-foreground">{{ stats.satisfactionRate }}%</p>
          </div>
          <div class="p-3 bg-accent/10 rounded-full">
            <StarIcon class="h-6 w-6 text-accent" />
          </div>
        </div>
        <div class="mt-4">
          <span class="text-sm text-success font-medium">+2% este mês</span>
        </div>
      </div>
    </div>

    <!-- Gráficos e Tabelas -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Gráfico de Agendamentos -->
      <div class="bg-card rounded-lg shadow-sm p-6 border border-border">
        <h3 class="text-lg font-semibold text-card-foreground mb-4">Agendamentos por Mês</h3>
        <div class="h-64 flex items-center justify-center bg-muted rounded-lg">
          <div class="text-center">
            <ChartBarIcon class="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p class="text-muted-foreground">Gráfico será implementado aqui</p>
          </div>
        </div>
      </div>

      <!-- Atividades Recentes -->
      <div class="bg-card rounded-lg shadow-sm p-6 border border-border">
        <h3 class="text-lg font-semibold text-card-foreground mb-4">Atividades Recentes</h3>
        <div class="space-y-4">
          <div v-for="activity in recentActivities" :key="activity.id" class="flex items-start space-x-3">
            <div class="flex-shrink-0">
              <div class="w-2 h-2 bg-primary rounded-full mt-2"></div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-card-foreground">{{ activity.description }}</p>
              <p class="text-xs text-muted-foreground">{{ formatDate(activity.timestamp) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabela de Agendamentos Recentes -->
    <div class="bg-card rounded-lg shadow-sm border border-border">
      <div class="px-6 py-4 border-b border-border">
        <h3 class="text-lg font-semibold text-card-foreground">Agendamentos Recentes</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-border">
          <thead class="bg-muted">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Cliente</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Serviço</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Data</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Valor</th>
            </tr>
          </thead>
          <tbody class="bg-card divide-y divide-border">
            <tr v-for="appointment in recentAppointments" :key="appointment.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <span class="text-sm font-medium text-muted-foreground">{{ getInitials(appointment.clientName) }}</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-card-foreground">{{ appointment.clientName }}</div>
                    <div class="text-sm text-muted-foreground">{{ appointment.clientEmail }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">{{ appointment.service }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">{{ formatDate(appointment.date) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(appointment.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                  {{ appointment.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">R$ {{ formatCurrency(appointment.value) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  UsersIcon, 
  CalendarDaysIcon, 
  CurrencyDollarIcon, 
  StarIcon, 
  ChartBarIcon 
} from '@heroicons/vue/24/outline'

// Dados de exemplo para o dashboard
const stats = ref({
  totalUsers: 1247,
  totalAppointments: 89,
  monthlyRevenue: 45680,
  satisfactionRate: 94
})

// Atividades recentes de exemplo
const recentActivities = ref([
  {
    id: 1,
    description: 'Novo usuário cadastrado: Maria Silva',
    timestamp: new Date(Date.now() - 1000 * 60 * 15) // 15 minutos atrás
  },
  {
    id: 2,
    description: 'Agendamento confirmado para João Santos',
    timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutos atrás
  },
  {
    id: 3,
    description: 'Pagamento processado: R$ 150,00',
    timestamp: new Date(Date.now() - 1000 * 60 * 45) // 45 minutos atrás
  },
  {
    id: 4,
    description: 'Avaliação recebida: 5 estrelas',
    timestamp: new Date(Date.now() - 1000 * 60 * 60) // 1 hora atrás
  }
])

// Agendamentos recentes de exemplo
const recentAppointments = ref([
  {
    id: 1,
    clientName: 'Ana Costa',
    clientEmail: 'ana.costa@email.com',
    service: 'Consulta Médica',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24), // amanhã
    status: 'Confirmado',
    value: 200
  },
  {
    id: 2,
    clientName: 'Carlos Silva',
    clientEmail: 'carlos.silva@email.com',
    service: 'Exame de Rotina',
    date: new Date(Date.now() + 1000 * 60 * 60 * 48), // depois de amanhã
    status: 'Pendente',
    value: 150
  },
  {
    id: 3,
    clientName: 'Fernanda Lima',
    clientEmail: 'fernanda.lima@email.com',
    service: 'Consulta Especializada',
    date: new Date(Date.now() + 1000 * 60 * 60 * 72), // em 3 dias
    status: 'Confirmado',
    value: 350
  }
])

// Funções utilitárias
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getStatusClass = (status: string): string => {
  const statusClasses = {
    'Confirmado': 'bg-green-100 text-green-800',
    'Pendente': 'bg-yellow-100 text-yellow-800',
    'Cancelado': 'bg-red-100 text-red-800',
    'Concluído': 'bg-blue-100 text-blue-800'
  }
  return statusClasses[status as keyof typeof statusClasses] || 'bg-muted text-muted-foreground'
}
</script>