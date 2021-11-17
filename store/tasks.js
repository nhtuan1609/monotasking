import { firestoreAction } from 'vuexfire'
import { TASK } from '~/constants/task'
import firebase from '~/plugins/firebase'
const db = firebase.firestore()

export const state = () => ({
  tasks: [],
  currentTask: {}
})

export const getters = {
  getTasks(state) {
    return state.tasks
  },
  getCurrentTask(state) {
    return state.currentTask
  }
}

export const actions = {
  setTasksRef: firestoreAction(({ bindFirestoreRef, rootGetters }, params) => {
    bindFirestoreRef('tasks', db.collection('tasks'))
  }),
  setCurrentTaskRef: firestoreAction(({ bindFirestoreRef, rootGetters }, params) => {
    bindFirestoreRef('currentTask', db.collection('tasks').doc(params.id))
  }),

  addNewTask({ state, rootGetters }, params) {
    const ref = db.collection('tasks').doc()
    const data = {
      _created: firebase.firestore.FieldValue.serverTimestamp(),
      _updated: firebase.firestore.FieldValue.serverTimestamp(),
      id: ref.id,
      priority: { ...TASK.PRIORITY.NO_PRIORITY },
      status: { ...TASK.STATUS.BACKLOG },
      name: params.name,
      dueDate: '',
      project: {},
      assignee: {},
      label: {}
    }

    ref.set(data)
  },
  deleteTask({ state, rootGetters }, params) {
    const ref = db.collection('tasks').doc(params.task.id)
    ref.delete()
  },
  changePriority({ state, rootGetters }, params) {
    const ref = db.collection('tasks').doc(params.task.id)
    ref.update({ priority: params.priority })
  },
  changeStatus({ state, rootGetters }, params) {
    const ref = db.collection('tasks').doc(params.task.id)
    ref.update({ status: params.status })
  },
  changeDueDate({ state, rootGetters }, params) {
    const ref = db.collection('tasks').doc(params.task.id)
    ref.update({ dueDate: params.dueDate })
  },
  changeProject({ state, rootGetters }, params) {
    const ref = db.collection('tasks').doc(params.task.id)
    ref.update({ project: params.project })
  },
  changeAssignee({ state, rootGetters }, params) {
    const ref = db.collection('tasks').doc(params.task.id)
    ref.update({ assignee: params.assignee })
  },
  changeName({ state, rootGetters }, params) {
    const ref = db.collection('tasks').doc(params.task.id)
    ref.update({ name: params.name })
  },
  changeLabel({ state, rootGetters }, params) {
    const ref = db.collection('tasks').doc(params.task.id)
    ref.update({ label: params.label })
  }
}
