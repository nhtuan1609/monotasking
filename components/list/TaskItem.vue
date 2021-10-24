<template>
  <v-text-field class="task" :value="task.content" hide-details readonly light solo dense>
    <template #prepend-inner>
      <v-menu transition="slide-y-transition" bottom>
        <template #activator="{ on: menu, attrs }">
          <v-tooltip bottom>
            <template #activator="{ on: tooltip }">
              <v-btn icon small v-bind="attrs" v-on="{ ...tooltip, ...menu }">
                <priority-icon small :priority="task.priority"></priority-icon>
              </v-btn>
            </template>
            <span>Set priority</span>
          </v-tooltip>
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

      <v-menu transition="slide-y-transition" bottom>
        <template #activator="{ on: menu, attrs }">
          <v-tooltip bottom>
            <template #activator="{ on: tooltip }">
              <v-btn icon small v-bind="attrs" v-on="{ ...tooltip, ...menu }">
                <status-icon small :status="task.status"></status-icon>
              </v-btn>
            </template>
            <span>Set status</span>
          </v-tooltip>
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
    </template>

    <template #append>
      <v-tooltip v-if="task.project" bottom>
        <template #activator="{ on, attrs }">
          <v-btn class="justify-start" width="140" text outlined rounded small v-bind="attrs" v-on="on">
            <v-icon small left>mdi-gamepad-circle</v-icon>
            <span class="text-truncate" style="max-width: 96px">{{ task.project }}</span>
          </v-btn>
        </template>
        <span>View {{ task.project }} project</span>
      </v-tooltip>

      <v-tooltip v-if="task.project" bottom>
        <template #activator="{ on, attrs }">
          <v-btn class="created-date" text small outlined :ripple="false" v-bind="attrs" v-on="on">
            {{ $formatDate(new Date(task._created)) }}
          </v-btn>
        </template>
        <span>Created {{ task._created }}</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn icon small v-bind="attrs" v-on="on" @click="deleteTask(task)">
            <v-icon small>mdi-close</v-icon>
          </v-btn>
        </template>
        <span>Delete task</span>
      </v-tooltip>
    </template>
  </v-text-field>
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
  & ::v-deep input {
    text-overflow: ellipsis;
  }
}
.v-btn {
  text-transform: unset;
}
.created-date {
  border: none;
  margin-left: 8px;
  &::before {
    background-color: transparent !important;
  }
}
</style>
