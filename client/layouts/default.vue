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
    this.requireAuth()
  },
  methods: {
    ...mapActions({
      requireAuth: 'session/requireAuth'
    })
  }
}
</script>

<style lang="scss">
</style>

<style lang="scss" scoped>
.container {
  padding: 0 10%;
}
</style>
