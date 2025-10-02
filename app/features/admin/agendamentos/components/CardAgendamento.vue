<template>
  <div
    class="bg-card rounded-lg shadow-sm overflow-hidden border border-border hover:shadow-md hover:bg-accent cursor-pointer transition-all duration-300"
  >
    <div class="p-4">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <!-- Título e data/hora -->
        <div class="md:col-span-2">
          <div class="flex items-center">
            <span
              class="inline-block w-3 h-3 rounded-full mr-2"
              :style="{ backgroundColor: agendamento.cor || '#3b82f6' }"
            ></span>
            <h3 class="font-semibold text-foreground truncate">
              {{ agendamento.titulo || "Agendamento sem título" }}
            </h3>
          </div>
          <div class="text-sm text-muted-foreground mt-1 flex items-center">
            <CalendarIcon
              class="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0"
            />
            {{ formatDate(agendamento.data) }} |
            {{ formatTime(agendamento.hora_inicio) }} -
            {{ formatTime(agendamento.hora_fim) }}
          </div>
        </div>

        <!-- Descrição -->
        <div class="md:col-span-2">
          <div
            v-if="agendamento.descricao"
            class="text-sm text-foreground line-clamp-2 truncate"
          >
            {{ agendamento.descricao }}
          </div>
          <div v-else class="text-sm text-muted-foreground italic">
            Sem descrição
          </div>
        </div>

        <!-- Cliente -->
        <div class="md:col-span-2">
          <div class="flex items-center">
            <UserIcon class="h-4 w-4 mr-2 text-muted-foreground" />
            <span class="text-sm text-foreground truncate">{{
              agendamento.cliente || "Cliente não informado"
            }}</span>
          </div>
          <div
            v-if="agendamento.cpf"
            class="text-xs text-muted-foreground mt-1"
          >
            CPF: {{ formatCPF(agendamento.cpf) }}
          </div>
        </div>

        <!-- Profissional -->
        <div class="md:col-span-2">
          <div class="flex items-center">
            <UsersIcon class="h-4 w-4 mr-2 text-muted-foreground" />
            <span class="text-sm text-foreground">{{
              agendamento.profissional || "Profissional não informado"
            }}</span>
          </div>
          <div class="text-xs text-muted-foreground">
            {{ agendamento.especialidade || "Especialidade não informada" }}
          </div>
        </div>

        <!-- Telefone -->
        <div class="md:col-span-2">
          <div class="flex items-center">
            <PhoneIcon class="h-4 w-4 mr-2 text-muted-foreground" />
            <span class="text-sm text-foreground">{{
              formatTelefone(agendamento.telefone || "")
            }}</span>
          </div>
        </div>

        <!-- Criado em -->
        <div class="md:col-span-1 flex items-center justify-end">
          <CalendarIcon
            class="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0"
          />
          <span class="text-sm text-muted-foreground">
            {{ formatDate(agendamento.created_at) }}
          </span>
        </div>

        <!-- Status e informações adicionais -->
        <div class="md:col-span-1 flex flex-col items-end">
          <span
            class="px-2 py-1 text-xs font-semibold rounded-full mb-2"
            :class="
              agendamento.cancelado
                ? 'bg-destructive text-destructive-foreground'
                : 'bg-success text-success-foreground'
            "
          >
            {{ agendamento.cancelado ? "Cancelado" : "Ativo" }}
          </span>

          <div
            v-if="agendamento.cancelado && agendamento.cancelado_as"
            class="text-xs text-destructive text-right"
          >
            {{ formatDate(agendamento.cancelado_as) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ViewAgendamento } from "../../../../../shared/types/database";
import {
  CalendarIcon,
  UserIcon,
  UsersIcon,
  PhoneIcon,
} from "@heroicons/vue/24/outline";

interface Props {
  agendamento: ViewAgendamento;
}

const props = defineProps<Props>();

// Formatar data para exibição
const formatDate = (dateString: string | null) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR");
};

// Formatar hora para exibição mais legível (extrai HH:mm ignorando segundos ou timezone)
const formatTime = (timeString: string | null): string => {
  if (!timeString) return "";
  const match = timeString.match(/^(\d{1,2}):(\d{2})/);
  if (match && match[1] && match[2]) {
    const hours = match[1].padStart(2, "0");
    const minutes = match[2];
    return `${hours}:${minutes}`;
  }
  return timeString;
};

// Formatar CPF para exibição
const formatCPF = (cpf: string | null) => {
  if (!cpf) return "";
  const cleaned = cpf.replace(/\D/g, "");
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

// Formatar telefone para exibição
const formatTelefone = (telefone: string | null) => {
  if (!telefone) return "";
  const cleaned = telefone.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  return telefone;
};
</script>
