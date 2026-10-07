<script setup lang="ts">
import { IconCheck } from '@tabler/icons-vue'
import { Mail, Phone } from 'lucide-vue-next'
import { heads } from '@/data/dsi'

// Le support (Division des Services numériques et Supports aux Utilisateurs) est le premier point d'entrée
const support = heads.services!

const checklist = [
  { title: 'Vos coordonnées', text: 'Nom, direction ou service, numéro de téléphone.' },
  { title: 'La description du problème', text: "Outil concerné, message d'erreur, opération en cours." },
  { title: 'Le niveau d’urgence', text: 'Précisez si votre poste ou un service est bloqué.' },
]
</script>

<template>
  <section class="relative overflow-hidden border-t-2 border-ink bg-green-deep py-20 text-white sm:py-28">
    <div
      class="pattern-lozenge pointer-events-none absolute inset-y-0 right-0 hidden w-3/5 [mask-image:linear-gradient(to_right,transparent,black_70%)] lg:block"
      aria-hidden="true"
    ></div>
    <div class="wrap relative grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
      <div v-reveal class="lg:col-span-6">
        <h2 class="display text-[clamp(2rem,3.8vw,3.4rem)]">Le support, premier point d'entrée de vos demandes.</h2>
        <p class="mt-6 max-w-lg text-[1.2rem] font-medium leading-snug sm:text-[1.3rem]">
          En cas de doute sur l'interlocuteur, la Division des Services numériques et Supports aux Utilisateurs reçoit votre demande et l'oriente vers l'unité compétente.
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
            ><Mail :size="18" class="shrink-0" aria-hidden="true" />Écrire au support</a
          >
        </div>
        <p class="mt-5 text-sm text-white">
          Vous connaissez l'unité concernée ?
          <a href="#contact" class="font-semibold underline underline-offset-4 hover:text-yellow">Consulter « Qui contacter pour quoi ? »</a>
        </p>
      </div>

      <div v-reveal class="lg:col-span-5 lg:col-start-8">
        <div class="border-2 border-ink bg-white p-6 text-ink shadow-[8px_8px_0_var(--color-yellow)] sm:p-8">
          <h3 class="display text-[1.5rem] leading-tight sm:text-[1.7rem]">Pour un traitement rapide de votre demande</h3>
          <p class="mt-1 text-sm text-ink-soft">Précisez ces trois éléments dans votre message.</p>
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
