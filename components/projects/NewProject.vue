<template>
  <v-dialog :value="isShow" persistent width="800">
    <v-card light class="pa-0">
      <v-card-title class="primary white--text py-2 px-4">Add new project</v-card-title>
      <v-card-text class="pa-4">
        <v-form ref="form">
          <h4>Name</h4>
          <v-text-field v-model="newProject.name" outlined dense :rules="[$rules.required]"></v-text-field>
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
            <!-- status -->
            <v-menu transition="scale-transition" offset-y>
              <template #activator="{ on, attrs }">
                <v-btn class="button__setting" light small elevation="0" v-bind="attrs" v-on="on">
                  <project-status-icon small left :status="newProject.status"></project-status-icon>
                  {{ newProject.status.name }}
                </v-btn>
              </template>
              <project-status-select-menu
                :statuses="statuses"
                :project="newProject"
                @selected="(data) => changeDetails(data, 'status')"
              ></project-status-select-menu>
            </v-menu>

            <!-- leader -->
            <v-menu transition="scale-transition" offset-y>
              <template #activator="{ on, attrs }">
                <v-btn class="button__setting" light small elevation="0" v-bind="attrs" v-on="on">
                  <v-avatar v-if="newProject.assignee.id" class="mr-2" size="18" :color="newProject.assignee.color">
                    <span class="white--text" style="font-size: 8px">{{ newProject.assignee.shortName }}</span>
                  </v-avatar>
                  <v-icon v-else small left>mdi-account-circle</v-icon>
                  <span v-if="newProject.assignee.name">{{ newProject.assignee.name }}</span>
                  <span v-else>Unassigned</span>
                </v-btn>
              </template>
              <assignee-select-menu
                :members="members"
                :task="newProject"
                @selected="(data) => changeDetails(data, 'assignee')"
              ></assignee-select-menu>
            </v-menu>

            <!-- start date -->
            <v-menu
              v-model="datePickerStartDate"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template #activator="{ on }">
                <v-btn class="button__setting" light small elevation="0" v-on="on">
                  <v-icon v-if="!newProject.startDate" small left>mdi-calendar </v-icon>
                  <due-date-icon v-else small left :due-date="newProject.startDate"></due-date-icon>
                  <span v-if="newProject.startDate">{{ $formatDate(new Date(newProject.startDate)) }}</span>
                  <span v-else>Set Start Date</span>
                </v-btn>
              </template>
              <v-date-picker
                color="primary"
                light
                no-title
                :value="newProject.startDate"
                @input="datePickerStartDate = false"
                @change="changeStartDate"
              >
                <v-spacer></v-spacer>
                <v-btn text @click="changeStartDate()">Clear</v-btn>
              </v-date-picker>
            </v-menu>
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn text outlined plain @click="closeDialog">Cancel</v-btn>
        <v-btn elevation="0" color="primary" @click="addNewProject">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import 'codemirror/lib/codemirror.css'
import '@toast-ui/editor/dist/toastui-editor.css'
import { Editor } from '@toast-ui/vue-editor'
import { PROJECT } from '~/constants/project'
import ProjectStatusIcon from '~/components/common/ProjectStatusIcon.vue'
import DueDateIcon from '~/components/common/DueDateIcon.vue'
import ProjectStatusSelectMenu from '~/components/common/ProjectStatusSelectMenu.vue'
import AssigneeSelectMenu from '~/components/common/AssigneeSelectMenu.vue'

export default {
  name: 'NewProject',
  components: {
    Editor,
    ProjectStatusIcon,
    DueDateIcon,
    ProjectStatusSelectMenu,
    AssigneeSelectMenu
  },
  props: {
    isShow: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      newProject: {},
      datePickerStartDate: false
    }
  },
  computed: {
    defaultProject() {
      const date = new Date()
      return {
        name: '',
        description: '',
        status: { ...PROJECT.STATUS.PLANNED },
        startDate: date.toISOString().split('T')[0],
        assignee: {}
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
    statuses() {
      return Object.values(PROJECT.STATUS)
    },
    members() {
      return this.$store.getters['members/getMembers']
    }
  },
  created() {
    this.newProject = JSON.parse(JSON.stringify(this.defaultProject))
  },
  methods: {
    /**
     * emit event to close dialog
     * @return {void}
     */
    closeDialog() {
      this.newProject = JSON.parse(JSON.stringify(this.defaultProject))
      this.$refs.form.resetValidation()
      this.$emit('close')
    },
    /**
     * add new project
     * @return {void}
     */
    addNewProject() {
      if (!this.$refs.form.validate()) return

      const validatedName = this.newProject.name.trim()
      if (validatedName) {
        const description = this.$refs.editor.invoke('getMarkdown')
        this.$store
          .dispatch('projects/addProject', {
            ...this.newProject,
            name: validatedName,
            description
          })
          .then(() => {
            this.$showSuccessNotification('Create project successfully')
          })
      }

      this.$refs.editor.invoke('setMarkdown')
      this.closeDialog()
    },
    /**
     * change details of new project
     * @param {object} data - data information
     * @return {void}
     */
    changeDetails(data, key) {
      Object.assign(this.newProject[key], { ...data })
    },
    /**
     * produce change start date for new project
     * @param {string} startDate - start date information
     * @return {void}
     */
    changeStartDate(startDate = '') {
      this.newProject.startDate = startDate
      this.datePickerStartDate = false
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
