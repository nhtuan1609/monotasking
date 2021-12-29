import { firestoreAction } from 'vuexfire'
import { USER } from '~/constants/user'
import firebase from '~/plugins/firebase'
const db = firebase.firestore()

export const state = () => ({
  workspaces: [],
  userWorkspaces: []
})

export const getters = {
  getWorkspaces(state) {
    return state.workspaces
  },
  getUserWorkspaces(state, rootGetters) {
    return state.userWorkspaces
  }
}

export const actions = {
  // binding workspace collection
  setWorkspacesRef: firestoreAction(({ bindFirestoreRef, rootGetters }, params) => {
    bindFirestoreRef('workspaces', db.collection('workspaces').orderBy('_created', 'desc'), { wait: true })
  }),

  // binding user's workspace
  setUserWorkspacesRef: firestoreAction(({ bindFirestoreRef, rootGetters }, params) => {
    bindFirestoreRef(
      'userWorkspaces',
      db.collection('workspaces').where('members', 'array-contains', params.email).orderBy('_created', 'desc'),
      { wait: true }
    )
  }),

  /**
   * create new workspace
   * @param {object} state - local state
   * @param {object} rootGetters - getter function of store
   * @param {object} dispatch - action to update store
   * @param {object} params.name
   * @param {object} params.shortName
   * @param {object} params.user
   * @return {void}
   */
  async createWorkspace({ state, rootGetters, dispatch }, params) {
    let isSuccess = false
    const workspaceRef = db.collection('workspaces').doc()
    const data = {
      _created: firebase.firestore.FieldValue.serverTimestamp(),
      _updated: firebase.firestore.FieldValue.serverTimestamp(),
      id: workspaceRef.id,
      name: params.name,
      shortName: params.shortName,
      color: USER.DEFAULT_COLOR[Math.floor(Math.random() * USER.DEFAULT_COLOR.length)].color,
      members: [params.user.email]
    }

    await workspaceRef.set(data).then(() => {
      const userData = {
        ...params.user,
        _updated: firebase.firestore.FieldValue.serverTimestamp(),
        activeWorkspaceId: workspaceRef.id
      }
      dispatch('profile/updateProfile', { data: userData }, { root: true })
      isSuccess = true
    })

    return isSuccess
  }
}
