export default ({ store, app, env }, inject) => {
  /*
  display message in snake bar
  */
  // display info message
  inject('showInfoNotification', function (message) {
    store.dispatch('config/showMessage', message)
    store.dispatch('config/setBackGroundColor', 'info')
    store.dispatch('config/setInfoSnackbarTimeout', 5000)
  })
  // display warning message
  inject('showWarningNotification', function (message) {
    store.dispatch('config/showMessage', message)
    store.dispatch('config/setBackGroundColor', 'warning')
    store.dispatch('config/setInfoSnackbarTimeout', 5000)
  })
  // display success message
  inject('showSuccessNotification', function (message) {
    store.dispatch('config/showMessage', message)
    store.dispatch('config/setBackGroundColor', 'success')
    store.dispatch('config/setInfoSnackbarTimeout', 5000)
  })
  // display error message
  inject('showErrorNotification', function (message) {
    store.dispatch('config/showMessage', message)
    store.dispatch('config/setBackGroundColor', 'error')
    store.dispatch('config/setInfoSnackbarTimeout', 5000)
  })
  // hide message
  inject('hideNotification', function () {
    store.dispatch('config/hideMessage')
  })
}
