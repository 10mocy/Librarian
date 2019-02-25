<template lang="pug">
  section.container(v-if='initialaized')
    ul
      li 蔵書を探す
      li 蔵書を管理する
</template>

<script>
import { mapActions } from 'vuex'

const axios = require('axios')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

export default {
  async beforeMount() {
    this.initialaized = await this.requireAuth()
  },
  data() {
    return {
      initialaized: false
    }
  },
  methods: {
    ...mapActions({
      requireAuth: 'session/requireAuth'
    })
  }
}
</script>

<style>
</style>
