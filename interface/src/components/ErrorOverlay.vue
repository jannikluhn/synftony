<template>
  <div class="is-overlay columns mt-4 mr-4">
    <div class="column is-one-quarter is-offset-three-quarters">
      <ErrorMessage
        v-for="error in errors"
        :message="error.message"
        :key="error.key"
        @closed="onCloseMessage(error.key)"
      />
    </div>
  </div>
</template>

<script>
import ErrorMessage from "./ErrorMessage.vue";
import { addErrorCallback } from "../errors.js";

export default {
  name: "ErrorOverlay",
  components: {
    ErrorMessage,
  },

  data() {
    return {
      errors: [],
      errorCounter: 0,
    };
  },

  created() {
    addErrorCallback(this.onError);
  },

  methods: {
    onError(message, error) {
      if (error.message !== undefined) {
        message = message + ": " + error.message;
      }

      this.errors.push({
        key: this.errorCounter,
        message: message,
      });
      this.errorCounter++;
    },

    onCloseMessage(key) {
      const index = this.errors.map((e) => e.key).indexOf(key);
      this.errors.splice(index, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.is-overlay {
  pointer-events: none;
}
</style>
