<template>
  <v-app-bar class="primary" fixed app height="60">
    <v-app-bar-nav-icon @click.stop="$emit('toggleDrawer')" />
    <v-toolbar-title style="cursor: pointer" @click="$router.push('/')" v-text="title" />

    <v-spacer />

    <v-menu light bottom transition="slide-y-transition">
      <template #activator="{ on, attrs }">
        <v-btn class="mr-2" color="primary" small fab v-bind="attrs" v-on="on"></v-btn>
      </template>

      <v-list>
        <v-list-item v-for="(colorItem, index) in THEME.COLORS" :key="index" @click="selectColor(colorItem)">
          <v-list-item-title> <v-btn small fab elevation="0" :color="colorItem.primary"></v-btn></v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-menu light bottom transition="slide-y-transition">
      <template #activator="{ on, attrs }">
        <v-btn color="primary" small fab v-bind="attrs" v-on="on">
          <v-avatar size="40">
            <v-img :src="background.path" alt="background"></v-img>
          </v-avatar>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="(backgroundItem, index) in THEME.BACKGROUNDS"
          :key="index"
          @click="selectBackground(backgroundItem)"
        >
          <v-list-item-title>
            <v-btn color="primary" small fab elevation="0">
              <v-avatar size="40">
                <v-img :src="backgroundItem.path" alt="background"></v-img>
              </v-avatar>
            </v-btn>
          </v-list-item-title>
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
    },
    background() {
      return this.$store.getters['preferences/getBackground']
    }
  },
  methods: {
    selectColor(color) {
      this.$store.dispatch('preferences/updateColor', { color })
    },
    selectBackground(background) {
      this.$store.dispatch('preferences/updateBackground', { background })
    }
  }
}
</script>
