<template>
  <v-layout fill-height>
    <v-flex>
      <page-title title="Project details">
        <template #rightArea>
          <v-btn text height="100%" @click="$router.back()">
            <v-icon left>mdi-arrow-left-circle</v-icon>
            <span>Go back</span>
          </v-btn>
        </template>
      </page-title>
      <project-details></project-details>
    </v-flex>
  </v-layout>
</template>

<script>
import PageTitle from '~/components/common/PageTitle.vue'
import ProjectDetails from '~/components/projects/ProjectDetails.vue'

export default {
  components: { PageTitle, ProjectDetails },
  head: {
    title: 'My Task - Projects'
  }
}
</script>
