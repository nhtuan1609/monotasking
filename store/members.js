import { firestoreAction } from 'vuexfire'
import firebase from '~/plugins/firebase'
const db = firebase.firestore()

export const state = () => ({
  memberDetails: []
})

export const getters = {
  getMemberDetails(state) {
    return state.memberDetails
  }
}

export const actions = {
  // binding members of current workspace
  setMemberDetailsRef: firestoreAction(({ bindFirestoreRef, rootGetters }, params) => {
    bindFirestoreRef('memberDetails', db.collection('users').where('email', 'in', params.members), {
      wait: true
    })
  })
}
