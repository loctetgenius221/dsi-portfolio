import type { Directive } from 'vue'
import { animate, inView, stagger } from 'motion'

/**
 * v-split : les mots d'un titre montent un à un derrière un masque quand il entre à l'écran.
 * À utiliser sur un titre au texte simple (pas de balises à l'intérieur).
 * Option : data-split-delay="0.2" pour retarder le départ (en secondes).
 * Accessibilité : le texte complet reste lu d'un bloc (copie masquée visuellement),
 * les mots animés sont cachés aux lecteurs d'écran. Rien ne bouge si l'utilisateur
 * a demandé à réduire les animations.
 */
const stops = new WeakMap<HTMLElement, () => void>()

export const vSplit: Directive<HTMLElement> = {
  mounted(el) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const text = (el.textContent ?? '').trim().replace(/\s+/g, ' ')
    if (!text) return

    const sr = document.createElement('span')
    sr.className = 'sr-only'
    sr.textContent = text
    const visual = document.createElement('span')
    visual.setAttribute('aria-hidden', 'true')

    const words: HTMLElement[] = []
    text.split(' ').forEach((w, i, all) => {
      const mask = document.createElement('span')
      mask.className = 'split-mask'
      const word = document.createElement('span')
      word.className = 'split-word'
      word.textContent = w
      word.style.transform = 'translateY(110%)'
      mask.appendChild(word)
      visual.appendChild(mask)
      if (i < all.length - 1) visual.appendChild(document.createTextNode(' '))
      words.push(word)
    })
    el.replaceChildren(sr, visual)

    const delay = Number(el.dataset.splitDelay ?? 0)
    const stop = inView(
      el,
      () => {
        animate(
          words,
          { transform: 'translateY(0%)' },
          { duration: 0.9, delay: stagger(0.05, { startDelay: delay }), ease: [0.22, 1, 0.36, 1] },
        )
      },
      { amount: 0.3 },
    )
    stops.set(el, stop)
  },
  unmounted(el) {
    stops.get(el)?.()
  },
}
