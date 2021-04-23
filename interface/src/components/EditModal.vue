<template>
  <div class="modal" :class="{'is-active': true}">
    <div class="modal-background" @click="close"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Edit Bar {{ barID }}</p>
      </header>

      <section class="modal-card-body">
        <form>
          <div class="field">
            <label class="label">Notes in ABC notation</label>
            <input class="input" type="text" placeholder="" v-model="abcInput">
            <p v-if="!inputErrorMessage" class="help is-success">Valid input</p>
            <p v-else class="help is-danger">{{ inputErrorMessage }}</p>
          </div>
          <div class="field">
            <div class="label">Preview</div>
            <div ref="target"></div>
            <div :id="controllerDomID"></div>
          </div>

          <div v-if="error" class="message is-danger">
            <div class="message-body">
              <p>{{ error }}</p>
            </div>
          </div>
        </form>
      </section>

      <footer class="modal-card-foot">
        <button class="button is-primary" @click="edit" :class="{'is-loading': waiting}" :disabled="editButtonDisabled">Edit</button>
        <button class="button" @click="close">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script>
import abcjs from "abcjs";


const visualOptions = {
  displayLoop: true,
  displayRestart: false,
  displayPlay: true,
  displayProgress: true,
  displayWarp: false,
};

import {
  validateABC,
  validateTunes,
  decorateBarABC,
  getValidationErrorMessage,
} from "../abc.js";

const renderOptions = {
  staffwidth: 320,
};

export default {
  name: "EditModal",
  props: ["account", "barID", "previousABC"],

  data() {
    return {
      abcInput: "",
      abcChecks: null,
      tuneChecks: null,
      waiting: false,
      synthController: null,
      mounted: false,
      error: null,
    }
  },

  computed: {
    controllerDomID() {
      return "abcjs-player-".concat(this._uid);
    },
    inputErrorMessage() {
      if (!this.abcChecks) {
        return null
      }
      return getValidationErrorMessage(this.abcChecks, this.tuneChecks);
    },
    editButtonDisabled() {
      return this.waiting || this.inputErrorMessage || this.abcInput == this.previousABC;
    },
  },

  watch: {
    previousABC: {
      immediate: true,
      handler() {
        this.abcInput = this.previousABC;
      },
    },

    abcInput: {
      immediate: true,
      handler() {
        this.renderAndValidatePreview();
      },
    },
  },

  mounted() {
    this.mounted = true;
    this.renderAndValidatePreview();
  },

  methods: {
    close() {
      this.$emit("closed");
    },
    renderAndValidatePreview() {
      const tunes = abcjs.renderAbc(
        this.$refs.target,
        decorateBarABC(this.abcInput),
        renderOptions
      );

      this.abcChecks = validateABC(this.abcInput);
      if (this.abcChecks.valid) {
        this.tuneChecks = validateTunes(tunes);
      } else {
        this.tuneChecks = null
      }
      
      if (this.mounted) {
        this.synthController = new abcjs.synth.SynthController();
        this.synthController.load("#".concat(this.controllerDomID), {}, visualOptions);
        this.synthController.disable(true);
        this.synthController.setTune(tunes[0], false, {});
      }
    },
    async edit() {
      if (this.editButtonDisabled) {
        return
      }

      this.error = null;
      this.waiting = true;
      let tx;
      try {
        const signer = this.$provider.getSigner(this.account)
        const contract = this.$contract.connect(signer)
        tx = await contract.changeBar(
          this.barID,
          this.abcInput,
        )
      } catch (error) {
        this.error = 'Failed to send edit transaction: ' + error.message;
        this.waiting = false
        return
      }

      try {
        await tx.wait()
      } catch (error) {
        this.error = 'Edit transaction failed: ' + error.message;
        this.waiting = false;
        return
      }

      this.waiting = false;
      this.close();
    },
  }
};
</script>
