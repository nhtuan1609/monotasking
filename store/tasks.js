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
      label: {},
      checklist: {
        _autoNumber: 0,
        checkedIds: [],
        items: [],
        progress: 0
      }
    }

    await ref.set(data).then(() => {
      const activityRef = db.collection('tasks').doc(ref.id).collection('activities').doc()
      const activity = {
        _created: firebase.firestore.FieldValue.serverTimestamp(),
        _updated: firebase.firestore.FieldValue.serverTimestamp(),
        id: activityRef.id,
        activityType: TASK.ACTIVITY_TYPE.CREATE_TASK,
        before: {},
        data,
        updater: rootGetters['users/getCurrentUser']
      }
      return activityRef.set(activity)
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
   * update data for task and create activity
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
      const beforeRef = await ref.get()
      let activityRef = db.collection('tasks').doc(params.id).collection('activities').doc()

      // check latest activity, if it was same type and created less than 30 minutes, we will update it with new data
      const activities = await db
        .collection('tasks')
        .doc(params.id)
        .collection('activities')
        .orderBy('_created', 'desc')
        .get()

      const latestActivity = activities.docs[0]?.data()
      if (latestActivity) {
        const currentTime = new Date().valueOf()
        const latestTime = latestActivity._created.toDate().valueOf()
        const diffTime = 30 * 60 * 1000 // milliseconds
        if (latestActivity.activityType.code === params.activityType.code && currentTime - latestTime < diffTime) {
          activityRef = activities.docs[0].ref
        }
      }

      // create activity
      const activity = {
        _created: firebase.firestore.FieldValue.serverTimestamp(),
        _updated: firebase.firestore.FieldValue.serverTimestamp(),
        id: activityRef.id,
        activityType: params.activityType,
        before: beforeRef.data() ?? {},
        data: params.data,
        updater: rootGetters['users/getCurrentUser']
      }
      return activityRef.set(activity)
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
      updater: rootGetters['users/getCurrentUser']
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
