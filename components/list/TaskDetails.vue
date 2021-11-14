<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8">
        <v-card light class="max-height customized-scrollbar">
          <v-card-title>{{ task.name }}</v-card-title>
          <v-card-text>
            <h3>Description</h3>
            <span>Task desception...</span>
          </v-card-text>
          <v-card-text>
            <h3>Activity</h3>
            <v-textarea placeholder="Leave a comment..." rows="3" auto-grow outlined hide-details></v-textarea>
            <div class="d-flex justify-end mt-2">
              <v-btn elevation="0" color="primary">Comment</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card light class="max-height customized-scrollbar">
          <v-card-title>Details</v-card-title>
          <v-card-text>
            <h3>Status</h3>
          </v-card-text>
          <v-card-text>
            <h3>Priority</h3>
          </v-card-text>
          <v-card-text>
            <h3>Assignee</h3>
          </v-card-text>
          <v-card-text>
            <h3>Label</h3>
          </v-card-text>
          <v-card-text>
            <v-divider></v-divider>
          </v-card-text>
          <v-card-text>
            <h3>Project</h3>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'TaskDetails',
  props: {
    taskId: {
      type: String,
      required: true
    }
  },
  computed: {
    task() {
      return this.$store.getters['tasks/getCurrentTask']
    }
  },
  created() {
    this.$store.dispatch('tasks/setCurrentTaskRef', { taskId: this.taskId })
  }
}
</script>

<style lang="scss" scoped>
.max-height {
  max-height: calc(100vh - (var(--height-application-header) + var(--height-page-title) + 24px));
  overflow-y: auto;
}
</style>
