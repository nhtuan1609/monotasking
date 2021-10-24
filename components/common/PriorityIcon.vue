<template>
  <v-icon v-if="icon" v-bind="$attrs" :color="icon.color">{{ icon.type }} </v-icon>
</template>

<script>
import { TASK } from '~/constants/task'
export default {
  name: 'PriorityIcon',
  props: {
    priority: {
      type: String,
      default: ''
    }
  },
  computed: {
    icon() {
      switch (this.priority) {
        case TASK.PRIORITY.NO_PRIORITY.code:
          return { type: 'mdi-dots-horizontal' }
        case TASK.PRIORITY.LOW.code:
          return { type: 'mdi-signal-cellular-1' }
        case TASK.PRIORITY.MEDIUM.code:
          return { type: 'mdi-signal-cellular-2' }
        case TASK.PRIORITY.HIGH.code:
          return { type: 'mdi-signal-cellular-3' }
        case TASK.PRIORITY.URGENT.code:
          return { type: 'mdi-alert-box' }
        default:
          return undefined
      }
    }
  }
}
</script>
