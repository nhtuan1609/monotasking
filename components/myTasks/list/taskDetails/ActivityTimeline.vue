<template>
  <v-timeline class="timeline" align-top dense v-bind="$attrs" v-on="$listeners">
    <v-timeline-item color="primary" small>
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

    <template v-for="(activity, index) in activities">
      <!-- create task activity-->
      <v-timeline-item
        v-if="activity.activityType.code === ACTIVITY_TYPE.CREATE_TASK.code"
        :key="index"
        color="primary"
        small
      >
        <div class="mt-1">
          Task was created on {{ activity._created ? $formatDate(activity._created.toDate()) : '' }}
        </div>
      </v-timeline-item>

      <!-- change status activity-->
      <v-timeline-item
        v-if="activity.activityType.code === ACTIVITY_TYPE.CHANGE_STATUS.code"
        :key="index"
        color="primary"
        small
      >
        <div class="mt-1">Status was changed to {{ activity.data.status.name }}</div>
      </v-timeline-item>

      <!-- change priority activity-->
      <v-timeline-item
        v-if="activity.activityType.code === ACTIVITY_TYPE.CHANGE_PRIORITY.code"
        :key="index"
        color="primary"
        small
      >
        <div class="mt-1">Priority was changed to {{ activity.data.priority.name }}</div>
      </v-timeline-item>

      <!-- change assignee activity-->
      <v-timeline-item
        v-if="activity.activityType.code === ACTIVITY_TYPE.CHANGE_ASSIGNEE.code"
        :key="index"
        color="primary"
        small
      >
        <div class="mt-1">Assignee was changed to {{ activity.data.assignee.name }}</div>
      </v-timeline-item>

      <!-- change label activity-->
      <v-timeline-item
        v-if="activity.activityType.code === ACTIVITY_TYPE.CHANGE_LABEL.code"
        :key="index"
        color="primary"
        small
      >
        <div class="mt-1">Label was changed to {{ activity.data.label.name }}</div>
      </v-timeline-item>

      <!-- change project activity-->
      <v-timeline-item
        v-if="activity.activityType.code === ACTIVITY_TYPE.CHANGE_PROJECT.code"
        :key="index"
        color="primary"
        small
      >
        <div class="mt-1">Project was changed to {{ activity.data.project.name }}</div>
      </v-timeline-item>

      <!-- change due date activity-->
      <v-timeline-item
        v-if="activity.activityType.code === ACTIVITY_TYPE.CHANGE_DUE_DATE.code"
        :key="index"
        color="primary"
        small
      >
        <div class="mt-1">
          Due date was set on {{ activity.data.dueDate ? $formatDate(new Date(activity.data.dueDate)) : '' }}
        </div>
      </v-timeline-item>

      <!-- change name activity-->
      <v-timeline-item
        v-if="activity.activityType.code === ACTIVITY_TYPE.CHANGE_NAME.code"
        :key="index"
        color="primary"
        small
      >
        <div class="mt-1">Name and description are edited</div>
      </v-timeline-item>

      <!-- comment activity -->
      <v-timeline-item
        v-if="activity.activityType.code === ACTIVITY_TYPE.ADD_COMMENT.code"
        :key="index"
        color="primary"
        small
      >
        <v-card>
          <v-card-subtitle class="d-flex justify-space-between align-center py-2">
            {{ activity._created ? activity._created.toDate().toLocaleString() : '' }}
            <v-btn icon @click="deleteComment(activity)">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-subtitle>
          <v-card-text>{{ activity.data.content }}</v-card-text>
        </v-card>
      </v-timeline-item>
    </template>
  </v-timeline>
</template>

<script>
import { TASK } from '~/constants/task'

export default {
  name: 'ActivityTimeline',
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
    addComment() {
      this.$store.dispatch('tasks/addComment', { taskId: this.task.id, content: this.content })
      this.content = ''
    },
    deleteComment(activity) {
      this.$store.dispatch('tasks/deleteComment', { taskId: this.task.id, id: activity.id })
    }
  }
}
</script>

<style lang="scss" scoped>
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
      border-left: 1px solid var(--v-_base-darken2);
    }
    .v-card::before,
    .v-card::after {
      display: none;
    }
  }
  .v-timeline-item:last-child {
    padding-bottom: 0;
    &::before {
      display: none;
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
</style>
