<template>
  <div>
    <h1>File Hashing Progress</h1>

    <div v-if="progresses.length > 0" class="progress-container">
      <div v-for="(progress, index) in progresses"
           :key="index"
           class="progress-box">
        
       
        <strong class="filename">{{ progress.filename }}</strong>

        
        <span class="hash-type">{{ progress.hashType }}</span>

       
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
      const progresses = ref([]);
      // We'll store extra job state (activeIndex, lastProgress) here:
      const jobStateMap = {};

      // The order of the bars
      const hashTypes = ["MD5", "SHA1", "CRC32", "ED2K"];
      let intervalId = null;

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

      const initializeProgressEntries = async () => {
        for (let jobId of jobIds.value) {
          try {
            const response = await fetch(`/api/progress/${jobId}`);
            if (!response.ok) continue;

            const data = await response.json();
            const filename = data.filename || "Unknown File";

            // Create 4 entries for this job if they don't exist
            hashTypes.forEach((hashType) => {
              if (!progresses.value.some((p) => p.jobId === jobId && p.hashType === hashType)) {
                progresses.value.push({
                  jobId: jobId,
                  filename,
                  hashType,
                  progress: 0, // Start at 0%
                });
              }
            });

            // Also initialize a little "job state" object for this job
            if (!jobStateMap[jobId]) {
              jobStateMap[jobId] = {
                lastProgress: 0,   // last polled progress from server
                activeIndex: 0,    // which bar (0..3) we are currently updating
              };
            }
          } catch (error) {
            console.error(`Error initializing progress for ${jobId}:`, error);
          }
        }
      };

      const startPolling = () => {
        if (jobIds.value.length === 0) return;

        intervalId = setInterval(async () => {
          try {
            let completedJobs = [];

            for (let jobId of jobIds.value) {
              const response = await fetch(`/api/progress/${jobId}`);
              if (!response.ok) continue;

              const data = await response.json();
              const { progress } = data; // single progress value, 0→100 repeated
              const jobEntries = progresses.value.filter((p) => p.jobId === jobId);
              const state = jobStateMap[jobId];

              if (!state) {
                // If for some reason we don't have state, skip
                continue;
              }

              // Check if we've "reset" from near 100 back to a smaller value
              if (progress < state.lastProgress) {
                // Means the server started the next hashing pass
                state.activeIndex++;
              }

              // Make sure we don't go out of range (there are 4 bars)
              if (state.activeIndex > 3) {
                state.activeIndex = 3;
              }

              // 1) Set all previous bars to 100
              for (let i = 0; i < state.activeIndex; i++) {
                jobEntries[i].progress = 100;
              }

              // 2) Update the "current" bar with the new progress
              jobEntries[state.activeIndex].progress = progress;
              state.lastProgress = progress;

              // If we're on the last bar (activeIndex=3) and it's at 100, job is complete
              if (state.activeIndex === 3 && progress === 100) {
                completedJobs.push(jobId);
                await removeCompletedJob(jobId);
              }
            }

            // Remove any completed jobs
            jobIds.value = jobIds.value.filter((id) => !completedJobs.includes(id));
            progresses.value = progresses.value.filter((p) => !completedJobs.includes(p.jobId));

            // Also remove them from jobStateMap
            completedJobs.forEach((id) => {
              delete jobStateMap[id];
            });

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
          await fetch(`/api/progress/remove/${jobId}`, { method: "DELETE" });
        } catch (error) {
          console.error(`Error removing completed job ${jobId}:`, error);
        }
      };

      const getProgressColor = (progress) => {
        if (progress < 50) return "low-progress";
        if (progress < 80) return "medium-progress";
        return "high-progress";
      };

      onMounted(() => {
        fetchActiveJobs();
      });

      onUnmounted(() => {
        if (intervalId) clearInterval(intervalId);
      });

      return {
        progresses,
        getProgressColor,
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
    margin-bottom: 3px;
  }

  .hash-type {
    display: block;
    font-size: 14px;
    color: #aaa;
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