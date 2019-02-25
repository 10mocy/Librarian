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

module.exports = {
  namespaced: true,
  state,
  mutations
}
