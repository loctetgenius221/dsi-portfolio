<script setup lang="ts">
import { IconCheck } from '@tabler/icons-vue'
import { Mail, Phone } from 'lucide-vue-next'
import { heads } from '@/data/dsi'

// Le support (Division des Services numériques) est le premier point d'entrée
const support = heads.services!

const checklist = [
  { title: 'Qui vous êtes', text: 'Votre nom, votre direction ou service, et un numéro où vous joindre.' },
  { title: 'Ce qui se passe', text: "Le message d'erreur, l'outil concerné, ce que vous essayiez de faire." },
  { title: 'Le degré d’urgence', text: 'Un poste à l’arrêt ou un service bloqué passe avant le reste.' },
]
</script>

<template>
  <section class="relative overflow-hidden border-t-2 border-ink bg-green-deep py-20 text-white sm:py-28">
    <div
      class="pattern-lozenge pointer-events-none absolute inset-y-0 right-0 hidden w-3/5 [mask-image:linear-gradient(to_right,transparent,black_70%)] lg:block"
      aria-hidden="true"
    ></div>
    <div class="wrap relative grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
      <div class="lg:col-span-6">
        <h2 class="display text-[clamp(2rem,3.8vw,3.4rem)]">Une demande à faire&nbsp;? Écrivez au support.</h2>
        <p class="mt-6 max-w-lg text-[1.2rem] font-medium leading-snug sm:text-[1.3rem]">
          Le support oriente chaque demande vers la bonne division. Joignez {{ support.name }}, {{ support.title.toLowerCase() }}, par téléphone ou par e-mail.
        </p>
        <div class="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <a
            :href="`tel:${support.phone.replace(/\s/g, '')}`"
            class="flex min-h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-ink bg-yellow px-7 py-3.5 text-center font-bold text-ink shadow-[4px_4px_0_var(--color-ink)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color-ink)] sm:inline-flex sm:w-auto"
            ><Phone :size="18" aria-hidden="true" />Appeler le support</a
          >
          <a
            :href="`mailto:${support.email}`"
            class="flex min-h-12 w-full min-w-0 items-center justify-center gap-2 border-2 border-white px-5 py-3 text-center font-semibold transition-colors hover:bg-white hover:text-green-deep sm:inline-flex sm:w-auto"
            ><Mail :size="18" class="shrink-0" aria-hidden="true" />Écrire par e-mail</a
          >
        </div>
        <p class="mt-5 text-sm text-white">
          Pas sûr de la bonne unité ?
          <a href="#contact" class="font-semibold underline underline-offset-4 hover:text-yellow">Consultez la FAQ</a>
        </p>
      </div>

      <div class="lg:col-span-5 lg:col-start-8">
        <div class="border-2 border-ink bg-white p-6 text-ink shadow-[8px_8px_0_var(--color-yellow)] sm:p-8">
          <h3 class="display text-[1.5rem] leading-tight sm:text-[1.7rem]">Pour un traitement plus rapide</h3>
          <p class="mt-1 text-sm text-ink-soft">Indiquez ces trois éléments dans votre message.</p>
          <ol class="mt-5 space-y-4">
            <li v-for="(c, i) in checklist" :key="c.title" class="flex gap-4">
              <span
                class="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-green bg-white text-green"
              >
                <IconCheck size="18" stroke="2.2" aria-hidden="true" />
              </span>
              <div class="min-w-0">
                <p class="font-bold leading-tight"><span class="sr-only">{{ i + 1 }}. </span>{{ c.title }}</p>
                <p class="mt-0.5 leading-snug text-ink-soft">{{ c.text }}</p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </section>
</template>
