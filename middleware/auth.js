import firebase from 'firebase/app'
import 'firebase/auth'

export default function ({ route, store, redirect, $logger }) {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const currentUser = store.getters['profile/getUser']
      if (currentUser.email && user.email !== currentUser.email) {
        store.commit('profile/clearAll')
        firebase.auth().signOut()
      }
    } else if (!['index', 'signIn', 'signOut'].includes(route.name)) {
      redirect('/')
    }
  })
}
