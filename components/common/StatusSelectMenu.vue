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
    statusIndex() {
      if (!this.task?.status?.code) return -1
      return this.statuses.findIndex((status) => status.code === this.task.status.code)
    }
  },
  methods: {
    changeStatus(status) {
      this.$store.dispatch('tasks/updateTask', { id: this.task.id, data: { status } })
      this.$emit('selected')
    }
  }
}
</script>

<style></style>
