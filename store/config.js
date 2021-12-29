export const state = () => ({
  infoSnackbar: false, // ON / OFF control of Snackbar for message display
  infoSnackbarText: '', // message to display in Snackbar
  infoSnackbarColor: '', // snackbar background color
  infoSnackbarTimeout: 5000 // snackbar timeout
})

export const getters = {
  getInfoSnackbar(state) {
    return state.infoSnackbar
  },
  getInfoSnackbarText(state) {
    return state.infoSnackbarText
  },
  getInfoSnackbarColor(state) {
    return state.infoSnackbarColor
  },
  getInfoSnackbarTimeout(state) {
    return state.infoSnackbarTimeout
  }
}

export const mutations = {
  setInfoSnackbar(state, infoSnackbar) {
    state.infoSnackbar = infoSnackbar
  },
  setInfoSnackbarText(state, infoSnackbarText) {
    state.infoSnackbarText = infoSnackbarText
  },
  setInfoSnackbarColor(state, infoSnackbarColor) {
    state.infoSnackbarColor = infoSnackbarColor
  },
  setInfoSnackbarTimeout(state, infoSnackbarTimeout) {
    state.infoSnackbarTimeout = infoSnackbarTimeout
  }
}

export const actions = {
  /**
   * show snackbar and text message
   * @param {object} state - local state
   * @param {object} commit - action to update store
   * @param {string} message - message will be shown
   * @return {void}
   */
  showMessage({ commit }, message) {
    commit('setInfoSnackbar', true)
    commit('setInfoSnackbarText', message)
  },
  /**
   * set background color of snackbar
   * @param {object} state - local state
   * @param {object} commit - action to update store
   * @param {string} color - background color of snackbar
   * @return {void}
   */
  setBackGroundColor({ commit }, color) {
    commit('setInfoSnackbarColor', color)
  },
  /**
   * set timeout of snackbar
   * @param {object} state - local state
   * @param {object} commit - action to update store
   * @param {string} timeout - timeout that message will be closed
   * @return {void}
   */
  setInfoSnackbarTimeout({ commit }, timeout) {
    commit('setInfoSnackbarTimeout', timeout)
  },
  /**
   * hide message
   * @param {object} state - local state
   * @param {object} commit - action to update store
   * @return {void}
   */
  hideMessage({ commit }) {
    commit('setInfoSnackbar', false)
  }
}
