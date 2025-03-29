<template>
    <v-app>
        <v-main>
            <v-container fluid>
                <Navbar /> <!-- Always show Navbar -->
                <router-view />
            </v-container>
        </v-main>
    </v-app>
</template>


<script setup lang="ts">
    import { ref, computed, provide } from 'vue';
    import Navbar from './components/NavBar.vue';

    import { useMovieStore } from './stores/movieStore';
    import { useRoute } from 'vue-router';

    const movieStore = useMovieStore();
    provide('movieStore', movieStore);

    const route = useRoute();

</script>

<style lang="css">
    @import "./src/assets/main.css";

    body {
        font-family: 'C64 Pro', monospace;
        margin: 0;
    }


    #app {
        font-family: 'C64 Pro', monospace !important;
        text-align: center;
        color: #2c3e50;
        width: 100vw;
        height: 100vh;
        background-color: rgb(24, 24, 24) !important;
    }

    header {
        line-height: 1.5;
        text-align: center;
        margin-bottom: 2rem;
        padding-top: 60px;
    }

    html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        overflow-x: hidden;
    }
</style>