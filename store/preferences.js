export const state = () => ({
  color: {},
  background: {}
})

export const getters = {
  getColor(state) {
    return state.color
  },
  getBackground(state) {
    return state.background
  }
}

export const mutations = {
  updateColor(state, params) {
    state.color = { ...params.color }
  },
  updateBackground(state, params) {
    state.background = { ...params.background }
  }
}

export const actions = {
  /**
   * produce update color to store
   * @param {object} commit - using to call function in mutations to update state
   * @param {object} params - parameter will be updated
   * @return {void}
   */
  updateColor({ commit }, params) {
    commit('updateColor', params)
  },
  /**
   * produce update background to store
   * @param {object} commit - using to call function in mutations to update state
   * @param {object} params - params will be updated
   * @return {void}
   */
  updateBackground({ commit }, params) {
    commit('updateBackground', params)
  }
}
