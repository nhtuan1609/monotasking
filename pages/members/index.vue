<template>
  <v-layout fill-height>
    <v-flex>
      <page-title title="Members">
        <template #rightArea>
          <v-btn text height="100%" @click="$router.back()">
            <v-icon left>mdi-arrow-left-circle</v-icon>
            <span>Go back</span>
          </v-btn>
        </template>
      </page-title>

      <member-list></member-list>
    </v-flex>
  </v-layout>
</template>

<script>
import PageTitle from '~/components/common/PageTitle.vue'
import MemberList from '~/components/members/MemberList.vue'

export default {
  components: { PageTitle, MemberList },
  head: {
    title: 'My Task - Members'
  }
}
</script>
