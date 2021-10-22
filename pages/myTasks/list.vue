<template>
  <v-layout fill-height>
    <v-flex>
      <v-toolbar light elevation="0" class="tool-bar">
        <h2>List view</h2>
      </v-toolbar>
      <div class="field-task-new">
        <v-container>
          <v-row>
            <v-col cols="12" class="pt-0 pb-16">
              <v-text-field
                v-model="newTaskContent"
                :prepend-inner-icon="isAddingNewTask ? 'mdi-circle-outline' : 'mdi-plus'"
                color="white"
                background-color="primary"
                label="Add a task"
                hide-details
                light
                solo
                @focus="isAddingNewTask = true"
                @blur="isAddingNewTask = false"
                @keyup="addNewTask"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </div>
      <v-container v-if="tasks.length === 0">
        <div class="card-my-day">
          <v-img src="/images/calendar.png" alt="calendar" aspect-ratio="1" width="100" class="mx-auto my-6"></v-img>
          <h2 class="text-center mb-4">Wondering where your tasks are?</h2>
          <span class="text-center"
            >Any tasks you didn't complete in My Day last time show up in suggestions pane.</span
          >
        </div>
      </v-container>
      <v-container v-else style="margin-bottom: 140px">
        <v-row>
          <v-col>
            <v-text-field
              v-for="(task, index) in tasks"
              :key="index"
              v-model="task.content"
              cols="12"
              class="field-task"
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
          </v-col>
        </v-row>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      isAddingNewTask: false,
      newTaskContent: '',
      tasks: [],
      autoNumber: 0
    }
  },
  head: {
    title: 'My Task - List'
  },
  methods: {
    addNewTask(event) {
      if (event.key === 'Enter' && this.newTaskContent.trim()) {
        const date = new Date()
        this.tasks.unshift({
          _created: date.toLocaleString(),
          _updated: date.toLocaleString(),
          id: this.autoNumber,
          content: this.newTaskContent,
          isCompleted: false
        })
        this.autoNumber = this.autoNumber + 1
        this.newTaskContent = ''
      }
    },
    deleteTask(task) {
      const index = this.tasks.findIndex((item) => item.id === task.id)
      this.tasks.splice(index, 1)
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

.field-task-new {
  position: fixed;
  z-index: 1;
  left: 0;
  right: 0;
  bottom: 0px;
  backdrop-filter: blur(4px);
  & ::v-deep .v-icon {
    color: white !important;
  }

  & ::v-deep input,
  & ::v-deep label {
    color: white !important;
  }
}

.field-task {
  margin-bottom: 10px;
  & ::v-deep .v-input__slot {
    background-color: var(--v-primary-lighten5) !important;
    box-shadow: none !important;
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
