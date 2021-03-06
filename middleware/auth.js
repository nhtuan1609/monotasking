import firebase from 'firebase/app'
import 'firebase/auth'

export default function ({ route, store, redirect }) {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const currentUser = store.getters['profile/getUser']
      if (currentUser.email && user.email !== currentUser.email) {
        store.commit('profile/clearAll')
        firebase.auth().signOut()
      }
      if (currentUser.email && user.email === currentUser.email && ['signIn', 'signUp'].includes(route.name)) {
        redirect('/')
      }
    } else if (!['index', 'signIn', 'signUp'].includes(route.name)) {
      redirect('/signIn')
    }
  })
}
