<template>
  <div class="pa-3">
    <v-row v-if="!isLoading">
      <!-- task name, description and activity -->
      <v-col cols="12" md="8">
        <!-- view mode -->
        <v-card v-if="!isEditing" light class="max-height customized-scrollbar background">
          <!-- workspace and header button -->
          <v-card-title class="task__namespace">
            Monotasking
            <v-spacer></v-spacer>
            <v-btn class="mr-2" icon @click="editTask">
              <v-icon>mdi-pencil-outline</v-icon>
            </v-btn>

            <v-menu min-width="200" bottom offset-y transition="slide-y-transition">
              <template #activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-horizontal</v-icon>
                </v-btn>
              </template>
              <v-list light dense>
                <v-list-item @click="deleteTask">
                  <v-list-item-icon class="mr-2">
                    <v-icon small>mdi-trash-can</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Delete</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-title>
          <v-divider></v-divider>

          <!-- task name -->
          <v-card-title class="task__title">{{ task.name }}</v-card-title>

          <!-- task description -->
          <v-card-text>
            <h3>Description</h3>
            <span>{{ task.description }}</span>
          </v-card-text>

          <!-- task activity -->
          <v-card-text>
            <h3>Activity</h3>
            <activity-timeline class="pt-2" :task="task" :activities="activities"></activity-timeline>
          </v-card-text>
        </v-card>

        <!-- edit mode -->
        <v-card v-else light class="max-height customized-scrollbar background">
          <!-- workspace and header button -->
          <v-card-title class="task__namespace">
            Monotasking
            <v-spacer></v-spacer>
            <v-btn text outlined @click="isEditing = false">Cancel</v-btn>
            <v-btn class="ml-3" elevation="0" color="primary" @click="changeTaskInformation">Save</v-btn>
          </v-card-title>
          <v-divider></v-divider>

          <!-- edit task name and description -->
          <v-card-text>
            <v-form ref="form">
              <v-textarea
                v-model="editedTaskName"
                class="textarea__default task__title"
                rows="1"
                placeholder="Task name..."
                auto-grow
                outlined
                :rules="[$rules.required]"
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
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- task overall information and progress summary -->
      <v-col cols="12" md="4">
        <v-card light class="max-height customized-scrollbar">
          <overall-information overall-information :task="task" class="background"></overall-information>
          <progress-summary class="background"></progress-summary>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { TASK } from '~/constants/task'
import OverallInformation from '~/components/myTasks/list/taskDetails/OverallInformation.vue'
import ActivityTimeline from '~/components/myTasks/list/taskDetails/ActivityTimeline.vue'
import ProgressSummary from '~/components/myTasks/list/taskDetails/ProgressSummary.vue'

export default {
  name: 'TaskDetails',
  components: {
    OverallInformation,
    ActivityTimeline,
    ProgressSummary
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
    editTask() {
      this.editedTaskName = this.task.name
      this.editedTaskDescription = this.task.description
      this.isEditing = true
    },
    changeTaskInformation() {
      if (!this.$refs.form.validate()) return

      const data = {
        name: this.editedTaskName,
        description: this.editedTaskDescription
      }
      this.$store.dispatch('tasks/updateTask', {
        id: this.task.id,
        data,
        activityType: TASK.ACTIVITY_TYPE.CHANGE_NAME
      })
      this.isEditing = false
    },
    deleteTask() {
      this.$store.dispatch('tasks/deleteTask', { id: this.task.id })
      this.$router.push('/myTasks/list')
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
  background-color: var(--color-background);
}
.textarea__default::v-deep {
  & fieldset {
    border: none;
    padding: 0;
  }
  .v-input__slot {
    min-height: unset;
    padding: 0 !important;
  }
  & textarea {
    margin: 0 !important;
  }
  .v-text-field__details {
    padding: 0;
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
