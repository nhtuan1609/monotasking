<template>
  <div>
    <v-card
      v-for="(project, index) in projectDetails"
      :key="index"
      class="project"
      light
      @click="$router.push(`/projects/${project.id}`)"
    >
      <v-card-text>
        <div class="project__overall">
          <div class="project__title">
            <!-- status -->
            <v-chip label>
              <project-status-icon left :status="project.status"></project-status-icon>
              {{ project.status.name }}
            </v-chip>

            <!-- name -->
            <div class="project__name text-truncate">{{ project.name }}</div>

            <!-- start date -->
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
                  {{ $formatDate(new Date(project.startDate)) }}
                </v-btn>
              </template>
              <span>Started on {{ $formatDate(new Date(project.startDate)) }}</span>
            </v-tooltip>

            <!-- leader -->
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-btn icon light small v-bind="attrs" v-on="on">
                  <v-avatar v-if="project.assignee && project.assignee.id" size="20" :color="project.assignee.color">
                    <span class="white--text" style="font-size: 10px">{{ project.assignee.shortName }}</span>
                  </v-avatar>
                  <v-icon v-else size="22">mdi-account-circle</v-icon>
                </v-btn>
              </template>
              <span>Project lead is {{ project.assignee.name }}</span>
            </v-tooltip>
          </div>
          <div class="project__description">{{ project.description }}</div>
        </div>

        <v-row class="mt-2">
          <v-col cols="12" md="3" class="project__percentage">
            <v-progress-circular
              :rotate="-90"
              :size="80"
              :width="20"
              :value="project.details.progressPercentage"
              color="primary"
            >
              <span class="font-weight-bold">{{ project.details.progressPercentage }}%</span>
            </v-progress-circular>
          </v-col>
          <v-col cols="12" md="9" class="project__details">
            <div
              v-for="(status, statusIndex) in Object.values(TASK.STATUS)"
              :key="statusIndex"
              class="project__details-item"
            >
              <status-icon :status="{ code: status.code }"></status-icon>
              <span class="font-weight-bold">
                {{ status.name }}
                {{ project.details[`${status.key}`] }}/{{ project.details.total }}
              </span>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { TASK } from '~/constants/task'
import StatusIcon from '~/components/common/StatusIcon.vue'
import ProjectStatusIcon from '~/components/common/ProjectStatusIcon.vue'

export default {
  name: 'ProjectList',
  components: { StatusIcon, ProjectStatusIcon },
  data() {
    return {
      isShowAddNewProjectDialog: false
    }
  },
  computed: {
    TASK() {
      return TASK
    },
    projects() {
      return this.$store.getters['projects/getProjects']
    },
    tasks() {
      return this.$store.getters['tasks/getTasks']
    },
    projectDetails() {
      const defaultDetails = {}
      for (const status of Object.values(TASK.STATUS)) {
        defaultDetails[`${status.key}`] = 0
      }
      return this.projects.map((project) => {
        const tasks = this.tasks.filter((tasks) => tasks.project.id === project.id)
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
          ...project,
          details
        }
      })
    }
  },
  created() {
    this.$store.dispatch('projects/setProjectsRef')
    this.$store.dispatch('tasks/setTasksRef')
  }
}
</script>

<style lang="scss" scoped>
.project {
  margin-top: 16px;
  &:first-child {
    margin-top: 0;
  }

  .project__overall {
    .project__title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .project__name {
      font-size: 24px;
      line-height: 32px;
      font-weight: bold;
      flex: 1;
    }

    .button__created-date {
      justify-content: flex-end;
      padding-right: 4px;
      border: none;
      text-transform: none;
      &::before {
        background-color: transparent !important;
      }
    }

    .project__description {
      font-size: 16px;
      margin-top: 12px;
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
}

.toolbar {
  display: flex;
  justify-content: flex-end;
  background-color: transparent !important;
  margin-bottom: 16px;
}
</style>
