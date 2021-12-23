<template>
  <v-list light dense>
    <v-list-item-group :value="labelIndex">
      <!-- no label -->
      <v-list-item @click="changeLabel()">
        <v-icon size="10" class="mr-2">mdi-cancel</v-icon>
        <v-list-item-title>No label</v-list-item-title>
      </v-list-item>

      <!-- labels -->
      <v-list-item v-for="(label, index) in labels" :key="index" @click="changeLabel(label)">
        <v-avatar :color="label.color" size="10" class="mr-2"></v-avatar>
        <v-list-item-title>
          {{ label.name }}
        </v-list-item-title>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
import { TASK } from '~/constants/task'

export default {
  name: 'LabelSelectMenu',
  props: {
    labels: {
      type: Array,
      required: true
    },
    task: {
      type: Object,
      required: true
    }
  },
  computed: {
    // using to display current selected assignee in menu
    labelIndex() {
      if (!this.task?.label?.id) return 0
      return this.labels.findIndex((label) => label.id === this.task.label.id) + 1
    }
  },
  methods: {
    /**
     * produce change label of selected task
     * @param {object} label - label information which is selected
     * @return {void}
     */
    changeLabel(label = {}) {
      if (label.id === this.task.label.id) return

      if (this.task.id) {
        this.$store.dispatch('tasks/updateTask', {
          id: this.task.id,
          data: { label },
          activityType: TASK.ACTIVITY_TYPE.CHANGE_LABEL
        })
      }

      this.$emit('selected', label)
    }
  }
}
</script>
