<template lang="pug">
  section(v-if='initialaized')
    .alert.alert-danger(v-if='error') {{ error.message }}

    div(v-if='book')
      ul.breadcrumbs
        li.breadcrumbs_item
          nuxt-link(to='/').breadcrumbs_item_link ホーム
        li.breadcrumbs_item 書籍情報
        li.breadcrumbs_item {{ book.title }}{{ book.volume != -1 ? ` ${book.volume}` : '' }}
        
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
        console.log(this.book)
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
