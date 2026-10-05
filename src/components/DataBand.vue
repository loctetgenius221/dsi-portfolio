<script setup lang="ts">
import { IconDatabase } from '@tabler/icons-vue'
import PhotoFrame from './PhotoFrame.vue'

const attributes = [
  { t: 'Qualité', c: 'bg-green' },
  { t: 'Fiabilité', c: 'bg-yellow' },
  { t: 'Sécurité', c: 'bg-red' },
  { t: 'Conformité', c: 'bg-white' },
]
</script>

<template>
  <section class="relative overflow-hidden border-y-2 border-ink bg-yellow py-14 sm:py-24">
    <div class="wrap relative grid items-center gap-12 lg:grid-cols-12">
      <div class="px-2 lg:col-span-5">
        <PhotoFrame src="/images/p2/desk.jpg" alt="Agente concentrée devant son ordinateur portable, un carnet ouvert sur son bureau" position="62% 50%" ratio="4 / 3" shadow="var(--color-ink)">
          <span class="absolute -bottom-8 right-3 grid h-28 w-28 place-items-center rounded-full border-2 border-ink bg-white text-ink lg:-right-8">
            <IconDatabase size="52" stroke="1.4" aria-hidden="true" />
          </span>
        </PhotoFrame>
      </div>
      <div class="lg:col-span-7">
        <p class="mb-4 inline-block border-2 border-ink bg-white px-3 py-1 text-sm font-bold">Une responsabilité à part</p>
        <h2 class="display text-[clamp(1.9rem,3.4vw,3.1rem)] text-ink">La base de données consolidée des agents de l'État est pilotée par la DSI.</h2>
        <p class="mt-6 max-w-2xl text-lg leading-relaxed text-ink">
          Elle regroupe les agents de l'État dont la carrière est administrée selon la réglementation en vigueur. La DSI garantit aussi la gouvernance numérique du SIRH et un réseau d'échange inter-systèmes sécurisé.
        </p>
        <ul class="mt-9 flex flex-wrap gap-3">
          <li v-for="a in attributes" :key="a.t" class="flex items-center gap-3 rounded-full border-2 border-ink bg-white py-2 pl-3 pr-5 font-semibold">
            <span class="h-4 w-4 rounded-full border-2 border-ink" :class="a.c"></span>{{ a.t }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
