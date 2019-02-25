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
html {
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-weight: normal;
  font-size: 18px;
  border: none;
  text-decoration: none;
  background-color: rgba(255, 255, 255, 0);
  list-style: none;
}

*:focus {
  outline: none;
}
</style>

<style lang="scss" scoped>
.container {
  padding: 0 10%;
}
</style>
