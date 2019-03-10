<template lang="pug">
  div
    navbar
    nuxt.container
</template>

<script>
import { mapActions } from 'vuex'

import Navbar from '~/components/Navbar'

export default {
  components: {
    Navbar
  },
  async beforeMount() {
    this.restoreToken()
    this.requireAuth()
  },
  methods: {
    ...mapActions({
      requireAuth: 'session/requireAuth',
      restoreToken: 'session/restoreToken'
    })
  }
}
</script>

<style lang="scss">
</style>

<style lang="scss" scoped>
.container {
  margin: 10px 0;
  padding: 0 10%;
  @media screen and (max-width: 480px) {
    padding: 0 10px;
  }
}
</style>
