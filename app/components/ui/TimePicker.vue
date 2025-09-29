<template>
  <div class="relative w-full">
    <Dropdown :use-portal="true" width="md">
      <template #trigger>
        <div
          class="relative flex items-center w-full border border-border rounded-md bg-popover focus-within:ring-2 focus-within:ring-ring px-3 py-3"
        >
          <ClockIcon class="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
          <span class="text-sm text-popover-foreground truncate flex-1">
            {{ selectedLabel || props.placeholder || "Selecione o horário" }}
          </span>
          <svg
            class="w-4 h-4 text-muted-foreground ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </template>
      <template #content="{ close }">
        <div
          class="bg-background border border-border rounded-md shadow-lg p-1 max-h-60 overflow-y-auto min-w-[200px]"
        >
          <div
            v-for="time in formattedAvailableTimes"
            :key="time.value"
            @click="selectTime(time.value, close)"
            class="text-foreground hover:bg-muted cursor-pointer rounded-md px-3 py-2 text-sm flex items-center"
          >
            {{ time.label }}
          </div>
          <div
            v-if="formattedAvailableTimes.length === 0"
            class="text-muted-foreground px-3 py-2 text-sm"
          >
            {{ props.emptyMessage || 'Nenhum horário disponível' }}
          </div>
        </div>
      </template>
    </Dropdown>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { ClockIcon } from "@heroicons/vue/24/outline";
import Dropdown from "./Dropdown.vue";

const props = defineProps<{
  modelValue?: string | null;
  availableTimes?: string[];
  placeholder?: string;
  emptyMessage?: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string | null];
}>();

const selectedTime = ref<string | null>(null);

const selectedLabel = computed(() => {
  if (!selectedTime.value) return null;
  const timeObj = formattedAvailableTimes.value.find(
    (t) => t.value === selectedTime.value
  );
  return timeObj ? timeObj.label : selectedTime.value;
});

const formattedAvailableTimes = computed(() => {
  if (!props.availableTimes) return [];
  return props.availableTimes.map((time) => {
    const parts = time.split(":");
    const hour = (parts[0] || "00").padStart(2, "0");
    const minute = (parts[1] || "00").padStart(2, "0");
    return {
      value: time,
      label: `${hour}:${minute}`,
    };
  });
});

const selectTime = (time: string, close: () => void) => {
  selectedTime.value = time;
  close();
};

watch(
  () => props.modelValue,
  (newVal) => {
    selectedTime.value = newVal || null;
  },
  { immediate: true }
);

watch(selectedTime, (newVal) => {
  emit("update:modelValue", newVal);
});
</script>
