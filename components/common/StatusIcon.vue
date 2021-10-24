<template>
  <v-icon v-if="icon" v-bind="$attrs" :color="icon.color">{{ icon.type }} </v-icon>
</template>

<script>
import { TASK } from '~/constants/task'
export default {
  name: 'StatusIcon',
  props: {
    status: {
      type: String,
      default: ''
    }
  },
  computed: {
    icon() {
      switch (this.status) {
        case TASK.STATUS.BACKLOG.code:
          return { type: 'mdi-selection-ellipse', color: '' }
        case TASK.STATUS.TODO.code:
          return { type: 'mdi-circle-outline', color: '' }
        case TASK.STATUS.IN_PROGRESS.code:
          return { type: 'mdi-circle-slice-4', color: 'orange' }
        case TASK.STATUS.IN_REVIEW.code:
          return { type: 'mdi-circle-slice-6', color: 'green' }
        case TASK.STATUS.DONE.code:
          return { type: 'mdi-checkbox-marked-circle', color: 'indigo' }
        case TASK.STATUS.CANCELED.code:
          return { type: 'mdi-close-circle', color: '' }
        default:
          return undefined
      }
    }
  }
}
</script>
