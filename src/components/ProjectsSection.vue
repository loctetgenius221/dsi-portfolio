<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  IconArrowLeft,
  IconArrowRight,
  IconPlayerPause,
  IconPlayerPlay,
} from '@tabler/icons-vue'
import { projects } from '@/data/dsi'
import type { Project } from '@/data/dsi'
import Pending from './Pending.vue'

// Fiche projet standard demandée par le client : cinq rubriques courtes
const fields: { key: keyof Omit<Project, 'name'>; label: string }[] = [
  { key: 'problem', label: 'Problème' },
  { key: 'solution', label: 'Solution' },
  { key: 'audience', label: 'Public' },
  { key: 'status', label: 'Avancement' },
  { key: 'impact', label: 'Impact' },
]

/* ── Slider infini ───────────────────────────────────────────────
   La liste est rendue trois fois ; on se déplace dans la copie du milieu
   et, à la fin de chaque transition, on se recale sans animation sur la
   copie du milieu : le défilement paraît sans fin dans les deux sens.
   Défilement automatique toutes les 5 s, avec bouton pause (WCAG 2.2.2) ;
   il s'interrompt au survol, au focus clavier, hors écran et onglet masqué,
   et ne démarre pas si l'utilisateur a demandé à réduire les animations. */
const N = projects.length
const slides = [...projects, ...projects, ...projects].map((p, k) => ({
  p,
  k,
  real: k >= N && k < 2 * N,
  n: (k % N) + 1,
}))

const INTERVAL = 5000
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
function onDown(e: PointerEvent) {
  dragging = true
  startX = e.clientX
  // Garde le suivi du geste même si le doigt sort de la zone
  ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
}
function onUp(e: PointerEvent) {
  if (!dragging) return
  dragging = false
  const dx = e.clientX - startX
  if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
}

/* Défilement automatique */
let timer: number | undefined
function tick() {
  if (playing.value && !hovered.value && !focused.value && visible.value && !document.hidden) go(1)
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
    class="overflow-hidden py-16 sm:py-24 lg:py-28"
    aria-roledescription="carrousel"
    aria-labelledby="realisations-title"
    @pointerenter="(e: PointerEvent) => e.pointerType === 'mouse' && (hovered = true)"
    @pointerleave="hovered = false"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <div class="wrap">
      <div v-reveal class="grid gap-6 lg:grid-cols-12">
        <h2 id="realisations-title" class="h2 lg:col-span-7">Les réalisations de la DSI.</h2>
        <p class="max-w-md leading-relaxed text-ink-soft lg:col-span-4 lg:col-start-9 lg:self-end">
          Chaque projet en cinq points : le problème traité, la solution apportée, le public
          concerné, l’état d’avancement et l’impact mesuré.
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
            <component :is="playing ? IconPlayerPause : IconPlayerPlay" size="20" stroke="2" aria-hidden="true" />
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

      <div class="-mr-2 mt-5 touch-pan-y select-none overflow-hidden pr-2" @pointerdown="onDown" @pointerup="onUp" @pointercancel="dragging = false">
        <div
          id="realisations-track"
          ref="track"
          class="flex gap-5 pb-4 pt-1"
          :class="animated ? 'transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]' : ''"
          :style="{ transform: `translateX(${-index * step}px)` }"
          @transitionend.self="settle"
        >
          <div
            v-for="s in slides"
            :key="s.k"
            class="flex w-[86%] shrink-0 flex-col border-2 border-ink bg-white transition-shadow duration-300 hover:shadow-[6px_6px_0_var(--color-green)] sm:w-[calc((100%-1.25rem)/2)] xl:w-[calc((100%-2.5rem)/3)]"
            :role="s.real ? 'group' : undefined"
            :aria-roledescription="s.real ? 'diapositive' : undefined"
            :aria-label="s.real ? `${s.n} sur ${N} : ${s.p.name}` : undefined"
            :aria-hidden="s.real ? undefined : 'true'"
          >
            <span class="h-1.5 bg-green" aria-hidden="true"></span>
            <div class="p-6 sm:p-7">
              <div class="flex items-baseline justify-between gap-3">
                <h3 class="display text-[1.6rem] leading-tight text-ink">{{ s.p.name }}</h3>
                <span class="display text-xl text-green-deep" aria-hidden="true">{{
                  String(s.n).padStart(2, '0')
                }}</span>
              </div>
              <dl class="mt-5 divide-y divide-rule border-t border-rule">
                <div
                  v-for="f in fields"
                  :key="f.key"
                  class="grid gap-1 py-3 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-3"
                >
                  <dt class="text-sm font-semibold text-ink-soft">{{ f.label }}</dt>
                  <dd class="min-w-0 leading-snug">
                    <template v-if="s.p[f.key]">{{ s.p[f.key] }}</template>
                    <Pending v-else />
                  </dd>
                </div>
              </dl>
            </div>
          </div>
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

      <p class="mt-6 text-sm text-ink-soft">
        Informations publiées après validation par la hiérarchie.
      </p>
    </div>
  </section>
</template>
