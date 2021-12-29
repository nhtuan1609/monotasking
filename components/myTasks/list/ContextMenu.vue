<template>
  <v-menu
    v-model="isShowContextMenuTemp"
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
      <v-menu :key="'status-' + selectedTask.id" min-width="100" offset-x nudge-top="8" open-on-hover>
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
          @selected="$parent.isShowContextMenu = false"
        ></status-select-menu>
      </v-menu>

      <!-- change assignee -->
      <v-menu :key="'assignee-' + selectedTask.id" min-width="100" offset-x nudge-top="8" open-on-hover>
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
          @selected="$parent.isShowContextMenu = false"
        ></assignee-select-menu>
      </v-menu>

      <!-- change priority -->
      <v-menu :key="'priority-' + selectedTask.id" min-width="100" offset-x nudge-top="8" open-on-hover>
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
          @selected="$parent.isShowContextMenu = false"
        ></priority-select-menu>
      </v-menu>

      <!-- change label -->
      <v-menu :key="'label-' + selectedTask.id" min-width="100" offset-x nudge-top="8" open-on-hover>
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
          @selected="$parent.isShowContextMenu = false"
        ></label-select-menu>
      </v-menu>

      <!-- change project -->
      <v-menu :key="'project-' + selectedTask.id" min-width="100" offset-x nudge-top="8" open-on-hover>
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
          @selected="$parent.isShowContextMenu = false"
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
          @change="changeDueDate"
        >
          <v-spacer></v-spacer>
          <v-btn text @click="changeDueDate()">Clear</v-btn>
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
            <v-form ref="form">
              <h4>New name</h4>
              <v-text-field v-model="newTaskName" outlined dense autofocus :rules="[$rules.required]"></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions class="pa-4">
            <v-spacer></v-spacer>
            <v-btn text outlined plain @click="cancelRename">Cancel</v-btn>
            <v-btn elevation="0" color="primary" @click="changeName">Confirm</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- delete task -->
      <v-divider class="my-2"></v-divider>
      <v-list-item @click="deleteTask">
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
import StatusSelectMenu from '~/components/common/StatusSelectMenu.vue'
import PrioritySelectMenu from '~/components/common/PrioritySelectMenu.vue'
import ProjectSelectMenu from '~/components/common/ProjectSelectMenu.vue'
import AssigneeSelectMenu from '~/components/common/AssigneeSelectMenu.vue'
import LabelSelectMenu from '~/components/common/LabelSelectMenu.vue'

export default {
  name: 'ContextMenu',
  components: {
    StatusSelectMenu,
    PrioritySelectMenu,
    ProjectSelectMenu,
    AssigneeSelectMenu,
    LabelSelectMenu
  },
  props: {
    isShowContextMenu: {
      type: Boolean,
      required: true
    },
    selectedTask: {
      type: Object,
      required: true
    },
    menuX: {
      type: Number,
      default: 0
    },
    menuY: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isShowContextMenuTemp: false,
      datePickerDueDate: false,
      isShowRenameDialog: false,
      newTaskName: ''
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
  watch: {
    isShowRenameDialog(newValue) {
      if (newValue) {
        this.newTaskName = this.selectedTask.name
      }
    },
    isShowContextMenu(newValue) {
      this.isShowContextMenuTemp = newValue
    },
    isShowContextMenuTemp(newValue) {
      if (!newValue) {
        this.$parent.isShowContextMenu = newValue
      }
    }
  },
  methods: {
    /**
     * produce change due date for selected task
     * @param {object} task - due date information which is selected
     * @return {void}
     */
    changeDueDate(dueDate = '') {
      if (dueDate === this.selectedTask.dueDate) return

      this.$store.dispatch('tasks/updateTask', {
        id: this.selectedTask.id,
        data: { dueDate },
        activityType: TASK.ACTIVITY_TYPE.CHANGE_DUE_DATE
      })
      this.$parent.isShowContextMenu = false
      this.datePickerDueDate = false
    },
    /**
     * produce delete selected task
     * @return {void}
     */
    deleteTask() {
      this.$store.dispatch('tasks/deleteTask', { id: this.selectedTask.id }).then(() => {
        this.$showSuccessNotification('Delete task successfully')
      })
      this.$parent.isShowContextMenu = false
    },
    /**
     * close rename dialog nad context menu
     * @return {void}
     */
    cancelRename() {
      this.isShowRenameDialog = false
      this.$parent.isShowContextMenu = false
    },
    /**
     * produce change name of selected task
     * @return {void}
     */
    changeName() {
      if (!this.$refs.form.validate()) return

      const validatedName = this.newTaskName.trim()
      if (validatedName && validatedName !== this.selectedTask.name) {
        this.$store.dispatch('tasks/updateTask', {
          id: this.selectedTask.id,
          data: { name: validatedName },
          activityType: TASK.ACTIVITY_TYPE.CHANGE_NAME
        })
      }

      this.isShowRenameDialog = false
      this.$parent.isShowContextMenu = false
    }
  }
}
</script>

<style lang="scss" scoped></style>
