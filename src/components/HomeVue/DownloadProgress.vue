<template>
    <div class="unrecognized-files">
        <h3>Log</h3>
        <div class="file-list">
            <button v-for="log in logs"
                    :key="log.id"
                    class="file-item"
                    @click="handleAction(log.id)">
                <span>{{ log.status }}</span>
                <span>{{ log.timestamp }}</span>
            </button>
        </div>
        
    </div>
</template>

<script setup lang="ts">
    
    import { ref } from 'vue';

    const logs = ref([
        { id: 1, timestamp: '2024-10-18 | 18:19', status: '94%' },
        { id: 2, timestamp: '2024-10-18 | 18:18', status: 'Completed' },
        { id: 3, timestamp: '2024-10-18 | 18:17', status: 'Completed' },
    ]);

    const handleAction = (fileId: number) => {
        console.log(`Action clicked for file ID: ${fileId}`);
    };
</script>

<style scoped>
    .unrecognized-files {
        background-color: var(--color-background-soft);
        color: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        max-height: 400px;
        overflow-y: auto;
    }

    .file-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .file-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #2e2e2e;
        padding: 10px;
        border: none;
        border-radius: 4px;
        color: inherit;
        font: inherit;
        text-align: left;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

        .file-item span {
            margin-right: 10px;
        }

        .file-item:hover {
            background: #3a3a3a;
        }
</style>