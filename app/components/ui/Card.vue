<template>
  <div :class="cardClasses">
    <!-- Header do Card -->
    <div
      v-if="$slots.header || title || subtitle"
      :class="headerClasses"
    >
      <slot name="header">
        <div v-if="title || subtitle">
          <h3
            v-if="title"
            class="text-lg font-semibold text-foreground"
          >
            {{ title }}
          </h3>
          <p
            v-if="subtitle"
            class="text-sm text-muted-foreground mt-1"
          >
            {{ subtitle }}
          </p>
        </div>
      </slot>
    </div>

    <!-- Body do Card -->
    <div
      v-if="$slots.default"
      :class="bodyClasses"
    >
      <slot />
    </div>

    <!-- Footer do Card -->
    <div
      v-if="$slots.footer"
      :class="footerClasses"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'

// Definição dos tipos
type CardVariant = 'default' | 'outlined' | 'elevated' | 'ghost'
type CardSize = 'sm' | 'md' | 'lg'

// Props do componente
interface CardProps {
  variant?: CardVariant
  size?: CardSize
  title?: string
  subtitle?: string
  hoverable?: boolean
  clickable?: boolean
  loading?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<CardProps>(), {
  variant: 'default',
  size: 'md',
  hoverable: false,
  clickable: false,
  loading: false,
  disabled: false
})

// Acesso aos slots
const slots = useSlots()

// Emits
const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

// Classes base do card
const baseClasses = [
  'rounded-lg',
  'transition-all duration-200',
  'overflow-hidden'
]

// Classes de variantes
const variantClasses = {
  default: [
    'bg-card text-card-foreground',
    'border border-border'
  ],
  outlined: [
    'bg-transparent',
    'border-2 border-border'
  ],
  elevated: [
    'bg-card text-card-foreground',
    'shadow-lg border border-border'
  ],
  ghost: [
    'bg-transparent',
    'border-0'
  ]
}

// Classes de tamanhos para padding
const sizeClasses = {
  sm: {
    header: 'px-3 py-3',
    body: 'px-3 py-4',
    footer: 'px-3 py-3'
  },
  md: {
    header: 'px-4 py-4',
    body: 'px-4 py-5',
    footer: 'px-4 py-4'
  },
  lg: {
    header: 'px-6 py-5',
    body: 'px-6 py-6',
    footer: 'px-6 py-5'
  }
}

// Classes de interação
const interactionClasses = computed(() => {
  const classes: string[] = []
  
  if (props.hoverable && !props.disabled) {
    classes.push('hover:shadow-md')
  }
  
  if (props.clickable && !props.disabled) {
    classes.push(
      'cursor-pointer',
      'hover:shadow-md',
      'active:scale-[0.98]',
      'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
    )
  }
  
  if (props.disabled) {
    classes.push(
      'opacity-50',
      'cursor-not-allowed',
      'pointer-events-none'
    )
  }
  
  return classes
})

// Classes de loading
const loadingClasses = computed(() => {
  if (props.loading) {
    return ['animate-pulse', 'pointer-events-none']
  }
  return []
})

// Classes computadas do card
const cardClasses = computed(() => [
  ...baseClasses,
  ...variantClasses[props.variant],
  ...interactionClasses.value,
  ...loadingClasses.value
])

// Classes do header
const headerClasses = computed(() => {
  const classes = [sizeClasses[props.size].header]
  
  // Adiciona borda inferior se houver body ou footer
  if (slots.default || slots.footer) {
    classes.push('border-b border-border')
  }
  
  return classes
})

// Classes do body
const bodyClasses = computed(() => {
  const classes = [sizeClasses[props.size].body]
  
  // Ajusta padding top se houver header
  if (slots.header || props.title || props.subtitle) {
    classes.push('pt-2')
  }
  
  // Ajusta padding bottom se houver footer
  if (slots.footer) {
    classes.push('pb-2')
  }
  
  return classes
})

// Classes do footer
const footerClasses = computed(() => {
  const classes = [sizeClasses[props.size].footer]
  
  // Adiciona borda superior
  classes.push('border-t border-border')
  
  return classes
})

// Handler de click
const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>