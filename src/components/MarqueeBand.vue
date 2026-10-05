<script setup lang="ts">
const words = [
  'Applications',
  'Réseaux',
  'Données RH',
  'Sécurité',
  'Innovation',
  'Assistance',
  'Interopérabilité',
  'Formation',
]
const dots = ['bg-green', 'bg-yellow', 'bg-red']
</script>

<template>
  <div class="overflow-hidden border-y-2 border-ink bg-yellow py-4" aria-hidden="true">
    <div class="marquee flex w-max">
      <div v-for="n in 2" :key="n" class="flex shrink-0 items-center">
        <template v-for="(w, i) in words" :key="w">
          <span class="display px-6 text-2xl text-ink sm:text-3xl">{{ w }}</span>
          <span class="h-3 w-3 rounded-full border-2 border-ink" :class="dots[i % 3]"></span>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.marquee {
  animation: slide 38s linear infinite;
}
@keyframes slide {
  to {
    transform: translateX(-50%);
  }
}
@media (prefers-reduced-motion: reduce) {
  .marquee {
    animation: none;
  }
}
</style>
