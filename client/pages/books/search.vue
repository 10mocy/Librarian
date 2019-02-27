<template lang="pug">
  section.container(v-if='initialaized')
    .breadcrumb
      nuxt-link(to='/').breadcrumb_item
          font-awesome-icon(icon='home')
      span.breadcrumb_item
        | 蔵書を探す
    .pageHeader 蔵書を探す

    .row
      .row_sidebar
        .card
          form(@submit.prevent='doSearch()').form
            span.form_part
              label.form_part_label 検索クエリ
              input.form_part_input(type='text', v-model='search.query')
            span.form_part
              button.button.button-submit(type='submit') 検索
      .row_main
        .card
          .alert.alert-danger(v-if='!search.books')
            | 蔵書が見つかりませんでした
          table.table(v-if='search.books')
            thead
              tr.table_row
                th.table_row_header #
                th.table_row_header 書籍名
                th.table_row_header 登録日時
                th.table_row_header 同人?
            tbody.table_body
              tr.table_row(v-for='(book, index) in search.books')
                td.table_row_data {{ String(book.hash).slice(0, 6) }}...
                td.table_row_data {{ book.title + (book.volume !== '-1' ? ` ${book.volume}` : '') }}
                td.table_row_data {{ book.timestamp }}
                td.table_row_data {{ book.isDoujin === 1 ? 'はい' : 'いいえ'}}

</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import axios from 'axios'

export default {
  async beforeMount() {
    this.initialaized = await this.requireAuth()
  },
  computed: {
    ...mapGetters({
      token: 'session/token',
      userData: 'session/data'
    })
  },
  data() {
    return {
      initialaized: false,
      search: {
        query: '',
        books: null
      }
    }
  },
  methods: {
    ...mapActions({
      requireAuth: 'session/requireAuth'
    }),
    doSearch() {
      axios
        .post(
          '/api/books/search',
          { query: this.search.query },
          {
            headers: {
              'X-Access-Token': this.token
            }
          }
        )
        .then(res => {
          this.search.books =
            res.data.books.length !== 0 ? res.data.books : null
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.row {
  font-size: 0;

  &_sidebar,
  &_main {
    display: inline-block;
    vertical-align: top;
    padding: 0 10px;
    padding-bottom: 10px;
    font-size: 1rem;
  }

  &_sidebar {
    width: 25%;
  }

  &_main {
    width: 75%;
  }

  @media screen and (max-width: 1280px) {
    &_sidebar,
    &_main {
      display: block;
      width: 100%;
    }
  }
}
</style>
