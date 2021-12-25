import Vue from 'vue'

Vue.prototype.$rules = {
  required: (value) => !!value || 'Required input.',
  email: (value) =>
    !value || /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value) || 'Please enter valid email address.',
  password: (value) => value.length >= 6 || 'The password must be at least 6 characters long.',
  confirmPassword: (value1, value2) => () => value1 === value2 || 'The confirm password is incorrect.'
}
