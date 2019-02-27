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
          | クエリ
      .row_main
        .card
          | 検索結果

</template>

<script>
import { mapActions } from 'vuex'

import axios from 'axios'

export default {
  async beforeMount() {
    this.initialaized = await this.requireAuth()
  },
  data() {
    return {
      initialaized: false
    }
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

  &_sidebar,
  &_main {
    display: inline-block;
    vertical-align: top;
    padding: 10px;
    font-size: 1rem;
  }

  &_sidebar {
    width: 25%;
  }

  &_main {
    width: 75%;
  }
}
</style>
