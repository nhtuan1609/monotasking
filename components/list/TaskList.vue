<template>
  <v-container>
    <wondering-card v-if="tasks.length === 0" class="task-list"></wondering-card>
    <div v-else class="task-list">
      <task-item
        v-for="(task, index) in tasks"
        :key="index"
        :task="task"
        @right-click="(event) => openRightMenu(event, task)"
      ></task-item>
    </div>

    <context-menu
      v-model="isOpenRightMenu"
      v-click-outside="onClickOutside"
      min-width="200"
      :position-x="menuX"
      :position-y="menuY"
      absolute
      offset-y
      :task="selectedTask"
      @close="isOpenRightMenu = false"
    ></context-menu>
  </v-container>
</template>

<script>
import WonderingCard from '~/components/list/WonderingCard.vue'
import TaskItem from '~/components/list/TaskItem.vue'
import ContextMenu from '~/components/list/ContextMenu.vue'
import clickOutside from '~/directives/clickOutside.js'

export default {
  components: { WonderingCard, TaskItem, ContextMenu },
  directives: {
    clickOutside
  },
  data() {
    return {
      isOpenRightMenu: false,
      menuX: 0,
      menuY: 0,
      selectedTask: {}
    }
  },
  computed: {
    tasks() {
      return this.$store.getters['tasks/getTasks']
    }
  },
  methods: {
    openRightMenu(event, task) {
      event.preventDefault()
      event.stopPropagation()
      if (!this.isOpenRightMenu || (this.isOpenRightMenu && task.id !== this.selectedTask.id)) {
        this.menuX = event.clientX
        this.menuY = event.clientY
        this.selectedTask = { ...task }
        this.isOpenRightMenu = true
      } else if (this.isOpenRightMenu && task.id === this.selectedTask.id) {
        this.isOpenRightMenu = false
      }
    },
    onClickOutside() {
      this.isOpenRightMenu = false
    }
  }
}
</script>

<style lang="scss" scoped>
.task-list {
  margin: 60px auto 160px auto;
}
</style>
