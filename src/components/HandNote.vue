<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { animate, inView } from 'motion'

// Annotation « écrite à la main » avec une flèche tracée, pour guider vers une interaction.
// Décorative (aria-hidden) : l'information existe aussi en texte ailleurs sur la page.
withDefaults(defineProps<{ text: string; flip?: boolean }>(), { flip: false })

const arrow = ref<SVGPathElement | null>(null)
const head = ref<SVGPathElement | null>(null)

onMounted(() => {
  if (!arrow.value || !head.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const els = [arrow.value, head.value]
  els.forEach((p) => (p.style.strokeDashoffset = '1'))
  inView(
    arrow.value,
    () => {
      animate(arrow.value!, { strokeDashoffset: [1, 0] }, { duration: 1.1, ease: [0.22, 1, 0.36, 1] })
      animate(head.value!, { strokeDashoffset: [1, 0] }, { duration: 0.3, delay: 0.95 })
    },
    { amount: 0.8 },
  )
})
</script>

<template>
  <div class="pointer-events-none flex select-none items-start text-green" :class="flip ? 'flex-row-reverse' : ''" aria-hidden="true">
    <span class="mt-3 -rotate-3 whitespace-nowrap font-hand text-[1.7rem] font-semibold leading-none">{{ text }}</span>
    <svg viewBox="0 0 120 92" class="h-[5.5rem] w-[7.5rem] shrink-0 overflow-visible" :class="flip ? '-scale-x-100' : ''" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
      <path ref="arrow" pathLength="1" stroke-dasharray="1" d="M2 20 C38 8 70 6 84 24 C92 36 70 40 68 28 C66 18 86 14 100 30 C112 44 112 62 108 80" />
      <path ref="head" pathLength="1" stroke-dasharray="1" d="M97 69 L108 82 L119 68" />
    </svg>
  </div>
</template>
