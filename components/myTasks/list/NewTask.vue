<template>
  <div class="new-task-container">
    <v-container class="pt-0">
      <v-text-field
        v-model="taskName"
        class="new-task"
        background-color="primary"
        label="Add a task"
        hide-details
        solo
        @focus="isAddingNewTask = true"
        @blur="isAddingNewTask = false"
        @keydown.enter="addTask"
      >
        <template #prepend-inner>
          <v-btn icon>
            <v-icon v-if="isAddingNewTask">mdi-circle-outline</v-icon>
            <v-icon v-else>mdi-plus</v-icon>
          </v-btn>
        </template>
      </v-text-field>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'NewTask',
  data() {
    return {
      isAddingNewTask: false,
      taskName: ''
    }
  },
  methods: {
    /**
     * produce add new task
     * @return {void}
     */
    addTask() {
      const validatedName = this.taskName.trim()
      if (validatedName) {
        this.$store.dispatch('tasks/addTask', {
          name: this.taskName
        })
      }
      this.taskName = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.new-task-container {
  position: fixed;
  z-index: 1;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0 0 60px 0;
  backdrop-filter: blur(2px);
}

.new-task {
  & ::v-deep .v-icon {
    color: white !important;
  }

  & ::v-deep input,
  & ::v-deep label {
    color: white !important;
  }
}
</style>
