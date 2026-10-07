<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { animate, scroll } from 'motion'

withDefaults(
  defineProps<{ src: string; alt: string; position?: string; shadow?: string; ratio?: string }>(),
  { position: '50% 50%', shadow: 'var(--color-yellow)', ratio: '4 / 3' },
)

// Parallaxe légère : la photo glisse un peu plus lentement que la page dans son cadre
const frame = ref<HTMLElement | null>(null)
const layer = ref<HTMLElement | null>(null)
let stop: (() => void) | undefined

onMounted(() => {
  if (!frame.value || !layer.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  stop = scroll(
    animate(layer.value, { transform: ['translateY(-5%)', 'translateY(5%)'] }, { ease: 'linear' }),
    { target: frame.value, offset: ['start end', 'end start'] },
  )
})
onBeforeUnmount(() => stop?.())
</script>

<template>
  <figure
    ref="frame"
    class="group relative border-2 border-ink bg-paper-2"
    :style="{ boxShadow: `10px 10px 0 ${shadow}`, aspectRatio: ratio }"
  >
    <div class="absolute inset-0 overflow-hidden">
      <div ref="layer" class="absolute inset-x-0 inset-y-[-6%]">
        <img
          :src="src"
          :alt="alt"
          class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          :style="{ objectPosition: position }"
          loading="lazy"
        />
      </div>
    </div>
    <slot />
  </figure>
</template>
