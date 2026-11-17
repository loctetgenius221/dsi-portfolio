<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { IconArrowLeft, IconArrowRight, IconPlayerPause, IconPlayerPlay } from '@tabler/icons-vue'
import { featuredProjects as projects } from '@/data/dsi'
import type { Project } from '@/data/dsi'
import ProjectCard from './ProjectCard.vue'
import ProjectSheet from './ProjectSheet.vue'

/* Fiche détaillée : volet latéral (plein écran sur mobile) */
const opened = ref<Project | null>(null)
const openedN = ref(0)
function openSheet(p: Project, n: number) {
  if (dragged) return
  opened.value = p
  openedN.value = n
}

/* ── Slider infini ───────────────────────────────────────────────
   La liste est rendue trois fois ; on se déplace dans la copie du milieu
   et, à la fin de chaque transition, on se recale sans animation sur la
   copie du milieu : le défilement paraît sans fin dans les deux sens.
   Défilement automatique toutes les 3 s, avec bouton pause (WCAG 2.2.2) ;
   il s'interrompt au survol d'une carte, au focus clavier, hors écran et onglet masqué,
   et ne démarre pas si l'utilisateur a demandé à réduire les animations. */
const N = projects.length
const slides = [...projects, ...projects, ...projects].map((p, k) => ({
  p,
  k,
  real: k >= N && k < 2 * N,
  n: (k % N) + 1,
}))

const INTERVAL = 3000
const reduce =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const section = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
const index = ref(N) // première fiche de la copie du milieu
const animated = ref(false)
const step = ref(0)
const playing = ref(!reduce)
const hovered = ref(false)
const focused = ref(false)
const visible = ref(false)

const current = computed(() => (((index.value - N) % N) + N) % N)

function measure() {
  const cards = track.value?.children
  if (!cards || cards.length < 2) return
  step.value = (cards[1] as HTMLElement).offsetLeft - (cards[0] as HTMLElement).offsetLeft
}

function go(dir: 1 | -1) {
  if (moving) return
  moving = true
  animated.value = !reduce && step.value > 0
  index.value += dir
  if (!animated.value) settle()
}

let moving = false
// Fin de transition : retour silencieux dans la copie du milieu
function settle() {
  moving = false
  animated.value = false
  if (index.value >= 2 * N) index.value -= N
  else if (index.value < N) index.value += N
}

/* Glisser au doigt ou à la souris */
let startX = 0
let dragging = false
let dragged = false
function onDown(e: PointerEvent) {
  dragging = true
  dragged = false
  startX = e.clientX
  // Garde le suivi du geste même si le doigt sort de la zone (sauf sur un bouton, pour garder son clic)
  if (!(e.target as Element).closest('button, a')) {
    ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
  }
}
function onUp(e: PointerEvent) {
  if (!dragging) return
  dragging = false
  const dx = e.clientX - startX
  if (Math.abs(dx) > 50) {
    dragged = true
    go(dx < 0 ? 1 : -1)
    setTimeout(() => (dragged = false), 0)
  }
}

/* Défilement automatique */
let timer: number | undefined
function tick() {
  if (
    playing.value &&
    !opened.value &&
    !hovered.value &&
    !focused.value &&
    visible.value &&
    !document.hidden
  )
    go(1)
}
// Pause au survol d'une carte à la souris (pas sur le reste de la section)
function onCardEnter(e: PointerEvent) {
  if (e.pointerType === 'mouse') hovered.value = true
}
// Pause seulement pour le focus clavier (un appui au doigt ne doit pas figer le slider)
function onFocusIn(e: FocusEvent) {
  focused.value = (e.target as Element).matches(':focus-visible')
}
function onFocusOut(e: FocusEvent) {
  if (!section.value?.contains(e.relatedTarget as Node)) focused.value = false
}

let ro: ResizeObserver | null = null
let io: IntersectionObserver | null = null
onMounted(() => {
  measure()
  ro = new ResizeObserver(measure)
  if (track.value) ro.observe(track.value)
  io = new IntersectionObserver(([entry]) => (visible.value = !!entry?.isIntersecting), {
    threshold: 0.3,
  })
  if (section.value) io.observe(section.value)
  timer = window.setInterval(tick, INTERVAL)
})
onBeforeUnmount(() => {
  ro?.disconnect()
  io?.disconnect()
  clearInterval(timer)
})
</script>

<template>
  <section
    id="realisations"
    ref="section"
    class="overflow-hidden section-y section-pb-tight"
    aria-roledescription="carrousel"
    aria-labelledby="realisations-title"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <div class="wrap">
      <div v-reveal>
        <h2 id="realisations-title" class="h2">Les réalisations de la DSI.</h2>
        <p class="mt-4 max-w-2xl leading-relaxed text-ink-soft">
          Une sélection de projets phares portés par la DSI. Ouvrez une fiche pour en lire la
          description complète.
        </p>
      </div>

      <!-- Commandes du slider -->
      <div class="mt-10 flex items-center justify-between gap-4">
        <p
          class="text-sm font-semibold tabular-nums text-ink-soft"
          :aria-live="playing ? 'off' : 'polite'"
        >
          Projet {{ current + 1 }} sur {{ N }}
        </p>
        <div class="flex gap-2">
          <button
            type="button"
            class="grid h-12 w-12 place-items-center rounded-full border-2 border-ink bg-white transition-colors hover:bg-ink hover:text-white"
            :aria-label="playing ? 'Mettre en pause le défilement' : 'Reprendre le défilement'"
            @click="playing = !playing"
          >
            <component
              :is="playing ? IconPlayerPause : IconPlayerPlay"
              size="20"
              stroke="2"
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            class="grid h-12 w-12 place-items-center rounded-full border-2 border-ink bg-white transition-colors hover:bg-ink hover:text-white"
            aria-label="Projet précédent"
            aria-controls="realisations-track"
            @click="go(-1)"
          >
            <IconArrowLeft size="20" stroke="2" aria-hidden="true" />
          </button>
          <button
            type="button"
            class="grid h-12 w-12 place-items-center rounded-full border-2 border-ink bg-white transition-colors hover:bg-ink hover:text-white"
            aria-label="Projet suivant"
            aria-controls="realisations-track"
            @click="go(1)"
          >
            <IconArrowRight size="20" stroke="2" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        v-reveal
        class="-mr-2 mt-5 touch-pan-y select-none overflow-hidden pr-2"
        @pointerdown="onDown"
        @pointerup="onUp"
        @pointercancel="dragging = false"
      >
        <div
          id="realisations-track"
          ref="track"
          class="flex gap-5 pb-4 pt-2"
          :class="
            animated ? 'transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]' : ''
          "
          :style="{ transform: `translateX(${-index * step}px)` }"
          @transitionend.self="settle"
        >
          <ProjectCard
            v-for="s in slides"
            :key="s.k"
            :project="s.p"
            :n="s.n"
            :tabbable="s.real"
            class="w-[86%] shrink-0 sm:w-[calc((100%-1.25rem)/2)] xl:w-[calc((100%-2.5rem)/3)]"
            :role="s.real ? 'group' : undefined"
            :aria-roledescription="s.real ? 'diapositive' : undefined"
            :aria-label="s.real ? `${s.n} sur ${N} : ${s.p.name}` : undefined"
            :aria-hidden="s.real ? undefined : 'true'"
            @pointerenter="onCardEnter"
            @pointerleave="hovered = false"
            @open="openSheet(s.p, s.n)"
          />
        </div>
      </div>

      <!-- Indicateur de position -->
      <div class="mt-4 flex gap-1.5" aria-hidden="true">
        <span
          v-for="(p, i) in projects"
          :key="`dot-${p.name}`"
          class="h-1.5 transition-all duration-300"
          :class="i === current ? 'w-8 bg-green' : 'w-3 bg-ink/20'"
        ></span>
      </div>

      <div class="mt-8 flex sm:justify-end">
        <RouterLink
          to="/realisations"
          class="flex min-h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-ink bg-green px-6 py-3 font-semibold text-paper shadow-[4px_4px_0_var(--color-ink)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color-ink)] sm:inline-flex sm:w-auto"
        >
          Voir tous les projets
          <IconArrowRight size="18" stroke="2" aria-hidden="true" />
        </RouterLink>
      </div>
    </div>

    <!-- Fiche projet détaillée -->
    <ProjectSheet :project="opened" :n="openedN" :total="N" @close="opened = null" />
  </section>
</template>
