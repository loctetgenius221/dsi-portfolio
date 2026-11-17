<script setup lang="ts">
import { ref } from 'vue'
import { IconArrowLeft } from '@tabler/icons-vue'
import { projects } from '@/data/dsi'
import type { Project } from '@/data/dsi'
import SiteHeader from '@/components/SiteHeader.vue'
import ProjectCard from '@/components/ProjectCard.vue'
import ProjectSheet from '@/components/ProjectSheet.vue'
import SiteFooter from '@/components/SiteFooter.vue'

const opened = ref<Project | null>(null)
const openedN = ref(0)
function openSheet(p: Project, n: number) {
  opened.value = p
  openedN.value = n
}
</script>

<template>
  <main>
    <section class="grid-paper border-b-2 border-ink">
      <div class="wrap">
        <SiteHeader />
        <div class="pb-12 pt-4 sm:pb-16">
          <RouterLink
            :to="{ path: '/', hash: '#realisations' }"
            class="inline-flex min-h-12 items-center gap-2 font-semibold text-ink underline decoration-green decoration-2 underline-offset-8 transition-colors hover:decoration-red"
          >
            <IconArrowLeft size="18" stroke="2" aria-hidden="true" />
            Retour à l’accueil
          </RouterLink>
          <h1 v-split class="display mt-6 text-[clamp(2rem,4vw,3.4rem)] text-green">
            Toutes les réalisations de la DSI.
          </h1>
          <p class="mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">
            {{ projects.length }} projets numériques portés par la DSI. Ouvrez une fiche pour en
            lire la description complète.
          </p>
        </div>
      </div>
    </section>

    <section class="py-14 sm:py-20" aria-label="Liste des projets">
      <div class="wrap">
        <ul v-reveal="'stagger'" class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <li v-for="(p, i) in projects" :key="p.name" class="flex">
            <ProjectCard :project="p" :n="i + 1" class="w-full" @open="openSheet(p, i + 1)" />
          </li>
        </ul>
      </div>
    </section>

    <ProjectSheet
      :project="opened"
      :n="openedN"
      :total="projects.length"
      @close="opened = null"
    />
  </main>
  <SiteFooter />
</template>
