const state = {
  token: null,
  data: null
}

const mutations = {
  login(state, payload) {
    state.token = payload.token
    state.data = payload.data
  },
  logout(state) {
    state.token = null
    state.data = null
  }
}

const actions = {
  requireAuth({ state }) {
    if (!state.token || !state.data) {
      this.$router.replace('/login')
      return false
    }
    return true
  }
}

const getters = {
  isLoggedIn(state) {
    return !!(state.token && state.data)
  },
  token(state) {
    return state.token
  },
  data(state) {
    return state.data
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
