<script setup lang="ts">
import { Mail, Phone } from 'lucide-vue-next'
import type { Person, UnitDetails } from '@/data/dsi'
import Avatar from './Avatar.vue'
import Pending from './Pending.vue'

export interface Sheet {
  name: string
  /** Résumé issu du guide d'accueil : affiché tant que la mission du client manque */
  role: string
  parent: string
  composition: string
  bureaux: string[]
  /** Unité qui a des bureaux (division) : la rubrique « Bureaux » s'affiche même vide */
  hasBureaux: boolean
  color: string
  person: Person
  details: UnitDetails
}

defineProps<{ sheet: Sheet }>()
</script>

<template>
  <!-- La mise en page suit la largeur du conteneur (volet latéral étroit ou fiche dépliée large) -->
  <div class="@container">
    <p class="text-sm font-semibold text-ink-soft">Unité</p>
    <p class="display mt-1 text-[1.5rem] leading-tight sm:text-2xl">{{ sheet.name }}</p>

    <div class="mt-6 grid min-w-0 gap-8 @3xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] @3xl:gap-10">
      <div class="min-w-0 space-y-6">
        <!-- 1. Mission -->
        <section>
          <h3 class="text-sm font-bold uppercase tracking-wide text-green-deep">Mission</h3>
          <div class="mt-2 space-y-2.5 leading-relaxed">
            <template v-if="sheet.details.mission">
              <p v-for="m in sheet.details.mission" :key="m">{{ m }}</p>
            </template>
            <p v-else>{{ sheet.role }}</p>
          </div>
        </section>

        <!-- 2. Responsabilités -->
        <section>
          <h3 class="text-sm font-bold uppercase tracking-wide text-green-deep">
            Principales responsabilités
          </h3>
          <ul v-if="sheet.details.responsibilities" class="mt-2 list-disc space-y-1 pl-5">
            <li v-for="r in sheet.details.responsibilities" :key="r">{{ r }}</li>
          </ul>
          <p v-else class="mt-2"><Pending /></p>
        </section>

        <!-- 4. Services rendus -->
        <section>
          <h3 class="text-sm font-bold uppercase tracking-wide text-green-deep">
            Services rendus aux utilisateurs
          </h3>
          <ul v-if="sheet.details.services" class="mt-2 list-disc space-y-1 pl-5">
            <li v-for="r in sheet.details.services" :key="r">{{ r }}</li>
          </ul>
          <p v-else class="mt-2"><Pending /></p>
        </section>
      </div>

      <div
        class="min-w-0 space-y-6 border-t border-ink/20 pt-6 @3xl:border-l @3xl:border-t-0 @3xl:pl-10 @3xl:pt-0"
      >
        <dl class="grid gap-x-8 gap-y-3 text-sm @md:grid-cols-2">
          <div>
            <dt class="font-semibold text-ink-soft">Rattachement</dt>
            <dd class="mt-0.5 leading-snug">{{ sheet.parent }}</dd>
          </div>
          <div>
            <dt class="font-semibold text-ink-soft">Composition</dt>
            <dd class="mt-0.5 leading-snug">{{ sheet.composition }}</dd>
          </div>
        </dl>

        <!-- 3. Bureaux : niveau inférieur, reliés à l'unité par un trait -->
        <section v-if="sheet.hasBureaux">
          <h3 class="text-sm font-bold uppercase tracking-wide text-green-deep">Bureaux</h3>
          <ul v-if="sheet.bureaux.length" class="mt-2 ml-2 space-y-2 pl-4">
            <li v-for="(b, i) in sheet.bureaux" :key="b" class="relative">
              <i
                class="absolute -left-4 w-0.5 bg-ink"
                :class="i === sheet.bureaux.length - 1 ? '-top-2 h-[calc(50%+0.5rem)]' : '-top-2 -bottom-2'"
                aria-hidden="true"
              ></i>
              <i class="absolute -left-4 top-1/2 h-0.5 w-4 bg-ink" aria-hidden="true"></i>
              <span
                class="block border border-dashed border-ink/60 bg-white px-3 py-1.5 text-sm font-semibold leading-tight"
                >{{ b }}</span
              >
            </li>
          </ul>
          <p class="mt-2 text-xs text-ink-soft">Intitulés provisoires, en cours de validation.</p>
        </section>

        <!-- Responsable -->
        <section>
          <h3 class="text-sm font-bold uppercase tracking-wide text-green-deep">Responsable</h3>
          <div class="mt-3 flex items-center gap-4">
            <span class="shrink-0 rounded-full ring-2 ring-ink"
              ><Avatar :person="sheet.person" :size="64" :color="sheet.color"
            /></span>
            <div class="min-w-0 leading-tight">
              <p class="display text-[1.3rem] sm:text-[1.45rem]">{{ sheet.person.name }}</p>
              <p class="mt-1 text-ink-soft">{{ sheet.person.title }}</p>
            </div>
          </div>
          <a
            :href="`mailto:${sheet.person.email}`"
            class="mt-4 flex min-h-12 w-full min-w-0 items-center justify-center gap-2 break-all border-2 border-ink px-2.5 py-2.5 text-center text-[0.78rem] font-semibold transition-colors hover:bg-green-deep hover:text-white sm:text-[0.9rem] @md:justify-start"
            ><Mail :size="16" class="shrink-0" aria-hidden="true" />{{ sheet.person.email }}</a
          >
        </section>

        <!-- 5. Contact fonctionnel (adresse ou téléphone générique de l'unité) -->
        <section>
          <h3 class="text-sm font-bold uppercase tracking-wide text-green-deep">
            Contact fonctionnel
          </h3>
          <div v-if="sheet.details.contact" class="mt-2 flex flex-col gap-2">
            <a
              v-if="sheet.details.contact.email"
              :href="`mailto:${sheet.details.contact.email}`"
              class="flex min-h-12 items-center gap-2 break-all border-2 border-ink px-3 py-2.5 text-[0.9rem] font-semibold transition-colors hover:bg-green-deep hover:text-white"
              ><Mail :size="16" class="shrink-0" aria-hidden="true" />{{ sheet.details.contact.email }}</a
            >
            <a
              v-if="sheet.details.contact.phone"
              :href="`tel:${sheet.details.contact.phone.replace(/\s/g, '')}`"
              class="flex min-h-12 items-center gap-2 border-2 border-ink px-3 py-2.5 text-[0.9rem] font-semibold transition-colors hover:bg-green-deep hover:text-white"
              ><Phone :size="16" class="shrink-0" aria-hidden="true" />{{ sheet.details.contact.phone }}</a
            >
          </div>
          <p v-else class="mt-2"><Pending /></p>
        </section>
      </div>
    </div>
  </div>
</template>
