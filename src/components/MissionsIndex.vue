<script setup lang="ts">
import { ref } from 'vue'
import type { Component } from 'vue'
import {
  IconArrowsExchange,
  IconBolt,
  IconBulb,
  IconClipboardCheck,
  IconDatabase,
  IconEye,
  IconMinus,
  IconPlus,
  IconSchool,
  IconServer,
  IconShieldCheck,
  IconTool,
  IconTrendingUp,
} from '@tabler/icons-vue'
import { missionGroups } from '@/data/dsi'
import PhotoFrame from './PhotoFrame.vue'

// Icônes Tabler associées aux missions (jeu fourni : icones_missions_dsi.html)
const icons: Record<string, Component> = {
  bolt: IconBolt,
  'arrows-exchange': IconArrowsExchange,
  bulb: IconBulb,
  eye: IconEye,
  school: IconSchool,
  database: IconDatabase,
  'clipboard-check': IconClipboardCheck,
  'shield-check': IconShieldCheck,
  server: IconServer,
  tool: IconTool,
  'trending-up': IconTrendingUp,
}

// Mobile : accordéon (un domaine ouvert à la fois). Pas de survol, tout passe par l'appui.
const open = ref<number | null>(0)
function toggle(i: number) {
  open.value = open.value === i ? null : i
}
</script>

<template>
  <section class="bg-paper-2 py-16 sm:py-24 lg:py-28">
    <div class="wrap">
      <div class="grid items-center gap-10 lg:grid-cols-12">
        <div v-reveal class="lg:col-span-6">
          <h2 class="h2">Les missions de la DSI, en cinq domaines.</h2>
          <p class="mt-5 max-w-md leading-relaxed text-ink-soft">
            Les missions confiées à la DSI par le texte d'organisation du Ministère, regroupées par domaine d'action.
          </p>
        </div>
        <div class="lg:col-span-5 lg:col-start-8">
          <PhotoFrame
            src="/images/p2/dev.jpg"
            alt="Un agent concentré devant son écran et son ordinateur portable"
            position="50% 32%"
            ratio="16 / 9"
            shadow="var(--color-green)"
          />
        </div>
      </div>

      <!-- Mobile et tablette : accordéon -->
      <ul v-reveal="'stagger'" class="mt-10 border-t-2 border-ink lg:hidden">
        <li v-for="(g, i) in missionGroups" :key="g.title" class="border-b border-rule">
          <h3>
            <button
              :id="`mission-q-${i}`"
              type="button"
              class="flex min-h-16 w-full items-center gap-4 py-4 text-left transition-colors active:bg-white"
              :aria-expanded="open === i"
              :aria-controls="`mission-a-${i}`"
              @click="toggle(i)"
            >
              <span
                class="grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-green transition-colors duration-300"
                :class="open === i ? 'bg-green text-white' : 'bg-white text-green'"
              >
                <component :is="icons[g.icon]" :size="26" :stroke="1.5" aria-hidden="true" />
              </span>
              <span class="min-w-0 flex-1">
                <span class="display block text-[1.3rem] leading-snug text-ink">{{ g.title }}</span>
                <span class="text-sm text-ink-soft">{{ g.items.length }} missions</span>
              </span>
              <span
                class="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-ink transition-colors"
                :class="open === i ? 'bg-ink text-white' : 'bg-white text-ink'"
              >
                <component :is="open === i ? IconMinus : IconPlus" size="18" stroke="2" aria-hidden="true" />
              </span>
            </button>
          </h3>
          <div
            :id="`mission-a-${i}`"
            role="region"
            :aria-labelledby="`mission-q-${i}`"
            class="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
            :style="{ gridTemplateRows: open === i ? '1fr' : '0fr' }"
            :inert="open !== i"
          >
            <div class="min-h-0 overflow-hidden">
              <p class="pb-4 leading-snug text-ink-soft sm:pl-16">{{ g.summary }}</p>
              <ul class="mb-6 space-y-3 sm:pl-16">
                <li
                  v-for="(item, k) in g.items"
                  :key="item"
                  class="flex items-start gap-3 border-l-[3px] bg-white py-3 pl-4 pr-3 leading-snug"
                  :style="{ borderColor: g.color }"
                >
                  <component
                    :is="icons[g.itemIcons[k] ?? g.icon]"
                    :size="22"
                    :stroke="1.6"
                    class="mt-0.5 shrink-0 text-green"
                    aria-hidden="true"
                  />
                  <span class="min-w-0">{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>
        </li>
      </ul>

      <!-- Ordinateur : lignes illustrées -->
      <ul v-reveal="'stagger'" class="mt-14 hidden border-t-2 border-ink lg:block">
        <li
          v-for="g in missionGroups"
          :key="g.title"
          class="group relative grid items-center gap-6 border-b border-rule py-8 transition-colors duration-300 hover:bg-white lg:grid-cols-[8rem_1fr_1.7fr] lg:gap-10"
        >
          <span
            class="absolute inset-y-0 left-0 w-1.5 origin-top scale-y-0 transition-transform duration-300 group-hover:scale-y-100"
            :style="{ background: g.color }"
          ></span>
          <div class="flex items-center lg:justify-center lg:pl-4">
            <span
              class="grid h-18 w-18 place-items-center rounded-full border-2 border-green bg-white text-green transition-colors duration-300 group-hover:bg-green group-hover:text-white"
            >
              <component :is="icons[g.icon]" :size="34" :stroke="1.5" aria-hidden="true" />
            </span>
          </div>
          <div class="min-w-0">
            <h3 class="display text-[1.7rem] text-ink">{{ g.title }}</h3>
            <p class="mt-2 max-w-xs text-ink-soft">{{ g.summary }}</p>
          </div>
          <ul class="grid min-w-0 gap-x-8 gap-y-4 sm:grid-cols-3">
            <li
              v-for="(item, i) in g.items"
              :key="item"
              class="border-t-[3px] pt-3 text-[0.98rem] leading-snug"
              :style="{ borderColor: g.color }"
            >
              <component
                :is="icons[g.itemIcons[i] ?? g.icon]"
                :size="20"
                :stroke="1.6"
                class="mb-2 text-green"
                aria-hidden="true"
              />
              {{ item }}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </section>
</template>
