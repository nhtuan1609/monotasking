<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" class="primary" fixed app>
      <v-list-item style="height: 60px">
        <v-list-item-content>
          <v-list-item-title>
            <div class="app-name">Monotasking</div>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider />
      <v-list>
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar class="primary" fixed app height="60">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
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

    <v-main class="white" style="color: var(--v-_text-base)">
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
import { THEME } from '~/constants/theme.js'

export default {
  data() {
    return {
      drawer: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'My Tasks',
          to: '/mytasks'
        }
      ],
      title: 'Frontend Developer'
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
    selectTheme(theme) {
      this.$store.dispatch('preferences/updateTheme', { theme })
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
}
.app-name {
  font-size: 30px;
  font-weight: bold;
  text-align: center;
}
</style>
