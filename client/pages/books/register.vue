<template lang="pug">
  section
    ul.breadcrumbs
      li.breadcrumbs_item
        nuxt-link(to='/').breadcrumbs_item_link ホーム
      li.breadcrumbs_item 蔵書の管理
      li.breadcrumbs_item 書籍登録
    
    .pageContainer
      .panel
        h2.panel_header 書籍登録
        .panel_container
          .alert.alert-danger(v-if='error')
            .alert_content {{ error.message }}
          .alert.alert-success(v-if='data')
            .alert_content 「{{ data.title }}{{ data.volume != -1 ? ` ${data.volume}` : '' }}」の登録が完了しました

          form(@submit.prevent='register()').form
            span.form_part
              label.form_part_label 書籍名
              input.form_part_input(type='text', v-model='query.title')
            span.form_part
              label.form_part_label 巻数
              label.form_part
                input.form_part_input(type='checkbox', id='isSingle', v-model='query.isSingle')
                label.form_part_label-checkbox(for='isSingle') 単発
              input.form_part_input(v-if='!query.isSingle', type='text', v-model='query.volume')
            span.form_part
              label.form_part_label ISBN
              input.form_part_input(type='text', v-model='query.isbn')
            span.form_part
              label.form_part_label 備考
              label.form_part
                input.form_part_input(type='checkbox', id='isDoujin', v-model='query.isDoujin')
                label.form_part_label-checkbox(for='isDoujin') 同人
              input.form_part_input(type='text', v-model='query.remarks')
            span.form_part
              button(type='submit').button.button-primary 登録
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
      data: null,
      error: null,
      query: {
        title: '',
        volume: '',
        isbn: '',
        remarks: '',
        isSingle: true,
        isDoujin: false
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
    register() {
      this.error = null
      this.data = null
      axios
        .post(
          '/api/books',
          {
            title: this.query.title,
            isDoujin: this.query.isDoujin ? 1 : 0,
            volume: this.query.isSingle ? '-1' : this.query.volume,
            remarks: this.query.remarks,
            isbn: this.query.isbn
          },
          {
            headers: {
              'X-Access-Token': this.token
            }
          }
        )
        .then(res => {
          this.data = {
            title: res.data.title,
            volume: res.data.volume
          }
          this.query = {
            title: '',
            volume: '',
            isbn: '',
            remarks: '',
            isSingle: true,
            isDoujin: false
          }
        })
        .catch(err => {
          console.log(err)
          this.error = {
            message:
              err.response.status === 422
                ? '入力内容に不備があります'
                : err.response.status === 403
                  ? '認証に失敗しました'
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
