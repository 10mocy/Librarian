<template lang="pug">
  section(v-if='book')
    ul.breadcrumbs
      li.breadcrumbs_item
        nuxt-link.breadcrumbs_item_link(to='/') ホーム
      li.breadcrumbs_item 蔵書の管理
      li.breadcrumbs_item
        nuxt-link.breadcrumbs_item_link(:to='`/books/${$route.params.id}`') {{ book.title }}{{ book.volume != -1 ? ` ${book.volume}` : '' }}
      li.breadcrumbs_item 書籍情報編集


    .pageContainer
      .panel
        h2.panel_header 書籍情報編集
        .panel_container
          .alert.alert-danger(v-if='error')
            .alert_content {{ error.message }}
          .alert.alert-success(v-if='status')
            .alert_content {{ status.message }}

          form(@submit.prevent='edit()').form
            span.form_part
              label.form_part_label 書籍名
              input.form_part_input(type='text', v-model='book.title')
            span.form_part
              label.form_part_label 巻数
              label.form_part
                input.form_part_input(type='checkbox', id='isSingle', v-model='book.isSingle')
                label.form_part_label-checkbox(for='isSingle') 単発
              input.form_part_input(v-if='!book.isSingle', type='text', v-model='book.volume')
            span.form_part
              label.form_part_label ISBN
              input.form_part_input(type='text', v-model='book.isbn')
            span.form_part
              label.form_part_label 備考
              label.form_part
                input.form_part_input(type='checkbox', id='isDoujin', v-model='book.isDoujin')
                label.form_part_label-checkbox(for='isDoujin') 同人
              input.form_part_input(type='text', v-model='book.remarks')
            span.form_part
              button(type='submit').button.button-block.button-primary 更新
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import axios from 'axios'

export default {
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
  data() {
    return {
      initialaized: false,
      error: null,
      status: null,
      book: null
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
    edit() {
      this.error = null
      this.status = null

      axios
        .put(
          `/api/books/${this.$route.params.id}`,
          {
            title: this.book.title,
            volume: this.book.isSingle ? '-1' : this.book.volume,
            isDoujin: this.book.isDoujin ? 1 : 0,
            remarks: this.book.remarks,
            isbn: this.book.isbn
          },
          {
            headers: {
              'X-Access-Token': this.token
            }
          }
        )
        .then(res => {
          this.status = {
            message: '編集に成功しました'
          }
        })
        .catch(err => {
          this.error = {
            message:
              err.response.status === 403
                ? '認証に失敗しました'
                : err.response.status === 422
                  ? '入力内容に不備があります'
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
.pageContainer {
  text-align: center;
}
.panel {
  display: inline-block;
  width: 480px;

  @media screen and (max-width: 600px) {
    width: 100%;
  }
}
</style>
