export const state = () => ({
  projects: [
    {
      id: '0',
      name: 'Monotasking'
    },
    {
      id: '1',
      name: 'Ditasking'
    },
    {
      id: '2',
      name: 'Tritasking'
    },
    {
      id: '3',
      name: 'Tetratasking'
    }
  ]
})

export const getters = {
  getProjects(state) {
    return state.projects
  }
}
