export const state = () => ({
  theme: null
})

export const getters = {
  getTheme(state) {
    return state.theme
  }
}

export const mutations = {
  updateTheme(state, params) {
    state.theme = { ...params.theme }
  }
}

export const actions = {
  updateTheme({ commit }, params) {
    commit('updateTheme', params)
  }
}
