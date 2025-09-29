<template>
  <Dropdown :use-portal="true" width="md">
    <template #trigger>
      <div
        class="relative w-full h-10 border border-border rounded-md flex items-center px-3 cursor-pointer bg-popover text-popover-foreground"
        :style="
          modelValue ? { backgroundColor: modelValue, color: textColor } : {}
        "
      >
        <div
          v-if="modelValue"
          class="w-6 h-6 rounded-full border border-border mr-2"
          :style="{ backgroundColor: modelValue }"
        ></div>
        <div
          v-else
          class="w-6 h-6 rounded-full border-2 border-dashed border-border mr-2 bg-muted"
        ></div>
        <span>{{
          modelValue
            ? `Cor Selecionada: ${getColorName(modelValue)}`
            : "Escolha uma cor"
        }}</span>
        <button
          v-if="modelValue"
          type="button"
          class="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-red-600 transition-colors z-10 shadow-sm border border-gray-200"
          @click.stop="
            modelValue = '';
            customColor = '';
          "
        >
          <XMarkIcon class="w-3 h-3" />
        </button>
      </div>
    </template>
    <template #content="{ close }">
      <div class="p-2">
        <div class="grid grid-cols-7 gap-2">
          <button
            v-for="color in colors"
            :key="color"
            type="button"
            class="w-10 h-10 rounded-full border-2 border-transparent hover:border-ring focus:outline-none focus:border-ring transition-colors"
            :class="{ 'border-ring': modelValue === color }"
            :style="{ backgroundColor: color }"
            :title="getColorName(color)"
            @click="
              modelValue = color;
              close();
            "
          ></button>
        </div>
      </div>
      <div class="p-2 border-t flex items-center gap-2">
        <span class="text-sm text-muted-foreground"
          >Ou escolha uma cor customizada:</span
        >
        <label class="relative">
          <input
            type="color"
            :value="customColor || '#ffffff'"
            @input="(e) => (customColor = (e.target as HTMLInputElement).value)"
            @change="
              () => {
                modelValue = customColor || '';
                close();
              }
            "
            class="absolute inset-0 w-10 h-10 cursor-pointer opacity-0 pointer-events-auto"
            style="clip-path: circle(45% at 20% 50%)"
          />
          <div
            class="relative w-10 h-10 rounded-full border-2 border-transparent hover:border-ring focus:outline-none focus:border-ring transition-colors cursor-pointer"
            :class="{ 'border-ring': modelValue === customColor }"
            :style="{ backgroundColor: customColor || '#FEE2E2' }"
          >
            <button
              v-if="customColor"
              type="button"
              class="absolute right-0 top-0 w-5 h-5 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-red-600 transition-colors z-50 shadow-lg border border-white"
              style="transform: translate(30%, -30%)"
              @click.stop="
                customColor = '';
                modelValue = '';
                close();
              "
            >
              <XMarkIcon class="w-3 h-3" />
            </button>
          </div>
        </label>
      </div>
    </template>
  </Dropdown>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import Dropdown from "./Dropdown.vue";

const colorNames = {
  "#EF4444": "Vermelho",
  "#3B82F6": "Azul",
  "#10B981": "Verde",
  "#F59E0B": "Amarelo",
  "#EC4899": "Rosa",
  "#8B5CF6": "Roxo",
  "#93C5FD": "Azul Claro",
  "#A7F3D0": "Verde Claro",
  "#FDE68A": "Amarelo Claro",
  "#FCA5A5": "Rosa Claro",
  "#D1D5DB": "Cinza Claro",
  "#F97316": "Laranja",
  "#000000": "Preto",
  "#FFFFFF": "Branco",
};

const getColorName = (color: string) =>
  colorNames[color as keyof typeof colorNames] || "Personalizada";

const getLuminance = (hex: string): number => {
  if (!hex || hex === "") return 1;
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const textColor = computed(() => {
  if (!modelValue.value) return "";
  const lum = getLuminance(modelValue.value);
  return lum > 0.5 ? "#000000" : "#FFFFFF";
});

const customColor = ref("");

const modelValue = defineModel<string>({ default: "" });

const colors = ref([
  "#EF4444", // Vermelho
  "#3B82F6", // Azul
  "#10B981", // Verde
  "#F59E0B", // Amarelo
  "#EC4899", // Rosa
  "#8B5CF6", // Roxo
  "#93C5FD", // Azul claro
  "#A7F3D0", // Verde claro
  "#FDE68A", // Amarelo claro
  "#FCA5A5", // Rosa claro
  "#D1D5DB", // Cinza claro
  "#F97316", // Laranja
  "#000000", // Preto
  "#FFFFFF", // Branco
]);
</script>
