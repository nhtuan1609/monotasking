<template>
  <v-layout fill-height>
    <div class="error__wrap">
      <div class="error__oops">Oops!</div>
      <template v-if="error.statusCode === 404">
        <v-img class="error__image" src="/images/errors/error-404.jpg" alt="error-404" width="300" height="300"></v-img>
        <div class="error__type">{{ pageNotFound }}</div>
        <div class="error__description">The page you requested could not be found</div>
      </template>
      <template v-else>
        <v-img
          class="error__image"
          src="/images/errors/error-others.jpg"
          alt="error-404"
          width="300"
          height="300"
        ></v-img>
        <div class="error__type">{{ otherError }}</div>
        <div class="error__description">Something went wrong with the page you requested</div>
      </template>
      <v-btn class="mt-4" height="40" width="200p" elevation="0" color="primary" @click="$router.push('/')"
        >Go home</v-btn
      >
    </div>
  </v-layout>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  },
  head() {
    const title = this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style scoped lang="scss">
.error__wrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  width: 100%;
  height: 100%;

  & .error__oops {
    font-size: 40px;
    font-weight: bold;
  }

  & .error__image {
    flex: none;
  }

  & .error__type {
    font-size: 32px;
    font-weight: bold;
    color: var(--color-error);
  }

  & .error__description {
    font-size: 18px;
    margin: 12px 0;
  }
}
</style>
