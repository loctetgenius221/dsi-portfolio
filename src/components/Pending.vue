<script setup lang="ts">
// Information attendue du client : à remplacer dès réception (voir src/data/dsi.ts).
withDefaults(defineProps<{ label?: string }>(), { label: 'À compléter' })
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 border border-dashed border-ink/50 bg-paper-2 px-2 py-0.5 text-[0.85rem] italic text-ink-soft"
    >{{ label }}</span
  >
</template>
