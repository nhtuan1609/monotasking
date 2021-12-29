<template>
  <v-app-bar class="primary" fixed app height="60">
    <v-app-bar-nav-icon v-if="activeWorkspaceId" @click.stop="$emit('toggleDrawer')" />
    <v-toolbar-title style="cursor: pointer" @click="$router.push('/')" v-text="title" />
    <v-spacer />

    <!-- setting menu -->
    <v-menu light bottom offset-y transition="slide-y-transition" min-width="280px">
      <template #activator="{ on, attrs }">
        <v-btn small fab icon outlined v-bind="attrs" v-on="on">
          <v-icon>mdi-menu-down</v-icon>
        </v-btn>
      </template>
      <v-list dense>
        <v-list-item v-if="user.email" style="height: 60px" @click="$router.push('/profile')">
          <v-list-item-title class="d-flex align-center">
            <v-avatar class="mr-2" size="40" :color="user.color">
              <span class="white--text" style="font-size: 20px; text-transform: uppercase">{{ user.shortName }}</span>
            </v-avatar>
            <div>
              <div style="font-size: 18px; font: bold; margin-bottom: 4px">{{ user.name }}</div>
              <div>View your profile</div>
            </div>
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-else @click="$router.push('/signIn')">
          <v-list-item-title>
            <v-icon left>mdi-login</v-icon>
            Sign in
          </v-list-item-title>
        </v-list-item>

        <div class="py-2">
          <v-divider></v-divider>
        </div>

        <v-list-item v-if="user.email && userWorkspaces.length">
          <v-list-item-title>
            <v-icon left>mdi-dresser</v-icon>
            Workspace
            <div class="my-2">
              <v-list-item
                v-for="(workspace, index) in userWorkspaces"
                :key="index"
                @click="changeWorkspace(workspace)"
              >
                <v-list-item-title>
                  <v-avatar class="mr-2" size="20" :color="workspace.color">
                    <span class="white--text" style="font-size: 10px">{{ workspace.shortName[0] }}</span>
                  </v-avatar>
                  {{ workspace.name }}
                </v-list-item-title>
                <v-list-item-action v-if="workspace.id === activeWorkspaceId">
                  <v-icon small>mdi-check</v-icon>
                </v-list-item-action>
              </v-list-item>
            </div>
          </v-list-item-title>
        </v-list-item>

        <div v-if="user.email" class="py-2">
          <v-divider></v-divider>
        </div>

        <v-list-item v-if="user.email" @click="$router.push('/workspaces/create')">
          <v-list-item-title>
            <v-icon left>mdi-plus-box</v-icon>
            Create a workspace
          </v-list-item-title>
        </v-list-item>

        <v-list-item @click="isShowThemeDialog = true">
          <v-list-item-title>
            <v-icon left>mdi-palette</v-icon>
            Display & Accessibility
          </v-list-item-title>
        </v-list-item>

        <v-list-item v-if="user.email" @click="logout">
          <v-list-item-title>
            <v-icon left>mdi-logout</v-icon>
            Log out
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <!-- dialog using to select primary color and background image -->
    <v-dialog v-model="isShowThemeDialog" persistent width="800">
      <v-card light>
        <v-card-title class="primary white--text py-2 px-4">Display & Accessibility</v-card-title>
        <v-card-text>
          <!-- color -->
          <div>
            <h2 class="mt-4">Color</h2>
            <v-btn
              v-for="(colorItem, index) in THEME.COLORS"
              :key="index"
              class="ma-4"
              height="80"
              width="80"
              elevation="0"
              :color="colorItem.primary"
              @click="selectColor(colorItem)"
            ></v-btn>
          </div>

          <!-- background -->
          <div>
            <h2 class="mt-4">Background</h2>
            <v-btn
              v-for="(backgroundItem, index) in THEME.BACKGROUNDS"
              :key="index"
              class="ma-4"
              height="80"
              width="80"
              elevation="0"
              @click="selectBackground(backgroundItem)"
            >
              <v-img width="80" height="80" :src="backgroundItem.path" alt="background"></v-img>
            </v-btn>
          </div>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn text outlined plain @click="cancelChangeTheme">Cancel</v-btn>
          <v-btn elevation="0" color="primary" @click="confirmChangeTheme">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app-bar>
</template>

<script>
import { THEME } from '~/constants/theme.js'

export default {
  name: 'NavigationDrawer',
  data() {
    return {
      title: 'Monotasking',
      isShowThemeDialog: false,
      currentColor: {},
      currentBackground: {}
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
    },
    user() {
      return this.$store.getters['profile/getUser']
    },
    activeWorkspaceId() {
      return this.$store.getters['profile/getActiveWorkspaceId']
    },
    userWorkspaces() {
      return this.$store.getters['workspaces/getUserWorkspaces']
    }
  },
  watch: {
    'user.email'() {
      if (this.user.email) {
        this.$store.dispatch('workspaces/setUserWorkspacesRef', { email: this.user.email })
      }
    }
  },
  created() {
    if (this.user.email) {
      this.$store.dispatch('workspaces/setUserWorkspacesRef', { email: this.user.email })
    }
  },
  methods: {
    /**
     * log out account
     * @return {void}
     */
    logout() {
      this.$store.dispatch('profile/logout').then((isSuccess) => {
        if (isSuccess) {
          this.$showSuccessNotification('Log out successfully')
        }
      })
    },
    /**
     * change color for the application
     * @param {object} color - color information which is selected
     * @return {void}
     */
    selectColor(selectedColor) {
      if (!this.currentColor.id) {
        this.currentColor = { ...this.color }
      }
      this.$store.dispatch('preferences/updateColor', { color: selectedColor })
    },
    /**
     * change background for the application
     * @param {object} background - background information which is selected
     * @return {void}
     */
    selectBackground(selectedBackground) {
      if (!this.currentBackground.id) {
        this.currentBackground = { ...this.background }
      }
      this.$store.dispatch('preferences/updateBackground', { background: selectedBackground })
    },
    /**
     * reset previous color and background close dialog
     * @return {void}
     */
    cancelChangeTheme() {
      if (this.currentColor.id) {
        this.$store.dispatch('preferences/updateColor', { color: this.currentColor })
        this.currentColor = {}
      }
      if (this.currentBackground.id) {
        this.$store.dispatch('preferences/updateBackground', { background: this.currentBackground })
        this.currentBackground = {}
      }
      this.isShowThemeDialog = false
    },
    /**
     * reset temporary variables and close dialog
     * @return {void}
     */
    confirmChangeTheme() {
      this.currentColor = {}
      this.currentBackground = {}
      this.isShowThemeDialog = false
    },
    changeWorkspace(workspace) {
      this.$store.dispatch('profile/updateProfile', {
        data: { ...this.user, activeWorkspaceId: workspace.id }
      })
    }
  }
}
</script>
