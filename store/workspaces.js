import { firestoreAction } from 'vuexfire'
import { USER } from '~/constants/user'
import { WORKSPACE } from '~/constants/workspace'
import firebase from '~/plugins/firebase'
const db = firebase.firestore()

export const state = () => ({
  workspaces: [],
  userWorkspaces: [],
  currentWorkspace: {}
})

export const getters = {
  getWorkspaces(state) {
    return state.workspaces
  },
  getUserWorkspaces(state) {
    return state.userWorkspaces
  },
  getCurrentWorkspace(state) {
    return state.currentWorkspace
  }
}

export const actions = {
  // binding workspace collection
  setWorkspacesRef: firestoreAction(({ bindFirestoreRef, rootGetters }, params) => {
    bindFirestoreRef('workspaces', db.collection('workspaces').orderBy('_created', 'desc'), { wait: true })
  }),
  // binding user's workspaces
  setUserWorkspacesRef: firestoreAction(({ bindFirestoreRef, rootGetters }, params) => {
    bindFirestoreRef(
      'userWorkspaces',
      db.collection('workspaces').where('memberEmails', 'array-contains', params.email).orderBy('_created', 'desc'),
      { wait: true }
    )
  }),
  // binding current active workspace
  setCurrentWorkspaceRef: firestoreAction(({ bindFirestoreRef, rootGetters }, params) => {
    bindFirestoreRef('currentWorkspace', db.collection('workspaces').doc(rootGetters['profile/getActiveWorkspaceId']), {
      wait: true
    })
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
      memberEmails: [params.user.email]
    }

    await workspaceRef.set(data).then(async () => {
      const userData = {
        ...params.user,
        _updated: firebase.firestore.FieldValue.serverTimestamp(),
        activeWorkspaceId: workspaceRef.id
      }
      dispatch('profile/updateProfile', { data: userData }, { root: true })

      const memberRef = workspaceRef.collection('members').doc(params.user.email)
      const memberData = {
        _created: firebase.firestore.FieldValue.serverTimestamp(),
        _updated: firebase.firestore.FieldValue.serverTimestamp(),
        email: params.user.email,
        role: WORKSPACE.ROLES.ADMIN.code
      }
      await memberRef.set(memberData)

      isSuccess = true
    })

    return isSuccess
  }
}
