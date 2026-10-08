<script setup lang="ts">
import { computed, ref } from 'vue'
import { divisions } from '@/data/dsi'
import HeroStack from './HeroStack.vue'
import HandNote from './HandNote.vue'

const active = ref<string | null>(null)

// Légende mobile : dans le même ordre que l'illustration, du sommet vers le socle
const legend = computed(() => [...divisions].sort((a, b) => b.layer - a.layer))

// Un appui ou un clic sélectionne la couche ; un second la désélectionne
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
      <header class="flex items-center justify-between gap-4 py-8 sm:gap-6 sm:py-10">
        <!-- Gauche : sigle et nom de la Direction -->
        <div class="flex min-w-0 items-center gap-2.5 sm:gap-4">
          <span
            class="relative shrink-0 font-sans text-xl font-extrabold tracking-tight text-green sm:text-2xl"
            aria-hidden="true"
          >
            DSI
            <span class="absolute -bottom-1 left-0 flex h-0.75 w-full"
              ><i class="flex-1 bg-green"></i><i class="flex-1 bg-yellow"></i
              ><i class="flex-1 bg-red"></i
            ></span>
          </span>
          <span class="h-7 w-px shrink-0 bg-rule sm:h-8" aria-hidden="true"></span>
          <p class="min-w-0 text-[0.72rem] font-semibold leading-tight text-ink sm:text-sm">
            Direction des Systèmes<br />
            d'Information
          </p>
        </div>

        <!-- Droite : Ministère et son logo, tout à droite -->
        <div class="flex shrink-0 items-center gap-2.5 sm:gap-3">
          <img
            src="/images/logo-fp.png"
            class="w-9 shrink-0 sm:w-11"
            alt="Logo Ministère de la fonction publique du Sénégal"
          />
          <p
            class="sr-only text-left text-[0.78rem] leading-tight text-ink md:not-sr-only lg:text-sm"
          >
            Ministère de la Fonction publique, du<br />
            Travail et de la Réforme du Service Public
          </p>
        </div>
      </header>

      <div class="grid items-center gap-8 pb-6 pt-6 lg:grid-cols-[1fr_1fr] lg:pb-8 lg:pt-10">
        <div>
          <h1 class="display text-[clamp(2rem,3.6vw,3.4rem)] text-green">
            La DSI conçoit, pilote et sécurise l'architecture numérique du Ministère.
          </h1>
          <p class="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
            Rattachée au Secrétariat général, la Direction des Systèmes d'Information met le
            numérique au service de la productivité administrative, de la qualité du service public
            et de l'efficience de la transformation numérique.
          </p>
          <div class="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
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
          <p class="mt-2 hidden text-center text-sm text-ink-soft sm:block">
            <span class="font-semibold text-ink">Figure 1.</span> Les cinq divisions de la DSI, du
            socle technique à l'innovation. Sélectionnez une couche.
          </p>

          <!-- Légende mobile : liste à toucher, dans l'ordre de l'illustration -->
          <div class="sm:hidden">
            <p class="mt-3 text-sm leading-snug text-ink-soft">
              <span class="font-semibold text-ink">Figure 1.</span> Les cinq divisions de la DSI, de
              l'innovation (en haut) au socle technique (en bas). Sélectionnez une couche.
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
