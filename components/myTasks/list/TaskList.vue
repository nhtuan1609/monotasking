<template>
  <v-container v-if="!isLoading">
    <!-- show wondering card if tasks length is 0 -->
    <wondering-card v-if="tasks.length === 0" class="task-list"></wondering-card>

    <!-- tasks -->
    <div v-else class="task-list">
      <task-item
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        :class="isShowContextMenu && selectedTask.id === task.id ? 'selecting' : isShowContextMenu && 'no-selecting'"
        @contextmenu="showContextMenu($event, task)"
      ></task-item>
    </div>

    <!-- show context menu when right clicking on a task-->
    <context-menu
      :is-show-context-menu="isShowContextMenu"
      :menu-x="menuX"
      :menu-y="menuY"
      :selected-task="selectedTask"
    ></context-menu>
  </v-container>
</template>

<script>
import WonderingCard from '~/components/myTasks/list/WonderingCard.vue'
import TaskItem from '~/components/myTasks/list/TaskItem.vue'
import ContextMenu from '~/components/myTasks/list/ContextMenu.vue'

export default {
  name: 'TaskList',
  components: {
    WonderingCard,
    TaskItem,
    ContextMenu
  },
  data() {
    return {
      isShowContextMenu: false,
      menuX: 0,
      menuY: 0,
      selectedTask: {},
      isLoading: true
    }
  },
  computed: {
    tasks() {
      return this.$store.getters['tasks/getTasks']
    }
  },
  watch: {
    tasks() {
      this.isLoading = false
    }
  },
  created() {
    this.$store.dispatch('tasks/setTasksRef')
  },
  methods: {
    /**
     * produce show context menu for selected task
     * @param {object} event - right mouse click event
     * @param {object} task - task information which is selected
     * @return {void}
     */
    showContextMenu(event, task) {
      event.preventDefault()
      this.selectedTask = JSON.parse(JSON.stringify(task))
      this.menuX = event.clientX
      this.menuY = event.clientY
      this.isShowContextMenu = true
    }
  }
}
</script>

<style lang="scss" scoped>
.task-list {
  margin: 60px auto 160px auto;
  .selecting {
    background-color: var(--v-primary-lighten2);
  }
  .no-selecting {
    background-color: var(--v-primary-lighten5);
  }
}
</style>
