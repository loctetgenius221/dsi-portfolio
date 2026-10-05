<script setup lang="ts">
import type { Person } from '@/data/dsi'

// Sans photo : silhouette illustrée aux couleurs de l'unité (jamais de faux visage).
withDefaults(defineProps<{ person: Person; size?: number; color?: string; dark?: boolean }>(), { size: 40, color: '#009454', dark: false })
</script>

<template>
  <img v-if="person.photo" :src="person.photo" :alt="`Portrait de ${person.name}`" :width="size" :height="size" class="shrink-0 rounded-full object-cover" :style="{ width: `${size}px`, height: `${size}px` }" />
  <svg v-else :width="size" :height="size" viewBox="0 0 48 48" class="shrink-0 rounded-full" role="img" :aria-label="`Avatar de ${person.name}`">
    <rect width="48" height="48" :fill="color" />
    <circle cx="24" cy="19" r="8" :fill="dark ? '#0a0a0a' : '#ffffff'" fill-opacity="0.92" />
    <path d="M7 48c1-11 8-16 17-16s16 5 17 16z" :fill="dark ? '#0a0a0a' : '#ffffff'" fill-opacity="0.92" />
  </svg>
</template>
