<template>
  <section class="container">
    <h1>Librarian <small>w/ neiro.work</small></h1>
    <p>
      ログインしてください
    </p>
    <form @submit.prevent="authorize()">
      <span>
        <label>ログインID</label>
        <input type="text" v-model="login.loginId">
      </span>
      <span>
        <label>パスワード</label>
        <input type="password" v-model="login.password">
      </span>
      <button type="submit">ログイン</button>
    </form>
  </section>
</template>

<script>
export default {
  data() {
    return {
      login: {
        loginId: '',
        password: ''
      }
    }
  },
  methods: {
    authorize() {
      // console.log(this.login)
      console.log(this.login.loginId, this.login.password)
    }
  }
}
</script>

<style>
</style>
