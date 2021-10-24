<template>
  <v-text-field :value="task.content" class="task" cols="12" hide-details readonly light solo>
    <template #prepend-inner>
      <v-menu transition="slide-y-transition" bottom>
        <template #activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon v-if="task.priority === PRIORITY.LOW.code">mdi-signal-cellular-1</v-icon>
            <v-icon v-else-if="task.priority === PRIORITY.MEDIUM.code">mdi-signal-cellular-2</v-icon>
            <v-icon v-else-if="task.priority === PRIORITY.HIGH.code">mdi-signal-cellular-3</v-icon>
            <v-icon v-else-if="task.priority === PRIORITY.URGENT.code">mdi-alert-box</v-icon>
            <v-icon v-else>mdi-dots-horizontal</v-icon>
          </v-btn>
        </template>
        <v-list light dense>
          <v-list-item v-for="(priority, index) in priorityList" :key="index" @click="changePriority(task, priority)">
            <v-list-item-icon class="mr-4">
              <v-icon v-if="priority.code === PRIORITY.LOW.code">mdi-signal-cellular-1</v-icon>
              <v-icon v-else-if="priority.code === PRIORITY.MEDIUM.code">mdi-signal-cellular-2</v-icon>
              <v-icon v-else-if="priority.code === PRIORITY.HIGH.code">mdi-signal-cellular-3</v-icon>
              <v-icon v-else-if="priority.code === PRIORITY.URGENT.code">mdi-alert-box</v-icon>
              <v-icon v-else>mdi-dots-horizontal</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ priority.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-menu transition="slide-y-transition" bottom>
        <template #activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon v-if="task.status === STATUS.TODO.code">mdi-circle-outline</v-icon>
            <v-icon v-else-if="task.status === STATUS.IN_PROGRESS.code" color="orange">mdi-circle-slice-4</v-icon>
            <v-icon v-else-if="task.status === STATUS.IN_REVIEW.code" color="green">mdi-circle-slice-6</v-icon>
            <v-icon v-else-if="task.status === STATUS.DONE.code" color="indigo">mdi-checkbox-marked-circle</v-icon>
            <v-icon v-else-if="task.status === STATUS.CANCELED.code">mdi-close-circle</v-icon>
            <v-icon v-else>mdi-selection-ellipse</v-icon>
          </v-btn>
        </template>
        <v-list light dense>
          <v-list-item v-for="(status, index) in statusList" :key="index" @click="changeStatus(task, status)">
            <v-list-item-icon class="mr-4">
              <v-icon v-if="status.code === STATUS.TODO.code">mdi-circle-outline</v-icon>
              <v-icon v-else-if="status.code === STATUS.IN_PROGRESS.code" color="orange">mdi-circle-slice-4</v-icon>
              <v-icon v-else-if="status.code === STATUS.IN_REVIEW.code" color="green">mdi-circle-slice-6</v-icon>
              <v-icon v-else-if="status.code === STATUS.DONE.code" color="indigo">mdi-checkbox-marked-circle</v-icon>
              <v-icon v-else-if="status.code === STATUS.CANCELED.code">mdi-close-circle</v-icon>
              <v-icon v-else>mdi-selection-ellipse</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ status.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
    <template #append>
      <v-btn icon @click="deleteTask(task)">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-text-field>
</template>

<script>
import { TASK } from '~/constants/TASK.js'

export default {
  name: 'TaskItem',
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  computed: {
    priorityList() {
      return Object.values(TASK.PRIORITY)
    },
    PRIORITY() {
      return TASK.PRIORITY
    },
    statusList() {
      return Object.values(TASK.STATUS)
    },
    STATUS() {
      return TASK.STATUS
    }
  },
  methods: {
    deleteTask(task) {
      this.$store.dispatch('tasks/deleteTask', { task })
    },
    changePriority(task, priority) {
      this.$store.dispatch('tasks/changePriority', { task, priority })
    },
    changeStatus(task, status) {
      this.$store.dispatch('tasks/changeStatus', { task, status })
    }
  }
}
</script>

<style lang="scss" scoped>
.task {
  margin: 10px 0;
  & ::v-deep .v-input__slot {
    background-color: var(--v-primary-lighten5) !important;
    box-shadow: none !important;
  }
  & ::v-deep .v-input__slot:hover {
    background-color: var(--v-primary-lighten2) !important;
  }
}
</style>
