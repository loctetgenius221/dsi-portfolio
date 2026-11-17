<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { animate, scroll } from 'motion'

// Barre de progression de lecture, aux couleurs du drapeau, fixée en haut de l'écran
const bar = ref<HTMLElement | null>(null)
let stop: (() => void) | undefined

onMounted(() => {
  if (!bar.value) return
  stop = scroll(animate(bar.value, { transform: ['scaleX(0)', 'scaleX(1)'] }, { ease: 'linear' }))
})
onBeforeUnmount(() => stop?.())
</script>

<template>
  <div
    ref="bar"
    class="pointer-events-none fixed inset-x-0 top-0 z-30 flex h-1 origin-left scale-x-0"
    aria-hidden="true"
  >
    <i class="flex-1 bg-green"></i><i class="flex-1 bg-yellow"></i><i class="flex-1 bg-red"></i>
  </div>
</template>
