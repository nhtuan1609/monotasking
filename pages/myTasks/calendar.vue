<template>
  <v-layout fill-height>
    <v-flex>
      <page-title title="Tasks in calendar view"></page-title>
    </v-flex>
  </v-layout>
</template>

<script>
import PageTitle from '~/components/common/PageTitle.vue'

export default {
  components: { PageTitle },
  head: {
    title: 'My Task - Calendar'
  }
}
</script>
