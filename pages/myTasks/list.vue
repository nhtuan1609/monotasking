<template>
  <v-layout fill-height>
    <v-flex>
      <v-toolbar class="tool-bar" height="60" light elevation="0">
        <h2>List view</h2>
      </v-toolbar>

      <v-container v-if="tasks.length === 0" class="card-my-day max-width">
        <v-img src="/images/calendar.png" alt="calendar" aspect-ratio="1" width="100" class="mx-auto my-6"></v-img>
        <h2 class="text-center mb-4">Wondering where your tasks are?</h2>
        <span class="text-center">Any tasks you didn't complete in My Day last time show up in suggestions pane.</span>
      </v-container>
      <v-container v-else class="task-list max-width">
        <v-text-field
          v-for="(task, index) in tasks"
          :key="index"
          v-model="task.content"
          class="task-item"
          cols="12"
          hide-details
          readonly
          light
          solo
        >
          <template #prepend-inner>
            <v-btn icon @click="task.isCompleted = !task.isCompleted">
              <v-icon v-if="task.isCompleted">mdi-check-circle</v-icon>
              <v-icon v-else>mdi-circle-outline</v-icon>
            </v-btn>
          </template>
          <template #append>
            <v-btn icon @click="deleteTask(task)">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </v-container>

      <v-container class="new-task max-width">
        <v-text-field
          v-model="newTaskContent"
          :prepend-inner-icon="isAddingNewTask ? 'mdi-circle-outline' : 'mdi-plus'"
          background-color="primary"
          label="Add a task"
          hide-details
          solo
          @focus="isAddingNewTask = true"
          @blur="isAddingNewTask = false"
          @keydown.enter="addNewTask()"
        ></v-text-field>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      isAddingNewTask: false,
      newTaskContent: ''
    }
  },
  head: {
    title: 'My Task - List'
  },
  computed: {
    tasks() {
      return this.$store.getters['tasks/getTasks']
    }
  },
  beforeMount() {
    this.loadDataFromLocalStorage()
    window.addEventListener('beforeunload', this.saveDataToLocalStorage)
  },
  beforeDestroy() {
    this.saveDataToLocalStorage()
  },
  methods: {
    loadDataFromLocalStorage() {
      this.$store.dispatch('tasks/loadDataFromLocalStorage')
    },
    saveDataToLocalStorage() {
      this.$store.dispatch('tasks/saveDataToLocalStorage')
    },
    addNewTask() {
      this.$store.dispatch('tasks/addNewTask', {
        newTaskContent: this.newTaskContent
      })
      this.newTaskContent = ''
    },
    deleteTask(task) {
      this.$store.dispatch('tasks/deleteTask', { task })
    }
  }
}
</script>

<style lang="scss" scoped>
.tool-bar {
  background-color: rgba(0, 0, 0, 0.2) !important;
  backdrop-filter: blur(4px);
  color: white;
}

.max-width {
  max-width: 800px;
}

.new-task {
  position: fixed;
  z-index: 1;
  left: 0;
  right: 0;
  bottom: 0;
  padding-top: 0;
  padding-bottom: 60px;
  backdrop-filter: blur(2px);
  & ::v-deep .v-icon {
    color: white !important;
  }

  & ::v-deep input,
  & ::v-deep label {
    color: white !important;
  }
}

.task-list {
  margin-top: 60px;
  margin-bottom: 160px;
  overflow-y: auto;
}

.task-list .task-item {
  margin: 10px 0;
  &:first-child {
    margin-top: -10px;
  }
  &:last-child {
    margin-bottom: -10px;
  }
  & ::v-deep .v-input__slot {
    background-color: var(--v-primary-lighten5) !important;
    box-shadow: none !important;
  }
  & ::v-deep .v-input__slot:hover {
    background-color: var(--v-primary-lighten2) !important;
  }
}

.card-my-day {
  width: 300px;
  height: 340px;
  padding: 10px;
  margin: 10vh auto 0 auto;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  color: white;
  text-align: center;
}
</style>
