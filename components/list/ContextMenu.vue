<template>
  <v-menu v-bind="$attrs">
    <v-list light dense>
      <!-- setting priority -->
      <v-menu min-width="100" offset-x nudge-top="8" open-on-hover>
        <template #activator="{ on, attrs }">
          <v-list-item v-bind="attrs" v-on="on" @click="$emit('close')">
            <v-list-item-icon class="mr-2">
              <v-icon small>mdi-signal-cellular-3</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Priority</v-list-item-title>
            <v-icon small>mdi-menu-right</v-icon>
          </v-list-item>
        </template>
        <v-list light dense>
          <v-list-item v-for="(priority, index) in priorityList" :key="index" @click="changePriority(task, priority)">
            <v-list-item-icon class="mr-2">
              <priority-icon small :priority="priority.code"></priority-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ priority.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- setting status -->
      <v-menu min-width="100" offset-x nudge-top="8" open-on-hover>
        <template #activator="{ on, attrs }">
          <v-list-item v-bind="attrs" v-on="on" @click="$emit('close')">
            <v-list-item-icon class="mr-2">
              <v-icon small>mdi-circle-slice-4</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Status</v-list-item-title>
            <v-icon small>mdi-menu-right</v-icon>
          </v-list-item>
        </template>
        <v-list light dense>
          <v-list-item v-for="(status, index) in statusList" :key="index" @click="changeStatus(task, status)">
            <v-list-item-icon class="mr-2">
              <status-icon small :status="status.code"></status-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ status.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- due date -->
      <v-menu v-model="datePickerDueDate">
        <template #activator="{ on: on }">
          <v-list-item v-on="on">
            <v-list-item-icon class="mr-2">
              <v-icon small>mdi-calendar</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Due date</v-list-item-title>
          </v-list-item>
        </template>
        <v-dialog v-model="datePickerDueDate" max-width="290px">
          <v-date-picker
            color="primary"
            light
            no-title
            :value="task.dueDate"
            @input="datePickerDueDate = false"
            @change="(date) => changeDueDate(task, date)"
          >
            <v-spacer></v-spacer>
            <v-btn text @click="clearDueDate(task)">Clear</v-btn>
          </v-date-picker>
        </v-dialog>
      </v-menu>

      <!-- delete task -->
      <v-divider class="my-2"></v-divider>
      <v-list-item @click="deleteTask(task)">
        <v-list-item-icon class="mr-2">
          <v-icon small>mdi-trash-can</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Delete</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { TASK } from '~/constants/task.js'
import PriorityIcon from '~/components/common/PriorityIcon.vue'
import StatusIcon from '~/components/common/StatusIcon.vue'

export default {
  name: 'ContextMenu',
  components: { PriorityIcon, StatusIcon },
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      datePickerDueDate: false
    }
  },
  computed: {
    priorityList() {
      return Object.values(TASK.PRIORITY)
    },
    statusList() {
      return Object.values(TASK.STATUS)
    }
  },
  methods: {
    changePriority(task, priority) {
      this.$store.dispatch('tasks/changePriority', { task, priority })
      this.$emit('close')
    },
    changeStatus(task, status) {
      this.$store.dispatch('tasks/changeStatus', { task, status })
      this.$emit('close')
    },
    changeDueDate(task, dueDate) {
      this.$store.dispatch('tasks/changeDueDate', { task, dueDate })
    },
    clearDueDate(task) {
      this.$store.dispatch('tasks/changeDueDate', { task, dueDate: '' })
      this.datePickerDueDate = false
    },
    deleteTask(task) {
      this.$store.dispatch('tasks/deleteTask', { task })
    }
  }
}
</script>
