import axios from 'axios'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import cookie from 'js-cookie'

export const state = () => ({
  token: null,
  data: null
})

export const mutations = {
  setToken(state, payload) {
    state.token = payload
  },
  setData(state, payload) {
    state.data = payload
  },
  logout(state) {
    state.token = null
    state.data = null
  }
}

export const getters = {
  isLoggedIn: state => {
    return !!(state.token && state.data)
  },
  token: state => {
    return state.token
  },
  data: state => {
    return state.data
  }
}

export const actions = {
  requireAuth(context) {
    if (!context.getters.isLoggedIn) {
      this.$router.replace('/login')
    }
    return true
  },
  authorize(context, payload) {
    return new Promise((resolve, reject) => {
      const passwordHash = crypto
        .createHash('sha256')
        .update(payload.password)
        .digest('hex')

      axios
        .post('/api/accounts/jwt', {
          loginId: payload.loginId,
          password: passwordHash
        })
        .then(res => {
          const payloadData = jwt.decode(res.data.token)
          context.commit('setData', {
            displayName: payloadData['work.neirowork.librarian.displayName'],
            gravatarId: payloadData['work.neirowork.librarian.gravatarId'],
            userHash: payloadData['work.neirowork.librarian.userHash']
          })
          context.commit('setToken', res.data.token)
          cookie.set('token', res.data.token)
          resolve(true)
        })
        .catch(res => reject(res))
    })
  },
  restoreToken(context) {
    const token = cookie.get('token')
    const payloadData = jwt.decode(token)
    if (token) {
      context.commit('setData', {
        displayName: payloadData['work.neirowork.librarian.displayName'],
        gravatarId: payloadData['work.neirowork.librarian.gravatarId'],
        userHash: payloadData['work.neirowork.librarian.userHash']
      })
      context.commit('setToken', token)
    }
  },
  logout(context) {
    cookie.remove('token')
    context.commit('logout')
    this.$router.replace('/login')
  }
}
