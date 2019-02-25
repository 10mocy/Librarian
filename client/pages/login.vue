<template lang="pug">
  section.pageContainer

    .panel
      h2.panel_header Librarianにログイン
      .panel_container
        .alert.alert-danger(v-if='error')
          .alert_content {{ error.message }}

      form(@submit.prevent='authorize()').form
        span.form_part
          label.form_part_label ログインID
          input(type='text', v-model='login.loginId').form_part_input
        span.form_part
          label.form_part_label パスワード
          input(type='password' v-model='login.password').form_part_input
        span.form_part
          button(type='submit').button.button-submit ログイン
    //- div(v-if='user')
    //-   h2 こんにちは、{{ user.displayName }}さん！
    //-   v-gravatar(:hash='user.gravatarId')
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

const axios = require('axios')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

export default {
  beforeMount() {
    if (this.isLoggedin) {
      this.$router.replace('/')
    }
    this.requireAuth()
  },
  mounted() {},
  computed: {
    ...mapGetters({
      isLoggedin: 'session/isLoggedIn'
    })
  },
  data() {
    return {
      user: null,
      login: {
        loginId: '',
        password: ''
      },
      error: null
    }
  },
  methods: {
    ...mapActions({
      requireAuth: 'session/requireAuth'
    }),
    authorize() {
      this.error = null

      const passwordHash = crypto
        .createHash('sha256')
        .update(this.login.password)
        .digest('hex')
      axios
        .post('/api/accounts/jwt', {
          loginId: this.login.loginId,
          password: passwordHash
        })
        .then(res => {
          const token = jwt.decode(res.data.token)
          this.user = {
            displayName: token['work.neirowork.librarian.displayName'],
            gravatarId: token['work.neirowork.librarian.gravatarId'],
            userHash: token['work.neirowork.librarian.userHash']
          }
          this.$store.commit('session/login', {
            token: res.data.token,
            data: this.user
          })
          this.$router.push('/')
        })
        .catch(err => {
          this.error = {
            message:
              err.response.status === 422
                ? '入力内容に不備があります'
                : err.response.status === 403
                  ? '認証に失敗しました'
                  : err.response.status
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.pageContainer {
  text-align: center;
}
</style>
