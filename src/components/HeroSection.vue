<script setup lang="ts">
import { ref } from 'vue'
import HeroStack from './HeroStack.vue'
import HandNote from './HandNote.vue'
import SiteHeader from './SiteHeader.vue'

const active = ref<string | null>(null)
</script>

<template>
  <section class="grid-paper relative overflow-hidden">
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_72%_42%,transparent_30%,white_82%)]"
    ></div>

    <div class="wrap relative">
      <SiteHeader />

      <div class="grid items-center gap-8 pb-6 pt-6 lg:grid-cols-[1fr_1fr] lg:pb-8 lg:pt-10">
        <div>
          <h1 v-split class="display text-[clamp(2rem,3.5vw,3.25rem)] text-green">
            La DSI conçoit, pilote et sécurise le numérique de l'administration.
          </h1>
          <p
            v-reveal
            data-reveal-delay="0.45"
            class="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft"
          >
            Rattachée au Secrétariat général du Ministère, la DSI accompagne aussi d'autres
            ministères et structures publiques, au service de la productivité administrative et de
            la qualité du service public.
          </p>
          <div
            v-reveal="'stagger'"
            data-reveal-delay="0.6"
            class="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
          >
            <a
              href="#contact"
              class="flex min-h-12 w-full items-center justify-center rounded-full border-2 border-ink bg-green px-6 py-3 text-center font-semibold text-paper shadow-[4px_4px_0_var(--color-ink)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color-ink)] sm:inline-flex sm:w-auto"
              >Trouver un interlocuteur</a
            >
            <a
              href="#organisation"
              class="flex min-h-12 w-full items-center justify-center rounded-full border-2 border-transparent px-5 py-3 text-center font-semibold text-ink underline decoration-green decoration-2 underline-offset-8 transition-colors hover:decoration-red sm:inline-flex sm:w-auto"
              >Consulter l'organigramme</a
            >
          </div>
        </div>
        <div class="relative mx-auto w-full sm:max-w-136 lg:max-w-140">
          <HandNote text="Sélectionnez une couche" class="hint-hover absolute -left-6 -top-9" />
          <div class="mx-auto max-w-[20rem] sm:max-w-none">
            <HeroStack v-model:active="active" />
          </div>
          <!-- <p class="mt-2 hidden text-center text-sm text-ink-soft sm:block">
            <span class="font-semibold text-ink">Figure 1.</span> Les cinq divisions de la DSI, du
            socle technique à l'innovation. Sélectionnez une couche.
          </p> -->
        </div>
      </div>
    </div>
  </section>
</template>
