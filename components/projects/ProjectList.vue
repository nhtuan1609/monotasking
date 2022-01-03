<template>
  <div>
    <!-- add new project -->
    <div class="toolbar">
      <v-btn elevation="0" color="primary" @click="isShowAddNewProjectDialog = true">
        <v-icon small left>mdi-square-edit-outline</v-icon>
        New project
      </v-btn>
    </div>

    <!-- project list -->
    <v-card
      v-for="(project, index) in projects"
      :key="index"
      class="project"
      light
      @click="$router.push('/projects/1')"
    >
      <v-card-text>
        <div class="project__overall">
          <div class="project__title">
            <!-- status -->
            <v-chip label>{{ project.status }}</v-chip>

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
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-account-circle</v-icon>
                </v-btn>
              </template>
              <span>Project lead is {{ project.leader }}</span>
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
              :value="Math.floor((100 * project.done) / project.total)"
              color="primary"
            >
              <span class="font-weight-bold">{{ Math.floor((100 * project.done) / project.total) }}%</span>
            </v-progress-circular>
          </v-col>
          <v-col cols="12" md="9" class="project__details">
            <div class="project__details-item">
              <status-icon :status="{ code: TASK.STATUS.BACKLOG.code }"></status-icon>
              <span class="font-weight-bold">Backlog {{ project.backlog }}/500</span>
            </div>

            <div class="project__details-item">
              <status-icon :status="{ code: TASK.STATUS.TODO.code }"></status-icon>
              <span class="font-weight-bold">Todo {{ project.todo }}/500</span>
            </div>

            <div class="project__details-item">
              <status-icon :status="{ code: TASK.STATUS.IN_PROGRESS.code }"></status-icon>
              <span class="font-weight-bold">In progress {{ project.inProgress }}/500</span>
            </div>

            <div class="project__details-item">
              <status-icon :status="{ code: TASK.STATUS.IN_REVIEW.code }"></status-icon>
              <span class="font-weight-bold">In review {{ project.inReview }}/500</span>
            </div>

            <div class="project__details-item">
              <status-icon :status="{ code: TASK.STATUS.DONE.code }"></status-icon>
              <span class="font-weight-bold">Done {{ project.done }}/500</span>
            </div>

            <div class="project__details-item">
              <status-icon :status="{ code: TASK.STATUS.CANCELED.code }"></status-icon>
              <span class="font-weight-bold">Canceled {{ project.canceled }}/500</span>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- show dialog to add new project -->
    <new-project :is-show="isShowAddNewProjectDialog" @close="isShowAddNewProjectDialog = false"></new-project>
  </div>
</template>

<script>
import { TASK } from '~/constants/task'
import StatusIcon from '~/components/common/StatusIcon.vue'
import NewProject from '~/components/projects/NewProject.vue'

export default {
  name: 'ProjectList',
  components: { StatusIcon, NewProject },
  data() {
    return {
      isShowAddNewProjectDialog: false,
      projects: [
        {
          name: 'Monotasking',
          description: 'Manage your task with the best performance.',
          startDate: '2021-07-29',
          leader: 'Mono Man',
          status: 'In progress',
          total: 418,
          backlog: 15,
          todo: 45,
          inProgress: 12,
          inReview: 20,
          done: 321,
          canceled: 5
        },
        {
          name: 'Ditasking',
          description: 'Manage your task with the best performance.',
          startDate: '2021-08-29',
          leader: 'Di Man',
          status: 'Planned',
          total: 264,
          backlog: 21,
          todo: 37,
          inProgress: 8,
          inReview: 15,
          done: 180,
          canceled: 3
        },
        {
          name: 'Tritasking',
          description: 'Manage your task with the best performance.',
          startDate: '2021-09-29',
          leader: 'Tri Man',
          status: 'Paused',
          total: 324,
          backlog: 22,
          todo: 15,
          inProgress: 32,
          inReview: 4,
          done: 251,
          canceled: 0
        },
        {
          name: 'Tetratasking',
          description: 'Manage your task with the best performance.',
          startDate: '2021-10-29',
          leader: 'Tetra Man',
          status: 'Completed',
          total: 198,
          backlog: 34,
          todo: 21,
          inProgress: 3,
          inReview: 11,
          done: 127,
          canceled: 2
        }
      ]
    }
  },
  computed: {
    TASK() {
      return TASK
    }
  }
}
</script>

<style lang="scss" scoped>
.project {
  margin-bottom: 16px;
  &:last-child {
    margin-bottom: 0;
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
