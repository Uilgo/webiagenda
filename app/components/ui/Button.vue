<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    :type="type"
    @click="handleClick"
  >
    <!-- Ícone de loading -->
    <ArrowPathIcon
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-4 w-4"
    />

    <!-- Ícone à esquerda -->
    <component
      v-if="iconLeft && !loading"
      :is="iconLeft"
      class="w-4 h-4 mr-2"
    />

    <!-- Conteúdo do botão -->
    <span v-if="$slots.default">
      <slot />
    </span>

    <!-- Ícone à direita -->
    <component
      v-if="iconRight && !loading"
      :is="iconRight"
      class="w-4 h-4 ml-2"
    />
  </button>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'

// Definição dos tipos das props
type ButtonVariant = 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success' | 'warning' | 'info' | 'link'
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type ButtonType = 'button' | 'submit' | 'reset'

// Props do componente
interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  type?: ButtonType
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  iconLeft?: Component
  iconRight?: Component
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'default',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  fullWidth: false
})

// Emits
const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

// Classes base do botão
const baseClasses = [
  'inline-flex items-center justify-center',
  'font-medium transition-all duration-200',
  'focus:outline-none focus:ring-2 focus:ring-offset-2',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  'border border-transparent'
]

// Classes de variantes
const variantClasses = {
  default: [
    'bg-primary text-white',
    'hover:bg-primary-600 active:bg-primary-700',
    'focus:ring-primary-500',
    'shadow-sm hover:shadow-md'
  ],
  primary: [
    'bg-primary text-white',
    'hover:bg-primary-600 active:bg-primary-700',
    'focus:ring-primary-500',
    'shadow-sm hover:shadow-md'
  ],
  secondary: [
    'bg-secondary text-white',
    'hover:bg-secondary-600 active:bg-secondary-700',
    'focus:ring-secondary-500',
    'shadow-sm hover:shadow-md'
  ],
  outline: [
    'bg-transparent text-primary border-primary',
    'hover:bg-primary hover:text-white',
    'focus:ring-primary-500',
    'active:bg-primary-600'
  ],
  ghost: [
    'bg-transparent text-foreground',
    'hover:bg-accent hover:text-accent-foreground',
    'focus:ring-ring',
    'active:bg-accent/80'
  ],
  destructive: [
    'bg-destructive text-destructive-foreground',
    'hover:bg-destructive/90 active:bg-destructive/80',
    'focus:ring-destructive',
    'shadow-sm hover:shadow-md'
  ],
  success: [
    'bg-success text-success-foreground',
    'hover:bg-success/90 active:bg-success/80',
    'focus:ring-success',
    'shadow-sm hover:shadow-md'
  ],
  warning: [
    'bg-warning text-warning-foreground',
    'hover:bg-warning/90 active:bg-warning/80',
    'focus:ring-warning',
    'shadow-sm hover:shadow-md'
  ],
  info: [
    'bg-info text-info-foreground',
    'hover:bg-info/90 active:bg-info/80',
    'focus:ring-info',
    'shadow-sm hover:shadow-md'
  ],
  link: [
    'bg-transparent text-primary border-transparent',
    'hover:text-primary-600 hover:underline',
    'focus:ring-primary-500',
    'active:text-primary-700',
    'shadow-none'
  ]
}

// Classes de tamanhos
const sizeClasses = {
  xs: ['px-2 py-1 text-xs rounded-sm', 'h-6'],
  sm: ['px-3 py-1.5 text-sm rounded-md', 'h-8'],
  md: ['px-4 py-2 text-sm rounded-md', 'h-10'],
  lg: ['px-6 py-2.5 text-base rounded-lg', 'h-12'],
  xl: ['px-8 py-3 text-lg rounded-lg', 'h-14']
}

// Classes computadas do botão
const buttonClasses = computed(() => [
  ...baseClasses,
  ...(variantClasses[props.variant] || []),
  ...(sizeClasses[props.size] || []),
  {
    'w-full': props.fullWidth,
    'cursor-not-allowed': props.disabled || props.loading
  }
])

// Handler do clique
const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>