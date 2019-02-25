<template lang="pug">
  section.container
    | a
</template>

<script>
const axios = require('axios')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

export default {
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
