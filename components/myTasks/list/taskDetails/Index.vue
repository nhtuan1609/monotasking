<template>
  <div class="pa-3">
    <v-row v-if="!isLoading">
      <v-col cols="12" md="8">
        <v-card v-if="!isEditing" light class="max-height customized-scrollbar background">
          <v-card-title class="task__namespace">
            Monotasking
            <v-spacer></v-spacer>
            <v-btn plain icon @click="editTask">
              <v-icon>mdi-pencil-outline</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-title class="task__title">{{ task.name }}</v-card-title>
          <v-card-text>
            <h3>Description</h3>
            <span>{{ task.description }}</span>
          </v-card-text>
          <v-card-text>
            <h3>Activity</h3>
            <v-timeline class="timeline pt-2" align-top dense>
              <v-timeline-item v-for="(activity, index) in activities" :key="index" color="primary" small>
                <v-card>
                  <v-card-subtitle class="d-flex justify-space-between align-center py-2">
                    {{ activity._created ? activity._created.toDate().toLocaleString() : '' }}
                    <v-btn icon @click="deleteComment(activity)">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-card-subtitle>
                  <v-card-text>{{ activity.content }}</v-card-text>
                </v-card>
              </v-timeline-item>

              <v-timeline-item color="primary" small>
                <v-card>
                  <v-card-text>
                    <v-textarea
                      v-model="content"
                      class="textarea__default"
                      placeholder="Leave a comment..."
                      rows="3"
                      auto-grow
                      outlined
                      hide-details
                    ></v-textarea>
                    <div class="d-flex justify-end mt-2">
                      <v-btn elevation="0" color="primary" @click="addComment">Comment</v-btn>
                    </div>
                  </v-card-text>
                </v-card>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
        <v-card v-else light class="max-height customized-scrollbar background">
          <v-card-title class="task__namespace">
            Monotasking
            <v-spacer></v-spacer>
            <v-btn text outlined @click="isEditing = false">Cancel</v-btn>
            <v-btn class="ml-3" elevation="0" color="primary" @click="changeTaskInformation">Save</v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-textarea
              v-model="editedTaskName"
              class="textarea__default task__title"
              rows="1"
              placeholder="Task name..."
              auto-grow
              outlined
              hide-details
            ></v-textarea>
            <v-textarea
              v-model="editedTaskDescription"
              class="textarea__default"
              placeholder="Task description..."
              rows="1"
              auto-grow
              outlined
              hide-details
            ></v-textarea>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <overall-information :task="task" class="max-height customized-scrollbar background"></overall-information>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import OverallInformation from '~/components/myTasks/list/taskDetails/OverallInformation.vue'

export default {
  name: 'TaskDetails',
  components: {
    OverallInformation
  },
  props: {
    taskId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isLoading: true,
      content: '',
      isEditing: false
    }
  },
  computed: {
    task() {
      return this.$store.getters['tasks/getCurrentTask']
    },
    activities() {
      return this.$store.getters['tasks/getCurrentActivities']
    }
  },
  watch: {
    task() {
      this.isLoading = false
    }
  },
  created() {
    this.$store.dispatch('tasks/setCurrentTaskRef', { id: this.taskId })
    this.$store.dispatch('tasks/setCurrentActivitiesRef', { id: this.taskId })
  },
  methods: {
    addComment() {
      this.$store.dispatch('tasks/addComment', { taskId: this.task.id, content: this.content })
      this.content = ''
    },
    deleteComment(activity) {
      this.$store.dispatch('tasks/deleteComment', { taskId: this.task.id, id: activity.id })
    },
    editTask() {
      this.editedTaskName = this.task.name
      this.editedTaskDescription = this.task.description
      this.isEditing = true
    },
    changeTaskInformation() {
      const data = {
        name: this.editedTaskName,
        description: this.editedTaskDescription
      }
      this.$store.dispatch('tasks/updateTask', { id: this.task.id, data })
      this.isEditing = false
    }
  }
}
</script>

<style lang="scss" scoped>
.max-height {
  max-height: calc(100vh - (var(--height-application-header) + var(--height-page-title) + 24px));
  overflow-y: auto;
}
.background {
  background-color: var(--background-color);
}
.timeline {
  &::before {
    left: 11px !important;
    display: none;
  }
  & ::v-deep .v-timeline-item__divider {
    min-width: 40px;
    justify-content: flex-start;
  }
  & ::v-deep .v-timeline-item__body {
    max-width: unset;
  }
  .v-timeline-item {
    position: relative;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 11px;
      width: 0;
      height: 100%;
      border-left: 1px solid var(--v-_base-darken2);
    }
    .v-card::before,
    .v-card::after {
      display: none;
    }
  }
  .v-timeline-item:last-child {
    padding-bottom: 0;
    &::before {
      display: none;
    }
  }
}
.textarea__default::v-deep {
  & fieldset {
    border: none;
    padding: 0;
  }
  .v-input__slot {
    padding: 0 !important;
  }
  & textarea {
    margin: 0 !important;
  }
}
.task__namespace {
  height: 60px;
  padding: 0 16px;
  font-size: 18px;
}
.task__title {
  font-size: 28px;
  font-weight: bold;
}
</style>
