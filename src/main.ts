import './assets/main.css'
import 'vuetify/styles'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { createApp, VueElement } from 'vue'
import { createPinia } from 'pinia'
import '@fortawesome/fontawesome-free/css/all.css';

import App from './App.vue'
import router from './router'

const vuetify = createVuetify({
    components,
    directives,
})
const app = createApp(App)
app.use(vuetify)

app.use(createPinia())
app.use(router)

app.mount('#app')