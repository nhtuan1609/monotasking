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
  // binding tasks collection
  setTasksRef: firestoreAction(({ bindFirestoreRef, rootGetters }, params) => {
    bindFirestoreRef('tasks', db.collection('tasks').orderBy('_created', 'desc'), { wait: true })
  }),
  // binding current selected task
  setCurrentTaskRef: firestoreAction(({ bindFirestoreRef, rootGetters }, params) => {
    bindFirestoreRef('currentTask', db.collection('tasks').doc(params.id), { wait: true })
  }),
  // binding activities of current selected task
  setCurrentActivitiesRef: firestoreAction(({ bindFirestoreRef, rootGetters }, params) => {
    bindFirestoreRef(
      'currentActivities',
      db.collection('tasks').doc(params.id).collection('activities').orderBy('_created', 'desc'),
      { wait: true }
    )
  }),

  /**
   * add new task to task collection
   * @param {object} state - local state
   * @param {object} rootGetters - getter function of store
   * @param {object} params.name - name of new task
   * @return {void}
   */
  async addTask({ state, rootGetters }, params) {
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

    await ref.set(data).then(async () => {
      const activityRef = db.collection('tasks').doc(ref.id).collection('activities').doc()
      const activity = {
        _created: firebase.firestore.FieldValue.serverTimestamp(),
        _updated: firebase.firestore.FieldValue.serverTimestamp(),
        id: activityRef.id,
        activityType: TASK.ACTIVITY_TYPE.CREATE_TASK,
        before: {},
        data,
        updater: {
          id: '0',
          name: 'Hoang Tuan',
          color: '#585a2b',
          shortName: 'T'
        }
      }
      await activityRef.set(activity)
    })
  },
  /**
   * delete task in task collection
   * @param {object} state - local state
   * @param {object} rootGetters - getter function of store
   * @param {object} params.id - id of task will be deleted
   * @return {void}
   */
  deleteTask({ state, rootGetters }, params) {
    const ref = db.collection('tasks').doc(params.id)
    return ref.delete()
  },
  /**
   * update data for task
   * @param {object} state - local state
   * @param {object} rootGetters - getter function of store
   * @param {object} params.id - id task will be updated
   * @param {object} params.data - data will be updated
   * @param {object} params.activityType - type of activity
   * @return {void}
   */
  async updateTask({ state, rootGetters }, params) {
    const ref = db.collection('tasks').doc(params.id)
    await ref.update(params.data).then(async () => {
      const before = await ref.get()
      const activityRef = db.collection('tasks').doc(params.id).collection('activities').doc()
      const activity = {
        _created: firebase.firestore.FieldValue.serverTimestamp(),
        _updated: firebase.firestore.FieldValue.serverTimestamp(),
        id: activityRef.id,
        activityType: params.activityType,
        before: before.data(),
        data: params.data,
        updater: {
          id: '0',
          name: 'Hoang Tuan',
          color: '#585a2b',
          shortName: 'T'
        }
      }
      activityRef.set(activity)
    })
  },
  /**
   * add new comment for current task
   * @param {object} state - local state
   * @param {object} rootGetters - getter function of store
   * @param {object} params.taskId - id of current task
   * @param {object} params.content - content of comment
   * @return {void}
   */
  addComment({ state, rootGetters }, params) {
    const activityRef = db.collection('tasks').doc(params.taskId).collection('activities').doc()
    const activity = {
      _created: firebase.firestore.FieldValue.serverTimestamp(),
      _updated: firebase.firestore.FieldValue.serverTimestamp(),
      id: activityRef.id,
      activityType: TASK.ACTIVITY_TYPE.ADD_COMMENT,
      before: {},
      data: {
        content: params.content
      },
      updater: {
        id: '0',
        name: 'Hoang Tuan',
        color: '#585a2b',
        shortName: 'T'
      }
    }
    return activityRef.set(activity)
  },
  /**
   * delete comment of current task
   * @param {object} state - local state
   * @param {object} rootGetters - getter function of store
   * @param {object} params.taskId - id of current task
   * @param {object} params.id - id of comment will be deleted
   * @return {void}
   */
  deleteComment({ state, rootGetters }, params) {
    const ref = db.collection('tasks').doc(params.taskId).collection('activities').doc(params.id)
    return ref.delete()
  }
}
