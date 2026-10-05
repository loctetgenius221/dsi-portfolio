<script setup lang="ts">
withDefaults(
  defineProps<{ src: string; alt: string; position?: string; shadow?: string; ratio?: string }>(),
  { position: '50% 50%', shadow: 'var(--color-yellow)', ratio: '4 / 3' },
)
</script>

<template>
  <figure class="group relative border-2 border-ink bg-paper-2" :style="{ boxShadow: `10px 10px 0 ${shadow}`, aspectRatio: ratio }">
    <div class="absolute inset-0 overflow-hidden">
      <img :src="src" :alt="alt" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" :style="{ objectPosition: position }" loading="lazy" />
    </div>
    <slot />
  </figure>
</template>
