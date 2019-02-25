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
  background-color: #efefef;
  border-radius: 10px;
}

.panelButton {
  font-size: 0;

  &_wrap {
    display: inline-block;
    vertical-align: top;
    width: 50%;
    font-size: 1rem;
    color: #222222;

    &_item {
      display: block;
      margin: 10px;
      padding: 20px;
      background-color: #efefef;
      border-bottom: 2px solid #c9c9c9;
      border-radius: 10px;
      user-select: none;
      cursor: pointer;

      &_icon,
      &_label {
        display: inline-block;
        vertical-align: middle;
      }

      &_icon {
        font-size: 2em;
      }

      &_label {
        padding-left: 10px;
        font-size: 1.25em;
        font-weight: bold;
      }

      &:active {
        background-color: #c9c9c9;
        border-bottom: 2px solid #efefef;
      }

      &-success {
        color: #ffffff;
        background-color: #008ffe;
        border-bottom: 2px solid #037cd8;
        &:active {
          background-color: #037cd8;
          border-bottom: 2px solid #008ffe;
        }
      }
    }
  }
}
</style>
