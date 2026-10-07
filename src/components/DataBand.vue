<script setup lang="ts">
import { IconShieldCheck } from '@tabler/icons-vue'
import PhotoFrame from './PhotoFrame.vue'

// Sécurité de l'information : la section présente la mission et le partage des
// responsabilités, sans décrire les systèmes, leur emplacement ni leur architecture.
const attributes = [
  { t: 'Qualité', c: 'bg-green' },
  { t: 'Fiabilité', c: 'bg-yellow' },
  { t: 'Sécurité', c: 'bg-red' },
  { t: 'Conformité', c: 'bg-white' },
]
</script>

<template>
  <section class="relative overflow-hidden border-y-2 border-ink bg-green py-14 sm:py-24">
    <div class="wrap relative grid items-center gap-12 lg:grid-cols-12">
      <div class="px-2 lg:col-span-5">
        <PhotoFrame
          src="/images/p2/desk.jpg"
          alt="Agente concentrée devant son ordinateur portable, un carnet ouvert sur son bureau"
          position="62% 50%"
          ratio="4 / 3"
          shadow="var(--color-ink)"
        >
          <span
            class="absolute -bottom-8 right-3 grid h-28 w-28 place-items-center rounded-full border-2 border-ink bg-white text-ink lg:-right-8"
          >
            <IconShieldCheck size="52" stroke="1.4" aria-hidden="true" />
          </span>
        </PhotoFrame>
      </div>
      <div v-reveal class="lg:col-span-7">
        <p class="mb-4 inline-block border-2 border-ink bg-white px-3 py-1 text-sm font-bold">
          Données RH de l'État
        </p>
        <h2 class="display text-[clamp(1.9rem,3.4vw,3.1rem)] text-paper">
          Des données RH fiables, protégées et bien gouvernées.
        </h2>
        <p class="mt-6 max-w-2xl text-lg leading-relaxed text-ink">
          La DSI veille à la qualité, à la fiabilité, à la sécurité et à la conformité des données
          RH, en lien avec les directions métiers.
        </p>
        <ul class="mt-9 flex flex-wrap gap-3">
          <li
            v-for="a in attributes"
            :key="a.t"
            class="flex items-center gap-3 rounded-full border-2 border-ink bg-white py-2 pl-3 pr-5 font-semibold"
          >
            <span class="h-4 w-4 rounded-full border-2 border-ink" :class="a.c"></span>{{ a.t }}
          </li>
        </ul>

        <!-- Gouvernance des données : qui est responsable de quoi (retours du client) -->
        <div class="mt-10">
          <h3 class="text-[1.2rem] font-bold leading-snug text-white">
            Gouvernance des données : qui est responsable de quoi ?
          </h3>
          <dl class="mt-4 grid gap-3 sm:grid-cols-2">
            <div class="border-2 border-ink bg-white p-5">
              <dt class="display text-[1.3rem] leading-tight">La DSI</dt>
              <dd class="mt-2 leading-snug text-ink-soft">
                Responsable de la sécurité technique des données et des systèmes qui les hébergent.
              </dd>
            </div>
            <div class="border-2 border-ink bg-white p-5">
              <dt class="display text-[1.3rem] leading-tight">Les directions métiers</dt>
              <dd class="mt-2 leading-snug text-ink-soft">
                RH, Finances, etc. : propriétaires et responsables du contenu de leurs données.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </section>
</template>
