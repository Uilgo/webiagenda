<template>
  <div class="w-full">
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-foreground mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-destructive ml-1">*</span>
    </label>

    <!-- Container do input -->
    <div class="relative">
      <!-- Ícone à esquerda -->
      <div
        v-if="iconLeft"
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <component :is="iconLeft" class="h-4 w-4 text-muted-foreground" />
      </div>

      <!-- Input -->
      <input
        :id="inputId"
        ref="inputRef"
        :type="dynamicInputType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :autocomplete="autocomplete"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        @keydown="handleKeydown"
      />

      <!-- Ícone à direita -->
      <div
        v-if="iconRight || hasError || loading || shouldShowPasswordToggle"
        class="absolute inset-y-0 right-0 pr-3 flex items-center"
      >
        <!-- Loading spinner -->
        <ArrowPathIcon
          v-if="loading"
          class="animate-spin h-4 w-4 text-muted-foreground"
        />

        <!-- Ícone de erro -->
        <ExclamationCircleIcon
          v-else-if="hasError"
          class="h-4 w-4 text-destructive"
        />

        <!-- Toggle de visibilidade da senha -->
        <button
          v-else-if="shouldShowPasswordToggle"
          type="button"
          class="h-4 w-4 text-muted-foreground hover:text-foreground focus:outline-none focus:text-foreground transition-colors duration-200"
          @click="togglePasswordVisibility"
          :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
        >
          <EyeSlashIcon v-if="showPassword" class="h-4 w-4" />
          <EyeIcon v-else class="h-4 w-4" />
        </button>

        <!-- Ícone personalizado à direita -->
        <component
          v-else-if="iconRight"
          :is="iconRight"
          class="h-4 w-4 text-muted-foreground"
        />
      </div>
    </div>

    <!-- Mensagem de ajuda ou erro -->
    <div v-if="helpText || errorMessage" class="mt-1">
      <p v-if="errorMessage" class="text-sm text-destructive">
        {{ errorMessage }}
      </p>
      <p v-else-if="helpText" class="text-sm text-muted-foreground">
        {{ helpText }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, type Component } from "vue";
import {
  ArrowPathIcon,
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/vue/24/outline";

// Definição dos tipos
type InputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "url"
  | "search"
  | "date"
  | "time"
  | "datetime-local";
type InputSize = "sm" | "md" | "lg";

// Props do componente
interface InputProps {
  modelValue?: string | number;
  type?: InputType;
  size?: InputSize;
  label?: string;
  placeholder?: string;
  helpText?: string;
  errorMessage?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  loading?: boolean;
  autocomplete?: string;
  iconLeft?: Component;
  iconRight?: Component;
  showPasswordToggle?: boolean; // Nova prop para controlar exibição do toggle
}

const props = withDefaults(defineProps<InputProps>(), {
  type: "text",
  size: "md",
  disabled: false,
  readonly: false,
  required: false,
  loading: false,
  showPasswordToggle: true, // Por padrão, mostra o toggle para inputs de senha
});

// Emits
const emit = defineEmits<{
  "update:modelValue": [value: string | number];
  blur: [event: FocusEvent];
  focus: [event: FocusEvent];
  keydown: [event: KeyboardEvent];
}>();

// Refs
const inputRef = ref<HTMLInputElement>();

// Estado para controlar visibilidade da senha
const showPassword = ref(false);

// ID único para o input (consistente entre SSR e cliente)
const inputId = useId();

// Verifica se há erro
const hasError = computed(() => !!props.errorMessage);

// Verifica se é input de senha e deve mostrar toggle
const isPasswordInput = computed(() => props.type === "password");
const shouldShowPasswordToggle = computed(
  () =>
    isPasswordInput.value &&
    props.showPasswordToggle &&
    !props.disabled &&
    !props.readonly
);

// Tipo dinâmico do input (muda entre password e text)
const dynamicInputType = computed(() => {
  if (isPasswordInput.value && showPassword.value) {
    return "text";
  }
  return props.type;
});

// Função para alternar visibilidade da senha
const togglePasswordVisibility = (): void => {
  showPassword.value = !showPassword.value;
};

// Classes base do input
const baseClasses = [
  "block w-full border rounded-md shadow-sm",
  "bg-background text-foreground",
  "placeholder-muted-foreground",
  "focus:outline-none focus:ring-2 focus:ring-offset-0",
  "transition-all duration-200",
  "disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed",
  "readonly:bg-muted readonly:cursor-default",
];

// Classes de tamanhos
const sizeClasses = {
  sm: ["px-3 py-1.5 text-sm", "h-8"],
  md: ["px-3 py-2 text-sm", "h-10"],
  lg: ["px-4 py-2.5 text-base", "h-12"],
};

// Classes de estado
const stateClasses = computed(() => {
  if (hasError.value) {
    return [
      "border-destructive text-destructive",
      "focus:border-destructive focus:ring-destructive",
    ];
  }

  return [
    "border-input",
    "hover:border-border",
    "focus:border-ring focus:ring-ring",
  ];
});

// Classes de padding com ícones
const paddingClasses = computed(() => {
  const hasLeftIcon = !!props.iconLeft;
  const hasRightIcon =
    !!props.iconRight ||
    hasError.value ||
    props.loading ||
    shouldShowPasswordToggle.value;

  if (hasLeftIcon && hasRightIcon) {
    return ["pl-10 pr-10"];
  } else if (hasLeftIcon) {
    return ["pl-10"];
  } else if (hasRightIcon) {
    return ["pr-10"];
  }

  return [];
});

// Classes computadas do input
const inputClasses = computed(() => [
  ...baseClasses,
  ...sizeClasses[props.size],
  ...stateClasses.value,
  ...paddingClasses.value,
]);

// Handlers
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  let value: string | number = target.value;

  // Converter para número se o tipo for number
  if (props.type === "number" && value !== "") {
    value = Number(value);
  }

  emit("update:modelValue", value);
};

const handleBlur = (event: FocusEvent) => {
  emit("blur", event);
};

const handleFocus = (event: FocusEvent) => {
  emit("focus", event);
};

const handleKeydown = (event: KeyboardEvent) => {
  emit("keydown", event);
};

// Método para focar no input (exposto para uso externo)
const focus = () => {
  inputRef.value?.focus();
};

// Método para selecionar todo o texto
const select = () => {
  inputRef.value?.select();
};

// Expor métodos para uso externo
defineExpose({
  focus,
  select,
  inputRef,
});
</script>
