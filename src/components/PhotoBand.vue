<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { animate, scroll } from 'motion'

const section = ref<HTMLElement | null>(null)
const img = ref<HTMLElement | null>(null)
let stop: (() => void) | undefined

// Léger effet de profondeur : la photo glisse plus lentement que la page
onMounted(() => {
  if (!section.value || !img.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  stop = scroll(animate(img.value, { transform: ['translateY(-8%)', 'translateY(8%)'] }, { ease: 'linear' }), {
    target: section.value,
    offset: ['start end', 'end start'],
  })
})
onBeforeUnmount(() => stop?.())

const points = ['Applications', 'Réseaux et sécurité', 'Données des agents de l’État', 'Assistance au quotidien']
</script>

<template>
  <section ref="section" class="relative isolate overflow-hidden border-y-2 border-ink bg-ink text-white">
    <img ref="img" src="/images/p2/keyboard.jpg" alt="Mains sur un clavier devant des écrans de code, dans un bureau éclairé de bleu" class="absolute inset-x-0 top-[-10%] -z-20 h-[120%] w-full object-cover opacity-80" loading="lazy" />
    <div class="absolute inset-0 -z-10 bg-linear-to-r from-green/55 via-green/20 to-green/5"></div>

    <div class="wrap relative flex min-h-120 flex-col justify-center py-20">
      <p class="display max-w-3xl text-[clamp(1.9rem,3.6vw,3.2rem)]">
        Des applications fiables, des réseaux protégés, des agents accompagnés.
      </p>
      <ul v-reveal="'stagger'" class="mt-10 flex flex-wrap gap-3">
        <li v-for="(p, i) in points" :key="p" class="flex items-center gap-2.5 border-2 border-white bg-ink/50 px-4 py-2 font-semibold backdrop-blur-sm">
          <span class="h-3 w-3 rounded-full border border-ink" :class="['bg-green', 'bg-yellow', 'bg-red', 'bg-white'][i % 4]"></span>{{ p }}
        </li>
      </ul>
    </div>
  </section>
</template>
