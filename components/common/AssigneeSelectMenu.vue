<template>
  <v-list light dense>
    <v-list-item-group :value="assigneeIndex">
      <!-- unassigned -->
      <v-list-item @click="changeAssignee()">
        <v-list-item-icon class="mr-2">
          <v-icon size="24" style="margin-left: -2px">mdi-account-circle</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Unassigned</v-list-item-title>
      </v-list-item>

      <!-- members -->
      <v-list-item v-for="(member, index) in members" :key="index" @click="changeAssignee(member)">
        <v-list-item-icon class="mr-2">
          <v-avatar size="20" :color="member.color">
            <span class="white--text" style="font-size: 10px">{{ member.shortName }}</span>
          </v-avatar>
        </v-list-item-icon>
        <v-list-item-title>{{ member.name }}</v-list-item-title>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
import { TASK } from '~/constants/task'

export default {
  name: 'AssigneeSelectMenu',
  props: {
    members: {
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
    assigneeIndex() {
      if (!this.task?.assignee?.email) return 0
      return this.members.findIndex((member) => member.email === this.task.assignee.email) + 1
    }
  },
  methods: {
    /**
     * produce change assignee of selected task
     * @param {object} assignee - assignee information which is assigned
     * @return {void}
     */
    changeAssignee(assignee = {}) {
      if (assignee.email === this.task.assignee.email) return

      if (this.task.id) {
        this.$store.dispatch('tasks/updateTask', {
          id: this.task.id,
          data: { assignee },
          activityType: TASK.ACTIVITY_TYPE.CHANGE_ASSIGNEE
        })
      }

      this.$emit('selected', assignee)
    }
  }
}
</script>
