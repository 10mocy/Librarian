import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import session from './session'

export default () => {
  return new Vuex.Store({
    modules: {
      session
    },
    // strict: true,
    plugins: [
      createPersistedState({
        key: 'work.neiro.librarian.session',
        paths: ['session.data', 'session.token'],
        storage: window.sessionStorage
      })
    ]
  })
}
