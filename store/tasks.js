import { firestoreAction } from 'vuexfire'
import { TASK } from '~/constants/task'
import firebase from '~/plugins/firebase'
const db = firebase.firestore()

export const state = () => ({
  tasks: [],
  currentTask: {},
  currentActivities: []
})

export const getters = {
  getTasks(state) {
    return state.tasks
  },
  getCurrentTask(state) {
    return state.currentTask
  },
  getCurrentActivities(state) {
    return state.currentActivities
  }
}

export const actions = {
  setTasksRef: firestoreAction(({ bindFirestoreRef, rootGetters }, params) => {
    bindFirestoreRef('tasks', db.collection('tasks').orderBy('_created', 'desc'), { wait: true })
  }),
  setCurrentTaskRef: firestoreAction(({ bindFirestoreRef, rootGetters }, params) => {
    bindFirestoreRef('currentTask', db.collection('tasks').doc(params.id), { wait: true })
  }),
  setCurrentActivitiesRef: firestoreAction(({ bindFirestoreRef, rootGetters }, params) => {
    bindFirestoreRef('currentActivities', db.collection('tasks').doc(params.id).collection('activities'), {
      wait: true
    })
  }),

  addTask({ state, rootGetters }, params) {
    const ref = db.collection('tasks').doc()
    const data = {
      _created: firebase.firestore.FieldValue.serverTimestamp(),
      _updated: firebase.firestore.FieldValue.serverTimestamp(),
      id: ref.id,
      priority: { ...TASK.PRIORITY.NO_PRIORITY },
      status: { ...TASK.STATUS.BACKLOG },
      name: params.name,
      description: '',
      dueDate: '',
      project: {},
      assignee: {},
      label: {}
    }
    return ref.set(data)
  },
  deleteTask({ state, rootGetters }, params) {
    const ref = db.collection('tasks').doc(params.id)
    return ref.delete()
  },
  updateTask({ state, rootGetters }, params) {
    const ref = db.collection('tasks').doc(params.id)
    return ref.update({ ...params.data })
  },
  addComment({ state, rootGetters }, params) {
    const ref = db.collection('tasks').doc(params.taskId).collection('activities').doc()
    const data = {
      _created: firebase.firestore.FieldValue.serverTimestamp(),
      _updated: firebase.firestore.FieldValue.serverTimestamp(),
      id: ref.id,
      content: params.content
    }
    return ref.set(data)
  },
  deleteComment({ state, rootGetters }, params) {
    const ref = db.collection('tasks').doc(params.taskId).collection('activities').doc(params.id)
    return ref.delete()
  }
}
