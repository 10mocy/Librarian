<template lang="pug">
  section.container(v-if='initialaized')
    .breadcrumb
      nuxt-link(to='/').breadcrumb_item
          font-awesome-icon(icon='home')
      span.breadcrumb_item
        | 蔵書を探す
    .pageHeader 蔵書を探す

    .row
      .row_column
        | 検索クエリ
      .row_column
        | 検索結果
      .row_column
        .card
          .card_subHeader サブヘッダー
          .card_header カードタイトル

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

  &_column {
    display: inline-block;
    vertical-align: top;
    padding: 10px;
    font-size: 1rem;
    width: 33%;
  }
}

.card {
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 10px;

  &_header {
    font-size: 1.5em;
    font-weight: bold;
  }

  &_subHeader {
    font-size: 0.8em;
    color: #909090;
  }
}
</style>
