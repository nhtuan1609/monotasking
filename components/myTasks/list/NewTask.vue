<template>
  <v-dialog :value="isShow" persistent width="800">
    <v-card light class="pa-0">
      <v-card-title class="primary white--text py-2 px-4">Add new task</v-card-title>
      <v-card-text class="pa-4">
        <v-form ref="form">
          <h4>Name</h4>
          <v-text-field v-model="newTask.name" outlined dense :rules="[$rules.required]"></v-text-field>
          <h4>Description</h4>
          <editor
            ref="editor"
            class="editor--padding-bottom"
            initial-value=""
            :options="editorOptions"
            height="auto"
            initial-edit-type="wysiwyg"
            preview-style="vertical"
          ></editor>
          <div class="d-flex mt-8" style="gap: 8px">
            <!-- priority -->
            <v-menu transition="scale-transition" offset-y>
              <template #activator="{ on, attrs }">
                <v-btn class="button__setting" light small elevation="0" v-bind="attrs" v-on="on">
                  <priority-icon small left :priority="newTask.priority"></priority-icon>
                  Priority
                </v-btn>
              </template>
              <priority-select-menu
                :priorities="priorities"
                :task="newTask"
                @selected="(data) => changeDetails(data, 'priority')"
              ></priority-select-menu>
            </v-menu>

            <!-- status -->
            <v-menu transition="scale-transition" offset-y>
              <template #activator="{ on, attrs }">
                <v-btn class="button__setting" light small elevation="0" v-bind="attrs" v-on="on">
                  <status-icon small left :status="newTask.status"></status-icon>
                  Status
                </v-btn>
              </template>
              <status-select-menu
                :statuses="statuses"
                :task="newTask"
                @selected="(data) => changeDetails(data, 'status')"
              ></status-select-menu>
            </v-menu>

            <!-- status -->
            <v-menu transition="scale-transition" offset-y>
              <template #activator="{ on, attrs }">
                <v-btn class="button__setting" light small elevation="0" v-bind="attrs" v-on="on">
                  <v-avatar v-if="newTask.assignee.id" class="mr-2" size="18" :color="newTask.assignee.color">
                    <span class="white--text" style="font-size: 8px">{{ newTask.assignee.shortName }}</span>
                  </v-avatar>
                  <v-icon v-else small left>mdi-account-circle</v-icon>
                  <span v-if="newTask.assignee.name">{{ newTask.assignee.name }}</span>
                  <span v-else>Unassigned</span>
                </v-btn>
              </template>
              <assignee-select-menu
                :members="members"
                :task="newTask"
                @selected="(data) => changeDetails(data, 'assignee')"
              ></assignee-select-menu>
            </v-menu>

            <!-- label -->
            <v-menu transition="scale-transition" offset-y>
              <template #activator="{ on, attrs }">
                <v-btn class="button__setting" light small elevation="0" v-bind="attrs" v-on="on">
                  <v-avatar v-if="newTask.label.id" class="mr-2" :color="newTask.label.color" size="10"></v-avatar>
                  <v-icon v-else small left>mdi-plus</v-icon>
                  <span class="text-truncate" style="max-width: 140px">{{
                    newTask.label.name ? newTask.label.name : 'Add label'
                  }}</span>
                </v-btn>
              </template>
              <label-select-menu
                :labels="labels"
                :task="newTask"
                @selected="(data) => changeDetails(data, 'label')"
              ></label-select-menu>
            </v-menu>

            <!-- due date -->
            <v-menu
              v-model="datePickerDueDate"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template #activator="{ on }">
                <v-btn class="button__setting" light small elevation="0" v-on="on">
                  <v-icon v-if="!newTask.dueDate" small left>mdi-calendar </v-icon>
                  <due-date-icon v-else small left :due-date="newTask.dueDate"></due-date-icon>
                  <span v-if="newTask.dueDate">{{ $formatDate(new Date(newTask.dueDate)) }}</span>
                  <span v-else>Set due Date</span>
                </v-btn>
              </template>
              <v-date-picker
                color="primary"
                light
                no-title
                :value="newTask.dueDate"
                @input="datePickerDueDate = false"
                @change="changeDueDate"
              >
                <v-spacer></v-spacer>
                <v-btn text @click="changeDueDate()">Clear</v-btn>
              </v-date-picker>
            </v-menu>

            <!-- project -->
            <v-menu transition="scale-transition" offset-y>
              <template #activator="{ on, attrs }">
                <v-btn class="button__setting" light small elevation="0" v-bind="attrs" v-on="on">
                  <v-icon v-if="newTask.project.id" small left>mdi-view-grid-outline</v-icon>
                  <v-icon v-else small left>mdi-cancel</v-icon>
                  <span v-if="newTask.project.name">{{ newTask.project.name }}</span>
                  <span v-else>No project</span>
                </v-btn>
              </template>
              <project-select-menu
                :projects="projects"
                :task="newTask"
                @selected="(data) => changeDetails(data, 'project')"
              ></project-select-menu>
            </v-menu>
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn text outlined plain @click="closeDialog">Cancel</v-btn>
        <v-btn elevation="0" color="primary" @click="addNewTask">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import 'codemirror/lib/codemirror.css'
import '@toast-ui/editor/dist/toastui-editor.css'
import { Editor } from '@toast-ui/vue-editor'
import { TASK } from '~/constants/task'
import PriorityIcon from '~/components/common/PriorityIcon.vue'
import StatusIcon from '~/components/common/StatusIcon.vue'
import DueDateIcon from '~/components/common/DueDateIcon.vue'
import PrioritySelectMenu from '~/components/common/PrioritySelectMenu.vue'
import StatusSelectMenu from '~/components/common/StatusSelectMenu.vue'
import AssigneeSelectMenu from '~/components/common/AssigneeSelectMenu.vue'
import LabelSelectMenu from '~/components/common/LabelSelectMenu.vue'
import ProjectSelectMenu from '~/components/common/ProjectSelectMenu.vue'

export default {
  name: 'NewTask',
  components: {
    Editor,
    PriorityIcon,
    StatusIcon,
    DueDateIcon,
    PrioritySelectMenu,
    StatusSelectMenu,
    AssigneeSelectMenu,
    LabelSelectMenu,
    ProjectSelectMenu
  },
  props: {
    isShow: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      newTask: {},
      datePickerDueDate: false
    }
  },
  computed: {
    defaultTask() {
      return {
        name: '',
        description: '',
        priority: { ...TASK.PRIORITY.NO_PRIORITY },
        status: { ...TASK.STATUS.BACKLOG },
        dueDate: '',
        project: {},
        assignee: {},
        label: {},
        checklist: {
          _autoNumber: 0,
          checkedIds: [],
          items: [],
          progress: 0
        }
      }
    },
    editorOptions() {
      return {
        hideModeSwitch: true,
        toolbarItems: [
          'heading',
          'bold',
          'italic',
          'strike',
          'divider',
          'hr',
          'quote',
          'divider',
          'ul',
          'ol',
          'task',
          'divider',
          'image',
          'link'
        ]
      }
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
  created() {
    this.newTask = JSON.parse(JSON.stringify(this.defaultTask))
  },
  methods: {
    /**
     * emit event to close dialog
     * @return {void}
     */
    closeDialog() {
      this.newTask = JSON.parse(JSON.stringify(this.defaultTask))
      this.$refs.form.resetValidation()
      this.$emit('close')
    },
    /**
     * add new task item
     * @return {void}
     */
    addNewTask() {
      if (!this.$refs.form.validate()) return

      const validatedName = this.newTask.name.trim()
      if (validatedName) {
        const description = this.$refs.editor.invoke('getMarkdown')
        this.$store.dispatch('tasks/addTask', {
          ...this.newTask,
          name: validatedName,
          description
        })
      }

      this.$refs.editor.invoke('setMarkdown')
      this.closeDialog()
    },
    /**
     * change details of new task
     * @param {object} data - data information
     * @return {void}
     */
    changeDetails(data, key) {
      Object.assign(this.newTask[key], { ...data })
    },
    /**
     * produce change due date for new task
     * @param {object} task - due date information
     * @return {void}
     */
    changeDueDate(dueDate = '') {
      this.newTask.dueDate = dueDate
      this.datePickerDueDate = false
    }
  }
}
</script>

<style lang="scss" scoped>
.editor--padding-bottom ::v-deep {
  .tui-editor-contents {
    padding-bottom: 16px;
    min-height: unset !important;
  }
}

.button__setting {
  text-transform: unset !important;
}
</style>
