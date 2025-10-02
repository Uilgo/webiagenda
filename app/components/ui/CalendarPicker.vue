<template>
  <div v-if="!props.hideInput" class="relative">
    <Input
      :modelValue="formattedValue"
      readonly
      placeholder="Selecione uma data"
      class="w-full"
      @click="toggleCalendar"
    />
    <div
      v-if="isOpen"
      class="absolute z-50 mt-1 bg-background dark:bg-background rounded-lg shadow-lg border border-border w-full"
      style="top: 100%; left: 0"
    >
      <!-- Header with navigation -->
      <div class="flex items-center justify-between mb-4 p-4">
        <Button variant="ghost" size="sm" @click="previousMonth" class="p-1">
          <ChevronLeftIcon class="w-5 h-5" />
        </Button>
        <div class="flex items-center space-x-2">
          <span class="text-sm font-medium text-foreground">{{ getMonthName(currentMonth) }}</span>
          <span class="text-sm font-medium text-foreground">{{ currentYear }}</span>
        </div>
        <Button variant="ghost" size="sm" @click="nextMonth" class="p-1">
          <ChevronRightIcon class="w-5 h-5" />
        </Button>
      </div>

      <!-- Week days header -->
      <div
        class="grid grid-cols-7 gap-1 mb-2 px-4 text-xs font-medium text-muted-foreground"
      >
        <div v-for="day in weekDays" :key="day" class="text-center py-1">
          {{ day }}
        </div>
      </div>

      <!-- Days grid -->
      <div class="grid grid-cols-7 gap-1 px-4 pb-4">
        <div
          v-for="day in calendarDays"
          :key="day.date.toISOString()"
          class="relative p-2 text-sm rounded cursor-pointer hover:bg-accent dark:hover:bg-accent transition-colors"
          :class="[
            day.isCurrentMonth ? 'text-foreground' : 'text-muted-foreground',
            day.isToday ? 'bg-primary text-primary-foreground' : '',
            day.isSelected
              ? 'bg-primary text-primary-foreground ring-1 ring-ring'
              : '',
            day.isDisabled
              ? 'text-muted-foreground cursor-not-allowed opacity-50'
              : 'hover:bg-accent dark:hover:bg-accent',
          ]"
          @click="!day.isDisabled ? selectDate(day.date) : null"
        >
          {{ day.date.getDate() }}
        </div>
      </div>
    </div>
  </div>
  <div v-else class="bg-background dark:bg-background rounded-lg shadow-lg border border-border w-full">
    <!-- Header with navigation -->
    <div class="flex items-center justify-between mb-4 p-4">
      <Button variant="ghost" size="sm" @click="previousMonth" class="p-1">
        <ChevronLeftIcon class="w-5 h-5" />
      </Button>
      <div class="flex items-center space-x-2">
        <span class="text-sm font-medium text-foreground">{{ getMonthName(currentMonth) }}</span>
        <span class="text-sm font-medium text-foreground">{{ currentYear }}</span>
      </div>
      <Button variant="ghost" size="sm" @click="nextMonth" class="p-1">
        <ChevronRightIcon class="w-5 h-5" />
      </Button>
    </div>

    <!-- Week days header -->
    <div
      class="grid grid-cols-7 gap-1 mb-2 px-4 text-xs font-medium text-muted-foreground"
    >
      <div v-for="day in weekDays" :key="day" class="text-center py-1">
        {{ day }}
      </div>
    </div>

    <!-- Days grid -->
    <div class="grid grid-cols-7 gap-1 px-4 pb-4">
      <div
        v-for="day in calendarDays"
        :key="day.date.toISOString()"
        class="relative p-2 text-sm rounded cursor-pointer hover:bg-accent dark:hover:bg-accent transition-colors"
        :class="[
          day.isCurrentMonth ? 'text-foreground' : 'text-muted-foreground',
          day.isToday ? 'bg-primary text-primary-foreground' : '',
          day.isSelected
            ? 'bg-primary text-primary-foreground ring-1 ring-ring'
            : '',
          day.isDisabled
            ? 'text-muted-foreground cursor-not-allowed opacity-50'
            : 'hover:bg-accent dark:hover:bg-accent',
        ]"
        @click="!day.isDisabled ? selectDate(day.date) : null"
      >
        {{ day.date.getDate() }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";
import Input from "./Input.vue";
import Button from "./Button.vue";

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}

const props = defineProps<{
  modelValue?: Date | null;
  minDate?: Date;
  disabledDates?: Date[];
  hideInput?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [date: Date | null];
}>();

const isOpen = ref(false);
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());
const selectedDate = ref<Date | null>(props.modelValue || null);

const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const getMonthName = (monthIndex: number) => months[monthIndex];

const formattedValue = computed(() => {
  return selectedDate.value
    ? selectedDate.value.toLocaleDateString("pt-BR")
    : "";
});

const previousMonth = () => {
  currentMonth.value = (currentMonth.value - 1 + 12) % 12;
  if (currentMonth.value === 11) currentYear.value--;
};

const nextMonth = () => {
  currentMonth.value = (currentMonth.value + 1) % 12;
  if (currentMonth.value === 0) currentYear.value++;
};

const selectDate = (date: Date) => {
  selectedDate.value = date;
  emit("update:modelValue", date);
  if (!props.hideInput) {
    isOpen.value = false;
  }
};

const toggleCalendar = () => {
  isOpen.value = !isOpen.value;
};

const calendarDays = computed(() => {
  const days: CalendarDay[] = [];
  const firstDay = new Date(currentYear.value, currentMonth.value, 1);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    const isCurrentMonth = date.getMonth() === currentMonth.value;
    const isToday = date.toDateString() === new Date().toDateString();
    const isSelected = selectedDate.value
      ? date.toDateString() === selectedDate.value.toDateString()
      : false;
    const isDisabled =
      (props.minDate && date < props.minDate) ||
      (props.disabledDates || []).some(
        (d) => d.toDateString() === date.toDateString()
      );

    days.push({
      date,
      isCurrentMonth,
      isToday,
      isSelected,
      isDisabled,
    });
  }

  return days;
});

watch(selectedDate, (newDate) => {
  if (newDate) {
    currentMonth.value = newDate.getMonth();
    currentYear.value = newDate.getFullYear();
  }
});

watch(
  () => props.modelValue,
  (newVal) => {
    selectedDate.value = newVal || null;
  }
);

onMounted(() => {
  selectedDate.value = props.modelValue || null;
});

onUnmounted(() => {
  isOpen.value = false;
});
</script>

<style scoped>
.relative {
  position: relative;
}

.absolute {
  position: absolute;
}
</style>
