<template>
  <v-list light dense>
    <v-list-item-group :value="labelIndex">
      <v-list-item @click="changeLabel(task)">
        <v-icon size="10" class="mr-2">mdi-cancel</v-icon>
        <v-list-item-title>No label</v-list-item-title>
      </v-list-item>

      <v-list-item v-for="(label, index) in labels" :key="index" @click="changeLabel(task, label)">
        <v-avatar :color="label.color" size="10" class="mr-2"></v-avatar>
        <v-list-item-title>
          {{ label.name }}
        </v-list-item-title>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
export default {
  name: 'LabelSelectMenu',
  props: {
    labels: {
      type: Array,
      required: true
    },
    task: {
      type: Object,
      required: true
    }
  },
  computed: {
    labelIndex() {
      if (!this.task?.label?.id) return 0
      return this.labels.findIndex((label) => label.id === this.task.label.id) + 1
    }
  },
  methods: {
    changeLabel(task, label = {}) {
      this.$store.dispatch('tasks/changeLabel', { task, label })
      this.$emit('selected')
    }
  }
}
</script>

<style></style>
