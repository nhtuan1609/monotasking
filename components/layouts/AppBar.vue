<template>
  <v-app-bar class="primary" fixed app height="60">
    <v-app-bar-nav-icon @click.stop="$emit('toggleDrawer')" />
    <v-toolbar-title v-text="title" />
    <v-spacer />
    <v-menu light bottom transition="slide-y-transition">
      <template #activator="{ on, attrs }">
        <v-btn color="primary" small fab v-bind="attrs" v-on="on"></v-btn>
      </template>

      <v-list>
        <v-list-item v-for="(themeItem, index) in THEME.COLORS" :key="index">
          <v-list-item-title>
            <v-btn small fab elevation="0" :color="themeItem.primary" @click="selectTheme(themeItem)"></v-btn
          ></v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import { THEME } from '~/constants/theme.js'

export default {
  name: 'NavigationDrawer',
  data() {
    return {
      title: 'Monotasking'
    }
  },
  computed: {
    THEME() {
      return THEME
    }
  },
  methods: {
    selectTheme(theme) {
      this.$store.dispatch('preferences/updateTheme', { theme })
    }
  }
}
</script>
