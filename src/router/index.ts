// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

// Your dynamic imports
const Dashboard = () => import('@/views/DashboardVue.vue');
const Collection = () => import('@/views/CollectionVue.vue');
const Signup = () => import('@/views/Signup.vue');
const MovieDetail = () => import('@/views/MovieDetailView.vue');
const NotFound = () => import('@/views/NotFound.vue');
// const Home = () => import('@/views/Homepage.vue');
const AboutUs = () => import('@/views/AboutUsVue.vue');
const MatchUnrecognizedMovies = () => import('@/views/MatchUnrecognizedMovies.vue');

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'aboutUs',
      component: AboutUs,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: { requiresAuth: true }, // Only logged-in users can access
    },
    {
      path: '/collection',
      name: 'collection',
      component: Collection,
      meta: { requiresAuth: true }, // Only logged-in users can access
    },
    {
      path: '/register',
      name: 'register',
      component: Signup,
      meta: { guestOnly: true }, // Only guests can access
    },
    {
      path: "/movies/:id",
      name: "MovieDetails",
      component: () => import("@/components/MovieDetailComponent/MetadataLayout.vue"),
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/test',
      name: 'MovieDetailsTest',
      component: MovieDetail,
      props: true,
      meta: { requiresAuth: true }, // Only logged-in users can access
    },
    {
      path: '/unrecognized-movies/matching',
      name: 'MatchUnrecognizedMovies',
      component: MatchUnrecognizedMovies,
      meta: { requiresAuth: true }, // Adjust if needed
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
    },
  ],
});

// Helper function to check if the user is logged in
function isLoggedIn() {
  const authStore = useAuthStore();
  return authStore.isAuthenticated; // Example check
}

// Add a global navigation guard
router.beforeEach((to, from, next) => {
  // const authStore = useAuthStore();

  if (to.meta.requiresAuth && !isLoggedIn()) {
    // Redirect to Not Found if guest tries to access protected routes
    next({ name: 'NotFound' });
  } else if (to.meta.guestOnly && isLoggedIn()) {
    // Redirect to Not Found if logged-in user tries to access guest-only routes
    next({ name: 'NotFound' });
  } else {
    next(); // Proceed to the route
  }
});

export default router;
