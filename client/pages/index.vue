<template lang="pug">
  section.container
    navbar

    h1 Librarian&nbsp;
      small w/ neiro.work

    div(v-if='user')
      h2 こんにちは、{{ user.displayName }}さん！
      v-gravatar(:hash='user.gravatarId')

    h2 ログインしてください
    form(@submit.prevent='authorize()')
      span
        label ログインID
        input(type='text', v-model='login.loginId')
      span
        label パスワード
        input(type='password' v-model='login.password')
      button(type='submit') ログイン

    h2 アカウント登録
    form(@submit.prevent='register()')
      span
        label ログインID
        input(type='text', v-model='registData.loginId')
      span
        label パスワード
        input(type='password', v-model='registData.password')
      span
        label メールアドレス
        input(type='email', v-model='registData.emailAddress')
      span
        label 表示名
        input(type='text', v-model='registData.displayName')
    button(type='submit') 登録

    </form>
  </section>
</template>

<script>
const axios = require('axios')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

import Navbar from '~/components/Navbar'

export default {
  components: {
    Navbar
  },
  data() {
    return {
      user: null,
      login: {
        loginId: '',
        password: ''
      },
      registData: {
        loginId: '',
        password: '',
        emailAddress: '',
        displayName: ''
      }
    }
  },
  methods: {
    register() {
      const passwordHash = crypto
        .createHash('sha256')
        .update(this.registData.password)
        .digest('hex')
      axios
        .post('/api/accounts', {
          loginId: this.registData.loginId,
          password: passwordHash,
          emailAddress: this.registData.emailAddress,
          displayName: this.registData.displayName
        })
        .then(res => {
          console.log(res)
        })
    },
    authorize() {
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
          console.log(this.user)
        })
    }
  }
}
</script>

<style>
</style>
