<template>
  <div
    class="absolute p-2 justify-center rounded shadow-lg z-10 flex flex-col cursor-pointer"
    :style="{
      left: `${leftPercentage}%`,
      top: `${topPercentage}%`,
      width: `${widthPercentage}%`,
      height: `${heightPercentage}%`,
      backgroundColor: props.color,
      color: textColor,
    }"
    @click="$emit('edit', props.agendamento)"
    role="button"
    tabindex="0"
  >
    <p class="text-xs font-medium mb-0.5">
      {{
        startDate.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      }}
      as
      {{
        endDate.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      }}
    </p>
    <h4 class="font-bold text-base text-left mb-0.5 truncate">{{ title }}</h4>
    <p class="text-xs text-left truncate leading-tight">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import { computed } from "vue";

const props = defineProps({
  start: {
    type: Number as PropType<number>,
    required: true,
  },
  end: {
    type: Number as PropType<number>,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: "#3b82f6",
  },
  // objeto de agendamento original (passado pelo ItemAgendamento)
  agendamento: {
    type: Object as PropType<any>,
    required: false,
  },
});

const startDate = new Date(props.start);
const endDate = new Date(props.end);

const startHourFraction = startDate.getHours() + startDate.getMinutes() / 60;
const endHourFraction = endDate.getHours() + endDate.getMinutes() / 60;
const durationHours = (props.end - props.start) / (1000 * 60 * 60);

const visibleStartHour = 8;
const visibleTotalHours = 15; // 8h to 23h

const effectiveStart = Math.max(0, startHourFraction - visibleStartHour);
const topPercentage = (effectiveStart / visibleTotalHours) * 100;
const effectiveDuration = Math.min(
  visibleTotalHours - effectiveStart,
  durationHours
);
const heightPercentage = Math.max(
  (effectiveDuration / visibleTotalHours) * 100,
  4
); // Min height 4%

const leftPercentage = 0;
const widthPercentage = 100;

// Usar mesma lógica do ColorPicker: calcular luminância de um hex #RRGGBB
// e escolher preto quando luminância > 0.5, caso contrário branco.
const getLuminance = (hex: string): number => {
  if (!hex || hex === "") return 1;
  // assume #RRGGBB
  try {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const rr = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    const gg = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    const bb = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
    return 0.2126 * rr + 0.7152 * gg + 0.0722 * bb;
  } catch (e) {
    return 1;
  }
};

const textColor = computed(() => {
  const c = props.color || "#3b82f6";
  // se não for no formato #RRGGBB, tenta fallback para branco texto escuro
  if (!/^#([A-Fa-f0-9]{6})$/.test(c)) {
    // tenta converter shorthand #RGB
    if (/^#([A-Fa-f0-9]{3})$/.test(c)) {
      const hex = c.slice(1);
      const expanded = `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
      return getLuminance(expanded) > 0.5 ? "#000000" : "#FFFFFF";
    }
    // fallback conservador
    return "#000000";
  }
  return getLuminance(c) > 0.5 ? "#000000" : "#FFFFFF";
});
</script>

<style scoped>
/* Estilos adicionais se necessário */
</style>
