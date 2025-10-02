<template>
  <component
    :is="tag"
    :href="href"
    :to="to"
    class="group flex items-center w-full px-4 py-2 text-sm transition-colors duration-150"
    :class="[
      itemClasses,
      disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
    ]"
    @click="handleClick"
    role="menuitem"
    :disabled="disabled"
  >
    <!-- Ícone à esquerda -->
    <div v-if="$slots.icon || icon" class="mr-3 flex-shrink-0">
      <slot name="icon">
        <component
          v-if="icon"
          :is="icon"
          class="h-4 w-4"
          :class="iconClasses"
        />
      </slot>
    </div>

    <!-- Conteúdo principal -->
    <div class="flex-1 min-w-0">
      <slot>
        {{ label }}
      </slot>
    </div>

    <!-- Ícone à direita ou indicador -->
    <div v-if="$slots.trailing || showChevron" class="ml-3 flex-shrink-0">
      <slot name="trailing">
        <ChevronRightIcon
          v-if="showChevron"
          class="h-4 w-4 text-muted-foreground"
        />
      </slot>
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ChevronRightIcon } from "@heroicons/vue/24/outline";
import type { Component } from "vue";

// Props do componente
interface DropdownItemProps {
  /** Texto do item */
  label?: string;
  /** Ícone do item */
  icon?: Component;
  /** Se o item está desabilitado */
  disabled?: boolean;
  /** Variante visual do item */
  variant?: "default" | "destructive";
  /** Link externo (href) */
  href?: string;
  /** Link interno (to) para Nuxt */
  to?: string;
  /** Mostrar chevron à direita */
  showChevron?: boolean;
}

const props = withDefaults(defineProps<DropdownItemProps>(), {
  variant: "default",
  disabled: false,
  showChevron: false,
});

// Emits
const emit = defineEmits<{
  click: [event: Event];
}>();

// Tag computada baseada nas props
const tag = computed(() => {
  if (props.href) return "a";
  if (props.to) return "NuxtLink";
  return "button";
});

// Classes do item baseadas na variante
const itemClasses = computed(() => {
  const baseClasses =
    "text-left focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md";

  if (props.disabled) {
    return `${baseClasses} text-muted-foreground`;
  }

  switch (props.variant) {
    case "destructive":
      return `${baseClasses} text-destructive hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-destructive focus:bg-neutral-200 dark:focus:bg-neutral-700 focus:text-destructive`;
    default:
      return `${baseClasses} text-popover-foreground hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-neutral-50 focus:bg-neutral-200 dark:focus:bg-neutral-700 focus:text-neutral-900 dark:focus:text-neutral-50`;
  }
});

// Classes do ícone
const iconClasses = computed(() => {
  if (props.disabled) {
    return "text-muted-foreground";
  }

  switch (props.variant) {
    case "destructive":
      return "text-destructive group-hover:text-destructive";
    default:
      return "text-muted-foreground";
  }
});

// Handler de clique
const handleClick = (event: Event) => {
  if (props.disabled) {
    event.preventDefault();
    return;
  }

  emit("click", event);
};
</script>
