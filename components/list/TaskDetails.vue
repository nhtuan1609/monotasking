<template>
  <div class="pa-3">
    <v-row v-if="task">
      <v-col cols="12" md="8">
        <v-card light class="max-height customized-scrollbar background">
          <v-card-title>{{ task.name }}</v-card-title>
          <v-card-text>
            <h3>Description</h3>
            <span>Task desception...</span>
          </v-card-text>
          <v-card-text>
            <h3>Activity</h3>
            <v-textarea placeholder="Leave a comment..." rows="3" auto-grow outlined hide-details></v-textarea>
            <div class="d-flex justify-end mt-2">
              <v-btn elevation="0" color="primary">Comment</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card light class="max-height customized-scrollbar background">
          <v-card-title>Details</v-card-title>

          <!-- status -->
          <v-card-text class="details-item">
            <span class="details-item__title">Status</span>
            <v-menu transition="scale-transition" offset-y>
              <template #activator="{ on: menu, attrs }">
                <v-tooltip bottom>
                  <template #activator="{ on: tooltip }">
                    <v-btn class="details-item__button" text small v-bind="attrs" v-on="{ ...tooltip, ...menu }">
                      <status-icon small left :status="task.status"></status-icon>
                      {{ task.status.name }}
                    </v-btn>
                  </template>
                  <span>{{ task.status.name }} status</span>
                </v-tooltip>
              </template>
              <status-select-menu :statuses="statuses" :task="task"></status-select-menu>
            </v-menu>
          </v-card-text>

          <!-- priority -->
          <v-card-text class="details-item">
            <span class="details-item__title">Priority</span>
            <v-menu transition="scale-transition" offset-y>
              <template #activator="{ on: menu, attrs }">
                <v-tooltip bottom>
                  <template #activator="{ on: tooltip }">
                    <v-btn class="details-item__button" text small v-bind="attrs" v-on="{ ...tooltip, ...menu }">
                      <priority-icon small left :priority="task.priority"></priority-icon>
                      {{ task.priority.name }}
                    </v-btn>
                  </template>
                  <span>{{ task.priority.name }} priority</span>
                </v-tooltip>
              </template>
              <priority-select-menu :priorities="priorities" :task="task"></priority-select-menu>
            </v-menu>
          </v-card-text>

          <!-- assignee -->
          <v-card-text class="details-item">
            <span class="details-item__title">Assignee</span>
            <v-menu transition="scale-transition" offset-y>
              <template #activator="{ on: menu, attrs }">
                <v-tooltip bottom>
                  <template #activator="{ on: tooltip }">
                    <v-btn class="details-item__button" text small v-bind="attrs" v-on="{ ...tooltip, ...menu }">
                      <v-avatar
                        v-if="task.assignee && task.assignee.id"
                        class="ml-n1 mr-1"
                        size="20"
                        :color="task.assignee.color"
                        v-bind="attrs"
                        v-on="{ ...tooltip, ...menu }"
                      >
                        <span class="white--text" style="font-size: 10px">{{ task.assignee.shortName }}</span>
                      </v-avatar>
                      <v-icon v-else size="22" left v-bind="attrs" v-on="{ ...tooltip, ...menu }"
                        >mdi-account-circle</v-icon
                      >
                      <span v-if="task.assignee && task.assignee.id">{{ task.assignee.name }}</span>
                      <span v-else>Unassigned</span>
                    </v-btn>
                  </template>
                  <span v-if="task.assignee && task.assignee.id">Assigned to {{ task.assignee.name }}</span>
                  <span v-else>Unassigned</span>
                </v-tooltip>
              </template>
              <assignee-select-menu :members="members" :task="task"></assignee-select-menu>
            </v-menu>
          </v-card-text>

          <v-card-text class="details-item">
            <span class="details-item__title">Label</span>
            <v-menu transition="scale-transition" offset-y>
              <template #activator="{ on: menu, attrs }">
                <v-tooltip bottom>
                  <template #activator="{ on: tooltip }">
                    <v-btn class="details-item__button" text small v-bind="attrs" v-on="{ ...tooltip, ...menu }">
                      <v-avatar class="mr-2" :color="task.label.color" size="10"></v-avatar>
                      <span class="text-truncate ml-1" style="max-width: 96px">{{
                        task.label.name ? task.label.name : 'No label'
                      }}</span>
                    </v-btn>
                  </template>
                  <span>{{ task.label.name }} Label</span>
                </v-tooltip>
              </template>
              <label-select-menu :labels="labels" :task="task"></label-select-menu>
            </v-menu>
          </v-card-text>
          <v-card-text>
            <v-divider></v-divider>
          </v-card-text>

          <!-- project -->
          <v-card-text class="details-item">
            <span class="details-item__title">Project</span>
            <v-menu transition="scale-transition" offset-y>
              <template #activator="{ on: menu, attrs }">
                <v-tooltip bottom>
                  <template #activator="{ on: tooltip }">
                    <v-btn class="details-item__button" text small v-bind="attrs" v-on="{ ...tooltip, ...menu }">
                      <v-icon small left>mdi-view-grid-outline</v-icon>
                      <span class="text-truncate" style="max-width: 140px">{{
                        task.project && task.project.id ? task.project.name : 'No project'
                      }}</span>
                    </v-btn>
                  </template>
                  <span v-if="task.project && task.project.id">{{ task.project.name }} project</span>
                  <span v-else>No project</span>
                </v-tooltip>
              </template>
              <project-select-menu :projects="projects" :task="task"></project-select-menu>
            </v-menu>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { TASK } from '~/constants/task.js'
import StatusIcon from '~/components/common/StatusIcon.vue'
import PriorityIcon from '~/components/common/PriorityIcon.vue'
import StatusSelectMenu from '~/components/common/StatusSelectMenu.vue'
import PrioritySelectMenu from '~/components/common/PrioritySelectMenu.vue'
import AssigneeSelectMenu from '~/components/common/AssigneeSelectMenu.vue'
import LabelSelectMenu from '~/components/common/LabelSelectMenu.vue'
import ProjectSelectMenu from '~/components/common/ProjectSelectMenu.vue'

export default {
  name: 'TaskDetails',
  components: {
    StatusIcon,
    PriorityIcon,
    StatusSelectMenu,
    PrioritySelectMenu,
    AssigneeSelectMenu,
    LabelSelectMenu,
    ProjectSelectMenu
  },
  props: {
    taskId: {
      type: String,
      required: true
    }
  },
  computed: {
    task() {
      return this.$store.getters['tasks/getCurrentTask']
    },
    statuses() {
      return Object.values(TASK.STATUS)
    },
    priorities() {
      return Object.values(TASK.PRIORITY)
    },
    members() {
      return this.$store.getters['members/getMembers']
    },
    labels() {
      return this.$store.getters['labels/getLabels']
    },
    projects() {
      return this.$store.getters['projects/getProjects']
    }
  },
  created() {
    this.$store.dispatch('tasks/setCurrentTaskRef', { id: this.taskId })
  }
}
</script>

<style lang="scss" scoped>
.max-height {
  max-height: calc(100vh - (var(--height-application-header) + var(--height-page-title) + 24px));
  overflow-y: auto;
}
.background {
  background-color: var(--background-color);
}
.details-item {
  display: flex;
  align-items: center;
  .details-item__title {
    min-width: 100px;
    font-size: 14px;
    font-weight: bold;
  }
  .details-item__button {
    min-width: 160px;
    justify-content: start;
    text-transform: unset;
    font-size: 14px;
  }
}
</style>
