<template lang="pug">
  .nav
    .nav_brand Librarian
    ul.nav_menu
      span(v-if='sessionData')
        li.nav_menu_item
          v-gravatar(:hash='sessionData.gravatarId', :size='32', :title='sessionData.displayName + "としてログイン中"').nav_menu_item_icon.nav_menu_item_icon-picture
        li.nav_menu_item
          nuxt-link(to='/').nav_menu_item_link
            font-awesome-icon(icon='home').nav_menu_item_icon
        li.nav_menu_item
          span(@click='logout()').nav_menu_item_link
            font-awesome-icon(icon='sign-out-alt').nav_menu_item_icon
            span.nav_menu_item_label &nbsp;ログアウト
      span(v-if='!sessionData')
        li.nav_menu_item
          nuxt-link(to='/login').nav_menu_item_link
            font-awesome-icon(icon='sign-in-alt').nav_menu_item_icon
            span.nav_menu_item_label &nbsp;ログイン
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      isLoggedin: 'session/isLoggedIn',
      sessionData: 'session/data'
    })
  },
  mounted() {
    this.unchi = true
  },
  methods: {
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
  background-color: #ffffff;
  border-bottom: 1px solid #e3e3e3;

  @media screen and (max-width: 600px) {
    margin-bottom: 15px;
  }

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
