<template>
  <v-list light dense>
    <v-list-item-group :value="projectIndex">
      <!-- no project -->
      <v-list-item @click="changeProject()">
        <v-list-item-icon class="mr-2">
          <v-icon small>mdi-cancel</v-icon>
        </v-list-item-icon>
        <v-list-item-title>No project</v-list-item-title>
      </v-list-item>

      <!-- project -->
      <v-list-item v-for="(project, index) in projects" :key="index" @click="changeProject(project)">
        <v-list-item-icon class="mr-2">
          <v-icon small>mdi-view-grid-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ project.name }}</v-list-item-title>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
import { TASK } from '~/constants/task'

export default {
  name: 'ProjectSelectMenu',
  props: {
    projects: {
      type: Array,
      required: true
    },
    task: {
      type: Object,
      required: true
    }
  },
  computed: {
    // using to display current selected project in menu
    projectIndex() {
      if (!this.task?.project?.id) return 0
      return this.projects.findIndex((project) => project.id === this.task.project.id) + 1
    }
  },
  methods: {
    /**
     * produce change project of selected task
     * @param {object} project - project information which is selected
     * @return {void}
     */
    changeProject(project = {}) {
      this.$store.dispatch('tasks/updateTask', {
        id: this.task.id,
        data: { project },
        activityType: TASK.ACTIVITY_TYPE.CHANGE_PROJECT
      })
      this.$emit('selected')
    }
  }
}
</script>
