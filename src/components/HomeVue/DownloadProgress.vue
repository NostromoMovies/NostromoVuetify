<template>
  <v-container>
    <!-- Display the 5 most recent jobs -->
    <h3>Recent Jobs</h3>
    <div class="recent-jobs">
      
      <div v-for="job in recentJobs" :key="job.jobId" class="job-item">
        <span>Job ID: {{ job.jobId }}</span>
        <span>Status: {{ job.message }}</span>
        <span>Progress: {{ job.progress }}%</span>
        
        <!-- Progress Bar inside Recent Jobs -->
        <v-progress-linear
          v-model="job.progress"
          color="green"
          height="25"
        >
          <template v-slot:default="{ value }">
            <strong>{{ Math.ceil(value) }}%</strong>
          </template>
        </v-progress-linear>
      </div>
    </div>
    
    
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import signalRService from "@/services/signalRService";

// Track the 5 most recent jobs
// const recentJobs = ref<{ jobId: string; message: string; progress: number }[]>([]);
const recentJobs = ref<{ jobId: string; message: string; progress: number }[]>([
  { jobId: "001", message: "Processing", progress: 20 },
  { jobId: "002", message: "Queued", progress: 10 },
  { jobId: "003", message: "In Progress", progress: 50 },
  { jobId: "004", message: "Completed", progress: 100 },
  { jobId: "005", message: "Failed", progress: 75 }
]);

// Function to increase progress (for testing)
const increaseProgress = () => {
  if (recentJobs.value.length > 0 && recentJobs.value[0].progress < 100) {
    recentJobs.value[0].progress += 10;
  }
};

onMounted(() => {
  signalRService.startConnection();

  signalRService.listenForProgressUpdates((receivedJobId: string, receivedMessage: string, receivedProgress: number) => {
    // Add the new job to the recent jobs list
    recentJobs.value.unshift({
      jobId: receivedJobId,
      message: receivedMessage,
      progress: receivedProgress
    });
    
    if (recentJobs.value.length > 5) {
      recentJobs.value.pop();  // Remove the oldest job
    }
  });
});

onUnmounted(() => {
  signalRService.stopConnection();
});
</script>

<style scoped>
.h3{
  padding-bottom: 10px;
}
.v-container {
  height: 100%; /* Full viewport height */
  display: flex;
  flex-direction: column;
}

.recent-jobs {
  padding-top: 10px;
  flex: 1; /* Take up remaining space */
  background-color: #f4f4f4;
  padding: 10px;
  border-radius: 8px;
  overflow-y: auto;
  height: 100%;
}

.job-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 8px 0;
  border-bottom: 1px solid #ccc;
}

.job-item span {
  font-size: 14px;
  color: #333;
}

.job-item:last-child {
  border-bottom: none;
}
</style>
