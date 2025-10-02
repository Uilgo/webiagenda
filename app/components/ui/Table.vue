<template>
  <div
    class="overflow-x-auto rounded-lg border border-border shadow-sm p-4 overflow-hidden"
  >
    <table class="min-w-full divide-y divide-border">
      <thead class="bg-muted">
        <tr>
          <th
            v-for="header in headers"
            :key="header"
            class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody class="bg-card divide-y divide-border">
        <tr v-for="(row, index) in rows" :key="index" class="hover:bg-accent">
          <td
            v-for="(cell, cellIndex) in row"
            :key="cellIndex"
            class="px-6 py-4 whitespace-nowrap text-sm text-foreground"
          >
            {{ cell }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  headers: string[];
  rows: any[][];
}>();
</script>
