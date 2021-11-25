<template>
  <v-card light>
    <v-card-title>Overall information</v-card-title>

    <!-- status -->
    <v-card-text class="details-item">
      <span class="details-item__title">Status</span>
      <v-menu transition="scale-transition" offset-y>
        <template #activator="{ on: menu, attrs }">
          <v-tooltip bottom>
            <template #activator="{ on: tooltip }">
              <v-btn class="details-item__button" text small v-bind="attrs" v-on="{ ...tooltip, ...menu }">
                <status-icon small left :status="task.status"></status-icon>
                {{ task.status.name }}
              </v-btn>
            </template>
            <span>{{ task.status.name }} status</span>
          </v-tooltip>
        </template>
        <status-select-menu :statuses="statuses" :task="task"></status-select-menu>
      </v-menu>
    </v-card-text>

    <!-- priority -->
    <v-card-text class="details-item">
      <span class="details-item__title">Priority</span>
      <v-menu transition="scale-transition" offset-y>
        <template #activator="{ on: menu, attrs }">
          <v-tooltip bottom>
            <template #activator="{ on: tooltip }">
              <v-btn class="details-item__button" text small v-bind="attrs" v-on="{ ...tooltip, ...menu }">
                <priority-icon small left :priority="task.priority"></priority-icon>
                {{ task.priority.name }}
              </v-btn>
            </template>
            <span>{{ task.priority.name }} priority</span>
          </v-tooltip>
        </template>
        <priority-select-menu :priorities="priorities" :task="task"></priority-select-menu>
      </v-menu>
    </v-card-text>

    <!-- assignee -->
    <v-card-text class="details-item">
      <span class="details-item__title">Assignee</span>
      <v-menu transition="scale-transition" offset-y>
        <template #activator="{ on: menu, attrs }">
          <v-tooltip bottom>
            <template #activator="{ on: tooltip }">
              <v-btn class="details-item__button" text small v-bind="attrs" v-on="{ ...tooltip, ...menu }">
                <v-avatar
                  v-if="task.assignee && task.assignee.id"
                  class="ml-n1 mr-1"
                  size="20"
                  :color="task.assignee.color"
                  v-bind="attrs"
                  v-on="{ ...tooltip, ...menu }"
                >
                  <span class="white--text" style="font-size: 10px">{{ task.assignee.shortName }}</span>
                </v-avatar>
                <v-icon v-else size="22" left v-bind="attrs" v-on="{ ...tooltip, ...menu }">mdi-account-circle</v-icon>
                <span v-if="task.assignee && task.assignee.id">{{ task.assignee.name }}</span>
                <span v-else>Unassigned</span>
              </v-btn>
            </template>
            <span v-if="task.assignee && task.assignee.id">Assigned to {{ task.assignee.name }}</span>
            <span v-else>Unassigned</span>
          </v-tooltip>
        </template>
        <assignee-select-menu :members="members" :task="task"></assignee-select-menu>
      </v-menu>
    </v-card-text>

    <!-- label -->
    <v-card-text class="details-item">
      <span class="details-item__title">Label</span>
      <v-menu transition="scale-transition" offset-y>
        <template #activator="{ on: menu, attrs }">
          <v-tooltip bottom>
            <template #activator="{ on: tooltip }">
              <v-btn class="details-item__button" text small v-bind="attrs" v-on="{ ...tooltip, ...menu }">
                <v-avatar v-if="task.label.name" class="mr-2" :color="task.label.color" size="10"></v-avatar>
                <v-icon v-else small left>mdi-plus</v-icon>
                <span class="text-truncate" style="max-width: 140px">{{
                  task.label.name ? task.label.name : 'Add label'
                }}</span>
              </v-btn>
            </template>
            <span v-if="task.label && task.label.name">{{ task.label.name }} label</span>
            <span>No label</span>
          </v-tooltip>
        </template>
        <label-select-menu :labels="labels" :task="task"></label-select-menu>
      </v-menu>
    </v-card-text>

    <!-- project -->
    <v-card-text class="details-item">
      <span class="details-item__title">Project</span>
      <v-menu transition="scale-transition" offset-y>
        <template #activator="{ on: menu, attrs }">
          <v-tooltip bottom>
            <template #activator="{ on: tooltip }">
              <v-btn class="details-item__button" text small v-bind="attrs" v-on="{ ...tooltip, ...menu }">
                <v-icon v-if="task.project && task.project.id" small left>mdi-view-grid-outline</v-icon>
                <v-icon v-else small left>mdi-plus</v-icon>
                <span class="text-truncate" style="max-width: 140px">{{
                  task.project && task.project.id ? task.project.name : 'Add project'
                }}</span>
              </v-btn>
            </template>
            <span v-if="task.project && task.project.id">{{ task.project.name }} project</span>
            <span v-else>No project</span>
          </v-tooltip>
        </template>
        <project-select-menu :projects="projects" :task="task"></project-select-menu>
      </v-menu>
    </v-card-text>

    <!-- due date -->
    <v-card-text class="details-item">
      <span class="details-item__title">Due date</span>
      <v-dialog v-model="datePickerDueDate" max-width="290px">
        <template #activator="{ on: menu, attrs }">
          <v-tooltip bottom>
            <template #activator="{ on: tooltip }">
              <v-btn class="details-item__button" text small v-bind="attrs" v-on="{ ...tooltip, ...menu }">
                <due-date-icon v-if="task.dueDate" small left :due-date="task.dueDate"></due-date-icon>
                <v-icon v-else small left>mdi-plus</v-icon>
                <span>{{ task.dueDate ? $formatDate(new Date(task.dueDate)) : 'Set due date' }}</span>
              </v-btn>
            </template>
            <span v-if="task.dueDate">Due on {{ $formatDate(new Date(task.dueDate)) }}</span>
            <span v-else>No due date</span>
          </v-tooltip>
        </template>
        <v-date-picker
          color="primary"
          light
          no-title
          :value="task.dueDate"
          @input="datePickerDueDate = false"
          @change="changeDueDate"
        >
          <v-spacer></v-spacer>
          <v-btn text @click="changeDueDate('')">Clear</v-btn>
        </v-date-picker>
      </v-dialog>
    </v-card-text>
  </v-card>
</template>

<script>
import { TASK } from '~/constants/task.js'
import StatusIcon from '~/components/common/StatusIcon.vue'
import PriorityIcon from '~/components/common/PriorityIcon.vue'
import DueDateIcon from '~/components/common/DueDateIcon.vue'
import StatusSelectMenu from '~/components/common/StatusSelectMenu.vue'
import PrioritySelectMenu from '~/components/common/PrioritySelectMenu.vue'
import AssigneeSelectMenu from '~/components/common/AssigneeSelectMenu.vue'
import LabelSelectMenu from '~/components/common/LabelSelectMenu.vue'
import ProjectSelectMenu from '~/components/common/ProjectSelectMenu.vue'

export default {
  name: 'OverallInformation',
  components: {
    StatusIcon,
    PriorityIcon,
    DueDateIcon,
    StatusSelectMenu,
    PrioritySelectMenu,
    AssigneeSelectMenu,
    LabelSelectMenu,
    ProjectSelectMenu
  },
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
    statuses() {
      return Object.values(TASK.STATUS)
    },
    priorities() {
      return Object.values(TASK.PRIORITY)
    },
    members() {
      return this.$store.getters['members/getMembers']
    },
    labels() {
      return this.$store.getters['labels/getLabels']
    },
    projects() {
      return this.$store.getters['projects/getProjects']
    }
  },
  methods: {
    changeDueDate(dueDate) {
      this.$store.dispatch('tasks/updateTask', { id: this.task.id, data: { dueDate } })
      this.datePickerDueDate = false
    }
  }
}
</script>

<style lang="scss" scoped>
.details-item {
  display: flex;
  align-items: center;
  .details-item__title {
    min-width: 100px;
    font-size: 14px;
    font-weight: bold;
  }
  .details-item__button {
    min-width: 160px;
    justify-content: start;
    text-transform: unset;
    font-size: 14px;
  }
}
</style>
