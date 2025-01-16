import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/DashboardVue.vue'
import Collection from '@/views/CollectionVue.vue'
import { useAuthStore } from '@/stores/authStore'
import Signup from '@/views/Signup.vue'
import MovieDeatilVue from '@/views/MovieDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Dashboard,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path: '/collection',
      name: 'collection',
      component: Collection,
    },
    {
      path: '/register',
      name: 'register',
      component: Signup,
    },
    {
      path: '/movies/:id',
      name: 'MovieDetails',
      component: MovieDeatilVue,
      props: true,
    },
    {
      path: '/test',
      name: 'MovieDetailsTest',
      component: MovieDeatilVue,
      props: true,
    },
  ],
})

function isLoggedIn() {
  const authStore = useAuthStore()
  return authStore.isAuthenticated // Example check
}

// Add a global navigation guard
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    // Redirect to the login page if not logged in
    next({ path: '/', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
