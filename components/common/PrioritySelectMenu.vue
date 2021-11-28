<template>
  <v-list light dense>
    <v-list-item-group :value="priorityIndex">
      <v-list-item v-for="(priority, index) in priorities" :key="index" @click="changePriority(priority)">
        <v-list-item-icon class="mr-2">
          <priority-icon small :priority="priority"></priority-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ priority.name }}</v-list-item-title>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
import PriorityIcon from '~/components/common/PriorityIcon.vue'
import { TASK } from '~/constants/task'

export default {
  name: 'PrioritySelectMenu',
  components: { PriorityIcon },
  props: {
    priorities: {
      type: Array,
      required: true
    },
    task: {
      type: Object,
      required: true
    }
  },
  computed: {
    // using to display current selected priority in menu
    priorityIndex() {
      if (!this.task?.priority?.code) return -1
      return this.priorities.findIndex((priority) => priority.code === this.task.priority.code)
    }
  },
  methods: {
    /**
     * produce change priority of selected task
     * @param {object} priority - priority information which is selected
     * @return {void}
     */
    changePriority(priority) {
      this.$store.dispatch('tasks/updateTask', {
        id: this.task.id,
        data: { priority },
        activityType: TASK.ACTIVITY_TYPE.CHANGE_PRIORITY
      })
      this.$emit('selected')
    }
  }
}
</script>
