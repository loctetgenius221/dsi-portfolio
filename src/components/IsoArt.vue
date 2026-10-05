<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { animate, inView } from 'motion'
import type { ArtKind } from '@/data/dsi'

// mono : version sobre (blanc, gris, encre) ; live : animations d'illustration en continu
const props = withDefaults(defineProps<{ kind: ArtKind; scale?: number; mono?: boolean; live?: boolean }>(), { scale: 1, mono: false, live: false })

const G = '#009454'
const Y = '#ffcc34'
const R = '#f43438'
const W = '#ffffff'
const INK = '#141414'

// Palette sobre : les couleurs de marque deviennent blanc / gris clair, l'encre porte les accents
const MONO: Record<string, string> = { [G]: '#ffffff', [Y]: '#efefeb', [R]: '#d9d9d4' }

const S = 22 // pixels par unité du monde
const K = 0.866

type Pt = [number, number, number]
type Item =
  | { t: 'box'; x: number; y: number; z: number; w: number; d: number; h: number; c: string }
  | { t: 'cyl'; x: number; y: number; z: number; r: number; h: number; c: string }
  | { t: 'sph'; x: number; y: number; z: number; r: number; c: string }
  | { t: 'cone'; x: number; y: number; z: number; r: number; h: number; c: string }
  | { t: 'line'; pts: Pt[]; c: string; sw: number; flow?: boolean }
  | { t: 'face'; x: number; y: number; z: number; d: string; stroke: string; fill: string; sw: number }
  | { t: 'ring'; x: number; y: number; z: number; r: number; orbit?: string }
  | { t: 'hop'; pts: Pt[]; r: number }
  | { t: 'pulse'; pts: Pt[]; begin: number }

function shade(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16)
  const f = (c: number) => Math.round(c * (1 - amount))
  return `#${((1 << 24) | (f((n >> 16) & 255) << 16) | (f((n >> 8) & 255) << 8) | f(n & 255)).toString(16).slice(1)}`
}

const scenes: Record<ArtKind, Item[]> = {
  steps: [
    { t: 'box', x: 0, y: 0, z: 0, w: 2, d: 2, h: 3, c: G },
    { t: 'box', x: 2, y: 0, z: 0, w: 2, d: 2, h: 2, c: Y },
    { t: 'box', x: 4, y: 0, z: 0, w: 2, d: 2, h: 1, c: R },
    { t: 'hop', pts: [[5, 1, 1.6], [3, 1, 2.6], [1, 1, 3.6]], r: 0.55 },
  ],
  monitor: [
    { t: 'box', x: 1.3, y: 1.0, z: 0, w: 1.4, d: 1.4, h: 0.22, c: W },
    { t: 'box', x: 1.85, y: 1.5, z: 0.22, w: 0.3, d: 0.3, h: 0.8, c: W },
    { t: 'box', x: 0, y: 1.2, z: 1.0, w: 4, d: 0.35, h: 2.6, c: W },
    { t: 'face', x: 0, y: 1.55, z: 1.0, d: 'M0.3 0.3 H3.7 V2.3 H0.3 Z', stroke: INK, fill: G, sw: 1.4 },
    { t: 'face', x: 0, y: 1.55, z: 1.0, d: 'M1.2 1.25 L1.8 0.75 L2.9 1.9', stroke: W, fill: 'none', sw: 4 },
  ],
  bulb: [
    { t: 'cyl', x: 2, y: 2, z: 0, r: 0.95, h: 0.7, c: G },
    { t: 'cyl', x: 2, y: 2, z: 0.7, r: 0.6, h: 0.45, c: W },
    { t: 'sph', x: 2, y: 2, z: 2.1, r: 1.15, c: Y },
    { t: 'line', pts: [[2, 2, 3.7], [2, 2, 4.4]], c: INK, sw: 2.5, flow: true },
    { t: 'line', pts: [[3.7, 2, 3.2], [4.3, 2, 3.6]], c: INK, sw: 2.5, flow: true },
    { t: 'line', pts: [[0.3, 2, 3.2], [-0.3, 2, 3.6]], c: INK, sw: 2.5, flow: true },
  ],
  database: [
    { t: 'cyl', x: 2, y: 2, z: 0, r: 1.5, h: 0.95, c: G },
    { t: 'cyl', x: 2, y: 2, z: 1.15, r: 1.5, h: 0.95, c: Y },
    { t: 'cyl', x: 2, y: 2, z: 2.3, r: 1.5, h: 0.95, c: G },
    { t: 'sph', x: 2.9, y: 2.9, z: 3.35, r: 0.2, c: R },
  ],
  lock: [
    { t: 'box', x: 0, y: 0, z: 0, w: 3, d: 2.2, h: 2.4, c: Y },
    {
      t: 'line',
      pts: Array.from({ length: 13 }, (_, i) => {
        const a = (i / 12) * Math.PI
        return [1.5 + 0.9 * Math.cos(a), 1.1, 2.4 + 1.25 * Math.sin(a)] as Pt
      }),
      c: INK,
      sw: 9,
    },
    {
      t: 'line',
      pts: Array.from({ length: 13 }, (_, i) => {
        const a = (i / 12) * Math.PI
        return [1.5 + 0.9 * Math.cos(a), 1.1, 2.4 + 1.25 * Math.sin(a)] as Pt
      }),
      c: W,
      sw: 4.5,
    },
    { t: 'face', x: 0, y: 2.2, z: 0, d: 'M1.5 1.45 m-0.3 0 a0.3 0.3 0 1 0 0.6 0 a0.3 0.3 0 1 0 -0.6 0 M1.5 1.2 V0.55', stroke: INK, fill: INK, sw: 3 },
  ],
  pawns: [
    { t: 'box', x: 0, y: 0, z: 0, w: 6, d: 4, h: 0.4, c: W },
    { t: 'cone', x: 1.3, y: 1.2, z: 0.4, r: 0.8, h: 1.7, c: G },
    { t: 'sph', x: 1.3, y: 1.2, z: 2.55, r: 0.55, c: G },
    { t: 'cone', x: 3.4, y: 1.0, z: 0.4, r: 0.9, h: 2.3, c: Y },
    { t: 'sph', x: 3.4, y: 1.0, z: 3.25, r: 0.62, c: Y },
    { t: 'cone', x: 4.7, y: 2.7, z: 0.4, r: 0.8, h: 1.7, c: R },
    { t: 'sph', x: 4.7, y: 2.7, z: 2.55, r: 0.55, c: R },
  ],
  network: [
    { t: 'line', pts: [[0.7, 0.7, 0.05], [4.7, 0.7, 0.05]], c: INK, sw: 2.5, flow: true },
    { t: 'line', pts: [[0.7, 0.7, 0.05], [2.7, 4.2, 0.05]], c: INK, sw: 2.5, flow: true },
    { t: 'line', pts: [[4.7, 0.7, 0.05], [2.7, 4.2, 0.05]], c: INK, sw: 2.5, flow: true },
    { t: 'box', x: 0, y: 0, z: 0, w: 1.4, d: 1.4, h: 1.4, c: G },
    { t: 'box', x: 4, y: 0, z: 0, w: 1.4, d: 1.4, h: 1.4, c: Y },
    { t: 'box', x: 2, y: 3.5, z: 0, w: 1.4, d: 1.4, h: 1.4, c: R },
    { t: 'pulse', pts: [[0.7, 0.7, 1.5], [4.7, 0.7, 1.5]], begin: 0 },
    { t: 'pulse', pts: [[4.7, 0.7, 1.5], [2.7, 4.2, 1.5]], begin: 0.8 },
    { t: 'pulse', pts: [[2.7, 4.2, 1.5], [0.7, 0.7, 1.5]], begin: 1.6 },
  ],
  orbit: [
    { t: 'ring', x: 2, y: 2, z: 1.1, r: 3, orbit: Y },
    { t: 'box', x: 1, y: 1, z: 0, w: 2, d: 2, h: 2.2, c: G },
  ],
  sheets: [
    { t: 'box', x: 0, y: 0, z: 0, w: 4, d: 3, h: 0.28, c: W },
    { t: 'box', x: 0.4, y: 0.3, z: 0.28, w: 4, d: 3, h: 0.28, c: W },
    { t: 'box', x: 0.8, y: 0.6, z: 0.56, w: 4, d: 3, h: 0.28, c: G },
    { t: 'box', x: 2.7, y: 1.5, z: 0.84, w: 1.1, d: 1.1, h: 0.4, c: R },
  ],
}

const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

interface Shape {
  tag: string
  attrs: Record<string, string | number>
  flow?: boolean
  orbit?: { path: string; c: string; sx: number; sy: number }
  hop?: { xs: string; ys: string; kt: string; r: number; c: string; x0: number; y0: number }
  pulse?: { path: string; begin: number }
}

const built = computed(() => {
  const shapes: Shape[] = []
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  const P = (x: number, y: number, z: number): [number, number] => [(x - y) * K * S, (x + y) * 0.5 * S - z * S]
  const grow = (p: [number, number], pad = 0) => {
    minX = Math.min(minX, p[0] - pad)
    maxX = Math.max(maxX, p[0] + pad)
    minY = Math.min(minY, p[1] - pad)
    maxY = Math.max(maxY, p[1] + pad)
  }
  const pts = (arr: [number, number][]) => arr.map((p) => p.join(',')).join(' ')
  const tone = (c: string) => (props.mono ? (MONO[c] ?? c) : c)
  const poly = (arr: [number, number][], fill: string) => {
    arr.forEach((p) => grow(p))
    shapes.push({ tag: 'polygon', attrs: { points: pts(arr), fill } })
  }

  for (const it of scenes[props.kind]) {
    if (it.t === 'box') {
      const { x, y, z, w, d, h } = it
      const c = tone(it.c)
      poly([P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)], c)
      poly([P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)], shade(c, 0.14))
      poly([P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)], shade(c, 0.28))
    } else if (it.t === 'cyl' || it.t === 'cone') {
      const [cx, cy] = P(it.x, it.y, it.z)
      const rx = 1.2247 * S * it.r
      const ry = 0.7071 * S * it.r
      const top = cy - it.h * S
      grow([cx - rx, top - ry])
      grow([cx + rx, cy + ry])
      if (it.t === 'cyl') {
        shapes.push({ tag: 'path', attrs: { d: `M${cx - rx} ${top} L${cx - rx} ${cy} A${rx} ${ry} 0 0 0 ${cx + rx} ${cy} L${cx + rx} ${top} Z`, fill: shade(tone(it.c), 0.18) } })
        shapes.push({ tag: 'ellipse', attrs: { cx, cy: top, rx, ry, fill: tone(it.c) } })
      } else {
        shapes.push({ tag: 'path', attrs: { d: `M${cx - rx} ${cy} A${rx} ${ry} 0 0 0 ${cx + rx} ${cy} L${cx} ${top} Z`, fill: shade(tone(it.c), 0.12) } })
      }
    } else if (it.t === 'sph') {
      const [cx, cy] = P(it.x, it.y, it.z)
      const r = 1.0 * S * it.r
      grow([cx - r, cy - r])
      grow([cx + r, cy + r])
      shapes.push({ tag: 'circle', attrs: { cx, cy, r, fill: tone(it.c) } })
      shapes.push({ tag: 'ellipse', attrs: { cx: cx - r * 0.3, cy: cy - r * 0.35, rx: r * 0.28, ry: r * 0.18, fill: '#ffffff', 'fill-opacity': 0.55, stroke: 'none' } })
    } else if (it.t === 'line') {
      const a = it.pts.map((p) => P(p[0], p[1], p[2]))
      a.forEach((p) => grow(p, 4))
      shapes.push({ tag: 'polyline', attrs: { points: pts(a), fill: 'none', stroke: it.c, 'stroke-width': it.sw, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, flow: it.flow })
    } else if (it.t === 'face') {
      const [ox, oy] = P(it.x, it.y, it.z)
      shapes.push({
        tag: 'path',
        attrs: {
          d: it.d,
          transform: `matrix(${K * S} ${0.5 * S} 0 ${-S} ${ox} ${oy})`,
          fill: it.fill,
          stroke: it.stroke,
          'stroke-width': it.sw,
          'vector-effect': 'non-scaling-stroke',
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        },
      })
    } else if (it.t === 'ring') {
      const [cx, cy] = P(it.x, it.y, it.z)
      const rx = 1.2247 * S * it.r
      const ry = 0.7071 * S * it.r
      grow([cx - rx, cy - ry], 10)
      grow([cx + rx, cy + ry], 10)
      shapes.push({ tag: 'ellipse', attrs: { cx, cy, rx, ry, fill: 'none', 'stroke-dasharray': '5 6' } })
      const path = `M${cx - rx} ${cy} a${rx} ${ry} 0 1 0 ${2 * rx} 0 a${rx} ${ry} 0 1 0 ${-2 * rx} 0`
      shapes.push({ tag: 'g', attrs: {}, orbit: { path, c: props.mono ? INK : (it.orbit ?? Y), sx: cx - rx, sy: cy } })
    } else if (it.t === 'hop') {
      // Bille qui gravit les marches : pauses sur chaque marche, bonds entre elles
      const sp = it.pts.map((p) => P(p[0], p[1], p[2]))
      const r = 1.0 * S * it.r
      sp.forEach((p) => {
        grow([p[0] - r, p[1] - r - 18])
        grow([p[0] + r, p[1] + r])
      })
      const xs: number[] = []
      const ys: number[] = []
      sp.forEach((p, i) => {
        xs.push(p[0], p[0])
        ys.push(p[1], p[1])
        const n = sp[i + 1]
        if (n) {
          xs.push((p[0] + n[0]) / 2)
          ys.push(Math.min(p[1], n[1]) - 18)
        }
      })
      xs.push(sp[0]![0])
      ys.push(sp[0]![1])
      const kt = xs.map((_, i) => (i / (xs.length - 1)).toFixed(3)).join(';')
      shapes.push({ tag: 'g', attrs: {}, hop: { xs: xs.join(';'), ys: ys.join(';'), kt, r, c: props.mono ? INK : W, x0: sp[0]![0], y0: sp[0]![1] } })
    } else if (it.t === 'pulse') {
      if (!props.live) continue
      const a = it.pts.map((p) => P(p[0], p[1], p[2]))
      a.forEach((p) => grow(p, 6))
      shapes.push({ tag: 'g', attrs: {}, pulse: { path: `M${a[0]![0]} ${a[0]![1]} L${a[1]![0]} ${a[1]![1]}`, begin: it.begin } })
    }
  }
  const pad = 8
  return { shapes, vb: `${minX - pad} ${minY - pad} ${maxX - minX + pad * 2} ${maxY - minY + pad * 2}`, w: maxX - minX + pad * 2 }
})

const el = ref<SVGSVGElement | null>(null)
onMounted(() => {
  if (!el.value || reduced) return
  const node = el.value
  node.style.opacity = '0'
  inView(
    node,
    () => {
      animate(node, { opacity: [0, 1], transform: ['translateY(22px) scale(0.92)', 'translateY(0px) scale(1)'] }, { duration: 0.8, ease: [0.22, 1, 0.36, 1] })
    },
    { amount: 0.4 },
  )
})
</script>

<template>
  <svg
    ref="el"
    :viewBox="built.vb"
    :style="{ width: `${built.w * props.scale}px`, maxWidth: '100%' }"
    class="h-auto overflow-visible"
    fill="none"
    :stroke="INK"
    stroke-width="1.6"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <template v-for="(s, i) in built.shapes" :key="i">
      <g v-if="s.orbit">
        <circle r="9" :fill="s.orbit.c" :cx="reduced ? s.orbit.sx : 0" :cy="reduced ? s.orbit.sy : 0">
          <animateMotion v-if="!reduced" dur="7s" repeatCount="indefinite" :path="s.orbit.path" />
        </circle>
      </g>
      <g v-else-if="s.hop">
        <circle :r="s.hop.r" :fill="s.hop.c" :cx="s.hop.x0" :cy="s.hop.y0">
          <animate v-if="live && !reduced" attributeName="cx" :values="s.hop.xs" :keyTimes="s.hop.kt" dur="5s" repeatCount="indefinite" />
          <animate v-if="live && !reduced" attributeName="cy" :values="s.hop.ys" :keyTimes="s.hop.kt" dur="5s" repeatCount="indefinite" />
        </circle>
      </g>
      <g v-else-if="s.pulse">
        <circle v-if="live && !reduced" r="4.5" :fill="INK" stroke="#ffffff" stroke-width="1.5">
          <animateMotion :path="s.pulse.path" dur="2.4s" :begin="`${s.pulse.begin}s`" repeatCount="indefinite" />
        </circle>
      </g>
      <component :is="s.tag" v-else v-bind="s.attrs" :class="s.flow ? 'flow' : ''" />
    </template>
  </svg>
</template>

<style scoped>
.flow {
  stroke-dasharray: 2 7;
  animation: flow 1.4s linear infinite;
}
@keyframes flow {
  to {
    stroke-dashoffset: -18;
  }
}
@media (prefers-reduced-motion: reduce) {
  .flow {
    animation: none;
  }
}
</style>
