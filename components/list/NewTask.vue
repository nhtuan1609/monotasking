<template>
  <div>
    <v-container class="pt-0">
      <v-text-field
        v-model="newTaskContent"
        class="new-task"
        background-color="primary"
        label="Add a task"
        hide-details
        solo
        @focus="isAddingNewTask = true"
        @blur="isAddingNewTask = false"
        @keydown.enter="addNewTask()"
      >
        <template #prepend-inner>
          <v-btn icon>
            <v-icon v-if="isAddingNewTask">mdi-circle-outline</v-icon>
            <v-icon v-else>mdi-plus</v-icon>
          </v-btn>
        </template>
      </v-text-field>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'NewTask',
  data() {
    return {
      isAddingNewTask: false,
      newTaskContent: ''
    }
  },
  methods: {
    addNewTask() {
      this.$store.dispatch('tasks/addNewTask', {
        newTaskContent: this.newTaskContent
      })
      this.newTaskContent = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.new-task {
  & ::v-deep .v-icon {
    color: white !important;
  }

  & ::v-deep input,
  & ::v-deep label {
    color: white !important;
  }
}
</style>
