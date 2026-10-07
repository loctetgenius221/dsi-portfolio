<script setup lang="ts">
import type { Component } from 'vue'
import { IconChartBar, IconFilter, IconHeadset, IconUsersGroup } from '@tabler/icons-vue'

// Textes repris des retours du client (« Évolution du fond »)
const pillars: { title: string; text: string; icon: Component }[] = [
  {
    title: 'Simplifier avant de numériser',
    text: 'La DSI ne se contente pas de mettre en ligne des formulaires complexes : elle simplifie d’abord les démarches administratives, puis les numérise.',
    icon: IconFilter,
  },
  {
    title: 'Conduire le changement',
    text: 'Elle accompagne les agents et les usagers dans l’appropriation des outils numériques, par la formation et la sensibilisation.',
    icon: IconUsersGroup,
  },
  {
    title: 'Un support de qualité',
    text: 'Elle assure une assistance rapide, efficace et de proximité, et s’appuie sur les retours du terrain pour améliorer les solutions déployées.',
    icon: IconHeadset,
  },
  {
    title: 'Mesurer les résultats',
    text: 'Elle suit des indicateurs de performance et mesure l’impact des actions engagées.',
    icon: IconChartBar,
  },
]
</script>

<template>
  <section class="border-t-2 border-ink bg-paper-2 py-16 sm:py-24">
    <div class="wrap">
      <div v-reveal class="grid gap-6 lg:grid-cols-12">
        <h2 class="h2 lg:col-span-7">Un partenaire de la modernisation.</h2>
        <p class="max-w-md leading-relaxed text-ink-soft lg:col-span-4 lg:col-start-9 lg:self-end">
          Au-delà de la fourniture de serveurs et de postes de travail, la DSI accompagne la
          modernisation du Ministère et de ses procédures.
        </p>
      </div>

      <ol v-reveal class="mt-12 grid gap-px border-2 border-ink bg-ink sm:grid-cols-2 xl:grid-cols-4">
        <li v-for="(p, i) in pillars" :key="p.title" class="group flex flex-col bg-white p-6 sm:p-7">
          <div class="flex items-center justify-between">
            <span
              class="grid h-14 w-14 place-items-center rounded-full border-2 border-green bg-white text-green transition-colors duration-300 group-hover:bg-green group-hover:text-white"
            >
              <component :is="p.icon" size="28" stroke="1.5" aria-hidden="true" />
            </span>
            <span class="display text-3xl text-green" aria-hidden="true">0{{ i + 1 }}</span>
          </div>
          <h3 class="display mt-6 text-[1.45rem] leading-tight text-ink">{{ p.title }}</h3>
          <p class="mt-2 leading-relaxed text-ink-soft">{{ p.text }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>
