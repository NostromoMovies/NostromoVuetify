<template>
  <div>
    <h1>File Hashing Progress</h1>

    <div v-if="progresses.length > 0" class="progress-container">
      <div
        v-for="(progress, index) in progresses"
        :key="index"
        class="progress-box"
      >
        <!-- Show the file name -->
        <strong class="filename">{{ progress.filename }}</strong>

        <!-- Single progress bar per job -->
        <div class="progress-wrapper">
          <v-progress-linear
            :model-value="progress.progress"
            color="green"
            height="10"
            rounded
            class="progress-bar"
          ></v-progress-linear>
          <span class="progress-value">{{ progress.progress }}%</span>
        </div>
      </div>
    </div>

    <p v-else>No active jobs found.</p>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";

export default {
  setup() {
    const jobIds = ref([]);
    // We store one entry per job, each with { jobId, filename, progress }
    const progresses = ref([]);
    let intervalId = null;

    // Fetch the list of currently active job IDs
    const fetchActiveJobs = async () => {
      try {
        const response = await fetch("/api/progress/jobs");
        if (!response.ok) return;

        const data = await response.json();
        if (data.jobIds.length > 0) {
          jobIds.value = data.jobIds;
          initializeProgressEntries();
          startPolling();
        }
      } catch (error) {
        console.error("Error fetching active jobs:", error);
      }
    };

    // Initialize each job with a single progress entry
    const initializeProgressEntries = async () => {
      for (let jobId of jobIds.value) {
        try {
          const response = await fetch(`/api/progress/${jobId}`);
          if (!response.ok) continue;

          const data = await response.json();
          const filename = data.filename || "Unknown File";

          // If we don't already have an entry for this jobId, add one
          const existing = progresses.value.find((p) => p.jobId === jobId);
          if (!existing) {
            progresses.value.push({
              jobId,
              filename,
              progress: 0,
            });
          }
        } catch (error) {
          console.error(`Error initializing progress for ${jobId}:`, error);
        }
      }
    };

    // Poll every second to update the single progress for each job
    const startPolling = () => {
      if (jobIds.value.length === 0) return;

      intervalId = setInterval(async () => {
        try {
          let completedJobs = [];

          for (let jobId of jobIds.value) {
            const response = await fetch(`/api/progress/${jobId}`);
            if (!response.ok) continue;

            const data = await response.json();
            const { progress } = data; // single numeric progress (0..100)

            // Find the matching entry in 'progresses'
            const jobEntry = progresses.value.find((p) => p.jobId === jobId);
            if (!jobEntry) continue;

            // Update the single bar's progress
            jobEntry.progress = progress;

            // If it's at 100, we consider the job done
            if (progress === 100) {
              completedJobs.push(jobId);
              await removeCompletedJob(jobId);
            }
          }

          // Remove any completed jobs from local arrays
          if (completedJobs.length > 0) {
            jobIds.value = jobIds.value.filter((id) => !completedJobs.includes(id));
            progresses.value = progresses.value.filter((p) => !completedJobs.includes(p.jobId));
          }

          // Stop polling if there are no more jobs
          if (jobIds.value.length === 0) {
            clearInterval(intervalId);
          }
        } catch (error) {
          console.error("Error fetching progress:", error);
        }
      }, 1000);
    };

    const removeCompletedJob = async (jobId) => {
      try {
        // Inform the server that we've removed this completed job
        await fetch(`/api/progress/remove/${jobId}`, { method: "DELETE" });
      } catch (error) {
        console.error(`Error removing completed job ${jobId}:`, error);
      }
    };

    onMounted(() => {
      fetchActiveJobs();
    });

    onUnmounted(() => {
      if (intervalId) clearInterval(intervalId);
    });

    return {
      progresses,
    };
  },
};
</script>

<style scoped>
.progress-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 10px;
}

.progress-box {
  display: flex;
  flex-direction: column;
  background-color: #1e1e1e;
  color: #ffffff;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 12px;
  width: 100%;
}

.filename {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

.progress-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  flex-grow: 1;
}

.progress-value {
  font-size: 12px;
  font-weight: bold;
  color: #ffffff;
  min-width: 40px;
  text-align: left;
}
</style>
