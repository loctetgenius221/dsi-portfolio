import type { Directive } from 'vue'
import { animate, inView, stagger } from 'motion'

/**
 * v-reveal : apparition douce (fondu + léger glissement) quand l'élément entre à l'écran, une seule fois.
 * v-reveal="'stagger'" : anime les enfants directs l'un après l'autre (listes, grilles de cartes).
 * Sans effet si l'utilisateur a demandé à réduire les animations : le contenu reste affiché tel quel.
 */
const stops = new WeakMap<HTMLElement, () => void>()

export const vReveal: Directive<HTMLElement, 'stagger' | undefined> = {
  mounted(el, binding) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const targets = binding.value === 'stagger' ? (Array.from(el.children) as HTMLElement[]) : [el]
    if (!targets.length) return
    targets.forEach((t) => {
      t.style.opacity = '0'
      t.style.transform = 'translateY(18px)'
    })
    const stop = inView(
      el,
      () => {
        animate(
          targets,
          { opacity: 1, transform: 'translateY(0px)' },
          { duration: 0.7, delay: stagger(0.08), ease: [0.22, 1, 0.36, 1] },
        )
      },
      { amount: 0.15 },
    )
    stops.set(el, stop)
  },
  unmounted(el) {
    stops.get(el)?.()
  },
}
