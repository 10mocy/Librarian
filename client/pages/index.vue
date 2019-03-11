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
          .status_data(v-if='result')
            | {{ result.count }}
            small 冊
          .status_label 蔵書数

      .row_column
        .card
          .card_header 最近追加された蔵書
          .card_content(v-if='result')
            nuxt-link.button.button-block.button_panel(v-for='(book, index) in result.display', :key='index', :to="`/books/${book.hash}`")
              .label(:class="{ 'label-danger': book.isDoujin == 0, 'label-primary': book.isDoujin == 1 }") {{ book.isDoujin == 0 ? '商業' : '同人' }}
              .button_panel_container
                .button_panel_header {{ book.title }}{{ book.volume != -1 ? ` ${book.volume}` : '' }}

      .row_column
            nuxt-link(to='/dashboard/search').button.button-block.button-lg.button-primary
              font-awesome-icon(icon='search')
              | &nbsp;蔵書検索
            nuxt-link(to='/dashboard/register').button.button-block.button-lg
              font-awesome-icon(icon='book-medical')
              | &nbsp;書籍登録
            //- button.button.button-block.button-lg.button-submit
            //-   font-awesome-icon(icon='tools')
            //-   | &nbsp;蔵書を管理する
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'

export default {
  async beforeMount() {
    this.initialaized = await this.requireAuth()
    console.log(this.initialaized)
    axios
      .get('/api/books', {
        headers: {
          'X-Access-Token': this.token
        }
      })
      .then(res => {
        this.result = {
          data: res.data.books,
          count: res.data.books.length,
          display: null
        }

        this.result.display = []
        for (let i = 0; i < 2; i++) {
          this.result.display.push(this.result.data[i])
        }
      })
  },
  data() {
    return {
      initialaized: false,
      result: null,
      count: 0
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

    @media screen and (max-width: 600px) {
      display: block;
      width: 100%;
    }
  }
}
</style>
