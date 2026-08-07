import { createRouter, createWebHistory } from 'vue-router'
import LandingView from './views/LandingView.vue'
import ConsoleView from './views/ConsoleView.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'landing', component: LandingView },
    { path: '/console', name: 'console', component: ConsoleView },
  ],
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})
