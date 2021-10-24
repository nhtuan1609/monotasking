<template>
  <v-layout fill-height>
    <v-flex>
      <page-title title="Tasks in list view"></page-title>

      <v-container>
        <wondering-card v-if="tasks.length === 0" class="task-list"></wondering-card>
        <div v-else class="task-list">
          <task-item v-for="(task, index) in tasks" :key="index" :task="task"></task-item>
        </div>
      </v-container>

      <new-task class="new-task-container"></new-task>
    </v-flex>
  </v-layout>
</template>

<script>
import PageTitle from '~/components/common/PageTitle.vue'
import WonderingCard from '~/components/list/WonderingCard.vue'
import TaskItem from '~/components/list/TaskItem.vue'
import NewTask from '~/components/list/NewTask.vue'

export default {
  components: { PageTitle, WonderingCard, TaskItem, NewTask },
  head: {
    title: 'My Task - List'
  },
  computed: {
    tasks() {
      return this.$store.getters['tasks/getTasks']
    }
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

.task-list {
  margin: 60px auto 160px auto;
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
