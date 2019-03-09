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
                label.form_part_label-checkbox(for='includeDoujin') 同人
              span.form_part
                button(type='submit').button.button-primary 検索
      .row_main
        .section-header(v-if='result') 検索結果
          small ({{ result.length }}件)
        .button.button_panel(v-if='result !== []', v-for='book in result')
          .label(:class="{ 'label-danger': book.isDoujin == 0, 'label-primary': book.isDoujin == 1 }") {{ book.isDoujin == 0 ? '商業' : '同人' }}
          .button_panel_container
            .button_panel_header {{ book.title }} {{ book.volume != -1 ? book.volume : '' }}
            .button_panel_content {{ book.remarks }}
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
      result: null,
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
      token: 'session/token',
      userData: 'session/data'
    })
  },
  methods: {
    ...mapActions({
      requireAuth: 'session/requireAuth'
    }),
    search() {
      axios
        .post(
          '/api/books/search',
          {
            query: this.query.query,
            includeTitle: this.query.includeTitle,
            includeRemarks: this.query.includeRemarks,
            isDoujin: this.query.includeDoujin
          },
          {
            headers: {
              'X-Access-Token': this.token
            }
          }
        )
        .then(res => {
          this.result = res.data.books
        })
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

  @media screen and (max-width: 600px) {
    &_side,
    &_main {
      display: block;
      width: 100%;
    }
  }
}
</style>
