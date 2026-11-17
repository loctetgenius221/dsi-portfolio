<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { animate, inView, scroll } from 'motion'

withDefaults(
  defineProps<{ src: string; alt: string; position?: string; shadow?: string; ratio?: string }>(),
  { position: '50% 50%', shadow: 'var(--color-yellow)', ratio: '4 / 3' },
)

// Parallaxe légère : la photo glisse un peu plus lentement que la page dans son cadre.
// À l'entrée à l'écran, un rideau découvre la photo de bas en haut pendant qu'elle se resserre.
const frame = ref<HTMLElement | null>(null)
const curtain = ref<HTMLElement | null>(null)
const zoom = ref<HTMLElement | null>(null)
const layer = ref<HTMLElement | null>(null)
let stop: (() => void) | undefined
let stopReveal: (() => void) | undefined

onMounted(() => {
  if (!frame.value || !layer.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (curtain.value && zoom.value) {
    const c = curtain.value
    const z = zoom.value
    c.style.clipPath = 'inset(100% 0% 0% 0%)'
    z.style.transform = 'scale(1.25)'
    stopReveal = inView(
      frame.value,
      () => {
        const ease = [0.65, 0, 0.35, 1] as const
        animate(c, { clipPath: 'inset(0% 0% 0% 0%)' }, { duration: 1.1, ease })
        animate(z, { transform: 'scale(1)' }, { duration: 1.6, ease: [0.22, 1, 0.36, 1] })
      },
      { amount: 0.3 },
    )
  }
  stop = scroll(
    animate(layer.value, { transform: ['translateY(-5%)', 'translateY(5%)'] }, { ease: 'linear' }),
    { target: frame.value, offset: ['start end', 'end start'] },
  )
})
onBeforeUnmount(() => {
  stop?.()
  stopReveal?.()
})
</script>

<template>
  <figure
    ref="frame"
    class="group relative border-2 border-ink bg-paper-2"
    :style="{ boxShadow: `10px 10px 0 ${shadow}`, aspectRatio: ratio }"
  >
    <div ref="curtain" class="absolute inset-0 overflow-hidden">
      <div ref="zoom" class="absolute inset-0">
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
    </div>
    <slot />
  </figure>
</template>
