<template>
  <div class="card">
    <v-img src="/images/calendar.png" alt="calendar" aspect-ratio="1" width="100" class="mx-auto my-6"></v-img>
    <h2 class="text-center mb-4">Wondering where your tasks are?</h2>
    <span class="text-center">Any tasks you didn't complete in My Day last time show up in suggestions pane.</span>
  </div>
</template>

<script>
export default {
  name: 'WonderingCard'
}
</script>

<style lang="scss" scoped>
.card {
  width: 300px;
  height: 340px;
  padding: 10px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  color: white;
  text-align: center;
}
</style>
