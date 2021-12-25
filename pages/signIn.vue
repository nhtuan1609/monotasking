<template>
  <v-layout fill-height class="justify-center align-center">
    <div class="form">
      <div class="form__title">
        <span>Sign in</span>
        <v-btn height="48px" elevation="0" text rounded @click="$router.push('/signUp')">Sign up</v-btn>
      </div>

      <div v-if="isShowErrorMessage" class="form__error-message">
        Error: The email or password that you've entered is incorrect!
      </div>

      <v-text-field v-model="email" type="text" placeholder="Email" filled color="white">
        <template #prepend-inner>
          <v-icon size="22" left>mdi-email-outline</v-icon>
        </template>
      </v-text-field>
      <v-text-field
        v-model="password"
        :type="isShowPassword ? 'text' : 'password'"
        placeholder="Password"
        filled
        color="white"
      >
        <template #prepend-inner>
          <v-icon size="22" left>mdi-lock-outline</v-icon>
        </template>
        <template #append>
          <v-icon size="22" left @click="isShowPassword = !isShowPassword">{{
            isShowPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
          }}</v-icon>
        </template>
      </v-text-field>

      <div class="form__button">
        <v-btn min-width="200px" height="48px" elevation="0" color="primary" rounded @click="login">Sign in</v-btn>
      </div>
    </div>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      isShowPassword: false,
      isShowErrorMessage: false
    }
  },
  watch: {
    email() {
      this.isShowErrorMessage = false
    },
    password() {
      this.isShowErrorMessage = false
    }
  },
  methods: {
    login() {
      this.$store.dispatch('profile/login', { email: this.email, password: this.password }).then((isSuccess) => {
        if (!isSuccess) {
          this.isShowErrorMessage = true
        }
        this.$router.push('/myTasks/list')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  width: 600px;
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(2px);
  padding: 20px 40px;
  border-radius: 4px;
  .form__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 30px;
    font-weight: bold;
    color: var(--color-white);
    margin: 20px 0;
  }
  .form__error-message {
    margin: 20px 0;
    font-size: 16px;
    font-weight: bold;
    color: var(--color-error);
    background-color: var(--color-error-background);
    padding: 10px;
    text-align: left;
    border-radius: 4px;
  }
  .form__button {
    display: flex;
    justify-content: flex-end;
    margin: 20px 0;
  }
}
</style>
