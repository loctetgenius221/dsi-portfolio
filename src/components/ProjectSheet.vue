<script setup lang="ts">
import { IconArrowUpRight } from '@tabler/icons-vue'
import { MINISTRY_LOGO } from '@/data/dsi'
import type { Project } from '@/data/dsi'
import SideDrawer from './SideDrawer.vue'

// Fiche projet détaillée (volet latéral, plein écran sur mobile)
defineProps<{ project: Project | null; n: number; total: number }>()
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <SideDrawer
    :open="!!project"
    :label="`Fiche projet : ${project?.name ?? ''}`"
    @close="emit('close')"
  >
    <template #header>
      <span class="text-ink-soft">Fiche projet · </span>{{ String(n).padStart(2, '0') }} sur
      {{ total }}
    </template>
    <template v-if="project">
      <div class="flex items-center gap-4">
        <span class="block h-16 w-28 shrink-0 border border-rule bg-white p-2" aria-hidden="true">
          <img :src="project.logo ?? MINISTRY_LOGO" alt="" class="h-full w-full object-contain" />
        </span>
        <p class="display min-w-0 text-[2rem] leading-tight text-ink">{{ project.name }}</p>
      </div>
      <p v-if="project.summary" class="mt-2 text-lg leading-snug text-ink-soft">
        {{ project.summary }}
      </p>
      <a
        v-if="project.link"
        :href="project.link.url"
        target="_blank"
        rel="noopener noreferrer"
        class="mt-5 inline-flex min-h-12 items-center gap-2 border-2 border-ink bg-yellow px-4 py-2.5 font-semibold transition-colors hover:bg-ink hover:text-white"
        >{{ project.link.label }}<span class="sr-only"> (nouvel onglet)</span>
        <IconArrowUpRight size="18" stroke="2" aria-hidden="true"
      /></a>

      <div v-if="project.description" class="mt-7 border-t-2 border-ink py-5">
        <p class="text-sm font-bold uppercase tracking-wide text-green-deep">Description</p>
        <p class="mt-2 leading-relaxed">{{ project.description }}</p>
      </div>
    </template>
  </SideDrawer>
</template>
