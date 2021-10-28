<template>
  <v-layout fill-height>
    <v-flex>
      <page-title title="Tasks in list view"></page-title>
      <task-list></task-list>
      <new-task class="new-task-container"></new-task>
    </v-flex>
  </v-layout>
</template>

<script>
import PageTitle from '~/components/common/PageTitle.vue'
import TaskList from '~/components/list/TaskList.vue'
import NewTask from '~/components/list/NewTask.vue'

export default {
  components: { PageTitle, TaskList, NewTask },
  head: {
    title: 'My Task - List'
  },
  beforeMount() {
    this.loadDataFromLocalStorage()
    window.addEventListener('beforeunload', this.saveDataToLocalStorage)
  },
  beforeDestroy() {
    this.saveDataToLocalStorage()
  },
  methods: {
    loadDataFromLocalStorage() {
      this.$store.dispatch('tasks/loadDataFromLocalStorage')
    },
    saveDataToLocalStorage() {
      this.$store.dispatch('tasks/saveDataToLocalStorage')
    }
  }
}
</script>

<style lang="scss" scoped>
.tool-bar {
  background-color: rgba(0, 0, 0, 0.2) !important;
  backdrop-filter: blur(4px);
  color: white;
}

.new-task-container {
  position: fixed;
  z-index: 1;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0 0 60px 0;
  backdrop-filter: blur(2px);
}
</style>
