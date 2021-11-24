<template>
  <v-list light dense>
    <v-list-item-group :value="assigneeIndex">
      <v-list-item @click="changeAssignee()">
        <v-list-item-icon class="mr-2">
          <v-icon size="24" style="margin-left: -2px">mdi-account-circle</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Unassigned</v-list-item-title>
      </v-list-item>

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
    assigneeIndex() {
      if (!this.task?.assignee?.id) return 0
      return this.members.findIndex((member) => member.id === this.task.assignee.id) + 1
    }
  },
  methods: {
    changeAssignee(assignee = {}) {
      this.$store.dispatch('tasks/updateTask', { id: this.task.id, data: { assignee } })
      this.$emit('selected')
    }
  }
}
</script>

<style></style>
