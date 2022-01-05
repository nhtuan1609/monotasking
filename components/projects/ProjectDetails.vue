<template>
  <v-row v-if="!isLoading" class="pa-4">
    <v-col cols="12" md="6">
      <v-card light>
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

        <!-- project description -->
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
import StatusIcon from '~/components/common/StatusIcon.vue'

export default {
  name: 'ProjectDetails',
  components: { StatusIcon },
  data() {
    return {
      isLoading: true
    }
  },
  computed: {
    TASK() {
      return TASK
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
      this.isLoading = false
    }
  },
  created() {
    this.$store.dispatch('projects/setCurrentProjectRef', { id: this.$route.params.id })
    this.$store.dispatch('tasks/setTasksRef')
  },
  methods: {
    editProject() {},
    deleteProject() {
      this.$router.push('/projects')
      this.$store.dispatch('projects/deleteProject', { id: this.project.id }).then(() => {
        this.$showSuccessNotification('Delete project successfully')
      })
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
</style>
