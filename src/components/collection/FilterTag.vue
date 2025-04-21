<template>
  <div class="filter-tag">
    <v-btn
      class="tag-button"
      :class="{ selected: isSelected }"
      outlined
      @click="toggleSelection"
    >
      {{ label }}
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "FilterTag",
  props: {
    label: {
      type: String,
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      isSelected: false,
    };
  },
  methods: {
    toggleSelection() {
      this.isSelected = !this.isSelected;
      this.$emit("toggle", {
        id: this.id,
        selected: this.isSelected,
      });
    },
  },
};
</script>

<style scoped>
.tag-button {
  border-radius: 20px;
  text-transform: none;
  background-color: #2c2c2c;
  border: 1px solid #87cefa;
  color: #87cefa;
  font-weight: 500;
  padding: 5px 15px;
  font-size: 14px;
}

.tag-button:hover {
  background-color: #3d3d3d;
  border-color: #b0e0ff;
  color: #b0e0ff;
}

.selected {
  background-color: #87cefa;
  color: #2c2c2c;
  border-color: #b0e0ff;
}

.filter-tag {
  margin-bottom: 10px;
}
</style>
