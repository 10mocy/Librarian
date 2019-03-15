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
          table.table
            tr.table_row
              th.table_row_header 備考
              td.table_row_data {{ book.remarks === '' ? '備考なし' : book.remarks }}
            tr.table_row(v-if='book.isDoujin == 0')
              th.table_row_header ISBN
              td.table_row_data {{ book.isbn }}
        .row_side
          nuxt-link.button.button-block.button-lg(:to='`/books/${$route.params.id}/edit`')
            font-awesome-icon(icon='edit')
            | &nbsp;書籍情報を編集する
          button.button.button-block.button-lg.button-danger(@click='showModal = true')
            font-awesome-icon(icon='trash')
            | &nbsp;書籍を削除する

      transition(name='fade')
        .modalWrap(v-if='showModal')
          .modalWrap_modal
            .modalWrap_modal_header 削除確認
            .modalWrap_modal_content 「{{ book.title }}{{ book.volume != -1 ? ` ${book.volume}` : '' }}」を削除します。
            .modalWrap_modal_footer
              button.button.button-danger(@click='remove()')
                font-awesome-icon(icon='trash')
                | &nbsp;削除
              button.button(@click='showModal = false') キャンセル
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
      book: null,
      showModal: false
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
          this.status = {
            message: '削除に成功しました'
          }
          this.showModal = false
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
    padding: 0 10px;

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

/* トランジション */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 250ms;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
