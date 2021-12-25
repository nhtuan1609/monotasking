import firebase from '~/plugins/firebase'
const db = firebase.firestore()

export const state = () => ({
  user: {},
  tenantId: null
})

export const getters = {
  getUser(state) {
    return state.user
  },
  getTenantId(state) {
    return state.tenantId
  }
}

export const mutations = {
  setUser(state, user) {
    state.user = user
  },
  setTenantId(state, tenantId) {
    state.tenantId = tenantId
  }
}

export const actions = {
  /**
   * register new user
   * @param {object} state - local state
   * @param {object} rootGetters - getter function of store
   * @param {object} params.email
   * @param {object} params.password
   * @return {void}
   */
  async register({ state, rootGetters, commit }, params) {
    let isSuccess = false
    await firebase
      .auth()
      .createUserWithEmailAndPassword(params.email, params.password)
      .then(async () => {
        const userRef = db.collection('tenantUsers').doc()
        const data = {
          _created: firebase.firestore.FieldValue.serverTimestamp(),
          _updated: firebase.firestore.FieldValue.serverTimestamp(),
          id: userRef.id,
          email: params.email
        }
        await userRef.set(data).then(() => {
          commit('setUser', data)
          commit('setTenantId', data.id)
          isSuccess = true
        })
      })
      .catch((error) => {
        console.log('Register error', error)
      })

    return isSuccess
  },
  /**
   * login user
   * @param {object} state - local state
   * @param {object} rootGetters - getter function of store
   * @param {object} params.email
   * @param {object} params.password
   * @return {void}
   */
  async login({ state, rootGetters, commit }, params) {
    let isSuccess = false
    await firebase
      .auth()
      .signInWithEmailAndPassword(params.email, params.password)
      .then(async () => {
        const usersRef = await db.collection('tenantUsers').get()
        const currentUser = usersRef.docs.find((doc) => {
          const data = doc.data()
          return data.email === params.email
        })
        if (currentUser) {
          const data = currentUser.data()
          commit('setUser', data)
          commit('setTenantId', data.id)
          isSuccess = true
        }
      })
      .catch((error) => {
        console.log('Login error', error)
      })

    return isSuccess
  }
}
