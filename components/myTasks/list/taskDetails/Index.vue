<template>
  <div class="pa-3">
    <v-row v-if="!isLoading">
      <v-col cols="12" md="8">
        <v-card light class="max-height customized-scrollbar background">
          <v-card-title>{{ task.name }}</v-card-title>
          <v-card-text>
            <h3>Description</h3>
            <span>Task desception...</span>
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
                      class="textarea__comment"
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
      content: ''
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
      this.$store.dispatch('tasks/addComment', { task: this.task, content: this.content })
      this.content = ''
    },
    deleteComment(activity) {
      this.$store.dispatch('tasks/deleteComment', { task: this.task, activity })
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
.textarea__comment::v-deep {
  & fieldset {
    border: none;
    padding: 0;
  }
  .v-input__slot {
    padding: 0 !important;
  }
  & textarea {
    // padding: 0 !important;
    margin: 0 !important;
  }
}
</style>
