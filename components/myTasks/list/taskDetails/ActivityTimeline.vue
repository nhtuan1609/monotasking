<template>
  <v-timeline class="timeline" align-top dense v-bind="$attrs" v-on="$listeners">
    <!-- add new comment field -->
    <v-timeline-item color="primary" small>
      <template #icon>
        <v-avatar size="28" :color="currentUser.color">
          <span class="white--text" style="font-size: 14px">{{ currentUser.shortName }}</span>
        </v-avatar>
      </template>
      <v-card>
        <v-card-text>
          <editor
            ref="editor-add"
            autofocus
            class="editor--padding-bottom"
            :options="editorOptions"
            height="auto"
            initial-edit-type="wysiwyg"
            preview-style="vertical"
          ></editor>
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
          <v-card-subtitle v-if="!isEditingComment[activity.id]" class="d-flex align-center justify-space-between py-2">
            <!-- time -->
            <div>
              <span class="font-weight-bold">{{ activity.updater.name }}</span>
              <v-tooltip top>
                <template #activator="{ on, attrs }">
                  <span class="text--hover" v-bind="attrs" v-on="on">
                    {{ activity._created ? $formatTimeAgo(activity._created.toDate()) : '' }}
                    {{ activity.isEdited ? '(edited)' : '' }}
                  </span>
                </template>
                <span>{{ activity._created ? $formatDateTime(activity._created.toDate()) : '' }}</span>
              </v-tooltip>
            </div>

            <!-- control button -->
            <div>
              <emoji-picker @select="(emoji) => addEmoji(activity, emoji)"></emoji-picker>

              <v-menu min-width="160" transition="slide-y-transition" left offset-y>
                <template #activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-dots-horizontal</v-icon>
                  </v-btn>
                </template>
                <v-list light dense>
                  <!-- edit button -->
                  <v-list-item @click="$set(isEditingComment, activity.id, true)">
                    <v-list-item-icon class="mr-2">
                      <v-icon small>mdi-pencil-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Edit</v-list-item-title>
                  </v-list-item>

                  <!-- delete button -->
                  <v-list-item @click="deleteComment(activity)">
                    <v-list-item-icon class="mr-2">
                      <v-icon small>mdi-trash-can</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Delete</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </v-card-subtitle>

          <!-- view mode -->
          <v-card-text v-if="!isEditingComment[activity.id]" class="comment__content">
            <!-- comment content -->
            <viewer
              :ref="getRefName('viewer', 'update', activity.id)"
              :initial-value="activity.data.content"
              height="auto"
              @change="onViewerChange(activity)"
            ></viewer>

            <!-- emotion -->
            <template v-if="activity.data.emojis && activity.data.emojis.length">
              <div>
                <v-chip
                  v-for="(emoji, index) in displayEmoji(activity.data.emojis)"
                  :key="index"
                  class="chip__emoji"
                  outlined
                  small
                  @click="removeEmoji(activity, index)"
                >
                  {{ emoji.icon }}
                  {{ emoji.quantity }}
                </v-chip>
                <emoji-picker @select="(emoji) => addEmoji(activity, emoji)"></emoji-picker>
              </div>
            </template>
          </v-card-text>

          <!-- edit mode -->
          <v-card-text v-else>
            <editor
              :ref="getRefName('editor', 'update', activity.id)"
              class="editor--padding-bottom"
              :initial-value="activity.data.content"
              :options="editorOptions"
              height="auto"
              initial-edit-type="wysiwyg"
              preview-style="vertical"
            ></editor>

            <div class="d-flex justify-end mt-2">
              <v-btn class="mr-2" text outlined @click="$set(isEditingComment, activity.id, false)">Cancel</v-btn>
              <v-btn elevation="0" color="primary" @click="updateComment(activity)">Save</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-timeline-item>

      <!-- update checklist activity-->
      <v-timeline-item
        v-else-if="activity.activityType.code === ACTIVITY_TYPE.UPDATE_CHECKLIST.code"
        :key="activity.id"
        small
      >
        <template #icon>
          <v-icon small>mdi-pencil-outline</v-icon>
        </template>
        <div style="margin-top: 2px">
          <span class="font-weight-bold">{{ activity.updater.name }}</span>
          updated checklist with
          <span class="font-weight-bold">{{ activity.data.checklist.progress }}%</span> progress.
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
    </template>
  </v-timeline>
</template>

<script>
import 'codemirror/lib/codemirror.css'
import '@toast-ui/editor/dist/toastui-editor.css'
import '@toast-ui/editor/dist/toastui-editor-viewer.css'
import { Editor, Viewer } from '@toast-ui/vue-editor'
import { TASK } from '~/constants/task'
import StatusIcon from '~/components/common/StatusIcon.vue'
import PriorityIcon from '~/components/common/PriorityIcon.vue'
import DueDateIcon from '~/components/common/DueDateIcon.vue'
import EmojiPicker from '~/components/common/EmojiPicker.vue'

export default {
  name: 'ActivityTimeline',
  components: { StatusIcon, PriorityIcon, DueDateIcon, Editor, Viewer, EmojiPicker },
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
      isEditingComment: {},
      editorOptions: {
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
    }
  },
  computed: {
    ACTIVITY_TYPE() {
      return TASK.ACTIVITY_TYPE
    },
    currentUser() {
      return this.$store.getters['users/getCurrentUser']
    }
  },
  methods: {
    /**
     * add new comment for current task
     * @return {void}
     */
    async addComment() {
      const content = this.$refs['editor-add'].invoke('getMarkdown')
      await this.$store.dispatch('tasks/addComment', { taskId: this.task.id, content })
      this.$refs['editor-add'].invoke('setMarkdown')
    },
    /**
     * delete comment of current task
     * @return {void}
     */
    deleteComment(activity) {
      this.$store.dispatch('tasks/deleteComment', { taskId: this.task.id, activityId: activity.id })
    },
    /**
     * update comment for current task
     * @param {object} activity - current editing comment
     * @return {void}
     */
    async updateComment(activity) {
      const refName = this.getRefName('editor', 'update', activity.id)
      const content = this.$refs[refName][0].invoke('getMarkdown')
      await this.$store.dispatch('tasks/updateComment', { taskId: this.task.id, activityId: activity.id, content })
      this.$set(this.isEditingComment, activity.id, false)
    },
    /**
     * update comment in view mode
     * @param {object} activity - current editing comment
     * @return {void}
     */
    async onViewerChange(activity) {
      const refName = this.getRefName('viewer', 'update', activity.id)
      // TODO: fix bug getMarkDown in view mod (https://github.com/nhn/tui.editor/issues/1177)
      const content = this.$refs[refName][0].invoke('getMarkdown')
      await this.$store.dispatch('tasks/updateComment', { taskId: this.task.id, activityId: activity.id, content })
    },
    /**
     * update comment for current task
     * @param {object} component - 'editor' or 'viewer'
     * @param {object} type - 'update'
     * @param {object} id - id of activity
     * @return {string}
     */
    getRefName(component, type, id) {
      return `${component}-${type}-${id}`
    },
    /**
     * add emotion for comment
     * @param {object} activity - data object of comment
     * @param {object} emoji - icon of emotion
     * @return {void}
     */
    addEmoji(activity, emoji) {
      const emojiData = {
        ...emoji,
        userId: this.currentUser.id
      }
      let emojis = []
      if (!activity.data.emojis?.length) {
        emojis = [emojiData]
      } else {
        // if user select the emoji twice times, it will be removed
        emojis = [...activity.data.emojis]
        const index = emojis.findIndex((item) => item.userId === this.currentUser.id && item.icon === emoji.icon)
        if (index !== -1) {
          emojis.splice(index, 1)
        } else {
          emojis.push(emojiData)
        }
      }

      this.$store.dispatch('tasks/updateEmojiComment', { taskId: this.task.id, activityId: activity.id, emojis })
    },
    /**
     * remove emotion for comment
     * @param {object} activity - data object of comment
     * @param {number} index - position of emotion will be removed
     * @return {void}
     */
    removeEmoji(activity, index) {
      const emojis = [...activity.data.emojis]
      emojis.splice(index, 1)
      this.$store.dispatch('tasks/updateEmojiComment', { taskId: this.task.id, activityId: activity.id, emojis })
    },
    /**
     * restructure emojis list to display with format icon + quantity
     * @param {object} emojis - list of emotion of comment
     * @return {object}
     */
    displayEmoji(emojis) {
      const result = []
      emojis.forEach((emoji) => {
        const index = result.findIndex((item) => item.icon === emoji.icon)
        if (index < 0) {
          return result.push({
            icon: emoji.icon,
            quantity: 1
          })
        } else {
          result[index].quantity += 1
          return result
        }
      })
      return result
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

.editor--padding-bottom ::v-deep {
  .tui-editor-contents {
    padding-bottom: 16px;
  }
}

.chip__emoji {
  margin-left: 8px;
  padding: 0 4px;
  &:first-child {
    margin-left: 0;
  }
}
</style>
