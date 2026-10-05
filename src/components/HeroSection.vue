<script setup lang="ts">
import { computed, ref } from 'vue'
import { divisions } from '@/data/dsi'
import HeroStack from './HeroStack.vue'
import HandNote from './HandNote.vue'

const active = ref<string | null>(null)

// Légende mobile : dans le même ordre que l'illustration, du sommet vers le socle
const legend = computed(() => [...divisions].sort((a, b) => b.layer - a.layer))

// Au toucher, un appui bascule la couche (pas de survol)
function toggle(id: string) {
  active.value = active.value === id ? null : id
}
</script>

<template>
  <section class="grid-paper relative overflow-hidden">
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_72%_42%,transparent_30%,white_82%)]"
    ></div>

    <div class="wrap relative">
      <header class="flex items-center justify-between gap-3 py-5 sm:gap-6 sm:py-6">
        <div class="flex min-w-0 items-center gap-3 sm:gap-4">
          <span class="relative font-sans text-2xl font-extrabold tracking-tight text-green">
            DSI
            <span class="absolute -bottom-1 left-0 flex h-0.75 w-full"
              ><i class="flex-1 bg-green"></i><i class="flex-1 bg-yellow"></i
              ><i class="flex-1 bg-red"></i
            ></span>
          </span>
          <span class="h-6 w-px bg-rule"></span>
          <div class="flex items-center gap-2">
            <img
              src="/images/logo-fp.png"
              class="w-10"
              alt="Logo du Ministère de la Fonction publique"
            />
            <p class="text-[0.68rem] leading-snug text-ink sm:text-sm sm:leading-tight">
              Ministère de la Fonction publique, du<br />
              Travail et de la Réforme du Service Public
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <p class="text-sm font-semibold tabular-nums text-ink-soft">2026</p>
          <img class="w-5" src="/images/p2/Flag_of_Senegal.svg.webp" alt="" />
        </div>
      </header>

      <div class="grid items-center gap-8 pb-8 pt-6 lg:grid-cols-[1fr_1fr] lg:pb-14 lg:pt-10">
        <div>
          <h1 class="display text-[clamp(2rem,3.6vw,3.4rem)] text-green">
            La DSI conçoit, pilote et sécurise le numérique du Ministère.
          </h1>
          <p class="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
            Une panne, un projet, une idée ? Voici l'équipe qui fait tourner les outils numériques
            du Ministère, et comment la solliciter.
          </p>
          <div class="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href="#contact"
              class="flex min-h-12 w-full items-center justify-center rounded-full border-2 border-ink bg-green px-6 py-3 text-center font-semibold text-paper shadow-[4px_4px_0_var(--color-ink)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color-ink)] sm:inline-flex sm:w-auto"
              >Trouver mon interlocuteur</a
            >
            <a
              href="#organisation"
              class="flex min-h-12 w-full items-center justify-center rounded-full border-2 border-transparent px-5 py-3 text-center font-semibold text-ink underline decoration-green decoration-2 underline-offset-8 transition-colors hover:decoration-red sm:inline-flex sm:w-auto"
              >Voir l'organisation</a
            >
          </div>
        </div>
        <div class="relative mx-auto w-full sm:max-w-136 lg:max-w-140">
          <HandNote text="Survolez une couche" class="hint-hover absolute -left-6 -top-9" />
          <div class="mx-auto max-w-[20rem] sm:max-w-none">
            <HeroStack v-model:active="active" />
          </div>
          <p class="mt-2 hidden text-center text-sm text-ink-soft sm:block">
            <span class="font-semibold text-ink">Figure 1.</span> L'architecture de la DSI en cinq
            couches. Sélectionnez une couche.
          </p>

          <!-- Légende mobile : liste à toucher, dans l'ordre de l'illustration -->
          <div class="sm:hidden">
            <p class="mt-3 text-sm leading-snug text-ink-soft">
              <span class="font-semibold text-ink">Figure 1.</span> Les cinq couches de la DSI, de
              l'innovation (en haut) au socle technique (en bas). Touchez une couche.
            </p>
            <ul class="mt-3 border-2 border-ink bg-white">
              <li v-for="d in legend" :key="d.id" class="border-b border-rule last:border-b-0">
                <button
                  type="button"
                  class="flex min-h-12 w-full items-center gap-3 px-4 py-3 text-left transition-colors"
                  :class="active === d.id ? 'bg-paper-2' : ''"
                  :aria-pressed="active === d.id"
                  @click="toggle(d.id)"
                >
                  <span
                    class="h-4 w-4 shrink-0 border-2 border-ink"
                    :style="{ background: d.swatch }"
                  ></span>
                  <span
                    class="flex-1 text-[0.95rem] leading-snug"
                    :class="active === d.id ? 'font-bold text-ink' : 'font-semibold text-ink-soft'"
                    >{{ d.short }}</span
                  >
                  <span
                    class="h-2.5 w-2.5 shrink-0 rounded-full border-2 border-ink transition-colors"
                    :class="active === d.id ? 'bg-ink' : 'bg-transparent'"
                  ></span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
