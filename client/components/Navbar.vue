<template lang="pug">
  .nav
    .nav_brand Librarian
    ul.nav_menu
      li.nav_menu_item 
        nuxt-link(to='/').nav_menu_item_link
          font-awesome-icon(icon='home').nav_menu_item_icon
      span(v-if='isLogin()')
        li.nav_menu_item
          v-gravatar(:hash='session.data.gravatarId', size='18').nav_menu_item_icon
          span.nav_menu_item_label &nbsp;音色ねいろ
        li.nav_menu_item
          nuxt-link(to='/books/register').nav_menu_item_link
            font-awesome-icon(icon='book').nav_menu_item_icon
            span.nav_menu_item_label &nbsp;蔵書登録
        li.nav_menu_item
          nuxt-link(to='/books/search').nav_menu_item_link
            font-awesome-icon(icon='search').nav_menu_item_icon
            span.nav_menu_item_label &nbsp;蔵書検索
        li.nav_menu_item
          span(@click='logout()').nav_menu_item_link
            font-awesome-icon(icon='sign-out-alt').nav_menu_item_icon
            span.nav_menu_item_label &nbsp;ログアウト
      span(v-if='!isLogin()')
        li.nav_menu_item
          nuxt-link(to='/login').nav_menu_item_link
            font-awesome-icon(icon='sign-in-alt').nav_menu_item_icon
            span.nav_menu_item_label &nbsp;ログイン
</template>

<script>
export default {
  data() {
    return {
      session: this.$store.state.session
    }
  },
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

      &_icon,
      &_label {
        vertical-align: middle;
      }
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
