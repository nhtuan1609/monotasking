<template>
  <v-timeline class="timeline" align-top dense v-bind="$attrs" v-on="$listeners">
    <!-- add new comment field -->
    <v-timeline-item color="primary" small>
      <template #icon>
        <v-avatar size="28" color="#585a2b">
          <span class="white--text" style="font-size: 10px">T</span>
        </v-avatar>
      </template>
      <v-card>
        <v-card-text>
          <v-textarea
            v-model="content"
            class="textarea__default"
            placeholder="Leave a comment..."
            rows="3"
            auto-grow
            outlined
            hide-details
          ></v-textarea>
          <div class="d-flex justify-end mt-2">
            <v-btn elevation="0" color="primary" @click="addComment">Comment</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-timeline-item>

    <!-- activity -->
    <template v-for="activity in activities">
      <!-- create task activity-->
      <v-timeline-item v-if="activity.activityType.code === ACTIVITY_TYPE.CREATE_TASK.code" :key="activity.id" small>
        <template #icon>
          <v-avatar size="20" :color="activity.updater.color">
            <span class="white--text" style="font-size: 10px">{{ activity.updater.shortName }}</span>
          </v-avatar>
        </template>
        <div style="margin-top: 2px">
          <span class="font-weight-bold">{{ activity.updater.name }}</span>
          created the task.
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <span class="text--hover" v-bind="attrs" v-on="on">
                {{ activity._created ? $formatTimeAgo(activity._created.toDate()) : '' }}
              </span>
            </template>
            <span>{{ activity._created ? $formatDateTime(activity._created.toDate()) : '' }}</span>
          </v-tooltip>
        </div>
      </v-timeline-item>

      <!-- change status activity-->
      <v-timeline-item
        v-else-if="activity.activityType.code === ACTIVITY_TYPE.CHANGE_STATUS.code"
        :key="activity.id"
        small
      >
        <template #icon>
          <status-icon small :status="activity.data.status"></status-icon>
        </template>
        <div style="margin-top: 2px">
          <span class="font-weight-bold">{{ activity.updater.name }}</span>
          change status to
          <span class="font-weight-bold">{{ activity.data.status.name }}</span
          >.
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <span class="text--hover" v-bind="attrs" v-on="on">
                {{ activity._created ? $formatTimeAgo(activity._created.toDate()) : '' }}
              </span>
            </template>
            <span>{{ activity._created ? $formatDateTime(activity._created.toDate()) : '' }}</span>
          </v-tooltip>
        </div>
      </v-timeline-item>

      <!-- change priority activity-->
      <v-timeline-item
        v-else-if="activity.activityType.code === ACTIVITY_TYPE.CHANGE_PRIORITY.code"
        :key="activity.id"
        small
      >
        <template #icon>
          <priority-icon small :priority="activity.data.priority"></priority-icon>
        </template>
        <div style="margin-top: 2px">
          <span class="font-weight-bold">{{ activity.updater.name }}</span>
          change priority to
          <span class="font-weight-bold">{{ activity.data.priority.name }}</span
          >.
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <span class="text--hover" v-bind="attrs" v-on="on">
                {{ activity._created ? $formatTimeAgo(activity._created.toDate()) : '' }}
              </span>
            </template>
            <span>{{ activity._created ? $formatDateTime(activity._created.toDate()) : '' }}</span>
          </v-tooltip>
        </div>
      </v-timeline-item>

      <!-- change assignee activity-->
      <v-timeline-item
        v-else-if="activity.activityType.code === ACTIVITY_TYPE.CHANGE_ASSIGNEE.code"
        :key="activity.id"
        small
      >
        <template #icon>
          <v-avatar size="20" :color="activity.updater.color">
            <span class="white--text" style="font-size: 10px">{{ activity.updater.shortName }}</span>
          </v-avatar>
        </template>
        <div style="margin-top: 2px">
          <template v-if="activity.data.assignee && activity.data.assignee.name">
            <span class="font-weight-bold">{{ activity.updater.name }}</span>
            re-assigned to
            <span class="font-weight-bold">{{ activity.data.assignee.name }}</span
            >.
          </template>
          <template v-else>
            <span class="font-weight-bold">{{ activity.updater.name }}</span>
            removed assignee.
          </template>
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <span class="text--hover" v-bind="attrs" v-on="on">
                {{ activity._created ? $formatTimeAgo(activity._created.toDate()) : '' }}
              </span>
            </template>
            <span>{{ activity._created ? $formatDateTime(activity._created.toDate()) : '' }}</span>
          </v-tooltip>
        </div>
      </v-timeline-item>

      <!-- change label activity-->
      <v-timeline-item
        v-else-if="activity.activityType.code === ACTIVITY_TYPE.CHANGE_LABEL.code"
        :key="activity.id"
        small
      >
        <template #icon>
          <v-icon small>mdi-label</v-icon>
        </template>
        <div style="margin-top: 2px">
          <template v-if="activity.data.label && activity.data.label.name">
            <span class="font-weight-bold">{{ activity.updater.name }}</span>
            changed label to
            <v-avatar :color="task.label.color" size="6"></v-avatar>
            <span class="font-weight-bold">{{ activity.data.label.name }}</span
            >.
          </template>
          <template v-else>
            <span class="font-weight-bold">{{ activity.updater.name }}</span>
            removed label.
          </template>
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <span class="text--hover" v-bind="attrs" v-on="on">
                {{ activity._created ? $formatTimeAgo(activity._created.toDate()) : '' }}
              </span>
            </template>
            <span>{{ activity._created ? $formatDateTime(activity._created.toDate()) : '' }}</span>
          </v-tooltip>
        </div>
      </v-timeline-item>

      <!-- change project activity-->
      <v-timeline-item
        v-else-if="activity.activityType.code === ACTIVITY_TYPE.CHANGE_PROJECT.code"
        :key="activity.id"
        small
      >
        <template #icon>
          <v-avatar size="20" :color="activity.updater.color">
            <span class="white--text" style="font-size: 10px">{{ activity.updater.shortName }}</span>
          </v-avatar>
        </template>
        <div style="margin-top: 2px">
          <template v-if="activity.data.project && activity.data.project.name">
            <span class="font-weight-bold">{{ activity.updater.name }}</span>
            changed project to
            <span class="font-weight-bold">{{ activity.data.project.name }}</span
            >.
          </template>
          <template v-else>
            <span class="font-weight-bold">{{ activity.updater.name }}</span>
            removed project.
          </template>
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <span class="text--hover" v-bind="attrs" v-on="on">
                {{ activity._created ? $formatTimeAgo(activity._created.toDate()) : '' }}
              </span>
            </template>
            <span>{{ activity._created ? $formatDateTime(activity._created.toDate()) : '' }}</span>
          </v-tooltip>
        </div>
      </v-timeline-item>

      <!-- change due date activity-->
      <v-timeline-item
        v-else-if="activity.activityType.code === ACTIVITY_TYPE.CHANGE_DUE_DATE.code"
        :key="activity.id"
        small
      >
        <template #icon>
          <due-date-icon v-if="activity.data.dueDate" small :due-date="activity.data.dueDate"></due-date-icon>
          <v-icon v-else small>mdi-calendar</v-icon>
        </template>
        <div style="margin-top: 2px">
          <template v-if="activity.data.dueDate">
            <span class="font-weight-bold">{{ activity.updater.name }}</span>
            set due date to
            <span class="font-weight-bold">{{ $formatDate(new Date(activity.data.dueDate)) }}</span
            >.
          </template>
          <template v-else>
            <span class="font-weight-bold">{{ activity.updater.name }}</span>
            removed due date.
          </template>
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <span class="text--hover" v-bind="attrs" v-on="on">
                {{ activity._created ? $formatTimeAgo(activity._created.toDate()) : '' }}
              </span>
            </template>
            <span>{{ activity._created ? $formatDateTime(activity._created.toDate()) : '' }}</span>
          </v-tooltip>
        </div>
      </v-timeline-item>

      <!-- change name activity-->
      <v-timeline-item
        v-else-if="activity.activityType.code === ACTIVITY_TYPE.CHANGE_NAME.code"
        :key="activity.id"
        small
      >
        <template #icon>
          <v-icon small>mdi-pencil-outline</v-icon>
        </template>
        <div style="margin-top: 2px">
          <span class="font-weight-bold">{{ activity.updater.name }}</span>
          updated name and description.
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <span class="text--hover" v-bind="attrs" v-on="on">
                {{ activity._created ? $formatTimeAgo(activity._created.toDate()) : '' }}
              </span>
            </template>
            <span>{{ activity._created ? $formatDateTime(activity._created.toDate()) : '' }}</span>
          </v-tooltip>
        </div>
      </v-timeline-item>

      <!-- comment activity -->
      <v-timeline-item
        v-else-if="activity.activityType.code === ACTIVITY_TYPE.ADD_COMMENT.code"
        :key="activity.id"
        class="comment"
        small
      >
        <template #icon>
          <v-avatar size="28" :color="activity.updater.color">
            <span class="white--text" style="font-size: 14px">{{ activity.updater.shortName }}</span>
          </v-avatar>
        </template>
        <v-card>
          <v-card-subtitle class="d-flex align-center justify-space-between py-2">
            <div>
              <span class="font-weight-bold">{{ activity.updater.name }}</span>
              <v-tooltip top>
                <template #activator="{ on, attrs }">
                  <span class="text--hover" v-bind="attrs" v-on="on">
                    {{ activity._created ? $formatTimeAgo(activity._created.toDate()) : '' }}
                  </span>
                </template>
                <span>{{ activity._created ? $formatDateTime(activity._created.toDate()) : '' }}</span>
              </v-tooltip>
            </div>
            <v-btn icon @click="deleteComment(activity)">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-subtitle>
          <v-card-text class="comment__content">{{ activity.data.content }}</v-card-text>
        </v-card>
      </v-timeline-item>
    </template>
  </v-timeline>
</template>

<script>
import { TASK } from '~/constants/task'
import StatusIcon from '~/components/common/StatusIcon.vue'
import PriorityIcon from '~/components/common/PriorityIcon.vue'
import DueDateIcon from '~/components/common/DueDateIcon.vue'

export default {
  name: 'ActivityTimeline',
  components: { StatusIcon, PriorityIcon, DueDateIcon },
  props: {
    task: {
      type: Object,
      required: true
    },
    activities: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      content: ''
    }
  },
  computed: {
    ACTIVITY_TYPE() {
      return TASK.ACTIVITY_TYPE
    }
  },
  methods: {
    /**
     * produce add new comment for current task
     * @return {void}
     */
    addComment() {
      this.$store.dispatch('tasks/addComment', { taskId: this.task.id, content: this.content })
      this.content = ''
    },
    /**
     * produce delete comment of current task
     * @return {void}
     */
    deleteComment(activity) {
      this.$store.dispatch('tasks/deleteComment', { taskId: this.task.id, id: activity.id })
    }
  }
}
</script>

<style lang="scss" scoped>
// css for activity timeline
.timeline {
  &::before {
    left: 11px !important;
    display: none;
  }
  & ::v-deep .v-timeline-item__divider {
    min-width: 40px;
    justify-content: flex-start;
  }
  & ::v-deep .v-timeline-item__body {
    max-width: unset;
  }
  .v-timeline-item {
    position: relative;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 11px;
      width: 0;
      height: 100%;
      border-left: 1px solid var(--color-border);
    }
    .v-card::before,
    .v-card::after {
      display: none;
    }
    & ::v-deep .v-timeline-item__dot {
      background-color: var(--color-background) !important;
      box-shadow: none;
      .v-timeline-item__inner-dot {
        margin: 2px;
        background-color: transparent !important;
        & i {
          margin-top: 2px;
          font-size: 20px !important;
        }
      }
    }
  }
  .v-timeline-item:last-child {
    padding-bottom: 0;
    &::before {
      display: none;
    }
  }
  .comment ::v-deep {
    .v-timeline-item__dot {
      margin-top: 12px;
    }
    .comment__content {
      color: var(--color-text);
    }
  }
}

.textarea__default::v-deep {
  & fieldset {
    border: none;
    padding: 0;
  }
  .v-input__slot {
    padding: 0 !important;
  }
  & textarea {
    margin: 0 !important;
  }
}

.text--hover {
  cursor: default;
}
</style>
