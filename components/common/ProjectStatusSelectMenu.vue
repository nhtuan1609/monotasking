<template>
  <v-list light dense>
    <v-list-item-group :value="statusIndex">
      <v-list-item v-for="(status, index) in statuses" :key="index" @click="changeStatus(status)">
        <v-list-item-icon class="mr-2">
          <project-status-icon small :status="status"></project-status-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ status.name }}</v-list-item-title>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
import ProjectStatusIcon from '~/components/common/ProjectStatusIcon.vue'

export default {
  name: 'ProjectStatusSelectMenu',
  components: { ProjectStatusIcon },
  props: {
    statuses: {
      type: Array,
      required: true
    },
    project: {
      type: Object,
      required: true
    }
  },
  computed: {
    // using to display current selected status in menu
    statusIndex() {
      if (!this.project?.status?.code) return -1
      return this.statuses.findIndex((status) => status.code === this.project.status.code)
    }
  },
  methods: {
    /**
     * produce change status of selected project
     * @param {object} status - status information which is selected
     * @return {void}
     */
    changeStatus(status) {
      this.$emit('selected', status)
    }
  }
}
</script>
