import firebase from '~/plugins/firebase'
import { USER } from '~/constants/user'

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
      .createUserWithEmailAndPassword(params.user.email, params.user.password)
      .then(async (res) => {
        const userRef = db.collection('tenantUsers').doc(res.user.email)
        const tenantsRef = db.collection('tenants').doc()
        const data = {
          _created: firebase.firestore.FieldValue.serverTimestamp(),
          _updated: firebase.firestore.FieldValue.serverTimestamp(),
          tenantId: tenantsRef.id,
          email: params.user.email,
          name: params.user.name,
          shortName: params.user.name[0],
          color: USER.DEFAULT_COLOR[Math.floor(Math.random() * USER.DEFAULT_COLOR.length)].color
        }

        await userRef.set(data).then(() => {
          commit('setUser', data)
          commit('setTenantId', data.tenantId)
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
      .signInWithEmailAndPassword(params.user.email, params.user.password)
      .then(async (res) => {
        const usersRef = await db.collection('tenantUsers').get()
        const currentUser = usersRef.docs.find((doc) => {
          const data = doc.data()
          return data.email === params.user.email
        })
        if (currentUser) {
          const data = currentUser.data()
          commit('setUser', data)
          commit('setTenantId', data.tenantId)
          isSuccess = true
        } else {
          const userRef = db.collection('tenantUsers').doc(res.user.email)
          const tenantsRef = db.collection('tenants').doc()
          const data = {
            _created: firebase.firestore.FieldValue.serverTimestamp(),
            _updated: firebase.firestore.FieldValue.serverTimestamp(),
            tenantId: tenantsRef.id,
            email: res.user.email,
            name: `Deep Injured ${Math.floor(Math.random() * 100)}`,
            shortName: 'D',
            color: USER.DEFAULT_COLOR[Math.floor(Math.random() * USER.DEFAULT_COLOR.length)].color
          }
          await userRef.set(data).then(() => {
            commit('setUser', data)
            commit('setTenantId', data.tenantId)
            isSuccess = true
          })
        }
      })
      .catch((error) => {
        console.log('Login error', error)
      })

    return isSuccess
  },
  /**
   * logout
   * @param {object} state - local state
   * @param {object} rootGetters - getter function of store
   * @return {void}
   */
  async logout({ state, rootGetters, commit }) {
    let isSuccess = false
    await firebase
      .auth()
      .signOut()
      .then(() => {
        commit('setUser', {})
        commit('setTenantId', null)
        isSuccess = true
      })
      .catch((error) => {
        console.log('Login error', error)
      })

    return isSuccess
  }
}
