<template>
  <v-layout fill-height>
    <v-flex>
      <page-title title="Tasks in board view">
        <template #rightArea>
          <v-btn text height="100%" @click="$router.back()">
            <v-icon left>mdi-arrow-left-circle</v-icon>
            <span>Go back</span>
          </v-btn>
        </template>
      </page-title>

      <coming-soon></coming-soon>
    </v-flex>
  </v-layout>
</template>

<script>
import PageTitle from '~/components/common/PageTitle.vue'
import ComingSoon from '~/components/common/ComingSoon.vue'

export default {
  components: { PageTitle, ComingSoon },
  head: {
    title: 'My Task - Board'
  }
}
</script>
