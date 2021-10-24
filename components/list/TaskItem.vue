<template>
  <v-text-field :value="task.content" class="task" cols="12" hide-details readonly light solo>
    <template #prepend-inner>
      <v-btn icon @click="completeTask(task)">
        <v-icon v-if="task.isCompleted">mdi-check-circle</v-icon>
        <v-icon v-else>mdi-circle-outline</v-icon>
      </v-btn>
    </template>
    <template #append>
      <v-btn icon @click="deleteTask(task)">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-text-field>
</template>

<script>
export default {
  name: 'TaskItem',
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  methods: {
    completeTask(task) {
      this.$store.dispatch('tasks/completeTask', { task })
    },
    deleteTask(task) {
      this.$store.dispatch('tasks/deleteTask', { task })
    }
  }
}
</script>

<style lang="scss" scoped>
.task {
  margin: 10px 0;
  & ::v-deep .v-input__slot {
    background-color: var(--v-primary-lighten5) !important;
    box-shadow: none !important;
  }
  & ::v-deep .v-input__slot:hover {
    background-color: var(--v-primary-lighten2) !important;
  }
}
</style>
