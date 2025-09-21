<template>
  <!-- Botão de toggle direto -->
  <button
    type="button"
    :class="buttonClasses"
    @click="toggleTheme"
    :aria-label="theme === 'light' ? 'Mudar para tema escuro' : 'Mudar para tema claro'"
    :title="theme === 'light' ? 'Mudar para tema escuro' : 'Mudar para tema claro'"
  >
    <!-- Ícone do tema atual com transição suave -->
    <Transition
      name="theme-icon"
      mode="out-in"
    >
      <SunIcon 
        v-if="theme === 'light'"
        key="sun"
        class="theme-toggle-icon h-4 w-4"
      />
      <MoonIcon 
        v-else
        key="moon"
        class="theme-toggle-icon h-4 w-4"
      />
    </Transition>
  </button>
</template>

<script setup lang="ts">
import { 
  SunIcon, 
  MoonIcon
} from '@heroicons/vue/24/outline'
import { useTheme } from '~/composables/ui/useTheme'

// Props do componente
interface ThemeToggleProps {
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<ThemeToggleProps>(), {
  variant: 'ghost',
  size: 'md'
})

// Composable do tema - usando apenas toggleTheme e theme
const { 
  theme, 
  toggleTheme
} = useTheme()

// Classes computadas para o botão
const buttonClasses = computed(() => {
  const baseClasses = [
    'inline-flex items-center justify-center rounded-md font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50'
  ]

  // Variantes
  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
  }

  // Tamanhos
  const sizeClasses = {
    sm: 'h-8 px-2 text-xs',
    md: 'h-9 px-3 text-sm',
    lg: 'h-10 px-4 text-base'
  }

  return [
    ...baseClasses,
    variantClasses[props.variant],
    sizeClasses[props.size]
  ]
})
</script>

<style scoped>
.theme-toggle-icon {
  opacity: 1;
  transition: opacity 0.2s ease-in-out;
}

/* Transições suaves para troca de ícones */
.theme-icon-enter-active,
.theme-icon-leave-active {
  transition: all 0.2s ease-in-out;
}

.theme-icon-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.8);
}

.theme-icon-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.8);
}

/* Evita FOUC durante hidratação */
@media (prefers-reduced-motion: no-preference) {
  .theme-toggle-icon {
    transition: opacity 0.2s ease-in-out;
  }
}

/* Melhora a estabilidade visual */
.theme-toggle-icon {
  will-change: opacity, transform;
  backface-visibility: hidden;
  transform: translateZ(0);
}
</style>