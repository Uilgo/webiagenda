<template>
  <div
    class="bg-card rounded-lg shadow-sm overflow-hidden border border-border hover:shadow-md transition-shadow duration-200"
  >
    <div class="p-4">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <!-- Título e data/hora -->
        <div class="md:col-span-3">
          <div class="flex items-center">
            <span
              class="inline-block w-3 h-3 rounded-full mr-2"
              :style="{ backgroundColor: agendamento.cor || '#3b82f6' }"
            ></span>
            <h3 class="font-semibold text-foreground truncate">
              {{ agendamento.titulo || "Agendamento sem título" }}
            </h3>
          </div>
          <div class="text-sm text-muted-foreground mt-1">
            {{ formatDate(agendamento.data) }} | {{ formatTime(agendamento.hora_inicio) }} - {{ formatTime(agendamento.hora_fim) }}
          </div>
        </div>

        <!-- Cliente -->
        <div class="md:col-span-2">
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-2 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-2 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-2 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span class="text-sm text-foreground">{{
              formatTelefone(agendamento.telefone || "")
            }}</span>
          </div>
        </div>

        <!-- Descrição -->
        <div class="md:col-span-2">
          <div
            v-if="agendamento.descricao"
            class="text-sm text-foreground line-clamp-2"
          >
            {{ agendamento.descricao }}
          </div>
          <div v-else class="text-sm text-muted-foreground italic">
            Sem descrição
          </div>
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
  if (!timeString) return '';
  const match = timeString.match(/^(\d{1,2}):(\d{2})/);
  if (match && match[1] && match[2]) {
    const hours = match[1].padStart(2, '0');
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
