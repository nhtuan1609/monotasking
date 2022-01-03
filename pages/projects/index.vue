<template>
  <v-layout fill-height>
    <v-flex>
      <page-title title="Projects"></page-title>
      <project-list class="pa-4"></project-list>
    </v-flex>
  </v-layout>
</template>

<script>
import PageTitle from '~/components/common/PageTitle.vue'
import ProjectList from '~/components/projects/ProjectList.vue'

export default {
  components: { PageTitle, ProjectList },
  head: {
    title: 'My Task - Projects'
  }
}
</script>
