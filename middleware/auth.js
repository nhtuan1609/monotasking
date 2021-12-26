import firebase from 'firebase/app'
import 'firebase/auth'

export default function ({ route, store, redirect, $logger }) {
  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      const userRef = await firebase.firestore().collection('tenantUsers').doc(user.email).get()
      const data = userRef.data()
      store.commit('profile/setUser', data)
      store.commit('profile/setTenantId', data.tenantId)
    } else if (route.name !== 'index' && route.name !== 'signIn' && route.name !== 'signUp') {
      redirect('/')
    }
  })
}
