<template>
  <v-list light dense>
    <v-list-item-group :value="statusIndex">
      <v-list-item v-for="(status, index) in statuses" :key="index" @click="changeStatus(status)">
        <v-list-item-icon class="mr-2">
          <status-icon small :status="status"></status-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ status.name }}</v-list-item-title>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
import StatusIcon from '~/components/common/StatusIcon.vue'
import { TASK } from '~/constants/task'

export default {
  name: 'StatusSelectMenu',
  components: { StatusIcon },
  props: {
    statuses: {
      type: Array,
      required: true
    },
    task: {
      type: Object,
      required: true
    }
  },
  computed: {
    // using to display current selected status in menu
    statusIndex() {
      if (!this.task?.status?.code) return -1
      return this.statuses.findIndex((status) => status.code === this.task.status.code)
    }
  },
  methods: {
    /**
     * produce change status of selected task
     * @param {object} status - status information which is selected
     * @return {void}
     */
    changeStatus(status) {
      this.$store.dispatch('tasks/updateTask', {
        id: this.task.id,
        data: { status },
        activityType: TASK.ACTIVITY_TYPE.CHANGE_STATUS
      })
      this.$emit('selected')
    }
  }
}
</script>
