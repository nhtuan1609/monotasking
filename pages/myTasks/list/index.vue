<template>
  <v-layout fill-height>
    <v-flex>
      <page-title title="Tasks in list view"></page-title>
      <task-list></task-list>
      <new-task></new-task>
    </v-flex>
  </v-layout>
</template>

<script>
import PageTitle from '~/components/common/PageTitle.vue'
import TaskList from '~/components/myTasks/list/TaskList.vue'
import NewTask from '~/components/myTasks/list/NewTask.vue'

export default {
  components: { PageTitle, TaskList, NewTask },
  head: {
    title: 'My Task - List'
  }
}
</script>
