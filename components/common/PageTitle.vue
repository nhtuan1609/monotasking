<template>
  <v-toolbar class="tool-bar" height="60" elevation="0">
    <h2>{{ title }}</h2>
    <v-spacer></v-spacer>
    <slot name="rightArea"></slot>
  </v-toolbar>
</template>

<script>
export default {
  name: 'PageTitle',
  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.tool-bar {
  background-color: rgba(0, 0, 0, 0.2) !important;
  backdrop-filter: blur(4px);
  color: white;
}
</style>
