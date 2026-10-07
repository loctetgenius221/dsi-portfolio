<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { animate, inView, stagger } from 'motion'
import { divisions } from '@/data/dsi'

const active = defineModel<string | null>('active', { default: null })

const CX = 320
const A = 230 // demi-largeur de la dalle
const H = A / 2 // demi-hauteur du losange (projection 2:1)
const T = 28 // épaisseur
const GAP = 118
const BASE = 612

function shade(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16)
  const f = (c: number) => Math.round(c * (1 - amount))
  const r = f((n >> 16) & 255)
  const g = f((n >> 8) & 255)
  const b = f(n & 255)
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`
}

const slabs = computed(() =>
  [...divisions]
    .sort((a, b) => a.layer - b.layer)
    .map((d) => {
      const cy = BASE - d.layer * GAP
      const top = `${CX},${cy - H} ${CX + A},${cy} ${CX},${cy + H} ${CX - A},${cy}`
      const left = `${CX - A},${cy} ${CX},${cy + H} ${CX},${cy + H + T} ${CX - A},${cy + T}`
      const right = `${CX},${cy + H} ${CX + A},${cy} ${CX + A},${cy + T} ${CX},${cy + H + T}`
      // Quadrillage de la face supérieure (technique, discret)
      const lines: string[] = []
      for (let k = 1; k < 6; k++) {
        const f = k / 6
        // parallèles à l'axe L→T : de (T→R) vers (L→B)
        lines.push(`M${CX + A * f} ${cy - H + H * f} L${CX - A + A * f} ${cy + H * f}`)
        // parallèles à l'axe T→R : de (L→T) vers (B→R)
        lines.push(`M${CX - A + A * f} ${cy - H * f} L${CX + A * f} ${cy + H - H * f}`)
      }
      return {
        ...d,
        cy,
        top,
        left,
        right,
        grid: lines.join(' '),
        cLeft: shade(d.swatch, 0.16),
        cRight: shade(d.swatch, 0.3),
      }
    }),
)

const assembly = ref<SVGGElement | null>(null)

// Repères (traits + noms) à droite de la pile ; sur petit écran, la légende reste sous l'illustration
const VB_H = 770
const VB_W_WIDE = 1000
const LABEL_X = CX + A + 90
const wide = ref(true)

// Sélection : clic, appui ou clavier (Entrée/Espace) fixent la couche ; un second la libère.
// Le survol à la souris n'est qu'un aperçu qui revient ensuite à la couche sélectionnée.
const pinned = ref<string | null>(null)
let hovering = false
let touring = false
watch(active, (v) => {
  // Sélection faite ailleurs (légende mobile) : on la garde comme sélection
  if (!hovering && !touring) pinned.value = v
})
function hover(e: PointerEvent, id: string | null) {
  if (e.pointerType !== 'mouse') return
  stopTour()
  hovering = id !== null
  active.value = id ?? pinned.value
}
function select(id: string) {
  stopTour()
  hovering = false
  pinned.value = pinned.value === id ? null : id
  active.value = pinned.value
}

/* Visite guidée : une seule fois, à la première apparition, chaque couche s'allume
   brièvement du sommet au socle (moins de 5 s). Toute interaction l'interrompt. */
const root = ref<HTMLElement | null>(null)
let timers: number[] = []
let stopView: (() => void) | undefined
function stopTour() {
  window.removeEventListener('pointerdown', stopTour)
  window.removeEventListener('keydown', stopTour)
  if (!touring && !timers.length) return
  timers.forEach((t) => clearTimeout(t))
  timers = []
  if (touring) {
    touring = false
    active.value = pinned.value
  }
}
function startTour() {
  // Toute interaction sur la page (y compris la légende mobile) interrompt la visite
  window.addEventListener('pointerdown', stopTour, { once: true })
  window.addEventListener('keydown', stopTour, { once: true })
  const order = [...slabs.value].sort((a, b) => b.layer - a.layer).map((s) => s.id)
  touring = true
  order.forEach((id, i) => timers.push(window.setTimeout(() => (active.value = id), i * 750)))
  timers.push(
    window.setTimeout(() => {
      touring = false
      timers = []
      active.value = pinned.value
    }, order.length * 750),
  )
}
onBeforeUnmount(() => {
  stopTour()
  stopView?.()
})

onMounted(() => {
  if (root.value && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    stopView = inView(
      root.value,
      () => {
        // Laisse l'animation d'ouverture se terminer avant la visite ; une interaction l'annule
        window.addEventListener('pointerdown', stopTour, { once: true })
        window.addEventListener('keydown', stopTour, { once: true })
        timers.push(window.setTimeout(startTour, 2200))
        stopView?.()
      },
      { amount: 0.6 },
    )
  }
  const mq = window.matchMedia('(min-width: 640px)')
  wide.value = mq.matches
  mq.addEventListener('change', (e) => (wide.value = e.matches))

  if (!assembly.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const els = assembly.value.querySelectorAll<SVGGElement>('[data-slab]')
  els.forEach((el) => {
    const layer = Number(el.dataset.layer)
    el.style.transform = `translateY(${layer * GAP * 0.86}px)`
    el.style.opacity = '0'
  })
  // Une seule séquence d'ouverture : les couches se déploient depuis le socle
  animate(els, { opacity: 1 }, { duration: 0.4, delay: stagger(0.08) })
  els.forEach((el) => {
    const layer = Number(el.dataset.layer)
    animate(
      el,
      { transform: [`translateY(${layer * GAP * 0.86}px)`, 'translateY(0px)'] },
      { duration: 1.3, delay: 0.5 + layer * 0.09, ease: [0.22, 1, 0.36, 1] },
    )
  })
})
</script>

<template>
  <div ref="root" class="relative">
    <svg
      :viewBox="`0 0 ${wide ? VB_W_WIDE : 640} ${VB_H}`"
      class="h-auto w-full"
      aria-hidden="true"
    >
      <!-- Emprise au sol et axe vertical -->
      <polygon
        :points="`${CX},${BASE + H - 60} ${CX + A + 50},${BASE + 28 + 0} ${CX},${BASE + H + 28 + 40} ${CX - A - 50},${BASE + 28}`"
        fill="none"
        stroke="#141414"
        stroke-opacity="0.35"
        stroke-dasharray="4 6"
      />
      <line
        :x1="CX"
        :x2="CX"
        y1="40"
        :y2="BASE + H + 40"
        stroke="#141414"
        stroke-opacity="0.4"
        stroke-dasharray="2 6"
      />

      <g ref="assembly">
        <g v-for="s in slabs" :key="s.id" data-slab :data-layer="s.layer">
          <g
            class="cursor-pointer"
            :style="{
              transform: active === s.id ? 'translateY(-20px)' : 'translateY(0)',
              opacity: active && active !== s.id ? 0.35 : 1,
              transition: 'transform .5s cubic-bezier(.22,1,.36,1), opacity .35s ease',
            }"
            @pointerenter="hover($event, s.id)"
            @pointerleave="hover($event, null)"
            @click="select(s.id)"
          >
            <g stroke="#141414" stroke-width="1.6" stroke-linejoin="round">
              <polygon :points="s.left" :fill="s.cLeft" />
              <polygon :points="s.right" :fill="s.cRight" />
              <polygon :points="s.top" :fill="s.swatch" />
            </g>
            <path
              :d="s.grid"
              :stroke="s.darkText ? '#141414' : '#ffffff'"
              stroke-opacity="0.22"
              stroke-width="1"
              fill="none"
            />

            <!-- Trait de repère vers le nom de la couche -->
            <g v-if="wide">
              <line
                :x1="CX + A"
                :x2="LABEL_X - 10"
                :y1="s.cy + T / 2"
                :y2="s.cy + T / 2"
                stroke="#141414"
                stroke-width="1.6"
                stroke-dasharray="3 5"
                :stroke-opacity="active === s.id ? 1 : 0.55"
              />
              <circle
                :cx="CX + A"
                :cy="s.cy + T / 2"
                r="5"
                :fill="s.swatch"
                stroke="#141414"
                stroke-width="1.6"
              />
            </g>

            <!-- Signal de sécurité sur le socle -->
            <template v-if="s.layer === 0">
              <ellipse
                class="pulse"
                :cx="CX + A * 0.42"
                :cy="s.cy + 4"
                rx="12"
                ry="6"
                fill="none"
                stroke="#ffffff"
                stroke-width="2"
              />
              <ellipse
                :cx="CX + A * 0.42"
                :cy="s.cy + 4"
                rx="9"
                ry="4.5"
                fill="var(--color-red)"
                stroke="#141414"
                stroke-width="1.4"
              />
            </template>
          </g>
        </g>
      </g>
    </svg>

    <!-- Noms des couches, alignés sur les traits de repère -->
    <template v-if="wide">
      <button
        v-for="s in slabs"
        :key="`label-${s.id}`"
        class="absolute max-w-[41%] border-l-[5px] py-0.5 pl-3 text-left text-[0.95rem] font-semibold leading-snug transition-all duration-500"
        :style="{
          left: `${(LABEL_X / VB_W_WIDE) * 100}%`,
          top: `${((s.cy + T / 2) / VB_H) * 100}%`,
          borderColor: s.swatch,
          transform: `translateY(calc(-50% - ${active === s.id ? 20 * 0.57 : 0}px))`,
          opacity: active && active !== s.id ? 0.4 : 1,
        }"
        type="button"
        :aria-pressed="pinned === s.id"
        @pointerenter="hover($event, s.id)"
        @pointerleave="hover($event, null)"
        @click="select(s.id)"
      >
        {{ s.short }}
      </button>
    </template>
  </div>
</template>

<style scoped>
.pulse {
  transform-box: fill-box;
  transform-origin: center;
  animation: pulse 2.8s ease-out infinite;
}
@keyframes pulse {
  from {
    transform: scale(0.7);
    opacity: 0.9;
  }
  to {
    transform: scale(2.4);
    opacity: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .pulse {
    animation: none;
  }
}
</style>
