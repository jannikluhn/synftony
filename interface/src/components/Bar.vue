<template>
  <div>
    <div ref="target"></div>
  </div>
</template>

<script>
import abcjs from "abcjs";
import {
  placeholderBarABC,
  validateABC,
  validateTunes,
  decorateBarABC,
} from "../abc.js";

const renderOptions = {
  staffwidth: 160,
};

export default {
  name: "Bar",
  props: ["bar"],

  data() {
    return {
      mounted: false,
    };
  },

  mounted() {
    this.mounted = true;
    this.renderBar();
  },

  watch: {
    bar: "renderBar",
  },

  methods: {
    renderBar() {
      if (!validateABC(this.bar.abc).valid) {
        this.handleInvalidABC();
        return;
      }
      const tunes = abcjs.renderAbc(
        this.$refs.target,
        decorateBarABC(this.bar.abc),
        renderOptions
      );
      if (!validateTunes(tunes).valid) {
        this.handleInvalidABC();
        return;
      }
      this.$emit("validated", this.bar.id, true);
    },

    handleInvalidABC() {
      this.$emit("validated", this.bar.id, false);
      abcjs.renderAbc(
        this.$refs.target,
        decorateBarABC(placeholderBarABC),
        renderOptions
      );
    },
  },
};
</script>
