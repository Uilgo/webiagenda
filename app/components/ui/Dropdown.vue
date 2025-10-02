<template>
  <div class="relative block w-full text-left" ref="dropdownRef">
    <!-- Trigger do dropdown -->
    <div>
      <button
        type="button"
        class="inline-flex w-full justify-center items-center"
        :class="[
          triggerClass,
          props.disabled ? 'opacity-50 cursor-not-allowed' : '',
        ]"
        @click="toggleDropdown"
        ref="triggerRef"
        :aria-expanded="isOpen"
        aria-haspopup="true"
        :aria-disabled="props.disabled"
        :disabled="props.disabled"
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

    <!-- Menu dropdown inline (sem portal) -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen && !props.usePortal"
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

    <!-- Portal: renderiza o menu no body para evitar corte dentro de containers com overflow-hidden -->
    <Teleport to="body" v-if="props.usePortal">
      <Transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div
          v-show="isOpen"
          ref="menuRef"
          class="z-dropdown rounded-md bg-muted shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none absolute"
          :style="portalStyle"
          role="menu"
          aria-orientation="vertical"
        >
          <div class="p-2" role="none">
            <slot name="content" :close="closeDropdown">
              <div class="px-4 py-2 text-sm text-popover-foreground">
                Nenhum conteúdo fornecido
              </div>
            </slot>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
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
  /** Renderizar conteúdo em um Teleport para body (evita corte em modais) */
  usePortal?: boolean;
  /** Desabilita o dropdown (impede abrir e aplica estilo) */
  disabled?: boolean;
}

const props = withDefaults(defineProps<DropdownProps>(), {
  position: "bottom-left",
  width: "auto",
  triggerClass: "",
  closeOnClickOutside: true,
  usePortal: false,
  disabled: false,
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
const triggerRef = ref<HTMLElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);

const portalStyle = ref<Record<string, string>>({});
// Evitar race condition: quando abrimos, o listener global de click não deve fechar imediatamente
let justOpened = false;

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

const portalMinWidths: Record<NonNullable<DropdownProps["width"]>, number> = {
  auto: 128,
  trigger: 0,
  sm: 192,
  md: 224,
  lg: 256,
  xl: 288,
};

// Funções para controlar o dropdown
const openDropdown = () => {
  if (props.disabled) return;
  isOpen.value = true;
  emit("open");
  emit("toggle", true);

  justOpened = true;
  setTimeout(() => (justOpened = false), 0);

  // Se usamos portal, precisamos calcular a posição depois do próximo tick
  if (props.usePortal) {
    nextTick(() => computePortalPosition());
  }
};

const closeDropdown = () => {
  isOpen.value = false;
  emit("close");
  emit("toggle", false);
};

const toggleDropdown = () => {
  if (props.disabled) return;
  if (isOpen.value) {
    closeDropdown();
  } else {
    openDropdown();
  }
};

// Fechar automaticamente quando o dropdown for desabilitado
watch(
  () => props.disabled,
  (val) => {
    if (val && isOpen.value) closeDropdown();
  }
);

// Handler para clique fora do dropdown
const handleClickOutside = (event: Event) => {
  if (!props.closeOnClickOutside) return;

  const target = event.target as Node;
  if (justOpened) return;
  // Se portal, considerar triggerRef e menuRef
  if (props.usePortal) {
    if (
      triggerRef.value &&
      !triggerRef.value.contains(target) &&
      menuRef.value &&
      !menuRef.value.contains(target)
    ) {
      closeDropdown();
    }
  } else {
    if (dropdownRef.value && !dropdownRef.value.contains(target)) {
      closeDropdown();
    }
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
  window.addEventListener("resize", handleWindowChange);
  window.addEventListener("scroll", handleWindowChange, true);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  document.removeEventListener("keydown", handleEscapeKey);
  window.removeEventListener("resize", handleWindowChange);
  window.removeEventListener("scroll", handleWindowChange, true);
});

// Expor funções para uso externo
defineExpose({
  isOpen,
  open: openDropdown,
  close: closeDropdown,
  toggle: toggleDropdown,
});

// Recalcula a posição do menu portal
function computePortalPosition() {
  if (!triggerRef.value || !menuRef.value) return;

  const trig = triggerRef.value.getBoundingClientRect();
  const menu = menuRef.value.getBoundingClientRect();
  const scrollX = window.scrollX || window.pageXOffset;
  const scrollY = window.scrollY || window.pageYOffset;

  let top = 0;
  let left = 0;

  // Garantir largura mínima baseada na prop
  const minW = portalMinWidths[props.width];
  const menuWidth = menu.width || Math.max(minW, trig.width);

  switch (props.position) {
    case "bottom-left":
      top = trig.bottom + scrollY;
      left = trig.left + scrollX;
      break;
    case "bottom-right":
      top = trig.bottom + scrollY;
      left = trig.right + scrollX - menuWidth;
      break;
    case "top-left":
      top = trig.top + scrollY - menu.height;
      left = trig.left + scrollX;
      break;
    case "top-right":
      top = trig.top + scrollY - menu.height;
      left = trig.right + scrollX - menuWidth;
      break;
    case "right":
      top = trig.top + scrollY;
      left = trig.right + scrollX + 8;
      break;
    default:
      top = trig.bottom + scrollY;
      left = trig.left + scrollX;
  }

  // Ajuste para não sair da viewport
  const viewportW = document.documentElement.clientWidth + scrollX;
  const viewportH = document.documentElement.clientHeight + scrollY;

  if (left + menuWidth > viewportW) {
    left = Math.max(scrollX + 8, viewportW - menuWidth - 8);
  }
  if (top + menu.height > viewportH) {
    top = Math.max(scrollY + 8, trig.top + scrollY - menu.height - 8);
  }

  portalStyle.value = {
    top: `${Math.round(top)}px`,
    left: `${Math.round(left)}px`,
    minWidth: `${Math.round(Math.max(minW, trig.width))}px`,
  };
}

function handleWindowChange() {
  if (props.usePortal && isOpen.value) {
    computePortalPosition();
  }
}
</script>

<style scoped>
/* Garantir que o dropdown apareça acima de outros elementos */
.z-dropdown {
  z-index: 1010;
}
</style>
