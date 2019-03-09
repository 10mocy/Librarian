<template lang="pug">
  section.container(v-if='initialaized')
    ul.breadcrumbs
      li.breadcrumbs_item
        nuxt-link(to='/').breadcrumbs_item_link ホーム
      li.breadcrumbs_item 蔵書を探す

    .row
      .row_side
        .panel
          .panel_container
            form.form(@submit.prevent='search()')
              span.form_part
                label.form_part_label 検索クエリ
                input.form_part_input(v-model='query.query', type='search')
              label.form_part
                input.form_part_input(v-model='query.includeTitle', type='checkbox', id='includeTitle')
                label.form_part_label-checkbox(for='includeTitle') タイトルに含む
              label.form_part
                input.form_part_input(v-model='query.includeRemarks', type='checkbox', id='includeRemarks')
                label.form_part_label-checkbox(for='includeRemarks') 備考に含む
              label.form_part
                input.form_part_input(v-model='query.includeDoujin', type='checkbox', id='includeDoujin')
                label.form_part_label-checkbox(for='includeDoujin') 同人誌を含む
              span.form_part
                button(type='submit').button.button-primary 検索
      .row_main
        | row_main
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
      initialaized: false,
      query: {
        query: '',
        includeTitle: true,
        includeRemarks: true,
        includeDoujin: true
      }
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
    }),
    search() {
      console.log(this.query)
    }
  }
}
</script>

<style lang="scss" scoped>
.row {
  font-size: 0;

  &_side,
  &_main {
    padding: 0 10px;
    display: inline-block;
    vertical-align: top;
    font-size: 1rem;
  }

  &_side {
    width: 30%;
  }

  &_main {
    width: 70%;
  }
}
</style>
