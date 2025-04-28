<template>
    <v-app >
        <v-main>
            <v-container fluid>
                <Navbar />
                <router-view />
            </v-container>
        </v-main>
    </v-app>
</template>


<script setup lang="ts">
    import { ref, computed, provide } from 'vue';
    import Navbar from './components/NavBar.vue';

    import { useMovieStore } from './stores/movieStore';
    import { useTvStore } from './stores/tvStore';
    import { useSeasonStore } from './stores/seasonStore';
    import { useEpisodeStore } from './stores/episodeStore';
    import { useCollectionStore } from './stores/collectionStore';
    import { useRoute } from 'vue-router';

    const movieStore = useMovieStore();
    const tvStore = useTvStore();
    const seasonStore = useSeasonStore();
    const episodeStore = useEpisodeStore();
    const collectionStore = useCollectionStore();

    provide('movieStore', movieStore);
    provide('tvStore', tvStore);
    provide('seasonStore', seasonStore);
    provide('episodeStore', episodeStore);
    provide('collectionStore', collectionStore);

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
