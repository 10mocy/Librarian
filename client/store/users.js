const state = {
  user: null
}

const mutations = {
  login(state, payload) {
    state.user = payload
  },
  logout(state) {
    state.user = null
  }
}

module.exports = {
  namespaced: true,
  state,
  mutations
}
