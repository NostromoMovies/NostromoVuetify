// stores/authStore.ts
import { defineStore } from 'pinia'

interface AuthState {
  apikey: string
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    apikey: localStorage.getItem('apikey') || '' // Initialize from localStorage if exists
  }),

  getters: {
    isAuthenticated: (state) => !!state.apikey
  },

  actions: {
    setApiKey(key: string) {
      this.apikey = key
      localStorage.setItem('apikey', key) // Save to localStorage
    },

    logout() {
      this.apikey = ''
      localStorage.removeItem('apikey')
    }
  }
})