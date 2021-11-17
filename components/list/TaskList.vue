<template>
  <v-container>
    <wondering-card v-if="tasks.length === 0" class="task-list"></wondering-card>
    <div v-else class="task-list">
      <task-item
        v-for="(task, index) in tasks"
        :key="index"
        :task="task"
        :class="isShowContextMenu && selectedTask.id === task.id ? 'selecting' : isShowContextMenu && 'no-selecting'"
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
      z-index="9"
    >
      <v-list light dense>
        <!-- change status -->
        <v-menu min-width="100" offset-x nudge-top="8" open-on-hover>
          <template #activator="{ on, attrs }">
            <v-list-item v-bind="attrs" v-on="on">
              <v-list-item-icon class="mr-2">
                <v-icon small>mdi-circle-slice-4</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Status</v-list-item-title>
              <v-icon small>mdi-menu-right</v-icon>
            </v-list-item>
          </template>
          <status-select-menu
            :statuses="statuses"
            :task="selectedTask"
            @selected="isShowContextMenu = false"
          ></status-select-menu>
        </v-menu>

        <!-- change assignee -->
        <v-menu min-width="100" offset-x nudge-top="8" open-on-hover>
          <template #activator="{ on, attrs }">
            <v-list-item v-bind="attrs" v-on="on">
              <v-list-item-icon class="mr-2">
                <v-icon small>mdi-account-arrow-right</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Assignee</v-list-item-title>
              <v-icon small>mdi-menu-right</v-icon>
            </v-list-item>
          </template>
          <assignee-select-menu
            :members="members"
            :task="selectedTask"
            @selected="isShowContextMenu = false"
          ></assignee-select-menu>
        </v-menu>

        <!-- change priority -->
        <v-menu min-width="100" offset-x nudge-top="8" open-on-hover>
          <template #activator="{ on, attrs }">
            <v-list-item v-bind="attrs" v-on="on">
              <v-list-item-icon class="mr-2">
                <v-icon small>mdi-signal-cellular-3</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Priority</v-list-item-title>
              <v-icon small>mdi-menu-right</v-icon>
            </v-list-item>
          </template>
          <priority-select-menu
            :priorities="priorities"
            :task="selectedTask"
            @selected="isShowContextMenu = false"
          ></priority-select-menu>
        </v-menu>

        <!-- change label -->
        <v-menu min-width="100" offset-x nudge-top="8" open-on-hover>
          <template #activator="{ on, attrs }">
            <v-list-item v-bind="attrs" v-on="on">
              <v-list-item-icon class="mr-2">
                <v-icon small>mdi-label</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Labels</v-list-item-title>
              <v-icon small>mdi-menu-right</v-icon>
            </v-list-item>
          </template>
          <label-select-menu
            :labels="labels"
            :task="selectedTask"
            @selected="isShowContextMenu = false"
          ></label-select-menu>
        </v-menu>

        <!-- change project -->
        <v-menu min-width="100" offset-x nudge-top="8" open-on-hover>
          <template #activator="{ on, attrs }">
            <v-list-item v-bind="attrs" v-on="on">
              <v-list-item-icon class="mr-2">
                <v-icon small>mdi-view-grid-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Projects</v-list-item-title>
              <v-icon small>mdi-menu-right</v-icon>
            </v-list-item>
          </template>
          <project-select-menu
            :projects="projects"
            :task="selectedTask"
            @selected="isShowContextMenu = false"
          ></project-select-menu>
        </v-menu>

        <!-- change due date -->
        <v-dialog v-model="datePickerDueDate" max-width="290px">
          <template #activator="{ on, attrs }">
            <v-list-item v-bind="attrs" v-on="on">
              <v-list-item-icon class="mr-2">
                <v-icon small>mdi-calendar</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Change due date...</v-list-item-title>
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

        <!-- rename -->
        <v-dialog v-model="isShowRenameDialog" width="500">
          <template #activator="{ on, attrs }">
            <v-list-item v-bind="attrs" v-on="on">
              <v-list-item-icon class="mr-2">
                <v-icon small>mdi-pencil</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Rename...</v-list-item-title>
            </v-list-item>
          </template>
          <v-card light class="pa-0">
            <v-card-title class="primary white--text py-2 px-4">Change task name</v-card-title>
            <v-card-text class="pa-4">
              <h4>New name</h4>
              <v-text-field v-model="selectedTask.name" outlined dense autofocus hide-details></v-text-field>
            </v-card-text>
            <v-card-actions class="pa-4">
              <v-spacer></v-spacer>
              <v-btn text outlined plain @click="cancelRename">Cancel</v-btn>
              <v-btn elevation="0" color="primary" @click="changeName(selectedTask)">Confirm</v-btn>
            </v-card-actions>
          </v-card>
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
import StatusSelectMenu from '~/components/common/StatusSelectMenu.vue'
import PrioritySelectMenu from '~/components/common/PrioritySelectMenu.vue'
import ProjectSelectMenu from '~/components/common/ProjectSelectMenu.vue'
import AssigneeSelectMenu from '~/components/common/AssigneeSelectMenu.vue'
import LabelSelectMenu from '~/components/common/LabelSelectMenu.vue'

export default {
  name: 'TaskList',
  components: {
    WonderingCard,
    TaskItem,
    StatusSelectMenu,
    PrioritySelectMenu,
    ProjectSelectMenu,
    AssigneeSelectMenu,
    LabelSelectMenu
  },
  data() {
    return {
      isShowContextMenu: false,
      menuX: 0,
      menuY: 0,
      selectedTask: {},
      datePickerDueDate: false,
      isShowRenameDialog: false,
      newTaskContent: ''
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
    }
  },
  watch: {
    isShowRenameDialog(newValue) {
      if (newValue) {
        this.newTaskContent = this.selectedTask.content
      }
    }
  },
  created() {
    this.$store.dispatch('tasks/setTasksRef')
  },
  methods: {
    showContextMenu(event, task) {
      event.preventDefault()
      this.selectedTask = { ...task }
      this.menuX = event.clientX
      this.menuY = event.clientY
      this.isShowContextMenu = true
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
    },
    cancelRename() {
      this.isShowRenameDialog = false
      this.isShowContextMenu = false
    },
    changeName(task) {
      const validatedName = task.name.trim()
      if (validatedName) {
        this.$store.dispatch('tasks/changeName', { task })
      }
      this.isShowRenameDialog = false
      this.isShowContextMenu = false
    }
  }
}
</script>

<style lang="scss" scoped>
.task-list {
  margin: 60px auto 160px auto;
  .selecting {
    background-color: var(--v-primary-lighten2);
  }
  .no-selecting {
    background-color: var(--v-primary-lighten5);
  }
}

.task-content-chip {
  text-transform: unset;
  justify-content: flex-start;
  &::before {
    background-color: transparent !important;
  }
}
</style>
