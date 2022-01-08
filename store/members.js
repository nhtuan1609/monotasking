import { firestoreAction } from 'vuexfire'
import { WORKSPACE } from '~/constants/workspace'
import firebase from '~/plugins/firebase'
const db = firebase.firestore()

export const state = () => ({
  memberDetails: [],
  memberRoles: []
})

export const getters = {
  getMemberDetails(state) {
    return state.memberDetails
  },
  getMemberRoles(state) {
    return state.memberRoles
  }
}

export const actions = {
  // binding members of current workspace with detail information
  setMemberDetailsRef: firestoreAction(({ bindFirestoreRef, rootGetters }, params) => {
    bindFirestoreRef('memberDetails', db.collection('users').where('email', 'in', params.memberEmails), {
      wait: true
    })
  }),
  // binding members of current workspace with role information
  setMemberRolesRef: firestoreAction(({ bindFirestoreRef, rootGetters }, params) => {
    bindFirestoreRef(
      'memberRoles',
      db.collection('workspaces').doc(rootGetters['profile/getActiveWorkspaceId']).collection('members'),
      {
        wait: true
      }
    )
  }),

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
    if (workspaceData.memberEmails.includes(params.email)) {
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
    const memberEmails = [...workspaceData.memberEmails, params.email]
    workspaceRef.update({ _updated, memberEmails }).then(async () => {
      const memberRef = workspaceRef.collection('members').doc(params.email)
      const memberData = {
        _created: firebase.firestore.FieldValue.serverTimestamp(),
        _updated: firebase.firestore.FieldValue.serverTimestamp(),
        email: params.email,
        role: WORKSPACE.ROLES.MEMBER.code
      }
      await memberRef.set(memberData)

      this.$showSuccessNotification('Add user to workspace successfully')
      return true
    })
    return false
  },
  /**
   * delete member of current workspace
   * @param {object} state - local state
   * @param {object} rootGetters - getter function of store
   * @param {object} params.email
   * @return {void}
   */
  async deleteMember({ state, rootGetters }, params) {
    const workspaceRef = db.collection('workspaces').doc(rootGetters['profile/getActiveWorkspaceId'])
    const workspaceSnapshot = await workspaceRef.get()
    const workspaceData = workspaceSnapshot.data()

    const _updated = firebase.firestore.FieldValue.serverTimestamp()
    const memberEmails = workspaceData.memberEmails?.filter((email) => email !== params.email) ?? []
    workspaceRef.update({ _updated, memberEmails }).then(async () => {
      const memberRef = workspaceRef.collection('members').doc(params.email)
      await memberRef.delete()

      this.$showSuccessNotification('Delete member of workspace successfully')
      return true
    })
    return false
  }
}
