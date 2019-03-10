<template lang="pug">
  section(v-if='initialaized')

    ul.breadcrumbs
      li.breadcrumbs_item
        nuxt-link(to='/').breadcrumbs_item_link ホーム
      li.breadcrumbs_item 書籍情報
      li.breadcrumbs_item(v-if='error') {{ error.message }}
      li.breadcrumbs_item(v-if='book') {{ book.title }}{{ book.volume != -1 ? ` ${book.volume}` : '' }}
    .alert.alert-danger(v-if='error') {{ error.message }}

    div(v-if='book')
      h1.page-header
        .label(:class="{ 'label-danger': book.isDoujin == 0, 'label-primary': book.isDoujin == 1 }") {{ book.isDoujin == 0 ? '商業' : '同人' }}
        | {{ book.title }}{{ book.volume != -1 ? ` ${book.volume}` : '' }}
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'

export default {
  data() {
    return {
      initialaized: false,
      error: null,
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
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
