import type { Directive } from 'vue'
import { animate, stagger } from 'motion'

/**
 * v-reveal : apparition douce (fondu + léger glissement) quand l'élément entre à l'écran.
 * v-reveal="'stagger'" : anime les enfants directs l'un après l'autre (listes, grilles de cartes).
 * Options : data-reveal-delay="0.3" (départ retardé à la première apparition, en s),
 * data-reveal-amount="0.05" (part de l'élément visible pour déclencher, utile pour un élément très large).
 *
 * L'animation se rejoue : un bloc entièrement sorti de l'écran est remis en attente, sans effet visible.
 * Sorti par le haut, il revient depuis le haut quand on remonte, plus vite et de moins loin ;
 * sorti par le bas, il remonte comme à la première apparition.
 * Sans effet si l'utilisateur a demandé à réduire les animations : le contenu reste affiché tel quel.
 */
const ease = [0.22, 1, 0.36, 1] as const
// Première apparition et retour par le bas, puis retour par le haut (en remontant)
const FROM_BELOW = { y: 18, duration: 0.7, gap: 0.08 }
const FROM_ABOVE = { y: -10, duration: 0.4, gap: 0.04 }

const observers = new WeakMap<HTMLElement, IntersectionObserver>()

export const vReveal: Directive<HTMLElement, 'stagger' | undefined> = {
  mounted(el, binding) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const targets = binding.value === 'stagger' ? (Array.from(el.children) as HTMLElement[]) : [el]
    if (!targets.length) return

    const amount = Number(el.dataset.revealAmount ?? 0.15)
    let from = FROM_BELOW
    let first = true
    let shown = false
    let run: ReturnType<typeof animate> | undefined

    const hide = () => {
      run?.stop()
      targets.forEach((t) => {
        t.style.opacity = '0'
        t.style.transform = `translateY(${from.y}px)`
      })
    }
    hide()

    // Un défilement rapide peut livrer plusieurs relevés d'un coup (sortie puis retour) :
    // on les traite tous, dans l'ordre
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (!shown && entry.isIntersecting && entry.intersectionRatio >= amount) {
          shown = true
          const startDelay = first ? Number(el.dataset.revealDelay ?? 0) : 0
          first = false
          // Valeurs de départ explicites : Motion garde sa propre mémoire des valeurs et
          // ignorerait sinon le masquage fait directement dans le style
          run = animate(
            targets,
            { opacity: [0, 1], transform: [`translateY(${from.y}px)`, 'translateY(0px)'] },
            { duration: from.duration, delay: stagger(from.gap, { startDelay }), ease },
          )
        } else if (shown && !entry.isIntersecting) {
          // Entièrement hors de l'écran : remis en attente, prêt à revenir du bon côté
          shown = false
          from = entry.boundingClientRect.top < 0 ? FROM_ABOVE : FROM_BELOW
          hide()
        }
      }),
      { threshold: [0, amount] },
    )
    io.observe(el)
    observers.set(el, io)
  },
  unmounted(el) {
    observers.get(el)?.disconnect()
  },
}
