<template>
  <v-row class="pa-4">
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
            <span>{{ project.startDate }}</span>
          </div>

          <div class="project__information">
            <h3>Status</h3>
            <span>{{ project.status }}</span>
          </div>

          <div class="project__information">
            <h3>Leader</h3>
            <span>{{ project.leader }}</span>
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
                :value="Math.floor((100 * project.done) / project.total)"
                color="primary"
              >
                <span class="font-weight-bold">{{ Math.floor((100 * project.done) / project.total) }}%</span>
              </v-progress-circular>
            </v-col>
            <v-col cols="12" class="project__details">
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
      project: {
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
      }
    }
  },
  computed: {
    TASK() {
      return TASK
    }
  },
  methods: {
    editProject() {},
    deleteProject() {}
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
