<template>
  <v-list light dense>
    <v-list-item-group :value="projectIndex">
      <v-list-item @click="changeProject">
        <v-list-item-icon class="mr-2">
          <v-icon small>mdi-cancel</v-icon>
        </v-list-item-icon>
        <v-list-item-title>No project</v-list-item-title>
      </v-list-item>

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
    projectIndex() {
      if (!this.task?.project?.id) return 0
      return this.projects.findIndex((project) => project.id === this.task.project.id) + 1
    }
  },
  methods: {
    changeProject(project = {}) {
      this.$store.dispatch('tasks/updateTask', { id: this.task.id, data: { project } })
      this.$emit('selected')
    }
  }
}
</script>

<style></style>
