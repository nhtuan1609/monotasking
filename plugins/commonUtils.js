export default ({ store, app, env }, inject) => {
  /*
  display message in snake bar
  */
  // display info message
  inject('showInfoNotification', function (message) {
    this.$store.dispatch('config/showMessage', message)
    this.$store.dispatch('config/setBackGroundColor', 'info')
    this.$store.dispatch('config/setInfoSnackbarTimeout', 5000)
  })
  // display warning message
  inject('showWarningNotification', function (message) {
    this.$store.dispatch('config/showMessage', message)
    this.$store.dispatch('config/setBackGroundColor', 'warning')
    this.$store.dispatch('config/setInfoSnackbarTimeout', 5000)
  })
  // display success message
  inject('showSuccessNotification', function (message) {
    this.$store.dispatch('config/showMessage', message)
    this.$store.dispatch('config/setBackGroundColor', 'success')
    this.$store.dispatch('config/setInfoSnackbarTimeout', 5000)
  })
  // display error message
  inject('showErrorNotification', function (message) {
    this.$store.dispatch('config/showMessage', message)
    this.$store.dispatch('config/setBackGroundColor', 'error')
    this.$store.dispatch('config/setInfoSnackbarTimeout', 5000)
  })
  // hide message
  inject('hideNotification', function () {
    this.$store.dispatch('config/hideMessage')
  })
}
