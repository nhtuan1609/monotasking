export const state = () => ({
  currentUser: {
    id: '0',
    name: 'Hoang Tuan',
    color: '#FFC312',
    shortName: 'T'
  }
})

export const getters = {
  getCurrentUser(state) {
    return state.currentUser
  }
}
