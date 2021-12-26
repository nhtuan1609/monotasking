<template>
  <v-app-bar class="primary" fixed app height="60">
    <v-app-bar-nav-icon v-if="tenantId" @click.stop="$emit('toggleDrawer')" />
    <v-toolbar-title style="cursor: pointer" @click="$router.push('/')" v-text="title" />
    <v-spacer />

    <!-- color menu -->
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

    <!-- background menu -->
    <v-menu light bottom transition="slide-y-transition">
      <template #activator="{ on, attrs }">
        <v-btn class="mr-2" color="primary" small fab v-bind="attrs" v-on="on">
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

    <!-- profile menu -->
    <div>
      <v-menu v-if="tenantId" light bottom offset-y transition="slide-y-transition" min-width="280px">
        <template #activator="{ on, attrs }">
          <v-btn small fab icon outlined v-bind="attrs" v-on="on">
            <v-icon>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item style="height: 60px" @click="$router.push('/profile')">
            <v-list-item-title class="d-flex align-center">
              <v-avatar class="mr-2" size="40" :color="user.color">
                <span class="white--text" style="font-size: 20px; text-transform: uppercase">{{ user.shortName }}</span>
              </v-avatar>
              <div>
                <div style="font-size: 24px; font: bold; margin-bottom: 4px">{{ user.name }}</div>
                <div>View your profile</div>
              </div>
            </v-list-item-title>
          </v-list-item>
          <div class="py-2">
            <v-divider></v-divider>
          </div>
          <v-list-item @click="logout">
            <v-list-item-title>
              <v-icon>mdi-logout</v-icon>
              Log out
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
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
    },
    user() {
      return this.$store.getters['profile/getUser']
    },
    tenantId() {
      return this.$store.getters['profile/getTenantId']
    }
  },
  methods: {
    /**
     * produce change color for the application
     * @param {object} color - color information which is selected
     * @return {void}
     */
    selectColor(color) {
      this.$store.dispatch('preferences/updateColor', { color })
    },
    /**
     * produce change background for the application
     * @param {object} background - background information which is selected
     * @return {void}
     */
    selectBackground(background) {
      this.$store.dispatch('preferences/updateBackground', { background })
    },
    /**
     * log out account
     * @return {void}
     */
    logout() {
      this.$store.dispatch('profile/logout').then((isSuccess) => {
        if (isSuccess) {
          this.$router.push('/signIn')
        }
      })
    }
  }
}
</script>
