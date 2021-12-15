<template>
  <v-container v-if="!isLoading">
    <!-- show wondering card if tasks length is 0 -->
    <wondering-card v-if="!tasks.length" class="task__wondering-card"></wondering-card>

    <!-- task list -->
    <v-data-table
      v-else
      class="task__list"
      light
      dense
      hide-default-header
      hide-default-footer
      group-by="status.code"
      :headers="headers"
      :items="tasks"
      :items-per-page="-1"
      :item-class="getItemClass"
      @contextmenu:row="showContextMenu"
      @click:row="toTaskDetails"
    >
      <!-- group header -->
      <template #[`group.header`]="{ group, items, toggle, isOpen }">
        <td :colspan="headers.length" class="group__header" @click="toggle">
          <v-btn icon small>
            <v-icon :class="[{ 'rotate--180': isOpen }]">mdi-chevron-down</v-icon>
          </v-btn>
          <span class="font-weight-bold">{{ statuses.find((item) => item.code === group).name }}</span>
          <span>{{ items.length }}</span>
        </td>
      </template>

      <!-- progress -->
      <template #[`item.checklist.progress`]="{ item }">
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-progress-circular
              :rotate="-90"
              :size="14"
              :width="3"
              :value="item.checklist ? item.checklist.progress : 0"
              color="primary"
              v-bind="attrs"
              v-on="on"
            >
            </v-progress-circular>
          </template>
          <span>Task progress {{ item.checklist ? item.checklist.progress : 0 }}%</span>
        </v-tooltip>
      </template>

      <!-- priority -->
      <template #[`item.priority.name`]="{ item }">
        <v-menu transition="scale-transition" offset-y>
          <template #activator="{ on: menu, attrs }">
            <v-tooltip bottom>
              <template #activator="{ on: tooltip }">
                <v-btn icon light small v-bind="attrs" v-on="{ ...tooltip, ...menu }">
                  <priority-icon small :priority="item.priority"></priority-icon>
                </v-btn>
              </template>
              <span>{{ item.priority.name }} priority</span>
            </v-tooltip>
          </template>
          <priority-select-menu :priorities="priorities" :task="item"></priority-select-menu>
        </v-menu>
      </template>

      <!-- status -->
      <template #[`item.status.name`]="{ item }">
        <v-menu transition="scale-transition" offset-y>
          <template #activator="{ on: menu, attrs }">
            <v-tooltip bottom>
              <template #activator="{ on: tooltip }">
                <v-btn icon light small v-bind="attrs" v-on="{ ...tooltip, ...menu }">
                  <status-icon small :status="item.status"></status-icon>
                </v-btn>
              </template>
              <span>{{ item.status.name }} status</span>
            </v-tooltip>
          </template>
          <status-select-menu :statuses="statuses" :task="item"></status-select-menu>
        </v-menu>
      </template>

      <!-- name -->
      <template #[`item.name`]="{ item }">
        <span class="item__name">{{ item.name }}</span>
      </template>

      <!-- others -->
      <template #[`item.others`]="{ item }">
        <!-- label -->
        <v-menu v-if="item.label && item.label.id" transition="scale-transition" offset-y>
          <template #activator="{ on: menu, attrs }">
            <v-tooltip bottom>
              <template #activator="{ on: tooltip }">
                <v-btn
                  class="justify-start"
                  text
                  outlined
                  rounded
                  small
                  light
                  v-bind="attrs"
                  v-on="{ ...tooltip, ...menu }"
                >
                  <v-avatar :color="item.label.color" size="10"></v-avatar>
                  <span class="text-truncate ml-1" style="max-width: 96px">{{ item.label.name }}</span>
                </v-btn>
              </template>
              <span>{{ item.label.name }} Label</span>
            </v-tooltip>
          </template>
          <label-select-menu :labels="labels" :task="item"></label-select-menu>
        </v-menu>

        <!-- due date -->
        <v-menu
          v-if="item.dueDate"
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
                  class="justify-start"
                  width="130"
                  text
                  outlined
                  rounded
                  small
                  light
                  v-on="{ ...tooltip, ...menu }"
                >
                  <due-date-icon :due-date="item.dueDate" small left></due-date-icon>
                  <span>{{ $formatDate(new Date(item.dueDate)) }}</span>
                </v-btn>
              </template>
              <span>Due on {{ $formatDate(new Date(item.dueDate)) }}</span>
            </v-tooltip>
          </template>
          <v-date-picker
            color="primary"
            light
            no-title
            :value="item.dueDate"
            @input="datePickerDueDate = false"
            @change="changeDueDate"
          >
            <v-spacer></v-spacer>
            <v-btn text @click="changeDueDate()">Clear</v-btn>
          </v-date-picker>
        </v-menu>
      </template>

      <!-- project -->
      <template #[`item.project.name`]="{ item }">
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
                  <v-icon v-if="item.project && item.project.id" small left>mdi-view-grid-outline</v-icon>
                  <v-icon v-else small left>mdi-cancel</v-icon>
                  <span class="text-truncate" style="max-width: 96px">{{
                    item.project && item.project.id ? item.project.name : 'No project'
                  }}</span>
                </v-btn>
              </template>
              <span v-if="item.project && item.project.id">{{ item.project.name }} project</span>
              <span v-else>No project</span>
            </v-tooltip>
          </template>
          <project-select-menu :projects="projects" :task="item"></project-select-menu>
        </v-menu>
      </template>

      <!-- name -->
      <template #[`item._created`]="{ item }">
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-btn
              class="button__created-date"
              width="100"
              text
              small
              outlined
              :ripple="false"
              light
              v-bind="attrs"
              v-on="on"
            >
              {{ $formatDate(item._created ? item._created.toDate() : '') }}
            </v-btn>
          </template>
          <span>Created {{ item._created ? item._created.toDate().toLocaleString() : '' }}</span>
        </v-tooltip>
      </template>

      <!-- name -->
      <template #[`item.assignee.name`]="{ item }">
        <v-menu transition="scale-transition" offset-y>
          <template #activator="{ on: menu, attrs }">
            <v-tooltip bottom>
              <template #activator="{ on: tooltip }">
                <v-btn icon light small v-bind="attrs" v-on="{ ...tooltip, ...menu }">
                  <v-avatar
                    v-if="item.assignee && item.assignee.id"
                    size="20"
                    :color="item.assignee.color"
                    v-bind="attrs"
                    v-on="{ ...tooltip, ...menu }"
                  >
                    <span class="white--text" style="font-size: 10px">{{ item.assignee.shortName }}</span>
                  </v-avatar>
                  <v-icon v-else size="22" v-bind="attrs" v-on="{ ...tooltip, ...menu }">mdi-account-circle</v-icon>
                </v-btn>
              </template>
              <span v-if="item.assignee && item.assignee.id">Assigned to {{ item.assignee.name }}</span>
              <span v-else>Unassigned</span>
            </v-tooltip>
          </template>
          <assignee-select-menu :members="members" :task="item"></assignee-select-menu>
        </v-menu>
      </template>
    </v-data-table>

    <!-- show context menu when right clicking on a task-->
    <context-menu
      :is-show-context-menu="isShowContextMenu"
      :menu-x="menuX"
      :menu-y="menuY"
      :selected-task="selectedTask"
    ></context-menu>
  </v-container>
</template>

<script>
import { TASK } from '~/constants/task.js'
import WonderingCard from '~/components/myTasks/list/WonderingCard.vue'
import ContextMenu from '~/components/myTasks/list/ContextMenu.vue'
import PriorityIcon from '~/components/common/PriorityIcon.vue'
import StatusIcon from '~/components/common/StatusIcon.vue'
import DueDateIcon from '~/components/common/DueDateIcon.vue'
import PrioritySelectMenu from '~/components/common/PrioritySelectMenu.vue'
import StatusSelectMenu from '~/components/common/StatusSelectMenu.vue'
import ProjectSelectMenu from '~/components/common/ProjectSelectMenu.vue'
import AssigneeSelectMenu from '~/components/common/AssigneeSelectMenu.vue'
import LabelSelectMenu from '~/components/common/LabelSelectMenu.vue'

export default {
  name: 'TaskList',
  components: {
    WonderingCard,
    ContextMenu,
    PriorityIcon,
    StatusIcon,
    DueDateIcon,
    PrioritySelectMenu,
    StatusSelectMenu,
    LabelSelectMenu,
    ProjectSelectMenu,
    AssigneeSelectMenu
  },
  data() {
    return {
      isShowContextMenu: false,
      menuX: 0,
      menuY: 0,
      selectedTask: {},
      isLoading: true
    }
  },
  computed: {
    tasks() {
      return this.$store.getters['tasks/getTasks']
    },
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
    },
    headers() {
      return [
        { text: 'Progress', value: 'checklist.progress' },
        { text: 'Priority', value: 'priority.name' },
        { text: 'Status', value: 'status.name' },
        { text: 'Name', value: 'name', cellClass: 'cell__name' },
        { text: 'Others', value: 'others', cellClass: 'cell__others' },
        { text: 'Project', value: 'project.name' },
        { text: 'Created', value: '_created' },
        { text: 'Assignee', value: 'assignee.name' }
      ]
    }
  },
  watch: {
    tasks() {
      this.isLoading = false
    }
  },
  created() {
    this.$store.dispatch('tasks/setTasksRef')
  },
  methods: {
    /**
     * produce show context menu for selected task
     * @param {object} event - right mouse click event
     * @param {object} task - task information which is selected
     * @return {void}
     */
    showContextMenu(event, { item }) {
      event.preventDefault()
      this.selectedTask = JSON.parse(JSON.stringify(item))
      this.menuX = event.clientX
      this.menuY = event.clientY
      this.isShowContextMenu = true
    },
    /**
     * get css class for selected task
     * @param {object} item - task information which is selected
     * @return {string}
     */
    getItemClass(item) {
      if (this.isShowContextMenu && this.selectedTask.id === item.id) {
        return 'item--selecting'
      }
    },
    /**
     * go to task details screen
     * @param {object} event - right mouse click event
     * @param {object} item - task object data
     * @return {void}
     */
    toTaskDetails(event, { item }) {
      this.$router.push(`/myTasks/list/${item.id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.task__wondering-card {
  margin: 60px auto 160px auto;
}

.task__list ::v-deep {
  .item--selecting {
    background-color: var(--v-primary-lighten2) !important;
  }

  .v-btn {
    text-transform: unset;
  }

  .item__name {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 6px;
    font-weight: bold;
  }

  .button__created-date {
    justify-content: flex-end;
    padding-right: 4px;
    border: none;
    &::before {
      background-color: transparent !important;
    }
  }

  .rotate--180 {
    transform: rotate(180deg);
  }

  & tbody > tr > td {
    padding: 0 4px !important;
    &:first-child {
      padding-left: 11px !important;
    }
    &:last-child {
      padding-right: 11px !important;
    }
    &.cell__name {
      width: 100%;
    }
    &.cell__others {
      white-space: nowrap;
      text-align: right;
    }
    &.group__header {
      padding: 0 4px !important;
      cursor: pointer;
    }
  }
}
</style>
