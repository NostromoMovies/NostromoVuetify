import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/main.css';
import './assets/base.css';

import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import "@mdi/font/css/materialdesignicons.css";
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const customTheme = {
    dark: false,
    colors: {
        primary: '#181818',
        background: '#181818',
    },
}

const vuetify = createVuetify({
    theme: {
        defaultTheme: 'myCustomTheme',
        themes: {
            myCustomTheme: customTheme,
        },
    },
    components,
    directives,
});

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(vuetify);

app.mount('#app');