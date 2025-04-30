// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

// Your dynamic imports
const Dashboard = () => import('@/views/DashboardVue.vue');
const Collection = () => import('@/views/CollectionVue.vue');
const MovieDetail = () => import('@/views/MovieDetailView.vue');
const NotFound = () => import('@/views/NotFound.vue');
// const Home = () => import('@/views/Homepage.vue');
const AboutUs = () => import('@/views/AboutUsVue.vue');
const MatchUnrecognizedMovies = () => import('@/views/MatchUnrecognizedMovies.vue');
const ComprehensiveDashboard = () => import('@/views/ComprehensiveDashboard.vue');
const Settings = () =>import('@/views/SettingsVue.vue')
const Watchlist = () => import('@/views/WatchlistVue.vue')
const CollectionDetail = () => import('@/views/CollectionVuetify.vue')

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
      path: '/library',
      name: 'collection',
      component: Collection,
      meta: { requireAuth: true }, // Only logged-in users can access
    },
    {
      path: "/movie/:id",
      name: "MovieDetails",
      component: () => import("@/components/MovieDetailComponent/MetadataLayout.vue"),
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: "/tv/:id",
      name: "TvDetails",
      component: () => import("@/components/MovieDetailComponent/TvMetadataLayout.vue"),
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: "/profiles",
      name: "Profiles",
      component: () => import("@/components/profile/Profiles.vue"),
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
      path: '/settings',
      name: 'Settings',
      component: Settings,
      meta: { requiresAuth: true }, // Adjust if needed

    },
    {
      path: '/watchlist/:id',
      component: () => Watchlist,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/collection/:id',
      name: 'CollectionDetail',
      props:true,
      component: () => CollectionDetail,
      meta: { requiresAuth: true }
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
