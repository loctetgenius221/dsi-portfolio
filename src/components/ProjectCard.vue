<script setup lang="ts">
import { IconArrowRight } from '@tabler/icons-vue'
import { MINISTRY_LOGO } from '@/data/dsi'
import type { Project } from '@/data/dsi'

// Carte projet, partagée par le carrousel de l'accueil et la page « Toutes les réalisations ».
// Les attributs (largeur, rôle ARIA, événements) sont transmis à la racine.
withDefaults(defineProps<{ project: Project; n: number; tabbable?: boolean }>(), {
  tabbable: true,
})
const emit = defineEmits<{ open: [] }>()
</script>

<template>
  <div
    class="flex flex-col border-2 border-ink bg-white transition-shadow duration-300 hover:shadow-[6px_6px_0_var(--color-green)]"
  >
    <span class="h-1.5 bg-green" aria-hidden="true"></span>
    <div class="flex flex-1 flex-col p-6 sm:p-7">
      <div class="flex items-start justify-between gap-3">
        <!-- Logo de l'application (à défaut, logo officiel du Ministère) ; décoratif, le nom suit -->
        <span class="block h-16 w-28 border border-rule bg-white p-2" aria-hidden="true">
          <img
            :src="project.logo ?? MINISTRY_LOGO"
            alt=""
            class="h-full w-full object-contain"
            loading="lazy"
            draggable="false"
          />
        </span>
        <span class="display text-xl text-green-deep" aria-hidden="true">{{
          String(n).padStart(2, '0')
        }}</span>
      </div>
      <h3 class="display mt-5 text-[1.6rem] leading-tight text-ink">{{ project.name }}</h3>
      <p v-if="project.summary" class="mb-6 mt-2 leading-snug text-ink-soft">
        {{ project.summary }}
      </p>

      <button
        type="button"
        class="mt-auto flex min-h-12 w-full items-center justify-between gap-3 border-2 border-ink px-4 py-2.5 font-semibold transition-colors hover:bg-ink hover:text-white"
        aria-haspopup="dialog"
        :tabindex="tabbable ? undefined : -1"
        @click="emit('open')"
      >
        Voir la fiche<span class="sr-only"> : {{ project.name }}</span>
        <IconArrowRight size="18" stroke="2" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>
