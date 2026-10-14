<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  IconArrowLeft,
  IconArrowRight,
  IconArrowUpRight,
  IconPlayerPause,
  IconPlayerPlay,
} from '@tabler/icons-vue'
import { MINISTRY_LOGO, projects } from '@/data/dsi'
import type { Project } from '@/data/dsi'
import Pending from './Pending.vue'
import SideDrawer from './SideDrawer.vue'

// Fiche projet standard demandée par le client : cinq rubriques courtes,
// chacune avec la question qu'elle doit traiter (retours du client).
type FieldKey = 'problem' | 'solution' | 'audience' | 'status' | 'impact'
const fields: { key: FieldKey; label: string; hint: string }[] = [
  { key: 'problem', label: 'Problème', hint: 'Quelle était la difficulté au départ ?' },
  { key: 'solution', label: 'Solution', hint: 'Qu’est-ce que la solution a changé ?' },
  { key: 'audience', label: 'Public', hint: 'À qui s’adresse-t-elle ?' },
  { key: 'status', label: 'Avancement', hint: 'En phase de test ou déjà déployée ?' },
  { key: 'impact', label: 'Impact', hint: 'Chiffres clés vérifiés.' },
]

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
    class="overflow-hidden py-16 sm:py-24 lg:py-28"
    aria-roledescription="carrousel"
    aria-labelledby="realisations-title"
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
        class="-mr-2 mt-5 touch-pan-y select-none overflow-hidden pr-2"
        @pointerdown="onDown"
        @pointerup="onUp"
        @pointercancel="dragging = false"
      >
        <div
          id="realisations-track"
          ref="track"
          class="flex gap-5 pb-4 pt-1"
          :class="
            animated ? 'transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]' : ''
          "
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
            @pointerenter="onCardEnter"
            @pointerleave="hovered = false"
          >
            <span class="h-1.5 bg-green" aria-hidden="true"></span>
            <div class="flex flex-1 flex-col p-6 sm:p-7">
              <div class="flex items-start justify-between gap-3">
                <!-- Logo de l'application (à défaut, logo officiel du Ministère) ; décoratif, le nom suit -->
                <span
                  class="block h-16 w-28 border border-rule bg-white p-2"
                  aria-hidden="true"
                >
                  <img
                    :src="s.p.logo ?? MINISTRY_LOGO"
                    alt=""
                    class="h-full w-full object-contain"
                    loading="lazy"
                    draggable="false"
                  />
                </span>
                <span class="display text-xl text-green-deep" aria-hidden="true">{{
                  String(s.n).padStart(2, '0')
                }}</span>
              </div>
              <h3 class="display mt-5 text-[1.6rem] leading-tight text-ink">{{ s.p.name }}</h3>
              <p v-if="s.p.summary" class="mt-2 leading-snug text-ink-soft">{{ s.p.summary }}</p>

              <dl class="mb-6 mt-5 border-t border-rule pt-3 text-sm">
                <dt class="font-semibold text-ink-soft">Avancement</dt>
                <dd class="mt-1">
                  <template v-if="s.p.status">{{ s.p.status }}</template>
                  <Pending v-else />
                </dd>
              </dl>

              <button
                type="button"
                class="mt-auto flex min-h-12 w-full items-center justify-between gap-3 border-2 border-ink px-4 py-2.5 font-semibold transition-colors hover:bg-ink hover:text-white"
                aria-haspopup="dialog"
                :tabindex="s.real ? undefined : -1"
                @click="openSheet(s.p, s.n)"
              >
                Voir la fiche<span class="sr-only"> : {{ s.p.name }}</span>
                <IconArrowRight size="18" stroke="2" aria-hidden="true" />
              </button>
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

    <!-- Fiche projet détaillée -->
    <SideDrawer
      :open="!!opened"
      :label="`Fiche projet : ${opened?.name ?? ''}`"
      @close="opened = null"
    >
      <template #header>
        <span class="text-ink-soft">Fiche projet · </span>{{ String(openedN).padStart(2, '0') }} sur
        {{ N }}
      </template>
      <template v-if="opened">
        <div class="flex items-center gap-4">
          <span
            class="block h-16 w-28 shrink-0 border border-rule bg-white p-2"
            aria-hidden="true"
          >
            <img :src="opened.logo ?? MINISTRY_LOGO" alt="" class="h-full w-full object-contain" />
          </span>
          <p class="display min-w-0 text-[2rem] leading-tight text-ink">{{ opened.name }}</p>
        </div>
        <p v-if="opened.summary" class="mt-2 text-lg leading-snug text-ink-soft">
          {{ opened.summary }}
        </p>
        <a
          v-if="opened.link"
          :href="opened.link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-5 inline-flex min-h-12 items-center gap-2 border-2 border-ink bg-yellow px-4 py-2.5 font-semibold transition-colors hover:bg-ink hover:text-white"
          >{{ opened.link.label }}<span class="sr-only"> (nouvel onglet)</span>
          <IconArrowUpRight size="18" stroke="2" aria-hidden="true"
        /></a>

        <dl class="mt-7 border-t-2 border-ink">
          <div v-for="f in fields" :key="f.key" class="border-b border-rule py-5">
            <dt>
              <span class="text-sm font-bold uppercase tracking-wide text-green-deep">{{
                f.label
              }}</span>
              <span class="mt-0.5 block text-sm text-ink-soft">{{ f.hint }}</span>
            </dt>
            <dd class="mt-2 leading-relaxed">
              <template v-if="opened[f.key]">{{ opened[f.key] }}</template>
              <Pending v-else />
            </dd>
          </div>
        </dl>
        <p class="mt-5 text-sm text-ink-soft">
          Informations publiées après validation par la hiérarchie.
        </p>
      </template>
    </SideDrawer>
  </section>
</template>
