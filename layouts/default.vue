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
    color() {
      return this.$store.getters['preferences/getColor']
    },
    background() {
      return this.$store.getters['preferences/getBackground']
    }
  },
  watch: {
    color(newColor) {
      if (!newColor) return
      if (newColor.primary) this.$vuetify.theme.themes.dark.primary = newColor.primary
      if (newColor.primaryDark) this.$vuetify.theme.themes.dark.primaryDark = newColor.primaryDark
      if (newColor.secondary) this.$vuetify.theme.themes.dark.secondary = newColor.secondary
      if (newColor._primary) this.$vuetify.theme.themes.dark._primary = newColor._primary
      if (newColor._secondary) this.$vuetify.theme.themes.dark._secondary = newColor._secondary
      if (newColor._accent) this.$vuetify.theme.themes.dark._accent = newColor._accent
      if (newColor._base) this.$vuetify.theme.themes.dark._base = newColor._base
      if (newColor._white) this.$vuetify.theme.themes.dark._white = newColor._white
      if (newColor._text) this.$vuetify.theme.themes.dark._text = newColor._text
      if (newColor._success) this.$vuetify.theme.themes.dark._success = newColor._success
      if (newColor._warning) this.$vuetify.theme.themes.dark._warning = newColor._warning
      if (newColor._error) this.$vuetify.theme.themes.dark._error = newColor._error
      if (newColor._clickable) this.$vuetify.theme.themes.dark._clickable = newColor._clickable
      if (newColor._hightLight) this.$vuetify.theme.themes.dark._hightLight = newColor._hightLight
    },
    background(newBackground) {
      if (newBackground) {
        document.getElementsByTagName('BODY')[0].style.backgroundImage = `url(${newBackground.path})`
      }
    }
  },
  created() {
    setTimeout(() => {
      this.$store.dispatch('preferences/updateColor', { color: { ...this.THEME.COLORS_DEFAULT } })
      this.$store.dispatch('preferences/updateBackground', { background: { ...this.THEME.BACKGROUND_DEFAULT } })
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
  &::-webkit-scrollbar {
    width: 10px;
    background-color: transparent;
  }
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: var(--v-_base-base);
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--v-_base-darken3);
    border-radius: 4px;
  }
}
body {
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
}
</style>

<style lang="scss" scoped>
.v-application {
  font-family: Roboto, Arial, sans-serif;
  font-style: normal;
  font-size: 16px;
  color: var(--v-_text-base);
  background: transparent;
}
</style>
