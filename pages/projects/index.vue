<template>
  <v-layout fill-height>
    <v-flex>
      <page-title title="Projects"></page-title>
      <div class="toolbar">
        <new-project></new-project>
      </div>
      <project-list class="pa-4"></project-list>
    </v-flex>
  </v-layout>
</template>

<script>
import PageTitle from '~/components/common/PageTitle.vue'
import ProjectList from '~/components/projects/ProjectList.vue'
import NewProject from '~/components/projects/NewProject.vue'

export default {
  components: { PageTitle, ProjectList, NewProject },
  head: {
    title: 'My Task - Projects'
  }
}
</script>

<style lang="scss" scoped>
.toolbar {
  display: flex;
  justify-content: flex-end;
  background-color: transparent !important;
  margin: 16px;
  margin-bottom: 0;
}
</style>
