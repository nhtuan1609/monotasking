import { v1 as uuidv1 } from 'uuid'

export const state = () => ({
  projects: [
    {
      id: uuidv1(),
      name: 'Monotasking'
    },
    {
      id: uuidv1(),
      name: 'Ditasking'
    },
    {
      id: uuidv1(),
      name: 'Tritasking'
    },
    {
      id: uuidv1(),
      name: 'Tetratasking'
    }
  ]
})

export const getters = {
  getProjects(state) {
    return state.projects
  }
}
