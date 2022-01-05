import { firestoreAction } from 'vuexfire'
import { PROJECT } from '~/constants/project'
import firebase from '~/plugins/firebase'
const db = firebase.firestore()

export const state = () => ({
  projects: [],
  currentProject: {}
})

export const getters = {
  getProjects(state) {
    return state.projects
  },
  getCurrentProject(state) {
    return state.currentProject
  }
}

export const actions = {
  // binding projects collection
  setProjectsRef: firestoreAction(({ bindFirestoreRef, rootGetters }, params) => {
    bindFirestoreRef(
      'projects',
      db
        .collection('workspaces')
        .doc(rootGetters['profile/getActiveWorkspaceId'])
        .collection('projects')
        .orderBy('_created', 'desc'),
      {
        wait: true
      }
    )
  }),
  // binding current selected project
  setCurrentProjectRef: firestoreAction(({ bindFirestoreRef, rootGetters }, params) => {
    bindFirestoreRef(
      'currentProject',
      db
        .collection('workspaces')
        .doc(rootGetters['profile/getActiveWorkspaceId'])
        .collection('projects')
        .doc(params.id),
      { wait: true }
    )
  }),

  /**
   * add new project to project collection
   * @param {object} state - local state
   * @param {object} rootGetters - getter function of store
   * @param {object} params - data of project
   * @return {void}
   */
  async addProject({ state, rootGetters }, params) {
    const ref = db
      .collection('workspaces')
      .doc(rootGetters['profile/getActiveWorkspaceId'])
      .collection('projects')
      .doc()
    const data = {
      ...params,
      _created: firebase.firestore.FieldValue.serverTimestamp(),
      _updated: firebase.firestore.FieldValue.serverTimestamp(),
      id: ref.id
    }

    await ref.set(data).then(() => {
      const activityRef = db
        .collection('workspaces')
        .doc(rootGetters['profile/getActiveWorkspaceId'])
        .collection('projects')
        .doc(ref.id)
        .collection('activities')
        .doc()
      const activity = {
        _created: firebase.firestore.FieldValue.serverTimestamp(),
        _updated: firebase.firestore.FieldValue.serverTimestamp(),
        id: activityRef.id,
        activityType: PROJECT.ACTIVITY_TYPE.CREATE_PROJECT,
        before: {},
        data,
        updater: rootGetters['profile/getUser']
      }
      return activityRef.set(activity)
    })
  },
  /**
   * delete project in project collection
   * @param {object} state - local state
   * @param {object} rootGetters - getter function of store
   * @param {object} params.id - id of project will be deleted
   * @return {void}
   */
  async deleteProject({ state, rootGetters }, params) {
    const ref = db
      .collection('workspaces')
      .doc(rootGetters['profile/getActiveWorkspaceId'])
      .collection('projects')
      .doc(params.id)

    // delete all activities before delete task to hard delete
    const activityRef = await ref.collection('activities').get()
    for (const doc of activityRef.docs) {
      doc.ref.delete()
    }
    return ref.delete()
  },
  /**
   * update data for project and create activity
   * @param {object} state - local state
   * @param {object} rootGetters - getter function of store
   * @param {object} params.id - id project will be updated
   * @param {object} params.data - data will be updated
   * @param {object} params.activityType - type of activity
   * @return {void}
   */
  async updateProject({ state, rootGetters }, params) {
    const ref = db
      .collection('workspaces')
      .doc(rootGetters['profile/getActiveWorkspaceId'])
      .collection('projects')
      .doc(params.id)
    params.data._updated = firebase.firestore.FieldValue.serverTimestamp()
    await ref.update(params.data).then(async () => {
      const beforeRef = await ref.get()
      const currentUser = rootGetters['profile/getUser']
      let activityRef = db
        .collection('workspaces')
        .doc(rootGetters['profile/getActiveWorkspaceId'])
        .collection('project')
        .doc(params.id)
        .collection('activities')
        .doc()

      // check latest activity, if it was created by same user, same type and less than 30 minutes, we will update it with new data
      const activities = await db
        .collection('workspaces')
        .doc(rootGetters['profile/getActiveWorkspaceId'])
        .collection('project')
        .doc(params.id)
        .collection('activities')
        .orderBy('_created', 'desc')
        .get()

      const latestActivity = activities.docs[0]?.data()
      if (latestActivity && latestActivity.updater.id === currentUser.id) {
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
        updater: currentUser
      }
      return activityRef.set(activity)
    })
  }
}
