<template>
  <v-snackbar v-model="snackbar" class="ma-2" bottom right :timeout="snackbarTimeout" :color="infoSnackbarColor">
    <v-icon left>{{ infoSnackbarIcon }}</v-icon>
    {{ infoSnackbarText }}
    <template #action="{ attrs }">
      <v-btn icon depressed v-bind="attrs" @click="snackbar = false">
        <v-icon small>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
// アプリケーションからユーザへ通知するコンポーネント
export default {
  name: 'SnackBar',
  computed: {
    snackbar: {
      get() {
        return this.$store.getters['config/getInfoSnackbar']
      },
      set() {
        this.$store.dispatch('config/hideMessage')
      }
    },
    infoSnackbarText() {
      return this.$store.getters['config/getInfoSnackbarText']
    },
    infoSnackbarColor() {
      return this.$store.getters['config/getInfoSnackbarColor']
    },
    snackbarTimeout() {
      return this.$store.getters['config/getInfoSnackbarTimeout']
    },
    infoSnackbarIcon() {
      switch (this.infoSnackbarColor) {
        case 'info':
          return 'mdi-alert-circle'
        case 'warning':
          return 'mdi-alert'
        case 'success':
          return 'mdi-check-circle'
        case 'error':
          return 'mdi-cancel'
        default:
          return ''
      }
    }
  }
}
</script>
