<template>
  <v-app>
    <navigation-drawer v-model="drawer" :menus="menus" @toggleDrawer="toggleDrawer"></navigation-drawer>

    <app-bar @toggleDrawer="toggleDrawer"></app-bar>

    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
import { THEME } from '~/constants/theme.js'
import NavigationDrawer from '~/components/layouts/NavigationDrawer.vue'
import AppBar from '~/components/layouts/AppBar.vue'

export default {
  components: { NavigationDrawer, AppBar },
  data() {
    return {
      drawer: false,
      menus: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'My Tasks',
          subMenus: [
            {
              icon: 'mdi-order-bool-descending-variant',
              title: 'List',
              to: '/myTasks/list'
            },
            {
              icon: 'mdi-view-dashboard',
              title: 'Board',
              to: '/myTasks/board'
            },
            {
              icon: 'mdi-calendar-check',
              title: 'Calendar',
              to: '/myTasks/calendar'
            }
          ]
        }
      ]
    }
  },
  computed: {
    THEME() {
      return THEME
    },
    theme() {
      return this.$store.getters['preferences/getTheme']
    }
  },
  watch: {
    theme(newTheme) {
      if (!newTheme) return

      const theme = newTheme
      if (theme.primary) this.$vuetify.theme.themes.dark.primary = theme.primary
      if (theme.primaryDark) this.$vuetify.theme.themes.dark.primaryDark = theme.primaryDark
      if (theme.secondary) this.$vuetify.theme.themes.dark.secondary = theme.secondary
      if (theme._primary) this.$vuetify.theme.themes.dark._primary = theme._primary
      if (theme._secondary) this.$vuetify.theme.themes.dark._secondary = theme._secondary
      if (theme._accent) this.$vuetify.theme.themes.dark._accent = theme._accent
      if (theme._base) this.$vuetify.theme.themes.dark._base = theme._base
      if (theme._white) this.$vuetify.theme.themes.dark._white = theme._white
      if (theme._text) this.$vuetify.theme.themes.dark._text = theme._text
      if (theme._success) this.$vuetify.theme.themes.dark._success = theme._success
      if (theme._warning) this.$vuetify.theme.themes.dark._warning = theme._warning
      if (theme._error) this.$vuetify.theme.themes.dark._error = theme._error
      if (theme._clickable) this.$vuetify.theme.themes.dark._clickable = theme._clickable
      if (theme._hightLight) this.$vuetify.theme.themes.dark._hightLight = theme._hightLight
    }
  },
  created() {
    setTimeout(() => {
      this.$store.dispatch('preferences/updateTheme', { theme: { ...this.THEME.COLORS_DEFAULT } })
    }, 100)
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer
    }
  }
}
</script>

<style lang="scss">
html {
  overflow-y: auto;
}
body {
  background-color: var(--v-_base-base);
}
</style>

<style lang="scss" scoped>
.v-application {
  font-family: Roboto, Arial, sans-serif;
  font-style: normal;
  font-size: 16px;
  background-color: var(--v-_base-base);
  color: var(--v-_text-base);
}
</style>
