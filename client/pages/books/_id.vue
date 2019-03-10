<template lang="pug">
  section(v-if='initialaized')

    ul.breadcrumbs
      li.breadcrumbs_item
        nuxt-link(to='/').breadcrumbs_item_link ホーム
      li.breadcrumbs_item 書籍情報
      li.breadcrumbs_item(v-if='book') {{ book.title }}{{ book.volume != -1 ? ` ${book.volume}` : '' }}

    .alert.alert-danger(v-if='error') {{ error.message }}
    .alert.alert-success(v-if='status') {{ status.message }}

    div(v-if='book')
      h1.page-header
        .label(:class="{ 'label-danger': book.isDoujin == 0, 'label-primary': book.isDoujin == 1 }") {{ book.isDoujin == 0 ? '商業' : '同人' }}
        | {{ book.title }}{{ book.volume != -1 ? ` ${book.volume}` : '' }}

      .row
        .row_main
          | row_main
        .row_side
          button.button.button-lg.button-danger(@click='remove()')
            font-awesome-icon(icon='trash')
            | &nbsp;書籍を削除する
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'

export default {
  data() {
    return {
      initialaized: false,
      error: null,
      status: null,
      book: null
    }
  },
  async beforeMount() {
    this.initialaized = await this.requireAuth()
    axios
      .get(`/api/books/${this.$route.params.id}`, {
        headers: {
          'X-Access-Token': this.token
        }
      })
      .then(res => {
        this.book = res.data.book
      })
      .catch(err => {
        this.error = {
          message:
            err.response.status === 403
              ? '認証に失敗しました'
              : err.response.status === 404
                ? '書籍が見つかりませんでした'
                : err.response.status
        }
      })
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
    remove() {
      this.status = null
      this.error = null

      axios
        .delete(`/api/books/${this.$route.params.id}`, {
          headers: {
            'X-Access-Token': this.token
          }
        })
        .then(res => {
          console.log(res)
          this.status = {
            message: '削除に成功しました'
          }
        })
        .catch(err => {
          this.error = {
            message:
              err.response.status === 403
                ? '認証に失敗しました'
                : err.response.status === 404
                  ? '書籍が見つかりませんでした'
                  : err.response.status
          }
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
    display: inline-block;

    vertical-align: top;
    font-size: 1rem;

    @media screen and (max-width: 600px) {
      display: block;
      width: 100% !important;
    }
  }

  &_main {
    width: 70%;
    margin-bottom: 10px;
  }

  &_side {
    width: 30%;
  }
}
</style>
