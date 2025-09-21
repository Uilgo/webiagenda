import type { Config } from "tailwindcss"

export default {
  darkMode: "class",
  content: [
    "./app/**/*.{vue,js,ts}",
    "./components/**/*.{vue,js,ts}",
    "./composables/**/*.{js,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      // Cores do Design System
      colors: {
        // Cores primárias (azul moderno)
        primary: {
          50: "hsl(var(--color-primary-50))",
          100: "hsl(var(--color-primary-100))",
          200: "hsl(var(--color-primary-200))",
          300: "hsl(var(--color-primary-300))",
          400: "hsl(var(--color-primary-400))",
          500: "hsl(var(--color-primary-500))",
          600: "hsl(var(--color-primary-600))",
          700: "hsl(var(--color-primary-700))",
          800: "hsl(var(--color-primary-800))",
          900: "hsl(var(--color-primary-900))",
          950: "hsl(var(--color-primary-950))",
          DEFAULT: "hsl(var(--color-primary-500))",
        },
        
        // Cores secundárias (verde para sucesso/confirmação)
        secondary: {
          50: "hsl(var(--color-secondary-50))",
          100: "hsl(var(--color-secondary-100))",
          200: "hsl(var(--color-secondary-200))",
          300: "hsl(var(--color-secondary-300))",
          400: "hsl(var(--color-secondary-400))",
          500: "hsl(var(--color-secondary-500))",
          600: "hsl(var(--color-secondary-600))",
          700: "hsl(var(--color-secondary-700))",
          800: "hsl(var(--color-secondary-800))",
          900: "hsl(var(--color-secondary-900))",
          950: "hsl(var(--color-secondary-950))",
          DEFAULT: "hsl(var(--color-secondary-500))",
        },

        // Cores neutras (cinzas para textos, bordas, fundos)
        neutral: {
          50: "hsl(var(--color-neutral-50))",
          100: "hsl(var(--color-neutral-100))",
          200: "hsl(var(--color-neutral-200))",
          300: "hsl(var(--color-neutral-300))",
          400: "hsl(var(--color-neutral-400))",
          500: "hsl(var(--color-neutral-500))",
          600: "hsl(var(--color-neutral-600))",
          700: "hsl(var(--color-neutral-700))",
          800: "hsl(var(--color-neutral-800))",
          900: "hsl(var(--color-neutral-900))",
          950: "hsl(var(--color-neutral-950))",
          DEFAULT: "hsl(var(--color-neutral-500))",
        },

        // Alias para gray (compatibilidade com Tailwind padrão)
        gray: {
          50: "hsl(var(--color-neutral-50))",
          100: "hsl(var(--color-neutral-100))",
          200: "hsl(var(--color-neutral-200))",
          300: "hsl(var(--color-neutral-300))",
          400: "hsl(var(--color-neutral-400))",
          500: "hsl(var(--color-neutral-500))",
          600: "hsl(var(--color-neutral-600))",
          700: "hsl(var(--color-neutral-700))",
          800: "hsl(var(--color-neutral-800))",
          900: "hsl(var(--color-neutral-900))",
          950: "hsl(var(--color-neutral-950))",
          DEFAULT: "hsl(var(--color-neutral-500))",
        },

        // Cores de fundo e superfície
        background: "hsl(var(--color-background))",
        foreground: "hsl(var(--color-foreground))",
        
        // Cores de card/superfície
        card: {
          DEFAULT: "hsl(var(--color-card))",
          foreground: "hsl(var(--color-card-foreground))",
        },
        
        // Cores de pop-over/modal
        popover: {
          DEFAULT: "hsl(var(--color-popover))",
          foreground: "hsl(var(--color-popover-foreground))",
        },
        
        // Cores de texto muted
        muted: {
          DEFAULT: "hsl(var(--color-muted))",
          foreground: "hsl(var(--color-muted-foreground))",
        },
        
        // Cores de acento
        accent: {
          DEFAULT: "hsl(var(--color-accent))",
          foreground: "hsl(var(--color-accent-foreground))",
        },
        
        // Cores de borda
        border: "hsl(var(--color-border))",
        input: "hsl(var(--color-input))",
        ring: "hsl(var(--color-ring))",
        
        // Estados
        destructive: {
          DEFAULT: "hsl(var(--color-destructive))",
          foreground: "hsl(var(--color-destructive-foreground))",
        },
        
        warning: {
          DEFAULT: "hsl(var(--color-warning))",
          foreground: "hsl(var(--color-warning-foreground))",
        },
        
        success: {
          DEFAULT: "hsl(var(--color-success))",
          foreground: "hsl(var(--color-success-foreground))",
        },
        
        info: {
          DEFAULT: "hsl(var(--color-info))",
          foreground: "hsl(var(--color-info-foreground))",
        },
      },

      // Tipografia
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"],
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      
      fontSize: {
        // Tamanhos base
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        
        // Títulos
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
        
        // Tamanhos específicos para agendamento
        "schedule-time": ["0.875rem", { lineHeight: "1.25rem", fontWeight: "500" }],
        "schedule-date": ["1rem", { lineHeight: "1.5rem", fontWeight: "600" }],
        "schedule-title": ["1.125rem", { lineHeight: "1.75rem", fontWeight: "600" }],
      },

      // Espaçamentos
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
        144: "36rem",
      },

      // Border radius
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      // Box shadow
      boxShadow: {
        sm: "var(--shadow-sm)",
        DEFAULT: "var(--shadow)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        "2xl": "var(--shadow-2xl)",
        inner: "var(--shadow-inner)",
      },

      // Animation
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "pulse-soft": "pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },

      // Grid
      gridTemplateColumns: {
        sidebar: "240px 1fr",
        "sidebar-collapsed": "60px 1fr",
        "schedule-week": "repeat(7, 1fr)",
        "schedule-time": "80px 1fr",
      },

      // Z-index
      zIndex: {
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
        modal: "1000",
        dropdown: "1010",
        tooltip: "1020",
        toast: "1030",
      },
    },
  },
  plugins: [],
} satisfies Config