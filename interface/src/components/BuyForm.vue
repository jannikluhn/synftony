<template>
  <div>
    <form>
      <div class="field">
        <label class="label">Bar in ABC Notation</label>
        <div class="control">
          <input class="input" type="text" placeholder="" v-model="abcInput" />
        </div>
        <p v-if="!preValidationPassed" class="help is-danger">Invalid input</p>
        <p
          v-if="preValidationPassed && !postValidationPassed"
          class="help is-danger"
        >
          Invalid input 2
        </p>
      </div>

      <div class="field">
        <label class="label">Preview</label>

        <div class="control">
          <div ref="preview"></div>
        </div>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button class="button is-primary">Play Preview</button>
        </div>

        <div class="control">
          <button class="button is-primary">Buy</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import abcjs from "abcjs";
import { preValidationRegex, validateTunes } from "../utils.js";

export default {
  name: "BuyForm",
  data() {
    return {
      abcInput: "",
      tunes: null,
    };
  },

  computed: {
    preValidationPassed() {
      return preValidationRegex.test(this.abcInput);
    },
    renderedABC() {
      if (!this.preValidationPassed) {
        return null;
      }
      return ["M: 4/4\n", this.abcInput, "|"].join("");
    },
    postValidationPassed() {
      if (!this.tunes) {
        return null;
      }
      return validateTunes(this.tunes);
    },
  },

  mounted() {
    this.renderABC();
  },

  watch: {
    abcInput() {
      this.renderABC();
    },
  },

  methods: {
    renderABC() {
      this.tunes = abcjs.renderAbc(this.$refs.preview, this.renderedABC || "");
    },
  },
};
</script>
