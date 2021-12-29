import firebase from '~/plugins/firebase'
import { USER } from '~/constants/user'

const db = firebase.firestore()

export const state = () => ({
  user: {},
  email: '',
  activeWorkspaceId: ''
})

export const getters = {
  getUser(state) {
    return state.user
  },
  getEmail(state) {
    return state.email
  },
  getActiveWorkspaceId(state) {
    return state.activeWorkspaceId
  }
}

export const mutations = {
  setUser(state, user) {
    state.user = user
  },
  setEmail(state, email) {
    state.email = email
  },
  setActiveWorkspaceId(state, activeWorkspaceId) {
    state.activeWorkspaceId = activeWorkspaceId
  },
  clearAll(state) {
    state.user = {}
    state.email = ''
    state.activeWorkspaceId = ''
  }
}

export const actions = {
  /**
   * register new user
   * @param {object} state - local state
   * @param {object} rootGetters - getter function of store
   * @param {object} commit - action to update store
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
        const userRef = db.collection('users').doc(res.user.email)
        const data = {
          _created: firebase.firestore.FieldValue.serverTimestamp(),
          _updated: firebase.firestore.FieldValue.serverTimestamp(),
          email: params.user.email,
          name: params.user.name,
          shortName: params.user.name[0],
          color: USER.DEFAULT_COLOR[Math.floor(Math.random() * USER.DEFAULT_COLOR.length)].color,
          activeWorkspaceId: ''
        }

        await userRef.set(data).then(() => {
          commit('setUser', data)
          commit('setEmail', data.email)
          commit('setActiveWorkspaceId', data.activeWorkspaceId)
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
   * @param {object} commit - action to update store
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
        const usersRef = await db.collection('users').get()
        const currentUser = usersRef.docs.find((doc) => {
          const data = doc.data()
          return data.email === params.user.email
        })
        if (currentUser) {
          const data = currentUser.data()
          commit('setUser', data)
          commit('setEmail', data.email)
          commit('setActiveWorkspaceId', data.activeWorkspaceId)
          isSuccess = true
        } else {
          const userRef = db.collection('users').doc(res.user.email)
          const data = {
            _created: firebase.firestore.FieldValue.serverTimestamp(),
            _updated: firebase.firestore.FieldValue.serverTimestamp(),
            email: res.user.email,
            name: `Deep Injured ${Math.floor(Math.random() * 100)}`,
            shortName: 'D',
            color: USER.DEFAULT_COLOR[Math.floor(Math.random() * USER.DEFAULT_COLOR.length)].color,
            activeWorkspaceId: ''
          }
          await userRef.set(data).then(() => {
            commit('setUser', data)
            commit('setEmail', data.email)
            commit('setActiveWorkspaceId', data.activeWorkspaceId)
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
   * @param {object} commit - action to update store
   * @return {void}
   */
  async logout({ state, rootGetters, commit }) {
    let isSuccess = false
    await firebase
      .auth()
      .signOut()
      .then(() => {
        commit('clearAll')
        isSuccess = true
      })
      .catch((error) => {
        console.log('Login error', error)
      })

    return isSuccess
  },
  /**
   * update user's profile
   * @param {object} state - local state
   * @param {object} rootGetters - getter function of store
   * @param {object} commit - action to update store
   * @param {object} params.data - data of user will be updated
   * @return {void}
   */
  async updateProfile({ state, rootGetters, commit }, params) {
    const { data } = params
    const ref = db.collection('users').doc(data.email)
    data._updated = firebase.firestore.FieldValue.serverTimestamp()
    await ref.update(data).then(() => {
      commit('setUser', data)
      commit('setEmail', data.email)
      commit('setActiveWorkspaceId', data.activeWorkspaceId)
    })
  }
}
