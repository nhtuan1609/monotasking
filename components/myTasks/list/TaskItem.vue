<template>
  <div
    class="task"
    @contextmenu="(event) => $emit('contextmenu', event)"
    @click="$router.push(`/myTasks/list/${task.id}`)"
  >
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
      <priority-select-menu :priorities="priorities" :task="task"></priority-select-menu>
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
      <status-select-menu :statuses="statuses" :task="task"></status-select-menu>
    </v-menu>

    <!-- content -->
    <span class="task-content">{{ task.name }}</span>

    <!-- label -->
    <v-menu v-if="task.label && task.label.id" transition="scale-transition" offset-y>
      <template #activator="{ on: menu, attrs }">
        <v-tooltip bottom>
          <template #activator="{ on: tooltip }">
            <v-btn
              class="justify-start mr-2"
              text
              outlined
              rounded
              small
              light
              v-bind="attrs"
              v-on="{ ...tooltip, ...menu }"
            >
              <v-avatar :color="task.label.color" size="10"></v-avatar>
              <span class="text-truncate ml-1" style="max-width: 96px">{{ task.label.name }}</span>
            </v-btn>
          </template>
          <span>{{ task.label.name }} Label</span>
        </v-tooltip>
      </template>
      <label-select-menu :labels="labels" :task="task"></label-select-menu>
    </v-menu>

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
        @change="changeDueDate"
      >
        <v-spacer></v-spacer>
        <v-btn text @click="changeDueDate()">Clear</v-btn>
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
              <v-icon v-if="task.project && task.project.id" small left>mdi-view-grid-outline</v-icon>
              <v-icon v-else small left>mdi-cancel</v-icon>
              <span class="text-truncate" style="max-width: 96px">{{
                task.project && task.project.id ? task.project.name : 'No project'
              }}</span>
            </v-btn>
          </template>
          <span v-if="task.project && task.project.id">{{ task.project.name }} project</span>
          <span v-else>No project</span>
        </v-tooltip>
      </template>
      <project-select-menu :projects="projects" :task="task"></project-select-menu>
    </v-menu>

    <!-- created date -->
    <v-tooltip bottom>
      <template #activator="{ on, attrs }">
        <v-btn class="created-date" width="100" text small outlined :ripple="false" light v-bind="attrs" v-on="on">
          {{ $formatDate(task._created ? task._created.toDate() : '') }}
        </v-btn>
      </template>
      <span>Created {{ task._created ? task._created.toDate().toLocaleString() : '' }}</span>
    </v-tooltip>

    <!-- assignee -->
    <v-menu transition="scale-transition" offset-y>
      <template #activator="{ on: menu, attrs }">
        <v-tooltip bottom>
          <template #activator="{ on: tooltip }">
            <v-btn icon light small v-bind="attrs" v-on="{ ...tooltip, ...menu }">
              <v-avatar
                v-if="task.assignee && task.assignee.id"
                size="20"
                :color="task.assignee.color"
                v-bind="attrs"
                v-on="{ ...tooltip, ...menu }"
              >
                <span class="white--text" style="font-size: 10px">{{ task.assignee.shortName }}</span>
              </v-avatar>
              <v-icon v-else size="22" v-bind="attrs" v-on="{ ...tooltip, ...menu }">mdi-account-circle</v-icon>
            </v-btn>
          </template>
          <span v-if="task.assignee && task.assignee.id">Assigned to {{ task.assignee.name }}</span>
          <span v-else>Unassigned</span>
        </v-tooltip>
      </template>
      <assignee-select-menu :members="members" :task="task"></assignee-select-menu>
    </v-menu>
  </div>
</template>

<script>
import { TASK } from '~/constants/task.js'
import PriorityIcon from '~/components/common/PriorityIcon.vue'
import StatusIcon from '~/components/common/StatusIcon.vue'
import DueDateIcon from '~/components/common/DueDateIcon.vue'
import StatusSelectMenu from '~/components/common/StatusSelectMenu.vue'
import PrioritySelectMenu from '~/components/common/PrioritySelectMenu.vue'
import ProjectSelectMenu from '~/components/common/ProjectSelectMenu.vue'
import AssigneeSelectMenu from '~/components/common/AssigneeSelectMenu.vue'
import LabelSelectMenu from '~/components/common/LabelSelectMenu.vue'

export default {
  name: 'TaskItem',
  components: {
    PriorityIcon,
    StatusIcon,
    DueDateIcon,
    StatusSelectMenu,
    PrioritySelectMenu,
    ProjectSelectMenu,
    AssigneeSelectMenu,
    LabelSelectMenu
  },
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
    priorities() {
      return Object.values(TASK.PRIORITY)
    },
    statuses() {
      return Object.values(TASK.STATUS)
    },
    projects() {
      return this.$store.getters['projects/getProjects']
    },
    members() {
      return this.$store.getters['members/getMembers']
    },
    labels() {
      return this.$store.getters['labels/getLabels']
    }
  },
  methods: {
    /**
     * produce change due date of selected task
     * @param {object} dueDate - due date information which is selected
     * @return {void}
     */
    changeDueDate(dueDate = '') {
      this.$store.dispatch('tasks/updateTask', {
        id: this.task.id,
        data: { dueDate },
        activityType: TASK.ACTIVITY_TYPE.CHANGE_DUE_DATE
      })
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
  white-space: nowrap;
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
