<template>
  <v-layout fill-height>
    <v-flex>
      <v-tabs v-model="tab" light>
        <v-tab>List</v-tab>
        <v-tab>Board</v-tab>
        <v-tab>Calander</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab" class="ma-2" light>
        <v-tab-item>
          <span>List</span>
        </v-tab-item>
        <v-tab-item>
          <span>Board</span>
        </v-tab-item>
        <v-tab-item>
          <span>Calander</span>
        </v-tab-item>
      </v-tabs-items>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      tab: 0
    }
  },
  head: {
    title: 'My Tasks'
  }
}
</script>
