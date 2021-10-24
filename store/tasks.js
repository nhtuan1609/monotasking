import { v1 as uuidv1 } from 'uuid'

export const state = () => ({
  tasks: []
})

export const getters = {
  getTasks(state) {
    return state.tasks
  }
}

export const mutations = {
  addNewTask(state, params) {
    state.tasks.unshift(params.task)
  },
  completeTask(state, params) {
    const index = state.tasks.findIndex((taskItem) => taskItem.id === params.task.id)
    state.tasks[index].isCompleted = !state.tasks[index].isCompleted
  },
  deleteTask(state, params) {
    const index = state.tasks.findIndex((taskItem) => taskItem.id === params.task.id)
    state.tasks.splice(index, 1)
  },
  loadDataFromLocalStorage(state) {
    try {
      const tasks = localStorage.getItem('tasks')
      state.tasks = tasks ? JSON.parse(tasks) : []
    } catch (e) {
      localStorage.removeItem('tasks')
      // eslint-disable-next-line no-console
      console.log('Load data from local storage failed.')
    }
  },
  saveDataToLocalStorage(state) {
    try {
      const parsedTasks = JSON.stringify(state.tasks)
      localStorage.setItem('tasks', parsedTasks)
    } catch (e) {
      localStorage.removeItem('tasks')
      // eslint-disable-next-line no-console
      console.log('save data to local storage failed.')
    }
  }
}

export const actions = {
  setCurrentTaskRef({ commit }, params) {
    commit('setCurrentTask', params)
  },
  addNewTask({ commit }, params) {
    const newTaskValidated = params.newTaskContent.trim()
    if (newTaskValidated) {
      const date = new Date()
      const task = {
        _created: date.toLocaleString(),
        _updated: date.toLocaleString(),
        id: uuidv1(),
        content: newTaskValidated,
        isCompleted: false,
        isPin: false
      }

      commit('addNewTask', { task })
    }
  },
  completeTask({ commit }, params) {
    commit('completeTask', params)
  },
  deleteTask({ commit }, params) {
    commit('deleteTask', params)
  },
  loadDataFromLocalStorage({ commit }) {
    commit('loadDataFromLocalStorage')
  },
  saveDataToLocalStorage({ commit }) {
    commit('saveDataToLocalStorage')
  }
}
