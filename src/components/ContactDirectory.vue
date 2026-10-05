<script setup lang="ts">
import { ref } from 'vue'
import type { Component } from 'vue'
import { Mail, Phone } from 'lucide-vue-next'
import {
  IconBolt,
  IconBulb,
  IconClipboardCheck,
  IconDatabase,
  IconMinus,
  IconPlus,
  IconShieldCheck,
  IconTool,
} from '@tabler/icons-vue'
import { heads, needs } from '@/data/dsi'
import Avatar from './Avatar.vue'

// Icône Tabler de chaque situation (même famille que les missions)
const iconOf: Record<string, Component> = {
  services: IconTool,
  infrastructures: IconShieldCheck,
  architecture: IconBolt,
  innovation: IconBulb,
  decisionnel: IconDatabase,
  admin: IconClipboardCheck,
}

const ENTRY_POINT = 'services'

// Une seule réponse ouverte à la fois ; la première (le support) l'est d'emblée.
const open = ref<number | null>(0)
function toggle(i: number) {
  open.value = open.value === i ? null : i
}
</script>

<template>
  <section id="contact" class="pb-16 pt-10 sm:pb-24 sm:pt-14 lg:pb-28 lg:pt-16">
    <div class="wrap grid gap-10 lg:grid-cols-12 lg:gap-16">
      <div class="lg:col-span-4">
        <div class="lg:sticky lg:top-10">
          <h2 class="h2">Qui contacter pour quoi ?</h2>
          <p class="mt-5 max-w-sm leading-relaxed text-ink-soft">
            Choisissez la situation qui vous ressemble : la réponse indique l'unité concernée et la personne à joindre.
          </p>
        </div>
      </div>

      <div class="min-w-0 lg:col-span-8">
        <ul class="border-t-2 border-ink">
          <li v-for="(n, i) in needs" :key="n.label" class="border-b border-rule">
            <h3>
              <button
                :id="`faq-q-${i}`"
                type="button"
                class="group flex min-h-16 w-full items-center gap-4 py-5 text-left transition-colors sm:gap-5"
                :aria-expanded="open === i"
                :aria-controls="`faq-a-${i}`"
                @click="toggle(i)"
              >
                <span
                  class="grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-green transition-colors duration-300 sm:h-14 sm:w-14"
                  :class="open === i ? 'bg-green text-white' : 'bg-white text-green'"
                >
                  <component :is="iconOf[n.unitId]" :size="26" :stroke="1.5" aria-hidden="true" />
                </span>
                <span class="min-w-0 flex-1">
                  <span class="display block text-[1.2rem] leading-snug text-ink sm:text-[1.45rem]">{{ n.label }}</span>
                  <span
                    v-if="n.unitId === ENTRY_POINT"
                    class="mt-1.5 inline-block border-2 border-ink bg-yellow px-2 py-0.5 text-[0.75rem] font-bold leading-tight"
                    >Premier point d'entrée</span
                  >
                </span>
                <span
                  class="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-ink text-ink transition-colors"
                  :class="open === i ? 'bg-ink text-white' : 'bg-white'"
                >
                  <component :is="open === i ? IconMinus : IconPlus" size="18" stroke="2" aria-hidden="true" />
                </span>
              </button>
            </h3>

            <div
              :id="`faq-a-${i}`"
              role="region"
              :aria-labelledby="`faq-q-${i}`"
              class="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
              :style="{ gridTemplateRows: open === i ? '1fr' : '0fr' }"
              :inert="open !== i"
            >
              <div class="min-h-0 overflow-hidden">
                <div class="pb-7 sm:pl-[4.75rem]">
                  <p class="text-sm font-semibold text-ink-soft">Adressez-vous à</p>
                  <p class="font-display text-[1.35rem] font-medium leading-snug text-green-deep">{{ n.target }}</p>
                  <p class="mt-2 text-ink-soft">{{ n.example }}</p>

                  <div class="mt-5 border-2 border-ink bg-white p-4 sm:p-5">
                    <div class="flex items-center gap-3.5">
                      <span class="shrink-0 rounded-full ring-2 ring-ink">
                        <Avatar :person="heads[n.unitId]!" :size="52" color="#009454" />
                      </span>
                      <div class="min-w-0 leading-tight">
                        <p class="font-bold">{{ heads[n.unitId]!.name }}</p>
                        <p class="text-sm text-ink-soft">{{ heads[n.unitId]!.title }}</p>
                      </div>
                    </div>
                    <div class="mt-4 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                      <a
                        :href="`tel:${heads[n.unitId]!.phone.replace(/\s/g, '')}`"
                        class="flex min-h-12 items-center justify-center gap-2 whitespace-nowrap border-2 border-ink bg-yellow px-4 py-2.5 text-center font-semibold transition-colors hover:bg-ink hover:text-white sm:justify-start"
                        ><Phone :size="16" aria-hidden="true" />{{ heads[n.unitId]!.phone }}</a
                      >
                      <a
                        :href="`mailto:${heads[n.unitId]!.email}`"
                        class="flex min-h-12 min-w-0 items-center justify-center gap-2 break-all border-2 border-ink bg-white px-4 py-2.5 text-center text-[0.92rem] font-semibold transition-colors hover:bg-ink hover:text-white sm:justify-start"
                        ><Mail :size="16" class="shrink-0" aria-hidden="true" />{{ heads[n.unitId]!.email }}</a
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <p class="mt-6 text-sm text-ink-soft">
          Responsables et coordonnées fictifs, à remplacer par les informations réelles.
        </p>
      </div>
    </div>
  </section>
</template>
