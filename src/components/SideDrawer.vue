<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { IconX } from '@tabler/icons-vue'

/* Volet latéral accessible (fenêtre modale) :
   glisse depuis la droite, plein écran sur mobile ; se ferme avec la croix,
   Échap ou un clic sur le fond ; garde le focus à l'intérieur tant qu'il est
   ouvert, puis le rend à l'élément qui l'a ouvert. */
const props = defineProps<{ open: boolean; label: string }>()
const emit = defineEmits<{ close: [] }>()

const panel = ref<HTMLElement | null>(null)
const closeBtn = ref<HTMLButtonElement | null>(null)
let trigger: HTMLElement | null = null

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault()
    emit('close')
    return
  }
  if (e.key !== 'Tab' || !panel.value) return
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

watch(
  () => props.open,
  async (open) => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    if (open) {
      trigger = document.activeElement as HTMLElement | null
      document.addEventListener('keydown', onKeydown)
      await nextTick()
      closeBtn.value?.focus()
    } else {
      document.removeEventListener('keydown', onKeydown)
      trigger?.focus()
    }
  },
)

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.documentElement.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer-fade">
      <div
        v-if="open"
        class="fixed inset-0 z-40 bg-ink/40"
        aria-hidden="true"
        @click="emit('close')"
      ></div>
    </Transition>
    <Transition name="drawer-slide">
      <div
        v-if="open"
        ref="panel"
        role="dialog"
        aria-modal="true"
        :aria-label="label"
        class="fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-white sm:max-w-xl sm:border-l-2 sm:border-ink"
      >
        <div class="flex items-center justify-between gap-4 border-b-2 border-ink px-5 py-4 sm:px-8 sm:py-5">
          <div class="min-w-0 font-semibold"><slot name="header" /></div>
          <button
            ref="closeBtn"
            type="button"
            class="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-ink transition-colors hover:bg-ink hover:text-white"
            aria-label="Fermer"
            @click="emit('close')"
          >
            <IconX size="20" stroke="2" aria-hidden="true" />
          </button>
        </div>
        <span class="h-1.5 shrink-0 bg-green" aria-hidden="true"></span>
        <div class="flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-7">
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity 0.25s ease;
}
.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
}
.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(100%);
}
@media (prefers-reduced-motion: reduce) {
  .drawer-fade-enter-active,
  .drawer-fade-leave-active,
  .drawer-slide-enter-active,
  .drawer-slide-leave-active {
    transition: none;
  }
}
</style>
