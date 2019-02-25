<template lang="pug">
  .nav
    .nav_brand Librarian
    ul.nav_menu
      li.nav_menu_item 
        nuxt-link(to='/').nav_menu_item_link
          font-awesome-icon(icon='home')
      span(v-if='isLogin()')
        li.nav_menu_item
          nuxt-link(to='/books/register').nav_menu_item_link
            font-awesome-icon(icon='book')
            | &nbsp;蔵書登録
        li.nav_menu_item
          nuxt-link(to='/books/search').nav_menu_item_link
            font-awesome-icon(icon='search')
            | &nbsp;蔵書検索
        li.nav_menu_item
          span(@click='logout()').nav_menu_item_link
            font-awesome-icon(icon='sign-out-alt')
            | &nbsp;ログアウト
      span(v-if='!isLogin()')
        li.nav_menu_item
          nuxt-link(to='/login').nav_menu_item_link
            font-awesome-icon(icon='sign-in-alt')
            | &nbsp;ログイン
</template>

<script>
export default {
  computed: {},
  methods: {
    isLogin() {
      const session = this.$store.state.session
      return session.token && session.data ? true : false
    },
    logout() {
      this.$store.commit('session/logout')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
.nav {
  margin-bottom: 30px;
  padding: 10px;
  background-color: #222222;

  &_brand,
  &_menu {
    display: inline-block;
    vertical-align: middle;
  }
  &_brand {
    padding: 0 10px;
    color: #ffffff;
    font-size: 1.5em;
    font-weight: bold;
  }

  &_menu {
    &_item {
      display: inline-block;
      padding-left: 20px;
      color: #bbbbbb;

      &_link,
      &_link:link,
      &_link:visited,
      &_link:hover {
        color: #999999;
        cursor: pointer;
        user-select: none;
        &.nuxt-link-exact-active {
          color: #cccccc;
        }
      }
    }
  }
}
</style>
