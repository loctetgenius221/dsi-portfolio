<script setup lang="ts">
import { Mail, Phone } from 'lucide-vue-next'
import type { UnitDetails } from '@/data/dsi'
import Pending from './Pending.vue'

// Contact fonctionnel d'une unité (adresse ou téléphone génériques).
// Sécurité : jamais de courriel ni de ligne directe nominatifs.
defineProps<{ contact: UnitDetails['contact'] }>()
</script>

<template>
  <div
    v-if="contact && (contact.email || contact.phone)"
    class="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap"
  >
    <a
      v-if="contact.phone"
      :href="`tel:${contact.phone.replace(/\s/g, '')}`"
      class="flex min-h-12 items-center justify-center gap-2 whitespace-nowrap border-2 border-ink bg-yellow px-4 py-2.5 text-center font-semibold transition-colors hover:bg-ink hover:text-white sm:justify-start"
      ><Phone :size="16" aria-hidden="true" />{{ contact.phone }}</a
    >
    <a
      v-if="contact.email"
      :href="`mailto:${contact.email}`"
      class="flex min-h-12 min-w-0 items-center justify-center gap-2 break-all border-2 border-ink bg-white px-4 py-2.5 text-center text-[0.92rem] font-semibold transition-colors hover:bg-ink hover:text-white sm:justify-start"
      ><Mail :size="16" class="shrink-0" aria-hidden="true" />{{ contact.email }}</a
    >
  </div>
  <p v-else><Pending label="Contact fonctionnel à compléter" /></p>
</template>
