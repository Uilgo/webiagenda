<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-[999] overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
      >
        <!-- Background overlay -->
        <div
          class="fixed inset-0 bg-black/50 transition-opacity"
          aria-hidden="true"
          @click="handleOverlayClick"
        ></div>

        <!-- Modal panel -->
        <div
          class="relative transform overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-lg transition-all sm:my-8 sm:w-full sm:max-w-lg"
        >
          <!-- Header -->
          <div
            class="flex justify-between items-center bg-popover px-4 py-4 border-border"
          >
            <h3 class="text-lg font-semibold text-popover-foreground" id="modal-title">
              {{ title }}
            </h3>
            <button
              v-if="showClose"
              type="button"
              class="text-muted-foreground hover:text-foreground rounded-md p-2 hover:bg-accent"
              @click="close"
            >
              <svg
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="bg-popover px-4 py-5 sm:p-6">
            <div class="min-h-[100px] overflow-y-auto">
              <div>
                <slot></slot>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-background px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed } from "vue";
// import { defineProps, defineEmits } from "vue";

const props = defineProps<{
  modelValue: boolean;
  title: string;
  showClose?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const showClose = computed(() => props.showClose ?? true);

const close = () => {
  emit("update:modelValue", false);
};

const handleOverlayClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    close();
  }
};

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    close();
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleEscape);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleEscape);
});

// Para fechar o modal a partir do componente pai, você deve emitir o evento 'update:modelValue' com o valor 'false'.
// Exemplo: <Modal :modelValue="isModalOpen" @update:modelValue="isModalOpen = $event">
</script>
