<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { animate, inView, stagger } from 'motion'
import { IconArrowRight, IconChevronDown, IconX } from '@tabler/icons-vue'
import { adminBureau, divisions, heads, unitDetails } from '@/data/dsi'
import Avatar from './Avatar.vue'
import HandNote from './HandNote.vue'
import OrgSheet from './OrgSheet.vue'
import type { Sheet } from './OrgSheet.vue'

// Le vert est la seule couleur de l'organigramme
const GREEN = '#009454'

const chart = ref<HTMLElement | null>(null)

// Grand écran (≥ 1280 px) : arbre horizontal, la fiche s'ouvre dans un volet latéral.
// Petit écran : liste verticale, la fiche se déplie sous l'unité sélectionnée.
const WIDE = '(min-width: 1280px)'
const wide = ref(typeof window !== 'undefined' && window.matchMedia(WIDE).matches)
const selected = ref<string | null>(null)

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

function bureauxLabel(n: number) {
  return `${n} bureau${n > 1 ? 'x' : ''}`
}

function sheetOf(id: string): Sheet {
  if (id === 'dsi') {
    return {
      ...dsiInfo,
      parent: 'Secrétariat général',
      composition: '5 divisions et 1 bureau administratif et financier',
      bureaux: [],
      hasBureaux: false,
      person: heads.dsi!,
      color: GREEN,
      details: unitDetails.dsi!,
    }
  }
  const u = units.find((x) => x.id === id) ?? units[0]!
  return {
    name: u.name,
    role: u.role,
    parent: "Direction des Systèmes d'Information",
    composition: u.bureaux.length
      ? bureauxLabel(u.bureaux.length)
      : u.kind === 'Bureau'
        ? 'Sans objet'
        : 'À préciser',
    bureaux: u.bureaux.map((b) => b.name),
    hasBureaux: u.kind === 'Division',
    person: heads[u.id]!,
    color: GREEN,
    details: unitDetails[u.id]!,
  }
}

/* ── Chemin allumé : de la Direction jusqu'à l'unité survolée ou ouverte ── */
const hovered = ref<string | null>(null)
const activeIdx = computed(() => units.findIndex((u) => u.id === (hovered.value ?? selected.value)))
// Grand écran : la barre horizontale part du centre (entre la 3e et la 4e unité)
const MID = units.length / 2
const lit = {
  trunk: () => activeIdx.value >= 0,
  drop: (j: number) => j === activeIdx.value,
  // Demi-barres à gauche et à droite du centre de chaque carte
  left: (j: number) => {
    const a = activeIdx.value
    if (a < 0) return false
    return a >= MID ? j >= MID && j <= a : j > a && j < MID
  },
  right: (j: number) => {
    const a = activeIdx.value
    if (a < 0) return false
    return a >= MID ? j >= MID && j < a : j >= a && j < MID
  },
  // Petit écran : tronc vertical (au-dessus et au-dessous de chaque branche) et branche
  above: (j: number) => activeIdx.value >= 0 && j <= activeIdx.value,
  below: (j: number) => activeIdx.value >= 0 && j < activeIdx.value,
}
const tone = (on: boolean) => (on ? 'bg-green' : 'bg-ink')
// Rang d'une demi-barre en partant du centre : sert au tracé qui s'ouvre vers les côtés
function sweepOrder(j: number, side: 'left' | 'right') {
  return j < MID
    ? (MID - 1 - j) * 2 + (side === 'right' ? 0 : 1)
    : (j - MID) * 2 + (side === 'left' ? 0 : 1)
}

function kindOf(id: string) {
  return id === 'dsi' ? 'Direction' : (units.find((u) => u.id === id)?.kind ?? '')
}

// Un second appui sur l'unité ouverte la referme
function pick(id: string, e?: Event) {
  if (e?.currentTarget instanceof HTMLElement) trigger = e.currentTarget
  selected.value = selected.value === id ? null : id
}

/* ── Volet latéral (grand écran) ─────────────────────────────── */
const panel = ref<HTMLElement | null>(null)
const closeBtn = ref<HTMLButtonElement | null>(null)
let trigger: HTMLElement | null = null

const panelOpen = ref(false)
watch([selected, wide], ([id, w]) => {
  panelOpen.value = !!id && w
})

watch(panelOpen, async (open) => {
  document.documentElement.style.overflow = open ? 'hidden' : ''
  if (open) {
    await nextTick()
    closeBtn.value?.focus()
  } else {
    trigger?.focus()
  }
})

function closePanel() {
  selected.value = null
}

function onKeydown(e: KeyboardEvent) {
  if (!panelOpen.value) return
  if (e.key === 'Escape') {
    e.preventDefault()
    closePanel()
    return
  }
  // Le focus reste dans le volet tant qu'il est ouvert
  if (e.key === 'Tab' && panel.value) {
    const items = panel.value.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
    const first = items[0]
    const last = items[items.length - 1]
    if (!first || !last) return
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
}

let mq: MediaQueryList | null = null
const onMq = (e: MediaQueryListEvent) => (wide.value = e.matches)

onMounted(() => {
  mq = window.matchMedia(WIDE)
  mq.addEventListener('change', onMq)
  document.addEventListener('keydown', onKeydown)

  if (!chart.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const root = chart.value
  // Le tracé suit la hiérarchie : tutelle, trait, Direction, trait, barre ouverte depuis
  // le centre, descentes, puis les unités (data-line / data-node = étape du tracé)
  const lines = Array.from(root.querySelectorAll<HTMLElement>('[data-line]'))
  const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-node]'))
  const at = (els: HTMLElement[], step: string) =>
    els.filter((e) => e.dataset[e.hasAttribute('data-line') ? 'line' : 'node'] === step)
  lines.forEach((l) => (l.style.transform = 'scale(0)'))
  nodes.forEach((n) => (n.style.opacity = '0'))
  const ease = [0.22, 1, 0.36, 1] as const
  const draw = (els: HTMLElement[], start: number, duration = 0.35, gap = 0) =>
    animate(
      els,
      { transform: 'scale(1)' },
      { duration, delay: stagger(gap, { startDelay: start }), ease },
    )
  const show = (els: HTMLElement[], start: number, gap = 0) =>
    animate(els, { opacity: 1 }, { duration: 0.5, delay: stagger(gap, { startDelay: start }) })
  inView(
    root,
    () => {
      show(at(nodes, '1'), 0)
      draw(at(lines, '1'), 0.25)
      show(at(nodes, '2'), 0.5)
      draw(at(lines, '2'), 0.8)
      // Barre : chaque moitié démarre quand la précédente (plus proche du centre) se termine
      const SEG = 0.05
      at(lines, '3').forEach((l) =>
        animate(
          l,
          { transform: 'scale(1)' },
          { duration: SEG, delay: 1.05 + Number(l.dataset.order) * SEG, ease: 'linear' },
        ),
      )
      draw(at(lines, '4'), 1.55, 0.3)
      show(at(nodes, '3'), 1.65, 0.06)
    },
    { amount: 0.1 },
  )
})

onBeforeUnmount(() => {
  mq?.removeEventListener('change', onMq)
  document.removeEventListener('keydown', onKeydown)
  document.documentElement.style.overflow = ''
})
</script>

<template>
  <section
    id="organisation"
    class="grid-paper relative section-y section-pt-tight section-pb-tight"
  >
    <div
      class="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,white,transparent_20%,transparent_80%,white)]"
    ></div>
    <div class="wrap relative">
      <div v-reveal>
        <h2 class="h2">Organigramme de la Direction.</h2>
        <p class="mt-4 max-w-2xl leading-relaxed text-ink-soft">
          Rattachée au Secrétariat général, la DSI compte cinq divisions et un bureau. Sélectionnez
          une unité pour consulter sa fiche.
        </p>
      </div>

      <div ref="chart" class="relative mt-12 sm:mt-16">
        <div class="absolute left-0 top-[12.5rem] hidden xl:block">
          <HandNote text="Sélectionnez une division" class="hint-hover" />
        </div>

        <!-- Niveau 1 : tutelle -->
        <div class="flex flex-col items-center">
          <div
            data-node="1"
            class="w-full bg-ink px-6 py-3.5 text-center text-white sm:w-auto sm:min-w-80 sm:px-10"
          >
            <p class="text-sm font-semibold text-white/80">Tutelle</p>
            <p class="display text-xl sm:text-2xl">Secrétariat général</p>
          </div>
          <i data-line="1" class="h-8 w-0.5 origin-top bg-ink"></i>

          <!-- Niveau 2 : direction -->
          <button
            data-node="2"
            type="button"
            class="relative w-full max-w-none border-2 border-ink bg-green-deep px-5 pb-4 pt-4 text-center text-white transition-shadow sm:px-8 xl:max-w-md"
            :class="selected === 'dsi' ? 'shadow-[6px_6px_0_var(--color-ink)]' : ''"
            :aria-expanded="wide ? undefined : selected === 'dsi'"
            :aria-controls="wide ? undefined : 'org-a-dsi'"
            :aria-haspopup="wide ? 'dialog' : undefined"
            @click="pick('dsi', $event)"
          >
            <span class="block text-sm font-semibold text-white/90">Direction</span>
            <span class="display mt-0.5 block text-[1.35rem] leading-tight sm:text-2xl"
              >Direction des Systèmes d'Information</span
            >
            <span
              class="mt-4 flex items-center justify-center gap-3 border-t border-white/35 pt-3.5"
            >
              <span class="shrink-0 rounded-full ring-2 ring-white"
                ><Avatar :person="heads.dsi!" :size="40" :color="GREEN"
              /></span>
              <span class="min-w-0 text-left leading-tight">
                <span v-if="heads.dsi!.name" class="block text-[0.95rem] font-semibold">
                  {{ heads.dsi!.name }}
                </span>
                <span class="text-sm">{{ heads.dsi!.title }}</span>
              </span>
              <IconChevronDown
                size="22"
                stroke="2"
                class="ml-auto shrink-0 transition-transform duration-300 xl:hidden"
                :class="selected === 'dsi' ? 'rotate-180' : ''"
                aria-hidden="true"
              />
              <IconArrowRight
                size="20"
                stroke="2"
                class="hidden shrink-0 xl:block"
                aria-hidden="true"
              />
            </span>
          </button>
          <i
            data-line="2"
            class="hidden h-8 w-0.5 origin-top transition-colors duration-300 xl:block"
            :class="tone(lit.trunk())"
          ></i>
        </div>

        <!-- Fiche de la DSI, sous le noeud (petits écrans) -->
        <div
          id="org-a-dsi"
          role="region"
          aria-label="Fiche de la Direction des Systèmes d'Information"
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
        <i
          data-line="2"
          class="ml-3 block h-6 w-0.5 origin-top transition-colors duration-300 sm:ml-5 xl:hidden"
          :class="tone(lit.trunk())"
        ></i>

        <!-- Niveau 3 : arbre horizontal (xl) -->
        <ul class="hidden xl:grid xl:grid-cols-6 xl:gap-4">
          <li v-for="(u, i) in units" :key="u.id" class="relative pt-8">
            <!-- Barre horizontale, en deux moitiés de part et d'autre de la carte -->
            <i
              v-if="i > 0"
              data-line="3"
              :data-order="sweepOrder(i, 'left')"
              class="absolute -left-2 right-1/2 top-0 h-0.5 transition-colors duration-300"
              :class="[tone(lit.left(i)), i < MID ? 'origin-right' : 'origin-left']"
            ></i>
            <i
              v-if="i < units.length - 1"
              data-line="3"
              :data-order="sweepOrder(i, 'right')"
              class="absolute left-1/2 -right-2 top-0 h-0.5 transition-colors duration-300"
              :class="[tone(lit.right(i)), i < MID ? 'origin-right' : 'origin-left']"
            ></i>
            <i
              data-line="4"
              class="absolute left-1/2 top-0 h-8 w-0.5 -translate-x-1/2 origin-top transition-colors duration-300"
              :class="tone(lit.drop(i))"
            ></i>
            <button
              data-node="3"
              type="button"
              class="group relative flex h-64 w-full flex-col items-start border-2 border-ink bg-white px-4 pb-4 pt-5 text-left text-ink transition-all duration-200 hover:-translate-y-0.5"
              :class="
                selected === u.id
                  ? 'shadow-[6px_6px_0_var(--color-green)]'
                  : 'hover:shadow-[4px_4px_0_var(--color-ink)]'
              "
              aria-haspopup="dialog"
              @click="pick(u.id, $event)"
              @pointerenter="hovered = u.id"
              @pointerleave="hovered = null"
              @focus="hovered = u.id"
              @blur="hovered = null"
            >
              <span class="absolute inset-x-0 top-0 h-1.5 bg-green"></span>
              <span class="text-sm font-semibold text-ink-soft">{{ u.kind }}</span>
              <span class="display mt-1 text-[1.2rem] leading-[1.15]">{{ u.label }}</span>
              <span
                v-if="u.bureaux.length"
                class="mt-2 border border-dashed border-ink/60 px-2 py-0.5 text-xs font-semibold"
                >{{ bureauxLabel(u.bureaux.length) }}</span
              >
              <span class="mt-auto flex w-full items-center gap-2.5 border-t border-ink/15 pt-3.5">
                <span class="shrink-0 rounded-full ring-2 ring-ink"
                  ><Avatar :person="heads[u.id]!" :size="40" :color="GREEN"
                /></span>
                <span class="min-w-0 flex-1 leading-tight">
                  <span v-if="heads[u.id]!.name" class="block text-[0.85rem] font-semibold">
                    {{ heads[u.id]!.name }}
                  </span>
                  <span class="block text-xs text-ink-soft">{{ heads[u.id]!.title }}</span>
                </span>
                <IconArrowRight
                  size="18"
                  stroke="2"
                  class="shrink-0 text-green-deep"
                  aria-hidden="true"
                />
              </span>
            </button>
          </li>
        </ul>

        <!-- Niveau 3 : liste verticale avec fiche dépliable (< xl) -->
        <ul class="relative ml-3 space-y-3 pl-5 sm:ml-5 sm:pl-7 xl:hidden">
          <li v-for="(u, i) in units" :key="u.id" class="relative">
            <!-- Tronc vertical : au-dessus puis au-dessous de la branche, et la branche -->
            <i
              data-line="3"
              :data-order="i * 2"
              class="absolute -left-5 -top-3 h-[2.75rem] w-0.5 origin-top transition-colors duration-300 sm:-left-7"
              :class="tone(lit.above(i))"
            ></i>
            <i
              v-if="i < units.length - 1"
              data-line="3"
              :data-order="i * 2 + 1"
              class="absolute -bottom-3 -left-5 top-8 w-0.5 origin-top transition-colors duration-300 sm:-left-7"
              :class="tone(lit.below(i))"
            ></i>
            <i
              data-line="4"
              class="absolute -left-5 top-8 h-0.5 w-5 origin-left transition-colors duration-300 sm:-left-7 sm:w-7"
              :class="tone(lit.drop(i))"
            ></i>
            <button
              data-node="3"
              type="button"
              class="relative flex min-h-18 w-full items-center gap-3 border-2 border-ink bg-white py-3 pl-5 pr-3.5 text-left text-ink transition-colors duration-200 sm:gap-4 sm:pl-6 sm:pr-5"
              :class="selected === u.id ? 'bg-paper-2' : ''"
              :aria-expanded="selected === u.id"
              :aria-controls="`org-a-${u.id}`"
              @click="pick(u.id, $event)"
              @pointerenter="hovered = u.id"
              @pointerleave="hovered = null"
              @focus="hovered = u.id"
              @blur="hovered = null"
            >
              <span class="absolute inset-y-0 left-0 w-1.5 bg-green"></span>
              <span class="shrink-0 rounded-full ring-2 ring-ink"
                ><Avatar :person="heads[u.id]!" :size="48" :color="GREEN"
              /></span>
              <span class="min-w-0 flex-1 leading-tight">
                <span class="block text-xs font-semibold text-ink-soft"
                  >{{ u.kind
                  }}<template v-if="u.bureaux.length">
                    · {{ bureauxLabel(u.bureaux.length) }}</template
                  ></span
                >
                <span class="display mt-0.5 block text-[1.15rem] leading-[1.15] sm:text-[1.3rem]">{{
                  u.label
                }}</span>
                <span class="mt-1 block truncate text-[0.82rem] text-ink-soft">{{
                  heads[u.id]!.name ?? heads[u.id]!.title
                }}</span>
              </span>
              <span
                class="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-ink transition-colors"
                :class="selected === u.id ? 'bg-ink text-white' : 'bg-white'"
              >
                <IconChevronDown
                  size="20"
                  stroke="2"
                  class="transition-transform duration-300"
                  :class="selected === u.id ? 'rotate-180' : ''"
                  aria-hidden="true"
                />
              </span>
            </button>
            <div
              :id="`org-a-${u.id}`"
              role="region"
              :aria-label="`Fiche : ${u.name}`"
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
      </div>
    </div>

    <!-- Volet latéral (grand écran) -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="panelOpen"
          class="fixed inset-0 z-40 bg-ink/40"
          aria-hidden="true"
          @click="closePanel"
        ></div>
      </Transition>
      <Transition name="slide">
        <div
          v-if="panelOpen && selected"
          ref="panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="org-panel-title"
          class="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l-2 border-ink bg-white"
        >
          <div class="flex items-center justify-between gap-4 border-b-2 border-ink px-8 py-5">
            <p id="org-panel-title" class="font-semibold">
              <span class="text-ink-soft">Fiche · </span>{{ kindOf(selected) }}
            </p>
            <button
              ref="closeBtn"
              type="button"
              class="grid h-11 w-11 place-items-center rounded-full border-2 border-ink transition-colors hover:bg-ink hover:text-white"
              aria-label="Fermer la fiche"
              @click="closePanel"
            >
              <IconX size="20" stroke="2" aria-hidden="true" />
            </button>
          </div>
          <span class="h-1.5 shrink-0 bg-green"></span>
          <div class="flex-1 overflow-y-auto px-8 py-7">
            <OrgSheet :sheet="sheetOf(selected)" />
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active,
  .slide-enter-active,
  .slide-leave-active {
    transition: none;
  }
}
</style>
