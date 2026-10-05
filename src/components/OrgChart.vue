<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { animate, inView, stagger } from 'motion'
import { IconChevronDown } from '@tabler/icons-vue'
import { adminBureau, divisions, heads } from '@/data/dsi'
import Avatar from './Avatar.vue'
import HandNote from './HandNote.vue'
import OrgSheet from './OrgSheet.vue'
import type { Sheet } from './OrgSheet.vue'

// Le vert est la seule couleur de l'organigramme
const GREEN = '#009454'

const chart = ref<HTMLElement | null>(null)

// Grand écran : l'arbre est horizontal et la fiche s'affiche dessous (DSI par défaut).
// Petit écran : liste verticale, la fiche s'ouvre sous l'unité touchée (tout fermé au départ).
const isWide = typeof window !== 'undefined' && window.matchMedia('(min-width: 1280px)').matches
const selected = ref<string | null>(isWide ? 'dsi' : null)

interface Unit {
  id: string
  kind: string
  label: string
  name: string
  role: string
  bureaux: { name: string; provisional?: boolean }[]
}

const units: Unit[] = [
  ...divisions.map((d) => ({
    id: d.id,
    kind: 'Division',
    label: d.short,
    name: d.name,
    role: d.role,
    bureaux: d.bureaux,
  })),
  {
    id: adminBureau.id,
    kind: 'Bureau',
    label: adminBureau.short,
    name: adminBureau.short,
    role: adminBureau.role,
    bureaux: [],
  },
]

const dsiInfo = {
  name: "Direction des Systèmes d'Information",
  role: "Conçoit, pilote et sécurise l'architecture numérique du Ministère.",
}

function sheetOf(id: string): Sheet {
  if (id === 'dsi') {
    return {
      ...dsiInfo,
      parent: 'Secrétariat général',
      composition: '5 divisions et 1 bureau administratif et financier',
      bureaux: [],
      person: heads.dsi!,
      color: GREEN,
    }
  }
  const u = units.find((x) => x.id === id) ?? units[0]!
  return {
    name: u.name,
    role: u.role,
    parent: "Direction des Systèmes d'Information",
    composition: u.bureaux.length
      ? `${u.bureaux.length} bureaux`
      : u.kind === 'Bureau'
        ? 'Sans objet'
        : 'À préciser',
    bureaux: u.bureaux.map((b) => b.name),
    person: heads[u.id]!,
    color: GREEN,
  }
}

const wideSheet = computed(() => sheetOf(selected.value ?? 'dsi'))

// Un second appui sur l'unité ouverte la referme
function pick(id: string) {
  selected.value = selected.value === id ? (isWide ? 'dsi' : null) : id
}

onMounted(() => {
  if (!chart.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const root = chart.value
  const lines = root.querySelectorAll<HTMLElement>('[data-line]')
  const nodes = root.querySelectorAll<HTMLElement>('[data-node]')
  lines.forEach((l) => (l.style.transform = 'scale(0)'))
  nodes.forEach((n) => (n.style.opacity = '0'))
  inView(
    root,
    () => {
      animate(nodes, { opacity: 1 }, { duration: 0.6, delay: stagger(0.06) })
      animate(
        lines,
        { transform: 'scale(1)' },
        { duration: 0.6, delay: stagger(0.05, { startDelay: 0.2 }), ease: [0.22, 1, 0.36, 1] },
      )
    },
    { amount: 0.1 },
  )
})
</script>

<template>
  <section id="organisation" class="grid-paper relative py-16 sm:py-24 lg:py-28">
    <div
      class="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,white,transparent_20%,transparent_80%,white)]"
    ></div>
    <div class="wrap relative">
      <div class="grid gap-6 lg:grid-cols-12">
        <h2 class="h2 lg:col-span-6">Organigramme de la Direction.</h2>
        <p class="max-w-md leading-relaxed text-ink-soft lg:col-span-4 lg:col-start-9 lg:self-end">
          Rattachée au Secrétariat général, la DSI compte cinq divisions et un bureau. Sélectionnez
          une unité pour consulter sa fiche.
        </p>
      </div>

      <div ref="chart" class="relative mt-12 sm:mt-16">
        <div class="absolute left-0 top-[11.5rem] hidden xl:block">
          <HandNote text="Cliquez sur une division" class="hint-hover" />
        </div>

        <!-- Niveaux 1 et 2 -->
        <div class="flex flex-col items-center">
          <div data-node class="w-full border border-ink bg-white px-6 py-3 text-center sm:w-auto sm:px-10">
            <p class="text-sm font-semibold text-ink-soft">Tutelle</p>
            <p class="display text-xl sm:text-2xl">Secrétariat général</p>
          </div>
          <i data-line class="h-6 w-px origin-top bg-ink/60 sm:h-8"></i>
          <button
            data-node
            type="button"
            class="relative w-full max-w-none border-2 border-ink px-5 pb-4 pt-5 text-center transition-colors sm:px-8 xl:max-w-md"
            :style="{
              background: selected === 'dsi' ? '#00763f' : '#ffffff',
              color: selected === 'dsi' ? '#ffffff' : '#141414',
            }"
            :aria-pressed="selected === 'dsi'"
            @click="selected = 'dsi'"
          >
            <span class="display block text-[1.35rem] leading-tight sm:text-2xl"
              >Direction des Systèmes d'Information</span
            >
            <span
              class="mt-4 flex items-center justify-center gap-3 border-t pt-3.5"
              :class="selected === 'dsi' ? 'border-white/35' : 'border-ink/15'"
            >
              <span class="shrink-0 rounded-full ring-2 ring-ink"
                ><Avatar :person="heads.dsi!" :size="40" :color="GREEN"
              /></span>
              <span class="min-w-0 text-left leading-tight">
                <span class="block text-[0.95rem] font-semibold">{{ heads.dsi!.name }}</span>
                <span class="text-sm opacity-90">{{ heads.dsi!.title }}</span>
              </span>
            </span>
          </button>
          <i data-line class="hidden h-8 w-px origin-top bg-ink/60 xl:block"></i>
        </div>

        <!-- Fiche de la DSI, sous le noeud (petits écrans) -->
        <div
          class="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none xl:hidden"
          :style="{ gridTemplateRows: selected === 'dsi' ? '1fr' : '0fr' }"
          :inert="selected !== 'dsi'"
        >
          <div class="min-h-0 overflow-hidden">
            <div class="mt-4 border-2 border-ink bg-white p-5 sm:p-6">
              <OrgSheet :sheet="sheetOf('dsi')" />
            </div>
          </div>
        </div>

        <!-- Raccord entre la DSI et la liste (< xl) -->
        <i data-line class="ml-3 mt-0 block h-6 w-0.5 origin-top bg-ink sm:ml-5 xl:hidden"></i>

        <!-- Niveau 3 : arbre horizontal (xl) -->
        <ul class="hidden xl:grid xl:grid-cols-6 xl:gap-4">
          <li v-for="(u, i) in units" :key="u.id" class="relative pt-8">
            <i
              data-line
              class="absolute top-0 h-px origin-center bg-ink/60"
              :class="
                i === 0
                  ? 'left-1/2 -right-2'
                  : i === units.length - 1
                    ? '-left-2 right-1/2'
                    : '-left-2 -right-2'
              "
            ></i>
            <i data-line class="absolute left-1/2 top-0 h-8 w-px origin-top bg-ink/60"></i>
            <button
              data-node
              type="button"
              class="relative flex h-60 w-full flex-col items-start border px-4 pb-4 pt-5 text-left transition-colors duration-200"
              :class="selected === u.id ? 'border-green-deep bg-green-deep text-white' : 'border-ink bg-white text-ink'"
              :aria-pressed="selected === u.id"
              @click="pick(u.id)"
            >
              <span class="absolute inset-x-0 top-0 h-1.5 bg-green"></span>
              <span class="text-sm font-semibold opacity-90">{{ u.kind }}</span>
              <span class="display mt-1 text-[1.2rem] leading-[1.15]">{{ u.label }}</span>
              <span
                class="mt-auto flex w-full items-center gap-2.5 border-t pt-3.5"
                :class="selected === u.id ? 'border-white/30' : 'border-ink/15'"
              >
                <span class="shrink-0 rounded-full ring-2 ring-ink"
                  ><Avatar :person="heads[u.id]!" :size="40" :color="GREEN"
                /></span>
                <span class="min-w-0 leading-tight">
                  <span class="block text-[0.85rem] font-semibold">{{ heads[u.id]!.name }}</span>
                  <span class="block text-xs opacity-90">{{ heads[u.id]!.title }}</span>
                </span>
              </span>
            </button>
          </li>
        </ul>

        <!-- Niveau 3 : liste verticale avec fiche en ligne (< xl) -->
        <ul class="relative ml-3 space-y-3 pl-5 sm:ml-5 sm:pl-7 xl:hidden">
          <li v-for="(u, i) in units" :key="u.id" class="relative">
            <i
              class="absolute -left-5 w-0.5 bg-ink sm:-left-7"
              :class="i === units.length - 1 ? '-top-3 h-[2.75rem]' : '-top-3 -bottom-3'"
            ></i>
            <i data-line class="absolute -left-5 top-8 h-0.5 w-5 origin-left bg-ink sm:-left-7 sm:w-7"></i>
            <button
              data-node
              type="button"
              class="flex min-h-18 w-full items-center gap-3 border-2 border-ink px-3.5 py-3 text-left transition-colors duration-200 sm:gap-4 sm:px-5"
              :class="selected === u.id ? 'bg-green-deep text-white' : 'bg-white text-ink'"
              :aria-expanded="selected === u.id"
              :aria-controls="`org-a-${u.id}`"
              @click="pick(u.id)"
            >
              <span class="shrink-0 rounded-full ring-2 ring-ink"
                ><Avatar :person="heads[u.id]!" :size="48" :color="GREEN"
              /></span>
              <span class="min-w-0 flex-1 leading-tight">
                <span class="block text-xs font-semibold opacity-90">{{ u.kind }}</span>
                <span class="display mt-0.5 block text-[1.15rem] leading-[1.15] sm:text-[1.3rem]">{{ u.label }}</span>
                <span class="mt-1 block truncate text-[0.82rem] opacity-80">{{ heads[u.id]!.name }}</span>
              </span>
              <IconChevronDown
                size="22"
                stroke="2"
                class="shrink-0 transition-transform duration-300"
                :class="selected === u.id ? 'rotate-180' : ''"
                aria-hidden="true"
              />
            </button>
            <div
              :id="`org-a-${u.id}`"
              role="region"
              class="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
              :style="{ gridTemplateRows: selected === u.id ? '1fr' : '0fr' }"
              :inert="selected !== u.id"
            >
              <div class="min-h-0 overflow-hidden">
                <div class="mt-2 border-2 border-ink bg-white p-4 sm:p-6">
                  <OrgSheet :sheet="sheetOf(u.id)" />
                </div>
              </div>
            </div>
          </li>
        </ul>

        <!-- Fiche d'unité : grand écran -->
        <div class="mt-10 hidden border border-ink bg-white xl:grid xl:grid-cols-[0.7rem_minmax(0,1fr)]" aria-live="polite">
          <span class="bg-green"></span>
          <Transition name="swap" mode="out-in">
            <div :key="selected ?? 'dsi'" class="p-8">
              <OrgSheet :sheet="wideSheet" />
            </div>
          </Transition>
        </div>

        <p class="mt-5 text-sm text-ink-soft">
          Responsables, photos et e-mails : données fictives, à remplacer.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.swap-enter-active,
.swap-leave-active {
  transition: opacity 0.18s ease;
}
.swap-enter-from,
.swap-leave-to {
  opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  .swap-enter-active,
  .swap-leave-active {
    transition: none;
  }
}
</style>
