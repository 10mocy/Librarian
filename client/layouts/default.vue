<template>
  <div>
    <nuxt/>
  </div>
</template>

<script>
export default {
  created() {
    const session = this.$store.state.session
    console.log(session)
    if (!session.token || !session.data) {
      this.$router.replace('/login')
    }
  }
}
</script>
<style>
html {
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

*,
*:before,
*:after {
  transition: all 50ms linear;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-weight: normal;
  font-size: 18px;
  border: none;
  text-decoration: none;
  background-color: rgba(255, 255, 255, 0);
  list-style: none;
}

*:focus {
  outline: none;
}
</style>
