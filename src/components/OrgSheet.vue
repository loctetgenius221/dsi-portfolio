<script setup lang="ts">
import { Mail } from 'lucide-vue-next'
import type { Person } from '@/data/dsi'
import Avatar from './Avatar.vue'

export interface Sheet {
  name: string
  role: string
  parent: string
  composition: string
  bureaux: string[]
  color: string
  person: Person
}

defineProps<{ sheet: Sheet }>()
</script>

<template>
  <div class="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-10">
    <div class="min-w-0">
      <p class="text-sm font-semibold text-ink-soft">Unité</p>
      <p class="display mt-1 text-[1.5rem] leading-tight sm:text-2xl">{{ sheet.name }}</p>
      <p class="mt-3 leading-snug">{{ sheet.role }}</p>

      <dl class="mt-5 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
        <div>
          <dt class="font-semibold text-ink-soft">Rattachement</dt>
          <dd class="mt-0.5 leading-snug">{{ sheet.parent }}</dd>
        </div>
        <div>
          <dt class="font-semibold text-ink-soft">Composition</dt>
          <dd class="mt-0.5 leading-snug">{{ sheet.composition }}</dd>
        </div>
      </dl>

      <div v-if="sheet.bureaux.length" class="mt-5">
        <p class="text-sm font-semibold text-ink-soft">Bureaux</p>
        <ul class="mt-2 flex flex-wrap gap-2">
          <li
            v-for="b in sheet.bureaux"
            :key="b"
            class="border border-dashed border-ink/50 bg-white px-3 py-1.5 text-sm font-semibold leading-tight"
          >
            {{ b }}
          </li>
        </ul>
        <p class="mt-2 text-xs text-ink-soft">Intitulés provisoires, en cours de validation.</p>
      </div>
    </div>

    <div class="min-w-0 border-t border-ink/20 pt-5 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
      <p class="text-sm font-semibold text-ink-soft">Responsable</p>
      <div class="mt-3 flex items-center gap-4">
        <span class="shrink-0 rounded-full ring-2 ring-ink"
          ><Avatar :person="sheet.person" :size="72" :color="sheet.color"
        /></span>
        <div class="min-w-0 leading-tight">
          <p class="display text-[1.4rem] sm:text-2xl">{{ sheet.person.name }}</p>
          <p class="mt-1 text-ink-soft">{{ sheet.person.title }}</p>
        </div>
      </div>
      <a
        :href="`mailto:${sheet.person.email}`"
        class="mt-4 flex min-h-12 w-full min-w-0 items-center justify-center gap-2 break-all border-2 border-ink px-2.5 py-2.5 text-center text-[0.78rem] font-semibold transition-colors hover:bg-green sm:text-[0.9rem] hover:text-white sm:justify-start"
        ><Mail :size="16" class="shrink-0" aria-hidden="true" />{{ sheet.person.email }}</a
      >
    </div>
  </div>
</template>
