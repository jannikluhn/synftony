<template>
  <div class="error-overlay-parent">
  <div class="my-overlay">
    <ErrorMessage v-for="(error, index) in errors" :message="error" :key="index" />
  </div>
  </div>
</template>

<script>
import ErrorMessage from "./ErrorMessage.vue";

export default {
  name: "ErrorOverlay",
  components: {
    ErrorMessage,
  },
  data() {
    return {
      errors: []
    }
  }
};
</script>

<style scoped>
  div .parent {
    position: relative;
  }
  div .my-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 2;
  }
</style>
