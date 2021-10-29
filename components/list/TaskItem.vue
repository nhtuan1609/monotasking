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
          <span>{{ task.priority.name }} priority</span>
        </v-tooltip>
      </template>
      <v-list light dense>
        <v-list-item-group :value="priorityList.findIndex((item) => item.code === task.priority.code)">
          <v-list-item v-for="(priority, index) in priorityList" :key="index" @click="changePriority(task, priority)">
            <v-list-item-icon class="mr-2">
              <priority-icon small :priority="priority"></priority-icon>
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
          <span>{{ task.status.name }} status</span>
        </v-tooltip>
      </template>
      <v-list light dense>
        <v-list-item-group :value="statusList.findIndex((item) => item.code === task.status.code)">
          <v-list-item v-for="(status, index) in statusList" :key="index" @click="changeStatus(task, status)">
            <v-list-item-icon class="mr-2">
              <status-icon small :status="status"></status-icon>
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
            <v-btn
              class="justify-start mr-2"
              width="130"
              text
              outlined
              rounded
              small
              light
              v-on="{ ...tooltip, ...menu }"
            >
              <due-date-icon :due-date="task.dueDate" small left></due-date-icon>
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
    <v-menu transition="scale-transition" offset-y>
      <template #activator="{ on: menu, attrs }">
        <v-tooltip bottom>
          <template #activator="{ on: tooltip }">
            <v-btn
              class="justify-start"
              width="130"
              text
              outlined
              rounded
              small
              light
              v-bind="attrs"
              v-on="{ ...tooltip, ...menu }"
            >
              <v-icon small left>mdi-view-grid-outline</v-icon>
              <span class="text-truncate" style="max-width: 96px">{{
                task.project && task.project.id ? task.project.name : 'No project'
              }}</span>
            </v-btn>
          </template>
          <span v-if="task.project && task.project.id">{{ task.project.name }} project</span>
          <span v-else>No project</span>
        </v-tooltip>
      </template>
      <v-list light dense>
        <v-list-item-group :value="projects.findIndex((item) => task.project && item.id === task.project.id)">
          <v-list-item @click="changeProject(task, undefined)">
            <v-list-item-icon class="mr-2">
              <v-icon small>mdi-view-grid-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title>No project</v-list-item-title>
          </v-list-item>

          <v-list-item v-for="(project, index) in projects" :key="index" @click="changeProject(task, project)">
            <v-list-item-icon class="mr-2">
              <v-icon small>mdi-view-grid-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ project.name }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-menu>

    <!-- created date -->
    <v-tooltip bottom>
      <template #activator="{ on, attrs }">
        <v-btn class="created-date" width="100" text small outlined :ripple="false" light v-bind="attrs" v-on="on">
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
import DueDateIcon from '~/components/common/DueDateIcon.vue'

export default {
  name: 'TaskItem',
  components: { PriorityIcon, StatusIcon, DueDateIcon },
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
    },
    projects() {
      return this.$store.getters['projects/getProjects']
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
    },
    changeProject(task, project) {
      this.$store.dispatch('tasks/changeProject', { task, project })
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
  font-weight: bold;
}
.task .v-btn {
  text-transform: unset;
}
.task .created-date {
  justify-content: flex-end;
  padding-right: 4px;
  border: none;
  &::before {
    background-color: transparent !important;
  }
}
</style>
