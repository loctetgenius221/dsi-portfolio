import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'accueil', component: () => import('@/views/HomeView.vue') },
    {
      path: '/realisations',
      name: 'realisations',
      component: () => import('@/views/ProjectsView.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) {
      // Depuis une autre page, la vue cible se charge d'abord : on attend son rendu
      const delay = to.path === from.path ? 0 : 300
      return new Promise((resolve) =>
        setTimeout(() => resolve({ el: to.hash, behavior: delay ? 'auto' : 'smooth' }), delay),
      )
    }
    return { top: 0 }
  },
})

export default router
