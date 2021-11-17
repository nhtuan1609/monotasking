<template>
  <v-layout fill-height>
    <v-flex>
      <page-title title="Task details">
        <template #rightArea>
          <v-btn text height="100%" @click="$router.push('/myTasks/list')">
            <v-icon left>mdi-arrow-left-circle</v-icon>
            <span>Go back</span>
          </v-btn>
        </template>
      </page-title>
      <task-details :task-id="taskId"></task-details>
    </v-flex>
  </v-layout>
</template>

<script>
import PageTitle from '~/components/common/PageTitle.vue'
import TaskDetails from '~/components/list/TaskDetails.vue'

export default {
  components: { PageTitle, TaskDetails },
  head: {
    title: 'My Task - Details'
  },
  computed: {
    taskId() {
      return this.$route.params.id
    }
  }
}
</script>
