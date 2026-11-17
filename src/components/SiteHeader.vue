<template>
  <header class="flex items-center justify-between gap-4 py-8 sm:gap-6 sm:py-10">
    <!-- Gauche : sigle et nom de la Direction (retour à l'accueil) -->
    <RouterLink to="/" class="flex min-w-0 items-center gap-2.5 sm:gap-4">
      <span
        class="relative shrink-0 font-sans text-xl font-extrabold tracking-tight text-green sm:text-2xl"
        aria-hidden="true"
      >
        DSI
        <span class="absolute -bottom-1 left-0 flex h-0.75 w-full"
          ><i class="flex-1 bg-green"></i
          ><i class="relative flex-1 bg-yellow"
            ><!-- Étoile verte du drapeau : à la hauteur de la bande (3 px), sans la dépasser -->
            <svg
              viewBox="0 0 24 24"
              class="absolute left-1/2 top-0 aspect-square h-full -translate-x-1/2 fill-green"
            >
              <path d="M12 1.5l3.09 6.9 7.41.6-5.62 4.86 1.7 7.24L12 17.27 5.42 21.1l1.7-7.24L1.5 9l7.41-.6z" /></svg></i
          ><i class="flex-1 bg-red"></i
        ></span>
      </span>
      <span class="h-7 w-px shrink-0 bg-rule sm:h-8" aria-hidden="true"></span>
      <p class="min-w-0 text-[0.72rem] font-semibold leading-tight text-ink sm:text-sm">
        Direction des Systèmes<br />
        d'Information
      </p>
    </RouterLink>

    <!-- Droite : Ministère et son logo, tout à droite -->
    <div class="flex shrink-0 items-center gap-2.5 sm:gap-3">
      <img
        src="/images/logos/ministere.png"
        class="w-9 shrink-0 sm:w-11"
        alt="Logo Ministère de la fonction publique du Sénégal"
      />
      <p
        class="sr-only text-left font-semibold text-[0.78rem] leading-tight text-ink md:not-sr-only lg:text-sm"
      >
        Ministère de la Fonction publique, du<br />
        Travail et de la Réforme du Service Public
      </p>
    </div>
  </header>
</template>
