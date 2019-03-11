<template lang="pug">
  section(v-if='initialaized')
    .page-header {{ userData.displayName }}さんの蔵書一覧
      small &nbsp;w/ Librarian
    table.printTable
      tr.printTable_row
        th.printTable_row_header タイトル
        th.printTable_row_header 巻数
        th.printTable_row_header 種別
        th.printTable_row_header 備考
      tr.printTable_row(v-if='books', v-for='(book, index) in books', :to='index')
        td.printTable_row_data {{ book.title }}
        td.printTable_row_data {{ book.volume }}
        td.printTable_row_data {{ book.isDoujin == '0' ? '商業' : '同人' }}
        td.printTable_row_data {{ book.remarks }}
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'

export default {
  layout: 'print',
  async beforeMount() {
    this.initialaized = await this.requireAuth()
    const reqData = await axios.get('/api/books', {
      headers: {
        'X-Access-Token': this.token
      }
    })
    this.books = reqData.data.books
  },
  data() {
    return {
      initialaized: false,
      books: null
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
.printTable {
  width: 100%;
  border-collapse: collapse;

  &_row {
    background-color: #efefef;

    &:nth-child(2n + 1) {
      background-color: #cecece;
    }

    &_header,
    &_data {
      padding: 5px 10px;
    }

    &_header {
      text-align: left;
      background-color: #000000;
      color: #ffffff;
    }

    &_data {
    }
  }
}
</style>
