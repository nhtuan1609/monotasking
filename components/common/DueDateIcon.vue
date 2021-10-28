<template>
  <v-icon v-if="icon" v-bind="$attrs" :color="icon.color">{{ icon.type }} </v-icon>
</template>

<script>
export default {
  name: 'DueDateIcon',
  props: {
    dueDate: {
      type: String,
      default: ''
    }
  },
  computed: {
    icon() {
      if (!this.dueDate) return undefined
      const currentDate = new Date()
      const date = new Date(this.dueDate)
      const diffDate = Math.trunc((date.getTime() - currentDate.getTime()) / (1000 * 3600 * 24))
      if (diffDate >= 3) return { type: 'mdi-calendar' }
      if (diffDate >= 0) return { type: 'mdi-calendar', color: 'orange' }
      return { type: 'mdi-calendar', color: 'red' }
    }
  }
}
</script>
