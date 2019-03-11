<template lang="pug">
  div
    nuxt
</template>

<script>
import { mapActions } from 'vuex'

export default {
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
</style>
