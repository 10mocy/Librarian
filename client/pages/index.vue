<template lang="pug">
  section.container(v-if='initialaized')
    .welcome
      small Welcome to 
      b Librarian!
      p {{ userData.displayName }}としてログイン中です。
    ul.panelButton
      .panelButton_wrap
        .panelButton_wrap_item.panelButton_wrap_item-success
          font-awesome-icon(icon='search').panelButton_wrap_item_icon
          .panelButton_wrap_item_label 蔵書を探す
      .panelButton_wrap
        .panelButton_wrap_item.panelButton_wrap_item
          font-awesome-icon(icon='tools').panelButton_wrap_item_icon
          .panelButton_wrap_item_label 蔵書を管理する
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

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
  computed: {
    ...mapGetters({
      userData: 'session/data'
    })
  },
  methods: {
    ...mapActions({
      requireAuth: 'session/requireAuth'
    })
  }
}
</script>

<style lang="scss" scoped>
.welcome {
  margin: 10px;
  padding: 40px 20px;
  font-size: 3em;
  text-align: center;
  background-color: #ffffff;
  border-radius: 10px;
}
</style>
