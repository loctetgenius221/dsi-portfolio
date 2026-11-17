import type { Directive } from 'vue'
import { animate, inView, stagger } from 'motion'

/**
 * v-reveal : apparition douce (fondu + léger glissement) quand l'élément entre à l'écran, une seule fois.
 * v-reveal="'stagger'" : anime les enfants directs l'un après l'autre (listes, grilles de cartes).
 * Options : data-reveal-delay="0.3" (départ retardé, en s), data-reveal-amount="0.05"
 * (part de l'élément visible pour déclencher, utile pour un élément très large).
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
          {
            duration: 0.7,
            delay: stagger(0.08, { startDelay: Number(el.dataset.revealDelay ?? 0) }),
            ease: [0.22, 1, 0.36, 1],
          },
        )
      },
      { amount: Number(el.dataset.revealAmount ?? 0.15) },
    )
    stops.set(el, stop)
  },
  unmounted(el) {
    stops.get(el)?.()
  },
}
