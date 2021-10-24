<template>
  <v-layout fill-height>
    <v-flex>
      <page-title title="Tasks in board view"></page-title>
    </v-flex>
  </v-layout>
</template>

<script>
import PageTitle from '~/components/common/PageTitle.vue'

export default {
  components: { PageTitle },
  head: {
    title: 'My Task - Board'
  }
}
</script>
