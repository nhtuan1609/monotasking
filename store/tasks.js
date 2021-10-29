import { v1 as uuidv1 } from 'uuid'
import { TASK } from '~/constants/task'

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
  deleteTask(state, params) {
    const index = state.tasks.findIndex((taskItem) => taskItem.id === params.task.id)
    state.tasks.splice(index, 1)
  },
  changePriority(state, params) {
    const index = state.tasks.findIndex((taskItem) => taskItem.id === params.task.id)
    Object.assign(state.tasks[index], { ...state.tasks[index], priority: params.priority })
  },
  changeStatus(state, params) {
    const index = state.tasks.findIndex((taskItem) => taskItem.id === params.task.id)
    Object.assign(state.tasks[index], { ...state.tasks[index], status: params.status })
  },
  changeDueDate(state, params) {
    const index = state.tasks.findIndex((taskItem) => taskItem.id === params.task.id)
    Object.assign(state.tasks[index], { ...state.tasks[index], dueDate: params.dueDate })
  },
  changeProject(state, params) {
    const index = state.tasks.findIndex((taskItem) => taskItem.id === params.task.id)
    Object.assign(state.tasks[index], { ...state.tasks[index], project: params.project })
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
        priority: { ...TASK.PRIORITY.NO_PRIORITY },
        status: { ...TASK.STATUS.BACKLOG },
        content: newTaskValidated,
        dueDate: '',
        project: {}
      }

      commit('addNewTask', { task })
    }
  },
  deleteTask({ commit }, params) {
    commit('deleteTask', params)
  },
  changePriority({ commit }, params) {
    commit('changePriority', params)
  },
  changeStatus({ commit }, params) {
    commit('changeStatus', params)
  },
  changeDueDate({ commit }, params) {
    commit('changeDueDate', params)
  },
  changeProject({ commit }, params) {
    commit('changeProject', params)
  },
  loadDataFromLocalStorage({ commit }) {
    commit('loadDataFromLocalStorage')
  },
  saveDataToLocalStorage({ commit }) {
    commit('saveDataToLocalStorage')
  }
}
