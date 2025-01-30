import { defineStore } from 'pinia'

interface AuthState {
  apikey: string
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    apikey: localStorage.getItem('apikey') || '' 
  }),

  getters: {
    isAuthenticated: (state) => !!state.apikey
  },

  actions: {
    setApiKey(key: string) {
      this.apikey = key
      localStorage.setItem('apikey', key) 
    },

    logout() {
      this.apikey = ''
      localStorage.removeItem('apikey')
      console.log("Sucess")
    }
  }
})