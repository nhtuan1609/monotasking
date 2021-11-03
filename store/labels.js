export const state = () => ({
  labels: [
    {
      id: '0',
      name: 'Bug',
      color: '#eb5757'
    },
    {
      id: '1',
      name: 'Feature',
      color: '#bb87fc'
    },
    {
      id: '2',
      name: 'Improvement',
      color: '#4ea7fc'
    },
    {
      id: '4',
      name: 'Refactor',
      color: '#0f7488'
    },
    {
      id: '3',
      name: 'Q&A',
      color: '#bec2c8'
    }
  ]
})

export const getters = {
  getLabels(state) {
    return state.labels
  }
}
