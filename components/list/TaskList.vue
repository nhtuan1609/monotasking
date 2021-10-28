<template>
  <v-container>
    <wondering-card v-if="tasks.length === 0" class="task-list"></wondering-card>
    <div v-else class="task-list">
      <task-item
        v-for="(task, index) in tasks"
        :key="index"
        :task="task"
        @contextmenu="(event) => showContextMenu(event, task)"
      ></task-item>
    </div>

    <v-menu
      v-model="isShowContextMenu"
      min-width="200"
      :position-x="menuX"
      :position-y="menuY"
      absolute
      transition="scale-transition"
      offset-y
    >
      <v-list light dense>
        <!-- change priority -->
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
            <v-list-item
              v-for="(priority, index) in priorityList"
              :key="index"
              @click="changePriority(selectedTask, priority)"
            >
              <v-list-item-icon class="mr-2">
                <priority-icon small :priority="priority.code"></priority-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ priority.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <!-- change status -->
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
            <v-list-item v-for="(status, index) in statusList" :key="index" @click="changeStatus(selectedTask, status)">
              <v-list-item-icon class="mr-2">
                <status-icon small :status="status.code"></status-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ status.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <!-- change due date -->
        <v-dialog v-model="datePickerDueDate" max-width="290px">
          <template #activator="{ on, attrs }">
            <v-list-item v-bind="attrs" v-on="on">
              <v-list-item-icon class="mr-2">
                <v-icon small>mdi-calendar</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Due date</v-list-item-title>
            </v-list-item>
          </template>
          <v-date-picker
            color="primary"
            light
            no-title
            :value="selectedTask.dueDate"
            @input="datePickerDueDate = false"
            @change="(date) => changeDueDate(selectedTask, date)"
          >
            <v-spacer></v-spacer>
            <v-btn text @click="clearDueDate(selectedTask)">Clear</v-btn>
          </v-date-picker>
        </v-dialog>

        <!-- delete task -->
        <v-divider class="my-2"></v-divider>
        <v-list-item @click="deleteTask(selectedTask)">
          <v-list-item-icon class="mr-2">
            <v-icon small>mdi-trash-can</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Delete</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-container>
</template>

<script>
import WonderingCard from '~/components/list/WonderingCard.vue'
import TaskItem from '~/components/list/TaskItem.vue'
import { TASK } from '~/constants/task.js'
import PriorityIcon from '~/components/common/PriorityIcon.vue'
import StatusIcon from '~/components/common/StatusIcon.vue'

export default {
  components: { WonderingCard, TaskItem, PriorityIcon, StatusIcon },
  data() {
    return {
      isShowContextMenu: false,
      menuX: 0,
      menuY: 0,
      selectedTask: {},
      datePickerDueDate: false
    }
  },
  computed: {
    tasks() {
      return this.$store.getters['tasks/getTasks']
    },
    priorityList() {
      return Object.values(TASK.PRIORITY)
    },
    statusList() {
      return Object.values(TASK.STATUS)
    }
  },
  methods: {
    showContextMenu(event, task) {
      event.preventDefault()
      this.selectedTask = { ...task }
      this.menuX = event.clientX
      this.menuY = event.clientY
      this.isShowContextMenu = true
    },
    changePriority(task, priority) {
      this.$store.dispatch('tasks/changePriority', { task, priority })
      this.isShowContextMenu = false
    },
    changeStatus(task, status) {
      this.$store.dispatch('tasks/changeStatus', { task, status })
      this.isShowContextMenu = false
    },
    changeDueDate(task, dueDate) {
      this.$store.dispatch('tasks/changeDueDate', { task, dueDate })
      this.isShowContextMenu = false
    },
    clearDueDate(task) {
      this.$store.dispatch('tasks/changeDueDate', { task, dueDate: '' })
      this.datePickerDueDate = false
      this.isShowContextMenu = false
    },
    deleteTask(task) {
      this.$store.dispatch('tasks/deleteTask', { task })
      this.isShowContextMenu = false
    }
  }
}
</script>

<style lang="scss" scoped>
.task-list {
  margin: 60px auto 160px auto;
}
</style>
