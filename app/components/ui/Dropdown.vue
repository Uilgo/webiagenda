<template>
  <div class="relative block w-full text-left" ref="dropdownRef">
    <!-- Trigger do dropdown -->
    <div>
      <button
        type="button"
        class="inline-flex w-full justify-center items-center"
        :class="triggerClass"
        @click="toggleDropdown"
        :aria-expanded="isOpen"
        aria-haspopup="true"
      >
        <slot name="trigger" :isOpen="isOpen" :toggle="toggleDropdown">
          <!-- Conteúdo padrão do trigger se não fornecido -->
          <span>Menu</span>
          <ChevronDownIcon
            class="ml-2 h-4 w-4 transition-transform duration-200"
            :class="{ 'rotate-180': isOpen }"
          />
        </slot>
      </button>
    </div>

    <!-- Menu dropdown -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute z-dropdown rounded-md bg-muted shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        :class="[
          positionClasses,
          widthClass,
          props.position === 'right' ? '' : 'mt-2',
        ]"
        role="menu"
        aria-orientation="vertical"
      >
        <div class="p-2" role="none">
          <slot name="content" :close="closeDropdown">
            <!-- Conteúdo padrão se não fornecido -->
            <div class="px-4 py-2 text-sm text-popover-foreground">
              Nenhum conteúdo fornecido
            </div>
          </slot>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { ChevronDownIcon } from "@heroicons/vue/24/outline";

// Props do componente
interface DropdownProps {
  /** Posição do dropdown em relação ao trigger */
  position?:
    | "bottom-left"
    | "bottom-right"
    | "top-left"
    | "top-right"
    | "right";
  /** Largura do dropdown */
  width?: "auto" | "trigger" | "sm" | "md" | "lg" | "xl";
  /** Classes adicionais para o trigger */
  triggerClass?: string;
  /** Se o dropdown deve fechar ao clicar fora */
  closeOnClickOutside?: boolean;
}

const props = withDefaults(defineProps<DropdownProps>(), {
  position: "bottom-left",
  width: "auto",
  triggerClass: "",
  closeOnClickOutside: true,
});

// Emits
const emit = defineEmits<{
  open: [];
  close: [];
  toggle: [isOpen: boolean];
}>();

// Estado reativo
const isOpen = ref(false);
const dropdownRef = ref<HTMLElement>();

// Classes computadas para posicionamento
const positionClasses = computed(() => {
  const positions: Record<NonNullable<DropdownProps["position"]>, string> = {
    "bottom-left": "left-0 origin-top-left",
    "bottom-right": "right-0 origin-top-right",
    "top-left": "left-0 bottom-full mb-2 origin-bottom-left",
    "top-right": "right-0 bottom-full mb-2 origin-bottom-right",
    right: "left-full ml-1 bottom-0 origin-bottom-left",
  };
  return positions[props.position];
});

// Classes computadas para largura
const widthClass = computed(() => {
  const widths = {
    auto: "w-auto min-w-[8rem]",
    trigger: "w-full",
    sm: "w-48",
    md: "w-56",
    lg: "w-64",
    xl: "w-72",
  };
  return widths[props.width];
});

// Funções para controlar o dropdown
const openDropdown = () => {
  isOpen.value = true;
  emit("open");
  emit("toggle", true);
};

const closeDropdown = () => {
  isOpen.value = false;
  emit("close");
  emit("toggle", false);
};

const toggleDropdown = () => {
  if (isOpen.value) {
    closeDropdown();
  } else {
    openDropdown();
  }
};

// Handler para clique fora do dropdown
const handleClickOutside = (event: Event) => {
  if (!props.closeOnClickOutside) return;

  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown();
  }
};

// Handler para tecla Escape
const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === "Escape" && isOpen.value) {
    closeDropdown();
  }
};

// Lifecycle hooks
onMounted(() => {
  if (props.closeOnClickOutside) {
    document.addEventListener("click", handleClickOutside);
  }
  document.addEventListener("keydown", handleEscapeKey);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  document.removeEventListener("keydown", handleEscapeKey);
});

// Expor funções para uso externo
defineExpose({
  isOpen,
  open: openDropdown,
  close: closeDropdown,
  toggle: toggleDropdown,
});
</script>

<style scoped>
/* Garantir que o dropdown apareça acima de outros elementos */
.z-dropdown {
  z-index: 1010;
}
</style>
