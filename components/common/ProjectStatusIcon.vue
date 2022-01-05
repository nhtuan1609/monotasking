<template>
  <v-icon v-if="icon" v-bind="$attrs" :color="icon.color">{{ icon.type }} </v-icon>
</template>

<script>
import { PROJECT } from '~/constants/project'
export default {
  name: 'ProjectStatusIcon',
  props: {
    status: {
      type: Object,
      default: undefined
    }
  },
  computed: {
    // using to display icon and color for status based on status code
    icon() {
      switch (this.status?.code) {
        case PROJECT.STATUS.PLANNED.code:
          return { type: 'mdi-skip-next-circle', color: '' }
        case PROJECT.STATUS.IN_PROGRESS.code:
          return { type: 'mdi-play-circle', color: 'orange' }
        case PROJECT.STATUS.PAUSED.code:
          return { type: 'mdi-pause-circle', color: '' }
        case PROJECT.STATUS.COMPLETED.code:
          return { type: 'mdi-check-circle', color: 'indigo' }
        case PROJECT.STATUS.CANCELED.code:
          return { type: 'mdi-close-circle', color: '' }
        default:
          return undefined
      }
    }
  }
}
</script>
