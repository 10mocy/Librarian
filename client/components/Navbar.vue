<template lang="pug">
  .nav
    .nav_brand Librarian
    ul.nav_menu
      span(v-if='isLogin()')
        li.nav_menu_item(v-if='session.data')
          v-gravatar(:hash='session.data.gravatarId', :size='32', :title='session.data.displayName + "としてログイン中"').nav_menu_item_icon.nav_menu_item_icon-picture
        li.nav_menu_item
          nuxt-link(to='/').nav_menu_item_link
            font-awesome-icon(icon='home').nav_menu_item_icon
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
      // session: this.$store.state.session
    }
  },
  computed: {
    session() {
      return this.$store.state.session
    }
  },
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
  background-color: #eeeeee;
  border-bottom: 1px solid #e3e3e3;

  &_brand,
  &_menu {
    display: inline-block;
    vertical-align: middle;
  }
  &_brand {
    padding: 0 10px;
    color: #222222;
    font-size: 1.5em;
    font-weight: bold;
    user-select: none;
  }

  &_menu {
    &_item {
      display: inline-block;
      padding-left: 20px;
      color: #585858;

      &_icon,
      &_label {
        vertical-align: middle;
        user-select: none;
      }
      &_icon {
        &-picture {
          border-radius: 50%;
        }
      }
      &_link {
        color: #585858;
        cursor: pointer;
        &.nuxt-link-exact-active {
          color: #b6b6b6;
        }
        &:hover {
          color: #ff8800;
        }
      }
    }
  }
}
</style>
