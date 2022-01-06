<template>
  <v-row v-if="!isLoading" class="pa-4">
    <v-col cols="12" md="6">
      <!-- view mode -->
      <v-card v-if="!isEditing" light>
        <!-- workspace and header button -->
        <v-card-title class="card__title">
          Monotasking
          <v-spacer></v-spacer>
          <v-btn class="mr-2" icon @click="editProject">
            <v-icon>mdi-pencil-outline</v-icon>
          </v-btn>

          <v-menu min-width="200" bottom offset-y transition="slide-y-transition">
            <template #activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-horizontal</v-icon>
              </v-btn>
            </template>
            <v-list light dense>
              <v-list-item @click="deleteProject">
                <v-list-item-icon class="mr-2">
                  <v-icon small>mdi-trash-can</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Delete</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-card-title>
        <v-divider></v-divider>

        <!-- project name -->
        <v-card-title class="project__name">{{ project.name }}</v-card-title>

        <!-- project description view mode -->
        <v-card-text>
          <div class="project__information">
            <h3>Description</h3>
            <span>{{ project.description }}</span>
          </div>

          <div class="project__information">
            <h3>Start date</h3>
            <span>{{ project.startDate ? $formatDate(new Date(project.startDate)) : '' }}</span>
          </div>

          <div class="project__information">
            <h3>Status</h3>
            <span>{{ project.status ? project.status.name : '' }}</span>
          </div>

          <div class="project__information">
            <h3>Leader</h3>
            <span>{{ project.assignee ? project.assignee.name : '' }}</span>
          </div>
        </v-card-text>
      </v-card>

      <!-- edit mode -->
      <v-card v-else light>
        <!-- workspace and header button -->
        <v-card-title class="card__title">
          Monotasking
          <v-spacer></v-spacer>
          <v-btn text outlined @click="isEditing = false">Cancel</v-btn>
          <v-btn class="ml-3" elevation="0" color="primary" @click="updateProject">Save</v-btn>
        </v-card-title>
        <v-divider></v-divider>

        <!-- project description edit mode -->
        <v-card-text>
          <v-form ref="form">
            <!-- name -->
            <v-textarea
              v-model="editedProject.name"
              class="textarea__default project__name"
              rows="1"
              placeholder="Task name..."
              auto-grow
              outlined
              :rules="[$rules.required]"
            ></v-textarea>

            <!-- description -->
            <div class="project__information">
              <h3>Description</h3>
              <v-textarea
                v-model="editedProject.description"
                class="textarea__default"
                placeholder="Task description..."
                rows="1"
                auto-grow
                outlined
                hide-details
              ></v-textarea>
            </div>

            <!-- start date -->
            <div class="project__information">
              <h3>Start date</h3>
              <v-dialog v-model="datePickerStartDate" max-width="290px">
                <template #activator="{ on: menu, attrs }">
                  <v-tooltip bottom>
                    <template #activator="{ on: tooltip }">
                      <v-btn
                        class="project__information-button"
                        text
                        small
                        v-bind="attrs"
                        v-on="{ ...tooltip, ...menu }"
                      >
                        <v-icon v-if="editedProject.startDate" small left>mdi-calendar</v-icon>
                        <v-icon v-else small left>mdi-plus</v-icon>
                        <span>{{
                          editedProject.startDate ? $formatDate(new Date(editedProject.startDate)) : 'Set due date'
                        }}</span>
                      </v-btn>
                    </template>
                    <span v-if="editedProject.startDate"
                      >Start date on {{ $formatDate(new Date(editedProject.startDate)) }}</span
                    >
                    <span v-else>No due date</span>
                  </v-tooltip>
                </template>
                <v-date-picker
                  v-model="editedProject.startDate"
                  color="primary"
                  light
                  no-title
                  @input="datePickerStartDate = false"
                  @change="changeStartDate"
                >
                  <v-spacer></v-spacer>
                  <v-btn text @click="changeStartDate()">Clear</v-btn>
                </v-date-picker>
              </v-dialog>
            </div>

            <!-- status -->
            <div class="project__information">
              <h3>Status</h3>
              <v-menu transition="scale-transition" offset-y>
                <template #activator="{ on: menu, attrs }">
                  <v-tooltip bottom>
                    <template #activator="{ on: tooltip }">
                      <v-btn
                        class="project__information-button"
                        text
                        small
                        v-bind="attrs"
                        v-on="{ ...tooltip, ...menu }"
                      >
                        <project-status-icon small left :status="editedProject.status"></project-status-icon>
                        {{ editedProject.status.name }}
                      </v-btn>
                    </template>
                    <span>{{ editedProject.status.name }} status</span>
                  </v-tooltip>
                </template>
                <project-status-select-menu
                  :statuses="statuses"
                  :project="editedProject"
                  @selected="(data) => changeDetails(data, 'status')"
                ></project-status-select-menu>
              </v-menu>
            </div>

            <!-- leader -->
            <div class="project__information">
              <h3>Leader</h3>
              <v-menu transition="scale-transition" offset-y>
                <template #activator="{ on: menu, attrs }">
                  <v-tooltip bottom>
                    <template #activator="{ on: tooltip }">
                      <v-btn
                        class="project__information-button"
                        text
                        small
                        v-bind="attrs"
                        v-on="{ ...tooltip, ...menu }"
                      >
                        <v-avatar
                          v-if="editedProject.assignee && editedProject.assignee.id"
                          style="margin-left: -2px; margin-right: 10px"
                          size="14"
                          :color="editedProject.assignee.color"
                          v-bind="attrs"
                          v-on="{ ...tooltip, ...menu }"
                        >
                          <span class="white--text" style="font-size: 8px">{{ editedProject.assignee.shortName }}</span>
                        </v-avatar>
                        <v-icon v-else small left v-bind="attrs" v-on="{ ...tooltip, ...menu }"
                          >mdi-account-circle</v-icon
                        >
                        <span v-if="editedProject.assignee && editedProject.assignee.id">{{
                          editedProject.assignee.name
                        }}</span>
                        <span v-else>Unassigned</span>
                      </v-btn>
                    </template>
                    <span v-if="editedProject.assignee && editedProject.assignee.id"
                      >Assigned to {{ editedProject.assignee.name }}</span
                    >
                    <span v-else>Unassigned</span>
                  </v-tooltip>
                </template>
                <assignee-select-menu
                  :members="members"
                  :task="editedProject"
                  @selected="(data) => changeDetails(data, 'assignee')"
                ></assignee-select-menu>
              </v-menu>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="6">
      <v-card light>
        <v-card-title class="card__title">Overall information</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" class="project__percentage">
              <v-progress-circular
                :rotate="-90"
                :size="80"
                :width="20"
                :value="projectDetails.details.progressPercentage"
                color="primary"
              >
                <span class="font-weight-bold">{{ projectDetails.details.progressPercentage }}%</span>
              </v-progress-circular>
            </v-col>
            <v-col cols="12" class="project__details">
              <div
                v-for="(status, statusIndex) in Object.values(TASK.STATUS)"
                :key="statusIndex"
                class="project__details-item"
              >
                <status-icon :status="{ code: status.code }"></status-icon>
                <span class="font-weight-bold">
                  {{ status.name }}
                  {{ projectDetails.details[`${status.key}`] }}/{{ projectDetails.details.total }}
                </span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { TASK } from '~/constants/task'
import { PROJECT } from '~/constants/project'
import StatusIcon from '~/components/common/StatusIcon.vue'
import ProjectStatusIcon from '~/components/common/ProjectStatusIcon.vue'
import ProjectStatusSelectMenu from '~/components/common/ProjectStatusSelectMenu.vue'
import AssigneeSelectMenu from '~/components/common/AssigneeSelectMenu.vue'

export default {
  name: 'ProjectDetails',
  components: { StatusIcon, ProjectStatusIcon, ProjectStatusSelectMenu, AssigneeSelectMenu },
  data() {
    return {
      isLoading: true,
      isEditing: false,
      editedProject: {},
      datePickerStartDate: false
    }
  },
  computed: {
    TASK() {
      return TASK
    },
    members() {
      return this.$store.getters['members/getMembers']
    },
    statuses() {
      return Object.values(PROJECT.STATUS)
    },
    project() {
      return this.$store.getters['projects/getCurrentProject']
    },
    tasks() {
      return this.$store.getters['tasks/getTasks']
    },
    projectDetails() {
      const defaultDetails = {}
      for (const status of Object.values(TASK.STATUS)) {
        defaultDetails[`${status.key}`] = 0
      }
      const tasks = this.tasks.filter((tasks) => tasks.project.id === this.project.id)
      const details = { ...defaultDetails, total: 0, progressPercentage: 0 }
      for (const task of tasks) {
        details.total = details.total + 1
        const status = Object.values(TASK.STATUS).find((status) => status.code === task.status.code)
        details[`${status.key}`] = details[`${status.key}`] + 1
      }
      if (details.total > 0) {
        details.progressPercentage = Math.floor((100 * (details.done + details.canceled)) / details.total)
      }
      return {
        ...this.project,
        details
      }
    }
  },
  watch: {
    project() {
      this.editedProject = {
        name: this.project.name,
        description: this.project.description,
        startDate: this.project.startDate,
        status: { ...this.project.status },
        assignee: { ...this.project.assignee }
      }
      this.isLoading = false
    }
  },
  created() {
    this.$store.dispatch('projects/setCurrentProjectRef', { id: this.$route.params.id })
    this.$store.dispatch('tasks/setTasksRef')
  },
  methods: {
    /**
     * change to edit mode to edit project information
     * @return {void}
     */
    editProject() {
      this.isEditing = true
    },
    /**
     * delete project based on id
     * @return {void}
     */
    deleteProject() {
      this.$router.push('/projects')
      this.$store.dispatch('projects/deleteProject', { id: this.project.id }).then(() => {
        this.$showSuccessNotification('Delete project successfully')
      })
    },
    /**
     * change start date of project
     * @param {string} startDate - start date information
     * @return {void}
     */
    changeStartDate(startDate = '') {
      this.editedProject.startDate = startDate
      this.datePickerStartDate = false
    },
    /**
     * change details of project
     * @param {object} data - data information
     * @param {string} key - object key which is updated
     * @return {void}
     */
    changeDetails(data, key) {
      Object.assign(this.editedProject[key], { ...data })
    },
    /**
     * update project information to firestore
     * @return {void}
     */
    updateProject() {
      if (!this.$refs.form.validate()) return
      if (
        this.editedProject.name === this.project.name &&
        this.editedProject.description === this.project.description &&
        this.editedProject.startDate === this.project.startDate &&
        this.editedProject.status?.code === this.project.status?.code &&
        this.editedProject.assignee?.id === this.project.assignee?.id
      )
        return

      this.$store.dispatch('projects/updateProject', {
        id: this.project.id,
        data: this.editedProject,
        activityType: PROJECT.ACTIVITY_TYPE.CHANGE_NAME
      })
      this.isEditing = false
    }
  }
}
</script>

<style lang="scss" scoped>
.card__title {
  height: 60px;
  padding: 0 16px;
  font-size: 18px;
}

.project__name {
  font-size: 28px;
  font-weight: bold;
}

.project__information {
  margin-top: 16px;
  &:first-child {
    margin-top: 0;
  }
}

.project__percentage {
  display: flex;
  align-items: center;
  justify-content: center;
}

.project__details {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px 0;
  &-item {
    min-width: 180px;
  }
}

.textarea__default::v-deep {
  & fieldset {
    border: none;
    padding: 0;
  }
  .v-input__slot {
    min-height: unset;
    padding: 0 !important;
  }
  & textarea {
    margin: 0 !important;
  }
  .v-text-field__details {
    padding: 0;
  }
}

.project__information-button {
  min-width: 160px;
  justify-content: start;
  text-transform: unset;
  font-size: 14px;
}
</style>
