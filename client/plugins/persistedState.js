import createPersistedState from 'vuex-persistedstate'

module.exports = ({ store, isHMR }) => {
  if (isHMR) return
  if (process.client) {
    window.onNuxtReady(nuxt => {
      createPersistedState()(store)
    })
  }
}
