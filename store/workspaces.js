import { firestoreAction } from 'vuexfire'
import { USER } from '~/constants/user'
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
      db.collection('workspaces').where('members', 'array-contains', params.email).orderBy('_created', 'desc'),
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
  },
  /**
   * add new member to workspace
   * @param {object} state - local state
   * @param {object} rootGetters - getter function of store
   * @param {object} params.email
   * @return {void}
   */
  async addNewMember({ state, rootGetters }, params) {
    // check user has been in workspace
    const workspaceRef = db.collection('workspaces').doc(rootGetters['profile/getActiveWorkspaceId'])
    const workspaceSnapshot = await workspaceRef.get()
    const workspaceData = workspaceSnapshot.data()
    if (workspaceData.members.includes(params.email)) {
      this.$showErrorNotification('User has been in workspace')
      return false
    }

    // check user do not exist
    const usersRef = await db.collection('users').get()
    const user = usersRef.docs.find((user) => {
      const userData = user.data()
      return userData.email === params.email
    })
    if (!user) {
      this.$showErrorNotification('User does not exist')
      return false
    }

    // update members of workspace to firestore
    const _updated = firebase.firestore.FieldValue.serverTimestamp()
    const members = [...workspaceData.members, params.email]
    workspaceRef.update({ _updated, members }).then(() => {
      this.$showSuccessNotification('Add user to workspace successfully')
      return true
    })
    return false
  }
}
