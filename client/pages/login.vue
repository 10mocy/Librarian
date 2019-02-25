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
const axios = require('axios')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

export default {
  beforeCreate() {
    const session = this.$store.state.session
    console.log(session)
    if (session.token && session.data) {
      this.$router.replace('/')
    }
  },
  mounted() {},
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

.panel {
  display: inline-block;
  border: 1px solid #efefef;
  border-radius: 10px;
  background-color: #f7f7f7;
  box-shadow: 0 2px 0 #d6d6d6;
  max-width: 30%;
  padding: 20px;
  text-align: left;

  &_header {
    font-size: 1.25em;
    font-weight: bold;
    margin-bottom: 10px;
  }
}

.alert {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 10px;

  &-danger {
    background-color: #e44646;
    color: #ffffff;
  }
}

.form {
  &_part {
    display: block;
    margin-bottom: 10px;

    &_label,
    &_input,
    &_button {
      width: 100%;
      display: inline-block;
    }

    &_label {
      font-size: 0.75em;
      color: #666666;
    }

    &_input {
      padding: 5px;
      font-weight: bold;
      background-color: #fdfdfd;
      border-bottom: 2px solid #afafaf;
      font-size: 1.5em;
    }
  }
}

.button {
  width: 100%;
  padding: 10px 5px;
  border-radius: 10px;
  transition: all linear 100ms;

  &-submit {
    color: #ffffff;
    border-top: 1px solid #01c51b;
    background-color: #00ad17;
    border-bottom: 1px solid #008512;
    &:active {
      border-top: 1px solid #008512;
      background-color: #019915;
      border-bottom: 1px solid #01c51b;
    }
  }
}
</style>
