<template>
  <div>
    <p v-if="hasError">用户名错误或不存在</p>
    <!-- your login form here -->
  </div>
</template>

<script>
export default {
  computed: {
    hasError() {
      // check if the route has query 'error'
      return this.$route.query.error;
    }
  }
}
</script>