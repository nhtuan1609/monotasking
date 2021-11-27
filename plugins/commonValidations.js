import Vue from 'vue'

Vue.prototype.$rules = {
  required: (value) => !!value || 'Required input'
}
