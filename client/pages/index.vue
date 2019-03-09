<template lang="pug">
  section.container(v-if='initialaized')
    .row
      .row_column
        .status
          .status_content
            small Welcome to
            br
            b Librarian!

      .row_column
        .status
          .status_data
            | 1000
            small 冊
          .status_label 蔵書数

      .row_column
        .card
          .card_header 最近追加された蔵書
          .card_content
            button.button.button_panel
              .label.label-primary 同人
              .button_panel_container
                .button_panel_header テスト
            button.button.button_panel
              .label.label-danger 商業
              .button_panel_container
                .button_panel_header テスト
      
      .row_column
            button.button.button-lg.button-primary
              font-awesome-icon(icon='search')
              | &nbsp;蔵書を探す
            button.button.button-lg.button-submit
              font-awesome-icon(icon='tools')
              | &nbsp;蔵書を管理する
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
.row {
  font-size: 0;

  &_column {
    display: inline-block;
    width: 50%;
    padding: 0 10px;

    font-size: 1rem;
    vertical-align: top;
  }
}
</style>
