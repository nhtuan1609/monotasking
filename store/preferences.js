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
  updateColor({ commit }, params) {
    commit('updateColor', params)
  },
  updateBackground({ commit }, params) {
    commit('updateBackground', params)
  }
}
