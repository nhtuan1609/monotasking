<template>
  <div class="task" @contextmenu="(event) => $emit('contextmenu', event)">
    <!-- priority -->
    <v-menu transition="scale-transition" offset-y>
      <template #activator="{ on: menu, attrs }">
        <v-tooltip bottom>
          <template #activator="{ on: tooltip }">
            <v-btn icon light small v-bind="attrs" v-on="{ ...tooltip, ...menu }">
              <priority-icon small :priority="task.priority"></priority-icon>
            </v-btn>
          </template>
          <span>Set priority</span>
        </v-tooltip>
      </template>
      <v-list light dense>
        <v-list-item-group :value="priorityList.findIndex((item) => item.code === task.priority)">
          <v-list-item v-for="(priority, index) in priorityList" :key="index" @click="changePriority(task, priority)">
            <v-list-item-icon class="mr-2">
              <priority-icon small :priority="priority.code"></priority-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ priority.name }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-menu>

    <!-- status -->
    <v-menu transition="scale-transition" offset-y>
      <template #activator="{ on: menu, attrs }">
        <v-tooltip bottom>
          <template #activator="{ on: tooltip }">
            <v-btn icon light small v-bind="attrs" v-on="{ ...tooltip, ...menu }">
              <status-icon small :status="task.status"></status-icon>
            </v-btn>
          </template>
          <span>Set status</span>
        </v-tooltip>
      </template>
      <v-list light dense>
        <v-list-item-group :value="statusList.findIndex((item) => item.code === task.status)">
          <v-list-item v-for="(status, index) in statusList" :key="index" @click="changeStatus(task, status)">
            <v-list-item-icon class="mr-2">
              <status-icon small :status="status.code"></status-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ status.name }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-menu>

    <!-- content -->
    <span class="task-content">{{ task.content }}</span>

    <!-- due date -->
    <v-menu
      v-if="task.dueDate"
      v-model="datePickerDueDate"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      min-width="290px"
    >
      <template #activator="{ on: menu }">
        <v-tooltip bottom>
          <template #activator="{ on: tooltip }">
            <v-btn class="mr-2" text outlined rounded small light v-on="{ ...tooltip, ...menu }">
              <v-icon small left>mdi-calendar</v-icon>
              <span>{{ $formatDate(new Date(task.dueDate)) }}</span>
            </v-btn>
          </template>
          <span>Due on {{ $formatDate(new Date(task.dueDate)) }}</span>
        </v-tooltip>
      </template>
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
    </v-menu>

    <!-- project -->
    <v-tooltip v-if="task.project" bottom>
      <template #activator="{ on, attrs }">
        <v-btn class="justify-start" width="140" text outlined rounded small light v-bind="attrs" v-on="on">
          <v-icon small left>mdi-view-grid-outline</v-icon>
          <span class="text-truncate" style="max-width: 96px">{{ task.project }}</span>
        </v-btn>
      </template>
      <span>View {{ task.project }} project</span>
    </v-tooltip>

    <!-- created date -->
    <v-tooltip bottom>
      <template #activator="{ on, attrs }">
        <v-btn class="created-date" text small outlined :ripple="false" light v-bind="attrs" v-on="on">
          {{ $formatDate(new Date(task._created)) }}
        </v-btn>
      </template>
      <span>Created {{ task._created }}</span>
    </v-tooltip>
  </div>
</template>

<script>
import { TASK } from '~/constants/task.js'
import PriorityIcon from '~/components/common/PriorityIcon.vue'
import StatusIcon from '~/components/common/StatusIcon.vue'

export default {
  name: 'TaskItem',
  components: { PriorityIcon, StatusIcon },
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      datePickerDueDate: false,
      dueDate: ''
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
    changePriority(task, priority) {
      this.$store.dispatch('tasks/changePriority', { task, priority })
    },
    changeStatus(task, status) {
      this.$store.dispatch('tasks/changeStatus', { task, status })
    },
    changeDueDate(task, dueDate) {
      this.$store.dispatch('tasks/changeDueDate', { task, dueDate })
    },
    clearDueDate(task) {
      this.$store.dispatch('tasks/changeDueDate', { task, dueDate: '' })
      this.datePickerDueDate = false
    }
  }
}
</script>

<style lang="scss" scoped>
.task {
  display: flex;
  align-items: center;
  cursor: pointer;
  height: 40px;
  padding: 0 6px;
  margin: 2px 0;
  border-radius: 4px;
  background-color: var(--v-primary-lighten5);
  &:hover {
    background-color: var(--v-primary-lighten2);
  }
}
.task .task-content {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 6px;
}
.task .v-btn {
  text-transform: unset;
}
.task .created-date {
  border: none;
  margin-left: 8px;
  &::before {
    background-color: transparent !important;
  }
}
</style>
