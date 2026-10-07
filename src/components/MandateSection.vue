<script setup lang="ts">
import { results } from '@/data/dsi'
import type { Component } from 'vue'
import { IconArrowsExchange, IconBolt, IconTrendingUp } from '@tabler/icons-vue'
import PhotoFrame from './PhotoFrame.vue'

// Une icône Tabler par engagement (même famille que les missions)
const iconOf: Record<string, Component> = {
  steps: IconBolt,
  network: IconArrowsExchange,
  orbit: IconTrendingUp,
}
</script>

<template>
  <section class="pb-16 pt-10 sm:pb-24 sm:pt-14 lg:pb-28 lg:pt-16">
    <div class="wrap grid items-center gap-16 lg:grid-cols-[30rem_minmax(0,1fr)] lg:gap-20">
      <div class="mx-auto w-full max-w-68 sm:max-w-xs lg:mx-0 lg:max-w-none">
        <PhotoFrame
          src="/images/p2/team.jpg"
          alt="Équipe de professionnels réunie autour d'une grande table avec des ordinateurs portables"
          position="30% 50%"
          ratio="7 / 8"
          shadow="var(--color-yellow)"
        >
          <span
            class="absolute -bottom-5 right-4 grid h-24 w-24 place-items-center rounded-full border-2 border-ink bg-red text-center text-white lg:-right-5"
          >
            <span class="display text-2xl leading-none">2026</span>
          </span>
        </PhotoFrame>
      </div>

      <div v-reveal class="min-w-0">
        <h2 class="h2">Trois engagements : productivité, qualité et efficience.</h2>
        <p class="mt-5 max-w-xl leading-relaxed text-ink-soft">
          Ces engagements fondent l'action de la DSI, telle que la définit le texte d'organisation
          du Ministère.
        </p>
        <ol v-reveal="'stagger'" class="mt-8 border-t-2 border-ink">
          <li
            v-for="r in results"
            :key="r.title"
            class="group grid items-center gap-4 border-b border-rule py-6 sm:grid-cols-[6rem_1fr] sm:gap-8"
          >
            <div class="flex items-center sm:justify-center">
              <span
                class="grid h-16 w-16 place-items-center rounded-full border-2 border-green bg-white text-green transition-colors duration-300 group-hover:bg-green group-hover:text-white"
              >
                <component :is="iconOf[r.art]" :size="30" :stroke="1.5" aria-hidden="true" />
              </span>
            </div>
            <div>
              <h3 class="display text-2xl text-ink">{{ r.title }}</h3>
              <p class="mt-1.5 leading-relaxed text-ink-soft">{{ r.text }}</p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>
