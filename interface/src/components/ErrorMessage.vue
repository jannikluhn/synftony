<template>
  <div class="message is-danger">
    <div class="message-header">
      <p>Error</p>
      <button class="delete" aria-label="delete" @click="$emit('closed')"></button>
    </div>
    <div class="message-body">
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ErrorMessage",
  props: ["message"],
}
</script>

<style lang="scss" scoped>
.message {
  pointer-events: auto;
}
</style>